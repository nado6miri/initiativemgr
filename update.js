var tmr = require('./routes/mytimer');
var initapi = require('./routes/initapi');
var lgldap = require('./routes/lgeldap');
var moment = require('moment-timezone')

moment.tz.setDefault("Asiz/Seoul");

function periodic_DBjobs()
{
  // Use Promise Object
  //initapi.makeSnapshot_InitiativeInfofromJira(42101); // webOS4.5
  //initapi.makeSnapshot_InitiativeInfofromJira(46093);   // webOS4.5 MR minor
  //console.log('curruent time = ', moment());
  //initapi.makeSnapshot_InitiativeInfofromJira(46610);   // webOS4.5 MR minor
 
  //initapi.makeSnapshot_InitiativeInfofromJira("filterID", 45400);   // webOS5.0

  //initapi.makeSnapshot_InitiativeInfofromJira("filterID", 46610);   // webOS4.5 MR minor test 2ea
  //initapi.makeSnapshot_InitiativeInfofromJira("filterID", 46093);   // webOS4.5 MR minor
  //initapi.makeSnapshot_InitiativeInfofromJira("keyID", "TVPLAT-16376");   // webOS4.5 MR minor airplay
  //initapi.makeSnapshot_InitiativeInfofromJira("keyID", "TVPLAT-11552");   // webOS4.5 MR minor // shinchiho


  initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 46093);   // webOS4.5 MR minor
  //initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 46093);   // webOS4.5 MR minor airplay
  //initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 45400);   // webOS5.0
  //initapi.makeSnapshot_InitiativeListfromJira("keyID", "TVPLAT-16376");   // webOS4.5 MR minor airplay

  //initapi.Test();
  //lgldap.getLDAP_Info('stan.kim').then((result) => { console.log("Department = ", result)});  
  /*
  lgldap.getLDAP_Info('sungbin.na')
        .then((result) => { 
          console.log(JSON.stringify(result));
        })
        .catch((error) => { console.log("[ERR] ldap.getLDAP_Info = ", error)});
  */
}  

//tmr.Timer_Setting(12, 20, 10, periodic_DBjobs);
periodic_DBjobs();

