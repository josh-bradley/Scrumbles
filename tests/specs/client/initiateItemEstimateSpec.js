describe('item.initiateItemEstimate', function(){
    var sandbox;
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var initiateItemEstimate = require('../../helpers/clientTestHelper').initiateItemEstimate;
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should emit item.startEstimate', function(){
        var spy = sandbox.spy(socketMock, 'emit');

        initiateItemEstimate(page);

        expect(spy.getCall(0).args[0]).toBe('item.startEstimate');
    });

    it('should emit item.startEstimate with item name', function(){
        var spy = sandbox.spy(socketMock, 'emit');

        initiateItemEstimate(page, 'task one');

        expect(spy.getCall(0).args[1].itemName).toBe('task one');
    });
});