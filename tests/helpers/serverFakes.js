var expressFake = function(){
    return {use: function(){}};
};

expressFake.static = function(){};

var httpFake = {
    createServer: function(){
        return { listen: function(){}};
    }
};


var broadcastToEmitFake = {
    emit: function(){
    }
}

var SocketMock = function(){
    this.join = function(){},
    this.broadcast= {
        to: function(){
            return broadcastToEmitFake;
        }
    },
    this.emit= function(){

    },
    this.scrumbles= {},
    this.on = function(){},
    this.id = 'id'
}

var socketFake = {
    join: function(){},
    broadcast: {
        to: function(){
            return broadcastToEmitFake;
        }
    },
    emit: function(){

    },
    scrumbles: {},
    id: 'id',
    on: function(){}
};

var roomFake = {
};

var roomsFake = {
    createRoom: function(){
        return roomFake;
    },
    joinRoom: function(){
        return roomFake;
    },
    doesRoomExist: function(){
        return false;
    },
    setPlayerCard: function(){

    },
    roomStatus: { INIT:0, WAITING:0, INGAME:2, REVIEW:2 }
};

var ioObjectFake = {
    on: function(){},
    sockets: { in: function(){ return {emit:function(){}}}, sockets:{id:new SocketMock()} }
};
var socketio_fake = {
    listen: function(){
        return ioObjectFake;
    }
};

var mocks = {
    expressFake: expressFake,
    httpFake: httpFake,
    socketio_fake: socketio_fake,
    socketFake: socketFake,
    roomsFake: roomsFake,
    roomFake: roomFake,
    ioObjectFake: ioObjectFake,
    broadcastToEmitFake : broadcastToEmitFake,
    SocketMock: SocketMock
}

exports.mocks = mocks;