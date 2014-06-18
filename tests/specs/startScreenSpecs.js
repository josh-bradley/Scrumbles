var Handlebars = {compile: function(){}};
describe('room', function(){
    var origTemplates, sandbox,
        page, socketEmitSpy,
        mockSocket, socketOnSpy;

    var mocks = Scrumbles.test.mocks;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        page = Scrumbles.pageProvider.getPage();
        sandbox.stub(Scrumbles.pageProvider, "getPage").returns(page);

        socketEmitSpy = sandbox.spy();
        socketOnSpy = sandbox.spy();
        mockSocket = { emit: socketEmitSpy, on: socketOnSpy};

        origTemplates = Scrumbles.templates;
        Scrumbles.templates = mocks.templates;
        Scrumbles.socketManager.getSocket = function(){return mockSocket;};
    });

    afterEach(function() {
        sandbox.restore();
        Scrumbles.templates = origTemplates;
    });

    describe('room init', function() {

        it('should attach keydown handler.', function() {
            var onSpy = sandbox.spy(page.$joinRoomName, "on");

            Scrumbles.startScreen.init();

            expect(onSpy.calledWith("keydown", sinon.match.func)).toBe(true);
        });

        it("should attach click handler to join room button", function() {
            var onSpy = sandbox.spy(page.$joinRoom, "on");

            Scrumbles.startScreen.init();

            expect(onSpy.calledWith("click", sinon.match.func)).toBe(true);
        });

        it('should attach click handler to startEstimationSession button', function() {
            var onSpy = sandbox.spy(page.$startEstimationSession, "on");

            Scrumbles.startScreen.init();

            expect(onSpy.calledWith("click", sinon.match.func)).toBe(true);
        });

        it('should attach change handler to card seleector', function() {
            var onSpy = sandbox.spy(page.$cardSelector, "on");

            Scrumbles.startScreen.init();

            expect(onSpy.calledWith("change", sinon.match.func)).toBe(true);
        });

        it("should attach click handler to showCard button", function() {
            var onSpy = sandbox.spy(page.$showCards, "on");

            Scrumbles.startScreen.init();

            expect(onSpy.calledWith("click", sinon.match.func)).toBe(true);
        });
    });

    describe('cardSelector change handler', function(){

        it('should emit item.cardSelect', function(){
            var handler = getCardSelectorChangeHandler();

            handler();

            expect(socketEmitSpy.calledWith('item.cardSelect')).toBe(true);
        });

        it('should pass selected card value', function(){
            var handler = getCardSelectorChangeHandler();
            sandbox.stub(page, 'getSelectedCard').returns('8');

            handler();

            expect(socketEmitSpy.getCall(0).args[1].card).toBe('8');
        });


        function getCardSelectorChangeHandler(){
            var onSpy = sandbox.spy(page.$cardSelector, "on");

            Scrumbles.startScreen.init();

            return onSpy.getCall(0).args[1];
        }
    });

    describe('startEstimationSession handler', function(){

        it('should emit item.startEstimate', function(){
            var handler = getStartEstimationSessionHandler();

            handler();

            expect(socketEmitSpy.calledWith('item.startEstimate')).toBe(true);
        });

        it('should emit item.startEstimate with item name', function(){
            var handler = getStartEstimationSessionHandler();
            var expected = 'stuff';
            sandbox.stub(page.$currentItemName, 'val').returns(expected);

            handler();

            expect(socketEmitSpy.getCall(0).args[1].itemName).toBe(expected);
        });

        function getStartEstimationSessionHandler(){
            var onSpy = sandbox.spy(page.$startEstimationSession, "on");

            Scrumbles.startScreen.init();

            return onSpy.getCall(0).args[1];
        }
    });

    describe('join room handler', function(){

        var joinRoom;

        beforeEach(function(){
            Scrumbles.cardTable = Scrumbles.cardTable || mocks.cardTable;

            joinRoom = getJoinRoomHandler();
        });

        it('should emit room.join', function(){
            joinRoom();

            expect(socketEmitSpy.calledWith('room.join', sinon.match.object)).toBe(true);
        });

        it('should attach socket listener for room.joinConfirm', function(){
            joinRoom();

            expect(socketOnSpy.calledWith('room.joinConfirm', sinon.match.func)).toBe(true);
        });
    });

    describe('room.joinConfirm handler', function(){

        beforeEach(function(){
            Scrumbles.cardTable = mocks.cardTable;

            Scrumbles.templates = { getEmptyCardSlotTemplate: function(){ return function(){};}};
        });

        it('should init table', function(){
            var handler = getJoinRoomConfirmHandler();

            var tableInitSpy = sandbox.spy(Scrumbles.cardTable, 'init');
            var expected = { players: [{ playerName: 'bob'}, { playerName: 'tim'}], wasCreate: true};
            handler(expected);

            expect(tableInitSpy.calledWith(expected)).toBe(true);
        });
    });

    describe('showCards handler', function(){
        it('should emit item.showCards', function(){
            var handler = getShowCardsHandler();

            handler();

            expect(socketEmitSpy.calledWith('item.showCards', sinon.match.object)).toBe(true);
        });
    });

    function getJoinRoomConfirmHandler(){
        getJoinRoomHandler()();

        return socketOnSpy.getCall(0).args[1];
    }

    function getShowCardsHandler(){
        var onSpy = sandbox.spy(page.$showCards, "on");

        Scrumbles.startScreen.init();
        var handler = onSpy.getCall(0).args[1];

        onSpy.restore();
        return handler;
    }

    function getJoinRoomHandler(){
        var onSpy = sandbox.spy(page.$joinRoom, "on");

        Scrumbles.startScreen.init();
        var handler = onSpy.getCall(0).args[1];

        onSpy.restore();
        return handler;
    }
});