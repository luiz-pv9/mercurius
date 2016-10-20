var app = new Vue({
  el: '#app',
  data: {
    credentials: {
      name: '',
      email: ''
    },
    message: '',
    messages: [],
    chatRoom: null,
    isChatting: false,
    socket: null
  },
  watch: {
    'messages': function(val) {
      var self = this;
      setTimeout(function() {
        var $elm = self.$el.querySelector('.ui.comments');
        $elm.scrollTop = $elm.scrollHeight;
      }, 200);
    }
  },
  methods: {
    onCreateChatRoom: function() {
      var self = this;
      $.post('/chat_room', this.credentials).done(function(res) {
        self.chatRoom = res;
        self.isChatting = true;
        self.socket = io.connect('http://localhost:8081');
        console.log("listening on chat_room." + res.id);
        self.socket.emit('subscribe', 'chat_room.' + res.id);
        self.socket.on('message', self.onMessage.bind(this));
      });
    },
    onMessage: function(message) {
      var self = this;
      setTimeout(function() {
        self.messages.push(message);
      }, 200);
    },
    sendMessage: function() {
      var self = this;
      $.post('/chat_room/' + this.chatRoom.id, {
        message: this.message,
        credentials: {
          name: this.credentials.name,
          email: this.credentials.email,
        }
      }).done(function(res) {
        console.log("chatRoomID", res.chatRoom.id)
        self.message = '';
        self.messages.push(res.message);
      });
    }
  }
})
