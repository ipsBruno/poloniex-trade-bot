/* 
 * Carregar RSI da biblioteca technicalindicators
 */
const technicalindicators = require('technicalindicators').RSI;
/*
 * Configurar os valores indicadores 
 * Para o método RSI
 * @period: periodos
 * @thresholds: valores para considerar buy/sell. 
 * Qualquer valor acima de 70 indica uma baixa. Valores abaixo de 35 indicam alta
 */
const config = {
	period: 14,
	thresholds: {
		min: 5,
		max: 40
	}
};
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
		console.log('\033[37m [RSI] Detectando tendencia de alta | max: %s | min: %s | rsi: %s',config.thresholds.max ,config.thresholds.min, line1[line1.length - 1]);
	} else {
		console.log('\033[37m [RSI] Detectando tendencia de baixa | max: %s | min: %s | rsi: %s',config.thresholds.max ,config.thresholds.min, line1[line1.length - 1]);
	}

	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	return trend;
}
