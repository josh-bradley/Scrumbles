var rooms = require('./rooms');
var _ = require('underscore');

var io;
exports.init = function(iot){
    io = iot;
    io.on('connection', connect);
};

function connect(socket) {
    socket.scrumbles = socket.scrumbles || {};

    socket.on('room.create', function(data){
        if(!rooms.doesRoomExist(data.name)){
            var room = rooms.joinRoom(data.name, data.playerName, socket);

            socket.join(data.name);
        }

        socket.emit('room.createRoomResult', {
            message: "Room already exists"
        });
    });

    socket.on('room.join', function(joinRoomData) {
        joinRoomHandler(joinRoomData);
    });

    socket.on('disconnect', function(){
        rooms.leaveRoom(socket);
    });

    function joinRoomHandler(data) {
        var wasCreate = !rooms.doesRoomExist(data.name);

        rooms.joinRoom(data.name, data.playerName, socket);

        socket.broadcast.to(data.name).emit('player.new', {
            playerName: data.playerName
        });

        // will only listen to the host player
        if(wasCreate) {
            socket.on('item.startEstimate', startEstimateHandler);
            socket.on('item.showCards', showCards);
            socket.on('item.finishReviewRequest', function(){
                io.sockets.in(socket.scrumbles.room.roomName).emit('item.finishReview');

                var room = socket.scrumbles.room;
                room.status = rooms.roomStatus.WAITING;
                _.each(room.players, function(player) {
                    player.card = undefined;
                });
            });
        }

        socket.on('item.cardSelect', cardSelectHandler);
    }

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
           player.card = undefined;
        });

        io.sockets.in(room.roomName).emit('item.estimateStarted', {
            itemName: itemData.itemName
        });
    }

    function cardSelectHandler(cardSelect){
        var room = socket.scrumbles.room;
        if(room.status === rooms.roomStatus.INGAME){
            rooms.setPlayerCard(room.roomName, socket.scrumbles.playerName, cardSelect.card);
            io.sockets.in(room.roomName).emit('item.cardSelected', {
                card: cardSelect.card,
                playerName: socket.scrumbles.playerName
            });
        }
    }
}