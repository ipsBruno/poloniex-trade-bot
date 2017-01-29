/* 
 * Carregar RSI da biblioteca technicalindicators
 */
const technicalindicators = require('technicalindicators').RSI;
const config = require("../config.js").RSI;

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

	var trend = config.thresholds.max >line1[line1.length - 1] && line1[line1.length - 1] > config.thresholds.min;
	
	if (trend) {
		console.log('\033[37m[Info] Detectando tendencia de alta para RSI |  max: %s | min: %s | rsi: %s',config.thresholds.max ,config.thresholds.min, line1[line1.length - 1]);
	} else {
		console.log('\033[37m[Info] Detectando tendencia de baixa para RSI | max: %s | min: %s | rsi: %s',config.thresholds.max ,config.thresholds.min, line1[line1.length - 1]);
	}

	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	return trend;
}
