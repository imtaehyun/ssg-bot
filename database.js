var Promise = require('bluebird'),
    _ = require('underscore'),
    Parse = require('node-parse-api').Parse;

var db = new Parse({
    app_id: process.env.PARSE_APP_ID,
    api_key: process.env.PARSE_API_KEY
});

var DB = {

    saveCardPromo: function(cardPromo) {
        return new Promise(function(resolve, reject) {
            db.insert('CardPromo', cardPromo, function(err, response) {
                if (err) reject(err);
                else resolve(response);
            });
        });
    },

    saveCardPromoList: function(cardPromoList) {
        return new Promise(function(resolve, reject) {
            var batchRequests = _.map(cardPromoList, function(cardPromo) {
                return {
                    method: 'POST',
                    path: '/1/classes/CardPromo',
                    body: cardPromo
                };
            });
            db.batch(batchRequests, function(err, response) {
                if (err) reject(err);
                else resolve(response);
            });
        });
    },

    getCardPromoList: function(date) {
        return new Promise(function(resolve, reject) {
            db.find('CardPromo', { where: { promoDate: date } }, function(err, response) {
                if (err) throw new Error('Parse CardPromo class find err: ' + JSON.stringify(err));

                resolve(response.results);
            });
        });
    },

    addUser: function(user) {
        return new Promise(function(resolve, reject) {
            db.insert('User', {
                telegramId: user.id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name
            }, function(err, response) {
                if (err) throw new Error('Parse User class insert err: ' + JSON.stringify(err));

                resolve(response);
            });
        });
    },

    findUser: function(user) {
        return new Promise(function(resolve, reject) {
            db.find('User', { where: { telegramId: user.id } }, function(err, response) {
                if (err) throw new Error('Parse User class find err: ' + JSON.stringify(err));

                if (response.results.length == 1) {
                    resolve(response.results[0]);
                } else if (response.results.length == 0) {
                    reject('no user');
                } else {
                    throw new Error('more than 1 user');
                }
            });
        });
    },

    getAllUser: function() {
        return new Promise(function(resolve, reject) {
            db.find('User', {}, function(err, response) {
                if (err) throw new Error('Parse User class get all user err: ' + JSON.stringify(err));

                resolve(response.results);
            });
        });
    },

    findLastUpdateId: function() {
        return new Promise(function(resolve, reject) {
            db.find('MessageLog', { order: '-createdAt', limit: 1 }, function(err, response) {
                if (err) throw new Error('Parse MessageLog class find err: ' + JSON.stringify(err));

                if (response.results.length == 1) {
                    var lastUpdateId = response.results[0].update_id;
                    resolve(lastUpdateId);
                } else {
                    reject('no update id');
                }
            });
        });
    },

    addMessageLog: function(result) {
        return new Promise(function(resolve, reject) {
            db.insert('MessageLog', {
                update_id: result.update_id,
                message: result.message
            }, function(err, response) {
                if (err) throw new Error('Parse MessageLog class insert err: ' + JSON.stringify(err));
                resolve(result.update_id);
            });
        })
    }
};

module.exports = DB;