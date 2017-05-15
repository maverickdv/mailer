var amqp = require('amqplib/callback_api');
var config = require('./../config/mq');

var processMessage = function(message) {
    message = JSON.parse(message.content);
	var d = require('./../mongo/mongooseinsert');
    var dbIn =  new d();
    dbIn.insert(message);
}

amqp.connect('amqp://' + config.connection.host + ":" + config.connection.port, function(err, conn) {
    conn.createChannel(function(err, ch) {
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
