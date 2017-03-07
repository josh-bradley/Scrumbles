describe('item.estimateStarted', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageStatus = require('../../../public/js/pageStatus');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room status to INGAME', function(){
        helpers.itemEstimateStartedHandler(page, {itemName:'task 1'});

        expect(page.room.status()).toBe(pageStatus.INGAME);
    });

    it('should set room.itemName', function(){
        helpers.itemEstimateStartedHandler(page, {itemName:'task 1'});

        expect(page.room.itemName()).toBe('task 1');
    });
});
