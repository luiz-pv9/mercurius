const _ = require('lodash');
const EventEmitter = require('events');
const Message = require('./message');

class ChatRoom extends EventEmitter {
  constructor(attributes) {
    super()
    this.attributes = attributes
    this.attributes.id = this.id = _.uniqueId()
    this.messages = []
  }

  // Message sent by the user.
  sendMessage(content) {
    let message = new Message({ content, name: this.attributes.name })
    this.messages.push(message)
    this.emit('message', message)
    return message
  }

  setBroadcaster(connector) {
    this.broadcaster = connector
  }

  broadcast(content) {
    let message = new Message({ content, name: 'Mercurius' })
    this.messages.push(message)
    this.broadcaster.sendMessageFromChatRoom(message, this)
    return message
  }

  addAttributes(attributes) {
    this.attributes = _.merge(this.attributes, attributes)
  }
}

module.exports = ChatRoom