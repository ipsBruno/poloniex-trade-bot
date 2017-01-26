/* 
 * Carregar SMA da biblioteca technicalindicators
 */
const technicalindicators = require('technicalindicators').SMA;
/*
 * Configurar os valores indicadores 
 * Para o método SMA
 * @short/long: periodos
 * @thresholds: valores para considerar buy/sell. 
 * Qualquer valor acima de 0.9 indica uma alta. Valores muito acima de 1.5 indicam uma queda de correção
 */
const config = {
	short: 7,
	long: 21,
	thresholds: {
		min: 0.9,
		max: 1.5
	}
};
/*
 * Essa função serve pra calcular o MACD
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
	var sma = new technicalindicators({
		period: config.short,
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
	var sma = new technicalindicators({
		period: config.long,
		values: prices
	})
	prices.forEach(price => {
		var result = sma.nextValue(price);
		if (result) {
			// adicionar long ao line2
			line2.push(result)
		}
	});
	// pegar últimos valores short/long
	var lastshort = line1[line1.length - 1]
	var lastlong = line2[line2.length - 1]
	
	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	var trend = config.thresholds.max > (lastshort / lastlong) && (lastshort / lastlong) > config.thresholds.min;
	
	if (trend) {
		console.log('\033[37m [SMA] Detectando tendencia de alta | max: %s | min: %s | lastshort/lastlong: %s',config.thresholds.max ,config.thresholds.min,lastshort/lastlong);
	} else {
		console.log('\033[37m [SMA] Detectando tendencia de baixa | max: %s | min: %s | lastshort/lastlong: %s',config.thresholds.max ,config.thresholds.min,lastshort/lastlong);
	}

	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	return trend;
}
