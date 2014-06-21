describe('item.finishReview', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room.status to WAITING', function(){
        var page = Scrumbles.page;

        Scrumbles.helpers.itemFinishReviewHandler();

        expect(page.room.status()).toBe(Scrumbles.pageStatus.WAITING);
    });

    it('should clear room.itemName', function(){
        var page = Scrumbles.page;
        page.room.itemName('task 1');

        Scrumbles.helpers.itemFinishReviewHandler();

        expect(page.room.itemName()).toBe('');
    });

    it('should set room.itemName.isModified() to false', function(){
        var page = Scrumbles.page;
        var spy = sandbox.spy(page.room.itemName, 'isModified');
        page.room.itemName('task 1');

        Scrumbles.helpers.itemFinishReviewHandler();

        expect(spy.calledWith(false)).toBe(true);
    });

    it('should clear all players cards', function(){
        var page = Scrumbles.page;
        page.room.players.add({playerName:'ted', card:'8'});
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.itemName('task 1');

        Scrumbles.helpers.itemFinishReviewHandler();

        var anyPlayersWithCardValue = _.some(page.room.players(), function(player){
            return player.card();
        });
        expect(anyPlayersWithCardValue).toBe(false);
    });
});