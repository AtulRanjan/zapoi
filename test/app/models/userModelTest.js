var test = require('../init'),
  User = require('../../../app/models/user'),
  should = require('should');

describe('User', function () {

  describe('creation', function () {

    afterEach(function (done) {
      //clear out db
      User.remove(done);
    });

    it("should create new user", function (done) {
      createUser(test.fixtures.users.Jamie, function (err, user) {
        should.notEqual(user, undefined);
        done();
      });
    });

    function createUser(userData, done) {
      User.register(new User({
        name: userData.name,
        email: userData.email
      }), userData.password, done);
    }
  }),

  describe('interface', function () {

    before(function (done) {
      User.create(test.fixtures.users.Jamie, function (err, user) {
        done();
      });
    });

    it("should not tell its password hash and salt", function (done) {
      User.find(function (err, user) {
        should.equal(user.hash, undefined);
        should.equal(user.salt, undefined);
        done();
      });
    }),

    it("should tell its name to the world", function (done) {
      userRespondsTo("name", done);
    });

    it("should tell its email to the world", function (done) {
      userRespondsTo("email", done);
    });

    function userRespondsTo(property, done) {
      User.findOne({
        email: test.fixtures.users.Jamie.email
      }, function (err, user) {
        should.notEqual(user[property], undefined);
        done();
      });
    }
  });
});