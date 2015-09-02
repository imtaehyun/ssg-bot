var _ = require('underscore'),
    SSG = require('./ssg'),
    db = require('./database'),
    telegram = require('./telegram'),
    schedule = require('node-schedule'),
    logger = require('./config/logger'),
    moment = require('moment')
    ;
var self = this;
var updateId = null;

// updateId를 먼저 가져온 후 Bot 실행
db.findLastUpdateId().then(
    function(updateId) {
        logger.debug('updateId : %d', updateId);
        self.updateId = updateId;
    },
    function(err) {
        logger.error(err);
    }
);

/*
    Job - 카드 할인정보 수집
*/
var jobGetTodayCardPromotion = schedule.scheduleJob('10 0 * * *', funcGetTodayCardPromotion);


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
/*
    Job - Telegram 메시지 수신
*/
var jobBotGetNewUpdate = schedule.scheduleJob('*/10 * * * * *', function() {
    if (self.updateId == null) return false;

    telegram.getUpdates(self.updateId+1).then(
        function(update) {
            logger.info('[Job] 새 메시지 : ', update);

            // MessageLog Table 추가
            db.addMessageLog(update).then(
                function(updateId) {
                    self.updateId = updateId;
                }
            ).catch(
                function(err) {
                    logger.error('MessageLog add fail');
                }
            );

            switch (update.message.text) {
                case '/start':
                    db.findUser(update.message.from).then(
                        function(user) {
                            logger.debug('이미 등록된 유저 요청 : ', user);
                        },
                        function(msg) {
                            // 등록된 user가 없음

                            db.addUser(update.message.from)
                                .then(function(result) { logger.info('새로운 유저 등록 완료 : ', result); })
                                .catch(function(err) { logger.error('새로운 유저 등록 실패 : ', err); });
                        }
                    ).catch(function(err) {
                            logger.error('유저 조회 실패');
                        });
                    break;

                case '/admin':
                    funcGetTodayCardPromotion();
                    break;

                default:
                    break;
            }
        },
        function(err) {
            // 내용이 없으면 아무것도 하지않음
        }
    )
});

var jobMorningMessage = schedule.scheduleJob('* 30 7 * * *', sendMorningMessage);

var sendMorningMessage = function() {
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