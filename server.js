//require('newrelic');
var Hapi = require('hapi'),
    db = require('./database'),
    logger = require('./config/logger')
    ;

var server = new Hapi.Server();

server.connection({
    host: process.env.IP,
    port: process.env.PORT || 8080
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
        var update = request.payload;

        logger.info('새 메시지 : ', update);

        switch (update.message.text) {
            case '/start':
                db.findUser(update.message.from).then(
                    function(user) {
                        logger.debug('이미 등록된 유저 요청 : ', user);
                    },
                    function(msg) {
                        // 등록된 user가 없음

                        db.addUser(update.message.from)
                            .then(function(result) { logger.info('새로운 유저 등록 완료 : ', result); })
                            .catch(function(err) { logger.error('새로운 유저 등록 실패 : ', err); });
                    }
                ).catch(function(err) {
                    logger.error('유저 조회 실패');
                });
                break;

            default:
                break;
        }

        reply('got message');
    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
});