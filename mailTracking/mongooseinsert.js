var mongoose = require('mongoose');
var config = require('./config');
var user = require('./usermodel');
function dbActions() {

}
dbActions.prototype.insert = function(){
    var dbConnUrl = 'mongodb://'+config.dbConn.host+":"+config.dbConn.port;
    dbConnUrl += '/mydb';
    mongoose.connect(dbConnUrl);
};
module.exports = dbActions;
