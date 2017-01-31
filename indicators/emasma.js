/* 
 * Carregar EMA/SMA da biblioteca technicalindicators
 */
const smaInd = require('technicalindicators').SMA;
const emaInd = require('technicalindicators').EMA;
const config = require("../config.js").EMASMA;

/*
 * Essa função serve pra calcular o EMA e SMA
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
	var line2 = []
	// calcular os períodos
	var sma = new smaInd({
		period: config.sma,
		values: prices
	})
	prices.forEach(price => {
		var result = sma.nextValue(price);
		if (result) {
			// adicionar short ao line1
			line1.push(result)
		}
	});
	// calcular os períodos
	var ema = new emaInd({
		period: config.ema,
		values: prices
	})
	prices.forEach(price => {
		var result = ema.nextValue(price);
		if (result) {
			// adicionar long ao line2
			line2.push(result)
		}
	});
	// pegar últimos valores short/long
	var lastsma = line1[line1.length - 1]
	var lastema = line2[line2.length - 1]
	
	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	var trend = config.thresholds.max > (lastema / lastsma) && (lastema / lastsma) > config.thresholds.min;

	return trend;
}
