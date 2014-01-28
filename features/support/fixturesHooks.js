module.exports = function() {

  this.Before(function(callback) {
    var self = this;

    self.fixtures = {};
    var files = require('fs').readdirSync('./features/fixtures/');
    for (var i in files) {
      var fileName = '../fixtures/' + files[i];
      var ruleName = files[i].replace('.json', '');
      self.fixtures[ruleName] = require(fileName);
    }
    callback();
  });
};