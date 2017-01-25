var config = {};

// Monitor the live market
config.watch = {
  currency: 'USDT',
  asset: 'BTC'
}

config.tradingAdvisor = {
  candleSize: 60,
  historySize: 25
}

config.DEMA = {
  short: 10,
  long: 21,
  thresholds: {
    down: -0.025,
    up: 0.025
  }
};

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

config.trader = {
  enabled: false,
  key: 'xxxxxxxxxxxxxxxxxxx',
  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}

module.exports = config;
