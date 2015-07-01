var _ = require('underscore'),
    Xray = require('x-ray'),
    x = Xray(),
    Telegram = require('./telegram');

var SSG = {
    getTodayCardPromoInfo: function(fn) {
        var self = this;
        x('http://www.ssg.com', '#bnBlistarea .bn_blist li', [{
            link: 'a@href',
            name: 'img@alt',
            imgUrl: 'img@src'
        }])(function(err, cardPromoList) {
            if (err)
                fn(err);
            else
                console.log(cardPromoList);
                fn(null, self.attachMessage(cardPromoList));
        });
    },
    attachMessage: function(cardPromoList) {

        return _.map(cardPromoList, function(cardPromo) {
            cardPromo.link = cardPromo.link.substring(0, cardPromo.link.indexOf('&tlid'));
            cardPromo.message = '오늘은 ' + cardPromo.name + ' 행사일입니다. ' + cardPromo.link;

            return cardPromo;
        });

    }
};
/*
SSG.getTodayCardPromoInfo(function(err, cardPromoList) {
    _.each(cardPromoList, function(cardPromo) {
        Telegram.sendMessage(49397784, cardPromo.message);
    });
});
*/
module.exports = SSG;