module.exports = {
  cookies: {
    mnjAuthToken: "AT",
    mnjConToken: "NIMNJ[CON]",
    lastActive: "NIMNJ[TM]",
    authsource: "NIMNJ[AUTHSOURCE]"
  },
  logging: {
    winston: {
      file_error: {
        name: 'error-file',
        filename: '/apps/NaukriGulf/ngLogs/notificationservice/error-logs.log',
        level: 'error',
        maxsize: 5242880, //5MB
        maxFiles: 10,
        colorize: false,
        humanReadableUnhandledException: true,
        tailable: true,
        logstash: true
      },
      file_info: {
        name: 'info-file',
        filename: '/apps/NaukriGulf/ngLogs/notificationservice/info-logs.log',
        level: 'info',
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false,
        humanReadableUnhandledException: true,
        tailable: true,
        logstash: true
      },
      file_accesslogs: {
        name: 'silly-file',
        filename: '/apps/NaukriGulf/ngLogs/notificationservice/notificationservice-access.log',
        level: 'silly',
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false,
        humanReadableUnhandledException: true,
        tailable: true,
        logstash: true
      },
      console_debug: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        humanReadableUnhandledException: true
      }
    }
  }
}
