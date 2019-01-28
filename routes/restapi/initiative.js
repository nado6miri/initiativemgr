var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;

// User Define module....
var socketcomm = require('../socket_comm');
var initapi = require('../initapi');

//const cors = require('cors');
//router.use(cors({origin : 'http://collab.lge.com', optionsSuccessStatus : 200 })); // cors settings..

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.header("Content-Type", "text/html; charset=utf-8"); // header 설정
  //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // header 설정
  fs.readFile(__dirname + '/../../public/json/initiative_DB_46093_Latest.json', (err, data) => { // 파일 읽는 메소드
      if (err) {
          return console.error(err); // 에러 발생시 에러 기록하고 종료
      }
      //res.end(data, 'utf-8'); // 브라우저로 전송   
      res.send(data); // 브라우저로 전송   
  });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  socketcomm.socket_communication();
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'}); // header 설정
  data = "FEEDBACK ID = " + String(req.params.id);
  console.log("data = ", data);
  console.log("params = ", req.params.id);
  res.end(data, 'utf-8'); // 브라우저로 전송   
});

/* GET users listing. */
router.get('/update/:id', function(req, res, next) {
  console.log("Initiative ", req.params.id);
  if(req.params.id == "webOS4.5_MR_Minor")
  {
    initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 46093);   // webOS4.5 MR minor
  }
});



module.exports = router;

