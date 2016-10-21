class Message {
  constructor(attrs) {
    attrs.timestamp = new Date().getTime()
    this.attributes = attrs
  }

  get content() {
    return this.attributes.content
  }

  toJSON() {
    return this.attributes
  }
}

module.exports = Message