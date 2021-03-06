var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment'),
    Xray = require('x-ray'),
    x = Xray();


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

                        return cardPromo;
                    }));
                }
            });
        });
    }
};

module.exports = SSG;