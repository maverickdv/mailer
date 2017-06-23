var http = require('http');
var logger = require('../utils/logger');
var currentConfig = require('../config/envConfig')();
var appConfig = require('../config/appConfig');

function callbackAuthService(authServiceResponse, req, res, next) {
    if (authServiceResponse.statusCode === 200) {
        var buffer = "";
        authServiceResponse.on('data', function(chunk) {
            buffer += chunk;
        });
        authServiceResponse.on("end", function(err) {
            if (err) {
                logger.error(__filename + 'auth service error: ' + err);
                next(err);
                return;
            }

            try {
                var jsonObj = JSON.parse(buffer);
            } catch (e) {
                logger.error(__filename, ' exception parsing json: ', e.message);
                var err = new Error('Auth service json parse error');
                err.status = 500;
                next(err);
                return;
            }

            var mnjConTokenVal = req.cookies[appConfig.cookies.mnjConToken];

            if (mnjConTokenVal != undefined) {
                if (jsonObj.status == "Authenticated") {
                    req.resId = jsonObj.resId;
                    next();
                } else {
                    next(getAuthError());
                }
            } else {
                var contextData = JSON.parse(jsonObj.context);
                if (contextData.resid != "") {
                    req.resId = contextData.resid;
                    next();
                } else {
                    next(getAuthError());
                }
            }
        });

        authServiceResponse.on('error', function(err) {
            logger.error(__filename, 'problem with request: ' + err);
            var err = new Error('Can\'t Authenticate');
            logger.log('error', err);
            err.status = 500;
            next(err);
        });
    } else if (authServiceResponse.statusCode === 400 ||
        authServiceResponse.statusCode === 401) {
        var err = new Error('Un-authorized response from auth service, code: ' + authServiceResponse.statusCode);
        err.status = 401;
        next(err);
    } else {
        var err = new Error('Issue in authentication, code: ' + authServiceResponse.statusCode);
        next(err);
    }
}

function getAuthError() {
    var err = new Error("Authentication not success");
    err.status = 401;
    return err;
}

module.exports = {
    checkAuthentication: function(req, res, next) {
        var mnjAuthTokenVal = req.cookies[appConfig.cookies.mnjAuthToken];
        var mnjConTokenVal = req.cookies[appConfig.cookies.mnjConToken];
        if (mnjConTokenVal != undefined && mnjConTokenVal !== "true") {
            var lastActive = req.cookies[appConfig.cookies.lastActive];
            var authsource = req.cookies[appConfig.cookies.authsource];
            var authServiceParameters = {
                host: currentConfig.authServiceNode.host,
                port: currentConfig.authServiceNode.port,
                path: '/authservice',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            };
            var loginRequestJson = {
                "token": mnjConTokenVal,
                "lastActive": lastActive,
                "authsource": authsource
            };
        } else if (mnjAuthTokenVal != undefined) {
            var authServiceParameters = {
                host: currentConfig.authService.host,
                port: currentConfig.authService.port,
                path: '/ng/oauth2/user/authorize',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + mnjAuthTokenVal,
                    'device-type': 'desktop',
                    'device-id': '',
                    'user-agent': req.get('User-Agent'),
                    'Origin': 'NotificationNodeService'
                },
                method: 'POST'
            };

            var ip = req.connection.remoteAddress.replace(/^.*:/, '');
            var loginRequestJson = {
                "ip": ip,
                "update_session": "false",
                "app_id": "mnj"
            };
        } else {
            logger.info(__filename, 'could not determine legacy or oauth');
            var err = new Error('Could not find mnjcon or mnjauth');
            err.status = 401;
            next(err);
            return;
        }
        var reqPost = http.request(authServiceParameters, function(req, res, next) {
            var req = req,
                res = res,
                next = next;
            return function(response) {
                callbackAuthService(response, req, res, next);
            }
        }(req, res, next));

        reqPost.write(JSON.stringify(loginRequestJson));
        reqPost.end();

        reqPost.on('socket', function(socket) {
            socket.setTimeout(currentConfig.authService.timeout);
            socket.on('timeout', function() {
                logger.error(__filename, 'Auth service timed out: ' + authServiceParameters.host + ':' + authServiceParameters.port);
                reqPost.abort();
            });
        });

        reqPost.on('error', function(err) {
            logger.error(__filename, 'Error with auth service: ' + authServiceParameters.host + ':' + authServiceParameters.port, err);
            err.message = "Server error";
            next(err);
        });
    }
}
