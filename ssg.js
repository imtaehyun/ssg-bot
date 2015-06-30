var _ = require('underscore'),
    Xray = require('x-ray'),
    x = Xray();

x('http://www.ssg.com', '#bnBlistarea .bn_blist li', [{
    link: 'a@href',
    name: 'img@alt',
    imgUrl: 'img@src'
}])(function(err, cardList) {
    if (err) console.error(err);
    console.log(cardList);
});