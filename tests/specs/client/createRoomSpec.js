describe('create room', function(){
    var sandbox;
    var createRoom = Scrumbles.helpers.createRoom;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();

    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(Scrumbles.page.loadMessageViewModel, 'message');

        createRoom();

        expect(spy.getCall(0).args[0]).toBe('Create Room...');
    });

    it('should call roomService.createRoom when valid', function(){
        var spy = sandbox.spy(Scrumbles.Service.roomService, 'createRoom');
        createRoom();

        expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(Scrumbles.Service.roomService, 'createRoom');
        var page = new Scrumbles.page.constructor();
        page.joinRoomViewModel.playerName('Bob');

        page.createRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(Scrumbles.Service.roomService, 'createRoom');
        var page = new Scrumbles.page.constructor();
        page.joinRoomViewModel.roomName('RoomONe');

        page.createRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        createRoom();

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        var expected = 'room1';
        createRoom(expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });

    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        var expected = 'tim';
        createRoom('test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should emit room.join with isCreate set to true', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        createRoom();

        expect(spy.getCall(0).args[1].isCreateRequest).toBe(true);
    });

    it('should attach on room.joinConfirm', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');
        createRoom();

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});