describe('item.cardSelected', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Scrumbles.page = new Scrumbles.page.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set players card value', function(){
        var page = Scrumbles.page;
        var expected = '5';
        page.room.players.add({playerName:'Bob', card:'8'});

        Scrumbles.helpers.itemCardSelectedHandler({playerName:'Bob', card:expected});

        expect(page.room.players()[0].card()).toBe(expected);
    });
});