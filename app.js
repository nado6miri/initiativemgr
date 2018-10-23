var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var chatRouter = require('./routes/chat');
var initiativeRouter = require('./routes/initiative');
var mysqlSaveRouter = require('./routes/mysqlsave');

var tmr = require('./routes/mytimer');
var initapi = require('./routes/initapi');

var app = express();

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
app.use('/mysqlsave', mysqlSaveRouter);

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

function getInitiativeList(filterID)
{
  // Use Promise Object
  initapi.get_InitiativeListfromJira(filterID).then(function (jsondata)
  {
    for (i = 0; i < jsondata.total; i++) {
      initapi.jira_initiative_keylist.push(jsondata["issues"][i]["key"]);
    }     
    console.log("Initiative List gathering ok - Promise");
    console.log(jsondata);
    console.log(initapi.jira_initiative_keylist);
  }).catch(function (err)
  {
    console.log("Initiative List gathering NG - Promise");
    console.log(err);
  });
}  

tmr.Timer_Setting(13, 17, 50, getInitiativeList, "42021");

module.exports = app;
