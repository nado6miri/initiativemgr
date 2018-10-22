var express = require('express');
var mysql      = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({
  host     : '10.186.115.57',
  user     : 'initiative',
  password : 'initiativemgr',
  port     : 3306,
  database : 'initiative'
});

connection.connect(function(err) 
{
  if (err) 
  {
      console.error('mysql connection error');
      console.error(err);
      throw err;
  }
  console.log("mysql connected OK...")
});

var index = 1;
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('Save Initiative List to mysql DB');

  let result = connection.query('SELECT * from webos50', function(err, rows, fields) 
  {
    if (!err)
    {
      console.log('The solution is: ', rows);
      res.send(JSON.stringify(rows)); // send json format
      //connection.query("INSERT INTO webos50(id, jiraid, summary) VALUES (?, ?, ?)", [index, 'TVPLAT-'+index.toString(), "Test Initiative.."], function(){ });
      index++;
    }
    else
      console.log('Error while performing Query.', err);
  });
  console.log(result);
  //connection.release();
  connection.end();
});

module.exports = router;
