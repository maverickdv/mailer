var config = {
    local:{
        mode: 'dev',
        selfport: 8084,
        dbConn: {
            host:"127.0.0.1",
            host1:"127.0.0.1",
            port:"27017",
            userName:"",
            password:""
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
            userName:"m0ng0",
            password:"m0n3Ng"
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
    },
    test: {
        mode: 'test',
        selfport: 8084,
        dbConn: {
            host:"172.16.3.231",
            host1:"172.16.3.231",
            port:"27017",
            userName:"m0ng0",
            password:"m0n3Ng"
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
    staging: {
        mode: 'staging',
        selfport: 8084,
        dbConn: {
            host:"gulf1mongo.resdex.com",
            host1: "gulf2mongo.resdex.com",
            port:"27017",
            userName:"m0ng0",
            password:"m0n3Ng"
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
    production: {
        mode: 'production',
        selfport: 8084,
        dbConn: {
            host:"gulf1mongo.resdex.com",
            host1: "gulf2mongo.resdex.com",
            port:"27017",
            userName:"m0ng0",
            password:"m0n3Ng"
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
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
}
