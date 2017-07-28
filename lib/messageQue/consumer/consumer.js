var amqp = require('amqplib/callback_api');
var logger = require('./../../utils/logger');
var config = require('./../../../config/config')();
var msgProcessor = require('./../../messageProcessor');
var processMessage = function(message) {
    message = JSON.parse(message.content);
    msgProcessor.process(message);
}
amqp.connect('amqp://' + config.rabbitMq.connection.host + ":" + config.rabbitMq.connection.port, function(err, conn) {
	if(err){
	        logger.error(__filename," could not connect to rabbitmq on "+ config.rabbitMq.connection.host + " : "+config.rabbitMq.connection.port,err);	
	}
	else {
		try{
			conn.createChannel(function(err, ch) {
			if(err){
				logger.error(__filename,"Cannot create channel in rabbitmq on " + config.rabbitMq.connection.host +" and port "+ config.rabbitMq.connection.port,err);
			}
			else {
		        	var q = config.rabbitMq.queues[0].name;
			        ch.assertQueue(q, {
			            durable: true
			        });
				try{
				        ch.consume(q, processMessage, {
				            noAck: true
				        });
				}
				catch(err){
					logger.error(__filename,"error in consuming from queue  " + config.rabbitMq.connection.host +" and port "+ config.rabbitMq.connection.port,err);
				}
			}
		
		    });
		}
		catch(err){
			logger.error(__filename,"Cannot create channel  or consume due to unknown error in rabbitmq  " + config.rabbitMq.connection.host +" and port "+ config.rabbitMq.connection.port,err);
		}
	}
});
