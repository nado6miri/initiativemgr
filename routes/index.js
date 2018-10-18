var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  socket_communication();
  res.render('index', { title: 'Express' });
});

module.exports = router;
