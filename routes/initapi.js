var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;

var initiative_DB = [];
// initiative filter result (json) - webOS45 webOS45MR, webOS5.0 
var initiative_FilterResult;
var initiative_keylist = [];

// epic filter result (json) - epic list depend on intitative key
var epic_FilterResult;
var epic_keylist = [];

// epic filter result (json) - story list depend on epic key
var story_FilterResult;
var story_keylist = [];

var default_Sprint_Info = {
  'TVSP1_1' : '',  'TVSP1_2' : '',  'TVSP2_1' : '',  'TVSP2_2' : '',
  'TVSP3_1' : '',  'TVSP3_2' : '',  'TVSP4_1' : '',  'TVSP4_2' : '',
  'TVSP5_1' : '',  'TVSP5_2' : '',  'TVSP6_1' : '',  'TVSP6_2' : '',
  'TVSP7_1' : '',  'TVSP7_2' : '',  'TVSP8_1' : '',  'TVSP8_2' : '',
  'TVSP9_1' : '',  'TVSP9_2' : '',  'TVSP10_1' : '',  'TVSP10_2' : '',
  'TVSP11_1' : '',  'TVSP11_2' : '',  'TVSP12_1' : '',  'TVSP12_2' : '',
  'TVSP13_1' : '',  'TVSP13_2' : '',  'TVSP14_1' : '',  'TVSP14_2' : '',
  'TVSP15_1' : '',  'TVSP15_2' : '',  'TVSP16_1' : '',  'TVSP16_2' : '',
  'TVSP17_1' : '',  'TVSP17_2' : '',  'TVSP18_1' : '',  'TVSP18_2' : '',
  }

var default_epic_info = {
      'Epic Key' : '',
      'Release_SP' : '',
      'Summary' : "",
      'Assignee' : '',
      'duedate' : '',
      'Status' : '',
      'CreatedDate' : '',
      'TVSP' : default_Sprint_Info,
      'StoryCnt': 0,
      'StoryResolutionCnt' : 0,
      'RescheduleCnt' : 0,
      'STORY' : [],
      'AbnormalEpicSprint' : '',
      "GovOrDeployment" : '',
  };

var default_initiative_info = {
  'Initiative Key' : '',
  'Summary' : '',
  'Assignee' : '',
  'Status' : '',
  'Release_SP' : '',
  'CreatedDate' : '',
  '관리대상' : '',
  'Risk 관리 대상' : '',
  'Initiative Order' : '',
  'EPIC' : [],
  'DEMO' : [],
  'CCC' : [],
  'TestCase' : [],
  'Dev_Verification' : [],
  'TVSP' : default_Sprint_Info,
  'Status Color' : '',
  'SE_Delivery' : '',
  'SE_Quality' : '',
  'ScopeOfChange' : '',
  'EpicCnt' : '',
  'EpicResolutionCnt' : '',
  'StoryCnt' : 0,
  'StoryResolutionCnt' : 0,
  'RMS' : '',
  'RescheduleCnt' : 0,
  'EpicDelayedCnt' : 0,
  'STEOnSite' : '',
  'AbnormalEpicSprint' : '',
  "GovOrDeployment" : '',
      };


  var default_story_info = 
  {
    'Story Key' : '',
    'Release_SP' : '',
    'Summary' : "",
    'Assignee' : '',
    'duedate' : '',
    'Status' : '',
    'CreatedDate' : '',
    'TVSP' : default_Sprint_Info,
    'StoryZephyrCnt': 0,
    'StoryZephyrResolutionCnt' : 0,
    'RescheduleCnt' : 0,
    'Zephyr' : [],
    'AbnormalStorySprint' : '',
    "GovOrDeployment" : '',
};
  

// Javascript 비동기 및 callback function.
// https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/
// Use Promise Object
function get_InitiativeListfromJira(filterID)
{
    return new Promise(function (resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4)
        {
          if (xhttp.status === 200)
          {
            var resultJSON = initiative_FilterResult = JSON.parse(xhttp.responseText);
            var json = JSON.stringify(resultJSON);
            fse.outputFileSync("./public/json/initiative_list", json, 'utf-8', function(e){
              if(e){
                console.log(e);
              }else{
                console.log("Download is done!");	
              }
            });
            resolve(resultJSON);
          }
          else
          {
            reject(xhttp.status);
          }        
      }
    }

    filterID = "filter="+filterID.toString();
    //console.log("filterID = ", filterID);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    //var param = '{ "jql" : "filter=Initiative_webOS4.5_Initial_Dev","maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels"] };';
    //var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks"] };
    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });
}


function get_InitiativeList(res, res, next)
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
          res.send('Initiative List gathering ok');
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

function get_makeSnapshot_InitiativeInfofromJira(filterID)
{
  // Use Promise Object
  get_InitiativeListfromJira(filterID)
  .then((filteredJsonData) => {
    console.log("[Promise 1] get Initiative List and Iinitiative Key List from JIRA");
    //console.log(filteredJsonData);

    return new Promise((resolve, reject) => {
      for (var i = 0; i < filteredJsonData.total; i++) {
        initiative_keylist.push(filteredJsonData["issues"][i]["key"]);
      }     
      resolve(initiative_keylist);
    });
  })
  .then((initkeylist) => {
    console.log("[Proimse 2] Make a Epic List from Initiative Key List ");
    //console.log(initkeylist);
    /*
      var key = jsondata["issues"][i]["key"];
      var summary = jsondata["issues"][i]["fields"]["summary"];
      var status = jsondata["issues"][i]["fields"]["status"]["name"];
      var assignee = jsondata["issues"][i]["fields"]["assignee"]["displayName"];
      assignee = assignee.substring(0, assignee.indexOf(' '));
      var due = jsondata["issues"][i]["fields"]["due"];
      for(var i = 0; i < initiative_FilterResult["issues"].length; i++){
        var dissue = initiative_FilterResult['issues'][i];
        //console.log(dissue);
      }
      */

    initkeylist.forEach((value, index) => { 
      console.log("index = ", index, "value =", value); 
      default_initiative_info['Initiative Key'] = value;
      getEpicListfromJira(value)
      .then((epiclist) => {
        console.log(epiclist);
        epic_keylist = [];
        for (var i = 0; i < epiclist.total; i++) {
          epic_keylist.push(epiclist["issues"][i]["key"]);
        }     
        default_initiative_info['EPIC'] = epic_keylist;
        console.log(default_initiative_info['EPIC']);
        //initiative_DB['Initiative Key']['EPIC'] = epic_keylist;
        //console.log(initiative_DB);
      })
      .catch((error) => { console.log(error); });
    }); 
  })
  .then((initlist1) => {
    console.log("[Proimse 3] then : initlist1 = ", initlist1);
    return new Promise((resolve, reject) => {
      resolve("---");
    });
  })
  .then((epic) => {
    console.log("[Proimse 4] then epic = : ", epic);
    return new Promise((resolve, reject) => {
      reject("can't find epic error from initiative");
    });
  })
  .catch(function (err){
    console.log("Proimse exception : Initiative List gathering NG - Promise");
    console.log(err);
  });
}


function getEpicListfromJira(initiativeKey)
{
  return new Promise(function (resolve, reject){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4)
      {
        if (xhttp.status === 200)
        {
          var resultJSON = epic_FilterResult = JSON.parse(xhttp.responseText);
          var json = JSON.stringify(resultJSON);
          resolve(resultJSON);
        }
        else
        {
          reject(xhttp.status);
        }        
      }
    }
    let filterjql = "issue in linkedissues(" + initiativeKey + ")";
    console.log("filterjql = ", filterjql);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks"] };
    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });    
}  

function getStoryListfromJira(epicKey)
{

}  

function getEpicZephyerListfromJira(initiativeKey)
{

}  

function getStoryZephyerListfromJira(epicKey)
{

}  




module.exports = { 
  initiative_DB,              // final DB
  initiative_FilterResult,    // initiative JOSN Object from JIRA Filter
  initiative_keylist,         // initiative Key List Only.
  // function
  get_InitiativeListfromJira,  // promise
  get_InitiativeList,          // callback
  get_makeSnapshot_InitiativeInfofromJira,
 };
