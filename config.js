var config = {};

//Configuração de Key e Secret da Exchange
config.trader = {
		value: 10.0,
		enabled: false,
		key: 'xxxxxxxxxx',
		secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
	}

//Configuração da exchange e do Mercado
config.watch = {
	exchange: 'poloniex',
	currency: 'USDT',
	asset: 'BTC'
}

//Configuração do Candle e Histórico
config.tradingAdvisor = {
	candleSize: 300, //(candlestick period in seconds; valid values are 300, 900, 1800, 7200, 14400, and 86400),
	historySize: 45
}

//Configuração dos Indicadores

/*
 * Configurar os valores indicadores 
 * Para o método EMA/SMA
 * @ema/sma: periodos para divisão ema/sma
 * @thresholds: valores para considerar buy/sell. 
 * Qualquer valor acima de 0.9 indica uma alta. Valores muito acima de 1.2 indicam uma queda de correção
 */
config.EMASMA = {
	ema: 10,
	sma: 45,
	thresholds: {
		min: 0.9,
		max: 1.1
	}
};

/*
* Configurar os valores indicadores 
* Para o método MACD
* @short/long: periodos
* @signal: signal p/ macd 
* @thresholds: valores para considerar buy/sell
*/
config.MACD = {
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
 * Configurar os valores indicadores 
 * Para o método RSI
 * @period: periodos
 * @thresholds: valores para considerar buy/sell. 
 * Qualquer valor acima de 70 indica uma baixa. Valores abaixo de 35 indicam alta
 */
config.RSI =  {
	period: 14,
	thresholds: {
		min: 5,
		max: 40
	}
};

/*
 * Configurar os valores indicadores 
 * Para o método SMA
 * @short/long: periodos
 * @thresholds: valores para considerar buy/sell. 
 * Qualquer valor acima de 0.9 indica uma alta. Valores muito acima de 1.5 indicam uma queda de correção
 */
config.SMA =  {
	short: 7,
	long: 21,
	thresholds: {
		min: 0.9,
		max: 1.5
	}
};



module.exports = config;
