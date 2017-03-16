module.exports = (function(){
    var ko = require('knockout');
    require('knockout.validation');
    var pageStatus = require('./pageStatus.js');
    var roomService = require('./service/roomService.js');
    var notify = require('./notify.js');
    var Room = require('./room.js');
    var gameService = require('./service/gameService.js');
    var socketListener = require('./socketListener.js');
    var JoinRoomViewModel = require('./joinRoomViewModel.js');
    var LoadMessageViewModel = require('./loadMessageViewModel.js');

    function joinRoomRequest(){
        this.joinRoomViewModel.errorField(null);
        if(this.joinRoomViewModel.errors().length > 0){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }
        this.room.itemName.isModified(false);
        this.loadMessageViewModel.message('Joining Room...');

        roomService.joinRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            this.joinRoomFailure);
    }

    function createRoomRequest(model, e){
        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        this.joinRoomViewModel.errorField(null);
        if(this.joinRoomViewModel.errors().length > 0){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }

        this.loadMessageViewModel.message('Create Room...');

        roomService.createRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            this.joinRoomFailure);
    }

    function joinRoomSuccess(data){
        notify.joinedRoom(data.room.roomName);
        this.loadMessageViewModel.clearMessage();
        socketListener.init(this);
        this.room.init(data);
        this.me = data.you;
    }

    function joinRoomFailure(data){
        this.loadMessageViewModel.clearMessage();
        this.joinRoomViewModel.errorField(data.errorField);
    }

    function initiateItemEstimate(model, e){
        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        if(this.room.errors().length > 0){
            this.room.errors.showAllMessages();
            return;
        }

        gameService.initiateItemEstimate(this.room.itemName());
    }

    function startItemEstimate(itemName){
        this.room.status(pageStatus.INGAME);
        this.room.itemName(itemName);
    }

    function review(){
        this.room.status(pageStatus.REVIEW);
    }

    function endReview(){
        this.room.status(pageStatus.WAITING);
        this.room.itemName('');
        this.room.itemName.isModified(false);
        this.selectedCard(undefined);
        this.room.players().forEach(function(player){
            player.card(undefined);
        });
    }

    var PageModel = function(){
        var self = this;

        this.me = {};
        this.cards = ko.observableArray(['0', '1/2', '1', '2', '4', '8', '13', '20', '40', '100', 'C', '?']);

        this.joinRoomViewModel = new JoinRoomViewModel();
        this.room = new Room();

        this.loadMessageViewModel = new LoadMessageViewModel();

        this.selectedCard = ko.observable();

        // Status changes
        this.joinRoomSuccess = joinRoomSuccess.bind(this);
        this.joinRoomFailure = joinRoomFailure.bind(this);
        this.startItemEstimate = startItemEstimate;
        this.review = review;
        this.endReview = endReview;

        // Handlers
        this.createRoomRequest = createRoomRequest;
        this.joinRoomRequest = joinRoomRequest;
        this.initiateItemEstimate = initiateItemEstimate;
        this.initiateReview = gameService.initiateReview;
        this.initiateEndReview = gameService.initiateEndReview;
        this.cardSelected = gameService.cardSelected;

        this.showGameTitle = ko.pureComputed(function(){
            return this.room.isStatusInGame() || this.room.isStatusReview();
        }, this);

        this.statusClass = ko.pureComputed(function(){
            if(this.room.status() === pageStatus.WAITING){
                return 'waiting';
            } else if (this.room.status() === pageStatus.INGAME){
                return 'ingame';
            } else if (this.room.status() === pageStatus.REVIEW) {
                return 'review';
            }
        }, this);

        this.isSelectingCard = ko.observable(false);
        this.openCardSelection = function(){
            if(this.room.isStatusInGame())
                this.isSelectingCard(!this.isSelectingCard());
        }.bind(this);
        this.playerSelectsCard = function(card){
            this.selectedCard(card);
            this.isSelectingCard(false);
            this.cardSelected(card);
        }.bind(this);

        this.anyCardsDown = ko.pureComputed(function(){
            return this.room.players().filter(function(player){
                return player.card();
            }).length > 0;
        }, this);

        this.joinRoomViewModel.errors = ko.validation.group(this.joinRoomViewModel);
        this.room.errors = ko.validation.group(this.room);
    };

    var viewModel = new PageModel();

    return viewModel;
})();
