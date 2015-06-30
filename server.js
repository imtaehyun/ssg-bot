var Hapi = require('hapi'),
    Parse = require('node-parse-api').Parse;

var db = new Parse({
    app_id: 'CRwSkDGmsmEr1vYdWkjj1s0jkQKUISTBWwu8WFN5',
    api_key: 'vpJD4yHcMwuWR8jP4evCtt6E6CyVyV8EXjBwFoVz'
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
                if (err) console.error('err: ' + err);
                else console.log(response);
            });
        }
        reply('ok');
    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
});