var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;
var initparse = require('./parsejirafields');
var ldap = require('./lgeldap.js')

var async_mode = true;
var changelog = true;

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
  };

var initiative_DB = {
  'total' : 0,
  'snapshotDate' : '2018',
  'issues' : [], // initiative issue list
};  

var current_demo_info = {
  'key' : '',
  'summary' : '',
  'praize' : false,
};

var story_point = 
{
  'PlanSP' : 0,
  'BurnedSP' : 0,
  'RemainSP' : 0,
};
  
var current_epic_info = {};
var epic_info =  
{
    'Epic Key' : '',
    'Release_SP' : '',
    'Summary' : '',
    'Assignee' : '',
    'duedate' : '',
    'Status' : '',
    'CreatedDate' : '',
    'RescheduleCnt' : 0,
    'AbnormalSprint' : false,
    "GovOrDeployment" : '',
    'Organization' :'', 
    'StoryPoint' : story_point,
    'DHistory' :  
    [
        { 'orginal' : 'TVSP1' }, 
    ],
    'Zephyr' : 
    {
      'ZephyrCnt': 0,
      'ZephyrResolutionCnt' : 0,
      'ZephyrExecutionCnt' : 0,
      'ZephyrExecutionRate' : 0, 
      'ZephyrExecutionPortion' : 0, 
      'Zephyr_S_Draft' : 0, 
      'Zephyr_S_Review' : 0, 
      'Zephyr_S_Update' : 0, 
      'Zephyr_S_Active' : 0, 
      'executionStatus_unEXEC' : 0, 
      'executionStatus_PASS' : 0, 
      'executionStatus_FAIL' : 0, 
      'executionStatus_WIP' : 0, 
      'executionStatus_BLOCK' : 0,     
      "ZephyrTC": [],       
    },
    'STORY' : 
    {
      'STORY_SUMMARY' : 
      {
          'StoryTotalCnt': 0,
          'StoryDevelCnt': 0,
          'StoryGovOrDeploymentCnt': 0,
          'StoryTotalResolutionCnt' : 0,
          'StoryDevelResolutionCnt' : 0,
          'StoryGovOrDeploymentResolutionCnt' : 0,
          'StoryDelayedCnt' : 0,
      },  
      'issues' : [], // story issue list
    },
};

var current_OrgInfo = {};
var OrgInfo =     
{ 
  'OrgName' : '', 
  'TotalStatics' : 
  {
    'ZephyrTotalCnt' : 0,
    'ZephyrPortion' : 0, 
    'ZephyrExecutionCnt' : 0, 
    'ZephyrExecutionRate' : 0, 
    'ZephyrExecutionPortion' : 0, 
    'Zephyr_S_Draft' : 0, 
    'Zephyr_S_Review' : 0, 
    'Zephyr_S_Update' : 0, 
    'Zephyr_S_Active' : 0, 
    'executionStatus_unEXEC' : 0, 
    'executionStatus_PASS' : 0, 
    'executionStatus_FAIL' : 0, 
    'executionStatus_WIP' : 0, 
    'executionStatus_BLOCK' : 0, 
  },
  'EpicStatics' : 
  {
    'EpicTotalCnt': 0,
    'EpicDevelCnt': 0,
    'EpicGovOrDeploymentCnt': 0,
    'EpicTotalResolutionCnt' : 0,
    'EpicDevelResolutionCnt' : 0,
    'EpicGovOrDeploymentResolutionCnt' : 0,
    'EpicDelayedCnt' : 0,
    'EpicDevelPortion' : 0, 
    'EpicNeedtoDefine' : 0,
    'EpicZephyrCnt' : 0, 
    'EpicZephyrPortion' : 0, 
    'EpicZephyrExecutionCnt' : 0, 
    'EpicZephyrExecutionRate' : 0, 
    'EpicZephyrExecutionPortion' : 0, 
    'EpicZephyr_S_Draft' : 0, 
    'EpicZephyr_S_Review' : 0, 
    'EpicZephyr_S_Update' : 0, 
    'EpicZephyr_S_Active' : 0, 
    'EpicexecutionStatus_unEXEC' : 0, 
    'EpicexecutionStatus_PASS' : 0, 
    'EpicexecutionStatus_FAIL' : 0, 
    'EpicexecutionStatus_WIP' : 0, 
    'EpicexecutionStatus_BLOCK' : 0, 
    //“-1” UNEXECUTED, “1” PASS, “2” FAIL, “3” WIP, “4” BLOCKED” 
  },
  'StoryStatics' : 
  {
    'StoryTotalCnt': 0,
    'StoryDevelCnt': 0,
    'StoryGovOrDeploymentCnt': 0,
    'StoryTotalResolutionCnt' : 0,
    'StoryDevelResolutionCnt' : 0,
    'StoryGovOrDeploymentResolutionCnt' : 0,
    'StoryDelayedCnt' : 0,
    'StoryDevelPortion' : 0, 
    'StoryNeedtoDefine' : 0,
    'StoryZephyrCnt' : 0,
    'StoryZephyrPortion' : 0, 
    'StoryZephyrExecutionCnt' : 0, 
    'StoryZephyrExecutionRate' : 0, 
    'StoryZephyrExecutionPortion' : 0, 
    'StoryZephyr_S_Draft' : 0, 
    'StoryZephyr_S_Review' : 0, 
    'StoryZephyr_S_Update' : 0, 
    'StoryZephyr_S_Active' : 0, 
    'StoryexecutionStatus_unEXEC' : 0, 
    'StoryexecutionStatus_PASS' : 0, 
    'StoryexecutionStatus_FAIL' : 0, 
    'StoryexecutionStatus_WIP' : 0, 
    'StoryexecutionStatus_BLOCK' : 0, 
    //“-1” UNEXECUTED, “1” PASS, “2” FAIL, “3” WIP, “4” BLOCKED”
  },
};


var current_initiative_info = { };
var initiative_info =
{
  'Initiative Key' : '',
  'created' : '',
  'Summary' : '',
  'Assignee' : '',
  '관리대상' : '',
  'Risk관리대상' : '',
  'Initiative Order' : '',
  'Initiative Score' : '', 
  'Status Color' : '',
  'SE_Delivery' : '',
  'SE_Quality' : '',
  'ScopeOfChange' : '',
  'RMS' : '',
  'STESDET_OnSite' : '',
  'AbnormalSprint' : false,
  "GovOrDeployment" : '',
  'Demo' : [],
  'StoryPoint' : { },
  'FixVersion' : [ ],
  'Organization' : [ ],  
  'Workflow' : { }, 
  'ReleaseSprint' : { },
  'STORY_SUMMARY' : 
  {
      'StoryTotalCnt': 0,
      'StoryDevelCnt': 0,
      'StoryGovOrDeploymentCnt': 0,
      'StoryTotalResolutionCnt' : 0,
      'StoryDevelResolutionCnt' : 0,
      'StoryGovOrDeploymentResolutionCnt' : 0,
      'StoryDelayedCnt' : 0,
    },

  'EPIC' : 
  {
    'EpicTotalCnt': 0,
    'EpicDevelCnt': 0,
    'EpicGovOrDeploymentCnt': 0,
    'EpicTotalResolutionCnt' : 0,
    'EpicDevelResolutionCnt' : 0,
    'EpicGovOrDeploymentResolutionCnt' : 0,
    'EpicDelayedCnt' : 0,
    'issues' : [],    
  },
};

var current_story_info;
var story_info = 
{
  'Story Key' : '',
  'Release_SP' : '',
  'Summary' : '',
  'Assignee' : '',
  'duedate' : '',
  'Status' : '',
  'CreatedDate' : '',
  'AbnormalSprint' : '',
  'GovOrDeployment' : '',
  'Organization' :'', 
  'StoryPoint' : {} ,
  'Zephyr' : 
  {
    'ZephyrCnt': 0,
    'ZephyrResolutionCnt' : 0,
    'ZephyrExecutionCnt' : 0,
    'ZephyrExecutionRate' : 0, 
    'ZephyrExecutionPortion' : 0, 
    'Zephyr_S_Draft' : 0, 
    'Zephyr_S_Review' : 0, 
    'Zephyr_S_Update' : 0, 
    'Zephyr_S_Active' : 0, 
    'executionStatus_unEXEC' : 0, 
    'executionStatus_PASS' : 0, 
    'executionStatus_FAIL' : 0, 
    'executionStatus_WIP' : 0, 
    'executionStatus_BLOCK' : 0,     
    'ZephyrTC': [],       
  },
};

var zephyr_issueIdlist = [];

var current_zephyr_info = {};
var zephyr_info = 
{
  'IssueID' : 0,
  'Zephyr Key' : '',
  'Summary' : '',
  'Assignee' : '',
  'Organization' :'', 
  'Status' : '',
  'Label' : '',
  'ExeRecordsCnt' : 0,
  'Executions': [],
}     

var current_zephyr_exeinfo = {};
var zephyr_exeinfo = 
{
  'id': 0,
  'executionStatus': '',
  'executionOn': '',
  'executedBy': '',
  'Organization' :'', 
  'cycleId': 0,
  'cycleName': ''
}

var current_workflow = {};
var workflow = 
{   
  'CreatedDate' : '',
  'Status' : '',
  "DRAFTING" : { "Duration" : 0, 'History' :[ ] } ,             
  "PO REVIEW" : { "Duration" : 0, 'History' :[ ] } ,             
  "ELT REVIEW" : { "Duration" : 0, 'History' :[ ] } ,             
  "APPROVED" : { "Duration" : 0, 'History' :[ ] } ,             
  "BACKLOG REFINEMENT" : { "Duration" : 0, 'History' :[ ] } ,             
  "READY" : { "Duration" : 0, 'History' :[ ] } ,             
  "IN PROGRESS" : { "Duration" : 0, 'History' :[ ] } ,             
  "DELIVERED" : { "Duration" : 0, 'History' :[ ] } ,             
  "PROPOSED TO DEFER" : { "Duration" : 0, 'History' :[ ] } ,             
  "DEFERRED" : { "Duration" : 0, 'History' :[ ] } ,             
  "CLOSED" : { "Duration" : 0, 'History' :[ ] }  ,             
};

var current_ReleaseSP = {};
var ReleaseSP = 
{
  'OrgRelease_SP' : '',
  'CurRelease_SP' : '',
  'RescheduleCnt' : 0,
  'History' :
  [
     // { 'ChangeSP' : 'TVSP6', 'ChangeDate' : '20190101', "ReleaseSP" : "" },  // History 상에 Ready 단계 이후 처음으로 입력된 value.
  ],
};


// Javascript 비동기 및 callback function.
// https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/
// Use Promise Object
function get_InitiativeListfromJira(querymode, jql)
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
            fse.outputFileSync("./public/json/initiative_list.json", json, 'utf-8', function(e){
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

    if(querymode == "filterID")
    { // search by filterID
      filterID = "filter="+jql.toString();
    }
    else
    { // search by key...
      filterID = "key="+jql.toString();
    }

    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    console.log("get_InitiativeListfromJira : filterID = ", filterID);
    //var param = '{ "jql" : "filter=Initiative_webOS4.5_Initial_Dev","maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels"] };';
    //var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks", "resolution", "components", "issuetype", "customfield_15926",
                              "customfield_15710", "customfield_15711", "customfield_16988", "customfield_16984", "customfield_16983", "customfield_15228", 
                              "customfield_16986", "created", "updated", "duedate", "resolutiondate", "labels", "description", "fixVersions", "customfield_15104", 
                              "reporter", "assignee", "customfield_10105", "customfield_16985", 
                             ] };

    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });
}

function get_InitiativeListfromJiraWithChangeLog(querymode, jql)
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
            fse.outputFileSync("./public/json/initiative_list.json", json, 'utf-8', function(e){
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

    if(querymode == "filterID")
    { // search by filterID
      filterID = "filter="+jql.toString();
    }
    else
    { // search by key...
      filterID = "type = Initiative and key="+jql.toString();
    }
    
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/?expand=changelog';
    console.log("get_InitiativeListfromJiraWithChangeLog : filterID = ", filterID);
    //var param = '{ "jql" : "filter=Initiative_webOS4.5_Initial_Dev","maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels"] };';
    //var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,
                  "expand" : ["changelog"], 
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks", "resolution", "components", "issuetype", "customfield_15926",
                              "customfield_15710", "customfield_15711", "customfield_16988", "customfield_16984", "customfield_16983", "customfield_15228", 
                              "customfield_16986", "created", "updated", "duedate", "resolutiondate", "labels", "description", "fixVersions", "customfield_15104", 
                              "reporter", "assignee", "customfield_10105", "customfield_16985", 
                             ] };

    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
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
          /*
          fse.outputFileSync("./public/json/epic_list", json, 'utf-8', function(e){
            if(e)
            {
              console.log(e);
            }
            else
            {
              console.log("Download is done!");	
            }
          });
          */
          resolve(resultJSON);
        }
        else
        {
          console.log("getEpicListfromJira -- xhttp.status Error = ", xhttp.status)
          reject(xhttp.status);
        }        
      }
    }

    let filterjql = '(issuetype = epic) AND issuefunction in linkedissuesOf(\"key=' + initiativeKey + '\"' + ')';
    //let filterjql = "(issuetype = epic) AND issue in linkedissues(" + initiativeKey + ")";
    // console.log("filterjql = ", filterjql);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';

    //var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "resolution", "components", "issuetype",  "created", "updated", 
                              "duedate", "resolutiondate", "labels", "reporter"] 
                };
                /* 
                "customfield_15926", "customfield_15710", "customfield_15711", "customfield_16988", "customfield_16984", "customfield_16983", "customfield_15228", 
                "customfield_16986", "customfield_15104", "customfield_10105", "customfield_16985",
                */
    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });    
}  

function getStoryListfromJira(epicKey)
{
  return new Promise(function (resolve, reject){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4)
      {
        if (xhttp.status === 200)
        {
          var resultJSON = JSON.parse(xhttp.responseText);
          var json = JSON.stringify(resultJSON);
          /*
          fse.outputFileSync("./public/json/epic_list", json, 'utf-8', function(e){
            if(e)
            {
              console.log(e);
            }
            else
            {
              console.log("Download is done!");	
            }
          });
          */
          resolve(resultJSON);
        }
        else
        {
          console.log("getStoryListfromJira -- xhttp.status Error = ", xhttp.status)
          reject(xhttp.status);
        }        
      }
    }

    let filterjql = '(issuetype = story) AND issuefunction in linkedissuesOf(\"key=' + epicKey + '\"' + ')';
    console.log("filterjql = ", filterjql);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    //var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "resolution", "components", "issuetype",  "created", "updated", 
                  "duedate", "resolutiondate", "labels", "reporter"] };

    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });    
}  


function getZephyerListfromJira(KeyID)
{
  return new Promise(function (resolve, reject){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4)
      {
        if (xhttp.status === 200)
        {
          var resultJSON = JSON.parse(xhttp.responseText);
          var json = JSON.stringify(resultJSON);
          resolve(resultJSON);
        }
        else
        {
          console.log("getZephyerListfromJira -- xhttp.status Error = ", xhttp.status)
          reject(xhttp.status);
        }        
      }
    }

  
  let filterjql = "type = test AND issueFunction in linkedIssuesOfRecursiveLimited(" + "\'issueKey = " + KeyID + "\', 1)";

  //console.log("Zephyr filterjql = ", filterjql);
  var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
  var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : ["id", "summary", "key", "assignee", "status", "labels" ] };

  xhttp.open("POST", searchURL, true);
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(JSON.stringify(param));  
  });    
}  


function getZephyerExecutionfromJira(IssueID)
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
          //console.log("Executions", json);
          resolve(resultJSON);
        }
        else
        {
          console.log("getZephyerExecutionfromJira -- xhttp.status Error = ", xhttp.status)
          reject(xhttp.status);
        }        
      }
    }

  var searchURL = 'http://hlm.lge.com/issue/rest/zapi/latest/execution?issueId=' + IssueID;
  var param = { 'issueId' : IssueID, "fields" : [ "id", "executionStatus", "executedBy", "cycleId", "cycleName" ] };
  xhttp.open("GET", searchURL);
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(null);  
  });    
}  


function saveInitDB(jsonObject)
{
  var json = JSON.stringify(jsonObject);
  fse.outputFileSync("./public/json/initiative_DB_"+initiative_DB['snapshotDate']+".json", json, 'utf-8', function(e){
    if(e){
      console.log(e);
    }else{
      console.log("Download is done!");	
    }
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
var get_errors = 
{
   'epiclist' : [ ], // initiative key list that failed to get epic list.
   'storylist' : [ { 'IK' : '', 'EK' : '' }, ],
   'e_zephyrlist' : [ { 'IK' : '', 'EK' : '' }, ],
   'e_zephyr_exeinfo' : [ { 'IK' : '', 'EK' : '', 'ZK': '', 'ZID' : '' }, ], 
   's_zephyrlist' : [ { 'IK' : '', 'EK' : '', 'SK' : '' }, ],
   's_zephyr_exeinfo' : [ { 'IK' : '', 'EK' : '', 'SK' : '', 'ZK': '', 'ZID' : '' }, ], 
};
*/

var get_errors = 
{
   'epiclist' : [ ], // initiative key list that failed to get epic list.
   'storylist' : [ ],
   'e_zephyrlist' : [ ],
   'e_zephyr_exeinfo' : [ ], 
   's_zephyrlist' : [ ],
   's_zephyr_exeinfo' : [ ], 
};


async function makeSnapshot_InitiativeInfofromJira(querymode, filterID)
{
  var date = starttime = new Date();
  var time = date.getHours().toString();
  var min = date.getMinutes().toString();
  var snapshot = date.toISOString().substring(0, 10);
  snapshot = querymode+"_"+filterID+"_"+snapshot + "T" + time + ":" + min;
  initiative_DB['snapshotDate'] = snapshot;

  var get_InitiativelistfromJirafunc = null;
  if(changelog)
  {
    get_InitiativelistfromJirafunc = get_InitiativeListfromJiraWithChangeLog;
  }
  else
  {
    get_InitiativelistfromJirafunc = get_InitiativeListfromJira;
  }

  // Use Promise Object
  await get_InitiativelistfromJirafunc(querymode, filterID)
  .then((initiativelist) => {
    // input : initiative filter id --> the search result of initiative (JSON Object)
    // output : epic list and update of basic epic info depend on initiative 
    console.log("[Promise 1] Get Initiative List / Update Basic Info and Iinitiative Key List from JIRA");
    //console.log(JSON.stringify(initiativelist));

    initiative_DB['total'] = initiativelist.total;
    var issue = 0;
    for (var i = 0; i < initiativelist.total; i++) {
      initiative_keylist.push(initiativelist['issues'][i]['key']);
      issue = initiativelist['issues'][i];
      // need to be update initiative info
      current_initiative_info = JSON.parse(JSON.stringify(initiative_info)); // initialize...
      current_initiative_info['Initiative Key'] = initparse.getKey(issue);        
      current_initiative_info['created'] = initparse.getCreatedDate(issue);        
      current_initiative_info['Summary'] = initparse.getSummary(issue);        
      current_initiative_info['Assignee'] = initparse.getAssignee(issue);        
      current_initiative_info['관리대상'] = initparse.checkLabels(issue, 'SPE_M');
      current_initiative_info['Risk관리대상'] = initparse.checkLabels(issue, 'SPE_R');        
      current_initiative_info['Initiative Score'] = initparse.getInitiativeScore(issue);        
      current_initiative_info['Initiative Order'] = initparse.getInitiativeOrder(issue);        
      current_initiative_info['Status Color'] = initparse.getStatusColor(issue);        
      current_initiative_info['SE_Delivery'] = initparse.getSE_Delivery(issue);        
      current_initiative_info['SE_Quality'] = initparse.getSE_Quality(issue);       
      current_initiative_info['ScopeOfChange'] = initparse.getScopeOfChange(issue);        
      current_initiative_info['RMS'] = initparse.checkRMSInitiative(issue);       
      current_initiative_info['STESDET_OnSite'] = initparse.getSTESDET_Support(issue);        
      current_initiative_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);    
      current_initiative_info['FixVersion'] = initparse.getFixVersions(issue);     
      //current_initiative_info['Organization'].push(JSON.parse(JSON.stringify(current_OrgInfo)));    

      // Release Sprint
      current_ReleaseSP = JSON.parse(JSON.stringify(ReleaseSP)); // initialize...
      current_ReleaseSP['CurRelease_SP'] = initparse.conversionReleaseSprintToSprint(initparse.getReleaseSprint(issue));
      current_ReleaseSP = initparse.parseReleaseSprint(initiativelist['issues'][i]['changelog'], current_ReleaseSP);
      current_initiative_info['ReleaseSprint'] = JSON.parse(JSON.stringify(current_ReleaseSP)); 

      // workflow
      current_workflow = JSON.parse(JSON.stringify(workflow)); // initialize...
      current_workflow['CreatedDate'] = initparse.getCreatedDate(issue);
      current_workflow['Status'] = initparse.getStatus(issue);
      current_workflow = initparse.parseWorkflow(initiativelist['issues'][i]['changelog'], current_workflow);
      current_initiative_info['Workflow'] = JSON.parse(JSON.stringify(current_workflow)); 
    
      //console.log("^^^^Initiative Key = ", initiativelist['issues'][i]['key']);
      //console.log(current_initiative_info);
      // reference site --- http://hong.adfeel.info/frontend/javascript-%EA%B0%9D%EC%B2%B4-deep-copy/
      // JSON방식으로 deep copy를 수행했을때 Date형식의 데이터가 제대로 deep copy되지 않는 현상을 발견하였다. 따라서 Object.assign() 사용하나 arraylist deep copy는 안됨.
      //initiative_DB['issues'][i] = Object.assign({}, current_initiative_info); 
      // error case : [].push는 object copy시 shallow copy임. 주의 필요함.
      //initiative_DB['issues'].push(current_initiative_info); // error case --> push = object shallow copy, reference copy 
      initiative_DB['issues'][i] = JSON.parse(JSON.stringify(current_initiative_info)) // object copy --> need deep copy
      //console.log("i = ", i, "\n", initiative_DB['issues'][i]);
    }     
  }).catch(error => {
    console.log("[Catch] get_InitiativeListfromJira - exception error = ", error)
  });

  await makeSnapshot_EpicInfofromJira(initiative_keylist);
  console.log("[final] Save file = initiative_DB");
  saveInitDB(initiative_DB);
  console.log("[final] Save end : initiative_DB");
  console.log("Error List = ", JSON.stringify(get_errors));
  fse.outputFileSync("./public/json/errorlist.json", JSON.stringify(get_errors), 'utf-8', function(e){
    if(e){
      console.log(e);
    }else{
      console.log("file write error list - done!");	
    }
  });
}



async function makeSnapshot_EpicInfofromJira(initkeylist)
{
  // input : initiative key list = [ 'TVPLAT-XXXX', 'TVPLAT-XXXX', .... ]
  // output : epic list and update of basic epic info depend on initiative 
  console.log("[Proimse 2] makeSnapshot_EpicInfofromJira ---- Get Epic List / Update Epic Basic Info");
  //console.log(initkeylist);

  // Epic List Update.....
  for(var i = 0; i < initiative_DB['total']; i++) 
  {
    var init_keyvalue = initkeylist[i];
    await getEpicListfromJira(init_keyvalue)
    .then((epiclist) => {
      //console.log(epiclist);
      console.log("getEpicListfromJira ==== [I-index]:", i, "[I-Key]:", init_keyvalue);
      epic_keylist = new Array();
      let issue = 0;
      let epic = initiative_DB['issues'][i]['EPIC'];
      epic['EpicTotalCnt'] = epiclist.total;
      epic['EpicDevelCnt'] = epiclist.total;
      epic['GovOrDeploymentCnt'] = 0;
      epic['EpicTotalResolutionCnt'] = 0;
      epic['EpicDevelResolutionCnt'] = 0;
      epic['EpicGovOrDeploymentResolutionCnt'] = 0;
      epic['EpicDelayedCnt'] = 0;

      for (var j = 0; j < epiclist.total; j++) 
      {
        var init_ReleaseSP = initiative_DB['issues'][i]['ReleaseSprint']['CurRelease_SP'];
        var epic_ReleaseSP = 0;
        var init_Status = initiative_DB['issues'][i]['Workflow']['Status'];
        var epic_Status = 0;
        issue = epiclist['issues'][j];
        epic_keylist.push(issue['key']);
        current_epic_info = JSON.parse(JSON.stringify(epic_info));
        // need to be update initiative info
        current_epic_info['Epic Key'] = initparse.getKey(issue); 
        current_epic_info['duedate'] = initparse.getDueDate(issue);        
        current_epic_info['Release_SP'] = epic_ReleaseSP = initparse.conversionDuedateToSprint(current_epic_info['duedate']);        
        current_epic_info['Summary'] = initparse.getSummary(issue);         
        current_epic_info['Assignee'] = initparse.getAssignee(issue);        
        current_epic_info['Status'] = epic_Status = initparse.getStatus(issue);        
        current_epic_info['CreatedDate'] = initparse.getCreatedDate(issue);         
        current_epic_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
        current_epic_info['AbnormalSprint'] = initparse.checkAbnormalSP(init_ReleaseSP, init_Status, epic_ReleaseSP, epic_Status);   
        // Gathering organization infomation
        //ldap.get_UserInfofromLDAP(current_epic_info['Assignee']);
        //initiative_DB['issues'][i]['Organization'] = 
        /*
        current_epic_info['Organization'] = 0;  // need to be updated        
        current_epic_info['StoryPoint'] = story_point;  // need to be updated      
        current_epic_info['DHistory'] = [];        
        */
        epic['issues'][j] = JSON.parse(JSON.stringify(current_epic_info));
        initiative_DB['issues'][i]['AbnormalSprint'] = current_epic_info['AbnormalSprint'];

        if(initparse.checkIsDelayed(current_epic_info['duedate']) == true && initparse.checkIsDelivered(epic_Status) == false) { epic['EpicDelayedCnt']++; }
        if(current_epic_info['GovOrDeployment'] == true) 
        {
          epic['EpicDevelCnt']--;
          epic['GovOrDeploymentCnt']++;
          if(initparse.checkIsDelivered(epic_Status) == true)
          {
            epic['EpicTotalResolutionCnt']++;
            epic['EpicGovOrDeploymentResolutionCnt']++;
          }
        }
        else
        {
          if(initparse.checkIsDelivered(epic_Status) == true)
          {
            epic['EpicTotalResolutionCnt']++;
            epic['EpicDevelResolutionCnt']++;
          }
        }
      }
    }).catch(error => {
      console.log("[Catch] getEpicListfromJira ==== [I-index]:", i, "[I-Key]:", init_keyvalue, " - exception error = ", error);
      get_errors['epiclist'].push(init_keyvalue);
    });
    await makeSnapshot_EpicZephyrInfofromJira(i, epic_keylist); // initiative index, epick keylist        
    await makeSnapshot_StoryInfofromJira(i, epic_keylist); // initiative index, epick keylist        
  }
}


async function makeSnapshot_EpicZephyrInfofromJira(init_index, epickeylist)
{
  console.log("[Proimse 3] makeSnapshot_EpicZephyrInfofromJira ---- Get Epic-Zephyr List / Update Zephyr Basic Info");
 
  var init_keyvalue = initiative_keylist[init_index];
  
  for(var i = 0; i < epickeylist.length; i++)
  {
    var epic_keyvalue = epickeylist[i];
    await getZephyerListfromJira(epic_keyvalue)
    .then((zephyrlist) => {
      //console.log(zephyrlist);
      let epiczephyr = initiative_DB['issues'][init_index]['EPIC']['issues'][i]['Zephyr'];
      console.log("getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", i, "[E-Key]:", epic_keyvalue, "[Z-Total]:",zephyrlist.total);
      epiczephyr['ZephyrCnt'] = zephyrlist.total; 
      zephyr_issueIdlist = [];
      let issue = 0;
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        issue = zephyrlist['issues'][j];
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = issue['id'];
        zephyr_issueIdlist.push(issue['id']);
        current_zephyr_info['Zephyr Key'] = initparse.getKey(issue);      
        current_zephyr_info['Summary'] = initparse.getSummary(issue);        
        current_zephyr_info['Assignee'] = initparse.getAssignee(issue);         
        current_zephyr_info['Status'] = initparse.getStatus(issue);        
        current_zephyr_info['Labels'] = initparse.getLabels(issue);        
        //console.log("^^^^add zephyr^^^^^");       
        epiczephyr['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async
        if(async_mode == true) { makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, j, current_zephyr_info['IssueID']); }
      }
    }).catch(error => {
      console.log("[Catch] getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", i, "[E-Key]:", 
      epic_keyvalue, " - exception error = ", error);
      let error_info = { 'IK' : '', 'EK' : '' };
      error_info['IK'] = init_keyvalue;
      error_info['EK'] = epic_keyvalue;
      get_errors['e_zephyrlist'].push(error_info);
    });
    //sync
    if(async_mode == false) { await makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, zephyr_issueIdlist); }
  }
}


async function makeSnapshot_StoryZephyrInfofromJira(init_index, epic_index, stroylist)
{
  console.log("[Proimse 3.1] makeSnapshot_StoryZephyrInfofromJira ---- Get Story-Zephyr List / Update Zephyr Basic Info");
 
  var init_keyvalue = initiative_keylist[init_index];
  var epic_keyvalue = epic_keylist[epic_index];
  
  for(var i = 0; i < stroylist.length; i++)
  {
    var story_keyvalue = stroylist[i];
    await getZephyerListfromJira(story_keyvalue)
    .then((zephyrlist) => {
      console.log("getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", epic_index, "[S-Key]:", story_keyvalue, "[Z-Total]:", zephyrlist.total);
      //console.log(zephyrlist);
      let storyzephyr = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][i]['Zephyr'];
      storyzephyr['ZephyrCnt'] = zephyrlist.total; 
      zephyr_issueIdlist = [];
      let issue = 0;
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        issue = zephyrlist['issues'][j];
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = issue['id']; 
        zephyr_issueIdlist.push(issue['id']);
        current_zephyr_info['Zephyr Key'] = initparse.getKey(issue);      
        current_zephyr_info['Summary'] = initparse.getSummary(issue);        
        current_zephyr_info['Assignee'] = initparse.getAssignee(issue);         
        current_zephyr_info['Status'] = initparse.getStatus(issue);        
        current_zephyr_info['Labels'] = initparse.getLabels(issue);        
        //console.log("^^^^add zephyr^^^^^");       
        storyzephyr['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async mode....
        if(async_mode == true) { makeSnapshot_StoryZephyrExecutionInfofromJira(init_index, epic_index, i, j, current_zephyr_info['IssueID']); }
      }
    }).catch(error => {
      console.log("[Catch] getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", epic_index, "[S-Key]:", 
      story_keyvalue, " - exception error = ", error);
      let error_info = { 'IK' : '', 'EK' : '', 'SK' : '' };
      error_info['IK'] = init_keyvalue;
      error_info['EK'] = epic_keyvalue;
      error_info['SK'] = story_keyvalue;
      get_errors['s_zephyrlist'].push(error_info);
    });

    // sync mode....
    if(async_mode == false) { await makeSnapshot_SyncStoryZephyrExecutionInfofromJira(init_index, epic_index, i, zephyr_issueIdlist); }
  }
}

async function makeSnapshot_StoryInfofromJira(init_index, epickeylist)
{
  console.log("[Proimse 4] makeSnapshot_StoryInfofromJira ---- Get Epic-Story List / Update Story Basic Info");
  var init_keyvalue = initiative_keylist[init_index];
  let issue = 0;
  let initstorysummary = initiative_DB['issues'][init_index]['STORY_SUMMARY'];
  initstorysummary['StoryTotalCnt'] = 0;
  initstorysummary['StoryDevelCnt'] = 0;
  initstorysummary['StoryGovOrDeploymentCnt'] = 0;
  initstorysummary['StoryTotalResolutionCnt'] = 0;
  initstorysummary['StoryDevelResolutionCnt'] = 0;
  initstorysummary['StoryGovOrDeploymentResolutionCnt'] = 0;
  initstorysummary['StoryDelayedCnt'] = 0;

  for(var i = 0; i < epickeylist.length; i++)
  {
    var epic_keyvalue = epickeylist[i];
    await getStoryListfromJira(epic_keyvalue)
    .then((storylist) => {
      console.log("getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue);
      //console.log(storylist);
      story_keylist = new Array();
      let issue = 0;
      let epicstorysummary = initiative_DB['issues'][init_index]['EPIC']['issues'][i]['STORY']['STORY_SUMMARY'];
      epicstorysummary['StoryTotalCnt'] = storylist.total;
      epicstorysummary['StoryDevelCnt'] = storylist.total;
      epicstorysummary['StoryGovOrDeploymentCnt'] = 0;
      epicstorysummary['StoryTotalResolutionCnt'] = 0;
      epicstorysummary['StoryDevelResolutionCnt'] = 0;
      epicstorysummary['StoryGovOrDeploymentResolutionCnt'] = 0;
      epicstorysummary['StoryDelayedCnt'] = 0;

      for (var j = 0; j < storylist.total; j++) 
      {
        var init_ReleaseSP = initiative_DB['issues'][init_index]['ReleaseSprint']['CurRelease_SP'];
        var epic_ReleaseSP = 0;
        var story_ReleaseSP = 0;
        var epic_Status = initiative_DB['issues'][init_index]['EPIC']['issues'][i]['Status'];
        var story_Status = 0;
        issue = storylist['issues'][j];
        story_keylist.push(storylist['issues'][j]['key']);
        current_story_info = JSON.parse(JSON.stringify(story_info));
        current_story_info['Story Key'] = initparse.getKey(issue); 
        current_story_info['duedate'] = initparse.getDueDate(issue);        
        current_story_info['Release_SP'] = story_ReleaseSP = initparse.conversionDuedateToSprint(current_story_info['duedate']);         
        current_story_info['Summary'] = initparse.getSummary(issue);         
        current_story_info['Assignee'] = initparse.getAssignee(issue);        
        current_story_info['Status'] = story_Status = initparse.getStatus(issue);        
        current_story_info['CreatedDate'] = initparse.getCreatedDate(issue);        
        current_story_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
        current_story_info['AbnormalSprint'] = initparse.checkAbnormalSP(epic_ReleaseSP,epic_Status, story_ReleaseSP, story_Status); 
        current_story_info['Organization'] = 0; // need to be updated 
        current_story_info['StoryPoint'] = 0; // need to be updated     
        /*  
        current_story_info['Zephyr'] = 0; // need to be updated      
        */
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['STORY']['issues'][j] = JSON.parse(JSON.stringify(current_story_info));   
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['AbnormalSprint'] = current_story_info['AbnormalSprint'];

        if(initparse.checkIsDelayed(current_story_info['duedate']) == true && initparse.checkIsDelivered(story_Status) == false) { epicstorysummary['StoryDelayedCnt']++; }
        if(current_story_info['GovOrDeployment'] == true) 
        {
          epicstorysummary['StoryDevelCnt']--;
          epicstorysummary['StoryGovOrDeploymentCnt']++;
          if(initparse.checkIsDelivered(story_Status) == true)
          {
            epicstorysummary['StoryTotalResolutionCnt']++;
            epicstorysummary['StoryGovOrDeploymentResolutionCnt']++;
          }
        }
        else
        {
          if(initparse.checkIsDelivered(story_Status) == true)
          {
            epicstorysummary['StoryTotalResolutionCnt']++;
            epicstorysummary['StoryDevelResolutionCnt']++;
          }
        }             
      }
 
      //let initstorysummary = initiative_DB['issues'][init_index]['STORY_SUMMARY'];
      initstorysummary['StoryTotalCnt'] += epicstorysummary['StoryTotalCnt'];
      initstorysummary['StoryDevelCnt'] += epicstorysummary['StoryDevelCnt'];
      initstorysummary['StoryGovOrDeploymentCnt'] += epicstorysummary['StoryGovOrDeploymentCnt'];
      initstorysummary['StoryTotalResolutionCnt'] += epicstorysummary['StoryTotalResolutionCnt'];
      initstorysummary['StoryDevelResolutionCnt'] += epicstorysummary['StoryDevelResolutionCnt'];
      initstorysummary['StoryGovOrDeploymentResolutionCnt'] += epicstorysummary['StoryGovOrDeploymentResolutionCnt'];
      initstorysummary['StoryDelayedCnt'] += epicstorysummary['StoryDelayedCnt'];
    }).catch(error => {
      console.log("[Catch] getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue, " - exception error = ", error);
      let error_info = { 'IK' : '', 'EK' : '' };
      error_info['IK'] = init_keyvalue;
      error_info['EK'] = epic_keyvalue;
      get_errors['storylist'].push(error_info);
    });
    await makeSnapshot_StoryZephyrInfofromJira(init_index, i, story_keylist);     
  }
}


async function makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, epic_index, zephyr_index, zephyrkeyID)
{
  console.log("[Promise 4.1] makeSnapshot_EpicZephyrExecutionInfofromJira ---- Update Epic~Zephyr Executions info");
  await getZephyerExecutionfromJira(zephyrkeyID)
  .then((zephyrExecution) => {
    //console.log(zephyrExecution);
    console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[Z-index]:", zephyr_index, "[Z-KeyID]:", zephyrkeyID);
    let issue = 0;
    for (var i = 0; i < zephyrExecution['executions'].length; i++) 
    {
      current_zephyr_exeinfo = { };
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      issue = zephyrExecution['executions'][i];
      current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
      current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
      current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
      current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
      current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
      current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
  }).catch(error => {
    console.log("[Catch] getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[Z-index]:", 
    zephyr_index, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
    let error_info = { 'IK' : '', 'EK' : '', 'ZK': '', 'ZID' : '' };
    error_info['IK'] = initiative_DB['issues'][init_index]['Initiative Key'];
    error_info['EK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Epic Key'];
    error_info['ZK'] = initiative_DB['issues'][init_index]['EPIC']['Zephyr']['Zephyr TC'][zephyr_index]['Zephyr Key'];
    error_info['ZID'] = zephyrkeyID;
    get_errors['e_zephyr_exeinfo'].push(error_info);
  });
}


async function makeSnapshot_StoryZephyrExecutionInfofromJira(init_index, epic_index, story_index, zephyr_index, zephyrkeyID)
{
  console.log("[Promise 4.1.1] makeSnapshot_StoryZephyrExecutionInfofromJira ----");
  await getZephyerExecutionfromJira(zephyrkeyID)
  .then((zephyrExecution) => {
    console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index, "[Z-index]:", zephyr_index, "[Z-KeyID]:", zephyrkeyID);
    //console.log(zephyrExecution);
    let issue = 0;
    for (var i = 0; i < zephyrExecution['executions'].length; i++) 
    {
      current_zephyr_exeinfo = {}; 
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      issue = zephyrExecution['executions'][i];
      current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
      current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
      current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
      current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
      current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
      current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][story_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
  }).catch(error => {
    console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index, 
    "[Z-index]:", zephyr_index, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
    let error_info = { 'IK' : '', 'EK' : '', 'SK' : '', 'ZK': '', 'ZID' : '' };
    error_info['IK'] = initiative_DB['issues'][init_index]['Initiative Key'];
    error_info['EK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Epic Key'];
    error_info['SK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][story_index]['Zephyr']['Zephyr TC'][zephyr_index]['Zephyr Key'];
    error_info['ZK'] = initiative_DB['issues'][init_index]['EPIC']['Zephyr']['Zephyr TC'][zephyr_index]['Zephyr Key'];
    error_info['ZID'] = zephyrkeyID;
    get_errors['s_zephyr_exeinfo'].push(error_info);    
  });
}


async function makeSnapshot_SyncStoryZephyrExecutionInfofromJira(init_index, epic_index, story_index, zephyr_issueIdlist)
{
  console.log("[Promise 4.1.1] makeSnapshot_SyncStoryZephyrExecutionInfofromJira ---- Update Story Zephyr Execution info");

  for(var i = 0; i < zephyr_issueIdlist.length; i++)
  {
    var zephyrkeyID = zephyr_issueIdlist[i];
    await getZephyerExecutionfromJira(zephyrkeyID)
    .then((zephyrExecution) => {
      console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index, "[Z-index]:", i, "[Z-KeyID]:", zephyrkeyID);
      //console.log(zephyrExecution);
      let issue = 0;
      for (var j = 0; j < zephyrExecution['executions'].length; j++) 
      {
        current_zephyr_exeinfo = {}; 
        //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
        issue = zephyrExecution['executions'][j];
        current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
        current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
        current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
        current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
        current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
        current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
          //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
        //console.log(zephyrExecution['executions'][j]);
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][story_index]['Zephyr']['ZephyrTC'][i]['Executions'][j] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
      }
    }).catch(error => {
      console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index,
        "[Z-index]:", i, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
        let error_info = { 'IK' : '', 'EK' : '', 'SK' : '', 'ZK': '', 'ZID' : '' };
        error_info['IK'] = initiative_DB['issues'][init_index]['Initiative Key'];
        error_info['EK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Epic Key'];
        error_info['SK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][story_index]['Zephyr']['Zephyr TC'][zephyr_index]['Zephyr Key'];
        error_info['ZK'] = initiative_DB['issues'][init_index]['EPIC']['Zephyr']['Zephyr TC'][zephyr_index]['Zephyr Key'];
        error_info['ZID'] = zephyrkeyID;
        get_errors['s_zephyr_exeinfo'].push(error_info);    
    });
  }
}

module.exports = { 
  initiative_DB,              // final DB
  // function
  get_InitiativeListfromJira,  // promise
  get_InitiativeList,          // callback
  makeSnapshot_InitiativeInfofromJira,
 };

