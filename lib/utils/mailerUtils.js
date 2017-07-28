var UAParser = require('ua-parser-js');
var base32 = require('hi-base32');
function mailerUtils(){
}

mailerUtils.prototype.parseClientBrowser = function(userAgent){
    var parser = new UAParser();
    return parser.setUA(userAgent).getResult();
}

mailerUtils.prototype.decodeMailerIdString = function(mailIdData){
    var mailIdData = base32.decode(mailIdData);
    mailIdData = typeof mailIdData !== 'string' ? mailIdData.toString() : mailIdData;
    arrMailIdData = mailIdData.split("|XxX|");
    arrMailIdData = arrMailIdData.map(function (val) { return val; });
    var mailerData = {};
    mailerData['appId'] = arrMailIdData[0];
    mailerData['mailerId'] = arrMailIdData[1];
    mailerData['sentTime'] = new Date(1000*arrMailIdData[2]);
    mailerData['email'] = arrMailIdData[3];
    mailerData['mailerType'] = arrMailIdData[4];
    return mailerData;
}
module.exports = mailerUtils;
