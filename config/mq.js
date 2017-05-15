module.exports = {
    "connection": {
        // credentials to connecto to rabbitMQ server.
        "login": "",
        "password": "",
        "host": "localhost",
        "port":"5672",
        // if you have virtual hosts configured this is that option
        "vhost": ""
    },
    // exchanges that we shall be talking to and their type.
    "exchanges": [
        {
            "name": "mailPublisher",
            "type": "direct"
        }
    ],
    "queues": [
        {
            "name": "mailerSent"
        }
    ],
    // here we bind the exchanges and queues.
    "bindings": [
        {
            "exchange": "mailPublisher",
            "target": "mailerSent"
        }
    ]
};
