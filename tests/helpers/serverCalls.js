var sinon = require('sinon');
var fakes = require('./serverFakes').mocks;
var sandbox = sinon.sandbox.create();
var getCallByArgs = require('./sinonExtentions').getCallByArgs;

function setSinonSandbox(s){
    sandbox = s;
}

function getShowCardsHandler(socket){
    socket = socket || new fakes.SocketMock();
    joinRoom('test', 'bob', socket);

    return getCallByArgs(socket.on, 'item.showCards');
}

function getStartItemHandler(socket){
    socket = socket || new fakes.SocketMock();
    joinRoom('test', 'bob', socket);

    return getCallByArgs(socket.on, 'item.startEstimate');
}

function getCardSelectedHandler(socket){
    socket = socket || new fakes.SocketMock();
    joinRoom('test', 'bob', socket);

    return getCallByArgs(socket.on, 'item.cardSelect');
}

function disconnectSocket(socket){
    socket.on.restore && socket.on.restore();
    var onSpy = sandbox.spy(socket, 'on');
    getConnectionHandler()(socket);

    onSpy.getCall(1).args[1]();

    socket.on.restore();
}

function joinRoom(roomName, playerName, socket){
    socket = socket || new fakes.SocketMock();
    socket.on.restore && socket.on.restore();
    var onSpy = sandbox.spy(socket, 'on');
    getConnectionHandler()(socket);

    var joinHandler = onSpy.getCall(0).args[1];

    joinHandler({name: roomName, playerName: playerName});
}

function getConnectionHandler(){
    var onSpy = sandbox.spy(fakes.ioObjectFake, 'on');

    var server = require('../../server/server');
    server.start();

    var temp = onSpy.getCall(0).args[1];
    fakes.ioObjectFake.on.restore();
    return temp;
}

exports.getConnectionHandler = getConnectionHandler;
exports.joinRoom = joinRoom;
exports.disconnectSocket = disconnectSocket;
exports.getShowCardsHandler = getShowCardsHandler;
exports.getStartItemHandler = getStartItemHandler;
exports.setSinonSandbox = setSinonSandbox;
exports.getCardSelectedHandler = getCardSelectedHandler;