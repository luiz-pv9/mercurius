new Vue({
  el: '#app',
  data: {
    search: '',
    pages: [],
    totalPages: 0,
    currentPage: 0,
    isCreatingAccessToken: false,
    accessToken: {}
  },
  created: function() {
    this.loadAccessTokens();
  },
  methods: {
    loadAccessTokens: function() {
      var self = this;
      $.get('/access_tokens?page=' + this.currentPage).done(function(res) {
        self.pages = res.records;
        self.totalPages = res.total;
      })
    },
    goToNextPage: function() {
      console.log("what???");
      this.currentPage += 1;
      this.loadAccessTokens();
    },
    goToPreviousPage: function() {
      this.currentPage -= 1;
      this.loadAccessTokens();
    },
    onCreateAccessToken: function() {
      var self = this;
      $.post('/access_tokens', this.accessToken, function() {
        self.isCreatingAccessToken = false;
        self.loadAccessTokens();
      });
    }
  }
})
