var Scrumbles = Scrumbles || {};
Scrumbles.cardTable = function(){
    var socketManager, viewModel;

    function init(data){
        var players = data.room.players || {};
        socketManager = Scrumbles.socketManager;
        viewModel = Scrumbles.page;

        var socket = socketManager.getSocket();

        socket.on('player.new', function(data){
            viewModel.addPlayer(data);
        });

        socket.on('item.estimateStarted', function(data){
            viewModel.startGame(data.itemName);
        });

        socket.on('item.cardSelected', function(data){
            viewModel.setPlayersCardValue(data.playerName, data.card);
        });

        socket.on('item.showCardsNow', function(){
            viewModel.displayCardFace();
        });

        socket.on('player.leave', function(data){
            viewModel.removePlayer(data.playerName);
        });

        _.each(players, function(player){
            viewModel.addPlayer(player);
        });

        if(data.room.itemName){
            viewModel.startGame(data.room.itemName);
        }

        Scrumbles.page.initCardTable(data.wasCreate, data.room.status);
    }

    return {
        init: init
    };
}();