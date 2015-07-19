require('newrelic');
var Hapi = require('hapi'),
    db = require('./database'),
    job = require('./job');

var server = new Hapi.Server();
server.connection({
    host: process.env.HOST || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000
});
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.redirect('https://telegram.me/ssg_bot');
    }
});

server.route({
    method: 'GET',
    path: '/bot/ping',
    handler: function(request, reply) {
        reply('ok');
    }
});

server.route({
    method: 'POST',
    path: '/bot/hook',
    handler: function(request, reply) {
        console.log(request.payload);
        var update = request.payload;

        switch (update.message.text) {
            case '/start':
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
                break;

            case '/admin':
                job.saveTodayCardPromotion();
                reply('ok');
                break;

            default:
                reply('ok');
                break;
        }
    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
    job.start();
});