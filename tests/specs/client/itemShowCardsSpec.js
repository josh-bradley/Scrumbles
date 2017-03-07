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

    it('should status to REVIEW', function(){
        helpers.itemShowCardsHandler(page);

        expect(page.room.status()).toBe(pageStatus.REVIEW);
    });

});