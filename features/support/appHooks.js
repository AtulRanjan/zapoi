var server = require('../../app.js'),
  env = require('../../app/config/environments.js'),
  http;

module.exports = function () {
  this.Before(function (callback) {
    // Connect to mongodb
    server.mongoose.connect(env.dbUrl);

    // Start the app
    http = server.app.listen(env.port);

    // Release control
    callback();
  });

  this.After(function (callback) {
    // Stop the app and free the db connection
    http.close();

    // Remove all the inserted users and close the connection
    server.mongoose.connection.collections['users'].drop();

    // Close the mongoose connection
    server.mongoose.connection.close();

    // Release control
    callback();
  });
};