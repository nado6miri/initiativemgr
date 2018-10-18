var express = require('express');
var router = express.Router();

// User Define module....
var socketcomm = require('./socket_comm');
var initapi = require('./initapi');

/* GET home page. */
router.get('/', function(req, res, next) {
  socketcomm.socket_communication();
  res.render('index', { title: 'Express' });
});

module.exports = router;
