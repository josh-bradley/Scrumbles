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

(function(){
    console.log('----------------');
})();

var exports = exports || sinon;

exports.getCallByArgs = getCallByArgs;