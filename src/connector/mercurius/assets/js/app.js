
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
    isChatting: false
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
      });
    },
    sendMessage: function() {
      var self = this;
      $.post('/chat_room/' + this.chatRoom.id, {
        message: this.message
      }).done(function(res) {
        self.message = '';
        self.messages.push(res);
      });
    }
  }
})
