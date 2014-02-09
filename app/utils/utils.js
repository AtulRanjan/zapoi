var fs = require('fs');

exports.endsWith = function (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.copyFile = function (source, target, callback) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function (err) {
    done(err);
  });
  wr.on("close", function (ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      callback(err);
      cbCalled = true;
    }
  }
}

/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 */
exports.errors = function (errors) {
  var keys = Object.keys(errors);
  var errs = [];

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    errs.push(errors[key].message)
  });

  return errs;
}