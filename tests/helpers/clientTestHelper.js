var helper = {};

var fakeEventObject = { };
var socketMock = require('./clientSideMocks').socketMock;
var roomService = require('../../public/js/service/roomService');
var getCallByArgs = require('./sinonExtentions').getCallByArgs;

helper.createRoom = function(page, roomName, playerName){
    roomName = roomName || 'test';
    playerName = playerName || 'bob';

    page.joinRoomViewModel.roomName(roomName);
    page.joinRoomViewModel.playerName(playerName);

    page.createRoomRequest({}, fakeEventObject);
};

helper.joinRoom = function(page, roomName, playerName){
    roomName = roomName || 'test';
    playerName = playerName || 'bob';

    page.joinRoomViewModel.roomName(roomName);
    page.joinRoomViewModel.playerName(playerName);

    page.joinRoomRequest();
};

helper.joinRoomConfirm = function(roomName, playerName, success, error, data){
    var spy = sinon.spy(socketMock, 'once');

    roomService.joinRoom(roomName, playerName, success, error);

    var call = spy.getCall(0);
    call.args[1](data);
    socketMock.once.restore();
};

helper.joinRoomConfirmSuccess = function(page, data){
    var spy = sinon.spy(roomService, 'joinRoom');

    page.joinRoomViewModel.roomName('test');
    page.joinRoomViewModel.playerName('ted');
    page.joinRoomRequest();

    spy.getCall(0).args[2](data);
    spy.restore();
};

helper.joinRoomConfirmFailure = function(page, data){
    var spy = sinon.spy(roomService, 'joinRoom');

    page.joinRoomViewModel.roomName('test');
    page.joinRoomViewModel.playerName('ted');
    page.joinRoomRequest();

    spy.getCall(0).args[3](data);
    spy.restore();
};

helper.initiateItemEstimate = function(page, itemName){
    page.joinRoomViewModel.roomName('test');
    page.joinRoomViewModel.playerName('bob');
    page.room.itemName(itemName || 'task');

    page.initiateItemEstimate({}, {});
};

helper.playerNewHandler = function(page, data){
    getSocketListenerHandler(page, 'player.new')(data);
};

helper.itemEstimateStartedHandler = function(page, data){
    getSocketListenerHandler(page, 'item.estimateStarted')(data);
};

helper.itemCardSelectedHandler = function(page, data){
    getSocketListenerHandler(page, 'item.cardSelected')(data);
};

helper.itemShowCardsHandler = function(page, data){
    getSocketListenerHandler(page, 'item.showCardsNow')(data);
};

helper.itemFinishReviewHandler = function(page, data){
    getSocketListenerHandler(page, 'item.finishReview')(data);
};

helper.playerLeaveHandler = function(page, data){
    getSocketListenerHandler(page, 'player.leave')(data);
};

function getSocketListenerHandler(page, handlerName){
    var spy = sinon.spy(socketMock, 'on');

    require('../../public/js/socketListener').init(page);
    var handler = getCallByArgs(spy, handlerName);

    socketMock.on.restore();
    return handler;
}

module.exports = helper;