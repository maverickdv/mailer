class DashboardDetails {
  getConnection() {
    var mongoose = require('mongoose');
    var user = require('./user.model.js');
    var db = 'mongodb://127.0.0.1:27017/panda_database';
    mongoose.connect(db);
  }
  getMailerTypesByApp(appId) {
    return "Mailer Types By App Id will be given : " + appId;
  }
}

module.exports = DashboardDetails;
