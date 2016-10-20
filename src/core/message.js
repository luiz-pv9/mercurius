class Message {
  constructor({ content, name }) {
    this.name = name
    this.content = content
    this.timestamp = new Date().getTime()
  }

  toJSON() {
    return {
      content: this.content,
      timestamp: this.timestamp,
      name: this.name,
      avatar: this.avatar,
    }
  }
}

module.exports = Message