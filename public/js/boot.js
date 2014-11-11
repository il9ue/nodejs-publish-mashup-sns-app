/*
 *  by DanQ : 2013.3/2
 *  socialMain.js is the main module which manages running and init web application
 */


require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    models: 'models',
    text: '/js/libs/text',
    templates: '../templates',

    mainView: '/js/mainView'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'socialMain': ['Backbone']
  }
});

require(['socialMain'], function(socialMain) {
  socialMain.initialize();
});
