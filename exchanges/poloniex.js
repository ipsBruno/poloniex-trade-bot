exports.poloniexApi = require("plnx")
exports.config = require('../config.js');
exports.apiKey = ''
exports.apiSecret = ''
exports.pairTicker = {}
exports.pairTrade = ''
exports.ordersArr = [];
exports.candlesData = [];
exports.balanceVal = []
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
/*
 * Essa função serve pra conferir o saldo cada segundo
 * @return: essa função não emite nenhum retorno específico 
 */
exports.triggerBalance = function() {

	if (exports.apiKey == '' || exports.apiSecret == '') return false

	exports.poloniexApi.returnCompleteBalances(
	{
		key: exports.apiKey,
		secret: exports.apiSecret
	}, function(err, data) {
		var pairs = exports.pairTrade.split('_')

		if( typeof data  !== 'undefined'  && typeof data[pairs[0]] !== 'undefined' && data[pairs[0]] && data[pairs[1]]  && typeof data[pairs[1]] !== 'undefined' ) {
			exports.balanceVal[pairs[0]]  =  data[pairs[0]].available
			exports.balanceVal[pairs[1]]  =  data[pairs[1]].available
		}
	})
	return true
}

/*
 * Essa função serve pra atualizar os candles em aberto
 * @return: essa função não emite nenhum retorno específico 
 */
exports.triggerCandles = function() {

	var timestamp = Date.now() / 1000 | 0

	var history = exports.config.tradingAdvisor.candleSize*exports.config.tradingAdvisor.historySize

	exports.poloniexApi.returnChartData({
		currencyPair: exports.config.watch.currency + '_' + exports.config.watch.asset,
		period: exports.config.tradingAdvisor.candleSize,
		start: timestamp-history,
		end: timestamp
	}, function(err, data){
		if (err) console.log("Err1", err)		
		else exports.candlesData = data
	})
	return true
}

/*
 * Essa função serve para setar o pair
 * @return: essa função não emite nenhum retorno  
 */
exports.setPair = function(pair) {
	exports.pairTrade = pair
	exports.triggerPrices()
	


	setInterval(function b() {
		exports.triggerCandles()
		return b
	}(), 2000)
}
/*
 * Essa função serve colocar a api/secret do código
 * @return: essa função não emite nenhum retorno  
 */
exports.setCredential = function(api, key) {
	exports.apiKey = api
	exports.apiSecret = key

	setInterval(function a() {
		exports.triggerOrders()
		return a
	}(), 2000)

	setInterval(function a() {
		exports.triggerBalance()
		return a
	}(), 2000)
		
}
/*
 * Essa função serve pra atualizar as ordens em aberto
 * @return: essa função não emite nenhum retorno  
 */
exports.triggerOrders = function() {
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.openorders(function(data) {
		exports.ordersArr = []
		for (var i in data) {
			exports.ordersArr.push(data[i])
		}	
	})
	return true
}
/*
 * Função para retornar saldo da conta
 * @coinr: qual moeda para pegar o pair
 */
exports.balance = function(coinr) {

	if( typeof exports.balanceVal[coinr] === 'undefined')
		return 0.0;

	return exports.balanceVal[coinr]
}
/*
 *
 * Função para verificar ordens abertas
 * @callback: chamar uma callback com o resultado
 *
 */
exports.openorders = function(callback) {

	if (exports.apiKey == '' || exports.apiSecret == '' || exports.pairTrade == '') return false

	exports.poloniexApi.returnOpenOrders(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		currencyPair: exports.pairTrade
	}, function(err, data) {
		if(!err)
			callback(data)
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
 * Função moveOrder, cancela ordem aberta e cria uma nova com outro preço/rate
 * @orderNumber - id da ordem aberta
 * @rate - novo preço
 */
exports.moveOrder = function(orderNumber,rate, callback){
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.moveOrder(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		orderNumber: orderNumber,
		rate: rate
	}, function(err, data) {
		callback(err, data)
	})
	return true
}

/*
 * Função cancelOrder, cancela ordem aberta
 * @orderNumber - id da ordem aberta
 */
exports.cancelOrder = function(orderNumber, callback){
	if (exports.apiKey == '' || exports.apiSecret == '') return false
	exports.poloniexApi.cancelOrder(
	{
		key: exports.apiKey,
		secret: exports.apiSecret,
		orderNumber: orderNumber
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
 * Essa função serve para pegar o último preço atual
 * @return: pair atual
 */
exports.lastPrice = function() {
	return exports.pairTicker.last;
}
/*
 * Essa função serve para pegar o pair atual
 * @return: pair atual
 */
exports.getPair = function() {
	return exports.pairTrade;
}
/*
 * Função para pegar os últimos candles
 * Retorna os últimos candles com base no config
 */
exports.getCandles = function() {
	return exports.candlesData
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

/*
 * Função: rempercent
 * @val: valor a ser removido porcentagem
 * @percent: quanto de porcentagem remover
 */
exports.rempercent = function(val, percent) {
	return val - (val / 100 * percent);
}
