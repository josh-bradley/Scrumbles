var Scrumbles = Scrumbles || {};
Scrumbles.Service = Scrumbles.Service || {};
Scrumbles.Service.gameService = (function(){
    function initiateItemEstimate(itemName){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.startEstimate', { itemName: itemName });
    }

    function initiateReview(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.showCards', {});
    }

    function initiateEndReview(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.finishReviewRequest', {});
    }

    function cardSelected(){
        var socket = Scrumbles.socketManager.getSocket();
        socket.emit('item.cardSelect', { card: this.selectedCard() });
    }

    return {
        initiateItemEstimate: initiateItemEstimate,
        initiateReview: initiateReview,
        initiateEndReview: initiateEndReview,
        cardSelected: cardSelected
    };
})();
