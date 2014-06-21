describe('item.estimateStarted', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room status to INGAME', function(){
        Scrumbles.helpers.itemEstimateStartedHandler({itemName:'task 1'});

        expect(Scrumbles.page.room.status()).toBe(Scrumbles.pageStatus.INGAME);
    });

    it('should set room.itemName', function(){
        Scrumbles.helpers.itemEstimateStartedHandler({itemName:'task 1'});

        expect(Scrumbles.page.room.itemName()).toBe('task 1');
    });
});
