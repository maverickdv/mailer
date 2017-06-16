var mongoose = require('mongoose');
var config = require('./config');
var user = require('./usermodel');

function dbActions() {

}

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
dbActions.prototype.insert = function(message) {
    var dbConnUrl = 'mongodb://' + config.dbConn.host + ":" + config.dbConn.port;
    dbConnUrl += '/mydb';
    var newUser = new user();
    newUser = setValues(message, newUser);
    mongoose.connect(dbConnUrl);
    console.log(JSON.stringify(newUser));
    newUser.save(function(err) {
        if (err) throw err;
        console.log('User created!');
    });
};
dbActions.prototype.selectAll = function() {
        var dbConnUrl = 'mongodb://' + config.dbConn.host + ":" + config.dbConn.port;
        dbConnUrl += '/mydb';
        var newUser = new user();
        newUser = setValues(message, newUser);
        mongoose.connect(dbConnUrl);
        console.log(JSON.stringify(newUser));
        newUser.save(function(err) {
                if (err) throw err;
                console.log('User created!');
            }
        }
        module.exports = dbActions;
