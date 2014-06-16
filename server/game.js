var rooms = require('./rooms');
var _ = require('underscore');

function listenToGameTransitions(socket){
    var io = require('./io').getIO();

    socket.on('item.startEstimate', startEstimateHandler);
    socket.on('item.showCards', showCards);
    socket.on('item.finishReviewRequest', function(){
        io.sockets.in(socket.scrumbles.room.roomName).emit('item.finishReview');

        var room = socket.scrumbles.room;
        room.status = rooms.roomStatus.WAITING;
        _.each(room.players, function(player) {
            if(player){
                player.card = undefined;
            }
        });
    });

    function showCards() {
        var room = socket.scrumbles.room;
        if(room.status === rooms.roomStatus.INGAME) {
            io.sockets.in(room.roomName).emit('item.showCardsNow');
            room.status = rooms.roomStatus.REVIEW;
        }
    }

    function startEstimateHandler(itemData){
        var room = socket.scrumbles.room;
        room.itemName = itemData.itemName;
        room.status = rooms.roomStatus.INGAME;

        _.each(room.players, function(player) {
            if(player){
                player.card = undefined;
            }
        });

        io.sockets.in(room.roomName).emit('item.estimateStarted', {
            itemName: itemData.itemName
        });
    }
}

exports.listenToGameTransitions = listenToGameTransitions;