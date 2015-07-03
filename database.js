var Parse = require('node-parse-api').Parse,
    Config = require('config');

var db = new Parse({
    app_id: process.env.PARSE_APP_ID || Config.get('PARSE_APP_ID'),
    api_key: process.env.PARSE_API_KEY || Config.get('PARSE_API_KEY')
});

var DB = {

    saveCardPromo: function(cardPromo, fn) {
        db.insert('CardPromo', cardPromo, function(err, response) {
            if (err) {
                fn(err);
            } else {
                fn(null, response);
            }
        });
    }
};

module.exports = DB;