var dbConnector = require('./dbConnector');
var daoHelper = require('./daoHelper');
var daoHelperObj = new daoHelper();

function saveDataForMailerId(userDbModel, callingFunc) {
    userDbModel.save(function(err) {
        if (err) {
            console.log("User could not be added in " + callingFunc + "function because of " + err);
        }
    });
}

function handlePostAndClick(userDbModel, mailerData,tempUser, callingFunc) {
        userDbModel.find({
            "unique_mailer_id": tempUser['unique_mailer_id']
        },
        function(err, docs) {
            if (err) {
                console.log("some error occured in " + callingFunc + " function for finding unique_mailer_id : " + callingFunc);
            }

            if (docs[0]!=undefined) {
                if(docs[0].open_status.opened==false){
                    var updateCriteria = '{"unique_mailer_id": ' + tempUser['unique_mailer_id'] + '}';
                    var updateQuery = tempUser;
                    userDbModel.update({unique_mailer_id: tempUser['unique_mailer_id']},tempUser,function(err, raw) {
                        if (err) {
                            console.log("error occued in updating for calling function " + callingFunc + " got this error :" + err);
                        }
                        console.log(raw);
                    });
                }
                else{
                    if(callingFunc=="clicksInsert"){
                        userDbModel.update({unique_mailer_id:tempUser['unique_mailer_id']},{ $push: { links: tempUser['links'][0] }}, function(err, raw) {
                            if (err) {
                                console.log("error occued in updating for calling function " + callingFunc + " got this error :" + err);
                            }
                            console.log(raw);
                        });
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
        var newUser = new userModel();
        newUser = daoHelperObj.setValuesForInsert(message, newUser);
        saveDataForMailerId(newUser, "insert");
    },

    openRateInsert: function(mailerData) {
        var tempUser = {};
        tempUser = daoHelperObj.setValuesforOpenRate(mailerData, tempUser);
        var userModel = dbConnector.getUserModel(tempUser['appId']);
        handlePostAndClick(userModel, mailerData,tempUser, "openRateInsert");
    },

    clicksInsert: function(mailerData) {
        var tempUser = {};
        tempUser = daoHelperObj.setValuesforClicks(mailerData, tempUser);
        var userModel = dbConnector.getUserModel(tempUser['appId']);
        handlePostAndClick(userModel, mailerData,tempUser, "clicksInsert");
    }
}
