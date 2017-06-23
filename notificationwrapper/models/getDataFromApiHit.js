var http = require('http');
var logger = require('../utils/logger');
var sha1 = require('sha1');
var redisCache = require('./CacheManager');
var currentConfig = require('../config/envConfig')();

function setTimeStampAndKeyHash(req, res, hashKey, newHash, cb) {
    var newTimeStamp = sha1(((new Date).getTime()));
    var key = req.resId + '[TRAYVIEWEDSTATUSHASH]';

    redisCache.set(key, newTimeStamp, function(err, reply) {
        if (err) {
            logger.error(__filename, 'Error in setting newTimeStamp');
            cb(err, {});
        }
    });

    redisCache.set(hashKey, newHash, function(err, reply) {
        if (err) {
            logger.error(__filename, 'Error in setting newHash of key', hashKey);
            cb(err, {});
        }
    });
}

function callbackAfterApihit(responseGetDataFromApi, req, res, type, cb) {
    // logger.debug("in callbackAfterApihit");
    if (responseGetDataFromApi.statusCode == 200) {
        var buffer = "";
        responseGetDataFromApi.on('data', function(chunk) {
            buffer += chunk;
        });

        responseGetDataFromApi.on("end", function(err) {
            if (err) {
                logger.error(__filename, "GOT error while getting data from api: ", err)
                cb(err, {});
                return;
            }

            try {
                if (!(buffer != undefined) || buffer == '') {
                    var err = new Error("Couldn't get response from PHP endpoint");
                    err.status = 500;
                    cb(err, {});
                    return;
                }

                var jsonObj = JSON.parse(buffer);
            } catch (e) {
                logger.error(__filename, "API response not valid: ", e.message);
                var err = new Error('PHP API response not valid');
                err.status = 500;
                cb(err, {});
            }

            var newHash = sha1(JSON.stringify(jsonObj.data));
            var hashKey = req.resId + '[' + type + ']' + '[HASH]';

            redisCache.get(hashKey, function(err, oldHash) {
                if (err) {
                    logger.error(__filename, 'Error in geting old hash of type', type);
                    cb(err, {});
                    return;
                }

                // console.log('hashKey, newHash oldHash',hashKey,newHash,oldHash);
                if ((oldHash != newHash) && (jsonObj.count)) {
                    setTimeStampAndKeyHash(req, res, hashKey, newHash, cb);
                }
            });

            cb(null, jsonObj.count);
        });

        responseGetDataFromApi.on('error', function(err) {
            logger.error('Error in callbackAfterApihit for ', type, ' API hit');
            cb(err, {});
        });
    } else {
        logger.error('response from ', type, ' API hit is', responseGetDataFromApi.statusCode);
        var err = new Error('Response from PHP API is !200');
        err.status = 500;
        cb(err, {});
    }
}

module.exports = {
    getDataFromApi: function(req, res, apiUrlPath, type, cb) {
        // logger.debug("in getDataFromApi function");
        var options = {
            hostname: currentConfig.internalDomain,
            path: apiUrlPath,
            method: 'GET',
            headers: {
                'Cookie': 'AT=' + req.cookies["AT"] + ';NITEST=y',
                'User-Agent': req.get('User-Agent')
            }
        };
        //console.log(options);
        var reqGet = http.get(options, function(req, res, type, cb) {
            var req = req,
                res = res,
                cb = cb,
                type = type;
            return function(response) {
                callbackAfterApihit(response, req, res, type, cb);
            }
        }(req, res, type, cb));

        reqGet.on('socket', function(socket) {
            socket.setTimeout(2000);
            socket.on('timeout', function() {
                logger.error(__filename, 'api hit timed out: ' + apiUrlPath);
                reqGet.abort();
            });
        });

        reqGet.on('error', function(err) {
            logger.error(__filename, 'got error with api hit: ' + apiUrlPath, err);
            cb(err, {});
        });

        reqGet.end();
    }
}
