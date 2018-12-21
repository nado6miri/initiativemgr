var moment = require('moment-timezone');

const Y2019_SP_Schedule = 
[ 
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP01',
        'start' : '2018-09-03',
        'end' : '2018-09-16',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP02',
        'start' : '2018-09-17',
        'end' : '2018-09-30',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP03',
        'start' : '2018-10-01',
        'end' : '2018-10-14',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP04',
        'start' : '2018-10-15',
        'end' : '2018-10-28',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP05',
        'start' : '2018-10-29',
        'end' : '2018-11-11',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP06',
        'start' : '2018-11-12',
        'end' : '2018-11-25',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP07',
        'start' : '2018-11-26',
        'end' : '2018-12-9',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP08',
        'start' : '2018-12-10',
        'end' : '2018-12-23',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP09',
        'start' : '2018-12-24',
        'end' : '2019-01-06',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP10',
        'start' : '2019-01-07',
        'end' : '2019-01-20',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP11',
        'start' : '2019-01-21',
        'end' : '2019-02-03',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP12',
        'start' : '2019-02-04',
        'end' : '2019-02-17',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP13',
        'start' : '2019-02-18',
        'end' : '2019-03-03',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP14',
        'start' : '2019-03-04',
        'end' : '2019-03-17',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP15',
        'start' : '2019-03-18',
        'end' : '2019-03-31',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP16',
        'start' : '2019-04-01',
        'end' : '2019-04-14',
    },
    { 
        'IR' : 'IR1',
        'SPRINT_SHORT' : 'SP17',
        'start' : '2019-04-15',
        'end' : '2019-04-28',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP18',
        'start' : '2019-04-29',
        'end' : '2019-05-12',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP19',
        'start' : '2019-05-13',
        'end' : '2019-05-26',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP20',
        'start' : '2019-05-27',
        'end' : '2019-06-09',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP21',
        'start' : '2019-06-10',
        'end' : '2019-06-23',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP22',
        'start' : '2019-06-24',
        'end' : '2019-07-07',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP23',
        'start' : '2019-07-08',
        'end' : '2019-07-21',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP24',
        'start' : '2019-07-22',
        'end' : '2019-08-04',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP25',
        'start' : '2019-08-05',
        'end' : '2019-08-18',
    },
    { 
        'IR' : 'IR2',
        'SPRINT_SHORT' : 'SP26',
        'start' : '2019-08-19',
        'end' : '2019-09-01',
    },
];




//===========================================================================
//Get Key of jira
//[param] jiraIssue : json object of jira
//[return] str
//===========================================================================
function getKey(jiraIssue) {
    let value = jiraIssue['key'];
    if(value != null) {
        console.log("getKey = ", value)
        return value;
    }
    console.log("getKey = Null")
    return null;
}

//===========================================================================
// Get Summary of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getSummary(jiraIssue) {
    let value = jiraIssue['fields']['summary'];
    if(value != null) {
        console.log("getSummary = ", value);
        return value;
    }
    console.log("getSummary = Null");
    return null;
}

//===========================================================================
// Get Status of jira
// [param] jiraIssue : json object of jira
// [return]checkLabels str
//===========================================================================
function getStatus(jiraIssue) {
    let value = jiraIssue['fields']['status']['name'];
    console.log("getStatus = ", value);
    return value;
}

//===========================================================================
// Get issuetype of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getIssuetype(jiraIssue) {
    let value = jiraIssue['fields']['issuetype']['name'];
    console.log("getIssuetype = ", value)
    return value;
}

//===========================================================================
// Get resolution of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getResolution(jiraIssue) {
    let value = jiraIssue['fields']['resolution'];
    if(value != null) 
    {
        console.log("getResolution = ", value['name']);
        return value['name'];
    }
    console.log("getResolution = null");
    return null;
}


//===========================================================================
// Get components of jira
// [param] jiraIssue : json object of jira
// [return] components[]
//===========================================================================
function getComponents(jiraIssue) {
    let value = jiraIssue['fields']['components'];
    let compname = [];
    if(value != null) 
    {
        for(var i = 0; i < value.length; i++)
        {
            compname.splice(0, 0, value[i]['name']);
        }
        console.log("getComponents = ", compname.join());
        return compname;
    }
    console.log("getComponents = Null");
    return null;
}


//===========================================================================
// Get components of jira
// [param] jiraIssue : json object of jira
// [return] true or false
//===========================================================================
function checkGovDeployComponents(jiraIssue) {
    let value = jiraIssue['fields']['components']
    console.log("checkGovDeployComponents");
    if(value != null) {
        value.forEach((compval, index, array) => {
            //console.log("********* Comp = ", compval);
            if(compval['name'].includes("Deployment(manage)") == true) {
                console.log("[true] Governing or Deployment(manage) components = ", compval['name']);
                return true;
            }
            if(compval['name'].includes("_Governing")) {
                console.log("[true] Governing or Deployment(manage) components = ", compval['name']);
                return true;
            }
        });
        console.log("[false] Governing or Deployment(manage) components");
        return false;
    }
    console.log("[false] Governing or Deployment(manage) components = null");
    return false;
}


//===========================================================================
// Get Release Sprint of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getReleaseSprint(jiraIssue) {
    let value = jiraIssue['fields']['customfield_15926'];
    if(value != null) {
        console.log("getReleaseSprint = ", value);
        let retstr = value;
        return retstr;
    }
    console.log("getReleaseSprint = Null");
    return null;
}


//===========================================================================
// convert created date to datetime obect
// [param] createddate : created
// [return] datetime object
//===========================================================================
function conversionDateToDatetime(datedata) {
    // "2018-05-04"
    // "2018-05-04T14:03:49.000+0900"
    datedata = String(datedata);
    let result = datedata.split(' ');
    result = result[0]; // take yyyy-mm-dd area
    result = result.split('-');

    if(result.length >= 3) {
        let yyyy = result[0];
        let mm = result[1];
        let dd = result[2];
        dd = dd.split('T');
        dd = dd[0];
        return new Date(Number(yyyy), Number(mm), Number(dd));
    }
    else {
        return null;
    }
}


//===========================================================================
// convert duedate to Sprint
// [param] duedate : covdate
// [return] Sprint str
//===========================================================================
function conversionDuedateToSprint(covdate) {
    let targetDate = conversionDateToDatetime(covdate)
    if(targetDate != null)
    {
        for(var i = 0; i < Y2019_SP_Schedule.length; i++)
        {
            let start = conversionDateToDatetime(Y2019_SP_Schedule[i]['start']);
            let end = conversionDateToDatetime(Y2019_SP_Schedule[i]['end']);
            if(targetDate >= start && targetDate < end)
            {
                console.log("conversionDuedateToSprint = ", Y2019_SP_Schedule[i]['SPRINT_SHORT']);
                return Y2019_SP_Schedule[i]['SPRINT_SHORT'];
            }
        }
    }
    console.log("conversionDuedateToSprint = SP_UNDEF");
    return "SP_UNDEF";
}


//===========================================================================
// convert ReleaseSprint to ShortSprint
// [param] duedate : "2019_IR1SP01(3/XX~5/10)"
// [return] Sprint str
//===========================================================================
function conversionReleaseSprintToSprint(ReleaseSprint) {
    let bypass = false;
    let sprint = String(ReleaseSprint);
    let b = 0;

    // webOS5.0 Sprint
    if(sprint.includes("2019_IR1"))
    {
        let a = sprint.replace('2019_IR1', '');
        a = a.split('(');
        return a[0];
    }
    if(sprint.includes("2019_IR2"))
    {
        let a = sprint.replace('2019_IR2', '');
        a = a.split('(');
        return a[0];
    }
    
    // webOS4.5 Sprint
    if(sprint.includes("GL2_"))
    {
        let a = sprint.replace("GL2_", '');
        a = a.split('_');
        b = a[0];
    }
    else if (sprint.includes("FC2_"))
    {
        b = sprint;
    }
    else if (sprint.includes("19Y_"))
    {
        b = sprint;
    }
    else 
    {
        bypass = true;
    }

    if(bypass == true) 
    {
        //console.log(sprint)
        return sprint;
    }
    else {
        b = b.replace('IR1', '');
        b = b.replace('IR2', '');
        b = b.replace('IR3', '');
        b = b.replace('IR4', '');
        //console.log(b)
        b = b.split('(');
        //console.log(b[0])
        return b[0];
    }
}


//===========================================================================
// Get Status Summary of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getStatusSummary(jiraIssue) {
    let value = jiraIssue['fields']['customfield_15710'];
    if(value != null) {
        console.log("getStatusSummary = ", value)
        return value;
    }
    console.log("getStatusSummary = Null")
    return null;
}


//===========================================================================
// Get Status Color of jira
// [param] jiraIssue : json object of jira
// [return] str (RGB)
//===========================================================================
function getStatusColor(jiraIssue) {
    let statusColor = jiraIssue['fields']['customfield_15711'];
    if(statusColor != null) {
        console.log("getStatusColor = ", JSON.stringify(statusColor['value']))
        return statusColor['value'];
    }
    console.log("getStatusColor = Null");
    return null;
}


//===========================================================================
// Get SE_Delivery of jira
// [param] jiraIssue : json object of jira
// [return] str (RGB)
//===========================================================================
function getSE_Delivery(jiraIssue) {
    let delivery = jiraIssue['fields']['customfield_16988'];
    if(delivery != null) {
        console.log("getSE_Delivery = ", JSON.stringify(delivery['value']))
        return delivery['value'];
    }
    console.log("getSE_Delivery = Null")
    return null;
}


//===========================================================================
// Get SE_Quality of jira
// [param] jiraIssue : json object of jira
// [return] str (RGB)
//===========================================================================
function getSE_Quality(jiraIssue) {
    let quality = jiraIssue['fields']['customfield_16987'];
    if(quality != null) {
        console.log("getSE_Quality = ", JSON.stringify(quality['value']))
        return quality['value'];
    }

    console.log("getSE_Quality = Null");
    return null;
}

//===========================================================================
// Get D_Comment of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getD_Comment(jiraIssue) {
    let value = jiraIssue['fields']['customfield_16984'];
    console.log("getD_Comment = ", value);
    return value;
}


//===========================================================================
// Get Q_Comment of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getQ_Comment(jiraIssue) {
    let value = jiraIssue['fields']['customfield_16983'];
    console.log("getQ_Comment = ", value);
    return value;
}


//===========================================================================
// Get STE Member List of jira
// [param] jiraIssue : json object of jira
// [return] QE[]
//===========================================================================
function getSTEList(jiraIssue) {
    let value = jiraIssue['fields']['customfield_15228'];
    let stelist = [];
    if(value != null) 
    {
        for(var i = 0; i < value.length; i++)
        {
            stelist.splice(0, 0, value[i]['name']);
        }
        console.log("getSTEList[] = ", stelist.join());
        return stelist;
    }
    console.log("getSTEList[] = null");
    return null;
}


//===========================================================================
// Get STE manage item or Not..
// [param] jiraIssue : json object of jira
// [return] true or false
//===========================================================================
function getSTESDET_Support(jiraIssue) {
    if(getSTEList(jiraIssue) != null) { return true; }
    return false;
}


//===========================================================================
// Get Initiative Order of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getInitiativeOrder(jiraIssue) {
    let value = jiraIssue['fields']['customfield_16986'];
    console.log("getInitiativeOrder = ", value)
    return value;
}


//===========================================================================
// Get Initiative Score of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getInitiativeScore(jiraIssue) {
    let value = jiraIssue['fields']['customfield_16985'];
    console.log("getInitiativeScore = ", value)
    return value;
}

//===========================================================================
// Get Created Date of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getCreatedDate(jiraIssue) {
    let value = jiraIssue['fields']['created'];
    console.log("getCreatedDate = ", value);
    return value;
}


//===========================================================================
// Get Updated Date of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getUpdatedDate(jiraIssue) {
    let value = jiraIssue['fields']['updated'];
    console.log("Updated Date = ", value);
    return value;
}


//===========================================================================
// Get Due Date of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getDueDate(jiraIssue) {
    let value = jiraIssue['fields']['duedate'];
    console.log("getDueDate = ", value)
    return value;
}

//===========================================================================
// Get Resolution Date List of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getResolutionDate(jiraIssue) {
    let value = jiraIssue['fields']['resolutiondate'];
    console.log("getResolutionDate = ", value)
    return value;
}


//===========================================================================
// Get Created Date List of jira
// [param] jiraIssue : json object of jira
// [return] labels []
//===========================================================================
function getLabels(jiraIssue) {
    let value = jiraIssue['fields']['labels'];
    console.log("getLabels = ", value)
    return value;
}


//===========================================================================
// Get Description List of jira
// [param] jiraIssue : json object of jira
// [return] labels [ 'a', 'b', .... ]
//===========================================================================
function getDescription(jiraIssue) {
    let value = jiraIssue['fields']['description'];
    console.log("getDescription = ", value);
    return value;
}

//===========================================================================
// Get fixVersions of jira
// [param] jiraIssue : json object of jira
// [return] fixVersions [ ]
//===========================================================================
function getFixVersions(jiraIssue) {
    let value = jiraIssue['fields']['fixVersions'];
    let fixversions = [];
    if(value != null) 
    {
        for(var i = 0; i < value.length; i++)
        {
            fixversions.splice(0, 0, value[i]['name']);
        }
        console.log("getFixVersions[] = ", fixversions.join());
        return fixversions;
    }
    console.log("getFixVersions[] = null");
    return null;
}


//===========================================================================
// Get Scope of Change of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getScopeOfChange(jiraIssue) {
    let value = jiraIssue['fields']['customfield_15104'];
    if(value != null) {
        console.log("getScopeOfChange = ", value['value'])
        return value['value'];
    }
    console.log("getScopeOfChange = null");
    return null;
}


//===========================================================================
// Get Issue Links of jira
// [param] jiraIssue : json object of jira
// [return] issuelinks[ {}, .... ]
//===========================================================================
function getIssueLinks(jiraIssue) {
    let value = jiraIssue['fields']['issuelinks'];
    console.log("getIssueLinks = ", value);
    return value;
}

//===========================================================================
// Get Reporter of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getReporter(jiraIssue) {
    let value = jiraIssue['fields']['reporter']['name'];
    console.log("getReporter = ", value)
    return value;
}


//===========================================================================
// Get Assignee of jira
// [param] jiraIssue : json object of jira
// [return] str
//===========================================================================
function getAssignee(jiraIssue) {
    let value = "Unassigned";
    if(jiraIssue['fields']['assignee'] != null) {
        value = jiraIssue['fields']['assignee']['name'];
        console.log("getAssignee = ", value);
        return value;
    }
    console.log("getAssignee = ", value);
    return value;
}


//===========================================================================
// Get Reporter of jira
// [param] jiraIssue : json object of jira
// [return] Watchers [ ] <== [ { 'name' { ''}, { 'emailAddress' { '' }, .... ]
//===========================================================================
function getWatchers(jiraIssue) {
    let watchers = jiraIssue['fields']['customfield_10105'];
    let results = [];
    if(watchers != null)
    {
        for(var i = 0; i < watchers.length; i++)
        {
            results.splice(0, 0, watchers[i]['name']);
        }
        console.log("getWatchers List = ", results.join());
        return results;
    }
    console.log("getWatchers List = null");
    return null;
}


//===========================================================================
// Check STE On Site Initiative or Not
// [param] dissue : jira issue
// [return] True (STE On Site) or False (null)
//===========================================================================
function checkLabels(jiraIssue, labelname) {
    let labels = getLabels(jiraIssue);
    if(labels.includes(labelname) == true)
    {
        console.log("checkLabels = " + labelname + "--> TRUE");
        return true;
    }
    console.log("checkLabels = " + labelname + "--> FALSE");
    return false;
}



//===========================================================================
// Check Initiative base on RMS
// [param] dissue : jira issue
// [return] true or false
//===========================================================================
function checkRMSInitiative(jiraIssue) {
    let labels = getLabels(jiraIssue);
    if(labels.includes('RMS요구사항') == true)
    {
        console.log("checkLabels = RMS요구사항 --> TRUE");
        return true;
    }
    let summary = getSummary(jiraIssue);
    if(summary.includes('RMS') == true)
    {
        console.log("summary includes RMS :..--> TRUE");
        return true;
    }
    console.log("checkRMSInitiative = --> FALSE");
    return false;
}



//===========================================================================
// Get Exeinfo ID of zephyr
// [param] jiraIssue : json object of jira
// [return] str (ID)
//===========================================================================
function getZephyrExeinfo_ID(ZephyrIssue) {
    if(ZephyrIssue['id'] != null) 
    {
        return ZephyrIssue['id'];
    }
    return null;    
}


//===========================================================================
// Get Exeinfo Status of zephyr
// [param] jiraIssue : json object of jira
// [return] str (Status) - “-1” UNEXECUTED, “1” PASS, “2” FAIL, “3” WIP, “4” BLOCKED”
// UNEXECUTED: The test has not yet been executed.
// PASS: Test was executed and passed successfully.
// FAIL: Test was executed and failed.
// WIP: Test execution is a work – in – progress.
// BLOCKED: The test execution of this test was blocked for some reason.
//===========================================================================
function getZephyrExeinfo_Status(ZephyrIssue) {
    if(ZephyrIssue['executionStatus'] != null) 
    {
        return ZephyrIssue['executionStatus'];
    }
    return null;
}

//===========================================================================
// Get Exeinfo executionOn of zephyr
// [param] jiraIssue : json object of jira
// [return] str (executionOn - Date Info)
//===========================================================================
function getZephyrExeinfo_Date(ZephyrIssue) {
    if(ZephyrIssue['executionOn'] != null) 
    {
        return ZephyrIssue['executionOn'];
    }
    return null;
}


//===========================================================================
// Get Exeinfo executionBy of zephyr
// [param] jiraIssue : json object of jira
// [return] str (executionBy)
//===========================================================================
function getZephyrExeinfo_Tester(ZephyrIssue) {
    if(ZephyrIssue['executedBy'] != null) 
    {
        return ZephyrIssue['executedBy'];
    }
    return null;
}


//===========================================================================
// Get Exeinfo cycle ID of zephyr
// [param] jiraIssue : json object of jira
// [return] str (cycle ID)
//===========================================================================
function getZephyrExeinfo_cycleId(ZephyrIssue) {
    if(ZephyrIssue['cycleId'] != null) 
    {
        return ZephyrIssue['cycleId'];
    }
    return null;
}


//===========================================================================
// Get Exeinfo cycle Name of zephyr
// [param] jiraIssue : json object of jira
// [return] str (cycle Name)
//===========================================================================
function getZephyrExeinfo_cycleName(ZephyrIssue) {
    if(ZephyrIssue['cycleName'] != null) 
    {
        return ZephyrIssue['cycleName'];
    }    
    return null;
}


//===========================================================================
// checkAbnormalSP : compare init vs epic/story Release SP
// [param] initiative Release SP, epic/story Release SP
// [param] epic Release SP, story Release SP
// [return] init >= epicstory (false) else true
//===========================================================================
function checkAbnormalSP(initSP, initStatus, epicstorySP, epicstoryStatus)
{
    var epic_story_SP = epicstorySP;
    var init_SP = conversionReleaseSprintToSprint(initSP);
    var init_index = 0, epic_story_index = 0;

    if(initSP == "SP_UNDEF" || epicstorySP == "SP_UNDEF") 
    { 
        if(checkIsDelivered(epicstoryStatus) == true) { return false } else { return true; } 
    }

    for(var i = 0; i < Y2019_SP_Schedule.length; i++)
    {
        if(Y2019_SP_Schedule[i]['SPRINT_SHORT'] == init_SP) { init_index = i; }
        if(Y2019_SP_Schedule[i]['SPRINT_SHORT'] == epic_story_SP) { epic_story_index = i; }
    }

    if(i >= Y2019_SP_Schedule.length) { return false; }
    else
    {
        if(init_index >= epic_story_index) {return false; } 
        else 
        {
            if(checkIsDelivered(epicstoryStatus) == true) { return false } else { return true; } 
        }
    }
}



//===========================================================================
// checkIsDelivered : check developing or not (resolved, closed, deferred, withdrawn)
// [param] Status
// [return] under development (false), delivered (resolved/closed/resolved/withdrawn) : true
//===========================================================================
function checkIsDelivered(Status)
{
    if(Status == 'Resolved' || Status == 'Closed' || Status == 'delivered' || Status == 'Deferred' || Status == "Withdrwan" || Status == 'Verify')
    { 
        return true; 
    }
    return false;  
}


//===========================================================================
// checkIsDelayed : check delayed or not
// [param] duedate
// [return] delayed : true, not delayed : false
//===========================================================================
function checkIsDelayed(DueDate)
{
    if(DueDate != null)
    {
        var duedate = new Date(DueDate);
        var today = new Date();
        if(duedate < today) { return true; }
    }
    return false;
}



//===========================================================================
// parseWorkflow : make the history of workflow from changelog
// [param] changelog, workflow
// [return] workflow
//===========================================================================
function parseWorkflow(changelog, workflow)
{
    console.log("parseWorkflow function")
    if(workflow != null && changelog != null)
    {
        let log = changelog['histories'];
        let today = moment().locale('ko');
        let createddate = workflow['CreatedDate'].split('+');
        let created = moment(createddate[0]).add(9, 'Hour');
        let start = 0;
        let end = 0;
        for(let i = 0; i < changelog.total; i++)
        {
            for(let j = 0; j < log[i]['items'].length; j++)
            {
                let item = log[i]['items'][j];
                if(item['field'] == 'status') // Status - Workflow
                {
                    let item_created = log[i]['created'];
                    item_created = item_created.split('+');
                    if(start == 0) { start = created; } else { start = end; }
                    end = moment(item_created[0]).add(9, 'Hour');
                    let period = (end - start) / (1000*60*60*24);
     
                    let from = item['fromString'];
                    let to = item['toString'];
                    console.log("From : ", from, " ==> To : ", to, " period = ", period, "Start = ", start, " End = ", end);

                    // normal flow
                    if(from == 'DRAFTING' && to == "PO REVIEW") 
                    { 
                        workflow['DRAFTING']['Duration'] += period; 
                        workflow['DRAFTING']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }
                    
                    if(from == 'PO REVIEW' && to == "ELT REVIEW")
                    { 
                        workflow['PO REVIEW']['Duration'] += period; 
                        workflow['PO REVIEW']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }

                    if(from == 'ELT REVIEW' && to == "Approved")
                    { 
                        workflow['ELT REVIEW']['Duration'] += period; 
                        workflow['ELT REVIEW']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }

                    if(from == 'Approved' && to == "BACKLOG REFINEMENT")
                    { 
                        workflow['APPROVED']['Duration'] += period; 
                        workflow['APPROVED']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }

                    if(from == 'BACKLOG REFINEMENT' && to == "READY")
                    { 
                        workflow['BACKLOG REFINEMENT']['Duration'] += period; 
                        workflow['BACKLOG REFINEMENT']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }

                    if(from == 'READY' && to == "In Progress")
                    { 
                        workflow['READY']['Duration'] += period; 
                        workflow['READY']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                    }

                    if(from == 'In Progress' && to == "Delivered")
                    { 
                        workflow['IN PROGRESS']['Duration'] += period; 
                        workflow['IN PROGRESS']['History'].push({ "startdate" : start, "enddate" : end, "peroid" : period });
                        workflow['DELIVERED']['Duration'] = (today - end) / (1000*60*60*24); 
                        workflow['DELIVERED']['History'].push({ "startdate" : end, "enddate" : today, "peroid" : period });
                    }

                    // rest : closed / defer case
                    //workflow['DRAFTING']['History'].push({ "startdate" : modifyDate, "peroid" : 0 });
                    //workflow['DRAFTING']['Duration'] += getElapsedDays(day1, day2);
                }
            }
        }
        return workflow;
    }
    console.log("[Exception] : parseWorkflow")
    return null;
}



//===========================================================================
// getElapsedDays : get elapsed days
// [param] day1(moment), day2 (moment)
// [return] diff = day2 - day1
//===========================================================================
function getElapsedDays(date1, date2)
{
    /*
    console("cur time = ", moment().format("YYYY-MM-DDTHH:MM:SS"));
    created = new Date("2018-12-06T11:46:34.000+0900");
    current = moment();
    diff = current - created;
    console.log("day = ", diff/(1000*60*60*24));
    */
    let date1 = moment(date1);
    let date2 = moment(date2);
    let diffday = (date2 - date1)/(1000*60*60*24);
    console.log("Dff Day = ", diffday);
}


module.exports = { 
    // var
    Y2019_SP_Schedule,
    // function
    getKey,
    getSummary,
    getStatus,
    getIssuetype,
    getResolution,
    getComponents,
    checkGovDeployComponents,
    getReleaseSprint,
    conversionDateToDatetime,
    conversionDuedateToSprint,
    conversionReleaseSprintToSprint,
    getStatusSummary,
    getStatusColor,
    getSE_Delivery,
    getSE_Quality,
    getD_Comment,
    getQ_Comment,
    getSTEList,
    getSTESDET_Support,
    getInitiativeOrder,
    getInitiativeScore,
    getCreatedDate,
    getUpdatedDate,
    getDueDate,
    getResolutionDate,
    getLabels,
    getDescription,
    getFixVersions,
    getScopeOfChange,
    getIssueLinks,
    getReporter,
    getAssignee,
    getWatchers,
    checkLabels,
    checkRMSInitiative,
    getZephyrExeinfo_ID,
    getZephyrExeinfo_Status,
    getZephyrExeinfo_Date,
    getZephyrExeinfo_Tester,
    getZephyrExeinfo_cycleId,
    getZephyrExeinfo_cycleName,
    checkAbnormalSP,
    checkIsDelivered,
    checkIsDelayed,
    parseWorkflow,
    getElapsedDays,
   };
  
  