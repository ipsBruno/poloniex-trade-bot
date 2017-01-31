// Importar os módulos
var config = require('./config.js');
var log = require('./core/log.js');
var profit = require('./core/profit.js');
var BOT = require('./exchanges/' + config.watch.exchange + '.js');

var EMASMA = require('./indicators/emasma.js')

//Comandos de tela
process.stdout.write('\x1Bc'); 		//Limpar tela de console
process.title = '[POLONIEX BOT]';	//Adicionar titulo ao projeto

// Mandar mensagem indicando inicialização do BOT
log.info('start', "O BOT foi iniciado. Estou analisando mercado agora...");

var buyOrderId = -1;
var sellOrderId = -1;

var sellPrice;
var buyPrice;

function manipularOrdens() {
	log.info('debug', "manipularOrdens >> started");
	
	// Selecionar os close dos candlesticks
	var candles = BOT.getCandles();
	
	//Se EMASMA: true
	var buyable = EMASMA.calculate(candles);
	log.info('debug', "manipularOrdens >> buyable: "+buyable);

	
	if ( buyOrderId == -1 && sellOrderId == -1) { 
		log.info('debug', "manipularOrdens >> Não existe nenhuma ordem aberta");

		if (buyable == true) {

			// remover 0.1% p/ comprar
			buyPrice = parseFloat(BOT.rempercent(parseFloat(BOT.pairTicker.highbid), 0.1));
			buyPrice = buyPrice.toFixed(3);
			log.info('debug', "manipularOrdens >> buyPrice: "+ buyPrice);

			// adicionar 0.4% pra vender
			sellPrice = parseFloat(BOT.addpercent(parseFloat(BOT.pairTicker.lowask), 0.2));
			sellPrice = sellPrice.toFixed(3);
			log.info('debug', "manipularOrdens >> sellPrice: "+ sellPrice);

			buyOrderId = 0
			log.info('debug', "manipularOrdens >> buyOrderId: "+ buyOrderId);

			// ajustar as fee
			bitcoinsVal =  parseFloat(BOT.rempercent(parseFloat(BOT.config.trader.value/buyPrice), 0.25));
			bitcoinsVal = bitcoinsVal.toFixed(8);
			log.info('debug', "manipularOrdens >> bitcoinsVal: "+ bitcoinsVal);

			BOT.buycoin(buyPrice, BOT.config.trader.value/buyPrice, function(err, data) {

					if(err){
						buyOrderId = -1
						log.info('error', "manipularOrdens >> " + err);
						return false
					}
					

					buyOrderId = data.orderNumber
					
					log.info('debug', "manipularOrdens >> buyOrderId: " + buyOrderId + " price: " + buyPrice + " bitcoinsVal: " + bitcoinsVal);
					log.info('trade', "manipularOrdens >> Preço: "+buyPrice+" | Qtd: " + bitcoinsVal);
			})				
		}
	}


	if( buyOrderId > 0 && sellOrderId == -1) {
		log.info('debug', "manipularOrdens >> A ordem de compra está aberta e a ordem de venda fechada");
		
		if ( !BOT.isOpen(buyOrderId)) {
			log.info('debug', "manipularOrdens >> A ordem de compra já foi finalizda");
			

			sellOrderId = 0
			buyOrderId = 0
			log.info('debug', "manipularOrdens >> sellOrderId: " + sellOrderId + " buyOrderId: "+ buyOrderId);
			
			log.info('debug', "manipularOrdens >> criar uma ordem de venda com saldo em btc");
			BOT.sellcoin(parseFloat(BOT.addpercent(parseFloat(sellPrice), 0.25)).toFixed(2), bitcoinsVal, function(err, data) {

					if(err){
						sellOrderId = -1
						buyOrderId = 1
						log.info('error', "manipularOrdens >> " + err);
						return false
							
					}
					
					sellOrderId = data.orderNumber

					log.info('debug', "manipularOrdens >> sellOrderId: " + sellOrderId + " price: " + sellPrice + " bitcoinsVal: " + bitcoinsVal);
					log.info('trade', "manipularOrdens >> Preço: "+sellPrice+" | Qtd: "+ bitcoinsVal);
			})	
		}
	}
	
	if( sellOrderId > 0 && buyOrderId == 0) {
		log.info('debug', "manipularOrdens >> Ambas ordens já foram abertas");
		
		if ( !BOT.isOpen(sellOrderId)) {
			log.info('debug', "manipularOrdens >> Orderm de venda fechada");
			
			log.info('info', "manipularOrdens >> Trade efetuado com sucesso");
			sellOrderId = -1
			buyOrderId = -1
		}
	}
}



function checkAccount(){
	
	var currency = BOT.balance(BOT.config.watch.currency)
	var asset = BOT.balance(BOT.config.watch.asset)
	


	if( currency <  BOT.config.trader.value) {
		return log.info('debug', "checkAccount >> Você não tem o mínimo  para Trades | MIN "+BOT.config.watch.currency+": " +BOT.config.trader.value );
	}

	log.info('info', "Saldo em "+BOT.config.watch.currency+": "+currency);
	log.info('info', "Saldo em "+BOT.config.watch.asset+":  " + asset);
	
	profit.init(currency, asset);
	
	//Imprime de 30 em 30 minutos o saldo
	setInterval(function(){
		log.info('info', "Saldo em " + BOT.config.watch.currency + ": " + currency);
		log.info('info', "Saldo em " + BOT.config.watch.asset + ":  " + asset);
		profit.info(currency, asset);
	},1800000);
	
	// caso ele tenha saldo começar a manipular as ordens
	setInterval( function c(){ manipularOrdens(); return c; }()  , 15000 )
}



if (BOT.config.trader.enabled){

	BOT.setCredential(BOT.config.trader.key, BOT.config.trader.secret);
	BOT.setPair(BOT.config.watch.currency + '_' + BOT.config.watch.asset);
	
	var check = setInterval(
		function() {
			if(!BOT.lastPrice() > 0) {
				log.info('warn', "Recebendo informações de preço ...");
			}
			else if( !(BOT.getCandles().length > 0)) {
				log.info('warn', "Recebendo informações de candlesticks ...");
			}
			
			else if(!(BOT.balanceVal[BOT.config.watch.currency] > 0)) {
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

