var socket_io;
function init(io){
    socket_io = io;
}

function getIO(){
    return socket_io;
}

exports.init = init;
exports.getIO = getIO;
