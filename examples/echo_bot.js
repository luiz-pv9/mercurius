const mercurius = require('../index');

let mercuriusConnector = new mercurius.connector.MercuriusConnector({
  host: '0.0.0.0',
  port: 8081,
});

let facebookConnector = new mercurius.connector.FacebookConnector({
  appId: '325334607844121',
  appSecret: 'c0aec247b32e5b77c445a3886985cf22',
  validationToken: 'godzilla',
  host: '0.0.0.0',
  port: 8080,
  webhookPath: '/webhook',
  redis: {}
});

let echoBot = new mercurius.Bot({
  connectors: [mercuriusConnector, facebookConnector],
  pipeline: []
})

echoBot.initialize().then(bot => {
  bot.on('message', (message, chatRoom) => {
    if(message.content === 'bye') {
      chatRoom.close()
    } else {
      chatRoom.broadcast(message.content.toUpperCase())
    }
  })

  bot.on('close', chatRoom => {
    chatRoom.broadcast('See ya later!')
  })
})
