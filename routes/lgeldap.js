var ldap = require('ldapjs');

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


function getLDAP_Info(username)
{
  var opts = {
    filter: '(&(objectclass=user)(samaccountname='+username+'))',
    scope: 'sub',
    //attributes: []
    attributes: [ 'dn', 'title', 'description', 'telephoneNumber', 'department', 'employeeNumber', 'name', 'sAMAccountName', 'mail', 'DepartmentCode', 'mobile', 'displayName', ]
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
    client.bind('id', 'pass', function (error) {
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

module.exports = { 
  getLDAP_Info,
 };

