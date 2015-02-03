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