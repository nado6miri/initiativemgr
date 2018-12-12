var ldap = require('ldapjs');
var fse = require('fs-extra');
var fs = require('fs');

var usergroup_info = [];

//ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;
ldap.guid_format = ldap.GUID_FORMAT_B;
/*
var client = ldap.createClient({
  //url: 'ldap://kn-rd10-dc10.lge.net/CN=test,OU=Development,DC=Home'
  url: 'ldap://batman.com/cn='+username+', ou=users, ou=compton, dc=batman, dc=com',
  timeout: 5000,
  connectTimeout: 10000
});

var opts = {
  filter: '(objectclass=user)',
  scope: 'sub',
  attributes: ['objectGUID']
};

client.bind('sungbin.na', 'Sungbin', function (err) {
  client.search('CN=test,OU=Development,DC=Home', opts, function (err, search) {
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user.objectGUID);
    });
  });
});
*/


function getLDAP_InfoTest(username)
{
  var opts = {
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    scope: 'sub',
    //attributes: []
    //attributes: [ 'dn', 'title', 'description', 'telephoneNumber', 'department', 'employeeNumber', 'name', 'sAMAccountName', 'mail', 'DepartmentCode', 'mobile', 'displayName', ]
    attributes: [ 'department', 'displayName', ]
  };

  var client = ldap.createClient({
    url: 'ldap://10.187.38.16:389/CN=' + username,
    //url: 'ldap://10.187.38.16:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net/',
    timeout: 5000,
    connectTimeout: 10000
  });

  try {
    client.bind('addhost', '1qaz2wsx', function (error) {
        if(error){
            console.log(error.message);
            client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected1');}});
        } else {
            console.log('ldap connected');
            client.search('OU=LGE Users, DC=LGE, DC=NET', opts, function(error, search) {
                console.log('Searching.....');

                search.on('searchEntry', function(entry) {
                    if(entry.object){
                        console.log('entry: %j ' + JSON.stringify(entry.object));
                        return JSON.stringify(entry.object);
                    }
                    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected2');}});
                });

                search.on('error', function(error) {
                    console.error('error: ' + error.message);
                    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected3');}});
                });

                // don't do this here
                //client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
            });
        }
    });
  } catch(error){
    console.log(error);
    client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected4');}});
  }
}



function getLDAP_Info(username)
{
  var opts = {
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    scope: 'sub',
    //attributes: []
    //attributes: [ 'dn', 'title', 'description', 'telephoneNumber', 'department', 'employeeNumber', 'name', 'sAMAccountName', 'mail', 'DepartmentCode', 'mobile', 'displayName', ]
    attributes: [ 'name', 'department', 'displayName', ]
  };
  
  var client = ldap.createClient({
    url: 'ldap://10.187.38.16:389',
    //url: 'ldap://10.187.38.16:389/CN=' + username,
    //url: 'ldap://10.187.38.16:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net/',
    timeout: 5000,
    connectTimeout: 10000
  });

  return new Promise(function (resolve, reject){
    client.bind('--', '--', function (error) {
        if(error){
            console.log(error.message);
            client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected1');}});
        } 
        else 
        {
          client.search('OU=LGE Users, DC=LGE, DC=NET', opts, function(error, search) {
            console.log('ldap connected - Searching.....');
              search.on('searchEntry', function(entry) {
                  if(entry.object){
                      //console.log('entry: %j ' + JSON.stringify(entry.object));
                      //return JSON.stringify(entry.object);
                  }
                  client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected2');}});
                  if(entry.object){
                    resolve(JSON.stringify(entry.object));
                  }
                  else{
                    reject("Can't find user");
                  }
              });

              search.on('error', function(error) {
                  console.error('error: ' + error.message);
                  client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected3');}});
                  reject(error);
              });
              // don't do this here
              //client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
          }); // search
        } // else
    }); // bind
  }); // Promise
}

function get_UserInfofromLDAP(username){
  var userinfo = { 'name' : '', 'department' : '' };
  var isfind = false;

  fs.exists('./public/json/ldapinfo.json', (exist) => {
    if(exist)
    {
      var readbuffer = String(fse.readFileSync('./public/json/ldapinfo.json', 'utf8', e => {
        if(e){ console.log(e); } 
        else { console.log("LDAP Read operation is done!");	usergroup_info = JSON.parse(readbuffer); }
      }));
    }
    else
    {
      console.log('Not Found!');
      usergroup_info = [];   
    }
  });      
   

  for(let i = 0; i < usergroup_info.length; i++)
  {
    if(usergroup_info[i]['name'] == username)
    {
      isfind = true;
      break;
    }
  }

  if(isfind == false)
  {
    getLDAP_Info(username).then(result => {
      //console.log("[OK] getLDAP_Info : result = ", result);
      userinfo = JSON.parse(result);
      /*
      console.log("name = ", userinfo['name']);
      console.log("department = ", userinfo['department']);
      console.log("displayName = ", userinfo['displayName']);
      */
      userinfo = { 'name' : userinfo['name'], 'department' : userinfo['department'] }
      usergroup_info[usergroup_info.length] = JSON.parse(JSON.stringify(userinfo));
      console.log("usergroup_info = ", JSON.stringify(usergroup_info));
      /*
      fse.outputFileSync("./public/json/ldapinfo.json", JSON.stringify(usergroup_info), 'utf-8', function(e){
        if(e){ console.log(e); } else { console.log("Download is done!");	}
      });
      */
    }).catch(error => {
      console.log("[Catch Error] getLDAP_Info = ", error)
    });
  }
}



module.exports = { 
  getLDAP_Info,
  get_UserInfofromLDAP,
 };

