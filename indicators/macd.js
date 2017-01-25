
/*
* Carregar MACD da biblioteca technicalindicators
*/

const technicalindicators = require('technicalindicators').MACD;


/*
* Configurar os valores indicadores 
* Para o método MACD
* @short/long: periodos
* @signal: signal p/ macd 
* @thresholds: valores para considerar buy/sell
*/

const config = {
  short: 10,
  long: 21,
  signal: 9,
  thresholds: {
    down: -0.025,
    up: 0.025,
    persistence: 1
  }
};

/*
 * Essa função serve pra calcular o MACD
 * @valArr: valores de entrada
 * @config: configuração para macd
 */
exports.calculate = function(valArr) {
	var macdInput = {
		values: valArr,
		fastPeriod: config.short,
		slowPeriod: config.long,
		signalPeriod: config.signal,
		SimpleMAOscillator: false,
		SimpleMASignal: false
	}
	return technicalindicators.calculate(macdInput);
}
