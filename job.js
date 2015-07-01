var _ = require('underscore'),
    CronJob = require('cron').CronJob,
    SSG = require('./ssg')
    db = require('./database')
    ;

var Job = {
    start: function() {
        this.getTodayCardPromo().start();
    },

    getTodayCardPromo: function() {
        return new CronJob({
            cronTime: '00 53 00 * * *',
            onTick: function() {

                console.log('[JOB] getTodayCardPromo starts');
                SSG.getTodayCardPromoInfo(function (err, cardPromoList) {
                    console.log(cardPromoList);
                    _.each(cardPromoList, function (cardPromo) {
                        db.saveCardPromo(cardPromo, function(err, response) {
                            if (err) console.error('err: ' + JSON.stringify(err));
                            else console.log('response: ' + JSON.string(response));
                        });
                    });
                });
            },
            start: false,
            timeZone: 'Asia/Seoul'
        });
    },

    sendCardPromoMessageJob: function() {

    },

    test: function() {
        SSG.getTodayCardPromoInfo(function (err, cardPromoList) {
                _.each(cardPromoList, function (cardPromo) {
                db.saveCardPromo(cardPromo, function(err, response) {
                    if (err) console.error('err: ' + JSON.stringify(err));
                    else console.log('response: ' + JSON.string(response));
                });
            });
        });
    }
};

//new CronJob('00 00 7-17 * * *', function() {
//}, null, true, null, null);
Job.test();

module.exports = Job;

