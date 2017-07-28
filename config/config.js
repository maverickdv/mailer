var config = {
    local:{
        mode: 'dev',
        selfport: 8084,
        dbConn: {
            host:"127.0.0.1",
            host1:"127.0.0.1",
            port:"27017",
	    port1:"27017",
            userName:"mailerTracker",
            password:"mailerTracker"
        },
        rabbitMq: {
            connection: {
                userName: "",
                password: "",
                host: "localhost",
                port:"5672",
                vhost: ""
            },
            exchanges: [
                {
                    name: "mailPublisher",
                    type: "direct"
                }
            ],
            queues: [
                {
                    name: "mailerSent"
                }
            ],
            bindings: [
                {
                    exchange: "mailPublisher",
                    target: "mailerSent"
                }
            ]
        }
    },
    dev: {
        mode: 'dev',
        selfport: 8084,
        dbConn: {
            host:"127.0.0.1",
            host1:"127.0.0.1",
            port:"27017",
            port1:"27017",
            userName:"mailerTracker",
            password:"mailerTracker"
        },
        rabbitMq: {
            connection: {
                userName: "",
                password: "",
                host: "172.16.3.159",
                port:"5672",
                vhost: ""
            },
            exchanges: [
                {
                    name: "mailPublisher",
                    type: "direct"
                }
            ],
            queues: [
                {
                    name: "mailerSent"
                }
            ],
            bindings: [
                {
                    exchange: "mailPublisher",
                    target: "mailerSent"
                }
            ]
        }
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
}
