var express        =        require("express");
var bodyParser     =        require("body-parser");
var amqp = require('amqplib/callback_api');
var app            =        express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/',function(request,response){
	var query1=request.body.data;
	var query2=request.body.data2;
	console.log(request.body);
	pushInQueue(request.body);
	response.end("yes");
});
app.listen(3000,function(){
	console.log("Started on PORT 3000");
})

function pushInQueue(data){
	amqp.connect('amqp://localhost', function(err, conn) {
		conn.createChannel(function(err, ch) {
			var q = 'queue1';
			ch.assertQueue(q, {durable: true});
			ch.sendToQueue(q, new Buffer(JSON.stringify(data)));

			console.log(" [x] Sent "+ JSON.stringify(data));
		});
	});
}
