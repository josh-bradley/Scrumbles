describe('item.cardSelected', function(){
    var sandbox;
    var page;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set players card value', function(){
        var expected = '8';
        page.room.players.add({playerName:'Bob', card:'8'});

        helpers.itemCardSelectedHandler(page, {playerName:'Bob', card:expected});

        expect(page.room.players()[0].card()).toBe(expected);
    });
});