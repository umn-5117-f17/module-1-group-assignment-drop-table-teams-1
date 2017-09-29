var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log('Route viz test');
    res.render('viz', { title: 'Viz' });
    console.log('Route viz test');
   // res.send('viz test');
});

module.exports = router;