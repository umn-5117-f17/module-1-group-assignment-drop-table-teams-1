var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var qt = require('quickthumb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var index = require('./routes/index');
var users = require('./routes/users');
var survey = require('./routes/survey');
var data = require('./routes/data');
var about = require('./routes/about');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/data', data);
app.use('/survey', survey);
app.use('/about', about);

app.use('/public', qt.static(__dirname + '/public/images'));
app.use('/scripts', express.static(__dirname + '/node_modules/viewerjs/dist/'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next){
	if(err){
	console.log(err);
	next(err);
			}
	else {
		next();
	}
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
