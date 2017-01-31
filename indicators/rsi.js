/* 
 * Carregar RSI da biblioteca technicalindicators
 */
const technicalindicators = require('technicalindicators').RSI;
const config = require("../config.js").RSI;
var log = require('../core/log.js');

exports.rate = "";
exports.max = "";
exports.min = "";
/*
 * Essa função serve pra calcular o RSI
 * @prices: valores de entrada
 */
exports.calculate = function(candles) {

	// pegar apenas o close dos candles
	var prices = []
	for(var i in candles) {
		prices.push(candles[i].close)
	}

	// Criar dois vetores para armazenar os períodos short/long
	var line1 = []

	// calcular os períodos
	var rsi = new technicalindicators({
		period: config.period,
		values: prices
	})
	prices.forEach(price => {
		var result = rsi.nextValue(price);
		if (result) {
			// adicionar short ao line1
			line1.push(result)
		}
	});
	
	exports.rate = line1[line1.length - 1] ;
	exports.max = config.thresholds.max;
	exports.min = config.thresholds.min;
	
	var trend = exports.rate > exports.max || exports.rate < exports.min;
	log.info('debug', "RSI     | rsi: " + exports.rate + "| max: " + exports.max + "| min: " + exports.min);
	
	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	return trend;
}





