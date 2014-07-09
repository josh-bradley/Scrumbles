var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var joinRoom = serverCalls.joinRoom;

describe('join room', function(){
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

    it('should join socket room', function(){
        var socketMock = new fakes.SocketMock();
        var joinSpy = sandbox.stub(socketMock, 'join');

        joinRoom('test', 'bob', socketMock);

        expect(joinSpy.getCall(0).args[0]).toBe('test');
    });

    it('should set player and room info to socket', function(){
        var socketMock = new fakes.SocketMock();
        sandbox.spy(socketMock, 'join');

        joinRoom('test', 'bob', socketMock);

        expect(socketMock.scrumbles.playerName).toBe('bob');
        expect(socketMock.scrumbles.room.roomName).toBe('test');
    });

    it('should broadcast new user details to room', function(){
        var emitSpy = sandbox.spy();
        var socketMock = new fakes.SocketMock();
        var toSpy = sandbox.stub(socketMock.broadcast, 'to').returns( {emit: emitSpy});

        joinRoom('test', 'bob', socketMock);

        expect(toSpy.calledWith('test')).toBe(true);
        expect(emitSpy.calledWith('player.new')).toBe(true);
        expect(emitSpy.getCall(0).args[1].playerName).toBe('bob');
    });

    it('should not broadcast new user details to room when player is duplicate', function(){
        var emitSpy = sandbox.spy();
        var socketMock = new fakes.SocketMock();

        joinRoom('test', 'bob', socketMock);

        var toSpy = sandbox.stub(socketMock.broadcast, 'to').returns( {emit: emitSpy});

        joinRoom('test', 'bob');

        expect(toSpy.calledWith('test')).toBe(false);
        expect(emitSpy.calledWith('player.new')).toBe(false);
    });

    it('should emit room.joinConfirm to user', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'bob', socketMock);

        expect(emitSpy.calledWith('room.joinConfirm', sinon.match.object)).toBe(true);
    });

    it('should emit room.joinConfirm to user with error message when user already exists', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'henry');
        joinRoom('test', 'henry', socketMock);

        expect(emitSpy.lastCall.args[1].errorField).toBe("playerName");
    });

    it('should emit room.joinConfirm to user with error message when user already exists', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'henry');
        joinRoom('test', 'henry', socketMock);

        expect(emitSpy.lastCall.args[1].errorMessage).toBe("Player name in use.");
    });

    it('should pass list of players', function(){
        joinRoom('test', 'henry');

        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'bob', socketMock);

        expect(emitSpy.getCall(0).args[1].room.players.henry.playerName).toBe('henry');
        expect(emitSpy.getCall(0).args[1].room.players.bob.playerName).toBe('bob');
    });

    it('should return wasCreate = true if room did not exist', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'bob', socketMock);

        expect(emitSpy.getCall(0).args[1].wasCreate).toBe(true);
    });

    it('should return wasCreate = false if room existed', function(){
        joinRoom('test', 'bob');

        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'ted', socketMock);

        expect(emitSpy.getCall(0).args[1].wasCreate).toBe(false);
    });

    it('should not attach listener to item.startEstimate on join', function(){
        joinRoom('test', 'bob');

        var socketMock = new fakes.SocketMock();
        joinRoom('test', 'ted', socketMock);

        expect(socketMock.on.calledWith('item.startEstimate')).toBe(false);
    });

    it('should not attach listener to item.showCards on join', function(){
        var socketMock = new fakes.SocketMock();
        joinRoom('test', 'ted');
        joinRoom('test', 'bob', socketMock);

        expect(socketMock.on.calledWith('item.showCards')).toBe(false);
    });

    it('should attach listener to item.startEstimate on create', function(){
        var socketMock = new fakes.SocketMock();
        joinRoom('test', 'bob', socketMock);

        expect(socketMock.on.calledWith('item.startEstimate')).toBe(true);
    });

    it('should return attach listener to item.showCards on create', function(){
        var socketMock = new fakes.SocketMock();
        joinRoom('test', 'bob', socketMock);

        expect(socketMock.on.calledWith('item.showCards')).toBe(true);
    });

    it('should add listener for item.cardSelect', function(){
        var socketMock = new fakes.SocketMock();
        joinRoom('test', 'bob', socketMock);

        expect(socketMock.on.calledWith('item.cardSelect', sinon.match.func)).toBe(true);
    });

    it('should emit room.joinConfirm to user with error message when user already exists', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'henry');
        joinRoom('test', 'tom', socketMock, true);

        expect(emitSpy.lastCall.args[1].errorField).toBe("roomName");
    });

    it('should emit room.joinConfirm to user with error message when user already exists', function(){
        var socketMock = new fakes.SocketMock();
        var emitSpy = sandbox.spy(socketMock, 'emit');

        joinRoom('test', 'henry');
        joinRoom('test', 'tom', socketMock, true);

        expect(emitSpy.lastCall.args[1].errorMessage).toBe("Room already exists.");
    });
});