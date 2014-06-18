var HandleBars;
describe('cardTable', function(){

    var sandbox;
    var page;
    var socketOnSpy;
    var fakeCardTableInitData = {room:{}};

    beforeEach(function() {
        HandleBars = {compile: function(){}};
        sandbox = sinon.sandbox.create();
        page = Scrumbles.pageProvider.getPage();
        sandbox.stub(Scrumbles.pageProvider, "getPage").returns(page);

        socketOnSpy = sandbox.spy();

        Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('init', function(){
        it('should add listener for new players', function(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(socketOnSpy.calledWith('player.new', sinon.match.func)).toBe(true);
        });

        it('should add listener leaving players', function(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(socketOnSpy.calledWith('player.leave', sinon.match.func)).toBe(true);
        });

        it('should add listener for item.estimateStarted', function(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(socketOnSpy.calledWith('item.estimateStarted', sinon.match.func)).toBe(true);
        });

        it('should attach handler to item.showCardsNow', function(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(socketOnSpy.calledWith('item.showCardsNow', sinon.match.func)).toBe(true);
        });

        it('should hide join room elements', function(){
            var hideSpy = sandbox.spy(page.$joinRoomSection, 'hide');

            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(hideSpy.calledOnce).toBe(true);
        });

        it('should show the card table element', function(){
            var hideSpy = sandbox.spy(page.$cardTableSection, 'show');

            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(hideSpy.calledOnce).toBe(true);
        });

        it('should show item name text box when room was created', function(){
            var itemNameShowSpy = sandbox.spy(page.$currentItemSection, 'show');
            var itemNameTitleShowSpy = sandbox.spy(page.$currentItemTitle, 'show');

            Scrumbles.cardTable.init({wasCreate:true, room:{}});

            expect(itemNameShowSpy.calledOnce).toBe(true);
            expect(itemNameTitleShowSpy.calledOnce).toBe(false);
        });

        it('should not show item name text box when player joins room', function(){
            var itemNameShowSpy = sandbox.spy(page.$currentItemSection, 'show');
            var itemNameTitleShowSpy = sandbox.spy(page.$currentItemTitle, 'show');

            Scrumbles.cardTable.init({wasCreate:false, room:{}});

            expect(itemNameShowSpy.calledOnce).toBe(false);
            expect(itemNameTitleShowSpy.calledOnce).toBe(true);
        });

        it('should addPlayer for each user', function(){
            sandbox.stub(Scrumbles.templates, 'getEmptyCardSlotTemplate').returns(function(player) { return player.playerName; });
            var spy = sandbox.spy(page.$cardTable, 'append');

            Scrumbles.cardTable.init({wasCreate: false, room: {players: [{playerName:'bob'}, {playerName:'tim'}]}});

            expect(spy.callCount).toBe(2);
            expect(spy.getCall(0).args[0]).toBe('bob');
            expect(spy.getCall(1).args[0]).toBe('tim');
        });

        it('should call showNewTitle if title passed', function(){
            sandbox.stub(Scrumbles.templates, 'getEmptyCardSlotTemplate').returns(function(player) { return player.playerName; });
            var spy = sandbox.spy(page, 'showNewTitle');

            Scrumbles.cardTable.init({wasCreate: false, room:{ players: [{playerName:'bob'}, {playerName:'tim'}], itemName:'Item one'}});

            expect(spy.calledWith('Item one')).toBe(true);
        });

        it('should listen for card selections', function(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            expect(socketOnSpy.calledWith('item.cardSelected', sinon.match.func)).toBe(true);
        });
    });

    describe('item.cardSelected handler', function(){
        it('should call pageProvider.setPlayersCardValue', function(){
            var handler = getCardSelectedHandler();
            var spy = sandbox.spy(page, 'setPlayersCardValue');

            handler({playerName:'bob', card:'8'});

            expect(spy.calledWith('bob', '8')).toBe(true);
        });

        function getCardSelectedHandler(){
            Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
            Scrumbles.cardTable.init(fakeCardTableInitData);

            return socketOnSpy.getCall(2).args[1];
        }
    });

    describe('new.user', function(){
        var newUserHandler;
        var templateStub;
        beforeEach(function(){
            Scrumbles.cardTable.init(fakeCardTableInitData);

            templateStub = sandbox.stub().returns('test');
            sandbox.stub(Scrumbles.templates, 'getEmptyCardSlotTemplate').returns(templateStub);
            newUserHandler = socketOnSpy.getCall(0).args[1];
        });

        it('should append new element to table', function(){
            var appendSpy = sandbox.spy(page.$cardTable, 'append');
            newUserHandler({playerName: 'Bob'});

            expect(appendSpy.calledOnce).toBe(true);
        });

        it('should create element from template', function(){
            var expected = 'test';

            var $element = getNewCardElement({playerName: expected});

            expect($element).toBe(expected);
        });

        it('should pass user name to the template', function(){
            var expected = 'ted';

            getNewCardElement({playerName: expected});

            expect(templateStub.getCall(0).args[0].playerName).toBe(expected);
        });

        function getNewCardElement(data){
            data = data || { playerName: 'bob'};
            var appendSpy = sandbox.spy(page.$cardTable, 'append');
            newUserHandler(data);

            return appendSpy.getCall(0).args[0];
        }
    });

    describe('item.estimateStarted handler', function(){
        it('should show title', function(){
            var showNewTitleSpy = sandbox.spy(page, 'showNewTitle');

            getEstimateStartedHandler()({itemName:'New Item'});

            expect(showNewTitleSpy.calledOnce).toBe(true);
            expect(showNewTitleSpy.getCall(0).args[0]).toBe('New Item');
        });
    });

    function getEstimateStartedHandler(){
        Scrumbles.socketManager = { getSocket: function(){ return { on: socketOnSpy};}};
        Scrumbles.cardTable.init(fakeCardTableInitData);

        return socketOnSpy.getCall(1).args[1];
    }
});