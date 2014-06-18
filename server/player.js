function Player(playerName, isHost, socketId){
    this.playerName = playerName;
    this.isOwner = isHost;
    this.socketId = socketId;
}

exports.Player = Player;