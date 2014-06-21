describe('player.new', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set new player name', function(){
        Scrumbles.helpers.playerNewHandler({playerName:'bob', card:'8'});

        expect(Scrumbles.page.room.players()[0].playerName()).toBe('bob');
    });

    it('should set new player card', function(){
        Scrumbles.helpers.playerNewHandler({playerName:'bob', card:'8'});

        expect(Scrumbles.page.room.players()[0].card()).toBe('8');
    });
});