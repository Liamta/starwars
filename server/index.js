var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path = require('path');

app.use('/', express.static(__dirname + '/../public'));

server.listen(3003, function() {
    console.log('listening on localhost:3003');
});

io.on('connection', function(client) {

    console.log('Client connected...');

    client.emit('messages', 'Hello from server!');

});

var Stage = require('../src/scripts/components/Stage');

var stage = new Stage(800, 600);
