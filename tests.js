 // Habilitar modo estrito do Javascript
 "use strict";

 // Importar os módulos
 var bot = require('./core.js')

// Configurar o BOT
bot.setCredential('G0XFH5YY-PB0G5444H-VVKNKKGR', 'f2193fa1057a4ecd2ac738fb220799df304ae60f032b95b17fd25964f4fdee3363cd0c0842967831a2dd028f0f12248e6b5354532628f')
bot.setPair('USDT_BTC')

// Valor para trade
 var minTradeUsd = 10;
 
 // Checar balanço
 bot.balance(function(err, usd, btc) {
 	if (err) {
 		return console.log(err)
 	}
  // Caso não tiver USD na conta não fazer nada
 	if (usd < minTradeUsd) {
 		return console.log("Você precisa ter " + minTradeUsd + ". Mas você tem " + usd + " USDT")
 	}
  // Preço para vender e comprar
 	var cotSell = 924
 	var cotBuy = 916

  // Comprar as moedas
 	var amount = usd / cotBuy
 	bot.buycoin(cotBuy, amount, function(err, data) {
 		if (err) {
 			return console.log(err)
 		}
    // Pegar id da ordem de compra
 		var orderid = data.orderNumber;
 		console.log("ORDER: BUY | RATE: %f | ID: %f | Amount: %f", cotBuy, orderid, amount)

    // Adicionar um timer para checar quando a ordem buy termina
 		setInterval(function() {
 			if (!bot.isOpen(orderid)) {
        // Caso compru os Bitcoins adicionar a ordem de venda
 				bot.sellcoin(cotSell, usd * cotBuy, function(err, data) {
 					if (err) {
 						return console.log(err)
 					}
 					console.log("ORDER: SELL | RATE: %f | ID: %f", cotSell, orderid)
 					var orderid = data.orderNumber;
          
          // Quando terminar a ordem de venda anunciar que o trade foi finalizado
 					setInterval(function() {
 						if (!bot.isOpen(orderid)) {
 							console.log("TRADE EFETUADO")
 						}
 					}, 1000)
 				})
 			}
 		}, 10000)
 	})
 })
