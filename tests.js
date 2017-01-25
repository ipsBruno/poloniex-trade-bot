// Importar os módulos
var bot = require('./core.js')

var SMA = require('./indicators/sma.js')


//Limpar tela de console
process.stdout.write('\x1Bc');


//Adicionar titulo ao projeto
process.title = '[POLONIEX BOT]'


// Mandar mensagem indicando inicialização do BOT
console.log("\033[35m[Info] O bot foi iniciado. Estou analisando mercado agora...")


var mintradeval = 10;


var checkAccount = function(){
	
	var currency = bot.balance(bot.config.watch.currency)
	var asset = bot.balance(bot.config.watch.asset)

	if( currency <  mintradeval) {
		return console.log("\033[31m[Erro] Você não tem o mínimo em USD para Trades: %s USD", mintradeval)
	}


	console.log("\033[36m[Info] Saldo em %s: %s ", bot.config.watch.currency ,currency);
	console.log("\033[36m[Info] Saldo em %s: %s ", bot.config.watch.asset ,asset);

	// caso ele tenha saldo começar a manipular as ordens
	setInterval( manipularOrdens , 15000 )
}


var buyOrderId = -1
var sellOrderId = -1

var sellPrice 
var buyPrice 

var manipularOrdens = function() {

		// Selecionar os close dos candlesticks
		var candles = bot.getCandles()

		// Enviar os closes para calcular o SMA
		var buyable = SMA.calculate(candles)

		// Caso não estiver nenhuma ordem aberta
		if ( buyOrderId == -1 && sellPrice == -1) { 
			if (buyable == true && bot.balance(bot.config.watch.currency) > mintradeval) {
				

				buyPrice = bot.lastPrice()-0.20;
				sellPrice = bot.addpercent(bot.lastPrice(), 0.5)

				buyOrderId = 0

				buycoin(buyPrice, mintradeval/buyPrice, function(err, data) {

						if(err){
							buyOrderId = -1
							return console.log("\033[31mBuyError", err)
						}
						
						buyOrderId = data.orderNumber

						console.log("\033[32mComprando\033[37m | Price: " + buyPrice );
				})				
			}
		}


		// Caso a ordem de compra estiver aberta e a ordem de venda fechada
		if( buyOrderId > 0 && sellOrderId == -1) {

			// caso a ordem de compra já foi finalizda
			if ( !bot.isOpen(buyOrderId)) {
				

				sellOrderId = 0
				buyOrderId = 0

				// criar uma ordem de venda com saldo em btc
				sellcoin(sellPrice, bot.balance(bot.config.watch.asset), function(err, data) {

						if(err){
							sellOrderId = -1
							buyOrderId = 1
							return console.log("\033[31mSellError", err)
						}
						
						sellOrderId = data.orderNumber

						console.log("\033[31mVendendo\033[37m | Price: " + sellPrice );
				})	
			}
		}

		// caso ambas ordens já foram abertas
		if( sellOrderId > 0 && buyOrderId == 0) {
			// verificar se há ordem de venda fechada
			if ( !bot.isOpen(sellOrderId)) {
					// caso ordem de venda estiver fechada fazer o trade
					console.log("\033[32mTrade efetuado com sucesso\033[37m");
					sellOrderId = -1
					buyOrderId = -1
			}
		}
}


if (bot.config.trader.enabled){

	bot.setCredential(bot.config.trader.key, bot.config.trader.secret);
	bot.setPair(bot.config.watch.currency + '_' + bot.config.watch.asset);
	
	var check = setInterval(
		function() {
			if(!bot.lastPrice() > 0) {
				console.log("\033[31mRecebendo informações de preço ..."  );
			}
			else if( !(bot.getCandles().length > 0)) {
				console.log("\033[31mRecebendo informações de candlesticks ..." );
			}
			
			else if(!(bot.balanceVal[bot.config.watch.currency] > 0)) {
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

