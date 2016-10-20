const EventEmitter = require('events')
const Registry = require('./registry')

class Bot extends EventEmitter {

  constructor({ connectors, pipeline }) {
    super()
    this.connectors = connectors
    this.pipeline = pipeline
    this.registry = new Registry()

    this.registry.on('new:chat_room', this.onNewChatRoom.bind(this))
  }

  initialize() {
    let initializeConnectors = this.connectors.reduce((promise, connector) => {
      return promise.then(() => { return connector.initialize(this.registry) })
    }, Promise.resolve())

    return initializeConnectors.then(() => { return this })
  }

  onNewChatRoom(chatRoom) {
    chatRoom.on('message', message => {
      this.emit('message', message, chatRoom)
    })
  }
}

module.exports = Bot