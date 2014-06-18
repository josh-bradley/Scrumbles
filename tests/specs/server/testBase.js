var mockery = require('mockery');
var fakes = require('../../../tests/helpers/serverFakes').mocks;

function beforeEach(underTest){
    mockery.enable({ useCleanCache: true});
    mockery.registerAllowable(underTest);
    mockery.registerAllowable('../../../server/roomStatus');
    mockery.registerAllowable('../../server/server');
    mockery.registerAllowable('./roomStatus');
    mockery.registerAllowable('./rooms');
    mockery.registerAllowable('./room');
    mockery.registerAllowable('./player');
    mockery.registerAllowable('./io');
    mockery.registerAllowable('./game');
    mockery.registerAllowable('underscore');
    mockery.registerAllowable('./main');
    mockery.registerAllowable('../../../server/rooms');
    mockery.registerMock('express', fakes.expressFake);
    mockery.registerMock('http', fakes.httpFake);
    mockery.registerMock('socket.io', fakes.socketio_fake);
}

function afterEach(){
    mockery.disable();
    mockery.deregisterAll();
}

exports.beforeEach = beforeEach;
exports.afterEach = afterEach;