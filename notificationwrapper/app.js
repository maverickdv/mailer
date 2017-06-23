var express = require('express');
var logger = require('./utils/logger');
var cookieParser = require('cookie-parser');
var authFilter = require('./filters/AuthFilter');
var notification = require('./routes/notification');
var morgan = require('morgan');
var currentConfig = require('./config/envConfig')();
var app = express();

app.use(cookieParser());
app.disable('x-powered-by');
app.use(morgan("combined", {
    "stream": logger.accesslogs
}));
app.set('etag', 'strong');
app.set('env', currentConfig.mode);

var callAuthFilterExcept = function(path, method, req, res, next, authFilter) {
    if ((req.path === path) && (req.method === method)) {
        next();
    } else {
        authFilter.checkAuthentication(req, res, next);
    }
}

app.all('*', function(req, res, next) {
    callAuthFilterExcept('/notification/recojobs', 'DELETE', req, res, next, authFilter);
});

app.use('/notification', notification);

/*catch 404 and forward to error handler*/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler -will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        logger.log('error', err);
        res.status(err.status || 500);
        res.json({
            message: err.message || "Server error",
            error: err
        });
    });
}

// production error handler -no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err.status && err.status == 401) {
        res.status(401);
        logger.info(err);
    } else {
        res.status(500);
        logger.error(err);
    }
    res.json({
        message: "Server error",
    });
});

module.exports = app;
