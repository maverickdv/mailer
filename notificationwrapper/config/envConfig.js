var redisCacheManager = require('cache-manager-redis');

var devInternalDomain = '';

if(typeof process.env.INTERNAL_SERVERNAME !== 'undefined')
  var devInternalDomain = process.env.INTERNAL_SERVERNAME;

var config = {
    dev: {
        mode: 'dev',
        selfport: 8081,
        authService: {
            host: 'localhost',
            port: '9996',
            timeout: 1000
        },
        authServiceNode: {
            host: '127.0.0.1',
            port: '3000',
            timeout: 1000
        },
        mySQL: {
            connectionLimit: 50,
            host: 'localhost',
            user: 'root',
            port: 3314,
            _socket: '/tmp/mysql14',
            password: 'Km7Iv80l'
        },
        redis: {
            store: redisCacheManager,
            host: 'localhost',
            port: '6380',
            apiTtl: 14400
        },
        secondsNinetyDays:7776000,
        internalDomain: devInternalDomain,
        urlPaths: {
            CVVIEWS: '/ng/mnj/profile/cvViewNotification?cvviewdate=',
            RECOJOBS: '/ng/jobsearch/recojobs/Notification',
            WHTMA: '/ng/rm/RMService/EmployerActivity/?resid='
        }
    },
    test: {
        mode: 'test',
        selfport: 8081,
        authService: {
            host: '127.0.0.1',
            port: '9996',
            timeout: 1000
        },
        authServiceNode: {
            host: '127.0.0.1',
            port: '3000',
            timeout: 1000
        },
        mySQL: {
            connectionLimit: 50,
            host : 'localhost',
            user : 'root',
            port : 3306,
            password : 'Km7Iv80l'
        },
        redis: {
            store: redisCacheManager,
            host: '127.0.0.1',
            port: '6380',
            apiTtl: 14400
        },
        secondsNinetyDays:7776000,
        internalDomain: 'testng1.infoedge.com',
        urlPaths: {
            CVVIEWS: '/ng/mnj/profile/cvViewNotification?cvviewdate=',
            RECOJOBS: '/ng/jobsearch/recojobs/Notification',
            WHTMA: '/ng/rm/RMService/EmployerActivity/?resid='
        }
    },
    staging: {
        mode: 'staging',
        selfport: 8081,
        authService: {
            host: '127.0.0.1',
            port: '9996',
            timeout: 1000
        },
        authServiceNode: {
            host: '127.0.0.1',
            port: '3000',
            timeout: 1000
        },
        mySQL: {
            connectionLimit: 50,
            host: 'gulf1.resdex.com',
            user: 'niuser',
            password: 'niUseR'
        },
        redis: {
            store: redisCacheManager,
            host: '172.10.14.95',
            port: '6380',
            apiTtl: 14400
        },
        secondsNinetyDays:7776000,
        internalDomain: 'nginternals.staging.com',
        urlPaths: {
            CVVIEWS: '/ng/mnj/profile/cvViewNotification?cvviewdate=',
            RECOJOBS: '/ng/jobsearch/recojobs/Notification',
            WHTMA: '/ng/rm/RMService/EmployerActivity/?resid='
        }
    },
    production: {
        mode: 'production',
        selfport: 8081,
        authService: {
            host: '10.10.14.54',
            port: '9996',
            timeout: 2000
        },
        authServiceNode:{
            host: 'nglegacyauth.resdex.com',
            port: '80',
            timeout: 1000
        },
        mySQL: {
            connectionLimit: 50,
            host: 'gulf1.resdex.com',
            user: 'niuser',
            password: 'niUseR'
        },
        redis: {
            store: redisCacheManager,
            host: '172.10.14.54',
            port: '6380',
            apiTtl: 14400
        },
        secondsNinetyDays:7776000,
        internalDomain: 'nginternals.resdex.com',
        urlPaths: {
            CVVIEWS: '/ng/mnj/profile/cvViewNotification?cvviewdate=',
            RECOJOBS: '/ng/jobsearch/recojobs/Notification',
            WHTMA: '/ng/rm/RMService/EmployerActivity/?resid='
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
}
