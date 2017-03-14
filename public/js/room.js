module.exports = function(){
    var ko = require('knockout');
    var pageStatus = require('./pageStatus.js');
    var players = require('./players.js');
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

    this.players = players.init();

    this.itemName = ko.observable().extend({ required:
    {
        message:'Item Name required'
    }});

    this.init = function(data){
        var players = data.room.players || {};

        for(var key in players){
            if(players.hasOwnProperty(key)) {
                self.players.add(players[key]);
            }
        }

        if(data.room.itemName){
            self.itemName(data.room.itemName);
        }

        self.name(data.room.roomName);
        self.playerName(data.playerName);
        self.status(data.room.status);
        self.isOwner(data.wasCreate);
    };
};