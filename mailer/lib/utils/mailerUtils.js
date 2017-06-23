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
    	console.log(mailIdData);
/*
    mailIdData = decodeURI(mailIdData);
    if (typeof Buffer.from === "function") {
        // Node 5.10+
        mailIdData = Buffer.from(mailIdData, 'base64');
    } else {
        // older Node versions
        mailIdData= new Buffer(mailIdData, 'base64');
    }
*/
    mailIdData = typeof mailIdData !== 'string' ? mailIdData.toString() : mailIdData;
    arrMailIdData = mailIdData.split("|XxX|");
    arrMailIdData = arrMailIdData.map(function (val) { return val; });
    var mailerData = {};
    mailerData['appId'] = arrMailIdData[0];
    mailerData['userId'] = arrMailIdData[1];
    mailerData['mailerType'] = arrMailIdData[2];
    mailerData['sentTime'] = new Date(1000*arrMailIdData[3]);
    mailerData['email'] = arrMailIdData[4];
    return mailerData;
}
module.exports = mailerUtils;
