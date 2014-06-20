var Scrumbles = Scrumbles || {};
Scrumbles.helpers = Scrumbles.helpers || {};

Scrumbles.helpers.joinRoom = function(roomName, playerName){
    roomName = roomName || 'test';
    playerName = playerName || 'bob';
    var page = Scrumbles.page;

    page.joinRoomViewModel.roomName(roomName);
    page.joinRoomViewModel.playerName(playerName);

    page.joinRoomRequest();
};

Scrumbles.helpers.joinRoomConfirm = function(roomName, playerName, success, error, data){
    var spy = sinon.spy(Scrumbles.mocks.socketMock, 'on');

    Scrumbles.Service.roomService.joinRoom(roomName, playerName, success, error);

    var call = spy.getCall(0);
    call.args[1](data);
    Scrumbles.mocks.socketMock.on.restore();
}

Scrumbles.helpers.initiateItemEstimate = function(itemName){
    var page = Scrumbles.page;

    page.joinRoomViewModel.roomName('test');
    page.joinRoomViewModel.playerName('bob');
    page.room.itemName(itemName || 'task');

    page.initiateItemEstimate();
};