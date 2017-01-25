// Habilitar modo estrito do Javascript
"use strict";

// Importar os módulos
var bot = require('./core.js')
var trader = bot.config.trader;

var init = function(){
	bot.balance(function(err, currency, asset){
		console.log("Iniciando o Bot");
		if (err) {
	 		return console.log(err)
	 	}
		
		console.log("Saldo em %s: %s ", bot.config.watch.currency ,currency);
		console.log("Saldo em %s: %s ", bot.config.watch.asset ,asset);

		
		bot.lastPrice(function(pair, data){
			
			console.log();
			
			if (isUpTrend(pair, data)) {
				console.log("Last price %s: %s | Tendencia de alta - Buy: true | Sell: false", pair, data);	
			} else {
				console.log("Last price %s: %s | Tendencia de baixa - Buy: false | Sell: true", pair, data);
			}
		});	
	});
}


var isUpTrend = function(pair, last){
	if (last > 900) true;
	else false;
}

if (trader.enabled == true){
	bot.setCredential(bot.config.trader.key, bot.config.trader.secret);
	bot.setPair(bot.config.watch.currency + '_' + bot.config.watch.asset);
	init();
} else {
	console.log("Trader inativo > config.js > trader.enable: false");
}



