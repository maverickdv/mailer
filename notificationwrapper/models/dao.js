var dbConnection = require('./daoFactory');
var logger = require('../utils/logger.js');
var currentConfig = require ('../config/envConfig')();
var redisManager = require('../models/RedisManager');

module.exports={
	setLastSeenTime: function(req,res,next,type){
	    querySetLastSeenTimeForType='INSERT INTO nimynaukri.NOTIFICATIONS (resId, notificationType, lastViewDate) VALUES(?,?, NOW()) ON DUPLICATE KEY UPDATE lastViewDate=NOW()';
	    dbConnection.pool.getConnection(function(err,connection){
	    	if(err){
	    		logger.error(__filename,'[setLastSeenTime]',err);
	    		err.message="Server error";
	    		next(err);
	    	}
	    	else{
			    	connection.query(querySetLastSeenTimeForType,[req.resId,dbConnection.notificationSections[type]],function(err, rows){
			    	connection.release();
				    if (err){
				    	logger.error(__filename,'[setLastSeenTime]',err);
				    	err.message="Server error";
				    	next(err);
				    }
				    else{
				    	redisManager.resetNotificationCount(req,res,next,type);
				    }
			    });
			}
	    });
	},

	getLastSeenTime: function(req,res,next,type,callbackFromDao,cb){
		var queryGetLastSeenTimeForType='SELECT UNIX_TIMESTAMP(lastViewDate) AS lastViewTimestamp FROM nimynaukri.NOTIFICATIONS where resId =? AND notificationType=?';
		dbConnection.pool.getConnection(function(err,connection){
        if(err){
          logger.error(__filename,'[setLastSeenTime]',err);
          err.message="Server error";
          cb(err,{});
        }
	    	else{
				connection.query(queryGetLastSeenTimeForType,[req.resId,dbConnection.notificationSections[type]],function(err, rows, fields){
				connection.release();
				if (err){
			    	logger.error(__filename,'[getLastSeenTime]',err);
			    	err.message="Server error";
			    	cb(err,{});
				}
				else{
					callbackFromDao(req,res,next,rows,type,cb);
				}
				});
			}
		});
	}
	
}
