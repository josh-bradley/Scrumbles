require('./components/game-card');
var ko = require('knockout');

var viewModel = require('./page.js');
ko.applyBindings(viewModel);

if('serviceWorker' in navigator) {
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/sw.js')
            .catch(function(err){
                console.log('service worker failed error: ' + err);
            });
    });
}