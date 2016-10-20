const _ = require('lodash')
const ChatRoom = require('./chat_room');
const EventEmitter = require('events');

class Registry extends EventEmitter {
  constructor() {
    super();
    this.chatRooms = []
  }

  createChatRoom(attributes) {
    let chatRoom = new ChatRoom(attributes)
    this.emit('new:chat_room', chatRoom);
    this.chatRooms.push(chatRoom);
    return chatRoom;
  }

  findOrCreate(searchAttributes) {
    let chatRoom = this.chatRooms.find(chatRoom => {
      return _.isMatch(chatRoom.attributes, searchAttributes)
    });

    if(chatRoom) {
      return chatRoom
    } else {
      return this.createChatRoom(searchAttributes)
    }
  }
}

module.exports = Registry