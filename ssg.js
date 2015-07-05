var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment'),
    Xray = require('x-ray'),
    x = Xray(),
    Telegram = require('./telegram');


var SSG = {
    /**
     *
     * @returns {bluebird|exports|module.exports}
     */
    getTodayCardPromotion: function() {
        return new Promise(function(resolve, reject) {
            x('http://www.ssg.com', '#bnBlistarea .bn_blist li', [{
                link: 'a@href',
                promoName: 'img@alt',
                imgUrl: 'img@src'
            }])(function(err, cardPromoList) {
                if (err) {
                    reject(err);
                } else {
                    resolve(_.map(cardPromoList, function(cardPromo) {
                        cardPromo.promoDate = moment().format("YYYYMMDD");
                        cardPromo.cardName = cardPromo.promoName.substring(0, 4);
                        cardPromo.link = cardPromo.link.substring(0, cardPromo.link.indexOf('&tlid'));
                        cardPromo.message = '오늘은 ' + cardPromo.promoName + ' 행사일입니다. ' + cardPromo.link;

                        return cardPromo;
                    }));
                }
            });
        });
    }
};

module.exports = SSG;