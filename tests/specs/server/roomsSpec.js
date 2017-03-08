var rooms = require('../../../server/rooms');
var sinon = require('sinon');

describe('rooms', function(){
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
       sandbox.restore();
    });

    describe('doesRoomExist', function(){
        it('should return true if room exists', function(){
            rooms.closeRoom('room3');
            rooms.createRoom('room3');

            expect(rooms.doesRoomExist('room3')).toBeTruthy();
        });

        it('should return false if room does not exist', function(){
            expect(rooms.doesRoomExist('room4')).toBeFalsy();
        });
    });
});