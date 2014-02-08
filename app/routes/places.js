var config = require('../config/environments.js');


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/places/add', function(req,res){
      res.render('addplace', {
        user: req.user,
        messages: req.flash('error')
      });
    })

    app.post('/places/add', function(req,res){
      //TODO: add the place in the db
      res.render('/', {
        user: req.user,
        messages: req.flash('error')
      });
    })
  });
};