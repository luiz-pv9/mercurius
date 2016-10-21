new Vue({
  el: '#app',
  data: {
    search: '',
    pages: [],
    totalPages: 0,
    isCreatingAccessToken: false,
    accessToken: {}
  },
  created: function() {
    $.get('/access_tokens').done(function(accessTokens) {
      console.log("accessTokens");
    })
  }
})