var _ = require('underscore'),
    SSG = require('./ssg'),
    db = require('./database'),
    telegram = require('./telegram'),
    schedule = require('node-schedule'),
    logger = require('./config/logger'),
    moment = require('moment')
    ;

// Job1 - 카드 할인정보 수집 (오전 00시 10분)
var jobGetTodayCardPromotion = schedule.scheduleJob('26 0 * * *', funcGetTodayCardPromotion);
// Job2 - 오전 할인정보 안내 메시지 발송 (오전 08시 30분)
var jobMorningMessage = schedule.scheduleJob('* 30 8 * * *', funcSendMorningMessage);

var funcGetTodayCardPromotion = function() {
    logger.info('[Job] 카드할인정보 수집 시작');

    SSG.getTodayCardPromotion().then(
        function(cardPromoList) {
            db.saveCardPromoList(cardPromoList).then(
                function(result) {
                    logger.info('[Job] 카드할인정보 수집 완료 : ', result);
                    var message = '[Job] 카드할인정보 수집 완료 : '+ JSON.stringify(result);
                    telegram.sendMessage(null, message);
                },
                function(err) {
                    logger.error('[Job] 카드할인정보 수집 실패 : ', err);
                }
            );
        },
        function(err) {
            logger.error('[Job] 카드할인정보 수집 실패 : ', err);
        }
    );
};

var funcSendMorningMessage = function() {
    logger.info('[Job] Send Morning Message');
    var todayDate = moment().format('YYYYMMDD');

    // 오늘 프로모션정보를 가져온다
    db.getCardPromoList(todayDate).then(function(cardPromos) {
        var cardPromoStr = _.map(cardPromos, function(cardPromo) { return cardPromo.cardName; }).join(', ');
        var message = '오늘 SSG에서 ' + cardPromoStr + '로 쇼핑하면 할인혜택이 있어요. (http://www.ssg.com)\n\n';
        message += '프로모션 상세정보\n';
        message += _.map(cardPromos, function(cardPromo) { return '* ' + cardPromo.promoName; }).join('\n');
        logger.debug(message);

        // User 모두에게 메시지 발송
        db.getAllUser().then(function(users) {
            _.each(users, function(user) { telegram.sendMessage(user.telegramId, message); });
            logger.info(users.length + '명에게 발송완료');
        }).catch(function(err) {
            logger.error(err);
        });
    });
};