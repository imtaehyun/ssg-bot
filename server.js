var Hapi = require('hapi'),
    Parse = require('node-parse-api').Parse;

var db = new Parse({
    app_id: process.env.PARSE_APP_ID,
    api_key: process.env.PARSE_API_KEY
});

var server = new Hapi.Server();
server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000
});

server.route({
    method: 'POST',
    path: '/bot/hook',
    handler: function(request, reply) {
        console.log(request.payload);
        var update = request.payload;
        if (update.message.text === '/start') {
            db.find('User', { username: update.message.from.id }, function(err, response) {
                if (err) {
                    console.error('err: ' + err);
                    reply('err');
                } else {
                    if (response.results.length == 0) {
                        db.insert('User', {
                            telegramId: update.message.from.id,
                            username: update.message.from.username,
                            firstName: update.message.from.first_name,
                            lastName: update.message.from.last_name
                        }, function(err, response) {
                            if (err) {
                                console.log('err insert user: ' + JSON.stringify(err));
                                reply('err insert user: ' + err);
                            } else {
                                console.log(response);
                                console.log('add user: ' + JSON.stringify(update.message.from));
                                reply('add user: ' + JSON.stringify(update.message.from));
                            }
                        });
                    } else {
                        reply('exist user');
                    }
                }
            });
        } else {
            reply('ok');
        }

    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
});