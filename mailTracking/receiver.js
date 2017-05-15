var amqp = require('amqplib/callback_api');
var processMessage = function (message) {
	message = JSON.parse(message);
	console.log(message);
}
amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'queue1';
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
		ch.assertQueue(q, {durable: true});
		ch.consume(q, processMessage(msg.content),{noAck: true});
	});
});
