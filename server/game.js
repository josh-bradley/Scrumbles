var roomStatus = require('./roomStatus').roomStatus;
var _ = require('underscore');

function listenToGameTransitions(socket){
    var io = require('./io').getIO();

    socket.on('item.startEstimate', startEstimateHandler);
    socket.on('item.showCards', showCards);
    socket.on('item.finishReviewRequest', function(){
        io.sockets.in(socket.scrumbles.room.roomName).emit('item.finishReview');

        var room = socket.scrumbles.room;
        room.status = roomStatus.WAITING;
        _.each(room.players, function(player) {
            if(player){
                player.card = undefined;
            }
        });
    });

    function showCards() {
        var room = socket.scrumbles.room;
        if(room.status === roomStatus.INGAME) {
            io.sockets.in(room.roomName).emit('item.showCardsNow');
            room.status = roomStatus.REVIEW;
        }
    }

    function startEstimateHandler(itemData){
        var room = socket.scrumbles.room;
        room.itemName = itemData.itemName;
        room.status = roomStatus.INGAME;

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