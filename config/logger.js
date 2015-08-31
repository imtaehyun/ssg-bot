/**
 * Created by nezz on 15. 8. 29..
 */
var winston = require('winston'),
    moment = require('moment');
require('winston-loggly');

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
            filename: 'log',
            colorize: true,
            timestamp: function() {
                return moment().format();
            }
        }),
        new (winston.transports.Loggly)({
            token: 'a7772fac-1336-46dc-92fa-c12ef4b546e6',
            subdomain: 'nezz',
            tags: ['Winston-NodeJS'],
            json:true
        })
    ]
});

module.exports = logger;
