module.exports = (function(){
    var socketManager = require('../socketManager.js');
    function joinRoom(roomName, playerName, success, error){
        joinRoomRequest(false, roomName, playerName, success, error);
    }

    function joinRoomRequest(isCreateRequest, roomName, playerName, success, error){
        var socket = socketManager.getSocket();
        socket.once('room.joinConfirm', function(data){
            if(!data.errorMessage){
                success(data);
            } else {
                error(data);
            }
        });

        socket.emit('room.join', {
            name : roomName,
            playerName: playerName,
            isCreateRequest: isCreateRequest
        });
    }

    function createRoom(roomName, playerName, success, error){
        joinRoomRequest(true, roomName, playerName, success, error);
    }

    return {
        joinRoom: joinRoom,
        createRoom: createRoom
    };
})();