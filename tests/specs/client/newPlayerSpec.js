describe('player.new', function(){
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

    it('should set new player name', function(){
        helpers.playerNewHandler(page, {playerName:'bob', card:'8'});

        expect(page.room.players()[0].playerName()).toBe('bob');
    });

    it('should set new player card', function(){
        helpers.playerNewHandler(page, {playerName:'bob', card:'8'});

        expect(page.room.players()[0].card()).toBe('8');
    });
});