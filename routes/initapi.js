var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;

var initiative_DB = {
  total : 0,
  snapshotDate : '2018',
  current_sprint : 'TVSP7', 
  issue :  // initiative issue list
  [],
};

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
  
var current_epic_info =  
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
    'StoryPoint' : story_point,

    'DHistory' :  
    [
        { 'orginal' : 'TVSP1' }, 
    ],

    'Zephyr' : {},
    'STORY' : [],
};

var current_initiative_info = 
{
  'Initiative Key' : '',
  'Summary' : '',
  'Assignee' : '',
  '관리대상' : '',
  'Risk관리대상' : '',
  'Initiative Order' : '',
  'Status Color' : '',
  'SE_Delivery' : '',
  'SE_Quality' : '',
  'ScopeOfChange' : '',
  'RMS' : '',
  'RescheduleCnt' : 0,
  'STESDET_OnSite' : '',
  'AbnormalEpicSprint' : '',
  "GovOrDeployment" : '',
  'StatusSummarymgrCnt' : '',
  'Demo' : [],
  'RelatedInitiative' : [ 'TVPLAT-XXXX', 'TVPLAT-0000', ], 
  'StoryPoint' : story_point,
  'Workflow' :
  {   
      'CreatedDate' : '',
      'Status' : '',
      'History' :
      [
          { "Draft" : '2019-01-01' , "Period" : "10" },                
          { "PO Review" : '2019-01-10' , "Period" : "10" },                
          { "ELTReview" : '2019-01-20' , "Period" : "10" },                
          { "Approved" : '2019-01-30' , "Period" : "10" },                
          { "Ready" : '2019-02-01' , "Period" : "10" },                
          { "InProgress" : '2019-02-03' , "Period" : "10" },                
          { "Delivered" : '2019-04-01' , "Period" : "10" },                
      ],
  },    
  'MileStone' :
  {   
      'total' : '',
      'rescheduleCnt' : '4',
      'history' :
      [
          { "Item1" : '2019-01-01' , "Schedule" : [ '2019-01-01', '2019-01-10', ] },                
      ],
  },    
  'ReleaseSprint' :  
  {
      'CurRelease_SP' : 'TVSP11',
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
    issue : [],    
  },
};


var story_info = 
{
  'Story Key' : '',
  'Release_SP' : '',
  'Summary' : "",
  'Assignee' : '',
  'duedate' : '',
  'Status' : '',
  'CreatedDate' : '',
  'StoryZephyrCnt': 0,
  'StoryZephyrResolutionCnt' : 0,
  'RescheduleCnt' : 0,
  'AbnormalStorySprint' : '',
  "GovOrDeployment" : '',
  'StoryPoint' : story_point,
  'Zephyr' : {},
};

var zephyr_info = 
{
  'ZephyrCnt': 1,
  'ZepyhrTC':
  [
      {
          'issueId' : 964936,
          'issueKey' : 'TVDEVTC-3088',
          'summary' : '[SDET][TC] General Setting Test',
          'assignee' : 'jira-user@lge.com',
          'status' : 'Draft',
          'label' : 'BASIC_TC, SETTINGS_GENERAL, TAS_MiniBAT',
          'exeRecordsCnt' : 3,
          'executions': 
          [
              {
                  'id': 143886,
                  'executionsStatus': '-1',
                  'cycleId': 7038,
                  'cycleName': 'MiniBAT_TAS_07_SETTINGS'
              },
              {
                  'id': 143885,
                  'executionStatus': '1',
                  'executionOn': '2018/11/01 16:19',
                  'executedBy': 'jira-user@lge.com',
                  'cycleId': -1,
                  'cycleName': 'Ad hoc'
              },
              {
                  'id': 143800,
                  'executionStatus': '1',
                  'executionOn': '2018/10/31 17:37',
                  'executedBy': 'jira-user@lge.com',
                  'cycleId': -1,
                  'cycleName': 'Ad hoc'
              }
          ]
      },
  ]                              
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
  .then((initiativelist) => {
    // input : initiative filter id --> the search result of initiative (JSON Object)
    // output : epic list and update of basic epic info depend on initiative 
    console.log("[Promise 1] Get Initiative List / Update Basic Info and Iinitiative Key List from JIRA");
    console.log(initiativelist);

    return new Promise((resolve, reject) => {
      for (var i = 0; i < initiativelist.total; i++) {
        initiative_keylist.push(initiativelist["issues"][i]["key"]);
        // need to be update initiative info
        current_initiative_info['Initiative Key'] = initiativelist["issues"][i]["key"];        
        current_initiative_info['Summary'] = initiativelist["issues"][i]["Summary"];        
        current_initiative_info['Assignee'] = initiativelist["issues"][i]["Assignee"];        
        current_initiative_info['관리대상'] = false;     
        current_initiative_info['Risk관리대상'] = false;        
        current_initiative_info['Initiative Order'] = 0;        
        current_initiative_info['Status Color'] = 0;        
        current_initiative_info['SE_Delivery'] = 0;        
        current_initiative_info['SE_Quality'] = 0;        
        current_initiative_info['ScopeOfChange'] = 'local';        
        current_initiative_info['RMS'] = true;        
        current_initiative_info['RescheduleCnt'] = 0;        
        current_initiative_info['STESDET_OnSite'] = true;        
        current_initiative_info['AbnormalEpicSprint'] = false;        
        current_initiative_info['GovOrDeployment'] = false;        
        current_initiative_info['StatusSummarymgrCnt'] = 0;        
      }     
      resolve(initiative_keylist);
    });
  })
  .then((initkeylist) => {
    // input : initiative key list = [ 'TVPLAT-XXXX', 'TVPLAT-XXXX', .... ]
    // output : epic list and update of basic epic info depend on initiative 
    console.log("[Proimse 2] Get Epic List / Update Epic Basic Info");
    console.log(initkeylist);

    // Epic List Update.....
    return new Promise((resolve, reject) => {
      initkeylist.forEach((value, index) => { 
        //console.log("index = ", index, "initiative key value =", value); 
        getEpicListfromJira(initkeylist)
        .then((epiclist) => {
          //console.log(epiclist);
          epic_keylist = [];
          for (var i = 0; i < epiclist.total; i++) 
          {
            epic_keylist.push(epiclist["issues"][i]["key"]);
            // need to be update initiative info
            current_epic_info['Epic Key'] = epiclist["issues"][i]["key"];
            current_epic_info['Release_SP'] = 'TVSP21';        
            current_epic_info['Summary'] = epiclist["issues"][i]["Summary"];        
            current_epic_info['Assignee'] = epiclist["issues"][i]["Assignee"];        
            current_epic_info['duedate'] = epiclist["issues"][i]["DueDate"];        
            current_epic_info['Status'] = epiclist["issues"][i]["Status"];        
            current_epic_info['CreatedDate'] = epiclist["issues"][i]["CreatedDate"];        
            current_epic_info['AbnormalEpicSprint'] = 0;        
            current_epic_info['GovOrDeployment'] = false;        
            current_epic_info['StoryPoint'] = story_point;        
            current_epic_info['DHistory'] = [];        
            current_epic_info['Zephyr'] = zephyr_info;        
            current_epic_info['STORY'] = story_info,
            console.log(current_epic_info);
          } 
          resolve(epic_keylist);
        })
        .catch((error) => { console.log(error); });
      })
    });
  })
  .then((epickeylist) => {
    console.log("[Proimse 3] then : epickeylist = ", epickeylist);
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

    // "jql" : "type=EPIC AND issueFunction in linkedIssuesOfRecursiveLimited('issueKey= TVPLAT-16376', 1)" 
    let filterjql = "issue in linkedissues(" + initiativeKey + ")";
    //console.log("filterjql = ", filterjql);
    var searchURL = 'http://hlm.lge.com/issue/rest/api/2/search/';
    /*
    var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,
                  "fields" : [ "summary", "key", "assignee", "due", "status", "labels", "issuelinks", "updated", "created", "customfield_10105", "timespent" 
                              , "components", "progress", "resolution", "workratio", "description", "customfield_16034", "customfield_16033", "duedate", "lastViewed"] };
    */
    //var param = { "jql" : filterjql, "maxResults" : 1000, "startAt": 0,"fields" : [ ] };
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