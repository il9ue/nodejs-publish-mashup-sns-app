/*
 *  by DanQ : 2013.3/2
 *  register.js is viewer logic that manages post register
 */


define(['mainView', 'text!templates/register.html'], function(mainView, registerTemplate) {
  var registerView = mainView.extend({
    el: $('#content'),

    events: {
      "submit form": "register"
    },

    register: function() {
      $.post('/register', {
        firstName: $('input[name=firstName]').val(),
        lastName: $('input[name=lastName]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
    }
  });

  return registerView;
});
