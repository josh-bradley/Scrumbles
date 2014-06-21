describe('item.initiateItemEstimate', function(){
    var sandbox;
    var initiateItemEstimate = Scrumbles.helpers.initiateItemEstimate;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();

    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should emit item.startEstimate', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');

        initiateItemEstimate();

        expect(spy.getCall(0).args[0]).toBe('item.startEstimate');
    });

    it('should emit item.startEstimate with item name', function(){
        var spy = sandbox.spy(Scrumbles.mocks.socketMock, 'emit');

        initiateItemEstimate('task one');

        expect(spy.getCall(0).args[1].itemName).toBe('task one');
    });
});