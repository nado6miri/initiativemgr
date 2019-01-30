var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;
var initparse = require('./parsejirafields');
var ldap = require('./lgeldap.js')
var moment = require('moment-timezone');

var async_mode = false;
var changelog = true;
var SDETVerifyOnly = false; // SDET이 개발필요 TC 항목으로 분류된 EPIC/STORY만 Zephyer 정보 수집을 수행한다. 

// initiative filter result (json) - webOS45 webOS45MR, webOS5.0 
var initiative_FilterResult;
var initiative_keylist = [];

// epic filter result (json) - epic list depend on intitative key
var epic_FilterResult;
var epic_keylist = [];

// epic filter result (json) - story list depend on epic key
var story_FilterResult;
var story_keylist = [];

var initiative_DB = {
  'total' : 0,
  'snapshotDate' : '2018',
  'issues' : [], // initiative issue list
  'developers' : { },
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
    'AbnormalSprint' : '',
    "GovOrDeployment" : '',
    'Labels' : [],
    'SDET_NeedDevelTC' : false,
    'SDET_NeedtoCheck' : false,
    'StoryPoint' : story_point,
    'Zephyr' : 
    {
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
          'StoryAbnormalSPCnt' : 0, // Story Abnormal SP 
          'StoryDuedateNullCnt' : 0, // Story Due Date Null 
          'StoryDevelTCCnt' : 0, // zephyr tc 필요항목
          'StoryNonDevelTCCnt' : 0,    // zephyr tc 불필요항목 
          'StoryNeedtoCheckCnt' : 0, // 개발 / 비개발 확인 필요 항목
          'StoryHasTCCnt' : 0, 
      }, 
      'issues' : [], // story issue list
    },
};


var current_initiative_info = { };
var initiative_info =
{
  'Initiative Key' : '',
  'created' : '',
  'Summary' : '',
  'Assignee' : '',
  'OrgInfo' : [], 
  '관리대상' : '',
  'Risk관리대상' : '',
  'Initiative Order' : '',
  'Initiative Score' : '', 
  'Status Color' : '',
  'SE_Delivery' : '',
  'SE_Quality' : '',
  'StatusSummary' : { 'UpdateDate' : 'None', count : 0, 'Description' : "" },
  'DeliveryComment' : '',
  'QualityComment' : '',
  'ScopeOfChange' : '',
  'RMS' : '',
  'Labels' : [],
  'STESDET_OnSite' : '',
  'SDET_STE_Members' : [],
  'AbnormalSprint' : '',
  "GovOrDeployment" : '',
  'Demo' : [],
  'StoryPoint' : { },
  'FixVersion' : [ ],
  'Workflow' : { }, 
  'ReleaseSprint' : { },
  'ARCHREVIEW' : { }, 
  'STORY_SUMMARY' : 
  {
      'StoryTotalCnt': 0,
      'StoryDevelCnt': 0,
      'StoryGovOrDeploymentCnt': 0,
      'StoryTotalResolutionCnt' : 0,
      'StoryDevelResolutionCnt' : 0,
      'StoryGovOrDeploymentResolutionCnt' : 0,
      'StoryDelayedCnt' : 0,
      'StoryAbnormalSPCnt' : 0, // Story Abnormal SP 
      'StoryDuedateNullCnt' : 0, // Story Due Date Null 
      'StoryDevelTCCnt' : 0, // zephyr tc 필요항목
      'StoryNonDevelTCCnt' : 0,    // zephyr tc 불필요항목 
      'StoryNeedtoCheckCnt' : 0, // 개발 / 비개발 확인 필요 항목
      'StoryHasTCCnt' : 0, // 연결률 계산..
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
    'EpicAbnormalSPCnt' : 0, // Epic Abnormal SP 
    'EpicDuedateNullCnt' : 0, // Epic Due Date Null 
    'EpicDevelTCCnt' : 0, // zephyr tc 필요항목 (개발)
    'EpicNonDevelTCCnt' : 0,    // zephyr tc 불필요항목 (비개발)
    'EpicNeedtoCheckCnt' : 0, // 개발 / 비개발 확인 필요 항목
    'EpicHasTCCnt' : 0, // 연결률 계산..
    'issues' : [],    
  },
  'STATICS' : { },
  'URL' : { },
  'developers' : { },
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
  'Labels' : [],
  'GovOrDeployment' : '',
  'SDET_NeedDevelTC' : false,
  'SDET_NeedtoCheck' : false,
  'StoryPoint' : {} ,
  'Zephyr' : 
  {
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
  'Status' : '',
  'Labels' : [],
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
  'cycleId': 0,
  'cycleName': ''
}

var current_workflow = {};
var workflow = 
{   
  'CreatedDate' : '',
  'Status' : '',
  'totalDevelDays' : 0,
  'RemainDays' : 0,
  "DRAFTING" : { "Duration" : 0, 'History' :[ ] } ,             
  "PO REVIEW" : { "Duration" : 0, 'History' :[ ] } ,             
  "ELT REVIEW" : { "Duration" : 0, 'History' :[ ] } ,             
  "Approved" : { "Duration" : 0, 'History' :[ ] } ,             
  "BACKLOG REFINEMENT" : { "Duration" : 0, 'History' :[ ] } ,             
  "READY" : { "Duration" : 0, 'History' :[ ] } ,             
  "In Progress" : { "Duration" : 0, 'History' :[ ] } ,             
  "Delivered" : { "Duration" : 0, 'History' :[ ] } ,             
  "PROPOSED TO DEFER" : { "Duration" : 0, 'History' :[ ] } ,             
  "Deferred" : { "Duration" : 0, 'History' :[ ] } ,             
  "Closed" : { "Duration" : 0, 'History' :[ ] }  ,             
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

var Initiative_Statics = 
{
    'EPIC+STORY_STATICS' :
    {
        'TOTAL' : {},
        'ORGANIZATION' : {},
        'DEVELOPER' : {},
    },

    'EPIC_STATICS' : 
    {
        'TOTAL' : {}, 
        'ORGANIZATION' : {},
        'DEVELOPER' : {},
    },

    'STORY_STATICS' : 
    {
        'TOTAL' : {},
        'ORGANIZATION' : {},
        'DEVELOPER' : {},
    },    
}

var StaticsInfo = 
{
    // Epic
    'EpicTotalCnt': 0,
    'EpicDevelCnt': 0,
    'EpicGovOrDeploymentCnt': 0,
    'EpicTotalResolutionCnt' : 0,
    'EpicDevelResolutionCnt' : 0,
    'EpicGovOrDeploymentResolutionCnt' : 0,
    'EpicDelayedCnt' : 0,
    'EpicAbnormalSPCnt' : 0, // Epic Abnormal SP 
    'EpicDuedateNullCnt' : 0, // Epic Due Date Null 
    'EpicDevelTCCnt' : 0, // zephyr tc 필요항목 (개발)
    'EpicNonDevelTCCnt' : 0,    // zephyr tc 불필요항목 (비개발)
    'EpicNeedtoCheckCnt' : 0, // 개발 / 비개발 확인 필요 항목
    'EpicHasTCCnt' : 0, // 연결률 계산..
    // Story
    'StoryTotalCnt': 0,
    'StoryDevelCnt': 0,
    'StoryGovOrDeploymentCnt': 0,
    'StoryTotalResolutionCnt' : 0,
    'StoryDevelResolutionCnt' : 0,
    'StoryGovOrDeploymentResolutionCnt' : 0,
    'StoryDelayedCnt' : 0,
    'StoryAbnormalSPCnt' : 0, // Story Abnormal SP 
    'StoryDuedateNullCnt' : 0, // Story Due Date Null 
    'StoryDevelTCCnt' : 0, // zephyr tc 필요항목
    'StoryNonDevelTCCnt' : 0,    // zephyr tc 불필요항목 
    'StoryNeedtoCheckCnt' : 0, // 개발 / 비개발 확인 필요 항목
    'StoryHasTCCnt' : 0, // 연결률 계산..
    // Epic 하위, Story 하위 Zephyr 통계
    'ZephyrCnt': 0,
    'ZephyrExecutionCnt' : 0,
    'Zephyr_S_Draft' : 0, 
    'Zephyr_S_Review' : 0, 
    'Zephyr_S_Update' : 0, 
    'Zephyr_S_Active' : 0, 
    'Zephyr_S_Approval' : 0, 
    'Zephyr_S_Archived' : 0, 
    'executionStatus_PASS' : 0, // “1” PASS
    'executionStatus_FAIL' : 0, // “2” FAIL
    'executionStatus_UNEXEC' : 0, // “-1” UNEXECUTED
    'executionStatus_BLOCK' : 0, // “3” WIP, “4” BLOCKED”
    'PassEpicCnt' : 0,
    'PassStoryCnt' : 0,
}


var current_Arch_Review = {};
var Arch_1st_workflow = 
{
  'CreatedDate' : '',
  'Status' : '',
  'Signal' : 'YELLOW',
  "Scoping" : { "Duration" : 0, 'History' :[ ] } ,             
  "Review" : { "Duration" : 0, 'History' :[ ] } ,             
  "In Progress" : { "Duration" : 0, 'History' :[ ] } ,             
  "Delivered" : { "Duration" : 0, 'History' :[ ] } ,             
  "Closed" : { "Duration" : 0, 'History' :[ ] }  ,            
}

var Arch_2nd_workflow = 
{   
  'CreatedDate' : '',
  'Status' : '',
  'Signal' : '-',
  "Screen" : { "Duration" : 0, 'History' :[ ] } ,             
  "Analysis" : { "Duration" : 0, 'History' :[ ] } ,             
  "Verify" : { "Duration" : 0, 'History' :[ ] } ,             
  "Closed" : { "Duration" : 0, 'History' :[ ] }  ,            
};

var Arch_Review = 
{
  'Key' : '',
  'ScopeOfChange' : '---',
  'First Review' : 
  {
    '1stReviewDone' : false,
    'Plan' : { 'Interface Review' : false, 'Sangria Review' : false, 'FMEA' : false },
    'workflow' : {},
  },
  'Second Review' : 
  {
    'Interface Review' : { 'output' : false, 'workflow' : {}, }, 
    'Document Review' : { 'output' : false, 'workflow' : {}, }, 
    'Architecture Review' : { 'output' : false, 'workflow' : {}, }, 
    'FMEA Review' : { 'output' : false, 'workflow' : {}, }, 
  },
}


const common_url = 'http://hlm.lge.com/issue/issues/?jql=';

const total_link_key = 
{
  'Total' : { 'link' : '', 'keys' : [] },
  'DevelTC' : { 'link' : '', 'keys' : [] },
  'NonDevelTC' : { 'link' : '', 'keys' : [] },
  'NeedtoCheck' : { 'link' : '', 'keys' : [] },
  'ZephyrTotal' : { 'link' : '', 'keys' : [] },
  'Zephyr_DRAFT' : { 'link' : '', 'keys' : [] },
  'Zephyr_REVIEW' : { 'link' : '', 'keys' : [] },
  'Zephyr_UPDATE' : { 'link' : '', 'keys' : [] },
  'Zephyr_ACTIVE' : { 'link' : '', 'keys' : [] },
  'Zephyr_PASS' : { 'link' : '', 'keys' : [] },
  'Zephyr_FAIL' : { 'link' : '', 'keys' : [] },
}

const OrgDevel_link_key = 
{
  'Total' : '',
  'DevelTC' : '',
  'NonDevelTC' : '',
  'NeedtoCheck' : '',
  'ZephyrTotal' : '',
  'Zephyr_DRAFT' : '',
  'Zephyr_REVIEW' : '',
  'Zephyr_UPDATE' : '',
  'Zephyr_ACTIVE' : '',
  'Zephyr_PASS' : '',
  'Zephyr_FAIL' : '',
};

var current_urlinfo = { }; 
const urlinfo = 
{
  'COMMON' :
  {
    'EPIC_TOTAL' : '',
    'EPIC_Duedate_Null' : '',
    'EPIC_Duedate_Delayed' : '',
    'EPIC_AbnormalSP' : '',
    'STORY_TOTAL' : '',
    'STORY_Duedate_Null' : '',
    'STORY_Duedate_Delayed' : '',
    'STORY_AbnormalSP' : '',
    'AbnormalSPList' : [],
  },
  'EPIC+STORY_LINK' : 
  {
      'TOTAL' : { },
      'ORGANIZATION' : { },
      'DEVELOPER' :  { },
  },    
  'EPIC_LINK' : 
  {
      'TOTAL' : { },
      'ORGANIZATION' : { },
      'DEVELOPER' : { },
  },
  'STORY_LINK' : 
  {
      'TOTAL' : { },
      'ORGANIZATION' : { },
      'DEVELOPER' : { },
  },
}


var developerslist = {};
var developers = {};
var start = 0, end = 0;

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

    if(querymode == "filterID" || querymode == 'filterID_KeyListOnly')
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
    var param = {};
    if(querymode == 'filterID_KeyListOnly')
    {
      param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0, "fields" : ["summary", "key", "assignee" ] };
    }
    else
    {
      param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,
                "fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks", "resolution", "components", "issuetype", "customfield_15926",
                            "customfield_15710", "customfield_15711", "customfield_16988", "customfield_16984", "customfield_16983", "customfield_15228", 
                            "customfield_16986", "created", "updated", "duedate", "resolutiondate", "labels", "description", "fixVersions", "customfield_15104", 
                            "reporter", "assignee", "customfield_10105", "customfield_16985",
                          ] };
    }
    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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

    if(querymode == "filterID" || querymode == 'filterID_KeyListOnly')
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
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify(param));  
  });
}


function get_ChangeLogfromJira(querymode, filtervalue)
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
            fse.outputFileSync("./public/json/Changlog.json", json, 'utf-8', function(e){
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

    // search by key...
    var filterjql = 0; 
    if(querymode == "filterID" || querymode == 'filterID_KeyListOnly')
    { // search by filterID
      filterjql = "filter="+filtervalue.toString();
    }
    else
    { // search by key...
      filterjql = "key="+filtervalue.toString();
    }

    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/?expand=changelog';
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,
                  "expand" : ["changelog"], 
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "resolution", "components", "issuetype",  "created", "updated", 
                              "duedate", "resolutiondate", "labels", "reporter"] };

    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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
    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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
          resolve(resultJSON);
        }
        else
        {
          console.log("getStoryListfromJira -- xhttp.status Error = ", xhttp.status)
          reject(xhttp.status);
        }        
      }
    }

    let filterjql = '(issuetype = story or issuetype = task) AND issuefunction in linkedissuesOf(\"key=' + epicKey + '\"' + ')';
    //let filterjql = 'issuefunction in linkedissuesOf(\"key=' + epicKey + '\"' + ')';
    console.log("filterjql = ", filterjql);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    //var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,
                  "fields" : ["summary", "key", "assignee", "due", "status", "labels", "resolution", "components", "issuetype",  "created", "updated", 
                  "duedate", "resolutiondate", "labels", "reporter"] };

    //console.log("param=", JSON.stringify(param));
    xhttp.open("POST", searchURL, true);
    xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(null);  
  });    
}  


function Save_JSON_file(jsonObject, filename)
{
  var json = JSON.stringify(jsonObject);
  fse.outputFileSync(filename, json, 'utf-8', function(e){
    if(e){
      console.log(e);
    }else{
      console.log("Download is done!");	
    }
  });
}

function load_DevelopersDB(filename)
{
  return new Promise(function (resolve, reject) {
    fs.exists(filename, (exist) => {
      if(exist)
      {
        /*
        console.log("file is exist");
        fs.readFile(filename, 'utf8', (e, data) => {
          if(e){ console.log("error=", e); } 
          else 
          { 
            let jsonObject = JSON.parse(data); 
            console.log("Read developers DB = ", JSON.stringify(jsonObject)); 
            return jsonObject;
          }
        });
        */
       console.log("file is exist");
       let data = fs.readFileSync(filename, 'utf8');
       developerslist = JSON.parse(data); 
       //console.log("Read developers DB = ", JSON.stringify(developerslist)); 
       //resolve(developerslist);
      }
      else
      {
        console.log('Not Found!');
        developerslist = {};   
        //reject(developerslist);
      }
      resolve(developerslist);
    });      
  });
}


function load_InitiativeDB(filename)
{
  return new Promise(function (resolve, reject) {
    fs.exists(filename, (exist) => {
      if(exist)
      {
       console.log("file is exist");
       let data = fs.readFileSync(filename, 'utf8');
       initiative_DB = JSON.parse(data); 
      }
      else
      {
        console.log('Not Found!');
        initiative_DB = {};   
        //reject(initiative_DB);
      }
      resolve(initiative_DB);
    });      
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
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDE5MDE=");
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


//===================================================================================================================
// Solution : use this function to avoid timeout error when request jira info with change log.
// New Sequence with change log....
// makeSnapshot_InitiativeListfromJira --> makeSnapshot_InitiativeDetailInfofromJira --> makeSnapshot_EpicDetailInfofromJira --> Story/Zephyer Detail Info..
// Example : initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 46093);   // webOS4.5 MR minor airplay
async function makeSnapshot_InitiativeListfromJira(querymode, filterID)
{
  let today = start = moment().locale('ko');
  //today = moment(today).add(9, 'Hour');
  var snapshot = 0; 
  snapshot = today.format();
  snapshot = snapshot.split('+');
  snapshot = snapshot[0].replace(':', '-');
  snapshot = snapshot.replace(':', '-');
  snapshot = querymode+"_"+filterID+"_"+snapshot;
  // init global variables.
  initiative_DB['snapshotDate'] = snapshot;
  initiative_DB['total'] = 0;
  initiative_DB['issues'] = [];
  initiative_DB['developers'] = {};
  initiative_keylist = [];

  load_DevelopersDB('./public/json/developers.json').then((result) => {
    console.log("[TEST] Read developers DB = ", JSON.stringify(developerslist));
  })

  // Use Promise Object
  await get_InitiativeListfromJira(querymode, filterID)
  .then((initiativelist) => {
    console.log("[Promise 1] Get Initiative Key List from JIRA");
    initiative_DB['total'] = initiativelist.total;
    for (var i = 0; i < initiativelist.total; i++) {
      initiative_keylist.push(initiativelist['issues'][i]['key']);
    }     
  }).catch(error => {
    console.log("[Catch] get_InitiativeListfromJira - exception error = ", error)
  });

  console.log("Key List = ", initiative_keylist);
  for(var i = 0; i < initiative_keylist.length; i++)
  {
    await makeSnapshot_InitiativeDetailInfofromJira(initiative_keylist[i], i);
  }

  console.log("[final] Save file = initiative_DB");
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_"+initiative_DB['snapshotDate']+".json");
  console.log("[final] Save end : initiative_DB");

  console.log("Error List - Save file = errorlist.json", JSON.stringify(get_errors));
  Save_JSON_file(get_errors, "./public/json/errorlist.json");
  console.log("Error List - Save end : initiative_DB");

  await makeZephyrStatics();
  make_URLinfo();
  console.log("[final-Zephyr] Save file = initiative_DB");
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_"+initiative_DB['snapshotDate']+".json");
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_"+filterID+"_Latest.json");
  console.log("[final-Zephyr] Save end : initiative_DB");
  Save_JSON_file(developerslist, "./public/json/developers.json");

  end = moment().locale('ko');
  let elapsed = (end - start)/(1000*60);
  console.log("Elapsed time = ", elapsed, " mins");  
}


async function makeSnapshot_InitiativeDetailInfofromJira(KeyValue, index)
{
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
  await get_InitiativelistfromJirafunc("keyID", KeyValue)
  .then((initiativelist) => {
    console.log("[Promise 1] Get Initiative List / Update Basic Info and Iinitiative Key List from JIRA");
    //console.log(JSON.stringify(initiativelist));
    var issue = initiativelist['issues'][0];
    var initowner = 0;
    current_initiative_info = JSON.parse(JSON.stringify(initiative_info)); // initialize...
    current_initiative_info['Initiative Key'] = initparse.getKey(issue);        
    current_initiative_info['created'] = initparse.getCreatedDate(issue);        
    current_initiative_info['Summary'] = initparse.getSummary(issue);        
    current_initiative_info['Assignee'] = initowner = initparse.getAssignee(issue);        
    current_initiative_info['관리대상'] = initparse.checkLabels(issue, 'SPE_M');
    current_initiative_info['Risk관리대상'] = initparse.checkLabels(issue, 'SPE_R');        
    current_initiative_info['Initiative Score'] = initparse.getInitiativeScore(issue);        
    current_initiative_info['Initiative Order'] = initparse.getInitiativeOrder(issue);        
    current_initiative_info['Status Color'] = initparse.getStatusColor(issue);        
    current_initiative_info['SE_Delivery'] = initparse.getSE_Delivery(issue);        
    current_initiative_info['SE_Quality'] = initparse.getSE_Quality(issue);    
    //current_initiative_info['StatusSummary'] = initparse.getStatusSummary(issue);    
    current_initiative_info['DeliveryComment'] = initparse.getD_Comment(issue);    
    current_initiative_info['QualityComment'] = initparse.getQ_Comment(issue);    
    current_initiative_info['ScopeOfChange'] = initparse.getScopeOfChange(issue);        
    current_initiative_info['RMS'] = initparse.checkRMSInitiative(issue);       
    current_initiative_info['STESDET_OnSite'] = initparse.getSTESDET_Support(issue);        
    current_initiative_info['SDET_STE_Members'] = initparse.getSTEList(issue);     
    current_initiative_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);    
    current_initiative_info['FixVersion'] = initparse.getFixVersions(issue);     
    current_initiative_info['Labels'] = initparse.getLabels(issue);   
    
    if((initowner in developerslist) == false)
    {
      ldap.getLDAP_Info(initowner).then((result) => { 
        initparse.getPersonalInfo(result['displayName'], result['DepartmentCode'])
        .then((result) => { current_initiative_info['OrgInfo'] = developerslist[initowner] = result; }); 
      })
      .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
    }
    else
    {
      current_initiative_info['OrgInfo'] = developerslist[initowner];
    }

    let changelog = initiativelist['issues'][0]['changelog'];
    // Release Sprint
    current_ReleaseSP = JSON.parse(JSON.stringify(ReleaseSP)); // initialize...
    current_ReleaseSP['CurRelease_SP'] = initparse.conversionReleaseSprintToSprint(initparse.getReleaseSprint(issue));
    current_ReleaseSP = initparse.parseReleaseSprint(changelog, current_ReleaseSP);
    current_initiative_info['ReleaseSprint'] = JSON.parse(JSON.stringify(current_ReleaseSP)); 
    if(current_ReleaseSP['CurRelease_SP'] == 'SP_UNDEF') { current_initiative_info['AbnormalSprint'] = true; } else { current_initiative_info['AbnormalSprint'] = false; }

    // workflow
    let target = initparse.conversionSprintToDate(current_ReleaseSP['CurRelease_SP']);
    let today = moment().locale('ko');
    current_workflow = JSON.parse(JSON.stringify(workflow)); // initialize...
    current_workflow['CreatedDate'] = initparse.getCreatedDate(issue);
    current_workflow['Status'] = initparse.getStatus(issue);
    current_workflow['totalDevelDays'] = initparse.getElapsedDays(current_workflow['CreatedDate'], target);
    current_workflow['RemainDays'] = initparse.getRemainDays(target, today);
    current_workflow = initparse.parseWorkflow(changelog, current_workflow);
    current_initiative_info['Workflow'] = JSON.parse(JSON.stringify(current_workflow)); 

    // Status Summary { 'UpdateDate' : 'None', count : 0, 'Description' : "" }
    current_initiative_info['StatusSummary'] = initparse.parseStatusSummary(changelog);

    /*
    //current_workflow = initparse.parseWorkflow(initiativelist['issues'][0]['changelog'], current_workflow);
    initparse.parseWorkflow2(initiativelist['issues'][0]['changelog'], current_workflow).then((result) => {
      current_workflow = result;
      current_initiative_info['Workflow'] = JSON.parse(JSON.stringify(current_workflow)); 
    })
    .catch(error => { current_workflow = {}; console.log("Work Flow Error....")});
    */

    // Arch Review
    current_initiative_info['ARCHREVIEW'] = { };   
    initiative_DB['issues'][index] = JSON.parse(JSON.stringify(current_initiative_info)) // object copy --> need deep copy
  }).catch(error => {
    console.log("[Catch] get_InitiativeListfromJira - exception error = ", error)
  });
  await makeSnapshot_EpicDetailInfofromJira(current_initiative_info['Initiative Key'], index);
}


async function makeSnapshot_EpicDetailInfofromJira(init_keyvalue, init_index)
{
  console.log("[Proimse 2] makeSnapshot_EpicInfofromJira ---- Get Epic List / Update Epic Basic Info");
  var archjira = [ false, null, null, null];  // true/false, init_index, init_keyvalue, epic_keyvalue

  await getEpicListfromJira(init_keyvalue)
  .then((epiclist) => {
    console.log("getEpicListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue);
    epic_keylist = new Array();
    let issue = 0;
    let epic = initiative_DB['issues'][init_index]['EPIC'];

    for(key in epic)
    {
      if(key != 'issues')
      {
        if(key == 'EpicTotalCnt') { epic[key] = epiclist.total; } else { epic[key] = 0; }
      }
    }

    for (var i = 0; i < epiclist.total; i++) 
    {
      var init_ReleaseSP = initiative_DB['issues'][init_index]['ReleaseSprint']['CurRelease_SP'];
      var epic_ReleaseSP = 0;
      var init_Status = initiative_DB['issues'][init_index]['Workflow']['Status'];
      var epic_Status = 0;
      issue = epiclist['issues'][i];
      current_epic_info = JSON.parse(JSON.stringify(epic_info));
      current_epic_info['Epic Key'] = initparse.getKey(issue); 
      current_epic_info['duedate'] = initparse.getDueDate(issue);        
      current_epic_info['Release_SP'] = epic_ReleaseSP = initparse.conversionDuedateToSprint(current_epic_info['duedate']);        
      current_epic_info['Summary'] = initparse.getSummary(issue);         
      current_epic_info['Assignee'] = initparse.getAssignee(issue);        
      current_epic_info['Status'] = epic_Status = initparse.getStatus(issue);        
      current_epic_info['CreatedDate'] = initparse.getCreatedDate(issue);         
      current_epic_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
      current_epic_info['AbnormalSprint'] = initparse.checkAbnormalSP(init_ReleaseSP, init_Status, epic_ReleaseSP, epic_Status);   
      current_epic_info['Labels'] = initparse.getLabels(issue);     
      current_epic_info['SDET_NeedtoCheck'] = !initparse.checkLabels(issue, 'SDET_CHECKED'); // SDET_CHECKED label이 없을 경우 True...
      current_epic_info['SDET_NeedDevelTC'] = initparse.checkLabels(issue, '개발TC필요');
      /*
      current_epic_info['StoryPoint'] = story_point;  // need to be updated      
      */

      // Archi Review
      if(current_epic_info['Summary'].includes("ARCH REVIEW"))
      {
        archjira = [ true, init_index, init_keyvalue, current_epic_info['Epic Key']];
      }

      // 개발항목이면..... epic list에 추가하여 zephyer까지 체크하도록....
      if(SDETVerifyOnly)
      {
        if(archjira[0] == false || current_epic_info['SDET_NeedDevelTC'] == true) { epic_keylist.push(issue['key']); }
      }
      else { epic_keylist.push(issue['key']); }

      epic['issues'][i] = JSON.parse(JSON.stringify(current_epic_info));

      if(current_epic_info['Labels'].length == 0 || current_epic_info['SDET_NeedtoCheck'] == true) { epic['EpicNeedtoCheckCnt']++; }
      if(current_epic_info['SDET_NeedDevelTC'] == true) { epic['EpicDevelTCCnt']++; } else { epic['EpicNonDevelTCCnt']++; }
      
      if(initparse.checkIsDelivered(current_epic_info['Status']) == false)
      {
        if(initparse.checkIsDelayed(current_epic_info['duedate']) == true) { epic['EpicDelayedCnt']++; }
        if(current_epic_info['duedate'] == null) { epic['EpicDuedateNullCnt']++; }
        if(current_epic_info['AbnormalSprint'] == true) { epic['EpicAbnormalSPCnt']++; }
      }  

      if(current_epic_info['GovOrDeployment'] == true) 
      {
        epic['EpicGovOrDeploymentCnt']++;
        if(initparse.checkIsDelivered(epic_Status) == true)
        {
          epic['EpicTotalResolutionCnt']++;
          epic['EpicGovOrDeploymentResolutionCnt']++;
        }
      }
      else
      {
        epic['EpicDevelCnt']++;
        if(initparse.checkIsDelivered(epic_Status) == true)
        {
          epic['EpicTotalResolutionCnt']++;
          epic['EpicDevelResolutionCnt']++;
        }
      }
    }
  }).catch(error => {
    console.log("[Catch] getEpicListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, " - exception error = ", error);
    get_errors['epiclist'].push(init_keyvalue);
  });

  // Archi Review
  if(archjira[0] == true) { await makeSnapshot_ArchiReviewInfofromJira(archjira[1], archjira[2], archjira[3]); }
  // Eipc Zephyer
  await makeSnapshot_EpicZephyrInfofromJira(init_index, epic_keylist); // initiative index, epick keylist     
  // Story Info (Story List)
  await makeSnapshot_StoryInfofromJira(init_index, epic_keylist); // initiative index, epick keylist        
}


//===================================================================================================================
// Contraints : need to avoid timeout error when request jira info with change log.
// makeSnapshot_InitiativeInfofromJira --> makeSnapshot_EpicInfofromJira --> Story/Zephyer Detail Info..
// Example 1: initapi.makeSnapshot_InitiativeInfofromJira("filterID", 46093);         // webOS4.5 MR minor
// Example 2: initapi.makeSnapshot_InitiativeInfofromJira("keyID", "TVPLAT-16376");   // webOS4.5 MR minor airplay

async function makeSnapshot_InitiativeInfofromJira(querymode, filterID)
{
  let today = start = moment().locale('ko');
  //today = moment(today).add(9, 'Hour');
  var snapshot = 0; 
  snapshot = today.format();
  snapshot = snapshot.split('+');
  snapshot = snapshot[0].replace(':', '-');
  snapshot = snapshot.replace(':', '-');
  snapshot = querymode+"_"+filterID+"_"+snapshot;
  // init global variables.
  initiative_DB['snapshotDate'] = snapshot;
  initiative_DB['total'] = 0;
  initiative_DB['issues'] = [];
  initiative_DB['developers'] = {};
  initiative_keylist = [];

  load_DevelopersDB('./public/json/developers.json').then((result) => {
    console.log("[TEST] Read developers DB = ", JSON.stringify(developerslist));
  })

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
      current_initiative_info['StatusSummary'] = initparse.getStatusSummary(issue);    
      current_initiative_info['DeliveryComment'] = initparse.getD_Comment(issue);    
      current_initiative_info['QualityComment'] = initparse.getQ_Comment(issue);    
      current_initiative_info['ScopeOfChange'] = initparse.getScopeOfChange(issue);        
      current_initiative_info['RMS'] = initparse.checkRMSInitiative(issue);       
      current_initiative_info['STESDET_OnSite'] = initparse.getSTESDET_Support(issue);        
      current_initiative_info['SDET_STE_Members'] = initparse.getSTEList(issue);     
      current_initiative_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);    
      current_initiative_info['FixVersion'] = initparse.getFixVersions(issue);     
      current_initiative_info['Labels'] = initparse.getLabels(issue);   

      // Release Sprint
      current_ReleaseSP = JSON.parse(JSON.stringify(ReleaseSP)); // initialize...
      current_ReleaseSP['CurRelease_SP'] = initparse.conversionReleaseSprintToSprint(initparse.getReleaseSprint(issue));
      current_ReleaseSP = initparse.parseReleaseSprint(initiativelist['issues'][i]['changelog'], current_ReleaseSP);
      current_initiative_info['ReleaseSprint'] = JSON.parse(JSON.stringify(current_ReleaseSP)); 
      if(current_ReleaseSP['CurRelease_SP'] == 'SP_UNDEF') { current_initiative_info['AbnormalSprint'] = true; } else { current_initiative_info['AbnormalSprint'] = false; }

      // workflow
      let target = initparse.conversionSprintToDate(current_ReleaseSP['CurRelease_SP']);
      let today = moment().locale('ko');
      current_workflow = JSON.parse(JSON.stringify(workflow)); // initialize...
      current_workflow['CreatedDate'] = initparse.getCreatedDate(issue);
      current_workflow['Status'] = initparse.getStatus(issue);
      current_workflow['totalDevelDays'] = initparse.getElapsedDays(current_workflow['CreatedDate'], target);
      current_workflow['RemainDays'] = initparse.getRemainDays(target, today);
      current_workflow = initparse.parseWorkflow(initiativelist['issues'][i]['changelog'], current_workflow);
      current_initiative_info['Workflow'] = JSON.parse(JSON.stringify(current_workflow)); 

      // Arch Review
      current_initiative_info['ARCHREVIEW'] = { };   

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
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_"+initiative_DB['snapshotDate']+".json");
  console.log("[final] Save end : initiative_DB");

  console.log("Error List = ", JSON.stringify(get_errors));

  fse.outputFileSync("./public/json/errorlist.json", JSON.stringify(get_errors), 'utf-8', function(e){
    if(e){
      console.log(e);
    }else{
      console.log("file write error list - done!");	
    }
  });

  await makeZephyrStatics();
  console.log("[final-Zephyr] Save file = initiative_DB");
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_"+initiative_DB['snapshotDate']+".json");
  console.log("[final-Zephyr] Save end : initiative_DB");
  Save_JSON_file(developerslist, "./public/json/developers.json");

  end = moment().locale('ko');
  let elapsed = (end - start)/(1000*60);
  console.log("Elapsed time = ", elapsed, " mins");
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

      for(key in epic)
      {
        if(key != 'issues')
        {
          if(key == 'EpicTotalCnt') { epic[key] = epiclist.total; } else { epic[key] = 0; }
          //console.log("key = ", key, "value = ", epic[key]);
        }
      }

      for (var j = 0; j < epiclist.total; j++) 
      {
        var init_ReleaseSP = initiative_DB['issues'][i]['ReleaseSprint']['CurRelease_SP'];
        var epic_ReleaseSP = 0;
        var init_Status = initiative_DB['issues'][i]['Workflow']['Status'];
        var epic_Status = 0;
        issue = epiclist['issues'][j];
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
        current_epic_info['Labels'] = initparse.getLabels(issue);     
        current_epic_info['SDET_NeedtoCheck'] = !initparse.checkLabels(issue, 'SDET_CHECKED'); // SDET_CHECKED label이 없을 경우 True...
        current_epic_info['SDET_NeedDevelTC'] = initparse.checkLabels(issue, '개발TC필요');
        /*
        current_epic_info['StoryPoint'] = story_point;  // need to be updated      
        */
        if(SDETVerifyOnly)
        {
          if(archjira[0] == false || current_epic_info['SDET_NeedDevelTC'] == true) { epic_keylist.push(issue['key']); }
        }
        else { epic_keylist.push(issue['key']); }

        epic['issues'][j] = JSON.parse(JSON.stringify(current_epic_info));

        if(current_epic_info['Labels'].length == 0 || current_epic_info['SDET_NeedtoCheck'] == true) { epic['EpicNeedtoCheckCnt']++; }
        if(current_epic_info['SDET_NeedDevelTC'] == true) { epic['EpicDevelTCCnt']++; } else { epic['EpicNonDevelTCCnt']++; }
       
        //if(initparse.checkIsDelayed(current_epic_info['duedate']) == true && initparse.checkIsDelivered(epic_Status) == false) { epic['EpicDelayedCnt']++; }
        if(initparse.checkIsDelivered(current_epic_info['Status']) == false)
        {
          if(initparse.checkIsDelayed(current_epic_info['duedate']) == true) { epic['EpicDelayedCnt']++; }
          if(current_epic_info['duedate'] == null) { epic['EpicDuedateNullCnt']++; }
          if(current_epic_info['AbnormalSprint'] == true) { epic['EpicAbnormalSPCnt']++; }
        }  

        if(current_epic_info['GovOrDeployment'] == true) 
        {
          epic['EpicGovOrDeploymentCnt']++;
          if(initparse.checkIsDelivered(epic_Status) == true)
          {
            epic['EpicTotalResolutionCnt']++;
            epic['EpicGovOrDeploymentResolutionCnt']++;
          }
        }
        else
        {
          epic['EpicDevelCnt']++;
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


//===================================================================================================================
// Common Area.....
//===================================================================================================================
async function makeSnapshot_ArchiReviewInfofromJira(init_index, init_keyvalue, epic_keyvalue)
{
  console.log("[Proimse 3] makeSnapshot_ArchiReviewInfofromJira ---- Get ARCH Epic-Story List / Update Story Basic Info");
 
  // Processing ARCH EPIC 
  current_Arch_Review = JSON.parse(JSON.stringify(Arch_Review)); // initialize...
  await get_ChangeLogfromJira('keyID', epic_keyvalue)
  .then((epicinfo) => {
      var issue = epicinfo['issues'][0];
      current_Arch_Review['Key'] = epic_keyvalue;
      current_Arch_Review['ScopeOfChange'] = initiative_DB['issues'][init_index]['ScopeOfChange'];
      let labelstring = initiative_DB['issues'][init_index]['Labels'].join();
      if(labelstring.includes("1st_reviewed")) { current_Arch_Review['First Review']['1stReviewDone'] = true; }
      if(labelstring.includes("interface_review")) { current_Arch_Review['First Review']['Plan']['Interface Review'] = true; }
      if(labelstring.includes("sangria")) { current_Arch_Review['First Review']['Plan']['Sangria Review'] = true; }
      if(labelstring.includes("fmea")) { current_Arch_Review['First Review']['Plan']['FMEA'] = true; }

      var current_Arch_1st_workflow = JSON.parse(JSON.stringify(Arch_1st_workflow));
      current_Arch_1st_workflow['CreatedDate'] = initparse.getCreatedDate(issue);
      current_Arch_1st_workflow['Status'] = initparse.getStatus(issue);
      /*
      [RED] 
       1. init status가 ELT가 지났는데 1stReviewDone == false 이면 위반 : o
       2. init status가  In Progress 인데 ARCH EPIC Status가 Scoping / Review상태이면 위반 : o
       3. init status가 Delivered/Closed상태인데 Arch Epic이 Delivered/Closed가 아닌경우  : o
       4. Release Sprint 일정 2개 Sprint 이내에도 Arch Epic이 Closed가 안된경우 : o
       [YELLOW]
       1. [ARCHREVIEW]항목이 Null인경우.... 즉 Archi Epic이 없는 경우.... 1st Review 미진행 또는 진행중인 항목. : init value...
       [GREEN]
       1. [RED] / [YELLOW]를 제외한 Default 상태
      */
      let init_status = initiative_DB['issues'][init_index]['Workflow']['Status'];
      let init_ReleaseSP = initiative_DB['issues'][init_index]['ReleaseSprint']['CurRelease_SP'];
      let arch_epicstatus = current_Arch_1st_workflow['Status'];
      if(init_status != 'Deferred' && init_status != 'PROPOSED TO DEFER') // Normal workflow
      {
        let color = 'GREEN';
        if(init_status != 'DRAFTING' && init_status != 'PO REVIEW')
        {
          // RED case
          if(labelstring.includes("1st_reviewed")) { color = 'RED'; }
          if(init_status == "In Progress" && (arch_epicstatus == 'Scoping' || arch_epicstatus == 'Review')) { color = 'RED'; }
          if((init_status == "Delivered" || init_status == "Closed") && (arch_epicstatus != 'Delivered' && arch_epicstatus != 'Closed')) { color = 'RED'; }
          /*
          let target = initparse.conversionSprintToDate(init_ReleaseSP);
          target = moment(target).add(9, 'Hour');
          let today = moment().locale('ko');
          today = moment(today).add(9, 'Hour');
          let diff = (target - today) / (1000*60*60*24); 
          */
          let target = initparse.conversionSprintToDate(init_ReleaseSP);
          let today = moment().locale('ko');
          let diff = initparse.getRemainDays(target, today);
          if(diff <= 28 && (arch_epicstatus != 'Delivered' && arch_epicstatus != 'Closed')) { color = 'RED'; }
          if((diff > 28 && diff <= 42) && (arch_epicstatus != 'Delivered' && arch_epicstatus != 'Closed')) { color = 'YELLOW'; }
        }
        current_Arch_1st_workflow['Signal'] = color;
      }
      current_Arch_1st_workflow['Signal'] = 'GREEN';
      current_Arch_1st_workflow = initparse.parseArchEpicWorkflow(epicinfo['issues'][0]['changelog'], current_Arch_1st_workflow);
      current_Arch_Review['First Review']['workflow'] = current_Arch_1st_workflow;
      //initiative_DB['issues'][init_index]['ARCHREVIEW'] = JSON.parse(JSON.stringify(current_Arch_Review)); 
  })
  .catch((error) => { console.log("[ARCH] Errors of getting Epic_History = ", error); });
  
  // Processing ARCH EPIC-Story 1
  var story_keylist = new Array();
  await getStoryListfromJira(epic_keyvalue)
  .then((storylist) => {
    for (var i = 0; i < storylist.total; i++) 
    {
      story_keylist.push(storylist['issues'][i]['key']);
    }
  }).catch(error => {
    console.log("[Catch] getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue, " - exception error = ", error);
  });

  // Processing ARCH EPIC-Story 2
  for(var i = 0; i < story_keylist.length; i++)
  {
    await get_ChangeLogfromJira('keyID', story_keylist[i])
    .then((storyinfo) => {
        var issue = storyinfo['issues'][0];
        var current_Arch_2nd_workflow = JSON.parse(JSON.stringify(Arch_2nd_workflow));
        let summary = initparse.getSummary(issue);
        let reviewkey = null;
        current_Arch_2nd_workflow['CreatedDate'] = initparse.getCreatedDate(issue);
        current_Arch_2nd_workflow['Status'] = initparse.getStatus(issue);
        current_Arch_2nd_workflow['Signal'] = "-";
    
        if(summary.includes("INTERFACE REVIEW")) { reviewkey = "Interface Review"; }
        else if(summary.includes("DOCUMENT REVIEW")) { reviewkey = "Document Review"; }
        else if(summary.includes("ARCHITECTURE REVIEW")) { reviewkey = "Architecture Review"; }
        else if(summary.includes("FMEA REVIEW")) { reviewkey = "FMEA Review"; }

        if(reviewkey != null) 
        { 
          current_Arch_2nd_workflow['Signal'] = "GREEN";
          /*
          [RED] 
          1. Interface Review / Document Review 가 Release SP 3개 SPRINT전에 종료가 안되면.....
          2. Release Sprint 일정 3개 Sprint 이내에도 Arch Story(Arch review / fmea review)가 Verify/Closed가 안된경우
          3. arch epic이 Delivered/Closed상태인데 Arch Story가 Closed가 아닌경우
          [YELLOW]
          [GREEN]
          1. [RED] / [YELLOW]를 제외한 Default 상태
          */
          let init_status = initiative_DB['issues'][init_index]['Workflow']['Status'];
          let init_ReleaseSP = initiative_DB['issues'][init_index]['ReleaseSprint']['CurRelease_SP'];
          let arch_epicstatus = current_Arch_Review['First Review']['workflow']['Status'];
          let arch_curstorystatus = current_Arch_2nd_workflow['Status'];

          let target = initparse.conversionSprintToDate(init_ReleaseSP);
          let today = moment().locale('ko');
          let diff = initparse.getRemainDays(target, today);
          let color = 'GREEN';
          // [RED Case]
          if(reviewkey == "Interface Review" || reviewkey == "Document Review")
          {
            if(diff <= 42 && arch_curstorystatus != "Closed") { color = "RED"; } 
          }
          if((arch_epicstatus == "Delivered" || arch_epicstatus == 'Closed') && (arch_curstorystatus != "Closed")) { color = "RED"; }
          if(reviewkey == "Architecture Review" || reviewkey == "FMEA Review")
          {
            if(diff <= 42 && (arch_curstorystatus != "Verify" && arch_curstorystatus != "Closed")) { color = "RED"; } 
          }
          // [YELLOW Case]
          // ??

          current_Arch_Review['Second Review'][reviewkey]['output'] = true; 
          current_Arch_Review['Second Review'][reviewkey]['workflow'] = initparse.parseArchStoryWorkflow(storyinfo['issues'][0]['changelog'], current_Arch_2nd_workflow);
        }
        initiative_DB['issues'][init_index]['ARCHREVIEW'] = JSON.parse(JSON.stringify(current_Arch_Review)); 
    })
    .catch((error) => { console.log("[ARCH] Errors of getting EpicStory_History = ", error); });    
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
      if(initiative_DB['issues'][init_index]['EPIC']['issues'][i]['SDET_NeedDevelTC'] == true)
      {
        if(zephyrlist.total > 0) { initiative_DB['issues'][init_index]['EPIC']['EpicHasTCCnt']++; }
      }
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
    if(async_mode == false) { await makeSnapshot_SyncEpicZephyrExecutionInfofromJira(init_index, i, zephyr_issueIdlist); }
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
      if(initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][i]['SDET_NeedDevelTC'] == true)
      {
        if(zephyrlist.total > 0) // 연결율...
        { 
          initiative_DB['issues'][init_index]['STORY_SUMMARY']['StoryHasTCCnt']++; 
          initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['STORY_SUMMARY']['StoryHasTCCnt']++; 
        }
      }

      let storyzephyr = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY']['issues'][i]['Zephyr'];
      storyzephyr['ZephyrCnt'] = zephyrlist.total; 
      zephyr_issueIdlist = [];
      let issue = 0;
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        let status = 0;
        issue = zephyrlist['issues'][j];
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = issue['id']; 
        zephyr_issueIdlist.push(issue['id']);
        current_zephyr_info['Zephyr Key'] = initparse.getKey(issue);      
        current_zephyr_info['Summary'] = initparse.getSummary(issue);        
        current_zephyr_info['Assignee'] = initparse.getAssignee(issue);         
        current_zephyr_info['Status'] = status = initparse.getStatus(issue);        
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

  for(key in initstorysummary) { initstorysummary[key] = 0; }
  var storykeyverify = [];
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

      for(key in epicstorysummary)
      {
        if(key == 'StoryTotalCnt') { epicstorysummary[key] = storylist.total; } else { epicstorysummary[key] = 0; }
      }

      for (var j = 0; j < storylist.total; j++) 
      {
        var init_ReleaseSP = initiative_DB['issues'][init_index]['ReleaseSprint']['CurRelease_SP'];
        var init_Status = initiative_DB['issues'][init_index]['Workflow']['Status'];
        var story_ReleaseSP = 0;
        var story_Status = 0;
        issue = storylist['issues'][j];
        current_story_info = JSON.parse(JSON.stringify(story_info));
        current_story_info['Story Key'] = initparse.getKey(issue); 
        current_story_info['duedate'] = initparse.getDueDate(issue);        
        current_story_info['Release_SP'] = story_ReleaseSP = initparse.conversionDuedateToSprint(current_story_info['duedate']);         
        current_story_info['Summary'] = initparse.getSummary(issue);         
        current_story_info['Assignee'] = initparse.getAssignee(issue);        
        current_story_info['Status'] = story_Status = initparse.getStatus(issue);        
        current_story_info['CreatedDate'] = initparse.getCreatedDate(issue);        
        current_story_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
        current_story_info['AbnormalSprint'] = initparse.checkAbnormalSP(init_ReleaseSP, init_Status, story_ReleaseSP, story_Status); 
        current_story_info['Labels'] = initparse.getLabels(issue);     
        current_story_info['SDET_NeedtoCheck'] = !initparse.checkLabels(issue, 'SDET_CHECKED');
        current_story_info['SDET_NeedDevelTC'] = initparse.checkLabels(issue, '개발TC필요');

        current_story_info['StoryPoint'] = 0; // need to be updated     
        /*  
        current_story_info['Zephyr'] = 0; // need to be updated      
        */
       storykeyverify.push(current_story_info['Story Key']);
        // 개발항목이면..... Story list에 추가하여 zephyer까지 체크하도록....
        if(SDETVerifyOnly)
        {
          if(current_story_info['SDET_NeedDevelTC'] == true) { story_keylist.push(storylist['issues'][j]['key']); }
        } else { story_keylist.push(storylist['issues'][j]['key']); }

        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['STORY']['issues'][j] = JSON.parse(JSON.stringify(current_story_info));   

        if(current_story_info['AbnormalSprint'] == true) { initiative_DB['issues'][init_index]['AbnormalSprint'] = true; }

        if(current_story_info['Labels'].length == 0 || current_story_info['SDET_NeedtoCheck'] == true) { epicstorysummary['StoryNeedtoCheckCnt']++; }
        else
        {
          if(current_story_info['SDET_NeedDevelTC'] == true) { epicstorysummary['StoryDevelTCCnt']++; } else { epicstorysummary['StoryNonDevelTCCnt']++; }
        }

        if(initparse.checkIsDelivered(story_Status) == false)
        {
          if(initparse.checkIsDelayed(current_story_info['duedate']) == true) { epicstorysummary['StoryDelayedCnt']++; }
          if(current_story_info['duedate'] == null) { epicstorysummary['StoryDuedateNullCnt']++; }
          if(current_story_info['AbnormalSprint'] == true) { epicstorysummary['StoryAbnormalSPCnt']++; }
        }

        if(current_story_info['GovOrDeployment'] == true) 
        {
          epicstorysummary['StoryGovOrDeploymentCnt']++;
          if(initparse.checkIsDelivered(story_Status) == true)
          {
            epicstorysummary['StoryTotalResolutionCnt']++;
            epicstorysummary['StoryGovOrDeploymentResolutionCnt']++;
          }
        }
        else
        {
          epicstorysummary['StoryDevelCnt']++;
          if(initparse.checkIsDelivered(story_Status) == true)
          {
            epicstorysummary['StoryTotalResolutionCnt']++;
            epicstorysummary['StoryDevelResolutionCnt']++;
          }
        }             
      }
 
      for(key in initstorysummary) { initstorysummary[key] += epicstorysummary[key]; }
    }).catch(error => {
      console.log("[Catch] getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue, " - exception error = ", error);
      let error_info = { 'IK' : '', 'EK' : '' };
      error_info['IK'] = init_keyvalue;
      error_info['EK'] = epic_keyvalue;
      get_errors['storylist'].push(error_info);
    });
    await makeSnapshot_StoryZephyrInfofromJira(init_index, i, story_keylist);     
  }
  console.log("[[Storykeylist]] = ", storykeyverify.join());
  Save_JSON_file(storykeyverify, "./public/json/storylist.json");

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


async function makeSnapshot_SyncEpicZephyrExecutionInfofromJira(init_index, epic_index, zephyr_issueIdlist)
{
  console.log("[Promise 4.1] makeSnapshot_SyncEpicZephyrExecutionInfofromJira ---- Update Epic~Zephyr Executions info");

  for(var i = 0; i < zephyr_issueIdlist.length; i++)
  {
    var zephyrkeyID = zephyr_issueIdlist[i];
    await getZephyerExecutionfromJira(zephyrkeyID)
    .then((zephyrExecution) => {
      console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[Z-index]:", i, "[Z-KeyID]:", zephyrkeyID);
      //console.log(zephyrExecution);
      let issue = 0;
      for (var j = 0; j < zephyrExecution['executions'].length; j++) 
      {
        current_zephyr_exeinfo = {}; 
        issue = zephyrExecution['executions'][j];
        current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
        current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
        current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
        current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
        current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
        current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Zephyr']['ZephyrTC'][i]['Executions'][j] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
      }
    }).catch(error => {
      console.log("[Catch] getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[Z-index]:", 
      i, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
      let error_info = { 'IK' : '', 'EK' : '', 'ZK': '', 'ZID' : '' };
      error_info['IK'] = initiative_DB['issues'][init_index]['Initiative Key'];
      error_info['EK'] = initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Epic Key'];
      error_info['ZK'] = initiative_DB['issues'][init_index]['EPIC']['Zephyr']['Zephyr TC'][i]['Zephyr Key'];
      error_info['ZID'] = zephyrkeyID;
      get_errors['e_zephyr_exeinfo'].push(error_info);
    });
  }
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
      let status = 0;
      current_zephyr_exeinfo = {}; 
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      issue = zephyrExecution['executions'][i];
      current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
      current_zephyr_exeinfo['executionStatus'] = status = initparse.getZephyrExeinfo_Status(issue);
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



async function makeZephyrStatics()
{
  console.log("[Proimse 1] makeZephyrStatics ---- make statics of zephyr Info");
  let initiative = initiative_DB['issues'];  

  Initiative_Statics['EPIC+STORY_STATICS']['TOTAL'] = JSON.parse(JSON.stringify(StaticsInfo));
  Initiative_Statics['EPIC_STATICS']['TOTAL'] = JSON.parse(JSON.stringify(StaticsInfo));
  Initiative_Statics['STORY_STATICS']['TOTAL'] = JSON.parse(JSON.stringify(StaticsInfo));

  // [INITIATIVE LOOP]
  for(var i = 0; i < initiative.length; i++)
  {
    developers = {};
    console.log("[Initiative] i = ", i, "#######################");
    // SUM : EPIC + STORY 
    let current_Statics = JSON.parse(JSON.stringify(Initiative_Statics));

    let sum_total = current_Statics['EPIC+STORY_STATICS']['TOTAL'];
    let sum_org = current_Statics['EPIC+STORY_STATICS']['ORGANIZATION'];
    let sum_devel = current_Statics['EPIC+STORY_STATICS']['DEVELOPER'];

    // EPIC  
    let epicz_total = current_Statics['EPIC_STATICS']['TOTAL'];
    let epicz_org = current_Statics['EPIC_STATICS']['ORGANIZATION'];
    let epicz_devel = current_Statics['EPIC_STATICS']['DEVELOPER'];

    // STORY 
    let storyz_total = current_Statics['STORY_STATICS']['TOTAL'];
    let storyz_org = current_Statics['STORY_STATICS']['ORGANIZATION'];
    let storyz_devel = current_Statics['STORY_STATICS']['DEVELOPER'];

    // [EPIC LOOP]
    let epic = initiative_DB['issues'][i]['EPIC']['issues'];
    for(var j = 0; j < epic.length; j++)
    {
      var epicowner = epic[j]['Assignee'];
      //setDevelopersInformation(epicowner);
      if(epicowner == null) { epicowner = "Unassigned"; }
      if((epicowner in developers) == false) { developers[epicowner] = []; }
      if((epicowner in developerslist) == false) 
      {
        await ldap.getLDAP_Info(epicowner)
        .then((result) => { 
          initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[epicowner] = developers[epicowner] = result; }); 
          console.log("name = ", developers[epicowner][0], " position = ", developers[epicowner][1], 
          " department = ", developers[epicowner][2], " email = ", developers[epicowner][3]);
        })
        .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
      }
      else
      {
        developers[epicowner] = developerslist[epicowner];
      }

      if((epicowner in sum_devel) == false) { sum_devel[epicowner] = JSON.parse(JSON.stringify(StaticsInfo)); }
      if((epicowner in epicz_devel) == false) { epicz_devel[epicowner] = JSON.parse(JSON.stringify(StaticsInfo)); }
      if((epicowner in storyz_devel) == false) { storyz_devel[epicowner] = JSON.parse(JSON.stringify(StaticsInfo)); }

      if(epic[j]['Labels'].length == 0 || epic[j]['SDET_NeedtoCheck'] == true) { epicz_devel[epicowner]['EpicNeedtoCheckCnt']++; }
      if(epic[j]['SDET_NeedDevelTC'] == true) { epicz_devel[epicowner]['EpicDevelTCCnt']++; } else { epicz_devel[epicowner]['EpicNonDevelTCCnt']++; }

      epicz_devel[epicowner]['EpicTotalCnt']++;
      
      //if(initparse.checkIsDelayed(epic[j]['duedate']) == true && initparse.checkIsDelivered(epic[j]['Status']) == false) { epicz_devel[epicowner]['EpicDelayedCnt']++; }

      if(initparse.checkIsDelivered(epic[j]['Status']) == false)
      {
        if(initparse.checkIsDelayed(epic[j]['duedate']) == true) { epicz_devel[epicowner]['EpicDelayedCnt']++; }
        if(epic[j]['duedate'] == null) { epicz_devel[epicowner]['EpicDuedateNullCnt']++; }
        if(epic[j]['AbnormalSprint'] == true) { epicz_devel[epicowner]['EpicAbnormalSPCnt']++; }
      }      

      if(epic[j]['GovOrDeployment'] == true) 
      {
        epicz_devel[epicowner]['EpicGovOrDeploymentCnt']++;
        if(initparse.checkIsDelivered(epic[j]['Status']) == true)
        {
          epicz_devel[epicowner]['EpicTotalResolutionCnt']++;
          epicz_devel[epicowner]['EpicGovOrDeploymentResolutionCnt']++;
        }
      }
      else
      {
        epicz_devel[epicowner]['EpicDevelCnt']++;
        if(initparse.checkIsDelivered(epic[j]['Status']) == true)
        {
          epicz_devel[epicowner]['EpicTotalResolutionCnt']++;
          epicz_devel[epicowner]['EpicDevelResolutionCnt']++;
        }
      }

      // [EPIC ZEPHYR LOOP]
      let epic_zephyr = initiative_DB['issues'][i]['EPIC']['issues'][j]['Zephyr']['ZephyrTC'];

      if(initiative_DB['issues'][i]['EPIC']['issues'][j]['SDET_NeedDevelTC'] == true)
      {
        // [TBC] 연결율 : Archive zephy만 달려있을 경우에는 EpicHasTCCnt가 0이 되어야 하나 Archive Zephyer개수가 반영되는지 / 예외처리 필요함.
        if(epic_zephyr.length > 0) { epicz_devel[epicowner]['EpicHasTCCnt']++; }
      }

      for(var k = 0; k < epic_zephyr.length; k++)
      {
        if(initiative_DB['issues'][i]['EPIC']['issues'][j]['SDET_NeedDevelTC'] == true)
        {
          console.log("[EZ] i = ", i, " j = ", j, " k = ", k);
          let epicz_assignee = epic_zephyr[k]['Assignee'];
          //setDevelopersInformation(epicz_assignee);
          if(epicz_assignee == null) { epicz_assignee = "Unassigned"; }
          if((epicz_assignee in developers) == false) { developers[epicz_assignee] = []; }
          //console.log("epicz_assignee =", epicz_assignee);
          if((epicz_assignee in epicz_devel) == false)
          {
            epicz_devel[epicz_assignee] = JSON.parse(JSON.stringify(StaticsInfo));
            if((epicz_assignee in developerslist) == false)
            {
              await ldap.getLDAP_Info(epicz_assignee)
              .then((result) => { 
                initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[epicz_assignee] = developers[epicz_assignee] = result; }); 
                console.log("name = ", developers[epicz_assignee][0], " position = ", developers[epicz_assignee][1], 
                " department = ", developers[epicz_assignee][2], " email = ", developers[epicz_assignee][3]);
              })
              .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
            }
            else
            {
              developers[epicz_assignee] = developerslist[epicz_assignee];
            }
          }

          if((epicz_assignee in sum_devel) == false) { sum_devel[epicz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
          if((epicz_assignee in epicz_devel) == false) { epicz_devel[epicz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
          if((epicz_assignee in storyz_devel) == false) { storyz_devel[epicz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }

          epicz_devel[epicz_assignee]['ZephyrCnt']++;
          if(epic_zephyr[k]['Status'] == "Draft") { epicz_devel[epicz_assignee]['Zephyr_S_Draft']++; }
          else if(epic_zephyr[k]['Status'] == "Review") { epicz_devel[epicz_assignee]['Zephyr_S_Review']++; }
          else if(epic_zephyr[k]['Status'] == "Update") { epicz_devel[epicz_assignee]['Zephyr_S_Update']++; }
          else if(epic_zephyr[k]['Status'] == "Active") { epicz_devel[epicz_assignee]['Zephyr_S_Active']++; }
          else if(epic_zephyr[k]['Status'] == "Approval") { /*epicz_devel[epicz_assignee]['Zephyr_S_Approval']++;*/ epicz_devel[epicz_assignee]['Zephyr_S_Active']++; }
          else if(epic_zephyr[k]['Status'] == "Archived") { epicz_devel[epicz_assignee]['Zephyr_S_Archived']++; epicz_devel[epicz_assignee]['ZephyrCnt']--; }
          else { console.log("[EZ] Status is not Defined = ", epicz_devel[k]['Status']); }

          // [EPIC ZEPHYR EXECUTION LOOP]
          for(var l = 0; l < epic_zephyr[k]['Executions'].length; l++)
          {
            console.log("[EZ-Exec] i = ", i, " j = ", j, " k = ", k, " l = ", l);
            let epicze_assignee = epic_zephyr[k]['Executions'][l]['executedBy'];
            //setDevelopersInformation(epicze_assignee);
            if(epicze_assignee == null) { epicze_assignee = "Unassigned"; }
            if((epicze_assignee in developers) == false) { developers[epicze_assignee] = []; }
            if((epicze_assignee in epicz_devel) == false)
            {
              epicz_devel[epicze_assignee] = JSON.parse(JSON.stringify(StaticsInfo));
              if((epicze_assignee in developerslist) == false)
              {
                await ldap.getLDAP_Info(epicze_assignee)
                .then((result) => { 
                  initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[epicze_assignee] = developers[epicze_assignee] = result; }); 
                  console.log("name = ", developers[epicze_assignee][0], " position = ", developers[epicze_assignee][1], 
                              " department = ", developers[epicze_assignee][2], " email = ", developers[epicze_assignee][3]);
                })
                .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
              }
              else
              {
                developers[epicze_assignee] = developerslist[epicze_assignee];
              }
            }

            if((epicze_assignee in sum_devel) == false) { sum_devel[epicze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
            if((epicze_assignee in epicz_devel) == false) { epicz_devel[epicze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
            if((epicze_assignee in storyz_devel) == false) { storyz_devel[epicze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }

            let status = epic_zephyr[k]['Executions'][l]['executionStatus'];
            epicz_devel[epicze_assignee]['ZephyrExecutionCnt']++;
            if(status == "1") { epicz_devel[epicze_assignee]['executionStatus_PASS']++; }
            else if(status == "2") { epicz_devel[epicze_assignee]['executionStatus_FAIL']++; }
            else if(status == "-1") { epicz_devel[epicze_assignee]['executionStatus_UNEXEC']++; }
            else if(status == "3" || status == "4") { epicz_devel[epicze_assignee]['executionStatus_BLOCK']++; }
            else { console.log("[EZE] executionStatus is not Defined = ", status); }

            // check the result of last test status.
            if(l == (epic_zephyr[k]['Executions'].length -1) && status == "1") 
            {
              //if(initiative_DB['issues'][i]['EPIC']['issues'][j]['SDET_NeedDevelTC'] == true)
              { 
                epicz_devel[epicz_assignee]['PassEpicCnt']++; 
              }
            }
          }       
        }
      }

      // [STORY LOOP]
      let story = initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'];
      for(var k = 0; k < story.length; k++)
      {
        var storyowner = story[k]['Assignee'];
        //setDevelopersInformation(storyowner);
        if(storyowner == null) { storyowner = "Unassigned"; }
        if((storyowner in developers) == false) { developers[storyowner] = []; }
        if((storyowner in developerslist) == false) 
        {
          await ldap.getLDAP_Info(storyowner)
          .then((result) => { 
            initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[storyowner] = developers[storyowner] = result; }); 
            console.log("name = ", developers[storyowner][0], " position = ", developers[storyowner][1], 
            " department = ", developers[storyowner][2], " email = ", developers[storyowner][3]);
          })
          .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
        }
        else
        {
          developers[storyowner] = developerslist[storyowner];
        }

        if((storyowner in sum_devel) == false) { sum_devel[storyowner] = JSON.parse(JSON.stringify(StaticsInfo)); }
        if((storyowner in epicz_devel) == false) { epicz_devel[storyowner] = JSON.parse(JSON.stringify(StaticsInfo)); }
        if((storyowner in storyz_devel) == false) { storyz_devel[storyowner] = JSON.parse(JSON.stringify(StaticsInfo)); }

        if(story[k]['Labels'].length == 0 || story[k]['SDET_NeedtoCheck'] == true) { storyz_devel[storyowner]['StoryNeedtoCheckCnt']++; }
        if(story[k]['SDET_NeedDevelTC'] == true) { storyz_devel[storyowner]['StoryDevelTCCnt']++; } else { storyz_devel[storyowner]['StoryNonDevelTCCnt']++; }

        storyz_devel[storyowner]['StoryTotalCnt']++;
        
        //if(initparse.checkIsDelayed(story[k]['duedate']) == true && initparse.checkIsDelivered(story[k]['Status']) == false) { storyz_devel[storyowner]['StoryDelayedCnt']++; }
        if(initparse.checkIsDelivered(story[k]['Status']) == false)
        {
          if(initparse.checkIsDelayed(story[k]['duedate']) == true) { storyz_devel[storyowner]['StoryDelayedCnt']++; }
          if(story[k]['duedate'] == null) { storyz_devel[storyowner]['StoryDuedateNullCnt']++; }
          if(story[k]['AbnormalSprint'] == true) { storyz_devel[storyowner]['StoryAbnormalSPCnt']++; }
        }      

        if(story[k]['GovOrDeployment'] == true) 
        {
          storyz_devel[storyowner]['StoryGovOrDeploymentCnt']++;
          if(initparse.checkIsDelivered(story[k]['Status']) == true)
          {
            storyz_devel[storyowner]['StoryTotalResolutionCnt']++;
            storyz_devel[storyowner]['StoryGovOrDeploymentResolutionCnt']++;
          }
        }
        else
        {
          storyz_devel[storyowner]['StoryDevelCnt']++;
          if(initparse.checkIsDelivered(story[k]['Status']) == true)
          {
            storyz_devel[storyowner]['StoryTotalResolutionCnt']++;
            storyz_devel[storyowner]['StoryDevelResolutionCnt']++;
          }
        }
  
        // [STORY ZEPHYR LOOP]
        let story_zephyr = initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['Zephyr']['ZephyrTC'];

        if(initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['SDET_NeedDevelTC'] == true)
        {
          // [TBC] 연결율 : Archive zephy만 달려있을 경우에는 StoryHasTCCnt가 0이 되어야 하나 Archive Zephyer개수가 반영되는지 / 예외처리 필요함.
          if(story_zephyr.length > 0) { storyz_devel[storyowner]['StoryHasTCCnt']++; }
        }

        for(var l = 0; l < story_zephyr.length; l++)
        {
          if(initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['SDET_NeedDevelTC'] == true)
          {
            let storyz_assignee = story_zephyr[l]['Assignee'];
            //setDevelopersInformation(storyz_assignee);
            if(storyz_assignee == null) { storyz_assignee = "Unassigned"; }
            if((storyz_assignee in developers) == false) { developers[storyz_assignee] = []; }
            if((storyz_assignee in storyz_devel) == false)
            {
              storyz_devel[storyz_assignee] = JSON.parse(JSON.stringify(StaticsInfo));
              if((storyz_assignee in developerslist) == false)
              {
                await ldap.getLDAP_Info(storyz_assignee)
                .then((result) => { 
                  initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[storyz_assignee] = developers[storyz_assignee] = result; }); 
                  console.log("name = ", developers[storyz_assignee][0], " position = ", developers[storyz_assignee][1], 
                  " department = ", developers[storyz_assignee][2], " email = ", developers[storyz_assignee][3]);
                })
                .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
              }
              else
              {
                developers[storyz_assignee] = developerslist[storyz_assignee];
              }
            }

            if((storyz_assignee in sum_devel) == false) { sum_devel[storyz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
            if((storyz_assignee in epicz_devel) == false) { epicz_devel[storyz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
            if((storyz_assignee in storyz_devel) == false) { storyz_devel[storyz_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }

            storyz_devel[storyz_assignee]['ZephyrCnt']++;
            if(story_zephyr[l]['Status'] == "Draft") { storyz_devel[storyz_assignee]['Zephyr_S_Draft']++; }
            else if(story_zephyr[l]['Status'] == "Review") { storyz_devel[storyz_assignee]['Zephyr_S_Review']++; }
            else if(story_zephyr[l]['Status'] == "Update") { storyz_devel[storyz_assignee]['Zephyr_S_Update']++; }
            else if(story_zephyr[l]['Status'] == "Active") { storyz_devel[storyz_assignee]['Zephyr_S_Active']++; }
            else if(story_zephyr[l]['Status'] == "Approval") { /*storyz_devel[storyz_assignee]['Zephyr_S_Approval']++;*/ storyz_devel[storyz_assignee]['Zephyr_S_Active']++; }
            else if(story_zephyr[l]['Status'] == "Archived") { storyz_devel[storyz_assignee]['Zephyr_S_Archived']++; storyz_devel[storyz_assignee]['ZephyrCnt']--; }
            else { console.log("[SZ] Status is not Defined = ", story_zephyr[l]['Status']); }
        
            // [STORY ZEPHYR EXECUTION LOOP]
            console.log("[SZ] i = ", i, " j = ", j, " k = ", k, " l = ", l);
            for(var m = 0; m < story_zephyr[l]['Executions'].length; m++)
            {
              let storyze_assignee = story_zephyr[l]['Executions'][m]['executedBy'];
              //setDevelopersInformation(storyze_assignee);
              if(storyze_assignee == null) { storyze_assignee = "Unassigned"; }
              if((storyze_assignee in developers) == false) { developers[storyze_assignee] = []; }
              if((storyze_assignee in storyz_devel) == false)
              {
                storyz_devel[storyze_assignee] = JSON.parse(JSON.stringify(StaticsInfo));
                if((storyze_assignee in developerslist) == false)
                {
                  await ldap.getLDAP_Info(storyze_assignee)
                  .then((result) => { 
                    initparse.getPersonalInfo(result['displayName'], result['DepartmentCode']).then((result) => { developerslist[storyze_assignee] = developers[storyze_assignee] = result; }); 
                    console.log("name = ", developers[storyze_assignee][0], " position = ", developers[storyze_assignee][1], 
                    " department = ", developers[storyze_assignee][2], " email = ", developers[storyze_assignee][3]);
                  })
                  .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
                }
                else
                {
                  developers[storyze_assignee] = developerslist[storyze_assignee];
                }
              }

              if((storyze_assignee in sum_devel) == false) { sum_devel[storyze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
              if((storyze_assignee in epicz_devel) == false) { epicz_devel[storyze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
              if((storyze_assignee in storyz_devel) == false) { storyz_devel[storyze_assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }

              console.log("[SZ-Exec] i = ", i, " j = ", j, " k = ", k, " l = ", l, " m = ", m);    

              let status = story_zephyr[l]['Executions'][m]['executionStatus'];
              storyz_devel[storyze_assignee]['ZephyrExecutionCnt']++;
              if(status == "1") { storyz_devel[storyze_assignee]['executionStatus_PASS']++; }
              else if(status == "2") { storyz_devel[storyze_assignee]['executionStatus_FAIL']++; }
              else if(status == "-1") { storyz_devel[storyze_assignee]['executionStatus_UNEXEC']++; }
              else if(status == "3" || status == "4") { storyz_devel[storyze_assignee]['executionStatus_BLOCK']++; }
              else { console.log("[SZE] executionStatus is not Defined = ", status); }

              // check the result of last test status.
              if(m == (story_zephyr[l]['Executions'].length -1) && status == "1") 
              {
                //if(initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['SDET_NeedDevelTC'] == true)
                { 
                  storyz_devel[storyz_assignee]['PassStoryCnt']++; 
                }
              }
            }
          }
        }       
      }
    }

    console.log("developers = ", JSON.stringify(developers));
    // DEVELOPER
    for(assignee in developers)
    {
      if(assignee == null)
      {
        console.log("############################################");
        console.log("*******????????????????*******assignee = ", assignee);
        console.log("############################################");
      }
      else
      {
        //################################################################################
        // Developer Statics
        //################################################################################
        for(key in sum_devel[assignee]) { sum_devel[assignee][key] =  epicz_devel[assignee][key] + storyz_devel[assignee][key]; }
        for(key in epicz_total) { epicz_total[key] += epicz_devel[assignee][key]; }
        for(key in storyz_total) { storyz_total[key] += storyz_devel[assignee][key]; } //if(key.includes("Epic") == false)
        
        //################################################################################
        // Organization Statics
        //################################################################################
        let orgname = developerslist[assignee][2];
        if(orgname == null || orgname == undefined) { console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"); } else { console.log("Org Name = ", orgname); }
        if((orgname in sum_org) == false) { sum_org[orgname] = JSON.parse(JSON.stringify(StaticsInfo)); }
        if((orgname in epicz_org) == false) { epicz_org[orgname] = JSON.parse(JSON.stringify(StaticsInfo)); }
        if((orgname in storyz_org) == false) { storyz_org[orgname] = JSON.parse(JSON.stringify(StaticsInfo)); }

        for(key in epicz_org[orgname]) { epicz_org[orgname][key] += epicz_devel[assignee][key]; }
        for(key in storyz_org[orgname]) { storyz_org[orgname][key] += storyz_devel[assignee][key]; }
        for(key in sum_org[orgname]) { sum_org[orgname][key] = epicz_org[orgname][key] + storyz_org[orgname][key]; }
      }
    }

    //################################################################################
    // EPIC + STORY Statics
    //################################################################################
    for(key in sum_total) { sum_total[key] = epicz_total[key] + storyz_total[key]; }

    initiative_DB['issues'][i]['STATICS'] = current_Statics;
    initiative_DB['issues'][i]['developers'] = developers;
  }
  initiative_DB['developers'] = developerslist;
}

//===========================

async function make_URLinfo()
{
  console.log("[Proimse 1] make_URLinfo ---- make URL of JIRA Info");
  /*
  load_InitiativeDB('./public/json/initiative_DB_46093_Latest.json').then((result) => {
    console.log("[TEST] Read Initiative DB = ", JSON.stringify(initiative_DB));
  */
  var initiative = initiative_DB['issues'];  

  // [INITIATIVE LOOP]
  for(var i = 0; i < initiative.length; i++)
  {
    console.log("[Initiative] i = ", i, "#######################");
    let orgcode = initiative_DB['issues'][i]['OrgInfo'][4];  

    current_urlinfo = JSON.parse(JSON.stringify(urlinfo));
    current_urlinfo['EPIC+STORY_LINK']['TOTAL'] = JSON.parse(JSON.stringify(total_link_key));
    current_urlinfo['EPIC_LINK']['TOTAL'] = JSON.parse(JSON.stringify(total_link_key));
    current_urlinfo['STORY_LINK']['TOTAL'] = JSON.parse(JSON.stringify(total_link_key));

    // [EPIC LOOP]
    let epic = initiative_DB['issues'][i]['EPIC']['issues'];
    for(var j = 0; j < epic.length; j++)
    {
      current_urlinfo['EPIC_LINK']['TOTAL']['Total']['keys'].push(epic[j]['Epic Key']);

      if(epic[j]['Labels'].length == 0 || epic[j]['SDET_NeedtoCheck'] == true) { current_urlinfo['EPIC_LINK']['TOTAL']['NeedtoCheck']['keys'].push(epic[j]['Epic Key']); }
      
      if(epic[j]['SDET_NeedDevelTC'] == true) { current_urlinfo['EPIC_LINK']['TOTAL']['DevelTC']['keys'].push(epic[j]['Epic Key']); } 
      else { current_urlinfo['EPIC_LINK']['TOTAL']['NonDevelTC']['keys'].push(epic[j]['Epic Key']); }
    
      if(initparse.checkIsDelivered(epic[j]['Status']) == false)
      {
        if(epic[j]['AbnormalSprint'] == true) { current_urlinfo['COMMON']['AbnormalSPList'].push(epic[j]['Epic Key']); }
      }      

      // [EPIC ZEPHYR LOOP]
      let epic_zephyr = initiative_DB['issues'][i]['EPIC']['issues'][j]['Zephyr']['ZephyrTC'];
      for(var k = 0; k < epic_zephyr.length; k++)
      {
        if(initiative_DB['issues'][i]['EPIC']['issues'][j]['SDET_NeedDevelTC'] == true)
        {
          console.log("[EZ] i = ", i, " j = ", j, " k = ", k);
          let epicz_assignee = epic_zephyr[k]['Assignee'];
          if(epic_zephyr[k]['Status'] == "Review" || epic_zephyr[k]['Status'] == "Update" || epic_zephyr[k]['Status'] == "Active" || epic_zephyr[k]['Status'] == "Approval")
          { 
            current_urlinfo['EPIC_LINK']['TOTAL']['ZephyrTotal']['keys'].push(epic[j]['Epic Key']); 
            console.log("push epic key = ", epic[j]['Epic Key']);
          }

          if(epic_zephyr[k]['Status'] == "Draft") { current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_DRAFT']['keys'].push(epic[j]['Epic Key']); }
          else if(epic_zephyr[k]['Status'] == "Review") { current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_REVIEW']['keys'].push(epic[j]['Epic Key']); }
          else if(epic_zephyr[k]['Status'] == "Update") { current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_UPDATE']['keys'].push(epic[j]['Epic Key']); }
          else if(epic_zephyr[k]['Status'] == "Active") { current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_ACTIVE']['keys'].push(epic[j]['Epic Key']); }
          else if(epic_zephyr[k]['Status'] == "Approval") { current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_ACTIVE']['keys'].push(epic[j]['Epic Key']); }
          else if(epic_zephyr[k]['Status'] == "Archived") {  }
          else { console.log("[EZ] Status is not Defined = ", epicz_devel[k]['Status']); }

          // [EPIC ZEPHYR EXECUTION LOOP]
          for(var l = 0; l < epic_zephyr[k]['Executions'].length; l++)
          {
            console.log("[EZ-Exec] i = ", i, " j = ", j, " k = ", k, " l = ", l);
            let epicze_assignee = epic_zephyr[k]['Executions'][l]['executedBy'];
            let status = epic_zephyr[k]['Executions'][l]['executionStatus'];
            // check the result of last test status.
            if(l == (epic_zephyr[k]['Executions'].length -1) && status == "1") 
            {
              current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_PASS']['keys'].push(epic[j]['Epic Key']);
            }
            else
            {
              current_urlinfo['EPIC_LINK']['TOTAL']['Zephyr_FAIL']['keys'].push(epic[j]['Epic Key']);
            }
          }       
        }
      }

      // [STORY LOOP]
      let story = initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'];
      for(var k = 0; k < story.length; k++)
      {
        var storyowner = story[k]['Assignee'];
        if(story[k]['Labels'].length == 0 || story[k]['SDET_NeedtoCheck'] == true) { current_urlinfo['STORY_LINK']['TOTAL']['NeedtoCheck']['keys'].push(story[k]['Story Key']); }

        if(story[k]['SDET_NeedDevelTC'] == true) { current_urlinfo['STORY_LINK']['TOTAL']['DevelTC']['keys'].push(story[k]['Story Key']); } 
        else { current_urlinfo['STORY_LINK']['TOTAL']['NonDevelTC']['keys'].push(story[k]['Story Key']); }

        current_urlinfo['STORY_LINK']['TOTAL']['Total']['keys'].push(story[k]['Story Key']);
        
        if(initparse.checkIsDelivered(story[k]['Status']) == false)
        {
          if(story[k]['AbnormalSprint'] == true) { current_urlinfo['COMMON']['AbnormalSPList'].push(story[k]['Story Key']); }
        }      

        // [STORY ZEPHYR LOOP]
        let story_zephyr = initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['Zephyr']['ZephyrTC'];
        for(var l = 0; l < story_zephyr.length; l++)
        {
          if(initiative_DB['issues'][i]['EPIC']['issues'][j]['STORY']['issues'][k]['SDET_NeedDevelTC'] == true)
          {
            let storyz_assignee = story_zephyr[l]['Assignee'];
            if(story_zephyr[l]['Status'] == "Review" || story_zephyr[l]['Status'] == "Update" || story_zephyr[l]['Status'] == "Active" || story_zephyr[l]['Status'] == "Approval")
            { 
              current_urlinfo['STORY_LINK']['TOTAL']['ZephyrTotal']['keys'].push(story[k]['Story Key']);
              console.log("push Story key = ", story[k]['Story Key']);
            }
  
            if(story_zephyr[l]['Status'] == "Draft") { current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_DRAFT']['keys'].push(story[k]['Story Key']); }
            else if(story_zephyr[l]['Status'] == "Review") { current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_REVIEW']['keys'].push(story[k]['Story Key']); }
            else if(story_zephyr[l]['Status'] == "Update") { current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_UPDATE']['keys'].push(story[k]['Story Key']); }
            else if(story_zephyr[l]['Status'] == "Active") { current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_ACTIVE']['keys'].push(story[k]['Story Key']); }
            else if(story_zephyr[l]['Status'] == "Approval") { current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_ACTIVE']['keys'].push(story[k]['Story Key']); }
            else if(story_zephyr[l]['Status'] == "Archived") { }
            else { console.log("[SZ] Status is not Defined = ", story_zephyr[l]['Status']); }
        
            // [STORY ZEPHYR EXECUTION LOOP]
            console.log("[SZ] i = ", i, " j = ", j, " k = ", k, " l = ", l);
            for(var m = 0; m < story_zephyr[l]['Executions'].length; m++)
            {
              let storyze_assignee = story_zephyr[l]['Executions'][m]['executedBy'];
              console.log("[SZ-Exec] i = ", i, " j = ", j, " k = ", k, " l = ", l, " m = ", m);    
              let status = story_zephyr[l]['Executions'][m]['executionStatus'];
              // check the result of last test status.
              if(m == (story_zephyr[l]['Executions'].length -1) && status == "1") 
              {
                current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_PASS']['keys'].push(story[k]['Story Key']);
              }
              else
              {
                current_urlinfo['STORY_LINK']['TOTAL']['Zephyr_FAIL']['keys'].push(story[k]['Story Key']);
              }
            }
          }
        }      
      } // story
    } // epic

    // COMMON
    current_urlinfo['COMMON']['EPIC_TOTAL'] = common_url + '(issuetype = epic) AND issuefunction in linkedissuesOf("key in (' + initiative[i]['Initiative Key'] + ')")';
    current_urlinfo['COMMON']['EPIC_Duedate_Null'] = current_urlinfo['COMMON']['EPIC_TOTAL'] + " AND (duedate = null AND Status not in (Closed, Deferred, Delivered, Verify, Resolved, Withdrawn)";
    current_urlinfo['COMMON']['EPIC_Duedate_Delayed'] = current_urlinfo['COMMON']['EPIC_TOTAL'] + " AND (duedate < now() AND Status not in (Closed, Deferred, Delivered, Verify, Resolved, Withdrawn)";
    current_urlinfo['COMMON']['EPIC_AbnormalSP'] = common_url + "(issuetype = epic) AND key in (" + current_urlinfo['COMMON']['AbnormalSPList'].join() + ")";
    current_urlinfo['COMMON']['STORY_TOTAL'] = common_url + '(issuetype = story OR issuetype = task) AND issuefunction in linkedissuesOf("key in (' + current_urlinfo['STORY_LINK']['TOTAL']['Total']['keys'].join() + '")';
    current_urlinfo['COMMON']['STORY_Duedate_Null'] = current_urlinfo['COMMON']['STORY_TOTAL'] + 'AND (duedate = null AND Status not in (Closed, Deferred, Delivered, Verify, Resolved, Withdrawn)';
    current_urlinfo['COMMON']['STORY_Duedate_Delayed'] = current_urlinfo['COMMON']['STORY_TOTAL'] + 'AND (duedate < now() AND Status not in (Closed, Deferred, Delivered, Verify, Resolved, Withdrawn)';
    current_urlinfo['COMMON']['STORY_AbnormalSP'] = common_url + "(issuetype = story OR issuetype = task) AND key in (" + current_urlinfo['COMMON']['AbnormalSPList'].join() + ")";

    // Epic
    for(let key in current_urlinfo['EPIC_LINK']['TOTAL'])
    { 
      console.log("epic key = ", key, " ", current_urlinfo['EPIC_LINK']['TOTAL'][key]['keys'].join());
      current_urlinfo['EPIC_LINK']['TOTAL'][key]['link'] = common_url + "key in ("+current_urlinfo['EPIC_LINK']['TOTAL'][key]['keys'].join() + ")";
    }

    // Story
    for(let key in current_urlinfo['STORY_LINK']['TOTAL'])
    {
      console.log("story key = ", key, " ", current_urlinfo['STORY_LINK']['TOTAL'][key]['keys'].join());
      current_urlinfo['STORY_LINK']['TOTAL'][key]['link'] = common_url + "key in ("+current_urlinfo['STORY_LINK']['TOTAL'][key]['keys'].join() + ")";
    }
    // epic + story
    for(let key in current_urlinfo['EPIC+STORY_LINK']['TOTAL'])
    {
      current_urlinfo['EPIC+STORY_LINK']['TOTAL'][key]['keys'] = current_urlinfo['EPIC_LINK']['TOTAL'][key]['keys'].concat(current_urlinfo['STORY_LINK']['TOTAL'][key]['keys']);
      current_urlinfo['EPIC+STORY_LINK']['TOTAL'][key]['link'] = common_url + "key in ("+current_urlinfo['EPIC+STORY_LINK']['TOTAL'][key]['keys'].join() + ")";
    }

    // ORGANIZATION
    for(var orgname in initiative[i]['STATICS']['EPIC+STORY_STATICS']['ORGANIZATION'])
    { // EPIC
      current_urlinfo['EPIC_LINK']['ORGANIZATION'][orgname] = JSON.parse(JSON.stringify(OrgDevel_link_key));
      console.log("orgname = ", orgname);
      console.log("object = ", JSON.stringify(current_urlinfo['EPIC_LINK']['ORGANIZATION'][orgname]));
      for(let key in current_urlinfo['EPIC_LINK']['ORGANIZATION'][orgname])
      {
        current_urlinfo['EPIC_LINK']['ORGANIZATION'][orgname][key] = current_urlinfo['EPIC_LINK']['TOTAL'][key]['link'] + " AND Aassignee is membersOf(" + orgname + "("+ String(orgcode) + "_grp)";
      }
      // STORY
      current_urlinfo['STORY_LINK']['ORGANIZATION'][orgname] = JSON.parse(JSON.stringify(OrgDevel_link_key));
      for(let key in current_urlinfo['STORY_LINK']['ORGANIZATION'][orgname])
      {
        current_urlinfo['STORY_LINK']['ORGANIZATION'][orgname][key] = current_urlinfo['STORY_LINK']['TOTAL'][key]['link'] + " AND Aassignee is membersOf(" + orgname + "("+ String(orgcode) + "_grp)";
      }
      // EPIC + STORY
      current_urlinfo['EPIC+STORY_LINK']['ORGANIZATION'][orgname]=JSON.parse(JSON.stringify(OrgDevel_link_key));
      for(let key in current_urlinfo['EPIC+STORY_LINK']['ORGANIZATION'][orgname])
      {
        current_urlinfo['EPIC+STORY_LINK']['ORGANIZATION'][orgname][key] = current_urlinfo['EPIC+STORY_LINK']['TOTAL'][key]['link'] + " AND Aassignee is membersOf(" + orgname + "("+ String(orgcode) + "_grp)";
      }
    }
    
    // DEVELOPER
    for(var assignee in initiative[i]['STATICS']['EPIC+STORY_STATICS']['DEVELOPER'])
    { // EPIC
      current_urlinfo['EPIC_LINK']['DEVELOPER'][assignee] = JSON.parse(JSON.stringify(OrgDevel_link_key));
      for(let key in current_urlinfo['EPIC_LINK']['DEVELOPER'][assignee])
      {
        current_urlinfo['EPIC_LINK']['DEVELOPER'][assignee][key] = current_urlinfo['EPIC_LINK']['TOTAL'][key]['link'] + " AND Aassignee in (" + assignee + ")";
      }
      // STORY
      current_urlinfo['STORY_LINK']['DEVELOPER'][assignee] = JSON.parse(JSON.stringify(OrgDevel_link_key));
      for(let key in current_urlinfo['STORY_LINK']['DEVELOPER'][assignee])
      {
        current_urlinfo['STORY_LINK']['DEVELOPER'][assignee][key] = current_urlinfo['STORY_LINK']['TOTAL'][key]['link'] + " AND Aassignee in (" + assignee + ")";
      }
      // EPIC + STORY
      current_urlinfo['EPIC+STORY_LINK']['DEVELOPER'][assignee] = JSON.parse(JSON.stringify(OrgDevel_link_key));
      for(let key in current_urlinfo['EPIC+STORY_LINK']['DEVELOPER'][assignee])
      {
        current_urlinfo['EPIC+STORY_LINK']['DEVELOPER'][assignee][key] = current_urlinfo['EPIC+STORY_LINK']['TOTAL'][key]['link'] + ")" + " AND Aassignee in (" + assignee + ")";
      }
    }

    initiative_DB['issues'][i]['URL'] = current_urlinfo;
  } // initiative
}


//===========================

async function Test()
{
  load_InitiativeDB('./public/json/initiative_DB_46093_Latest.json').then((result) => {
    console.log("[TEST] Read Initiative DB = ", JSON.stringify(initiative_DB));
  });

  make_URLinfo();

  console.log("[final-make_URLinfo] Save file = initiative_DB_URL");
  Save_JSON_file(initiative_DB, "./public/json/initiative_DB_URL_Latest.json");
  console.log("[final-make_URLinfo] Save end : initiative_DB_URL");
}


//====================
async function setDevelopersInformation(assignee)
{
  if(assignee == null) { assignee = "Unassigned"; }
  if((assignee in developers) == false) { developers[assignee] = []; }
  if((assignee in developerslist) == false)
  {
    await ldap.getLDAP_Info(assignee)
    .then((result) => { 
      developerslist[assignee] = developers[assignee] = initparse.getPersonalInfo(result['displayName']); 
      console.log("name = ", developers[assignee][0], " position = ", developers[assignee][1], 
      " department = ", developers[assignee][2], " email = ", developers[assignee][3]);
    })
    .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
  }
  else
  {
    developers[assignee] = developerslist[assignee];
  }

  if((assignee in sum_devel) == false) { sum_devel[assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
  if((assignee in epicz_devel) == false) { epicz_devel[assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
  if((assignee in storyz_devel) == false) { storyz_devel[assignee] = JSON.parse(JSON.stringify(StaticsInfo)); }
}


module.exports = { 
  initiative_DB,              // final DB
  // function
  get_InitiativeListfromJira,  // promise
  get_InitiativeList,          // callback
  makeSnapshot_InitiativeListfromJira, // new version
  makeSnapshot_InitiativeInfofromJira, // old version
  Test,
 };

