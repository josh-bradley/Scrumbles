describe('join room confirm', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();

    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should call success if there is no errorMessage calls success', function(){
        var successSpy = sinon.spy();
        Scrumbles.helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), {});

        expect(successSpy.callCount).toBe(1);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        Scrumbles.helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, { errorMessage: 'Error' });

        expect(errorSpy.callCount).toBe(1);
    });

    it('should call success with data', function(){
        var successSpy = sinon.spy();
        var expectedData = {};
        Scrumbles.helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), expectedData);

        expect(successSpy.getCall(0).args[0]).toBe(expectedData);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        var expectedData = { errorMessage: 'error' };
        Scrumbles.helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, expectedData);

        expect(errorSpy.getCall(0).args[0]).toBe(expectedData);
    });
});