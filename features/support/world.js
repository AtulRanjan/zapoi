// use zombie.js as headless browser
var zombie = require('zombie'),
  env = require('../../app/config/environments'),
  User = require('../../app/models/user');

exports.World = function (callback) {
  var self = this;

  self.page = function (path) {
    return "http://" + env.url + ":" + env.port + env.baseUrl + path;
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
    self.browser.fill('email', userData.email)
      .fill('password', userData.password)
    callback();
  };

  self.userIsAuthenticated = function (userData, callback) {
    if (self.browser.text('body').indexOf(userData.name) == -1) {
      callback.fail(new Error("User is not authenticated."));
    } else {
      callback();
    }
  };

  self.userIsNotAuthenticated = function (userData, callback) {
    var isUsernamePresent = self.browser.text('body').indexOf(userData.name) != -1;
    var isLoginButtonPresent = self.browser.button('Login') != 0;
    if (isUsernamePresent || !isLoginButtonPresent) {
      callback.fail(new Error("User is authenticated."));
    } else {
      callback();
    }
  };

  self.signOutUser = function (callback) {
    self.browser.clickLink("#user-navigation", function () {
      self.browser.clickLink("Logout", callback);
    });
  };

  self.enterRegistrationInfo = function (userData, callback) {
    self.enterEmail(userData.email, self.dummyCallback);
    self.enterDisplayName(userData.name, self.dummyCallback);
    self.enterPasswords(userData.password, userData.password, self.dummyCallback);
    callback();
  };

  self.enterEmail = function (email, callback) {
    self.browser.fill('#regEmail', email);
    callback();
  }

  self.enterPasswords = function (password, passwordConfirmation, callback) {
    self.browser.fill('#regPassword', password)
      .fill('#regPasswordConfirmation', passwordConfirmation);
    callback();
  }

  self.enterDisplayName = function (displayName, callback) {
    self.browser.fill('#regDisplayName', displayName);
    callback();
  }

  self.enterPlaceInfo = function (placeData, callback) {
    self.browser.fill('name', placeData.name)
      .fill('description', placeData.description)
      .fill('categories', placeData.categories)
      .fill('address', placeData.address)
      .fill('additionalInfo[website]', placeData.additionalInfo.website)
      .fill('additionalInfo[phone]', placeData.additionalInfo.phone)
      .fill('additionalInfo[seats]', placeData.additionalInfo.seats)
      .fill('additionalInfo[wifi]', placeData.additionalInfo.wifi)
      .fill('additionalInfo[parking]', placeData.additionalInfo.parking);
    callback();
  };

  self.pressButton = function (buttonText, callback) {
    self.browser.pressButton(buttonText, callback);
  }

  self.isContentPresent = function (content, callback) {
    if (self.browser.text('body').indexOf(content) != -1) {
      callback();
    } else {
      callback.fail(new Error("Could not find '" + content + "' on the page."));
    }
  }

  self.visit = function (path, callback) {
    this.browser.visit(this.page(path), function (error, browser, status) {
      callback(error, browser, status);
    });
  };

  self.generateRandomString = function (size) {
    randomString = "";
    while (randomString.length < size) {
      randomString += (Math.random() + 1).toString(36);
    }

    return randomString.substring(0, size);
  }

  self.dummyCallback = function () {}

  callback();
}