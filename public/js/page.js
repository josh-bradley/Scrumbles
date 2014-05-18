var Scrumbles = Scrumbles || {};
Scrumbles.page = (function(){
    var pageStatus = { INIT:0, WAITING:1, INGAME:2, REVIEW:3 };

    function initCardTable(isOwner, status){
        this.status(status);
        this.isOwner(isOwner);
    }

    function startGame(itemName){
        this.status(pageStatus.INGAME);
        this.itemName(itemName);
    }

    function startItemEstimate(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.startEstimate', { itemName: this.itemName() });
    }

    function cardSelected(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.cardSelect', { card: this.selectedCard() });
    }

    function joinRoom(){
        var cardTable = Scrumbles.cardTable;
        var socket = Scrumbles.socketManager.getSocket();

        socket.on('room.joinConfirm', function(data){
            cardTable.init(data);
        });

        socket.emit('room.join', {
            name : this.roomName(),
            playerName: this.playerName()
        });
    }

    function keyDownJoinHandler(e){
        if(e.keyCode == 13) {
            joinRoom();
        }
    }

    function showCards(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.showCards', {});
    };

    function setPlayersCardValue(playerName, card){
        var player = _.find(this.players(), function(player){
           return (player.playerName() === playerName);
        });

        if(player) {
            player.card(card);
        }
    }

    function removePlayer(playerName){
        var players = _.filter(this.players(), function(player){
            return (player.playerName() !== playerName);
        });

        this.players(players);
    }

    function displayCardFace(){
        this.status(pageStatus.REVIEW);
    }

    function addPlayer(player){
        this.players.push(new Player(player));
    }

    var Player = function(player){
        this.playerName = ko.observable(player.playerName);
        this.card = ko.observable(player.card);
    }

    var Page = function(){
        var self = this;

        this.players = ko.observableArray([]);
        this.status = ko.observable(pageStatus.INIT);
        this.playerName = ko.observable();
        this.roomName = ko.observable();
        this.itemName = ko.observable();
        this.selectedCard = ko.observable();
        this.isStatusInit = ko.computed(function(){
            return self.status() === pageStatus.INIT;
        }, true);
        this.isStatusWaiting = ko.computed(function(){
            return self.status() === pageStatus.WAITING;
        }, true);
        this.isStatusInGame = ko.computed(function(){
            return self.status() === pageStatus.INGAME;
        }, true);
        this.isStatusReview = ko.computed(function(){
            return self.status() === pageStatus.REVIEW;
        }, true);
        this.isOwner = ko.observable(false);
        this.shouldShowTaskEntry = ko.computed(function(){
            return (self.isStatusWaiting() || self.isStatusReview() ) && self.isOwner()
        }, true);
        this.showGameTitle = ko.computed(function(){
            return self.isStatusInGame() || self.isStatusReview();
        }, true);
        this.joinRoom = joinRoom;
        this.startGame = startGame;
        this.startItemEstimate = startItemEstimate;
        this.cardSelected = cardSelected;
        this.joinRoom = joinRoom;
        this.keyDownJoinHandler = keyDownJoinHandler;
        this.showCards = showCards;
        this.initCardTable = initCardTable;
        this.setPlayersCardValue = setPlayersCardValue;
        this.removePlayer = removePlayer;
        this.displayCardFace = displayCardFace;
        this.addPlayer = addPlayer;
        this.statusClass = ko.computed(function(){
            if(self.status() === pageStatus.WAITING){
                return 'waiting';
            } else if (self.status() === pageStatus.INGAME){
                return 'ingame';
            } else if (self.status() === pageStatus.REVIEW) {
                return 'review';
            }

        }, true);
    };

    var viewModel = new Page();

    return viewModel;
})();
