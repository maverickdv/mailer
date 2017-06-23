var express = require('express');
var router = express.Router();
var notificationProvider = require('../models/NotificationProvider');
var dao = require('../models/dao');
var redisManager = require('../models/RedisManager');

function methodNotAllowed(req, res, next){
  var err = new Error('Method Not Allowed');
  err.status = 405;
  next(err);
} 

router.get('/', notificationProvider.getAllNotifications).all('/', methodNotAllowed);

router.put('/cvviews', function(req, res, next){
  dao.setLastSeenTime(req, res, next, 'CVVIEWS');
}).all('/cvviews', methodNotAllowed);

router.put('/whtma', function(req, res, next){
  dao.setLastSeenTime(req, res, next, 'WHTMA');
}).all('/whtma', methodNotAllowed);

router.put('/reset', function(req, res, next){
  redisManager.setSeenFlagTrue(req, res, next);
}).all('/reset', methodNotAllowed);

router.delete('/recojobs', function(req, res, next){
  redisManager.clearRecoJobsCache(req, res, next);
}).put('/recojobs', function(req, res, next){
  //dao.setLastSeenTime(req, res, next, 'RECOJOBS'); <--- This is done via PHP Code for Reco Jobs
  redisManager.resetNotificationCount(req,res,next,'RECOJOBS');
}).all('/recojobs', methodNotAllowed);

module.exports = router;
