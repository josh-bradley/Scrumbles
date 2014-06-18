var Scrumbles = Scrumbles || { };
Scrumbles.test = Scrumbles.test || {}
Scrumbles.test.mocks = (function(){
    var cardTableMock = {init: function(){}, addPlayer: function(){}};

    var templatesMock = { getEmptyCardSlotTemplate: function(){ return function(){};}};

    return {
        cardTable: cardTableMock,
        templates: templatesMock
    };
})();