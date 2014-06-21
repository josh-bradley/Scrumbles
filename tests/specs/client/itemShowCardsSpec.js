describe('item.estimateStarted', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should status to REVIEW', function(){
        Scrumbles.helpers.itemShowCardsHandler();

        expect(Scrumbles.page.room.status()).toBe(Scrumbles.pageStatus.REVIEW);
    });

});