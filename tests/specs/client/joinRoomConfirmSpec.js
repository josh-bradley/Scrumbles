describe('join room confirm', function(){
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

    it('should call success if there is no errorMessage calls success', function(){
        var successSpy = sinon.spy();
        helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), {});

        expect(successSpy.callCount).toBe(1);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, { errorMessage: 'Error' });

        expect(errorSpy.callCount).toBe(1);
    });

    it('should call success with data', function(){
        var successSpy = sinon.spy();
        var expectedData = {};
        helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), expectedData);

        expect(successSpy.getCall(0).args[0]).toBe(expectedData);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        var expectedData = { errorMessage: 'error' };
        helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, expectedData);

        expect(errorSpy.getCall(0).args[0]).toBe(expectedData);
    });
});