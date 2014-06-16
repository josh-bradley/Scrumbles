var Scrumbles = Scrumbles || {};
Scrumbles.page = (function(){
    var pageStatus = Scrumbles.pageStatus;

    function joinRoomRequest(){
        this.joinRoomViewModel.playerNameErrorMessage(null);
        if(!this.joinRoomViewModel.isValid()){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }

        this.room.itemName.isModified(false);
        this.loadMessageViewModel.message('Joining Room...');

        Scrumbles.Service.roomService.joinRoom(this.joinRoomViewModel.roomName(), this.joinRoomViewModel.playerName(), this.joinRoomSuccess, joinRoomFailure);
    }

    function joinRoomSuccess(data){
        viewModel.loadMessageViewModel.clearMessage();
        Scrumbles.socketListener.init();
        viewModel.room.init(data);
    }

    function joinRoomFailure(data){
        viewModel.loadMessageViewModel.clearMessage();
        viewModel.joinRoomViewModel.playerNameErrorMessage(data.errorMessage);
    }

    function initiateItemEstimate(){
        if(!this.room.isValid()){
            this.room.errors.showAllMessages();
            return;
        }

        Scrumbles.Service.gameService.initiateItemEstimate(this.room.itemName());
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
        _.each(this.room.players(), function(player){
            player.card(undefined);
        });
    }

    function keyDownJoinHandler(e){
        if(e.keyCode == 13) {
            joinRoomRequest();
        }
    }

    var Page = function(){
        var self = this;

        this.cards = ko.observableArray(['1/2', '1', '2', '4', '8', '13', '20', '40', '100', '?']);

        this.joinRoomViewModel = new Scrumbles.joinRoomViewModel();
        this.room = new Scrumbles.Room();

        this.loadMessageViewModel = new Scrumbles.LoadMessageViewModel();

        this.selectedCard = ko.observable();

        // Status changes
        this.joinRoomSuccess = joinRoomSuccess;
        this.startItemEstimate = startItemEstimate;
        this.review = review;
        this.endReview = endReview;

        // Handlers
        this.joinRoomRequest = joinRoomRequest;
        this.initiateItemEstimate = initiateItemEstimate;
        this.initiateReview = Scrumbles.Service.gameService.initiateReview;
        this.initiateEndReview = Scrumbles.Service.gameService.initiateEndReview;
        this.cardSelected = Scrumbles.Service.gameService.cardSelected;

        this.keyDownJoinHandler = keyDownJoinHandler;

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
    };

    var viewModel = new Page();
    viewModel.joinRoomViewModel.errors = ko.validation.group(viewModel.joinRoomViewModel);
    viewModel.room.errors = ko.validation.group(viewModel.room);

    return viewModel;
})();
