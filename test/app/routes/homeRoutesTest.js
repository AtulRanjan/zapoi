var test = require('../init'),
  utils = require('../utils');

describe('Home', function () {

  describe('Routes', function () {

    describe('Not logged', function (done) {

      before(function () {
        test.loggedOut();
      });

      it('GET / should return 200', function (done) {
        utils.gets(test.app, '/', done);
      });
    }),

    describe('Logged', function (done) {

      before(function () {
        test.loggedAs(test.fixtures.users.Jamie);
      });

      it('GET / should return 200 when you are logged too', function (done) {
        utils.gets(test.app, '/', done);
      });
    });
  });
});