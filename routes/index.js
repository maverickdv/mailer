var express = require('express');
var router = express.Router();
var p = require('./../publisher/publisher');

router.post('/addMail', function(req, res, next) {
    var reqData = {};
    reqData['appId'] = req.body.appId;
    reqData['uniMailId'] = req.body.uniMailId;
    reqData['mailerType'] = req.body.mailerType;
    reqData['email'] = req.body.email;
    reqData['userId'] = req.body.userId;
    reqData['dataType'] = "mailSent";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    console.log(reqData);
    res.end();
});

router.get('/open/mailId/:mailId', function(req, res, next) {
    var reqData = {};
    reqData['mailId'] = req.params.mailerId;
    reqData['dataType'] = "open";
    reqData['userAgent'] = req.headers['user-agent'];
    reqData['ip'] = req.ip;
    //var publisher = new p();
    //publisher.pushInQueue(reqData);
    console.log(reqData);
    res.end();
});

router.get('/click/mailId/:mailId/url/:url', function(req, res, next) {
    var reqData = {};
    var redUrl = req.params.url;
    reqData['mailId'] = req.params.mailerId;
    reqData['url'] = redUrl;
    reqData['dataType'] = "click";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    res.statusCode = 302;
    res.setHeader("Location", url);
    res.end();
});
module.exports = router;
