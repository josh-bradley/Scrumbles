var ko = require('knockout');

function GameCardViewModel(params) {
    this.card = params.card;
    this.showCard = params.showCard;
    this.label = params.label
}

ko.components.register('game-card', {
   template: {element:'game-card'},
   viewModel: GameCardViewModel
});

module.exports