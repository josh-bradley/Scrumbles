var Scrumbles = Scrumbles || {};
Scrumbles.players = (function(){
    var Player = Scrumbles.Player;

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
        var players = _.filter(this(), function(player){
            return (player.playerName() !== playerName);
        });

        this(players);
    }

    function setPlayersCardValue(playerName, card){
        var player = _.find(this(), function(player){
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