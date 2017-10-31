describe('item.finishReview', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageStatus = require('../../../public/js/pageStatus');
    var pageConstructor = require('../../../public/js/page');
    var page;
    var _ = require('underscore');

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room.status to WAITING', function(){
        helpers.itemFinishReviewHandler(page);

        expect(page.room.status()).toBe(pageStatus.WAITING);
    });

    it('should clear room.itemName', function(){
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        expect(page.room.itemName()).toBe('');
    });

    it('should set room.itemName.isModified() to false', function(){
        var spy = sandbox.spy(page.room.itemName, 'isModified');
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        expect(spy.calledWith(false)).toBe(true);
    });

    it('should clear all players cards', function(){
        page.room.players.add({playerName:'ted', card:'8'});
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        var anyPlayersWithCardValue = _.some(page.room.players(), function(player){
            return player.card();
        });
        expect(anyPlayersWithCardValue).toBe(false);
    });
});