const _ = require('lodash');
const EventEmitter = require('events');
const Message = require('./message');

class ChatRoom extends EventEmitter {
  constructor(attributes) {
    super();
    this.attributes = attributes
    this.attributes.id = this.id = _.uniqueId('chat_room.')
    this.messages = [];
  }

  // Message sent by the user.
  sendMessage(message) {
    message = new Message(message);
    message.setName(this.attributes.name);
    this.messages.push(message);
    this.emit('message', message);
    return message;
  }

  setBroadcaster(connector) {
    this.broadcaster = connector
  }

  addAttributes(attributes) {
    this.attributes = _.merge(this.attributes, attributes)
  }
}

module.exports = ChatRoom