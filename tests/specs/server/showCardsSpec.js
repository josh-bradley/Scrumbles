var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var getShowCardsHandler = serverCalls.getShowCardsHandler;

describe('item.showCards', function(){
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

    it('should broadcast item.showCardsNow', function(){
        var socket = new fakes.SocketMock();
        var showCardsHandler = getShowCardsHandler(socket);
        var spy = sandbox.spy();
        sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns({emit: spy});

        socket.scrumbles.room.status = roomStatus.INGAME;
        showCardsHandler();

        expect(spy.calledWith('item.showCardsNow')).toBe(true);
    });

    it('should not broadcast item.showCardsNow for INIT status', function(){
        var socket = new fakes.SocketMock();
        var showCardsHandler = getShowCardsHandler(socket);
        var spy = sandbox.spy();
        sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns({emit: spy});

        socket.scrumbles.room.status = roomStatus.INIT;

        showCardsHandler();

        expect(spy.calledWith('item.showCardsNow')).toBe(false);
    });

    it('should not broadcast item.showCardsNow for REVIEW status', function(){
        var socket = new fakes.SocketMock();
        var showCardsHandler = getShowCardsHandler(socket);
        var spy = sandbox.spy();
        sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns({emit: spy});

        socket.scrumbles.room.status = roomStatus.REVIEW;

        showCardsHandler();

        expect(spy.calledWith('item.showCardsNow')).toBe(false);
    });
});
