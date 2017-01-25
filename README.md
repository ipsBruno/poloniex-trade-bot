# poloniex-trade-bot

poloniex-trade-bot é um rôbo automático para criar posições de compra/venda na exchange poloniex usando alguns indicadores.

Para rodar e configurar este BOT será necessário conhecimentos intermediários-avançados em programação. Projeto em desenvolvimento


## Configurando

Efetuar a configuração do bot, utilizando o arquivo `config.js`
	
	config.watch = {
	 currency: 'USDT',
	 asset: 'BTC'
	}
	
	config.trader = {
	  enabled: false,
	  key: 'xxxxxxxxxxxxxxxxxxx',
	  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	}
	
## Preparando

Para rodar estes arquivos é necessário instalar NodeJS v6.3.1


Após isto é necessário instalar as bibliotecas plnx e technicalindicators

Portanto crie um arquivo .bat dentro da pasta do BOT com o seguinte

```
npm install technicalindicators
npm install plnx
 ```
 
Rode este arquivo**  .bat** 

## Rodando

Para rodar. Crie outro arquivo ** .bat**  dentro da pasta do bot com o seguinte:

node tests.js
pause

Salve e rode o arquivo!
