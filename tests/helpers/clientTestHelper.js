var Scrumbles = Scrumbles || {};
Scrumbles.helpers = Scrumbles.helpers || {};


Scrumbles.helpers.createRoom = function(roomName, playerName){
    roomName = roomName || 'test';
    playerName = playerName || 'bob';
    var page = Scrumbles.page;

    page.joinRoomViewModel.roomName(roomName);
    page.joinRoomViewModel.playerName(playerName);

    page.createRoomRequest();
};

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
};

Scrumbles.helpers.joinRoomConfirmSuccess = function(data){
    var spy = sinon.spy(Scrumbles.Service.roomService, 'joinRoom');

    Scrumbles.page.joinRoomViewModel.roomName('test');
    Scrumbles.page.joinRoomViewModel.playerName('ted');
    Scrumbles.page.joinRoomRequest();

    spy.getCall(0).args[2](data);
    spy.restore();
};

Scrumbles.helpers.joinRoomConfirmFailure = function(data){
    var spy = sinon.spy(Scrumbles.Service.roomService, 'joinRoom');

    Scrumbles.page.joinRoomViewModel.roomName('test');
    Scrumbles.page.joinRoomViewModel.playerName('ted');
    Scrumbles.page.joinRoomRequest();

    spy.getCall(0).args[3](data);
    spy.restore();
};

Scrumbles.helpers.initiateItemEstimate = function(itemName){
    var page = Scrumbles.page;

    page.joinRoomViewModel.roomName('test');
    page.joinRoomViewModel.playerName('bob');
    page.room.itemName(itemName || 'task');

    page.initiateItemEstimate();
};

Scrumbles.helpers.playerNewHandler = function(data){
    getSocketListenerHandler('player.new')(data);
};

Scrumbles.helpers.itemEstimateStartedHandler = function(data){
    getSocketListenerHandler('item.estimateStarted')(data);
};

Scrumbles.helpers.itemCardSelectedHandler = function(data){
    getSocketListenerHandler('item.cardSelected')(data);
};

Scrumbles.helpers.itemShowCardsHandler = function(data){
    getSocketListenerHandler('item.showCardsNow')(data);
};

Scrumbles.helpers.itemFinishReviewHandler = function(data){
    getSocketListenerHandler('item.finishReview')(data);
};

Scrumbles.helpers.playerLeaveHandler = function(data){
    getSocketListenerHandler('player.leave')(data);
};

function getSocketListenerHandler(handlerName){
    var spy = sinon.spy(Scrumbles.mocks.socketMock, 'on');

    Scrumbles.socketListener.init();
    var handler = sinon.getCallByArgs(spy, handlerName);

    Scrumbles.mocks.socketMock.on.restore();
    return handler;
}