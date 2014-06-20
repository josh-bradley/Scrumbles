describe('join room', function(){
    var sandbox;
    var joinRoom = Scrumbles.helpers.joinRoom;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
       sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(Scrumbles.page.loadMessageViewModel, 'message');

        joinRoom();

        expect(spy.calledWith('Joining Room...')).toBe(true);
    });

    it('should call roomService.joinRoom when valid', function(){
       var spy = sandbox.spy(Scrumbles.Service.roomService, 'joinRoom');
       joinRoom();

       expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.joinRoom when room name not supplied', function(){
        var spy = sandbox.spy(Scrumbles.Service.roomService, 'joinRoom');

        var page = new Scrumbles.page.constructor();
        page.joinRoomViewModel.playerName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.joinRoom when playerName not supplied', function(){
        var spy = sandbox.spy(Scrumbles.Service.roomService, 'joinRoom');

        var page = new Scrumbles.page.constructor();
        page.joinRoomViewModel.roomName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        joinRoom();

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        var expected = 'room1';
        joinRoom(expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });


    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');
        var expected = 'tim';
        joinRoom('test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should attach on room.joinConfirm', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');
        joinRoom();

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});