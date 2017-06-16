var mongoose = require('mongoose');
var config = require('./config');

function setValues(data, newUser) {
    var clickObj = {
        "link": data['linkClicked'],
        "time": data['clickTime']
    };
    var linksObj = {
        "sent": data['linkSent'],
        "opened": clickObj
    };
    var openStatusObj = {
        "opened": data['mailOpened'],
        "sent_time": data['mailSentTime'],
        "open_time": data['mailOpenTime']
    };
    newUser.user_id = data['userId'];
    newUser.email = data['email'];
    newUser.mailer_type = data['mailerType'];
    newUser.unique_mailer_id = data['uniMailId'];
    newUser.mailer_id = data['mailerId'];
    newUser.links = linksObj;
    newUser.open_status = openStatusObj;
    newUser.user_platform = data['userPlatform'];
    newUser.user_browser = data['userBrowser'];
    newUser.user_location = data['userLocation'];
    return newUser;
}
function getCurrentDateTime(){
    var currentdate = new Date();
    var dateTime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    return dateTime;
}
function createConection(dbName){
    var dbConnUrl = 'mongodb://'+config.dbConn.host+":"+config.dbConn.port;
    dbConnUrl += '/'+dbName;
     var connStr = mongoose.createConnection(dbConnUrl,function(err){
        if(err){
            console.log("error in creating connection");
            return false;
        }
    });
    return connStr;
}
function insert(message){
    var conn = createConection(message['appId']);
    var UserSchema = require('./usermodel');
    var usermodel = conn.model('user',UserSchema);
    var mailIdData = decodeMailerIdString(message['uniMailId']);
    message['mailSentTime'] = mailIdData['sentTime'];
    var newUser = new usermodel();
    newUser = setValues(message,newUser);
    console.log(JSON.stringify(newUser));
    try {
        newUser.save(function(err) {
        if (err) throw err;
            console.log('User created!');
        });
    }
    catch(e){
        console.log(e);
        console.log("some error came in saving");
    }
};
function decodeMailerIdString(mailIdData){
    mailIdData = decodeURI(mailIdData);
    if (typeof Buffer.from === "function") {
        // Node 5.10+
        mailIdData = Buffer.from(mailIdData, 'base64');
    } else {
        // older Node versions
        mailIdData= new Buffer(mailIdData, 'base64');
    }
    mailIdData = typeof mailIdData !== 'string' ? mailIdData.toString() : mailIdData;
    arrMailIdData = mailIdData.split("|XxX|");
    arrMailIdData = arrMailIdData.map(function (val) { return val; });
    var mailerData = {};
    mailerData['appId'] = arrMailIdData[0];
    mailerData['userId'] = arrMailIdData[1];
    mailerData['mailerId'] = arrMailIdData[2];
    mailerData['sentTime'] = new Date(1000*arrMailIdData[3]);
    return mailerData;
}

function openRateInsert(mailerData){
    var mailIdData = decodeMailerIdString(mailerData['uniMailId']);

}

function clicksInsert(mailerData){
    var mailIdData = decodeMailerIdString(mailerData['uniMailId']);


}

function getDataFromMailerId(mailerIdData){

}

function dbActions() {

}

dbActions.prototype.doQuery = function(mailerData){
    var actionType = mailerData['dataType'];
    switch (actionType) {
        case "mailSent":
            insert(mailerData);
            break;
        case "open":
            openRateInsert(mailerData);
            break;
        case "click":
            clicksInsert(mailerData);
            break;
        default:
            break;
    }
}
module.exports = dbActions;
