require('newrelic');
var Hapi = require('hapi'),
    db = require('./database'),
    job = require('./job');

var server = new Hapi.Server();
server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000
});
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.redirect('https://telegram.me/ssg_bot');
    }
});

server.route({
    method: 'POST',
    path: '/bot/hook',
    handler: function(request, reply) {
        console.log(request.payload);
        var update = request.payload;

        if (update.message.text === '/start') {
            db.findUser(update.message.from)
                .then(
                    function(user) {
                        reply(user);
                    },
                    function(msg) {
                        // 등록된 user가 없음
                        console.log(msg);

                        db.addUser(update.message.from)
                            .then(function(result) { reply(result); })
                            .catch(function(err) { reply(err); });
                    }
                ).catch(function(err) {
                    reply(err);
                });
        } else {
            reply('ok');
        }

    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
    job.start();
});