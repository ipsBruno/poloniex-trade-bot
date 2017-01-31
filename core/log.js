/**
 * 
 */

var config = require('./config.js');
var debug = config.debug;

var day = { //dias da semana, ah vá.. 
		0: 'Domingo: ',
		1: 'Segunda: ',
		2: '  Terça: ',
		3: ' Quarta: ',
		4: ' Quinta: ',
		5: '  Sexta: ',
		6: ' Sábado: '
} 

var color = {
		'debug' : '\033[37m', //branco
		'info'  : '\033[36m', //azul
		'warn'  : '\033[33m', //amarelo
		'trade' : '\033[32m', //verde
		'start' : '\033[35m', //roxo
		'error' : '\033[31m', //vermelho
}

exports.info = function (opt, message){
	
	//se debug estiver desativado, não imprime mensagem de debug
	if(opt != 'debug' || debug){
		var time = new Date();
		var timestamp = day[time.getDay()] 
						+ time.getDate() + "/"
	    				+ (time.getMonth()+1)  + "/" 
	    				+ time.getFullYear() + " @ "  
	    				+ time.getHours() + ":"  
	    				+ time.getMinutes() + ":" 
	    				+ time.getSeconds();
		
		console.log(color[opt], timestamp, '\t', '[' + opt + ']' ,'\t\t', message, color['info']);
	}
}