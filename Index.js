'use strict'
var scrumblesServer = require('./server/server')

scrumblesServer.start(__dirname + '/public', __dirname + '/.well-known');