var express = require('express');
var router = express.Router();
var p = require('./../publisher/publisher');

router.post('/addMailer', function(req, res, next) {
    var reqData = {};
     reqData['appId'] = req.body.app_id;
    reqData['uniMailId'] = req.body.unique_mail_id;
    reqData['mailerType'] = req.body.mailerType;
    reqData['email'] = req.body.email;
    reqData['userId'] = req.body.user_id;
    reqData['dataType'] = "mailSent";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    console.log(reqData);
    res.end();
});

router.get('/open/mailerId/:mailerId', function(req, res, next) {
    var reqData = {};
     reqData['mailerId'] = req.params.mailerId;
     reqData['dataType'] = "open";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    console.log(reqData);
    res.end();
});

router.get('/click/mailerId/:mailerId/url/:url', function(req, res, next) {
    var reqData = {};
    var redUrl = req.params.url;
    reqData['mailerId'] = req.params.mailerId;
    reqData['url'] = redUrl;
    reqData['dataType'] = "click";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    res.statusCode = 302;
    res.setHeader("Location", url);
    res.end();
});
module.exports = router;
