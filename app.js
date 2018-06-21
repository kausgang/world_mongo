var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser     =         require("body-parser");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var get_content = require('./routes/get_content');
var add_event = require('./routes/add_event');
var update_year = require('./routes/update_year');
var add_person = require('./routes/add_person');
var update_person = require('./routes/update_person');
var home = require('./routes/home');
var search_person = require('./routes/search_person');
var selected_person = require('./routes/selected_person');


var app = express();


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use('/get_content',get_content);
app.use('/add_event',add_event);

app.use('/update_year',update_year);
app.use('/home', home); //used to redirecto to home page

app.use('/add_person',add_person);
app.use('/update_person',update_person);

app.use('/search_person',search_person);
app.use('/selected_person',selected_person);

// app.get('/evaluate',function(req,res){

//   console.log('heere')
//   // return res.send(req.query);
//   // res.send('<script>alert("s")</script>');
//   // res.redirect('/')
//   res.render('/evaluate')
// });






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
