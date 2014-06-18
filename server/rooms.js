var Room = require('./room').Room;
var Player = require('./player').Player;

var rooms = {};

function createRoom(roomName){
    if(rooms[roomName]){
       throw "room already exists";
    }

    rooms[roomName] = new Room(roomName);

    return rooms[roomName];
}

function getRoom(roomName){
    if(!doesRoomExist(roomName)) {
        createRoom(roomName);
    }

    return rooms[roomName];
}

function closeRoom(roomName){
    rooms[roomName] = undefined;
}

function leaveRoom(socket) {
    if(socket.scrumbles.room){
        var room = socket.scrumbles.room;
        var player = socket.scrumbles.player;

        room.removePlayer(player.playerName);

        if(room.playerCount === 0) {
            rooms[room.roomName] = undefined;
            return;
        }

        socket.broadcast.to(room.roomName).emit('player.leave', { playerName: player.playerName, newHostPlayerName: room.hostPlayer.playerName });
    }
}

function doesRoomExist(roomName){
    return rooms[roomName];
}

exports.createRoom = createRoom;
exports.doesRoomExist = doesRoomExist;
exports.getRoom = getRoom;
exports.leaveRoom = leaveRoom;
exports.closeRoom = closeRoom;