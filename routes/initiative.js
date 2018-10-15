var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' }); // header 설정
  fs.readFile(__dirname + '/../views/chat.html', (err, data) => { // 파일 읽는 메소드
      if (err) {
          return console.error(err); // 에러 발생시 에러 기록하고 종료
      }
      res.end(data, 'utf-8'); // 브라우저로 전송   
  });
});


/* GET users listing. */
router.get('/list', function(req, res, next) {
  get_InitiativeList();
});


function get_InitiativeList()
{
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function()
    {
      if (xhttp.readyState === 4)
      {
        if (xhttp.status === 200)
        {
			  	var resultJSON = JSON.parse(xhttp.responseText);
			  	console.log(resultJSON.total, resultJSON);
			  	var json = JSON.stringify(resultJSON);
			  	fse.outputFileSync("./public/json/initiative_list", json, 'utf-8', function(e){
			  		if(e){
			  			console.log(e);
			  		}else{
			  			console.log("Download is done!");	
			  		}
			  	});
          console.log("Initiative List gathering ok");
        }
        else
        {
          console.log("AJAX Error...............");
        }
      }
    };

  var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
  var param = '{ "jql" : "filter=Initiative_webOS4.5_Initial_Dev","maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels"] };';
  xhttp.open("POST", searchURL, true);
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(param);
 } 

 /*   
function get_InitiativeList()
{
    var request = require("request");

    var options = { 
        method: 'POST',
        url: 'http://hlm.lge.com/issue/rest/api/2/search/',
        headers: { 
          'Postman-Token': '326c78f4-af52-40f1-8671-3c19a1bd3a3f',
          'Cache-Control': 'no-cache',
          'Authorization': 'Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=',
          'content-Type': 'application/json' 
        },
        body: '{\r\n\t "jql" : "filter=Initiative_webOS4.5_Initial_Dev" \r\n\t,"maxResults" : 1000\r\n    , "startAt": 0\r\n    ,"fields" : ["summary", "key", "assignee", "due", "status", "labels"]\r\n};' 
    };
 
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
} 
*/
module.exports = router;
