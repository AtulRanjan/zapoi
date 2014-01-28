module.exports = function () {
  'use strict';

  var development = {
    'port': 9797,
    'url': 'localhost',
    'baseUrl': '', // the context root of our app, empty sting means domain root
    'dbUrl': 'mongodb://localhost/zapoi-dev',
    'sessionSecret': '123456789qwerty'
  };

  var test = {
    'port': 9292,
    'url': 'localhost',
    'baseUrl': '',
    'dbUrl': 'mongodb://localhost/zapoi-test',
    'sessionSecret': 'qwerty123456789'
  };

  var production = {
      'port': 9797,
      'url': 'localhost',
      'baseUrl': '', // the context root of our app, empty sting means domain root
      'dbUrl': 'mongodb://zapoi:zapoi@ds063307.mongolab.com:63307/zapoi',
      'sessionSecret': '123456789qwerty'
  };

  var env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'test':
      return test;

    case 'development':
      return development;

    case 'production':
      // production options here
      return production;
  }
}();