describe('create room', function(){
    var sandbox;
    var helper = require('../../helpers/clientTestHelper');
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var roomService = require('../../../public/js/service/roomService');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        require('../../../public/js/socketManager').connect();
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'message');

        helper.createRoom(page);

        expect(spy.getCall(0).args[0]).toBe('Create Room...');
    });

    it('should call roomService.createRoom when valid', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        helper.createRoom(page);

        expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.playerName('Bob');

        page.createRoomRequest({}, {});

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.roomName('RoomONe');

        page.createRoomRequest({}, {});

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        helper.createRoom(page);

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'room1';
        helper.createRoom(page, expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });

    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'tim';
        helper.createRoom(page, 'test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should emit room.join with isCreate set to true', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        helper.createRoom(page);

        expect(spy.getCall(0).args[1].isCreateRequest).toBe(true);
    });

    it('should attach once room.joinConfirm', function(){
        var spy = sandbox.spy(socketMock, 'once');
        helper.createRoom(page);

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});