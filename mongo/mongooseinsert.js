var mongoose = require('mongoose');
var config = require('./config');
var user = require('./usermodel');
function dbActions() {

}
function setValues(data,newUser){
    newUser.user_id = data['userId'];
    newUser.email = data['email'];
    var mailerObj = {"mailer_type": data['mailerType'],
                    "unique_mailer_id": data['uniMailId']
                    };
    newUser.mailers = mailerObj;
    return newUser;
    //user.mailers.mailer_type = data['mailerType'];
    //user.mailers.unique_mailer_id = data['uniMailIduniMailId'];
}
dbActions.prototype.insert = function(message){
    var dbConnUrl = 'mongodb://'+config.dbConn.host+":"+config.dbConn.port;
    dbConnUrl += '/mydb';
    var newUser = new user();
    newUser = setValues(message,newUser);
    mongoose.connect(dbConnUrl);
    console.log(JSON.stringify(newUser));
    newUser.save(function(err) {
        if (err) throw err;
            console.log('User created!');
    });

};
module.exports = dbActions;
