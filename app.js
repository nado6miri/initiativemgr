var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var chatRouter = require('./routes/chat');
var initiativeRouter = require('./routes/initiative');
//var mysqlSaveRouter = require('./routes/mysqlsave');

var tmr = require('./routes/mytimer');
var initapi = require('./routes/initapi');
var lgldap = require('./routes/lgeldap');
var moment = require('moment-timezone')

var app = express();

moment.tz.setDefault("Asiz/Seoul");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/chat', chatRouter);
app.use('/initiative', initiativeRouter);
//app.use('/mysqlsave', mysqlSaveRouter);

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

function periodic_DBjobs()
{
  // Use Promise Object
  //initapi.makeSnapshot_InitiativeInfofromJira(42101); // webOS4.5
  //initapi.makeSnapshot_InitiativeInfofromJira(45400);   // webOS5.0
  //initapi.makeSnapshot_InitiativeInfofromJira(46093);   // webOS4.5 MR minor
  //console.log('curruent time = ', moment());
  initapi.makeSnapshot_InitiativeInfofromJira(46610);   // webOS4.5 MR minor

  /*
  lgldap.get_UserInfofromLDAP('boyoung.cho');  
  lgldap.get_UserInfofromLDAP('sungbin.na');
  */
 
  /*
  var date = new Date();
  var time = date.getHours().toString();
  var min = date.getMinutes().toString();
  var snapshot = date.toISOString().substring(0, 10);
  snapshot = snapshot + "T" + time + min;
  console.log(snapshot);
  var json = { 'snapshotDate' : 0 };
  json['snapshotDate'] = snapshot; 
  console.log(json['snapshotDate']);
  console.log(snapshot);
  */
}  

//tmr.Timer_Setting(12, 20, 10, periodic_DBjobs);
periodic_DBjobs();

module.exports = app;
