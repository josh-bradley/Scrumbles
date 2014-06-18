var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var joinRoom = serverCalls.joinRoom;
var disconnectSocket = serverCalls.disconnectSocket;

describe('disconnect handler', function(){
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

    it('should remove user', function(){
        var tedsSocket = new fakes.SocketMock();

        joinRoom('test', 'ted', tedsSocket);

        disconnectSocket(tedsSocket);

        expect(tedsSocket.scrumbles.room.players.ted).toBe(undefined);
    });

    it('should emit player.leave', function(){
        var tedsSocket = new fakes.SocketMock();

        joinRoom('test', 'bob');
        joinRoom('test', 'ted', tedsSocket);
        var spy = sandbox.spy(fakes.broadcastToEmitFake,'emit');
        disconnectSocket(tedsSocket);

        expect(spy.calledWith('player.leave')).toBe(true);
    });

    it('should not emit player.leave if last player', function(){
        var tedsSocket = new fakes.SocketMock();
        joinRoom('test', 'ted', tedsSocket);

        var spy = sandbox.spy(fakes.broadcastToEmitFake,'emit');
        disconnectSocket(tedsSocket);

        expect(spy.calledWith('player.leave')).toBe(false);
    });

    it('should emit playerName', function(){
        var tedsSocket = new fakes.SocketMock();

        joinRoom('test', 'ted', tedsSocket);
        joinRoom('test', 'bob');

        var spy = sandbox.spy(fakes.broadcastToEmitFake,'emit');
        disconnectSocket(tedsSocket);

        expect(spy.getCall(0).args[1].playerName).toBe('ted');
    });

    it('should set new host when current host leaves', function(){
        var tedsSocket = new fakes.SocketMock();
        var bobsSocket = new fakes.SocketMock();

        joinRoom('test', 'ted', tedsSocket);
        joinRoom('test', 'bob', bobsSocket);

        disconnectSocket(tedsSocket);

        expect(bobsSocket.scrumbles.room.players.bob.isOwner).toBe(true);
    });

    it('should include new host name', function(){
        var tedsSocket = new fakes.SocketMock();
        joinRoom('test', 'ted', tedsSocket);
        joinRoom('test', 'bob');

        var spy = sandbox.spy(fakes.broadcastToEmitFake, 'emit');
        disconnectSocket(tedsSocket);

        expect(spy.getCall(0).args[1].newHostPlayerName).toBe('bob');
    });
});