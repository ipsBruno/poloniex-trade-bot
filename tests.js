// Importar os módulos
var config = require('./config.js');
var BOT = require('./exchanges/' + config.watch.exchange + '.js');

var SMA = require('./indicators/sma.js')
var MACD = require('./indicators/macd.js')
var RSI = require('./indicators/rsi.js')
var EMASMA = require('./indicators/emasma.js')



//Limpar tela de console
process.stdout.write('\x1Bc');


//Adicionar titulo ao projeto
process.title = '[POLONIEX BOT]'


// Mandar mensagem indicando inicialização do BOT
console.log("\033[35m[Info] O BOT foi iniciado. Estou analisando mercado agora...")

var buyOrderId = -1
var sellOrderId = -1

var sellPrice 
var buyPrice 

var debug = false

///Testando função para utilizar indicadores em conjunto
//TODO: Contruir lógica para utilização dos indicadores ativos
//TODO: Incluir uma configuração de enable no config para cada indicador
function calculate(candles){
	var upSMA, upMACD, upRSI, upEMASMA;
	
	console.log(upSMA, upMACD, upRSI, upEMASMA);
	
	if (config.SMA.enable = true) upSMA = SMA.calculate(candles);
	if (config.MACD.enable = true) upMACD = MACD.calculate(candles);
	if (config.RSI.enable = true) upRSI = RSI.calculate(candles);
	if (config.EMASMA.enable = true) upEMASMA = EMASMA.calculate(candles);
	
	console.log(upSMA, upMACD, upRSI, upEMASMA);
}


function manipularOrdens() {
		// Selecionar os close dos candlesticks
		var candles = BOT.getCandles()

		// Enviar os closes para calcular o SMA
		//TODO: Montar uma lógica para ativar e desativar os indicadores pelo config.js
		//var buyable = SMA.calculate(candles)
		//var buyable = MACD.calculate(candles)
		//var buyable = RSI.calculate(candles)
		var buyable = EMASMA.calculate(candles)
		
		//TODO:Validar função
		//calculate(candles);
		
		//var buyable = true

		// Caso não estiver nenhuma ordem aberta
		if ( buyOrderId == -1 && sellOrderId == -1) { 

			if (buyable == true) {

				// remover 0.1% p/ comprar
				buyPrice = parseFloat(BOT.rempercent(parseFloat(BOT.pairTicker.highbid), 0.1))
				buyPrice = buyPrice.toFixed(3)

				// adicionar 0.4% pra vender
				sellPrice = parseFloat(BOT.addpercent(parseFloat(BOT.pairTicker.lowask), 0.2))
				sellPrice = sellPrice.toFixed(3)

				buyOrderId = 0

				// ajustar as fee
				bitcoinsVal =  parseFloat(BOT.rempercent(parseFloat(BOT.config.trader.value/buyPrice), 0.25))
				bitcoinsVal = bitcoinsVal.toFixed(8)

				BOT.buycoin(buyPrice, BOT.config.trader.value/buyPrice, function(err, data) {

						if(err){
							buyOrderId = -1
							if(debug) console.log("\033[31mBuyError", err)
							return false
						}
						

						buyOrderId = data.orderNumber

						console.log("\033[32mComprando\033[37m | Preço: " + buyPrice );
				})				
			}
		}


		// Caso a ordem de compra estiver aberta e a ordem de venda fechada
		if( buyOrderId > 0 && sellOrderId == -1) {

			// caso a ordem de compra já foi finalizda
			if ( !BOT.isOpen(buyOrderId)) {
				

				sellOrderId = 0
				buyOrderId = 0

				// criar uma ordem de venda com saldo em btc
				BOT.sellcoin(parseFloat(BOT.addpercent(parseFloat(sellPrice), 0.25)).toFixed(2), bitcoinsVal, function(err, data) {

						if(err){
							sellOrderId = -1
							buyOrderId = 1
							if(debug) console.log("\033[31mSellError", err)
							return false
								
						}
						
						sellOrderId = data.orderNumber

						console.log("\033[31mVendendo\033[37m | Preço: " + sellPrice );
				})	
			}
		}

		// caso ambas ordens já foram abertas
		if( sellOrderId > 0 && buyOrderId == 0) {
			// verificar se há ordem de venda fechada
			if ( !BOT.isOpen(sellOrderId)) {
					// caso ordem de venda estiver fechada fazer o trade
					console.log("\033[34mTrade efetuado com sucesso\033[37m");
					sellOrderId = -1
					buyOrderId = -1
			}
		}
}



function checkAccount(){
	
	var currency = BOT.balance(BOT.config.watch.currency)
	var asset = BOT.balance(BOT.config.watch.asset)

	if( currency <  BOT.config.trader.value) {
		return console.log("\033[31m[Erro] Você não tem o mínimo  para Trades | MIN %s: %s",BOT.config.watch.currency, BOT.config.trader.value)
	}


	console.log("\033[36m[Info] Saldo em %s: %s ", BOT.config.watch.currency ,currency);
	console.log("\033[36m[Info] Saldo em %s: %s ", BOT.config.watch.asset ,asset);

	// caso ele tenha saldo começar a manipular as ordens
	setInterval( function c(){ manipularOrdens(); return c; }()  , 15000 )
}



if (BOT.config.trader.enabled){

	BOT.setCredential(BOT.config.trader.key, BOT.config.trader.secret);
	BOT.setPair(BOT.config.watch.currency + '_' + BOT.config.watch.asset);
	
	var check = setInterval(
		function() {
			if(!BOT.lastPrice() > 0) {
				console.log("\033[31mRecebendo informações de preço ..."  );
			}
			else if( !(BOT.getCandles().length > 0)) {
				console.log("\033[31mRecebendo informações de candlesticks ..." );
			}
			
			else if(!(BOT.balanceVal[BOT.config.watch.currency] > 0)) {
				console.log("\033[31mRecebendo informações da sua conta ..." );
			}
			else {
				checkAccount()
				clearInterval(check);
			}	
		}, 10000)	
} else {
	console.log("\033[31m[Erro] Trader inativo. Edite config.js para trader.enable: true");
}

