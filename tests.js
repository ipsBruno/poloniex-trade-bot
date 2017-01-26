// Importar os módulos
var BOT = require('./core.js')

var SMA = require('./indicators/sma.js')


//Limpar tela de console
process.stdout.write('\x1Bc');


//Adicionar titulo ao projeto
process.title = '[POLONIEX BOT]'


// Mandar mensagem indicando inicialização do BOT
console.log("\033[35m[Info] O BOT foi iniciado. Estou analisando mercado agora...")

// Valor mínimo em USD para trade (currency)
var mintradeval = 10.0;

var buyOrderId = -1
var sellOrderId = -1

var sellPrice 
var buyPrice 

function manipularOrdens() {

		// Selecionar os close dos candlesticks
		var candles = BOT.getCandles()

		// Enviar os closes para calcular o SMA
		var buyable = SMA.calculate(candles)
		
		//var buyable = true

		// Caso não estiver nenhuma ordem aberta
		if ( buyOrderId == -1 && sellOrderId == -1) { 

			if (buyable == true) {

				// remover 0.1% pra comprar
				buyPrice = BOT.rempercent(BOT.pairTicker.highbid, 0.05)

				// adicionar 0.5% pra vender
				sellPrice = BOT.addpercent(BOT.pairTicker.lowask, 0.5)

				buyOrderId = 0

				BOT.buycoin(buyPrice, mintradeval/buyPrice, function(err, data) {

						if(err){
							buyOrderId = -1
							return console.log("\033[31mBuyError", err)
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

				// remover 0.40% pra ajustar as fee
				BOT.sellcoin(sellPrice, BOT.rempercent(mintradeval/buyPrice, 0.4), function(err, data) {

						if(err){
							sellOrderId = -1
							buyOrderId = 1
							return console.log("\033[31mSellError", err)
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

	if( currency <  mintradeval) {
		return console.log("\033[31m[Erro] Você não tem o mínimo em USD para Trades: %s USD", mintradeval)
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

