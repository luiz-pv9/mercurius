class Message {
  constructor(attrs) {
    this.name = name
    this.content = content
    this.timestamp = new Date().getTime()
    this.attributes = attrs
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