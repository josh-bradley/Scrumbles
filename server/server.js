var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var main = require('./main');
var ioManager = require('./io');

function start(publicDir, wellKnownDir, port){
    'use strict';
    var app = express();
    var server = http.createServer(app);
    var io = socket_io.listen(server);
    var port = port || process.env.port || 3001;

    server.listen(port, function () {
        console.log('Server listening at port ' + port);
    });

    // Routing
    app.use(express.static(publicDir));
    app.use('/.well-known', express.static(wellKnownDir));

    ioManager.init(io);
    main.init(io);
}

exports.start = start;