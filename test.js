var tmr = require('./routes/mytimer');
var initapi = require('./routes/initapi');
var lgldap = require('./routes/lgeldap');
var moment = require('moment-timezone')
var initparse = require('./routes/parsejirafields');

moment.tz.setDefault("Asiz/Seoul");

function periodic_DBjobs()
{
  let exeflag = true;
  initapi.Test();

  console.log(process.argv);
  /*
  process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
  */
  //initapi.makeSnapshot_InitiativeListfromJira("keyID", "TVPLAT-16376");
}  

periodic_DBjobs();

/*
$ node process-2.js one two=three four

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
*/