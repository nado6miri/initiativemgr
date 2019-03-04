var ldap = require('ldapjs');
var fse = require('fs-extra');
var fs = require('fs');

var usergroup_info = [];
ldap.guid_format = ldap.GUID_FORMAT_B;

function getLDAP_InfoTest(username)
{
  var opts = {
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    scope: 'sub',
    //attributes: []
    //attributes: [ 'dn', 'title', 'description', 'telephoneNumber', 'department', 'employeeNumber', 'name', 'sAMAccountName', 'mail', 'DepartmentCode', 'mobile', 'displayName', ]
    attributes: [ 'department', 'displayName', 'DepartmentCode', ]
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

                search.on('end', function(result) {
                  console.log('ldap end: ' + result);
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

var exceptionlist = ['Unassigned', 'null', 'stan.kim', 'buyoung.yun', 'juneyoung.jung', 'hyokak.kim', 's2.kim', 'heekyoung.seo' ];


function getLDAP_Info(username)
{
  username = String(username);
  var opts = {
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    scope: 'sub',
    //attributes: []
    //attributes: [ 'dn', 'title', 'description', 'telephoneNumber', 'department', 'employeeNumber', 'name', 'sAMAccountName', 'mail', 'DepartmentCode', 'mobile', 'displayName', ]
    attributes: [ 'department', 'displayName', 'DepartmentCode', ]
  };
  
  var client = ldap.createClient({
    url: 'ldap://10.187.38.16:389',
    //url: 'ldap://10.187.38.16:389/CN=' + username,
    //url: 'ldap://10.187.38.16:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net:389/CN=' + username + ', OU=LGE Users, DC=LGE, DC=NET',
    //url: 'ldap://kn-rd10-dc10.lge.net/',
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    timeout: 5000,
    connectTimeout: 10000
  });

  return new Promise(function (resolve, reject){
    if(exceptionlist.includes(username)) 
    {
      console.log("Unassigned user..... skip"); 
      //resolve({ 'name' : 'Unassigned', 'department' : "None" }) }
      resolve({ 'name' : username, 'department' : "None", 'displayName' : username+'/None/None(None)', 'DepartmentCode' : 0 });
    }

    client.bind('addhost', '1qaz2wsx', function (error) {
        if(error){
            console.log(error.message);
            client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected1');}});
        } 
        else 
        {
          client.search('OU=LGE Users, DC=LGE, DC=NET', opts, function(error, search) {
            console.log('ldap connected - Searching..... = ', username);
              search.on('searchEntry', function(entry) {
                if(entry.object){
                  resolve(entry.object);
                }
                else{
                  console.log("Can't find User..............")
                  resolve({ 'name' : 'Unassigned', 'department' : "None", 'displayName' : 'Unassigned/None/None(None)', 'DepartmentCode' : 0 });
                }
                client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected2');}});
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


module.exports = { 
  getLDAP_Info,   // Promise
  getLDAP_InfoTest, // Async - No Promise
 };

