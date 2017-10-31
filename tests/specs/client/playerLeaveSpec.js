describe('player.leave', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var _ = require('underscore');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should remove correct player', function(){
        page.room.players.add({playerName:'ted', card:'8'});
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'tom', card:'5'});
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob'});

        var player = _.filter(page.room.players(), function(player){
            return player.playerName() === 'bob';
        });

        expect(player.length).toBe(0);
    });

    it('should set is owner to true if new owner matches current user', function(){
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'ted', card:'5'});
        page.room.playerName('ted');
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob', newHostPlayerName:'ted'});

        expect(page.room.isOwner()).toBe(true);
    });

    it('should set is owner to false if new owner does not match current user', function(){
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'ted', card:'5'});
        page.room.playerName('tom');
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob', newHostPlayerName:'ted'});

        expect(page.room.isOwner()).toBe(false);
    });
});