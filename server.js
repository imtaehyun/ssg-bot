var Hapi = require('hapi');

var host = process.env.HOST || '0.0.0.0',
    port = process.env.PORT || 3000;
var server = new Hapi.Server();
server.connection({
    host: host,
    port: port
});

server.route({
    method: 'POST',
    path: '/bot/hook',
    handler: function(request, reply) {
        console.log(request.payload);
    }
});

server.start(function() {
    console.log('Server running at: ', server.info.uri);
});