var rooms = require('./rooms');
var game = require('./game');
var roomStatus = require('./roomStatus').roomStatus;
var _ = require('underscore');

var io;
exports.init = function(iot){
    io = iot;
    io.on('connection', connect);
};

function connect(socket) {
    socket.scrumbles = socket.scrumbles || {};

    socket.on('room.join', function(joinRoomData) {
        joinRoomHandler(joinRoomData);
    });

    socket.on('disconnect', function(){
        leaveRoom();
    });

    function failJoinRoom(message, errorField){
        socket.emit('room.joinConfirm',
            { errorMessage: message,
                errorField: errorField});

    }

    function joinRoomHandler(data) {
        var wasCreate = !rooms.doesRoomExist(data.name);

        if(!wasCreate && data.isCreateRequest){
            failJoinRoom('Room already exists.', 'roomName');
            return;
        }

        var roomName = data.name, playerName = data.playerName;

        var room = rooms.getRoom(roomName);

        if(room.players[playerName]){
            failJoinRoom('Player name in use.', 'playerName');
            return;
        }

        var player = room.addPlayer(playerName, socket);

        socket.join(roomName);

        socket.scrumbles.playerName = playerName;
        socket.scrumbles.room = room;
        socket.scrumbles.player = player;

        socket.emit('room.joinConfirm', { playerName: playerName, room: room, wasCreate: wasCreate, you: player });

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

    function cardSelectHandler(cardSelect){
        var room = socket.scrumbles.room;
        if(room.status === roomStatus.INGAME){
            room.setPlayerCard(socket.scrumbles.playerName, cardSelect.card);
            io.sockets.in(room.roomName).emit('item.cardSelected', {
                card: cardSelect.card,
                playerName: socket.scrumbles.playerName
            });
        }
    }

    function leaveRoom() {
        if(socket.scrumbles.room){
            var room = socket.scrumbles.room;
            var player = socket.scrumbles.player;

            room.removePlayer(player.playerName);

            if(room.playerCount === 0) {
                rooms.closeRoom(room.roomName);
                return;
            }

            socket.broadcast.to(room.roomName).emit('player.leave', { playerName: player.playerName, newHostPlayerName: room.hostPlayer.playerName });
        }
    }
}