const mercurius = require('../index');

let mercuriusConnector = new mercurius.connector.MercuriusConnector({
  host: '0.0.0.0',
  port: 8081,
});

let facebookConnector = new mercurius.connector.FacebookConnector({
  appId: '',
  appSecret: '',
  validationToken: 'godzilla',
  host: '0.0.0.0',
  port: 8080,
  webhookPath: '/webhook',
});

let echoBot = new mercurius.Bot({
  connectors: [facebookConnector, mercuriusConnector],
  pipeline: []
});

echoBot.initialize().then(bot => {
  bot.on('message', (message, chatRoom) => {
    console.log("BOOT!!!!")
    console.log("recebi mensagem: ", message.content());
  });
});