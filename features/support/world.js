// use zombie.js as headless browser
var zombie = require('zombie'),
  env = require('../../app/config/environments'),
  User = require('../../app/models/user');

exports.World = function (callback) {
  var self = this;

  self.page = function (path) {
    return "http://" + env.url + ":" + env.port + path;
  };

  self.browser = new zombie({
    runScripts: false,
    site: this.page('/')
  });

  self.generateUser = function (userData, callback) {
    User.register(new User({
        name: userData.name,
        email: userData.email
      }), userData.password,
      function (err, user) {
        if (err) {
          callback.fail(new Error("Could not generate user."));
        } else {
          callback();
        }
      });
  };

  self.enterCredentials = function (userData, callback) {
    self.visit('/', function (error, browser) {
      self.browser.fill('email', userData.email).
      fill('password', userData.password).
      pressButton('Login', callback);
    });
  };

  self.userIsAuthenticated = function (userData, callback) {
    self.visit('/', function (error, browser) {
      if (self.browser.text('body').indexOf(userData.name) == -1) {
        callback.fail(new Error("User is not authenticated."));
      } else {
        callback();
      }
    })
  };

  self.userIsNotAuthenticated = function (userData, callback) {
    self.visit('/', function (error, browser) {
      var isUsernamePresent = self.browser.text('body').indexOf(userData.name) != -1;
      var isLoginButtonPresent = self.browser.button('Login') != 0;
      if (isUsernamePresent || !isLoginButtonPresent) {
        callback.fail(new Error("User is authenticated."));
      } else {
        callback();
      }
    });
  };

  self.signOutUser = function (callback) {
    self.visit('/', function () {
      self.browser.clickLink("#user-navigation", function () {
        self.browser.clickLink("Logout", callback);
      });
    });
  };

  self.visit = function (path, callback) {
    this.browser.visit(this.page(path), function (error, browser, status) {
      callback(error, browser, status);
    });
  };

  callback();
}