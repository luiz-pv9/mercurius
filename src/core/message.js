class Message {
  constructor(content) {
    this.attributes = { 
      content: content,
      timestamp: new Date().getTime(),
    };
  }

  setName(name) {
    this.attributes.name = name;
  }

  content() {
    return this.attributes.content;
  }
}

module.exports = Message