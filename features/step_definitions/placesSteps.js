module.exports = function () {
  this.World = require("../support/world").World;

  this.Given(/^I am on the add place page$/, function (callback) {
    this.visit('/places/add', callback);
  });

  this.When(/^I enter the place information$/, function (callback) {
    this.enterPlaceInfo(this.fixtures.places.pharmacy, callback);
  });

}