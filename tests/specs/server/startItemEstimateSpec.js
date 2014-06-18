var sinon = require('sinon');
var fakes = require('../../../tests/helpers/serverFakes').mocks;
var serverCalls = require('../../../tests/helpers/serverCalls');
var testBase = require('./testBase');

var getStartItemHandler = serverCalls.getStartItemHandler;

describe('item.startEstimate', function(){
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

    it('should broadcast new item name to room', function(){
        var startItemHandler = getStartItemHandler();
        var spy = sandbox.spy();
        sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns({emit: spy});
        var expected = { itemName: 'stuff' };
        startItemHandler(expected);

        expect(spy.calledWith('item.estimateStarted')).toBe(true);
    });

    /*it('should set current task name', function(){
     var startItemHandler = getStartItemHandler();

     startItemHandler({itemName: 'stuff'});

     expect(rooms.joinRoom('test', 'pie').itemName).toBe('stuff');
     });*/
});
