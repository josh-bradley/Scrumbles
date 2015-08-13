module.exports = function(player){
    this.playerName = ko.observable(player.playerName);
    this.card = ko.observable(player.card || "");
};