describe('join room failure', function(){
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

        helpers.joinRoomConfirmFailure(page, {});

        expect(spy.callCount).toBe(1);
    });

    it('should set the playerNameError prop to true on player error', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'clearMessage');

        helpers.joinRoomConfirmFailure(page, {errorField:'playerName'});

        expect(page.joinRoomViewModel.errorField()).toBe('playerName');
    });
});