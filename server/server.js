var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var port = process.env.PORT || 3001;
var main = require('./main');

function start(publicDir){
    'use strict';
    var app = express();
    var server = http.createServer(app);
    var io = socket_io.listen(server);

    server.listen(8080, function () {
        console.log('Server listening at port %d', 8080);
    });

    // Routing
    app.use(express.static(publicDir));

    main.init(io);
}

exports.start = start;