Vue.filter('datetime', function(value) {
  var date = new Date(+value);
  var hour = date.getHours();
  if(hour < 10) hour = "0" + hour;
  var minute = date.getMinutes();
  if(minute < 10) minute = "0" + minute;
  return hour + ':' + minute;
});

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
    socket: io.connect('http://localhost:8081')
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
      this.chatRoom = { name: this.credentials.name, email: this.credentials.email };
      this.isChatting = true;
      this.socket.on('message', self.onMessage.bind(this));
    },
    onMessage: function(message) {
      var self = this;
      setTimeout(function() {
        self.messages.push(message);
      }, 200);
    },
    sendMessage: function() {
      var self = this;
      $.post('/chat_room', {
        message: this.message,
        credentials: {
          name: this.credentials.name,
          email: this.credentials.email,
        }
      }).done(function(res) {
        self.chatRoom.id = res.chatRoom.id;
        self.socket.emit('subscribe', 'chat_room.' + res.chatRoom.id);
        self.message = '';
        self.messages.push(res.message);
      });
    }
  }
})
