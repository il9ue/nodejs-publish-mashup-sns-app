/*
 *  by DanQ : 2013.3/2
 *  login.js 
 */


define(['mainView', 'text!templates/login.html'], function(mainView, loginTemplate) {
  
  var loginView = mainView.extend({

    requireLogin: false,
    el: $('#content'),

    events: {
      "submit form": "login",
    },

    login: function() {
      $.post('/login', {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }, function(data) {
        console.log(data);
      }).error(function(){
        $("#error").text('Unable to login.');
        $("#error").slideDown();
      });
      return false;
    },

    googleLogin: function() {
      $.post('/googleLogin', {

      }, function(data) {
        console.log(data);
      }).error(function(){
        $("#error").text('Unable to login.');
        $("#error").slideDown();
      });
      return false;
    },


    render: function() {
      this.$el.html(loginTemplate);
      $("#error").hide();
    }
  });

  return loginView;
});
