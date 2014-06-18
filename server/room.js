var roomStatus = require('./roomStatus').roomStatus;
var Player = require('./player').Player;

function Room(roomName){
    var self = this;

    this.players = {};
    this.status = roomStatus.WAITING;
    this.roomName = roomName;
    this.playerCount = 0;

    this.setPlayerCard = function(playerName, card){
        var player = self.players[playerName];
        if(!player){
            throw 'player ' + player.playerName  +   ' does not exist in room ' + roomName;
        }

        player.card = card;
    };

    this.addPlayer = function(playerName, socket){
        var isHost = self.playerCount === 0;
        var player = new Player(playerName, isHost, socket.id);

        self.players[playerName] = player;
        self.playerCount += 1;

        if(isHost){
            self.hostPlayer = player;
        }

        return player;
    };

    this.removePlayer = function(playerName){
        var player = self.players[playerName];
        self.players[playerName] = undefined;
        self.playerCount -= 1;

        if(self.playerCount > 0 && player.isOwner) {
            setNewHost();
        }
    };

    var setNewHost = function(){
        for(var playerName in self.players){
            var player = self.players[playerName];
            if(player){
                player.isOwner = true;
                self.hostPlayer = player;

                var socket = require('./io').getSocketById(player.socketId);
                require('./game').listenToGameTransitions(socket);
                break;
            }
        }
    };
}

exports.Room = Room;
