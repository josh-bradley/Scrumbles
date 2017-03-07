describe('join room', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var roomService = require('../../../public/js/service/roomService');
    var joinRoom = helpers.joinRoom;
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
       sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'message');

        joinRoom(page);

        expect(spy.getCall(0).args[0]).toBe('Joining Room...');
    });

    it('should call roomService.joinRoom when valid', function(){
       var spy = sandbox.spy(roomService, 'joinRoom');
       joinRoom(page);

       expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.joinRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'joinRoom');

        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.playerName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.joinRoom when playerName not supplied', function(){
        var spy = sandbox.spy(roomService, 'joinRoom');

        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.roomName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        joinRoom(page);

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'room1';
        joinRoom(page, expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });

    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'tim';
        joinRoom(page, 'test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should emit room.join with isCreate set to false', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        joinRoom(page);

        expect(spy.getCall(0).args[1].isCreateRequest).toBe(false);
    });

    it('should attach on room.joinConfirm', function(){
        var spy = sandbox.spy(socketMock, 'once');
        joinRoom(page);

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});