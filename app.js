var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser     =         require("body-parser");
var mongo_client = require('mongodb').MongoClient;


var config = require('./config');
const database_location = config.db_location;
const db_user = config.username;
const db_password=config.password;
const db_database= config.database;
var db_connect_string=config.db_connect_string;

// console.log(db_connect_string);

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
var relative_person = require('./routes/relative_person');
var show_relative_person = require('./routes/show_relative_person');


var app = express();

// Establish connection to database & use the connection in modules as req.app.db
// mongo_client.connect('mongodb://sadmin:Kolkata#1@ds213896.mlab.com:13896/timeline_test',{useNewUrlParser: true},(err,conn)=>{
mongo_client.connect(db_connect_string,{useNewUrlParser: true},(err,conn)=>{  
  if(err) throw err;
  app.conn=conn;

  app.database=config.database;
  app.collection=config.collection;

})

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


app.use('/relative_person',relative_person);
app.use('/show_relative_person',show_relative_person);






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
