var fs = require('fs');
var http = require('http');
var fse = require('fs-extra');
var http = require('http');
var url = require('url');
var XMLHttpRequest = require('xmlhttprequest-ssl').XMLHttpRequest;

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
  'RelatedInitiative' : [], 
  'StoryPoint' : { },
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
  'StoryPoint' : {} ,
  'Zephyr' : 
  {
    'ZephyrCnt': 0,
    "ZephyrTC": [],       
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
    var param = { "jql" : filterID, "maxResults" : 1000, "startAt": 0,"fields" : ["summary", "key", "assignee", "due", "status", "labels", "issuelinks"] };
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
          reject(xhttp.status);
        }        
      }
    }

    // "jql" : "type=EPIC AND issueFunction in linkedIssuesOfRecursiveLimited('issueKey= TVPLAT-16376', 1)" 
    let filterjql = "issue in linkedissues(" + initiativeKey + ")";
    // console.log("filterjql = ", filterjql);
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
          reject(xhttp.status);
        }        
      }
    }

    // "jql" : "type=EPIC AND issueFunction in linkedIssuesOfRecursiveLimited('issueKey= TVPLAT-16376', 1)" 
    let filterjql = "issue in linkedissues(" + epicKey + ")";
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


function getZephyerListfromJira(KeyID)
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


async function makeSnapshot_InitiativeInfofromJira(filterID)
{
  var date = new Date();
  var time = date.getHours().toString();
  var min = date.getMinutes().toString();
  var snapshot = date.toISOString().substring(0, 10);
  snapshot = snapshot + "T" + time + ":" + min;
  initiative_DB['snapshotDate'] = snapshot;

  // Use Promise Object
  await get_InitiativeListfromJira(filterID)
  .then((initiativelist) => {
    // input : initiative filter id --> the search result of initiative (JSON Object)
    // output : epic list and update of basic epic info depend on initiative 
    console.log("[Promise 1] Get Initiative List / Update Basic Info and Iinitiative Key List from JIRA");
    //console.log(initiativelist);

    initiative_DB['total'] = initiativelist.total;
    for (var i = 0; i < initiativelist.total; i++) {
      initiative_keylist.push(initiativelist['issues'][i]['key']);
      // need to be update initiative info
      current_initiative_info = JSON.parse(JSON.stringify(initiative_info)); // initialize...
      current_initiative_info['Initiative Key'] = initiativelist['issues'][i]['key'];        
      current_initiative_info['Summary'] = initiativelist['issues'][i]['fields']['summary'];        
      current_initiative_info['Assignee'] = initiativelist['issues'][i]['fields']['assignee']['name'];        
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
      for (var i = 0; i < epiclist.total; i++) 
      {
        epic_keylist.push(epiclist['issues'][i]['key']);
        current_epic_info = JSON.parse(JSON.stringify(epic_info));
        // need to be update initiative info
        current_epic_info['Epic Key'] = epiclist['issues'][i]['key'];
        current_epic_info['Release_SP'] = 'TVSP21';        
        current_epic_info['Summary'] = epiclist['issues'][i]['fields']['summary'];        
        current_epic_info['Assignee'] = epiclist['issues'][i]['fields']['assignee']['name'];        
        current_epic_info['duedate'] = epiclist['issues'][i]["duedate"];        
        current_epic_info['Status'] = epiclist['issues'][i]['fields']['status']['name'];        
        current_epic_info['CreatedDate'] = epiclist['issues'][i]["createddate"];        
        current_epic_info['AbnormalEpicSprint'] = 0;        
        current_epic_info['GovOrDeployment'] = false;        
        current_epic_info['StoryPoint'] = story_point;        
        current_epic_info['DHistory'] = [];        
        initiative_DB['issues'][index]['EPIC']['issues'][i] = JSON.parse(JSON.stringify(current_epic_info));
      }
    })
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
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = zephyrlist['issues'][j]['id'];
        zephyr_issueIdlist.push(zephyrlist['issues'][j]['id']);
        current_zephyr_info['Zephyr Key'] = zephyrlist['issues'][j]['key'];        
        current_zephyr_info['Summary'] = zephyrlist['issues'][j]['fields']['summary'];        
        current_zephyr_info['Assignee'] = zephyrlist['issues'][j]['fields']['assignee']['name'];        
        current_zephyr_info['Status'] = zephyrlist['issues'][j]['fields']['status']['name'];        
        current_zephyr_info['Labels'] = zephyrlist['issues'][j]["fields"]['labels'];        
        //console.log("^^^^add zephyr^^^^^");       
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['Zephyr']['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async ???
        //makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, j, 964936);
        makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, j, current_zephyr_info['IssueID']); 
      }
    })
    //sync ??  working...
    //await makeSnapshot_EpicZephyrExecutionInfofromJira(init_index, i, zephyr_issueIdlist) //j, 964936);
  }
}

// working....
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
      for (var j = 0; j < zephyrlist.total; j++) 
      {
        current_zephyr_info = JSON.parse(JSON.stringify(zephyr_info));
        // need to be update initiative info
        current_zephyr_info['IssueID'] = zephyrlist['issues'][j]['id']; // = 964936; //working...
        zephyr_issueIdlist.push(zephyrlist['issues'][j]['id']);
        current_zephyr_info['Zephyr Key'] = zephyrlist['issues'][j]['key'];        
        current_zephyr_info['Summary'] = zephyrlist['issues'][j]['fields']['summary'];        
        current_zephyr_info['Assignee'] = zephyrlist['issues'][j]['fields']['assignee']['name'];        
        current_zephyr_info['Status'] = zephyrlist['issues'][j]['fields']['status']['name'];        
        current_zephyr_info['Labels'] = zephyrlist['issues'][j]["fields"]['labels'];        
        //console.log("^^^^add zephyr^^^^^");       
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][i]['Zephyr']['ZephyrTC'][j] = JSON.parse(JSON.stringify(current_zephyr_info)); 
        // async mode....
        //makeSnapshot_StoryZephyrExecutionInfofromJira(init_index, epic_index, i, j, current_zephyr_info['IssueID']); 
      }
    })

    // sync mode....
    await makeSnapshot_SyncStoryZephyrExecutionInfofromJira(init_index, epic_index, i, zephyr_issueIdlist);
  }
}


async function makeSnapshot_StoryInfofromJira(init_index, epickeylist)
{
  console.log("[Proimse 4] makeSnapshot_StoryInfofromJira ---- Get Epic-Story List / Update Story Basic Info");
  var init_keyvalue = initiative_keylist[init_index];
  
  for(var i = 0; i < epickeylist.length; i++)
  {
    var epic_keyvalue = epickeylist[i];
    await getStoryListfromJira(epic_keyvalue)
    .then((storylist) => {
      console.log("getStoryListfromJira ==== [I-index]:", init_index, "[E-Key]:", epic_keyvalue);
      //console.log(storylist);
      story_keylist = new Array();
      for (var j = 0; j < storylist.total; j++) 
      {
        story_keylist.push(storylist['issues'][j]['key']);
        current_story_info = JSON.parse(JSON.stringify(story_info));
        // need to be update initiative info
        current_story_info['Story Key'] = storylist['issues'][j]['key'];
        current_story_info['Release_SP'] = 'TVSP21';        
        current_story_info['Summary'] = storylist['issues'][j]['fields']['summary'];        
        current_story_info['Assignee'] = storylist['issues'][j]['fields']['assignee']['name'];        
        current_story_info['duedate'] = storylist['issues'][j]["duedate"];        
        current_story_info['Status'] = storylist['issues'][j]['fields']['status']['name'];        
        current_story_info['CreatedDate'] = storylist['issues'][j]["createddate"];        
        current_story_info['AbnormalEpicSprint'] = 0;        
        current_story_info['GovOrDeployment'] = false;        
        current_story_info['StoryPoint'] = story_point;        
        initiative_DB['issues'][init_index]['EPIC']['issues'][i]['STORY'][j] = JSON.parse(JSON.stringify(current_story_info));   
      }
    })
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
    for (var i = 0; i < zephyrExecution['executions'].length; i++) 
    {
      current_zephyr_exeinfo['id'] = zephyrExecution['executions'][i]['id']
      current_zephyr_exeinfo['executionStatus'] = zephyrExecution['executions'][i]['executionStatus']
      current_zephyr_exeinfo['executionOn'] = zephyrExecution['executions'][i]['executionOn']
      current_zephyr_exeinfo['executedBy'] = zephyrExecution['executions'][i]['executedBy']
      current_zephyr_exeinfo['cycleId'] = zephyrExecution['executions'][i]['cycleId']
      current_zephyr_exeinfo['cycleName'] = zephyrExecution['executions'][i]['cycleName']
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      //console.log(zephyrExecution['executions'][i]);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
  })
}


async function makeSnapshot_StoryZephyrExecutionInfofromJira(init_index, epic_index, story_index, zephyr_index, zephyrkeyID)
{
  console.log("[Promise 4.1.1] makeSnapshot_StoryZephyrExecutionInfofromJira ----");
  await getZephyerExecutionfromJira(zephyrkeyID)
  .then((zephyrExecution) => {
    console.log("getZephyerExecutionfromJira ==== [I-index]:", init_index, "[E-index]:", epic_index, "[S-index]:", stroy_index, "[Z-index]:", zephyr_index, "[Z-KeyID]:", zephyrkeyID);
    //console.log(zephyrExecution);
    for (var i = 0; i < zephyrExecution['executions'].length; i++) 
    {
      current_zephyr_exeinfo['id'] = zephyrExecution['executions'][i]['id']
      current_zephyr_exeinfo['executionStatus'] = zephyrExecution['executions'][i]['executionStatus']
      current_zephyr_exeinfo['executionOn'] = zephyrExecution['executions'][i]['executionOn']
      current_zephyr_exeinfo['executedBy'] = zephyrExecution['executions'][i]['executedBy']
      current_zephyr_exeinfo['cycleId'] = zephyrExecution['executions'][i]['cycleId']
      current_zephyr_exeinfo['cycleName'] = zephyrExecution['executions'][i]['cycleName']
      //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
      //console.log(zephyrExecution['executions'][i]);
      initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][story_index]['Zephyr']['ZephyrTC'][zephyr_index]['Executions'][i] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
    }
  })
}


// working...
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
      for (var j = 0; j < zephyrExecution['executions'].length; j++) 
      {
        current_zephyr_exeinfo['id'] = zephyrExecution['executions'][j]['id']
        current_zephyr_exeinfo['executionStatus'] = zephyrExecution['executions'][j]['executionStatus']
        current_zephyr_exeinfo['executionOn'] = zephyrExecution['executions'][j]['executionOn']
        current_zephyr_exeinfo['executedBy'] = zephyrExecution['executions'][j]['executedBy']
        current_zephyr_exeinfo['cycleId'] = zephyrExecution['executions'][j]['cycleId']
        current_zephyr_exeinfo['cycleName'] = zephyrExecution['executions'][j]['cycleName']
        //current_zephyr_exeinfo = JSON.parse(JSON.stringify(zephyr_exeinfo));
        //console.log(zephyrExecution['executions'][j]);
        initiative_DB['issues'][init_index]['EPIC']['issues'][epic_index]['STORY'][story_index]['Zephyr']['ZephyrTC'][i]['Executions'][j] = JSON.parse(JSON.stringify(current_zephyr_exeinfo)); 
      }
    })
  }
}

module.exports = { 
  initiative_DB,              // final DB
  // function
  get_InitiativeListfromJira,  // promise
  get_InitiativeList,          // callback
  makeSnapshot_InitiativeInfofromJira,
 };

