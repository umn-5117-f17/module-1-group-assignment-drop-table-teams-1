var express = require('express');
var router = express.Router({ mergeParams: true });
var url = require('url');
// var bodyParser = require('body-parser');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("base survey render")
  res.render('about');
});

// router.get('/users', function(req, res, next) {
//
// 	console.log("user route");
// 	console.log(req.body);
// 	console.log('Route user test');
// 	//console.log(req.data);
//     res.render('index/user', { title: 'Hazelden' });
//     console.log('Route viz test');
//    // res.send('viz test');
// });

router.post('/', function(req, res, next) {
		console.log(req.body);

		res.render(req.body);
});

module.exports = router;
