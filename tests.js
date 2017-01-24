 // Habilitar modo estrito do Javascript
 "use strict";
 // Importar os módulos
 var bot = require('./core.js')
 // Configurar o BOT
 bot.setCredential('EJNERENM-GPA6LPQS-MRLB3VRQ-66HXJ8XN', '490beb9c7816a94a891781232ae63a64cc9896dbc61db5b68eeba3691c4fd0a99c7957d4158ba7cd70948d84f6beb0dd6004993908c629e5e48e7a30ce4e0f02')
 bot.setPair('USDT_BTC')
 var minTradeUsd = 10;
 bot.balance(function(err, usd, btc) {
 	console.log('aaaaaaaa')
 	if (err) {
 		return console.log(err)
 	}
 	if (usd < minTradeUsd) {
 		return console.log("Você precisa ter " + minTradeUsd + ". Mas você tem " + usd + " USDT")
 	}
 	var cotSell = 924
 	var cotBuy = 916
 	var amount = usd / cotBuy
 	bot.buycoin(cotBuy, amount, function(err, data) {
 		if (err) {
 			return console.log(err)
 		}
 		var orderid = data.orderNumber;
 		console.log("ORDER: BUY | RATE: %f | ID: %f | Amount: %f", cotBuy, orderid, amount)
 		setInterval(function() {
 			if (!bot.isOpen(orderid)) {
 				bot.sellcoin(cotSell, usd * cotBuy, function(err, data) {
 					if (err) {
 						return console.log(err)
 					}
 					console.log("ORDER: SELL | RATE: %f | ID: %f", cotSell, orderid)
 					var orderid = data.orderNumber;
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
