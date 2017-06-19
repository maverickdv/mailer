function objectSetter(){

}
objectSetter.prototype.setBrowserPlatforms =  function(data, newUser){
  var userBrowserObj =  {
    "name": data['browser']['name'],
    "version": data['browser']['version'],
    "major_version": data['browser']['major']
  };
  var userOsObj = {
    "name": data['os']['name'],
    "version": data['os']['version']
  };
  var userDeviceObj = {
    "model": data['device']['model'],
    "vendor": data['device']['vendor'],
    "device_type": data['device']['type']
  };
  newUser.user_os = userOsObj;
  newUser.user_browser = userBrowserObj;
  newUser.user_device = userDeviceObj;
  return newUser;
}

objectSetter.prototype.setClickObj = function(data,newUser){
  var clickObj = {
      "link": data['linkClicked'],
      "time": data['clickTime']
  };
  var linksObj = {
      "sent": data['linkSent'],
      "opened": clickObj
  };
  newUser.links = linksObj;
  return newUser;
}

objectSetter.prototype.setOpenStatusObj = function(data, newUser){
  var openStatusObj = {
      "opened": data['mailOpened'],
      "sent_time": data['mailSentTime'],
      "open_time": data['mailOpenTime']
  };
  newUser.open_status = openStatusObj;
  return newUser;
}

objectSetter.prototype.setUserLocation = function(data,newUser){
  newUser.user_location = data;
  return newUser;
}

objectSetter.prototype.setUserData = function(data, newUser){
  newUser.user_id = data['userId'];
  if(data['email'] != undefined){
    newUser.email = data['email'];
  }
  newUser.mailer_type = data['mailerType'];
  if(data['uniMailId'] != undefined){
    newUser.unique_mailer_id = data['uniMailId'];
  }
  if(data['mailerId']!= undefined){
    newUser.mailer_id = data['mailerId'];
  }
  newUser.appId = data['appId'];
  return newUser;
}
module.exports = objectSetter;
