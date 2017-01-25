exports.poloniexApi = require("plnx")
exports.apiKey = ''
exports.apiSecret = ''
exports.pairTicker = {}
exports.pairTrade = ''
exports.ordersArr = [];
/*
 * Essa função serve pra atualizar as ordens em aberto
 * @return: essa função não emite nenhum retorno  
 */
exports.triggerPrices = function() {
	exports.poloniexApi.push(function(session) {
		session.subscribe("ticker", function(data) {
			if (data[0] == exports.pairTrade) {
				exports.pairTicker = {
					last: data[1],
					lowask: data[2],
					highbid: data[3],
					change: data[4],
					baseVolume: data[5],
					quoteVolume: data[6],
					frozen: data[7],
					high: data[8],
					low: data[9]
				}
			}
		})
	})
}


exports.lastPrice = function(callback) {
	exports.poloniexApi.push(function(session) {
		session.subscribe("ticker", function(data) {
			if (data[0] == exports.pairTrade) {
				callback(exports.pairTrade, data[1]);	
			}
		})
	})
}


/*
 * Essa função serve para pegar o pair atual
 * @return: pair atual
 */
exports.getPair = function() {
	return exports.pairTrade;
}
/*
 * Essa função serve para setar o pair
 * @return: essa função não emite nenhum retorno  
 */
exports.setPair = function(pair) {
	exports.pairTrade = pair
	exports.triggerPrices()
}
/*
 * Essa função serve colocar a api/secret do código
 * @return: essa função não emite nenhum retorno  
 */
exports.setCredential = function(api, key) {
	exports.apiKey = api
	exports.apiSecret = key
	setInterval(function() {
		exports.triggerOrders()
	}, 1500)
}
/*
 * Essa função serve pra atualizar as ordens em aberto
 * @return: essa função não emite nenhum retorno  
 */
exports.triggerOrders = function() {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.openorders(function(err, data) {
		if (err) console.log(err)
		exports.ordersArr = []
		for (var i in data) {
			exports.ordersArr.push(data[i])
		}
	})
	return true
}
/*
 * Função para retornar saldo da conta
 * @callback: chamar uma callback com o resultado (err, pair1, pair2)
 */
exports.balance = function(callback) {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.returnCompleteBalances(
	{
		key: exports.apiKey,
		secret: exports.apiSecret
	}, function(err, data) {
		var pairs = exports.pairTrade.split('_')
		callback(err, data[pairs[0]].available, data[pairs[1]].available)
	})
	return true
}

/*
 *
 * Função para pegar os últimos candles
 * @pair: qual pair para pegar os candles
 * @period: quantos candles retornar
 * @candles: qual tempo para os candles 300 para 5 min etc
 * @callback: retornar todos candles
 *
 */
exports.getCandles = function(pair, period, candles) {
	exports.poloniexApi.returnChartData({
		currencyPair: pair,
		period: candle,
		start: (new Date().getTime() / 1000) - (candles * period),
		end: new Date().getTime()
	}, callback)
	return true
}
/*
 *
 * Função para verificar ordens abertas
 * @callback: chamar uma callback com o resultado
 *
 */
exports.openorders = function(callback) {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.returnOpenOrders(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		currencyPair: exports.pairTrade
	}, function(err, data) {
		callback(err, data)
	})
	return true
}
/*
 * Função para compra de moedas
 * @cotacao: cotação em dólares bitcoin
 * @quantia: quantia de bitcoin a ser comprado
 * @callback: chamar uma callback com o resultado
 */
exports.buycoin = function(cotacao, quantia, callback) {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.buy(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		currencyPair: exports.pairTrade,
		rate: cotacao,
		amount: quantia,
		postOnly: 1
	}, function(err, data) {
		callback(err, data)
	})
	return true
}
/*
 * Função para venda de moedas
 * @cotacao: cotação em dólares bitcoin
 * @quantia: quantia de bitcoin a ser comprado
 * @callback: chamar uma callback com o resultado
 */
exports.sellcoin = function(cotacao, quantia, callback) {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.sell(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		currencyPair: exports.pairTrade,
		rate: cotacao,
		amount: quantia,
		postOnly: 1
	}, function(err, data) {
		callback(err, data)
	})
	return true
}
/*
 * Função: isOpen verifica se a ordem está abert
 *  @orderid: ordem id para ser checado se está aberto
 *  @return: retorna true para ordem aberta false para fechada
 */
exports.isOpen = function(orderid) {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	for (var i in exports.ordersArr) {
		if (exports.ordersArr[i].orderNumber == orderid) {
			return true
		}
	}
	return false
}
/*
 * Função: addpercent
 * @val: valor a ser adicionado porcentagem
 * @percent: quanto de porcentagem adicionar
 */
exports.addpercent = function(val, percent) {
	return val + (val / 100 * percent);
}