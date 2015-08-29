/**
 * Created by nezz on 15. 8. 29..
 */
var winston = require('winston'),
    moment = require('moment');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug',
            colorize: true,
            timestamp: function() {
                return moment().format();
            }
        }),
        new (winston.transports.DailyRotateFile)({
            level: 'debug',
            filename: 'log'
        })
    ]
});

module.exports = logger;
