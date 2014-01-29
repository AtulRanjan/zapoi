var test = require('../init'),
  utils = require('../utils');

describe('Authentication', function () {

  describe('Routes', function () {

    describe('Not logged', function (done) {

      before(function () {
        test.loggedOut();
      });

      it('POST /login should redirect to home page', function (done) {
        utils.postRedirects(test.app, '/login', '/', done);
      });
    }),

    describe('Logged', function (done) {

      before(function () {
        test.loggedAs(test.fixtures.users.Jamie);
      });

      it('GET /logout should return redirect to home page', function (done) {
        utils.getRedirects(test.app, '/logout', '/', done);
      });
    });
  });
});