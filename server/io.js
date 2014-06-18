var socket_io;
function init(io){
    socket_io = io;
}

function getIO(){
    return socket_io;
}

function getSocketById(socketId){
    return socket_io.sockets.sockets[socketId];
}

exports.init = init;
exports.getIO = getIO;
exports.getSocketById = getSocketById;