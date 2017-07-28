var currentConfig = require ('./../../config/errConfig');
var winston = require('winston');
winston.emitErrs = false;

var logger = new winston.Logger({
	transports: [
	new (winston.transports.File)(currentConfig.logging.winston.file_error),
    new (winston.transports.File)(currentConfig.logging.winston.file_info)
	],
    exitOnError: false
});

var accessLogger = new winston.Logger({
	transports:[new (winston.transports.File)(currentConfig.logging.winston.file_accesslogs)],
    exitOnError: false
});

(function(logger) {
	var oldLogFunc = logger.log;
	logger.log = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		if (args.length >= 2 && args[1] instanceof Error) {
			args[1] = args[1].stack;
		}
		oldLogFunc.apply(this, args);
	};
})(logger);

module.exports = logger;
module.exports.accesslogs = {
	write: function(message, encoding){
		accessLogger.silly(message);
	}
};
