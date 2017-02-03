// Importar os módulos
var config = require('./config.js');
var log = require('./core/log.js');
var profit = require('./core/profit.js');
var advice = require('./core/advice.js');
var exchange = require('./exchanges/' + config.watch.exchange + '.js');

var EMASMA = require('./indicators/emasma.js')

//Comandos de tela
process.stdout.write('\x1Bc'); 		//Limpar tela de console
process.title = '[POLONIEX BOT]';	//Adicionar titulo ao projeto

// Mandar mensagem indicando inicialização do BOT
log.info('start', "O BOT foi iniciado. Estou analisando mercado agora...");

function manipularOrdens() {
	log.info('debug', "manipularOrdens >> started");
	
	// Selecionar os close dos candlesticks
	var candles = exchange.getCandles();
	
	//Se EMASMA: true
	var buyable = EMASMA.calculate(candles);
	log.info('debug', "manipularOrdens >> buyable: "+buyable);

	
	if ( advice.buyOrderId == 0 && advice.sellOrderId == 0) { 
		log.info('debug', "manipularOrdens >> Não existe nenhuma ordem aberta");

		if (buyable == true) {
			advice.opt('buy');			
		}
	}


	if( advice.buyOrderId != 0 && advice.sellOrderId == 0) {
		log.info('debug', "manipularOrdens >> A ordem de compra está aberta e a ordem de venda fechada");
		
		if ( !exchange.isOpen(advice.buyOrderId)) {
			log.info('debug', "manipularOrdens >> A ordem de compra já foi finalizda");
			log.info('debug', "manipularOrdens >> sellOrderId: " +advice.sellOrderId + " buyOrderId: "+ advice.buyOrderId);
			log.info('debug', "manipularOrdens >> criar uma ordem de venda com saldo em btc");
			
			advice.buyOrderId = 0;
			advice.opt('sell');
		}
	}
	
	if( advice.sellOrderId != 0 && advice.buyOrderId == 0) {
		log.info('debug', "manipularOrdens >> Ambas ordens já foram abertas");
		
		if ( !exchange.isOpen(sellOrderId)) {
			log.info('debug', "manipularOrdens >> Orderm de venda fechada");
			log.info('info', "manipularOrdens >> Trade efetuado com sucesso");
			
			sellOrderId = 0;
			buyOrderId = 0;
		}
	}
}


function checkAccount(){
log.info('debug', "checkAccount >> started");
	
	var showProfitTime = 1800000; //30 min
	var runStopLossTime = 10000; //10 seg
	var runTraderTime = 15000; // 15 seg
	
	advice.updateBalance();
	
	log.info('info', "Saldo em " + config.watch.currency + ": " + advice.currency);
	log.info('info', "Saldo em " + config.watch.asset + ":  " + advice.asset);
	profit.init(advice.currency, advice.asset);
	
	//Imprime de 30 em 30 minutos o saldo
	setInterval(function(){
		log.info('info', "Saldo em " + config.watch.currency + ": " + advice.currency);
		log.info('info', "Saldo em " + config.watch.asset + ":  " + advice.asset);
		profit.init(advice.currency, advice.asset);
	},showProfitTime);
	
	// caso ele tenha saldo começar a manipular as ordens
	setInterval(function c(){ manipularOrdens(); return c; }()  , runTraderTime);
	
	//Rodar o stop loss para verificar ordens de compra em aberto
	//Cancelar ordens fora de preço de mercado
	setInterval(function(){
		advice.stopLoss();
	},runStopLossTime);
}



if (exchange.config.trader.enabled){

	exchange.setCredential(config.trader.key, config.trader.secret);
	exchange.setPair(config.watch.currency + '_' + config.watch.asset);
	
	var check = setInterval(
		function() {
			if(!exchange.lastPrice() > 0) {
				log.info('warn', "Recebendo informações de preço ...");
			}
			else if( !(exchange.getCandles().length > 0)) {
				log.info('warn', "Recebendo informações de candlesticks ...");
			}
			
			else if(!(exchange.balanceVal[exchange.config.watch.currency] > 0)) {
				log.info('warn', "Recebendo informações da sua conta ...");
			}
			else {
				checkAccount()
				clearInterval(check);
			}	
		}, 10000)	
} else {
	log.info('error', "Trader inativo. Edite config.js para trader.enable: true");
}

