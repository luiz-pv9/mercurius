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
    this.app.post('/chat_room', this.onPostChatRoom.bind(this))
    this.app.post('/chat_room/:id', this.onUpdateChatRoom.bind(this))

    this.server = http.Server(this.app)
    this.io = socketIO(this.server)
    this.io.on('connection', this.onSocketConnection.bind(this))
  }

  onPostChatRoom(req, res) {
    let chatRoomAttrs = req.body
    let chatRoom = this.registry.findOrCreate(chatRoomAttrs)
    chatRoom.setBroadcaster(this)
    res.json(chatRoom.attributes)
  }

  onUpdateChatRoom(req, res) {
    let chatRoom = this.registry.findOrCreate({id: req.params.id})
    if(chatRoom) {
      let message = chatRoom.sendMessage(req.body.message)
      res.json(message.toJSON())
    } else {
      res.status(404)
    }
  }

  onSocketConnection(socket) {
    socket.on('subscribe', function(room) {
      socket.join(room)
    })
  }

  sendMessageFromChatRoom(message, chatRoom) {
    message.avatar = '/assets/images/default-avatar-catty.jpg'
    this.io.to('chat_room.' + chatRoom.id).emit('message', message.toJSON())
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