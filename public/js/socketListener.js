module.exports = (function(){
    var socketManager = require('./socketManager.js');
    var notify = require('./notify.js');
    function init(){
        var viewModel = require('./page.js');

        var socket = socketManager.getSocket();

        socket.on('player.new', function(data){
            notify.playerHasJoinedTheRoom(data.playerName);
            viewModel.room.players.add(data);
        });

        socket.on('item.estimateStarted', function(data){
            viewModel.startItemEstimate(data.itemName);
        });

        socket.on('item.cardSelected', function(data){
            viewModel.room.players.setPlayersCardValue(data.playerName, data.card);
        });

        socket.on('item.showCardsNow', function(){
            viewModel.review();
        });

        socket.on('item.finishReview', function(){
            viewModel.endReview();
        });

        socket.on('player.leave', function(data){
            notify.playerHasLeftTheRoom(data.playerName);
            viewModel.room.players.removeByName(data.playerName);
            var hasBeenPromotedToOwner = data.newHostPlayerName === viewModel.room.playerName() &&
                                            !viewModel.room.isOwner();
            if(hasBeenPromotedToOwner){
                notify.promotionToOwner();
                viewModel.room.isOwner(data.newHostPlayerName === viewModel.room.playerName());
            }
        });
    }

    return {
        init: init
    };
}());