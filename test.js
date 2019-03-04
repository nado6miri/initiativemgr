var tmr = require('./routes/mytimer');
var initapi = require('./routes/initapi');
var lgldap = require('./routes/lgeldap');
var moment = require('moment-timezone')
var initparse = require('./routes/parsejirafields');

moment.tz.setDefault("Asiz/Seoul");

function periodic_DBjobs()
{
  let exeflag = true;
  //initapi.Test();

  console.log(process.argv);
  /*
  process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
  */
  //initapi.makeSnapshot_InitiativeListfromJira("filterID_KeyListOnly", 46093, true);   // webOS4.5 MR minor airplay

  initapi.makeSnapshot_InitiativeListfromJira("keyID", "TVPLAT-23900", true);   // test KEY

}  

periodic_DBjobs();

/*
$ node process-2.js one two=three four

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
*/