/**
 * 
 */
var log = require('./log.js');

var initCurrecy, initAsset;
var lastCurrency, lastAsset;

exports.init = function(currency, asset){
	log.info('debug', "profit.init >> started");
	initCurrecy = currency;
	initAsset = asset;
	log.info('debug', "profit.init >> initCurrecy: "+ initCurrecy +" | initAsset: " +initAsset);
}

exports.info = function(currency, asset) {
	log.info('debug', "profit.info >> started");
	log.info('debug', "profit.info >> initCurrecy: "+ initCurrecy +" | initAsset: " +initAsset);
	
	var currecyProfit = ((lastCurrency / currency)-1)*100;
	var assetProfit = ((lastAsset / asset)-1)*100;
	
	log.info('info', "Profit >> Profit comparado com a ultima checagem");
	log.info('info', "Profit >> Currency: " + currecyProfit + "%");
	log.info('info', "Profit >> Asset: " + assetProfit + "%");
	
	var currecyProfitInit = ((initCurrecy / currency)-1)*100;
	var assetProfitInit = ((initAsset / asset)-1)*100;
	
	log.info('info', "Profit >> Profit comparado com a primeira checagem");
	log.info('info', "Profit >> Currency: " + currecyProfitInit + "%");
	log.info('info', "Profit >> Asset: " + assetProfitInit + "%");
	
	lastCurrency = currency;
	lastAsset = asset;
}