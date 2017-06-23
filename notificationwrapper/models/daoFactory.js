var mysql = require('mysql');
var currentConfig = require ('../config/envConfig')();

var dbVars = {
	pool : mysql.createPool(currentConfig.mySQL),
	notificationSections : {CVVIEWS : 1, WHTMA : 2}
}
module.exports = dbVars;
