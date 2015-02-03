module.exports = (function(){
    var pageStatus = require('./pageStatus.js');
    var roomService = require('./service/roomService.js');
    var notify = require('./notify.js');
    //var page = require('./page.js');
    var Room = require('./room.js');
    var gameService = require('./service/gameService.js');
    var socketListener = require('./socketListener.js');
    var JoinRoomViewModel = require('./joinRoomViewModel.js');
    var LoadMessageViewModel = require('./loadMessageViewModel.js');

    function joinRoomRequest(){
        this.joinRoomViewModel.errorField(null);
        if(!this.joinRoomViewModel.isValid()){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }

        this.room.itemName.isModified(false);
        this.loadMessageViewModel.message('Joining Room...');

        roomService.joinRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            joinRoomFailure);
    }

    function createRoomRequest(model, e){
        this.joinRoomViewModel.errorField(null);

        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        if(!this.joinRoomViewModel.isValid()){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }

        this.loadMessageViewModel.message('Create Room...');

        roomService.createRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            joinRoomFailure);
    }

    function joinRoomSuccess(data){
        notify.joinedRoom(data.room.roomName);
        viewModel.loadMessageViewModel.clearMessage();
        socketListener.init();
        viewModel.room.init(data);
    }

    function joinRoomFailure(data){
        viewModel.loadMessageViewModel.clearMessage();
        viewModel.joinRoomViewModel.errorField(data.errorField);
    }

    function initiateItemEstimate(model, e){
        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        if(!this.room.isValid()){
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
        _.each(this.room.players(), function(player){
            player.card(undefined);
        });
    }

    var PageModel = function(){
        var self = this;

        this.cards = ko.observableArray(['1/2', '1', '2', '4', '8', '13', '20', '40', '100', '?']);

        this.joinRoomViewModel = new JoinRoomViewModel();
        this.room = new Room();

        this.loadMessageViewModel = new LoadMessageViewModel();

        this.selectedCard = ko.observable();

        // Status changes
        this.joinRoomSuccess = joinRoomSuccess;
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

        this.showGameTitle = ko.computed(function(){
            return self.room.isStatusInGame() || self.room.isStatusReview();
        }, true);

        this.statusClass = ko.computed(function(){
            if(self.room.status() === pageStatus.WAITING){
                return 'waiting';
            } else if (self.room.status() === pageStatus.INGAME){
                return 'ingame';
            } else if (self.room.status() === pageStatus.REVIEW) {
                return 'review';
            }

        }, true);

        this.anyCardsDown = ko.computed(function(){
            return undefined !== _.find(self.room.players(), function(player){
                return player.card();
            });
        });

        this.joinRoomViewModel.errors = ko.validation.group(this.joinRoomViewModel);
        this.room.errors = ko.validation.group(this.room);
    };

    var viewModel = new PageModel();

    return viewModel;
})();
