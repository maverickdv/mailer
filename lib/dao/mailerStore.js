var dbConnector = require('./dbConnector');
var daoHelper = require('./daoHelper');
var logger = require('./../utils/logger');
var daoHelperObj = new daoHelper();

function saveDataForMailerId(userDbModel, callingFunc) {
    userDbModel.save(function(err) {
        if (err) {
		logger.error(__filename,"User could not be added in " + callingFunc + "function because of ",err);
        }
    });
}

function handlePostAndClick(userDbModel, mailerData,tempUser, callingFunc) {
        userDbModel.find({
            "unique_mailer_id": tempUser['unique_mailer_id']
        },
        function(err, docs) {
            if (err) {
		     logger.error(__filename,"some error occured in " + callingFunc + " function for finding unique_mailer_id : " ,err);
            }
            if (docs[0]!=undefined) {
                if(docs[0].open_status.opened==false){
                    var updateCriteria = '{"unique_mailer_id": ' + tempUser['unique_mailer_id'] + '}';
                    var updateQuery = tempUser;
                    userDbModel.update({unique_mailer_id: tempUser['unique_mailer_id']},tempUser,function(err, raw) {
                        if (err) {
		     		logger.error(__filename,"error occued in updating for calling function " + callingFunc + " for mailer id : "+tempUser['unique_mailer_id'] ,err);
                        }
                    });
                }
                else{
                    if(callingFunc=="clicksInsert"){
                        userDbModel.update({unique_mailer_id:tempUser['unique_mailer_id']},{ $push: { links: tempUser['links'][0] }}, function(err, raw) {
                            if (err) {
				    logger.error(__filename,"error occued in updating for calling function " + callingFunc + " for mailer id : "+tempUser['unique_mailer_id'] ,err);
                            }
                        });
                    }
		    else{
		    }
                }

            }
            else{
                var newUser = new userDbModel();
                if(callingFunc=="clicksInsert"){
                    newUser = daoHelperObj.setValuesforClicks(mailerData, newUser);
                }
                else if (callingFunc=="openRateInsert") {
                    newUser = daoHelperObj.setValuesforOpenRate(mailerData, newUser);
                }
                else {
                    newUser = daoHelperObj.setValuesForInsert(mailerData, newUser);
                }
                saveDataForMailerId(newUser, callingFunc);
            }
        }
    );
}


module.exports = {
    insert: function(message) {
        var userModel = dbConnector.getUserModel(message['appId']);
	if(userModel) {
	        var newUser = new userModel();
	        newUser = daoHelperObj.setValuesForInsert(message, newUser);
	        saveDataForMailerId(newUser, "insert");
	}
    },

    openRateInsert: function(mailerData) {
        var tempUser = {};
        tempUser = daoHelperObj.setValuesforOpenRate(mailerData, tempUser);
        var userModel = dbConnector.getUserModel(tempUser['appId']);
	if(userModel) {
	        handlePostAndClick(userModel, mailerData,tempUser, "openRateInsert");
	}
    },

    clicksInsert: function(mailerData) {
        var tempUser = {};
        tempUser = daoHelperObj.setValuesforClicks(mailerData, tempUser);
        var userModel = dbConnector.getUserModel(tempUser['appId']);
	if(userModel) {
	        handlePostAndClick(userModel, mailerData,tempUser, "clicksInsert");
	}
    }
}
