var Scrumbles = Scrumbles || {};
Scrumbles.mocks = Scrumbles.mocks || {};
Scrumbles.mocks.socketMock = { on: function(){}, emit: function(){} };

var io = {
    connect: function(){
        return Scrumbles.mocks.socketMock
    }
};

Scrumbles.socketManager.connect();