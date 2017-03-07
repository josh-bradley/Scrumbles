describe('join room success', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should clear the loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'clearMessage');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.callCount).toBe(1);
    });

    it('should add listener for player.new', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('player.new')).toBe(true);
    });

    it('should add listener for item.estimateStarted', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.estimateStarted')).toBe(true);
    });

    it('should add listener for item.cardSelected', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.cardSelected')).toBe(true);
    });

    it('should add listener for item.showCardsNow', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.showCardsNow')).toBe(true);
    });

    it('should add listener for item.finishReview', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.finishReview')).toBe(true);
    });

    it('should add listener for player.leave', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('player.leave')).toBe(true);
    });

    it('should set room name', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ roomName: expected}});

        expect(page.room.name()).toBe(expected);
    });

    it('should set player name', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ }, playerName: expected});

        expect(page.room.playerName()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ status:expected }});

        expect(page.room.status()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ status:expected }});

        expect(page.room.status()).toBe(expected);
    });

    it('should set isOwner', function(){
        helpers.joinRoomConfirmSuccess(page, {room:{ }, wasCreate:true });

        expect(page.room.isOwner()).toBe(true);
    });

    it('should set itemName', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ itemName:expected }});

        expect(page.room.itemName()).toBe(expected);
    });

    it('should set itemName', function(){
        var expected = 'ted';

        helpers.joinRoomConfirmSuccess(page, {room:{ players:{ted:{playerName:expected}}}});

        expect(page.room.players().length).toBe(1);
        expect(page.room.players()[0].playerName()).toBe(expected);
    });
});