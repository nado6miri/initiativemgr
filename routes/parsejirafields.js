
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
// [return] str
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
    let datedata = str(datedata);
    let result = datedata.split(' ');
    result = result[0]; // take yyyy-mm-dd area
    result = result.split('-');

    if(len(result) >= 3) {
        let yyyy = result[0];
        let mm = result[1];
        let dd = result[2];
        dd = dd.split('T');
        dd = dd[0];
        return datetime(int(yyyy), int(mm), int(dd));
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
    let sprint = ReleaseSprint;
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
    checkLabels
   };
  
  