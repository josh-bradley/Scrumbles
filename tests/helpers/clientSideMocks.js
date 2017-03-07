module.exports = (function(){
    var cardTableMock = {init: function(){}, addPlayer: function(){}};

    var templatesMock = { getEmptyCardSlotTemplate: function(){ return function(){};}};

    var socketMock = io.connect();
    return {
        cardTable: cardTableMock,
        templates: templatesMock,
        socketMock: socketMock
    };
})();