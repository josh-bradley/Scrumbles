var socketMock = { on: function(){}, emit: function(){}, once: function(){} };
var io = {
    connect: function(str){
        return socketMock;
    }
};

io.connect();