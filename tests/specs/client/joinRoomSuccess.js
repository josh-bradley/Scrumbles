describe('join room', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
        sandbox.restore();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    it('should clear the loading message', function(){
        var spy = sandbox.spy(Scrumbles.page.loadMessageViewModel, 'clearMessage');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.callCount).toBe(1);
    });

    it('should add listener for player.new', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('player.new')).toBe(true);
    });

    it('should add listener for item.estimateStarted', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('item.estimateStarted')).toBe(true);
    });

    it('should add listener for item.cardSelected', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('item.cardSelected')).toBe(true);
    });

    it('should add listener for item.showCardsNow', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('item.showCardsNow')).toBe(true);
    });

    it('should add listener for item.finishReview', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('item.finishReview')).toBe(true);
    });

    it('should add listener for player.leave', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'on');

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{}});

        expect(spy.calledWith('player.leave')).toBe(true);
    });

    it('should set room name', function(){
        var expected = 'test';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ roomName: expected}});

        expect(Scrumbles.page.room.name()).toBe(expected);
    });

    it('should set player name', function(){
        var expected = 'test';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ }, playerName: expected});

        expect(Scrumbles.page.room.playerName()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ status:expected }});

        expect(Scrumbles.page.room.status()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ status:expected }});

        expect(Scrumbles.page.room.status()).toBe(expected);
    });

    it('should set isOwner', function(){
        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ }, wasCreate:true });

        expect(Scrumbles.page.room.isOwner()).toBe(true);
    });

    it('should set itemName', function(){
        var expected = 'test';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ itemName:expected }});

        expect(Scrumbles.page.room.itemName()).toBe(expected);
    });

    it('should set itemName', function(){
        var expected = 'ted';

        Scrumbles.helpers.joinRoomConfirmSuccess({room:{ players:{ted:{playerName:expected}}}});

        expect(Scrumbles.page.room.players().length).toBe(1);
        expect(Scrumbles.page.room.players()[0].playerName()).toBe(expected);
    });
});