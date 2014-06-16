var rooms = {};

var roomStatus = { INIT:0, WAITING:1, INGAME:2, REVIEW:3 };

var playerSocketMapping = {};

function createRoom(roomName){
    if(rooms[roomName]){
       throw "room already exists";
    }

    rooms[roomName] = { players:{}, status:roomStatus.WAITING, roomName: roomName, playerCount: 0 };

    return rooms[roomName];
}

function joinRoom(roomName, playerName, socket) {
    var wasCreate = false;
    if(!doesRoomExist(roomName)) {
        createRoom(roomName);
        wasCreate = true;
    }

    var room = rooms[roomName];
    if(room.players[playerName]){
        socket.emit('room.joinConfirm', { errorMessage:'Player name in use.' });
        return null;
    }

    room.players[playerName] = { playerName: playerName, isOwner: wasCreate };
    room.playerCount += 1;

    socket.join(roomName);

    socket.scrumbles.playerName = playerName;
    socket.scrumbles.room = room;

    playerSocketMapping[playerName] = socket;

    socket.emit('room.joinConfirm', { room: room, wasCreate: wasCreate });
    return room;
}

function leaveRoom(socket) {
    if(socket.scrumbles.room){
        var roomName = socket.scrumbles.room.roomName;
        var leavingPlayerName = socket.scrumbles.playerName;

        var room = rooms[roomName];

        var player = room.players[leavingPlayerName];
        var newHostPlayerName;

        room.players[leavingPlayerName] = undefined;
        room.playerCount -= 1;

        if(room.playerCount === 0) {
            rooms[roomName] = undefined;
        } else if(player.isOwner){
            for(var playerName in room.players){
               if(room.players[playerName]){
                   room.players[playerName].isOwner = true;
                   newHostPlayerName = playerName;

                   require('./game').listenToGameTransitions(playerSocketMapping[playerName]);
                   break;
               }
            }
        }

        socket.broadcast.to(roomName).emit('player.leave', { playerName: leavingPlayerName, newHostPlayerName: newHostPlayerName });
    }
}

function setPlayerCard(roomName, playerName, card){
    if(!doesRoomExist(roomName)){
        throw 'Room ' + roomName + ' does not exist';
    }

    var room = rooms[roomName];
    var player = room.players[playerName];
    if(!player){
        throw 'player ' + playerName  +   ' does not exist in room ' + roomName;
    }

    player.card = card;
}

function doesRoomExist(roomName){
    return rooms[roomName];
}

exports.createRoom = createRoom;
exports.doesRoomExist = doesRoomExist;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.roomStatus = roomStatus;
exports.setPlayerCard = setPlayerCard;