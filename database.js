var Parse = require('node-parse-api').Parse;

var db = new Parse({
    app_id: process.env.PARSE_APP_ID || 'CRwSkDGmsmEr1vYdWkjj1s0jkQKUISTBWwu8WFN5',
    api_key: process.env.PARSE_API_KEY || 'vpJD4yHcMwuWR8jP4evCtt6E6CyVyV8EXjBwFoVz'
});

var DB = {

    saveCardPromo: function(cardPromo, fn) {
        db.insert('CardPromo', cardPromo, function(err, response) {
            if (err) {
                console.error(err);
                fn(err);
            }
            else {
                console.log(response);
                fn(null, response);
            }
        });
    }
};

module.exports = DB;