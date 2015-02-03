window.onload = function(){
    require('./socketManager.js').connect();

    var viewModel = require('./page.js');
    ko.applyBindings(viewModel);
};