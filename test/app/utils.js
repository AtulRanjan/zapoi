var request = require('supertest'),
  should = require('should');

exports.gets = function (app, address, done) {
  request(app).get(address).expect(200).end(done);
};

exports.posts = function (app, address, done) {
  request(app).post(address).expect(200).end(done);
};

exports.postRedirects = function (app, requestAddress, expectedAddress, done) {
  request(app).post(requestAddress).expect(302).end(function (err, res) {
    if (err) {
      throw new Error('Error during redirect to ' + expectedAddress);
    }
    should.equal(res.headers.location, expectedAddress);
    done();
  });
};

exports.getRedirects = function (app, requestAddress, expectedAddress, done) {
  request(app).get(requestAddress).expect(302).end(function (err, res) {
    if (err) {
      throw new Error('Error during redirect to ' + expectedAddress);
    }
    should.equal(res.headers.location, expectedAddress);
    done();
  });
};