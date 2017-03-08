//window.onload = function(){
    require('./components/game-card');
    require('./socketManager.js').connect();

    var viewModel = require('./page.js');
    ko.applyBindings(viewModel);
//};