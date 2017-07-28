var amqp = require('amqplib/callback_api');
var config = require('./../../../config/config')();
var logger = require('./../../utils/logger');
function publisher (){

}
/**
* Creates the connection to RabbitMQ and assigns a message handler that
* will publish the messages
*/
publisher.prototype.pushInQueue = function(data){
	amqp.connect('amqp://'+config.rabbitMq.connection.host+":"+config.rabbitMq.connection.port, function(err, conn) {
			if(err){
				logger.error(__filename," could not connect to rabbitmq on "+ config.rabbitMq.connection.host + " : "+config.rabbitMq.connection.port,err);
			}
			else {
				try {
				conn.createChannel(function(err, ch) {
					if(err){
						logger.error(__filename,"could not create channel in rabbitmq ",err);
					}
					else {
						var q = config.rabbitMq.queues[0].name;
						ch.assertQueue(q, {durable: true});
						ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
						logger.info(" [x] Sent to queue"+q + "    "+ JSON.stringify(data));
					}
				});
				setTimeout(function() { conn.close();}, 500);
				}
				catch(err){
					logger.error(__filename,"could not create channel in rabbitmq due to unknown error",err);
				}
			}
	});
}
module.exports = publisher;
