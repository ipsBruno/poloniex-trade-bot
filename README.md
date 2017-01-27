# poloniex-trade-bot

poloniex-trade-bot é um rôbo automático para criar posições de compra/venda na exchange poloniex usando alguns indicadores.

Para rodar e configurar este BOT será necessário conhecimentos intermediários-avançados em programação. O projeto está em desenvolvimento, qualquer dúvida/bug utilize os issues para nos comunicar

## Instalando

Para rodar estes arquivos é necessário instalar NodeJS v6.3.1


Após instalar NodeJS v6.3.1 vá até a pasta do BOT e dê dois cliques no arquivo

```
install.bat
 ```
 
Aguarde a instalação ...

## Configurando

Efetuar a configuração do bot, utilizando o arquivo `config.js`
	
	config.watch = {
	 exchange: 'poloniex',
	 currency: 'USDT',
	 asset: 'BTC'
	}
	
	config.trader = {
	  value: 10.0,	
	  enabled: false,
	  key: 'xxxxxxxxxxxxxxxxxxx',
	  secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	}

 
10.0 é a quantia em dólares ou USDT (currency que você definir) para fazer os trades

Lembre-se que é necessário ter essa quantia em dólares na sua conta!!

Não se esqueça de trocar os xxx e xxx (key,secret) para a key e secret API da sua conta Poloniex. Dentro das aspas, sempre.



## Rodando

Para rodar seu bot, salve os arquivos configurados

E dê dois cliques em:

**run.bat**

Seu BOT está pronto para uso.
