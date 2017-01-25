
/*
* Carregar SMA da biblioteca technicalindicators
*/

const technicalindicators = require('technicalindicators').SMA;


/*
* Configurar os valores indicadores 
* Para o método SMA
* @short/long: periodos
* @thresholds: valores para considerar buy/sell
*/

const config = {
  short: 10,
  long: 21
};

/*
 * Essa função serve pra calcular o MACD
 * @prices: valores de entrada
 */

exports.calculate = function(prices) {

	// Criar dois vetores para armazenar os períodos short/long
	var line1 = []
	var line2 = []

	// calcular os períodos
	var sma = new technicalindicators({period : config.short, values : prices}) 
	prices.forEach(price => {
		var result = sma.nextValue(price);
		if(result) {
			// adicionar short ao line1
			line1.push(result)
		}
	});

	// calcular os períodos
	var sma = new technicalindicators({period : config.long, values : prices}) 
	prices.forEach(price => {
		var result = sma.nextValue(price);
		if(result) {
			// adicionar long ao line2
			line2.push(result)
		}
	});

	// pegar últimos valores short/long
	var lastshort = line1[line1.length-1]
	var lastlong = line2[line2.length-1]

	// caso a tendencia de short é maior que a de long
	// caso for true = tendencia de alta / caso for false tendencia de baixa
	return lastshort/ lastlong ;
}
