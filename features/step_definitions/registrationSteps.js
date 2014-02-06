module.exports = function () {
  this.World = require("../support/world").World;

  this.When(/^I press "([^"]*)"$/, function (buttonText, callback) {
    this.pressButton(buttonText, callback);
  });

  this.When(/^I fill in an invalid email address$/, function (callback) {
    this.enterEmail("invalid", callback);
  });

  this.Then(/^I should see "([^"]*)"$/, function (validationMessage, callback) {
    this.isContentPresent(validationMessage, callback);
  });

  this.When(/^I fill in two different passwords$/, function (callback) {
    this.enterPasswords("first", "second", callback);
  });

  this.When(/^I fill in a display name shorter than (\d+) characters$/, function (fieldSizeMinimum, callback) {
    this.enterDisplayName(this.generateRandomString(fieldSizeMinimum - 1), callback);
  });

  this.When(/^I fill in a password shorter than (\d+) characters$/, function (fieldSizeMinimum, callback) {
    this.enterPasswords(this.generateRandomString(fieldSizeMinimum - 1), null, callback);
  });

  this.Given(/^I am on the register page$/, function (callback) {
    this.visit('/register', callback);
  });

  this.When(/^I enter the required information$/, function (callback) {
    this.enterRegistrationInfo(this.fixtures.users.Jamie, callback);
  });
}