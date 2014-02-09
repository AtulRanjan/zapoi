var server = require('../../app.js'),
  env = require('../../app/config/environments.js'),
  http;

module.exports = function () {
  this.Before(function (callback) {
    http = server.app.listen(env.port);
    callback();
  });

  this.After(function (callback) {
    // Stop the app
    http.close();

    // Drop the database at the end
    server.mongoose.connection.db.dropDatabase(function (err) {
        callback();
    });
  });
};