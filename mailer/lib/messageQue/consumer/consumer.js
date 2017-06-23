var amqp = require('amqplib/callback_api');
var config = require('./../../../config/config')();
var msgProcessor = require('./../../messageProcessor');
var processMessage = function(message) {
    message = JSON.parse(message.content);
    msgProcessor.process(message);
}
amqp.connect('amqp://' + config.rabbitMq.connection.host + ":" + config.rabbitMq.connection.port, function(err, conn) {
	if(err){
		console.log("Cannot connect to rabbitmq on " + config.rabbitMq.connection.host +" and port "+ config.rabbitMq.connection.port);
		throw err;
	}
    conn.createChannel(function(err, ch) {
	if(err){
		console.log("Cannot create channel in rabbitmq on " + config.rabbitMq.connection.host +" and port "+ config.rabbitMq.connection.port);
	}
        var q = config.rabbitMq.queues[0].name;
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.assertQueue(q, {
            durable: true
        });
        ch.consume(q, processMessage, {
            noAck: true
        });
    });
});
