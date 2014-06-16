var rooms = require('./rooms');
var game = require('./game');
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

        var room = rooms.joinRoom(data.name, data.playerName, socket);

        if(!room){
            return;
        }

        socket.broadcast.to(data.name).emit('player.new', {
            playerName: data.playerName
        });

        // only listen to the host player
        if(wasCreate) {
            game.listenToGameTransitions(socket);
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