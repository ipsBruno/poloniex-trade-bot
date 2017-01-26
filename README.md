# poloniex-trade-bot

poloniex-trade-bot é um rôbo automático para criar posições de compra/venda na exchange poloniex usando alguns indicadores.

Para rodar e configurar este BOT será necessário conhecimentos intermediários-avançados em programação. O projeto está em desenvolvimento, qualquer dúvida/bug utilize os issues para nos comunicar

## Preparando

Para rodar estes arquivos é necessário instalar NodeJS v6.3.1


Após isto é necessário instalar as bibliotecas plnx e technicalindicators

Rodar o seguinte comando na pasta do BOT: 

```
npm install
 ```
 

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

 
Dentro do arquivo tests.js terá

```
var mintradeval = 10.0;
```

10.0 é a quantia em dólares para fazer os trades.

Lembre-se que é necessário ter essa quantia em dólares na sua conta!!


## Rodando

Para rodar. Crie outro arquivo **.bat**  dentro da pasta do bot com o seguinte:
```
node tests.js
pause
 ```

Salve e rode o arquivo!
