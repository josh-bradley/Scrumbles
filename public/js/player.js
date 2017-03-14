module.exports = function(player){
    var ko = require('knockout');
    this.playerName = ko.observable(player.playerName);
    this.card = ko.observable(player.card || "");
};