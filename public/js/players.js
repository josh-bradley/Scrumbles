module.exports = (function(){
    var ko = require('knockout');
    var Player = require('./player.js');

    function init(){
        var playerStore = ko.observableArray([]);
        playerStore.add = add;
        playerStore.removeByName = removeByName;
        playerStore.setPlayersCardValue = setPlayersCardValue;

        return playerStore;
    }

    function add(player){
        this.push(new Player(player));
    }

    function removeByName(playerName){
        var players = this().filter(function(player){
            return (player.playerName() !== playerName);
        });

        this(players);
    }

    function setPlayersCardValue(playerName, card){
        var player = this().find(function(player){
            return (player.playerName() === playerName);
        });

        if(player) {
            player.card(card);
        }
    }

    return {
        init: init
    };
})();