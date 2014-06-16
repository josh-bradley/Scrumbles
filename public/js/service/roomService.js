var Scrumbles = Scrumbles || {};
Scrumbles.Service = Scrumbles.Service || {};
Scrumbles.Service.roomService = (function(){
    function joinRoom(roomName, playerName, success, error){
        var socket = Scrumbles.socketManager.getSocket();

        socket.on('room.joinConfirm', function(data){
            if(!data.errorMessage){
                success(data);
            } else {
                error(data);
            }
        });

        socket.emit('room.join', {
            name : roomName,
            playerName: playerName
        });
    }
    return {
        joinRoom: joinRoom
    };
})();