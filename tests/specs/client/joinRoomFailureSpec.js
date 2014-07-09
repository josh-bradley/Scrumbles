describe('join room failure', function(){
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

        Scrumbles.helpers.joinRoomConfirmFailure({});

        expect(spy.callCount).toBe(1);
    });

    it('should set the playerNameError prop to true on player error', function(){
        var spy = sandbox.spy(Scrumbles.page.loadMessageViewModel, 'clearMessage');

        Scrumbles.helpers.joinRoomConfirmFailure({errorField:'playerName'});

        expect(Scrumbles.page.joinRoomViewModel.errorField()).toBe('playerName');
    });
});