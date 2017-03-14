require('./components/game-card');
var ko = require('knockout');

var viewModel = require('./page.js');
ko.applyBindings(viewModel);