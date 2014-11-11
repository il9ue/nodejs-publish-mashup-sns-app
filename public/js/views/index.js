/*
 *  by DanQ : 2013.3/2
 *  index.js
 */


define(['mainView', 'text!templates/index.html', 
      'views/status', 'models/status'], 

function(mainView, indexTemplate, StatusView, Status) {
  var indexView = Backbone.View.extend({
    el: $('#content'),

    events: {
    	"submit form" : "updateStatus"
    },

    initialize: function() {
    },


    onStatusAdded: function(status) {
      var statusHtml = (new StatusView({ model: status })).render().el;
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    onStatusCollectionReset: function(collection) {
      var that = this;
      collection.each(function (model) {
        that.onStatusAdded(model);
      });
    },

    updateStatus: function() {
      var statusText = $('input[name=status]').val();
      var statusCollection = this.collection;
      $.post('/accounts/me/status', {
        status: statusText
      }, function(data) {
        statusCollection.add(new Status({status:statusText}));
      });
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return new indexView;
});
