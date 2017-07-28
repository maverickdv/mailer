var express = require('express');
var router = express.Router();

/* GET dashboard listing page. */
router.get('/', function(req, res, next) {
  console.log("hello");
  var config = require("./../config/config")
  var app_ids = config.app_ids;
  var actionUrl = "http://localhost:5000/dashboard/app";
  res.render(
    'dashboard_apps',
    {
      title: 'Express',
      appIds: app_ids,
      actionUrl: actionUrl
    }
  );
});

/* GET dashboard listing page. */
router.get('/app', function(req, res, next) {
  console.log("panda");
  var appId = req.query.appid;
  var DashboardDetails = require("./../mailTracking/dashboard");
  var dashboardDetails = new DashboardDetails()
  var mailerTypes = dashboardDetails.getMailerTypesByApp(appId)
  res.send(mailerTypes);
});


module.exports = router;
