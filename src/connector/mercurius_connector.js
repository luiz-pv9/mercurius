const EventEmitter = require('events')
const express      = require('express')
const bodyParser   = require('body-parser')
const http         = require('http')
const socketIO     = require('socket.io')
const _            = require('lodash')
const logger       = require('../logger')

const defaultConfig = {
  port: 8081,
  host: '0.0.0.0'
}

class MercuriusConnector extends EventEmitter {
  constructor(config) {
    super()
    this.config = _.merge(config, defaultConfig)
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(express.static(__dirname + '/mercurius'))
    this.app.use(express.static(__dirname + '/assets'))
    this.app.post('/chat_room', this.onPostChatRoom.bind(this))

    this.server = http.Server(this.app)
    this.io = socketIO(this.server)
    this.io.on('connection', this.onSocketConnection.bind(this))
  }

  onPostChatRoom(req, res) {
    let params = req.body.credentials
    let chatRoom = this.registry.findOrCreate(params)
    chatRoom.setBroadcaster(this)
    let message = chatRoom.sendMessage(req.body.message)
    res.json({
      message: message.toJSON(), chatRoom: chatRoom.toJSON()
    })
  }

  onSocketConnection(socket) {
    socket.on('subscribe', function(room) {
      socket.join(room)
    })
  }

  sendMessageFromChatRoom(message, chatRoom) {
    message.attributes.avatar = '/assets/images/mercurius_m.png'
    setTimeout(() => {
      this.io.to('chat_room.' + chatRoom.id).emit('message', message.toJSON())
    }, 500)
  }

  initialize(registry) {
    this.registry = registry
    return new Promise(resolve => {
      this.server.listen(this.config.port, this.config.host, () => {
        logger.info(`Mercurius connector listening on port [${this.config.port}]`)
        resolve()
      })
    })
  }
}

module.exports = MercuriusConnector