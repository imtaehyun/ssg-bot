/**
 * Created by nezz on 15. 8. 29..
 */
var winston = require('winston'),
    moment = require('moment');
require('winston-papertrail');

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
            logFormat: function(level, message) {
                return moment().format() + ' [' + level + '] ' + message;
            }
        }),
        new (winston.transports.Papertrail)({
            host: 'logs2.papertrailapp.com',
            port: 39801,
            level: 'debug',
            program: 'ssgbot',
            colorize: true,
            inlineMeta: true,
            logFormat: function(level, message) {
                return moment().format() + ' [' + level + '] ' + message;
            }
        })
    ]
});

module.exports = logger;
