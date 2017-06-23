var logger = require('../utils/logger');
var async = require('async');
var cacheManager = require('cache-manager');
var currentConfig = require('../config/envConfig')();
 
var redisCache = cacheManager.caching(currentConfig.redis);

// listen for redis connection error event 
redisCache.store.events.on('redisError', function(error) {
    // handle error here 
    logger.error(error);
});

module.exports = redisCache;
