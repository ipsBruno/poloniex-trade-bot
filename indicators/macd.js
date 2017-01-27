
/*
* Carregar MACD da biblioteca technicalindicators
*/
const technicalindicators = require('technicalindicators').MACD;
const config = require("../config.js").MACD;

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
