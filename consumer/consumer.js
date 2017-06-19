var amqp = require('amqplib/callback_api');
var config = require('./../config/mq');

var processMessage = function(message) {
    message = JSON.parse(message.content);
	var d = require('./../mongo/mongooseQueries');
    var dbIn =  new d();
    dbIn.doQuery(message);
}

amqp.connect('amqp://' + config.connection.host + ":" + config.connection.port, function(err, conn) {
	if(err){
		console.log("Cannot connect to rabbitmq on " + config.connection.host +" and port "+ config.connection.port);
		throw err;
	}
    conn.createChannel(function(err, ch) {
	if(err){
		console.log("Cannot create channel in rabbitmq on " + config.connection.host +" and port "+ config.connection.port);
	}
        var q = config.queues[0].name;
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.assertQueue(q, {
            durable: true
        });
        ch.consume(q, processMessage, {
            noAck: true
        });
    });
});
