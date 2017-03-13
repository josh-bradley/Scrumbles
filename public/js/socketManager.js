module.exports = (function(){
    var socket;
    function connect() {
        socket = io.connect();
        return socket;
    }

    function getSocket() {
        if(!socket)
            connect();
        return socket;
    }

    return {
        connect: connect,
        getSocket:getSocket
    };
})();