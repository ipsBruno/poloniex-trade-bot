var config = {};

config.watch = {
  exchange: 'poloniex',
  currency: 'USDT',
  asset: 'BTC'
}

config.tradingAdvisor = {
  candleSize: 300,  //(candlestick period in seconds; valid values are 300, 900, 1800, 7200, 14400, and 86400),
  historySize:45
}



config.trader = {
		  enabled: false,
		  key: 'xxxxxxxxxx',
		  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
		}

module.exports = config;
