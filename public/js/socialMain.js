/*
 *  by DanQ : 2013.3/2
 *  socialMain.js is the main module which manages running and init web application
 */

// initial.. change logic here..
define(['router'], function(router) {
  var initialize = function() {

    checkLogin(runApplication);
    //checkExtLogin(runExtApplication);
  };

  var checkLogin = function(callback) {
    $.ajax("/account/authenticated", {
      method: "GET",
      success: function() {
        return callback(true);
      },
      error: function(data) {
        return callback(false);
      }
    });
  };

  var checkExtLogin = function(callback) {
    $.ajax("/googleLogin", {
      method: "GET",
      success: function() {
        return callback(true);
      },
      error: function(data) {
        return callback(false);
      }
    });
  };

  var runApplication = function(authenticated) {
    if (!authenticated) {
      window.location.hash = 'login';
    } else {
      window.location.hash = 'index';
    }
    Backbone.history.start();
  };

  var runExtApplication = function(authenticated) {
    window.location.hash = 'googleLogin';
    Backbone.history.start();
  }

  return {
    initialize: initialize
  };
});
