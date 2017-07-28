var objectSetter = require('./objectSetter');
var mailerUtils = require('./../utils/mailerUtils');
var mailerUtilsObj = new mailerUtils();
var objSetter = new objectSetter();
function daoHelper(){}

daoHelper.prototype.setValuesForInsert = function(data, newUser) {
    newUser = objSetter.setUserData(data, newUser);
    var mailIdData = mailerUtilsObj.decodeMailerIdString(data['uniMailId']);
    data['mailOpened'] = 0;
    data['mailSentTime'] = mailIdData['sentTime'];
    newUser = objSetter.setOpenStatusObj(data, newUser);
    return newUser;
}

daoHelper.prototype.setValuesforOpenRate = function(data, newUser) {
    var mailIdData = mailerUtilsObj.decodeMailerIdString(data['uniMailId']);
    mailIdData['uniMailId'] = data['uniMailId'];
    newUser = objSetter.setUserData(mailIdData, newUser);
    var userAgentData = mailerUtilsObj.parseClientBrowser(data['userAgent']);
    newUser = objSetter.setBrowserPlatforms(userAgentData, newUser);
    newUser = objSetter.setUserLocation(data['ip'], newUser);
    var openData = {};
    openData['mailOpened'] = 1;
    openData['mailOpenTime'] = data['openTime'];
    openData['mailSentTime'] = mailIdData['sentTime'];
    newUser = objSetter.setOpenStatusObj(openData, newUser);
    return newUser;
}

daoHelper.prototype.setValuesforClicks = function (data, newUser) {
    var mailIdData = mailerUtilsObj.decodeMailerIdString(data['uniMailId']);
    mailIdData['uniMailId'] = data['uniMailId'];
    newUser = objSetter.setUserData(mailIdData, newUser);
    var userAgentData = mailerUtilsObj.parseClientBrowser(data['userAgent']);
    newUser = objSetter.setBrowserPlatforms(userAgentData, newUser);
    newUser = objSetter.setUserLocation(data['ip'], newUser);
    var openData = {};
    openData['mailOpened'] = 1;
    openData['mailOpenTime'] = data['openTime'];
    openData['mailSentTime'] = mailIdData['sentTime'];
    newUser = objSetter.setOpenStatusObj(openData, newUser);
    var clickData = {};
    clickData['linkClicked'] = data['url'];
    clickData['clickTime'] = data['clickTime'];
    newUser = objSetter.setClickObj(clickData, newUser);
    return newUser;
}
module.exports =  daoHelper;
