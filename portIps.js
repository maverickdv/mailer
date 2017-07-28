var mysql      = require('mysql');
var dbConnector = require('./lib/dao/dbConnector');
var connection = mysql.createConnection({
	  host     : '127.0.0.1',
	  user     : 'root',
	  password : 'gillumasthai'
	});

connection.connect();
var userModel = dbConnector.getUserModel("user");
userModel.aggregate([{$match: {"mailer_id": "978851"}},{$group:{"_id":"$open_status.sent_time","count":{"$sum":1}}}],function(err,result) {
			if(err){
				console.log(err);
			}
			else {
				result.forEach(function(record){
					console.log(record['_id']);
				}
					);
				dbConnector.closeConnection();
			}
	            });

function getLocationFromIp(ipAddress){
	var query = "SELECT location.city_name, location.country_code, location.lat, location.lon FROM blocks, location WHERE MBRCONTAINS(ip_poly, POINTFROMWKB(POINT(INET_ATON('"+ ipAddress +"'), 0))) AND blocks.locid = location.locid LIMIT 1";
	connection.query(query, function (error, results, fields) {
	        if (error) throw error;
	                console.log('The solution is: ', results[0].solution);
	          })
}

connection.end();


