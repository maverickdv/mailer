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

    reqData['mailId'] = req.params.mailId;
    reqData['dataType'] = "open";
    reqData['userAgent'] = req.headers['user-agent'];
    reqData['ip'] = req.ip;
    var publisher = new p();
    publisher.pushInQueue(reqData);
    var buf = new Buffer([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
    0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
    0x02, 0x44, 0x01, 0x00, 0x3b]);
    res.send(buf, { 'Content-Type': 'image/gif' }, 200);

});

router.get('/click/mailId/:mailId/url/:url', function(req, res, next) {
    var reqData = {};
    var redUrl = req.params.url;
    reqData['mailId'] = req.params.mailId;
    reqData['url'] = redUrl;
    reqData['dataType'] = "click";
    var publisher = new p();
    publisher.pushInQueue(reqData);
    res.statusCode = 302;
    res.setHeader("Location", redUrl);
    res.end();
});
module.exports = router;
