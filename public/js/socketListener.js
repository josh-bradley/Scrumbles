var Scrumbles = Scrumbles || {};
Scrumbles.socketListener = function(){
    var socketManager, viewModel;

    function init(){
        socketManager = Scrumbles.socketManager;
        viewModel = Scrumbles.page;

        var socket = socketManager.getSocket();

        socket.on('player.new', function(data){
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
            viewModel.room.players.removeByName(data.playerName);
            viewModel.room.isOwner(data.newHostPlayerName === viewModel.room.playerName());
        });
    }

    return {
        init: init
    };
}();