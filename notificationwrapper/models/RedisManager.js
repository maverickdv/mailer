var redis = require('redis');
var currentConfig = require('../config/envConfig')();
var client = redis.createClient(currentConfig.redis.port, currentConfig.redis.host);
var logger = require('../utils/logger.js');


module.exports = {
    setSeenFlagTrue: function(req, res, next) {
        var key = req.resId + "[TRAYVIEWEDSTATUSHASH]";
        // logger.debug('on top',key);
        client.send_command('exists', [key], function(err, reply) {
            // logger.debug('reply',reply);
            if (reply === 1) {
                // logger.debug('exists');
                client.set(key, 0, function(err) {
                    if (err) {
                        logger.error(__filename, '[setSeenFlagTrue]', err);
                        next(err);
                    } else {
                        // logger.debug('reset Successfully');
                        res.statusCode = 204;
                        res.end();
                    }
                });
            } else {
                /* trying to set resid[TRAYVIEWEDSTATUSHASH]=0 which is not available in redis*/
                logger.error(__filename, '[setSeenFlagTrue] Exc should not reach here');
                var err = new Error('Forbidden');
                err.status = 404;
                next(err);
            }
        });
    },

    resetNotificationCount: function(req, res, next, type) {
        var key = req.resId + '[' + type + ']';
        // logger.debug(key);
        client.get(key, function(err, reply) {
            if (!err) {
                // logger.debug('key get value',key,reply);
                if (reply) {
                    client.send_command('decrby', [key, reply], function(err, reply) {
                        if (err) {
                            logger.error(__filename, '[clearRecoJobsCache]', err);
                            err.message = "Server error";
                            next(err);
                        } else {
                            res.statusCode = 204;
                            res.end();
                        }
                    });
                } else {
                    logger.info(__filename, '[clearRecoJobsCache]', key, 'key does not exists');
                    res.statusCode = 404;
                    res.end();
                }
            } else {
                logger.error(__filename, '[clearRecoJobsCache]', err);
                err.message = "Server error";
                next(err);
            }
        });
    },

    clearRecoJobsCache: function(req, res, next) {
        var allowedHostname = 'notificationservice.resdex.com';
        //please consult gaurav.saini before changing this
        if (req.hostname != allowedHostname) {
            res.statusCode = 404;
            res.end();
        } else {
            var arg = '*RECOJOBS]'
            client.send_command('keys', [arg], function(err, reply) {
                if (err) {
                    logger.error(__filename, '[clearRecoJobsCache]', err);
                    err.message = "Server error";
                    next(err);
                } else {
                    if (reply.length) {
                        client.send_command('del', reply, function(err, reply) {
                            if (err) {
                                logger.error(__filename, '[clearRecoJobsCache]', err);
                                next(err);
                            } else {
                                res.json({
                                    status: 'Successfully cleared RecoJobsCache,' + reply + ' Entries deleted'
                                });
                            }
                        });
                    } else {
                        res.json({
                            status: 'RecoJobsCache Already empty'
                        });
                    }
                }
            });
        }

    }
}
