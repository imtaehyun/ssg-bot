var _ = require('underscore'),
    moment = require('moment'),
    CronJob = require('cron').CronJob,
    SSG = require('./ssg'),
    db = require('./database'),
    telegram = require('./telegram')
    ;

var Job = {
    start: function() {
        new CronJob({
            cronTime: '00 10 00 * * *',
            onTick: function() {
                this.saveTodayCardPromotion();
            },
            start: false,
            timeZone: 'Asia/Seoul'
        }).start();
    },

    saveTodayCardPromotion: function() {
        var self = this;
        SSG.getTodayCardPromotion().then(
            function(cardPromoList) {
                db.saveCardPromoList(cardPromoList)
                    .then(
                        function(result) {
                            console.log(result);
                            self.sendJobResultMessage('saveTodayCardPromotion', true, result);
                        },
                        function(err) {
                            console.error(err);
                            self.sendJobResultMessage('saveTodayCardPromotion', true, err);
                        }
                    );
            },
            function(err) {
                console.error(err);
            }
        );
    },

    sendCardPromoMessageJob: function() {

    },

    sendJobResultMessage: function(jobName, isSucess, result) {
        var message = 'Job:' + jobName + ' ' + (isSucess ? 'succeed' : 'failed') + ' at ' + moment().format() + '. ' + JSON.stringify(result);
        telegram.sendMessage(null, message);
    }
};

module.exports = Job;

