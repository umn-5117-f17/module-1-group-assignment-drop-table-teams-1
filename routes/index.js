var express = require('express');
var router = express.Router();
var parse = require('csv-parse');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log('Index Test');
});


module.exports = router;