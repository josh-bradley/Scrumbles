var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var getConnectionHandler = serverCalls.getConnectionHandler;
var joinRoom = serverCalls.joinRoom;
var disconnectSocket = serverCalls.disconnectSocket;
var getStartItemHandler = serverCalls.getStartItemHandler;

describe('server', function(){
    var underTest = '../../../server/server';
    var sandbox;
    var rooms, roomStatus;

    beforeEach(function(){
        testBase.beforeEach(underTest);
        sandbox = sinon.sandbox.create();
        serverCalls.setSinonSandbox(sandbox);
        rooms = require('../../../server/rooms');
        roomStatus = require('../../../server/roomStatus').roomStatus;
    });

    afterEach(function(){
        sandbox.restore();
        testBase.afterEach();
    });

    it('should create method to listen for socket connect.', function(){
        var onSpy = sandbox.spy(fakes.ioObjectFake, 'on');
        var server = require(underTest);
        server.start();

        expect(onSpy.calledWith('connection')).toBe(true);
    });

    describe('connection', function(){
        it('should attach disconnect listener to socket', function(){
            var connectionHandler = getConnectionHandler();
            var onSpy = sandbox.spy();

            connectionHandler({ on: onSpy });

            expect(onSpy.calledWith('disconnect', sinon.match.func)).toBe(true);
        });

        it('should attach room.join listener to socket', function(){
            var connectionHandler = getConnectionHandler();
            var onSpy = sandbox.spy();

            connectionHandler({ on: onSpy });

            expect(onSpy.calledWith('room.join', sinon.match.func)).toBe(true);
        });
    });
});