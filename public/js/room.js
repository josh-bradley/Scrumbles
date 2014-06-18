var Scrumbles = Scrumbles || {};
Scrumbles.Room = function(){
    var pageStatus = Scrumbles.pageStatus;
    var self = this;

    this.status = ko.observable(pageStatus.INIT);

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

    this.name = ko.observable();

    this.playerName = ko.observable();
    this.isOwner = ko.observable(false);

    this.players = Scrumbles.players.init();

    this.itemName = ko.observable().extend({ required:
    {
        message:'Item Name required'
    }});

    this.init = function(data){
        var players = data.room.players || {};

        _.each(players, function(player){
            self.players.add(player);
        });

        if(data.room.itemName){
            self.status(pageStatus.INGAME);
            self.itemName(data.room.itemName);
        }

        self.name(data.room.roomName);
        self.playerName(data.playerName);
        self.status(data.room.status);
        self.isOwner(data.wasCreate);
    };
};