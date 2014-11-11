
var express = require("express")
  , app = express()
  , nodemailer = require('nodemailer')
  , mongoose = require('mongoose')
  , MemoryStore = require('connect').session.MemoryStore
  , OAuth = require('oauth').OAuth
  , querystring = require('querystring')


var Account = require('./models/account')(mongoose, nodemailer);
var defaultLogin = false;
var googleLogin = false;

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());

   app.use(express.session({secret: "mashup secret key", store: new MemoryStore()}));
  mongoose.connect('mongodb://localhost/nodebackbone');
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/googleLogin', function(req, res) {
  console.log("******");
  console.log(req.route);

  googleLogin = true;
  defaultLogin = false;

  if(!req.session.oauth_access_token) {
    res.redirect("/google_login");
  }
  else {
    res.redirect("/google_contacts");
  }
});

app.post('/login', function(req, res) {
  console.log('login request');
  console.log(req.route);

  defaultLogin = true;
  googleLogin = false;
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
      || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  Account.login(email, password, function(success) {
    if ( !success ) {
      res.send(401);
      return;
    }
    console.log('login was successful');
    req.session.loggedIn = true;
	res.send(200);
  });
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
       || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.get('/account/authenticated', function(req, res) {
  console.log(req.route);

  if ( req.session.loggedIn ) {
    res.send(200);
  } else {
    if (googleLogin || req.session.oauth_access_token) {
      res.send(200);
    } else {
      res.send(401);
    }
  }
});

app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.send(400);
    return;
  }

  Account.forgotPassword(email, resetPasswordUrl, function(success){
    if (success) {
      res.send(200);
    } else {
      // Username or password not found
      res.send(404);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if ( null != accountId && null != password ) {
    Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.get('/google_login', function(req, res) {
  var getRequestTokenUrl = "https://www.google.com/accounts/OAuthGetRequestToken";
  
  var gdataScopes = [
    querystring.escape("https://www.google.com/m8/feeds/"),
    querystring.escape("https://www.google.com/calendar/feeds/")
  ];
  
  var oa = new OAuth(getRequestTokenUrl+"?scope="+gdataScopes.join('+'),
                    "https://www.google.com/accounts/OAuthGetAccessToken",
                    "anonymous",
                    "anonymous",
                    "1.0",
                    "http://localhost:3000/google_cb"+( req.param('action') && req.param('action') != "" ? "?action="+querystring.escape(req.param('action')) : "" ),
                    "HMAC-SHA1");

  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if(error) {
      console.log('error');
      console.log(error);
    }
    else { 
      // store the tokens in the session
      req.session.oa = oa;
      req.session.oauth_token = oauth_token;
      req.session.oauth_token_secret = oauth_token_secret;
    
      // redirect the user to authorize the token
      res.redirect("https://www.google.com/accounts/OAuthAuthorizeToken?oauth_token="+oauth_token);
    }
  })

});

// Callback for the authorization page
app.get('/google_cb', function(req, res) {
    
  // get the OAuth access token with the 'oauth_verifier' that we received
  
  var oa = new OAuth(req.session.oa._requestUrl,
                    req.session.oa._accessUrl,
                    req.session.oa._consumerKey,
                    req.session.oa._consumerSecret,
                    req.session.oa._version,
                    req.session.oa._authorize_callback,
                    req.session.oa._signatureMethod);
  
    console.log(oa);
  
  oa.getOAuthAccessToken(
    req.session.oauth_token, 
    req.session.oauth_token_secret, 
    req.param('oauth_verifier'), 
    function(error, oauth_access_token, oauth_access_token_secret, results2) {
      
      if(error) {
        console.log('error');
        console.log(error);
      }
      else {
    
        // store the access token in the session
        req.session.oauth_access_token = oauth_access_token;
        req.session.oauth_access_token_secret = oauth_access_token_secret;

          res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/google_contacts");
      }

  });
  
});


function require_google_login(req, res, next) {
  if(!req.session.oauth_access_token) {
    res.redirect("/google_login?action="+querystring.escape(req.originalUrl));
    return;
  }
  next();
};

app.get('/google_contacts', require_google_login, function(req, res) {
  var oa = new OAuth(req.session.oa._requestUrl,
                    req.session.oa._accessUrl,
                    req.session.oa._consumerKey,
                    req.session.oa._consumerSecret,
                    req.session.oa._version,
                    req.session.oa._authorize_callback,
                    req.session.oa._signatureMethod);
  
    console.log(oa);

  oa._headers['GData-Version'] = '3.0'; 
  
  oa.getProtectedResource(
    "https://www.google.com/m8/feeds/contacts/default/full?alt=json", 
    "GET", 
    req.session.oauth_access_token, 
    req.session.oauth_access_token_secret,
    function (error, data, response) {
      
      var feed = JSON.parse(data);
      
      res.render('google_contacts.ejs', {
        locals: { feed: feed }
      });
  });
  
});

app.get('/google_calendars', require_google_login, function(req, res) {
    var oa = new OAuth(req.session.oa._requestUrl,
                    req.session.oa._accessUrl,
                    req.session.oa._consumerKey,
                    req.session.oa._consumerSecret,
                    req.session.oa._version,
                    req.session.oa._authorize_callback,
                    req.session.oa._signatureMethod);
  // Example using GData API v2
  // GData Specific Header
  oa._headers['GData-Version'] = '2'; 
  
  oa.getProtectedResource(
    "https://www.google.com/calendar/feeds/default/allcalendars/full?alt=jsonc", 
    "GET", 
    req.session.oauth_access_token, 
    req.session.oauth_access_token_secret,
    function (error, data, response) {
      
      var feed = JSON.parse(data);
      
      res.render('google_calendars.ejs', {
        locals: { feed: feed }
      });
  });
  
});


app.listen(3000);
