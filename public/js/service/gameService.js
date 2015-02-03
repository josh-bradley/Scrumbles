module.exports = (function(){
    var socketManager = require('../socketManager.js');
    function initiateItemEstimate(itemName){
        var socket = socketManager.getSocket();
        socket.emit('item.startEstimate', { itemName: itemName });
    }

    function initiateReview(){
        var socket = socketManager.getSocket();
        socket.emit('item.showCards', {});
    }

    function initiateEndReview(){
        var socket = socketManager.getSocket();
        socket.emit('item.finishReviewRequest', {});
    }

    function cardSelected(){
        var socket = socketManager.getSocket();
        socket.emit('item.cardSelect', { card: this.selectedCard() });
    }

    return {
        initiateItemEstimate: initiateItemEstimate,
        initiateReview: initiateReview,
        initiateEndReview: initiateEndReview,
        cardSelected: cardSelected
    };
})();
