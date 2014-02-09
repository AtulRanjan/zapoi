var config = require('../config/environments.js');

module.exports = function (app) {

  app.namespace(config.baseUrl + '/places', function () {

    app.get('/add', function (req, res) {
      res.render('addplace', {
        user: req.user,
        messages: req.flash('error')
      });
    })

    app.post('/add', function (req, res) {
      //TODO: add the place in the db
      res.render('index', {
        user: req.user,
        messages: req.flash('error')
      });
    })

    app.get('/search', function (req, res) {
      //TODO: implement search
      var result = mockPlaces;

      res.render('index', {
        places: encodeURI(JSON.stringify(result)),

        user: req.user,
        messages: req.flash('error')
      })
    })

    app.get('/closest', function (req, res) {
      var limit = req.params.limit || 50;
      var coords = req.params.coords.split(',');
      var category = req.params.category;

      var result = [];
      for (var i = 0, length = mockPlaces.length; i < length && result.length < limit; i++) {
        if (category in mockPlaces[i].categories) {
          result.push(mockPlaces[i])
        }
      }
      res.send(result);
    })

    app.get('/alloftype', function (req, res) {
      var limit = 50;
      var coords = req.params.coords.split(',');
      var category = req.params.category;

      var result = [];
      for (var i = 0, length = mockPlaces.length; i < length && result.length < limit; i++) {
        if (category in mockPlaces[i].categories) {
          result.push(mockPlaces[i])
        }
      }
      res.send(result);
    })

    app.get('/similar', function (req, res) {
      var place = decodeURI(req.params.original);

      res.send(place);
    })

  });
};

var mockPlaces = [{
  "name": "Аптека Ремедиум 1",
  "location": {
    "lat": 42.695384516317105,
    "lng": 23.330819606781006
  },
  "categories": "pharmacy",
  "description": "Аптеки Ремедиум - аптеки със сърце",
  "workingHours": [{
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 32400,
    "closes": 72000
  }],
  "open24hours": false,
  "additionalInfo": {
    "priceLevel": 1,
    "website": "http://www.remedium.bg/",
    "phone": "+359 2 981 31 29"
  }
}, {
  "name": "Аптека Гален",
  "location": {
    "lat": 41.93508823754436,
    "lng": 25.56097984313965
  },
  "categories": "pharmacy",
  "description": "Денонощна аптека\"Гален\"",
  "workingHours": [{
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }],
  "open24hours": true,
  "additionalInfo": {
    "priceLevel": 2,
    "phone": "+359 38 66 25 46"
  }
}, {
  "name": "Кино Одеон",
  "location": {
    "lat": 42.689007,
    "lng": 23.318979
  },
  "categories": "cinema",
  "description": "Филмотечно кино \"Одеон\"",
  "additionalInfo": {
    "priceLevel": 2,
    "phone": "+359 989 24 69",
    "website": "http://bnf.bg/bg/odeon/",
    "wifi": true,
    "seats": 100
  }
}, {
  "name": "БНБ",
  "location": {
    "lat": 42.6990905269458,
    "lng": 23.325519561767578
  },
  "categories": "bank, government",
  "description": "Българска народна банка",
  "workingHours": [{
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 0,
    "closes": 0
  }, {
    "opens": 0,
    "closes": 0
  }],
  "open24hours": false,
  "additionalInfo": {
    "phone": "+359 2 91 459",
    "website": "http://www.bnb.bg/"
  }
}]