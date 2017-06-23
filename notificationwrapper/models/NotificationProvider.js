process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; /* not sure will be required on production*/
var redisCache = require('./CacheManager');
var async = require('async');
var currentConfig = require('../config/envConfig')();
var logger = require('../utils/logger');
var dao = require('../models/dao');
var getDataFromApiHit = require('./getDataFromApiHit');
var sha1 = require('sha1');



function callbackFromDao(req, res, next, rows, type, cb) {
    if (typeof rows[0] !== 'undefined' && rows[0])
        req.lastViewDate = rows[0].lastViewTimestamp;
    else
        req.lastViewDate = ((Math.floor((new Date).getTime() / 1000)) - (currentConfig.secondsNinetyDays)); //90 days back
    // console.log(type);
    if (type == 'CVVIEWS') {
        var apiUrlPath = currentConfig.urlPaths[type] + req.lastViewDate;
    } else if (type == 'WHTMA') {
        var apiUrlPath = currentConfig.urlPaths[type] + req.resId + '&date=' + req.lastViewDate;
    } else {
        logger.error(__filename, "[callbackFromDao]Error Execution should not reach here");
        var err = new Error("Invalid flow for " + type);
        cb(err, {});
    }
    getDataFromApiHit.getDataFromApi(req, res, apiUrlPath, type, cb);
}

function getCvViews(req, res, next, cb) {
    // logger.debug('in getCvViews fun');
    dao.getLastSeenTime(req, res, next, 'CVVIEWS', callbackFromDao, cb);
}

function getWHTMA(req, res, next, cb) {
    // logger.debug('in getWHTMA fun');
    dao.getLastSeenTime(req, res, next, 'WHTMA', callbackFromDao, cb);
}

function getRecoJobs(req, res, next, cb) {
    // logger.debug('in getRecoJobs fun');
    var apiUrlPath = currentConfig.urlPaths['RECOJOBS'];
    getDataFromApiHit.getDataFromApi(req, res, apiUrlPath, 'RECOJOBS', cb);
}


module.exports = {
    getAllNotifications: function(req, res, next) {
        // logger.debug('in getAllNotifications');
        var req = req,
            res = res,
            next = next;
        return async.parallel({
                CVVIEWS: function(callback) {
                    var key = req.resId + '[CVVIEWS]';
                    //logger.debug(key);
                    redisCache.wrap(key, function(cb) {
                        getCvViews(req, res, next, cb);
                    }, {
                        ttl: currentConfig.redis.apiTtl
                    }, function(err, value) {
                        // logger.debug("cvViews done",value);
                        callback(err, value);
                    });
                },
                WHTMA: function(callback) {
                    var key = req.resId + '[WHTMA]';
                    // logger.debug(key);
                    redisCache.wrap(key, function(cb) {
                        getWHTMA(req, res, next, cb);
                    }, {
                        ttl: currentConfig.redis.apiTtl
                    }, function(err, value) {
                        // logger.debug("WHTMA done");
                        callback(err, value);
                    });
                },
                RECOJOBS: function(callback) {
                    var key = req.resId + '[RECOJOBS]';
                    // logger.debug(key);
                    redisCache.wrap(key, function(cb) {
                        getRecoJobs(req, res, next, cb);
                    }, function(err, value) {
                        // logger.debug("recoJobs done");
                        callback(err, value);
                    });
                }
            },
            function(err, results) {
                if (err) {
                    logger.error(__filename, 'Parallel call results in error: ', err);
                    err.message = "Server error";
                    err.status = 500;
                    next(err);
                    return;
                }

                var key = req.resId + '[TRAYVIEWEDSTATUSHASH]';
                redisCache.get(key, function(err, hash) {
                    if (err) {
                        logger.error(__filename, 'after parallel call, redis call results in error', err);
                        err.message = "Server error";
                        err.status = 500;
                        next(err);
                        return;
                    }

                    if (hash === null) {
                        hash = 0;
                    }

                    var response = {
                        "CVVIEWS": results.CVVIEWS,
                        "WHTMA": results.WHTMA,
                        "RECOJOBS": results.RECOJOBS,
                        "HASH": hash
                    };
                    res.json(response);
                    res.end();
                });
            });
    }
}
