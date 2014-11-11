define(['mainView', 'text!templates/status.html'], function(mainView, statusTemplate) {
  var statusView = mainView.extend({
    tagName: 'li',

    render: function() {
      $(this.el).html(_.template(statusTemplate,this.model.toJSON()));
      return this;
    }
  });

  return statusView;
});
