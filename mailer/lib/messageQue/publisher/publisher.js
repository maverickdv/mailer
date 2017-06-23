var amqp = require('amqplib/callback_api');
var config = require('./../../../config/config')();
function publisher (){

}
/**
* Creates the connection to RabbitMQ and assigns a message handler that
* will publish the messages
*/
publisher.prototype.pushInQueue = function(data){
	amqp.connect('amqp://'+config.rabbitMq.connection.host+":"+config.rabbitMq.connection.port, function(err, conn) {
		conn.createChannel(function(err, ch) {
			var q = config.rabbitMq.queues[0].name;
			ch.assertQueue(q, {durable: true});
			ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
			console.log(" [x] Sent to queue"+q + "    "+ JSON.stringify(data));
		});
	});
}
module.exports = publisher;
