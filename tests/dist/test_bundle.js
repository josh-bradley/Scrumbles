(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(){
    var self = this;

    this.playerNameErrorMessage = ko.observable();

    this.errorField = ko.observable('');

    this.roomName = ko.observable()
        .extend({ required:{message:'Room Name required'} })
        .extend({validation:{
            validator:function(){
                return !self.errorField || self.errorField() !== 'roomName';
            },
            message: 'Room name already in use.'
        }});
    this.playerName = ko.observable()
                            .extend({ required:{ message:'Name required' }  })
                            .extend({validation:{
                                validator:function(){
                                    return !self.errorField || self.errorField() !== 'playerName';
                                },
                                message: 'Player name already in use.'
                            }});
};
},{}],2:[function(require,module,exports){
module.exports = function(){
    var self = this;
    this.message = ko.observable();
    this.show = ko.computed(function(){
        return self.message();
    }, true);
    this.clearMessage = function(){
        self.message(undefined);
    };
};
},{}],3:[function(require,module,exports){
module.exports = (function(){
    function playerHasJoinedTheRoom(playerName){
        alertify.log("Player " + playerName + " has joined the room");
    }

    function playerHasLeftTheRoom(playerName){
        alertify.log("Player " + playerName + " has left the room");
    }

    function joinedRoom(roomName){
        alertify.success("Joined room " + roomName);
    }

    function promotionToOwner(){
        alertify.log("You are now the owner of the room");
    }

    return {
        playerHasJoinedTheRoom: playerHasJoinedTheRoom,
        joinedRoom: joinedRoom,
        promotionToOwner: promotionToOwner,
        playerHasLeftTheRoom: playerHasLeftTheRoom
    };
})();
},{}],4:[function(require,module,exports){
module.exports = (function(){
    var pageStatus = require('./pageStatus.js');
    var roomService = require('./service/roomService.js');
    var notify = require('./notify.js');
    var Room = require('./room.js');
    var gameService = require('./service/gameService.js');
    var socketListener = require('./socketListener.js');
    var JoinRoomViewModel = require('./joinRoomViewModel.js');
    var LoadMessageViewModel = require('./loadMessageViewModel.js');

    function joinRoomRequest(){
        this.joinRoomViewModel.errorField(null);
        if(!this.joinRoomViewModel.isValid()){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }
        this.room.itemName.isModified(false);
        this.loadMessageViewModel.message('Joining Room...');

        roomService.joinRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            this.joinRoomFailure);
    }

    function createRoomRequest(model, e){
        this.joinRoomViewModel.errorField(null);

        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        if(!this.joinRoomViewModel.isValid()){
            this.joinRoomViewModel.errors.showAllMessages();
            return;
        }

        this.loadMessageViewModel.message('Create Room...');

        roomService.createRoom(
            this.joinRoomViewModel.roomName(),
            this.joinRoomViewModel.playerName(),
            this.joinRoomSuccess,
            this.joinRoomFailure);
    }

    function joinRoomSuccess(data){
        notify.joinedRoom(data.room.roomName);
        this.loadMessageViewModel.clearMessage();
        socketListener.init(this);
        this.room.init(data);
        this.me = data.you;
    }

    function joinRoomFailure(data){
        this.loadMessageViewModel.clearMessage();
        this.joinRoomViewModel.errorField(data.errorField);
    }

    function initiateItemEstimate(model, e){
        if(e.keyCode && e.keyCode !== 13){
            return;
        }

        if(!this.room.isValid()){
            this.room.errors.showAllMessages();
            return;
        }

        gameService.initiateItemEstimate(this.room.itemName());
    }

    function startItemEstimate(itemName){
        this.room.status(pageStatus.INGAME);
        this.room.itemName(itemName);
    }

    function review(){
        this.room.status(pageStatus.REVIEW);
    }

    function endReview(){
        this.room.status(pageStatus.WAITING);
        this.room.itemName('');
        this.room.itemName.isModified(false);
        this.selectedCard(undefined);
        _.each(this.room.players(), function(player){
            player.card(undefined);
        });
    }

    var PageModel = function(){
        var self = this;

        this.me = {};
        this.cards = ko.observableArray(['1/2', '1', '2', '4', '8', '13', '20', '40', '100', '?']);

        this.joinRoomViewModel = new JoinRoomViewModel();
        this.room = new Room();

        this.loadMessageViewModel = new LoadMessageViewModel();

        this.selectedCard = ko.observable();

        // Status changes
        this.joinRoomSuccess = joinRoomSuccess.bind(this);
        this.joinRoomFailure = joinRoomFailure.bind(this);
        this.startItemEstimate = startItemEstimate;
        this.review = review;
        this.endReview = endReview;

        // Handlers
        this.createRoomRequest = createRoomRequest;
        this.joinRoomRequest = joinRoomRequest;
        this.initiateItemEstimate = initiateItemEstimate;
        this.initiateReview = gameService.initiateReview;
        this.initiateEndReview = gameService.initiateEndReview;
        this.cardSelected = gameService.cardSelected;

        this.showGameTitle = ko.computed(function(){
            return self.room.isStatusInGame() || self.room.isStatusReview();
        }, true);

        this.statusClass = ko.computed(function(){
            if(self.room.status() === pageStatus.WAITING){
                return 'waiting';
            } else if (self.room.status() === pageStatus.INGAME){
                return 'ingame';
            } else if (self.room.status() === pageStatus.REVIEW) {
                return 'review';
            }

        }, true);

        this.isSelectingCard = ko.observable(false);
        this.openCardSelection = function(){
            if(this.room.isStatusInGame())
                this.isSelectingCard(!this.isSelectingCard());
        }.bind(this);
        this.playerSelectsCard = function(card){
            this.selectedCard(card);
            this.isSelectingCard(false);
            this.cardSelected(card);
        }.bind(this);

        this.anyCardsDown = ko.computed(function(){
            return undefined !== _.find(self.room.players(), function(player){
                return player.card();
            });
        });

        this.joinRoomViewModel.errors = ko.validation.group(this.joinRoomViewModel);
        this.room.errors = ko.validation.group(this.room);
    };

    var viewModel = new PageModel();

    return viewModel;
})();

},{"./joinRoomViewModel.js":1,"./loadMessageViewModel.js":2,"./notify.js":3,"./pageStatus.js":5,"./room.js":8,"./service/gameService.js":9,"./service/roomService.js":10,"./socketListener.js":11}],5:[function(require,module,exports){
module.exports = (function(){
    return { INIT:0, WAITING:1, INGAME:2, REVIEW:3 };
})();

},{}],6:[function(require,module,exports){
module.exports = function(player){
    this.playerName = ko.observable(player.playerName);
    this.card = ko.observable(player.card || "");
};
},{}],7:[function(require,module,exports){
module.exports = (function(){
    var Player = require('./player.js');

    function init(){
        var playerStore = ko.observableArray([]);
        playerStore.add = add;
        playerStore.removeByName = removeByName;
        playerStore.setPlayersCardValue = setPlayersCardValue;

        return playerStore;
    }

    function add(player){
        this.push(new Player(player));
    }

    function removeByName(playerName){
        var players = _.filter(this(), function(player){
            return (player.playerName() !== playerName);
        });

        this(players);
    }

    function setPlayersCardValue(playerName, card){
        var player = _.find(this(), function(player){
            return (player.playerName() === playerName);
        });

        if(player) {
            player.card(card);
        }
    }

    return {
        init: init
    };
})();
},{"./player.js":6}],8:[function(require,module,exports){
module.exports = function(){
    var pageStatus = require('./pageStatus.js');
    var players = require('./players.js');
    var self = this;

    this.status = ko.observable(pageStatus.INIT);

    this.isStatusInit = ko.computed(function(){
        return self.status() === pageStatus.INIT;
    }, true);
    this.isStatusWaiting = ko.computed(function(){
        return self.status() === pageStatus.WAITING;
    }, true);
    this.isStatusInGame = ko.computed(function(){
        return self.status() === pageStatus.INGAME;
    }, true);
    this.isStatusReview = ko.computed(function(){
        return self.status() === pageStatus.REVIEW;
    }, true);

    this.name = ko.observable();

    this.playerName = ko.observable();
    this.isOwner = ko.observable(false);

    this.players = players.init();

    this.itemName = ko.observable().extend({ required:
    {
        message:'Item Name required'
    }});

    this.init = function(data){
        var players = data.room.players || {};

        _.each(players, function(player){
            self.players.add(player);
        });

        if(data.room.itemName){
            self.itemName(data.room.itemName);
        }

        self.name(data.room.roomName);
        self.playerName(data.playerName);
        self.status(data.room.status);
        self.isOwner(data.wasCreate);
    };
};
},{"./pageStatus.js":5,"./players.js":7}],9:[function(require,module,exports){
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

    function cardSelected(card){
        var socket = socketManager.getSocket();
        socket.emit('item.cardSelect', { card: card });
    }

    return {
        initiateItemEstimate: initiateItemEstimate,
        initiateReview: initiateReview,
        initiateEndReview: initiateEndReview,
        cardSelected: cardSelected
    };
})();

},{"../socketManager.js":12}],10:[function(require,module,exports){
module.exports = (function(){
    var socketManager = require('../socketManager.js');
    function joinRoom(roomName, playerName, success, error){
        joinRoomRequest(false, roomName, playerName, success, error);
    }

    function joinRoomRequest(isCreateRequest, roomName, playerName, success, error){
        var socket = socketManager.getSocket();
        socket.once('room.joinConfirm', function(data){
            if(!data.errorMessage){
                success(data);
            } else {
                error(data);
            }
        });

        socket.emit('room.join', {
            name : roomName,
            playerName: playerName,
            isCreateRequest: isCreateRequest
        });
    }

    function createRoom(roomName, playerName, success, error){
        joinRoomRequest(true, roomName, playerName, success, error);
    }

    return {
        joinRoom: joinRoom,
        createRoom: createRoom
    };
})();
},{"../socketManager.js":12}],11:[function(require,module,exports){
module.exports = (function(){
    var socketManager = require('./socketManager.js');
    var notify = require('./notify.js');
    function init(viewModel){
        var socket = socketManager.getSocket();

        socket.on('player.new', function(data){
            notify.playerHasJoinedTheRoom(data.playerName);
            viewModel.room.players.add(data);
        });

        socket.on('item.estimateStarted', function(data){
            viewModel.startItemEstimate(data.itemName);
        });

        socket.on('item.cardSelected', function(data){
            viewModel.room.players.setPlayersCardValue(data.playerName, data.card);
        });

        socket.on('item.showCardsNow', function(){
            viewModel.review();
        });

        socket.on('item.finishReview', function(){
            viewModel.endReview();
        });

        socket.on('player.leave', function(data){
            notify.playerHasLeftTheRoom(data.playerName);
            viewModel.room.players.removeByName(data.playerName);
            var hasBeenPromotedToOwner = data.newHostPlayerName === viewModel.room.playerName() &&
                                            !viewModel.room.isOwner();
            if(hasBeenPromotedToOwner){
                notify.promotionToOwner();
                viewModel.room.isOwner(data.newHostPlayerName === viewModel.room.playerName());
            }
        });
    }

    return {
        init: init
    };
}());
},{"./notify.js":3,"./socketManager.js":12}],12:[function(require,module,exports){
module.exports = (function(){
    var socket;
    function connect() {
        socket = io.connect();
        return socket;
    }

    function getSocket() {
        return socket;
    }

    return {
        connect: connect,
        getSocket:getSocket
    };
})();
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"../../public/js/service/roomService":10,"../../public/js/socketListener":11,"./clientSideMocks":13,"./sinonExtentions":15}],15:[function(require,module,exports){
function getCallByArgs(spy){
    var callCount = spy.callCount;
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < callCount; i++){
        var call = spy.getCall(i);
        var argsMatch = true;
        for(var j = 0; j < args.length; j++){
            if(call.args.length <= j || args[j] !== call.args[j]){
                argsMatch = false;
                break;
            }
        }

        if(argsMatch) {
            return call.args[1];
        }
    }

    return null;
}

var exports = exports || sinon;
exports.getCallByArgs = getCallByArgs;
},{}],16:[function(require,module,exports){
describe('create room', function(){
    var sandbox;
    var helper = require('../../helpers/clientTestHelper');
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var roomService = require('../../../public/js/service/roomService');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        require('../../../public/js/socketManager').connect();
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'message');

        helper.createRoom(page);

        expect(spy.getCall(0).args[0]).toBe('Create Room...');
    });

    it('should call roomService.createRoom when valid', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        helper.createRoom(page);

        expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.playerName('Bob');

        page.createRoomRequest({}, {});

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.createRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'createRoom');
        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.roomName('RoomONe');

        page.createRoomRequest({}, {});

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        helper.createRoom(page);

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'room1';
        helper.createRoom(page, expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });

    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'tim';
        helper.createRoom(page, 'test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should emit room.join with isCreate set to true', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        helper.createRoom(page);

        expect(spy.getCall(0).args[1].isCreateRequest).toBe(true);
    });

    it('should attach once room.joinConfirm', function(){
        var spy = sandbox.spy(socketMock, 'once');
        helper.createRoom(page);

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});
},{"../../../public/js/page":4,"../../../public/js/service/roomService":10,"../../../public/js/socketManager":12,"../../helpers/clientSideMocks":13,"../../helpers/clientTestHelper":14}],17:[function(require,module,exports){
describe('item.initiateItemEstimate', function(){
    var sandbox;
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var initiateItemEstimate = require('../../helpers/clientTestHelper').initiateItemEstimate;
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should emit item.startEstimate', function(){
        var spy = sandbox.spy(socketMock, 'emit');

        initiateItemEstimate(page);

        expect(spy.getCall(0).args[0]).toBe('item.startEstimate');
    });

    it('should emit item.startEstimate with item name', function(){
        var spy = sandbox.spy(socketMock, 'emit');

        initiateItemEstimate(page, 'task one');

        expect(spy.getCall(0).args[1].itemName).toBe('task one');
    });
});
},{"../../../public/js/page":4,"../../helpers/clientSideMocks":13,"../../helpers/clientTestHelper":14}],18:[function(require,module,exports){
describe('item.cardSelected', function(){
    var sandbox;
    var page;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set players card value', function(){
        var expected = '8';
        page.room.players.add({playerName:'Bob', card:'8'});

        helpers.itemCardSelectedHandler(page, {playerName:'Bob', card:expected});

        expect(page.room.players()[0].card()).toBe(expected);
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}],19:[function(require,module,exports){
describe('item.estimateStarted', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageStatus = require('../../../public/js/pageStatus');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room status to INGAME', function(){
        helpers.itemEstimateStartedHandler(page, {itemName:'task 1'});

        expect(page.room.status()).toBe(pageStatus.INGAME);
    });

    it('should set room.itemName', function(){
        helpers.itemEstimateStartedHandler(page, {itemName:'task 1'});

        expect(page.room.itemName()).toBe('task 1');
    });
});

},{"../../../public/js/page":4,"../../../public/js/pageStatus":5,"../../helpers/clientTestHelper":14}],20:[function(require,module,exports){
describe('item.finishReview', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageStatus = require('../../../public/js/pageStatus');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set room.status to WAITING', function(){
        helpers.itemFinishReviewHandler(page);

        expect(page.room.status()).toBe(pageStatus.WAITING);
    });

    it('should clear room.itemName', function(){
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        expect(page.room.itemName()).toBe('');
    });

    it('should set room.itemName.isModified() to false', function(){
        var spy = sandbox.spy(page.room.itemName, 'isModified');
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        expect(spy.calledWith(false)).toBe(true);
    });

    it('should clear all players cards', function(){
        page.room.players.add({playerName:'ted', card:'8'});
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.itemName('task 1');

        helpers.itemFinishReviewHandler(page);

        var anyPlayersWithCardValue = _.some(page.room.players(), function(player){
            return player.card();
        });
        expect(anyPlayersWithCardValue).toBe(false);
    });
});
},{"../../../public/js/page":4,"../../../public/js/pageStatus":5,"../../helpers/clientTestHelper":14}],21:[function(require,module,exports){
describe('item.estimateStarted', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageStatus = require('../../../public/js/pageStatus');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should status to REVIEW', function(){
        helpers.itemShowCardsHandler(page);

        expect(page.room.status()).toBe(pageStatus.REVIEW);
    });

});
},{"../../../public/js/page":4,"../../../public/js/pageStatus":5,"../../helpers/clientTestHelper":14}],22:[function(require,module,exports){
describe('join room confirm', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should call success if there is no errorMessage calls success', function(){
        var successSpy = sinon.spy();
        helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), {});

        expect(successSpy.callCount).toBe(1);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, { errorMessage: 'Error' });

        expect(errorSpy.callCount).toBe(1);
    });

    it('should call success with data', function(){
        var successSpy = sinon.spy();
        var expectedData = {};
        helpers.joinRoomConfirm('test', 'bob', successSpy, sandbox.spy(), expectedData);

        expect(successSpy.getCall(0).args[0]).toBe(expectedData);
    });

    it('should call error if there is errorMessage calls success', function(){
        var errorSpy = sinon.spy();
        var expectedData = { errorMessage: 'error' };
        helpers.joinRoomConfirm('test', 'bob', sandbox.spy(), errorSpy, expectedData);

        expect(errorSpy.getCall(0).args[0]).toBe(expectedData);
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}],23:[function(require,module,exports){
describe('join room failure', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should clear the loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'clearMessage');

        helpers.joinRoomConfirmFailure(page, {});

        expect(spy.callCount).toBe(1);
    });

    it('should set the playerNameError prop to true on player error', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'clearMessage');

        helpers.joinRoomConfirmFailure(page, {errorField:'playerName'});

        expect(page.joinRoomViewModel.errorField()).toBe('playerName');
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}],24:[function(require,module,exports){
describe('join room', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var socketMock = require('../../helpers/clientSideMocks').socketMock;
    var roomService = require('../../../public/js/service/roomService');
    var joinRoom = helpers.joinRoom;
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
       sandbox.restore();
    });

    it('should set loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'message');

        joinRoom(page);

        expect(spy.getCall(0).args[0]).toBe('Joining Room...');
    });

    it('should call roomService.joinRoom when valid', function(){
       var spy = sandbox.spy(roomService, 'joinRoom');
       joinRoom(page);

       expect(spy.callCount).toBe(1);
    });

    it('should not call roomService.joinRoom when room name not supplied', function(){
        var spy = sandbox.spy(roomService, 'joinRoom');

        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.playerName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should not call roomService.joinRoom when playerName not supplied', function(){
        var spy = sandbox.spy(roomService, 'joinRoom');

        var page = new pageConstructor.constructor();
        page.joinRoomViewModel.roomName('Bob');
        page.joinRoomRequest();

        expect(spy.callCount).toBe(0);
    });

    it('should emit room.join', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        joinRoom(page);

        expect(spy.getCall(0).args[0]).toBe('room.join');
    });

    it('should emit room.join with correct room name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'room1';
        joinRoom(page, expected);

        expect(spy.getCall(0).args[1].name).toBe(expected);
    });

    it('should emit room.join with correct player name', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        var expected = 'tim';
        joinRoom(page, 'test', expected);

        expect(spy.getCall(0).args[1].playerName).toBe(expected);
    });

    it('should emit room.join with isCreate set to false', function(){
        var spy = sandbox.spy(socketMock, 'emit');
        joinRoom(page);

        expect(spy.getCall(0).args[1].isCreateRequest).toBe(false);
    });

    it('should attach on room.joinConfirm', function(){
        var spy = sandbox.spy(socketMock, 'once');
        joinRoom(page);

        expect(spy.calledWith('room.joinConfirm')).toBe(true);
    });
});
},{"../../../public/js/page":4,"../../../public/js/service/roomService":10,"../../helpers/clientSideMocks":13,"../../helpers/clientTestHelper":14}],25:[function(require,module,exports){
describe('join room success', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should clear the loading message', function(){
        var spy = sandbox.spy(page.loadMessageViewModel, 'clearMessage');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.callCount).toBe(1);
    });

    it('should add listener for player.new', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('player.new')).toBe(true);
    });

    it('should add listener for item.estimateStarted', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.estimateStarted')).toBe(true);
    });

    it('should add listener for item.cardSelected', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.cardSelected')).toBe(true);
    });

    it('should add listener for item.showCardsNow', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.showCardsNow')).toBe(true);
    });

    it('should add listener for item.finishReview', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('item.finishReview')).toBe(true);
    });

    it('should add listener for player.leave', function(){
        var spy = sandbox.spy(socketMock, 'on');

        helpers.joinRoomConfirmSuccess(page, {room:{}});

        expect(spy.calledWith('player.leave')).toBe(true);
    });

    it('should set room name', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ roomName: expected}});

        expect(page.room.name()).toBe(expected);
    });

    it('should set player name', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ }, playerName: expected});

        expect(page.room.playerName()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ status:expected }});

        expect(page.room.status()).toBe(expected);
    });

    it('should set status', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ status:expected }});

        expect(page.room.status()).toBe(expected);
    });

    it('should set isOwner', function(){
        helpers.joinRoomConfirmSuccess(page, {room:{ }, wasCreate:true });

        expect(page.room.isOwner()).toBe(true);
    });

    it('should set itemName', function(){
        var expected = 'test';

        helpers.joinRoomConfirmSuccess(page, {room:{ itemName:expected }});

        expect(page.room.itemName()).toBe(expected);
    });

    it('should set itemName', function(){
        var expected = 'ted';

        helpers.joinRoomConfirmSuccess(page, {room:{ players:{ted:{playerName:expected}}}});

        expect(page.room.players().length).toBe(1);
        expect(page.room.players()[0].playerName()).toBe(expected);
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}],26:[function(require,module,exports){
describe('player.new', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should set new player name', function(){
        helpers.playerNewHandler(page, {playerName:'bob', card:'8'});

        expect(page.room.players()[0].playerName()).toBe('bob');
    });

    it('should set new player card', function(){
        helpers.playerNewHandler(page, {playerName:'bob', card:'8'});

        expect(page.room.players()[0].card()).toBe('8');
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}],27:[function(require,module,exports){
describe('player.leave', function(){
    var sandbox;
    var helpers = require('../../helpers/clientTestHelper');
    var pageConstructor = require('../../../public/js/page');
    var page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        page = new pageConstructor.constructor();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('should remove correct player', function(){
        page.room.players.add({playerName:'ted', card:'8'});
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'tom', card:'5'});
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob'});

        var player = _.filter(page.room.players(), function(player){
            return player.playerName() === 'bob';
        });

        expect(player.length).toBe(0);
    });

    it('should set is owner to true if new owner matches current user', function(){
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'ted', card:'5'});
        page.room.playerName('ted');
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob', newHostPlayerName:'ted'});

        expect(page.room.isOwner()).toBe(true);
    });

    it('should set is owner to false if new owner does not match current user', function(){
        page.room.players.add({playerName:'bob', card:'5'});
        page.room.players.add({playerName:'ted', card:'5'});
        page.room.playerName('tom');
        page.room.itemName('task 1');

        helpers.playerLeaveHandler(page, {playerName:'bob', newHostPlayerName:'ted'});

        expect(page.room.isOwner()).toBe(false);
    });
});
},{"../../../public/js/page":4,"../../helpers/clientTestHelper":14}]},{},[16,17,18,19,20,21,22,23,24,25,26,27]);
