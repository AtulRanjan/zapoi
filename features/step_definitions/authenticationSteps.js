module.exports = function () {
  this.World = require("../support/world").World;

  this.Given(/^I am on the login page$/, function (callback) {
    this.visit('/', callback);
  });

  this.Given(/^I have signed up$/, function (callback) {
    this.generateUser(this.fixtures.users.Jamie, callback);
  });

  this.When(/^I enter my credentials$/, function (callback) {
    this.enterCredentials(this.fixtures.users.Jamie, callback);
  });

  this.Then(/^I should be authenticated$/, function (callback) {
    this.userIsAuthenticated(this.fixtures.users.Jamie, callback);
  });

  this.When(/^I sign out$/, function (callback) {
    this.signOutUser(callback);
  });

  this.Then(/^I should not be authenticated$/, function (callback) {
    this.userIsNotAuthenticated(this.fixtures.users.Jamie, callback);
  });

  this.Given(/^I have logged in$/, function (callback) {
    this.logUserIn(this.fixtures.users.Jamie, callback);
  });
}