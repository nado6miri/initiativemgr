var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;
var initparse = require('./parsejirafields');

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
  'current_sprint' : 'TVSP7', 
  'Organization' :'', 
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
    'AbnormalEpicSprint' : '',
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
      "ZephyrTC": [],       
    },
    'STORY' : [],
};

var current_initiative_info = { };
var initiative_info =
{
  'Initiative Key' : '',
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
  'AbnormalEpicSprint' : '',
  "GovOrDeployment" : '',
  'StatusSummarymgrCnt' : '',
  'Demo' : [],
  'RelatedInitiative' : [], 
  'StoryPoint' : { },
  'FixVersion' : [ ],
  'Workflow' :
  {   
      'CreatedDate' : '',
      'Status' : '',
      'History' :
      {
          "Draft" : '2019-01-01', "Draft_Period" : "10",                
          "PO Review" : '2019-01-10', "PO_Period" : "10",                
          "ELTReview" : '2019-01-20', "ELT_Period" : "10",                
          "Approved" : '2019-01-30', "Approved_Period" : "10",                
          "Ready" : '2019-02-01', "Ready_Period" : "10",                
          "InProgress" : '2019-02-03' , "InProgress_Period" : "10",                
          "Delivered" : '2019-04-01' , "Total_Period" : "50",                
      },
  },    
  'MileStone' :
  {   
      'total' : 0,
      'rescheduleCnt' : 0,
      'history' :
      [
          { "Item1" : '2019-01-01' , "Schedule" : [ '2019-01-01', '2019-01-10', ] },                
      ],
  },    
  'ReleaseSprint' :  
  {
      'CurRelease_SP' : 'TVSP11',
      'RescheduleCnt' : 0,
      'History' :
      [
          { 'orginal' : 'TVSP7' }, 
          { 'TVSP6' :'TVSP9'}, 
          { 'TVSP9' :'TVSP12'}, 
          { 'TVSP10' :'TVSP11'}, 
      ],
  },
  'StakeHolders' : 
  [
    { "OrgName1" : 'TV 화질' , "EpicCnt" : "3", "StoryCnt" : 5, 'DelayedEpic' : 0, 'DelayedStory' : 0, 'EpicResolution' : 3, 'StoryResolution' : 5, 'EpicPortion' : 80, 'StoryPortion' : 30 },                
    { "OrgName1" : 'TV 음질' , "EpicCnt" : "3", "StoryCnt" : 5, 'DelayedEpic' : 0, 'DelayedStory' : 0, 'EpicResolution' : 3, 'StoryResolution' : 5, 'EpicPortion' : 80, 'StoryPortion' : 30 },                
    { "OrgName1" : 'TV SystemCore' , "EpicCnt" : "3", "StoryCnt" : 5, 'DelayedEpic' : 0, 'DelayedStory' : 0, 'EpicResolution' : 3, 'StoryResolution' : 5, 'EpicPortion' : 80, 'StoryPortion' : 30 },                
  ],

  'STORY_SUMMARY' : 
  {
      'StoryTotalCnt': 0,
      'StoryDevelCnt': 0,
      'StoryGovOrDeploymentCnt': 0,
      'StoryTotalResolutionCnt' : 0,
      'StoryDevelResolutionCnt' : 0,
      'StoryGovOrDeploymentResolutionCnt' : 0,
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
  'AbnormalStorySprint' : '',
  'GovOrDeployment' : '',
  'Organization' :'', 
  'StoryPoint' : {} ,
  'Zephyr' : 
  {
    'ZephyrCnt': 0,
    'ZephyrResolutionCnt' : 0,
    'ZephyrExecutionCnt' : 0,
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

    // "jql" : "type=EPIC AND issueFunction in linkedIssuesOfRecursiveLimited('issueKey= TVPLAT-16376', 1)" 
    let filterjql = "issue in linkedissues(" + initiativeKey + ")";
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

    let filterjql = "issue in linkedissues(" + epicKey + ")";
    //console.log("filterjql = ", filterjql);
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
  var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks"] };

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
  var param = { 'issueId' : IssueID };
  xhttp.open("GET", searchURL);
  xhttp.setRequestHeader("Authorization", "Basic c3VuZ2Jpbi5uYTpTdW5nYmluQDEwMTA=");
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(null);  
  });    
}  


function saveInitDB(jsonObject)
{
  var json = JSON.stringify(jsonObject);
  fse.outputFileSync("./public/json/initiative_DB_"+initiative_DB['snapshotDate'], json, 'utf-8', function(e){
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

var done_flag = 0;
var starttime = 0;
var endtime = 0;
async function makeSnapshot_InitiativeInfofromJira(filterID)
{
  var date = starttime = new Date();
  var time = date.getHours().toString();
  var min = date.getMinutes().toString();
  var snapshot = date.toISOString().substring(0, 10);
  snapshot = snapshot + "T" + time + ":" + min;
  initiative_DB['snapshotDate'] = snapshot;
  done_flag = 0;
  // Use Promise Object
  await get_InitiativeListfromJira(filterID)
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
      /*
      current_initiative_info['AbnormalEpicSprint'] = false; // need to update     
      current_initiative_info['StatusSummarymgrCnt'] = 0;  // need to update    
      current_initiative_info['Demo'] = 0; // need to update    
      current_initiative_info['RelatedInitiative'] = []; // need to update    
      current_initiative_info['StoryPoint'] = []; // need to update    
      current_initiative_info['Workflow'] = {}; // need to update 
      current_initiative_info['MileStone'] = {}; // need to update 
      current_initiative_info['ReleaseSprint'] = { };  // need to update 
      current_initiative_info['StakeHolders'] = []; // need to update 
      current_initiative_info['STORY_SUMMARY'] = {}; // need to update 
      current_initiative_info['EPIC'] = {}; // need to update 
      */
      /*
      initparse.getKey(initiativelist['issues'][i]);
      initparse.getSummary(initiativelist['issues'][i]);
      initparse.getStatus(initiativelist['issues'][i]);
      initparse.getIssuetype(initiativelist['issues'][i]);
      initparse.getResolution(initiativelist['issues'][i]);
      initparse.getComponents(initiativelist['issues'][i]);
      initparse.checkGovDeployComponents(initiativelist['issues'][i]);
      var releaseSP = initparse.getReleaseSprint(initiativelist['issues'][i]);
      initparse.getStatusSummary(initiativelist['issues'][i]);
      initparse.getD_Comment(initiativelist['issues'][i]);
      initparse.getQ_Comment(initiativelist['issues'][i]);
      initparse.getInitiativeScore(initiativelist['issues'][i]);
      initparse.getCreatedDate(initiativelist['issues'][i]);
      initparse.getUpdatedDate(initiativelist['issues'][i]);
      var due_date = initparse.getDueDate(initiativelist['issues'][i]);
      initparse.getResolutionDate(initiativelist['issues'][i]);
      initparse.getLabels(initiativelist['issues'][i]);
      initparse.getDescription(initiativelist['issues'][i]);
      initparse.getFixVersions(initiativelist['issues'][i]);
      initparse.getIssueLinks(initiativelist['issues'][i]);
      initparse.getReporter(initiativelist['issues'][i]);
      initparse.getAssignee(initiativelist['issues'][i]);
      initparse.getWatchers(initiativelist['issues'][i]);
      var due_sprint = initparse.conversionDuedateToSprint(due_date);
      releaseSP = initparse.conversionReleaseSprintToSprint(releaseSP);
      console.log("Duedate = ", due_date, " Due_Sprint = ", due_sprint, " Release SP= ", releaseSP)
      */

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
}


async function makeSnapshot_EpicInfofromJira(initkeylist)
{
  // input : initiative key list = [ 'TVPLAT-XXXX', 'TVPLAT-XXXX', .... ]
  // output : epic list and update of basic epic info depend on initiative 
  console.log("[Proimse 2] makeSnapshot_EpicInfofromJira ---- Get Epic List / Update Epic Basic Info");
  //console.log(initkeylist);

  // Epic List Update.....
  for(var index = 0; index < initiative_DB['total']; index++) 
  {
    var init_keyvalue = initkeylist[index];
    await getEpicListfromJira(init_keyvalue)
    .then((epiclist) => {
      //console.log(epiclist);
      console.log("getEpicListfromJira ==== [I-index]:", index, "[I-Key]:", init_keyvalue);
      epic_keylist = new Array();
      let issue = 0;
      for (var i = 0; i < epiclist.total; i++) 
      {
        issue = epiclist['issues'][i];
        epic_keylist.push(issue['key']);
        current_epic_info = JSON.parse(JSON.stringify(epic_info));
        // need to be update initiative info
        current_epic_info['Epic Key'] = initparse.getKey(issue); 
        current_epic_info['duedate'] = initparse.getDueDate(issue);        
        current_epic_info['Release_SP'] = initparse.conversionDuedateToSprint(current_epic_info['duedate']);        
        current_epic_info['Summary'] = initparse.getSummary(issue);         
        current_epic_info['Assignee'] = initparse.getAssignee(issue);        
        current_epic_info['Status'] = initparse.getStatus(issue);        
        current_epic_info['CreatedDate'] = initparse.getCreatedDate(issue);         
        current_epic_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
        /*
        current_epic_info['AbnormalEpicSprint'] = 0;  // need to be updated        
        current_epic_info['StoryPoint'] = story_point;  // need to be updated      
        current_epic_info['DHistory'] = [];        
        */
        initiative_DB['issues'][index]['EPIC']['issues'][i] = JSON.parse(JSON.stringify(current_epic_info));
      }
    }).catch(error => {
      console.log("[Catch] getEpicListfromJira ==== [I-index]:", index, "[I-Key]:", init_keyvalue, " - exception error = ", error);
    });
    await makeSnapshot_EpicZephyrInfofromJira(index, epic_keylist); // initiative index, epick keylist        
    await makeSnapshot_StoryInfofromJira(index, epic_keylist); // initiative index, epick keylist        
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
      console.log("getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", i, "[E-Key]:", epic_keyvalue, "[Z-Total]:",zephyrlist.total);
      initiative_DB['issues'][init_index]['EPIC']['issues'][i]['Zephyr']['ZephyrCnt'] = zephyrlist.total; 
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
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['Zephyr']['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async ???
        //makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, j, 964936);
        makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, j, current_zephyr_info['IssueID']); 
      }
    }).catch(error => {
      console.log("[Catch] getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", i, "[E-Key]:", 
      epic_keyvalue, "[Z-Total]:",zephyrlist.total, " - exception error = ", error);
    });
    //sync ??  working...
    //await makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, zephyr_issueIdlist) //j, 964936);
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
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][i]['Zephyr']['ZephyrCnt'] = zephyrlist.total; 
      zephyr_issueIdlist = [];
      let issue = 0;
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        issue = zephyrlist['issues'][j];
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = issue['id']; // = 964936; //working...
        zephyr_issueIdlist.push(issue['id']);
        current_zephyr_info['Zephyr Key'] = initparse.getKey(issue);      
        current_zephyr_info['Summary'] = initparse.getSummary(issue);        
        current_zephyr_info['Assignee'] = initparse.getAssignee(issue);         
        current_zephyr_info['Status'] = initparse.getStatus(issue);        
        current_zephyr_info['Labels'] = initparse.getLabels(issue);        
        //console.log("^^^^add zephyr^^^^^");       
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][i]['Zephyr']['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async mode....
        makeSnapshot_StoryZephyrExecutionInfofromJira(init_index, epic_index, i, j, current_zephyr_info['IssueID']); 
      }
    }).catch(error => {
      console.log("[Catch] getZephyerListfromJira ==== [I-index]:", init_index, "[I-Key]:", init_keyvalue, "[E-index]:", epic_index, "[S-Key]:", 
      story_keyvalue, "[Z-Total]:", zephyrlist.total, " - exception error = ", error);
    });

    // sync mode....
    //await makeSnapshot_SyncStoryZephyrExecutionInfofromJira(init_index, epic_index, i, zephyr_issueIdlist);
  }
}


async function makeSnapshot_StoryInfofromJira(init_index, epickeylist)
{
  console.log("[Proimse 4] makeSnapshot_StoryInfofromJira ---- Get Epic-Story List / Update Story Basic Info");
  var init_keyvalue = initiative_keylist[init_index];
  let issue = 0;
  for(var i = 0; i < epickeylist.length; i++)
  {
    var epic_keyvalue = epickeylist[i];
    await getStoryListfromJira(epic_keyvalue)
    .then((storylist) => {
      console.log("getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue);
      //console.log(storylist);
      story_keylist = new Array();
      let issue = 0;
      for (var j = 0; j < storylist.total; j++) 
      {
        issue = storylist['issues'][j];
        story_keylist.push(storylist['issues'][j]['key']);
        current_story_info = JSON.parse(JSON.stringify(story_info));
        // need to be update initiative info
        current_story_info['Story Key'] = initparse.getKey(issue); 
        current_story_info['duedate'] = initparse.getDueDate(issue);        
        current_story_info['Release_SP'] = initparse.conversionDuedateToSprint(current_story_info['duedate']);         
        current_story_info['Summary'] = initparse.getSummary(issue);         
        current_story_info['Assignee'] = initparse.getAssignee(issue);        
        current_story_info['Status'] = initparse.getStatus(issue);        
        current_story_info['CreatedDate'] = initparse.getCreatedDate(issue);        
        current_story_info['GovOrDeployment'] = initparse.checkGovDeployComponents(issue);        
        current_story_info['Organization'] = 0; // need to be updated 
        current_story_info['AbnormalEpicSprint'] = 0; // need to be updated 
        current_story_info['StoryPoint'] = 0; // need to be updated     
        /*  
        current_story_info['Zephyr'] = 0; // need to be updated      
        */
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['STORY'][j] = JSON.parse(JSON.stringify(current_story_info));   
      }
    }).catch(error => {
      console.log("[Catch] getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue, " - exception error = ", error);
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
      issue = zephyrExecution['executions'][i];
      current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
      current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
      current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
      current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
      current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
      current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      //console.log(zephyrExecution['executions'][i]);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
    done_flag = 0xf0;
    let endtime = new Date();
    console.log("epic zephyr - takes time =  ", endtime-starttime)
  }).catch(error => {
    console.log("[Catch] getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[Z-index]:", 
    zephyr_index, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
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
      issue = zephyrExecution['executions'][i];
      current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
      current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
      current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
      current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
      current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
      current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      //console.log(zephyrExecution['executions'][i]);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][story_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
    done_flag = 0x0f;
    let endtime = new Date();
    console.log("Story zephyr - takes time =  ", endtime-starttime)
  }).catch(error => {
    console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index, 
    "[Z-index]:", zephyr_index, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
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
        issue = zephyrExecution['executions'][j];
        current_zephyr_exeinfo['id'] = initparse.getZephyrExeinfo_ID(issue); 
        current_zephyr_exeinfo['executionStatus'] = initparse.getZephyrExeinfo_Status(issue);
        current_zephyr_exeinfo['executionOn'] = initparse.getZephyrExeinfo_Date(issue);
        current_zephyr_exeinfo['executedBy'] = initparse.getZephyrExeinfo_Tester(issue);
        current_zephyr_exeinfo['cycleId'] = initparse.getZephyrExeinfo_cycleId(issue);
        current_zephyr_exeinfo['cycleName'] = initparse.getZephyrExeinfo_cycleName(issue);
          //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
        //console.log(zephyrExecution['executions'][j]);
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][story_index]['Zephyr']['ZephyrTC'][i]['Executions'][j] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
      }
      done_flag = 0x0f;
      let endtime = new Date();
      console.log("Sync Story zephyr - takes time =  ", endtime-starttime)
      }).catch(error => {
        console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", story_index,
         "[Z-index]:", i, "[Z-KeyID]:", zephyrkeyID, " - exception error = ", error);
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

