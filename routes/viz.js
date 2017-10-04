var express = require('express');
var router = express.Router();
// var bodyParser = require('body-parser');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log('Route viz test');
	//console.log(req.data);
    res.render('viz', { title: 'Viz' });
    console.log('Route viz test');
   // res.send('viz test');
});

router.post('/', function(req, res, next) {
		console.log(req.body);
		res.json(req.body);
});

module.exports = router;
