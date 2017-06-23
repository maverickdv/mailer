var mongoose = require('mongoose');
var config = require('./../../config/config')();
var UserSchema = require('./../dbModel/usermodel');

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

module.exports = {
    getUserModel: function(appId){
    var conn = createConection(appId);
    var usermodel = conn.model('user',UserSchema);
    return usermodel;
    }
}
