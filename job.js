var CronJob = require('cron').CronJob;

new CronJob('*/30 * * * * *', function() {
    console.log('test');
}, null, true, null, null);