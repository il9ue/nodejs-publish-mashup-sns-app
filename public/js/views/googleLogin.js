/*
 *  by DanQ : 2013.3/2
 *  login.js 
 */


define(['mainView', 'text!templates/googleLogin.html'], function(mainView, gLoginTemplate) {
  
  var gLoginView = mainView.extend({

    requireLogin: false,
    el: $('#content'),

    events: {
      "submit form": "googleLogin"
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
      this.$el.html(gLoginTemplate);
      $("#error").hide();
    }
  });

  return gLoginView;
});
