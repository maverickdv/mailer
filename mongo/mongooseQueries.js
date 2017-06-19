var mongoose = require('mongoose');
var UAParser = require('ua-parser-js');
var config = require('./config');
var objectSetter = require('./objectSetter');
//var objSetter = require('./objectSetter');


function setValuesForInsert(data, newUser) {
    var objSetter = new objectSetter();
    newUser = objSetter.setUserData(data, newUser);
    var mailIdData = decodeMailerIdString(data['uniMailId']);
    data['mailSentTime'] = mailIdData['sentTime'];
    newUser = objSetter.setOpenStatusObj(data,newUser);
    return newUser;
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
    var newUser = new usermodel();
    newUser = setValuesForInsert(message,newUser);
    console.log(JSON.stringify(newUser));
    try {
        newUser.save(function(err) {
        if (err){
           console.log("User could not be added because of "+err);
         }
         console.log('User created!');
        });
    }
    catch(e){
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
    mailerData['mailerType'] = arrMailIdData[2];
    mailerData['sentTime'] = new Date(1000*arrMailIdData[3]);
    return mailerData;
}

function setValuesforOpenRate(data,newUser){
  var mailIdData = decodeMailerIdString(data['mailId']);
  var objSetter = new objectSetter();
  newUser = objSetter.setUserData(mailIdData,newUser);
  var userAgentData = parseClientBrowser(data['userAgent']);
  newUser = objSetter.setBrowserPlatforms(userAgentData,newUser);
  newUser = objSetter.setUserLocation(data['ip'],newUser);
  var openData = {};
  openData['mailOpened'] = 1;
  openData['mailOpenTime'] = new Date();
  openData['mailSentTime'] = mailIdData['sentTime'];
  newUser = objSetter.setOpenStatusObj(openData,newUser);
  return newUser;
}

function openRateInsert(mailerData){
  var tempUser = {};
  tempUser = setValuesforOpenRate(mailerData,tempUser);
  var conn = createConection(tempUser['appId']);
  var UserSchema = require('./usermodel');
  var usermodel = conn.model('user',UserSchema);
  usermodel.update({"user_id":1847},tempUser,function(err,raw){
    if(err){
      console.log(err);
    }
    else{
      console.log(raw);
    }
  }
  );
}
function setValuesforClicks(data,newUser){
  var mailIdData = decodeMailerIdString(data['mailId']);
  var objSetter = new objectSetter();
  newUser = objSetter.setUserData(mailIdData,newUser);
  var userAgentData = parseClientBrowser(data['userAgent']);
  newUser = objSetter.setBrowserPlatforms(userAgentData,newUser);
  newUser = objSetter.setUserLocation(data['ip'],newUser);
  var openData = {};
  openData['mailOpened'] = 1;
  openData['mailOpenTime'] = new Date();
  openData['mailSentTime'] = mailIdData['sentTime'];
  newUser = objSetter.setOpenStatusObj(openData,newUser);
  var clickData = {};
  clickData['linkClicked'] = data['url'];
  clickData['clickTime'] = new Date();
  newUser = objSetter.setClickObj(clickData,newUser);
  return newUser;
}


function clicksInsert(mailerData){
  var tempUser = {};
  tempUser = setValuesforClicks(mailerData,tempUser);
  var conn = createConection(tempUser['appId']);
  var UserSchema = require('./usermodel');
  var usermodel = conn.model('user',UserSchema);
  usermodel.update({"user_id":tempUser['user_id']},tempUser,function(err,raw){
    if(err){
      console.log(err);
    }
    else{
      console.log(raw);
    }
  }
  );

}

function parseClientBrowser(userAgent){
  var parser = new UAParser();
  return parser.setUA(userAgent).getResult();
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
