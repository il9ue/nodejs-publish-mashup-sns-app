
define(['views/index', 'views/register', 'views/login', 'views/googleLogin',
        'views/profile', 'models/statusCollections', 'models/account'],

       function(IndexView, RegisterView, LoginView, GoogleLoginView, ProfileView,
                StatusCollection, Account) {
 
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      "index": "index",
      "login": "login",
      "googleLogin" : "googleLogin",
      "register": "register",
      "profile/:id": "profile"
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      //var statusCollection = new StatusCollection();
      //statusCollection.url = '/accounts/me/activity';
      this.changeView(new IndexView({
        //collection: statusCollection
      }));
      //statusCollection.fetch();
    },

    login: function() {
      console.log("******");

      this.changeView(new LoginView());
    },

    googleLogin : function() {

      this.changeView(new GoogleLoginView());
      console.log("```````");

    },

    register: function() {
      this.changeView(new RegisterView());
    },

    profile: function(id) {
      
    },
  });

  return new SocialRouter();
});

