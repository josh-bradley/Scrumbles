var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var getCardSelectedHandler = serverCalls.getCardSelectedHandler;

describe('item.cardSelect', function(){
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


    it('should broadcast item.cardSelected when status INGAME', function(){
        var socket = new fakes.SocketMock();
        var handler = getCardSelectedHandler(socket);
        var emitSpy = sandbox.spy();
        socket.scrumbles.room.status = roomStatus.INGAME;
        sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns( {emit: emitSpy});

        handler({card: 8, roomName:'test', playerName: 'bob'});

        expect(emitSpy.calledWith('item.cardSelected')).toBe(true);
     });

     it('should not broadcast item.cardSelected when status is INIT', function(){
        var socket = new fakes.SocketMock();
        var handler = getCardSelectedHandler(socket);
        var emitSpy = sandbox.spy();
        var toSpy = sandbox.stub(socket.broadcast, 'to').returns( {emit: emitSpy});
        socket.scrumbles.room.roomStatus = roomStatus.INIT;

        handler({card: 8});

        expect(toSpy.calledWith('test')).toBe(false);
     });

     it('should not broadcast item.cardSelected when status is WAITING', function(){
         var socket = new fakes.SocketMock();
         var handler = getCardSelectedHandler(socket);
         var emitSpy = sandbox.spy();
         var toSpy = sandbox.stub(socket.broadcast, 'to').returns( {emit: emitSpy});
         socket.scrumbles.room.roomStatus = roomStatus.WAITING;

         handler({card: 8});

         expect(toSpy.calledWith('test')).toBe(false);
     });

     it('should not broadcast item.cardSelected when status is REVIEW', function(){
         var socket = new fakes.SocketMock();
         var handler = getCardSelectedHandler(socket);
         var emitSpy = sandbox.spy();
         var toSpy = sandbox.stub(socket.broadcast, 'to').returns( {emit: emitSpy});
         socket.scrumbles.room.roomStatus = roomStatus.REVIEW;

         handler({card: 8});

         expect(toSpy.calledWith('test')).toBe(false);
     });
});