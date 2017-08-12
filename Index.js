'use strict'
var scrumblesServer = require('./server/server')

console.log(process.argv[2]);
scrumblesServer.start(__dirname + '/public', __dirname + '/.well-known', process.argv[2]);