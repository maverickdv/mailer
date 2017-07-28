var mongoose = require('mongoose');
var config = require('./../../config/config')();
var UserSchema = require('./../dbModel/usermodel');
var logger = require('./../utils/logger');
var dbConnUrl = 'mongodb://'+config.dbConn.userName+":"+config.dbConn.password+'@'+config.dbConn.host+":"+config.dbConn.port;
var options = {"socketOptions":{"connectTimeoutMS":1500,
				"socketTimeoutMS":1500
				},
    		"server":{
			"reconnectTries":Number.MAX_VALUE,
			"reconnectInterval":1
			}
		};
dbConnUrl += '/mailTracking';
global.connStr = mongoose.connect(dbConnUrl,options,function(err){
	if(err){
		logger.error(__filename," could not connect to mongo on "+ config.dbConn.host + " : "+config.dbConn.port,err);
	}
});

module.exports = {
	getUserModel: function(appId){
		var usermodel = global.connStr.model('user',UserSchema);
		return usermodel;
	},
	closeConnection: function(){
		setTimeout( function () {
			mongoose.disconnect();
		}, 1000);
	}
}
