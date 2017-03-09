var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var port = process.env.PORT || 3001;
var main = require('./main');
var ioManager = require('./io');

function start(publicDir){
    'use strict';
    var app = express();
    var server = http.createServer(app);
    var io = socket_io.listen(server);

    server.listen(port, function () {
        console.log('Server listening at port ' + server.address().port);
    });

    // Routing
    app.use(express.static(publicDir));

    ioManager.init(io);
    main.init(io);
}

exports.start = start;