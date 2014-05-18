window.onload = function(){
      Scrumbles.socketManager.connect();
    var viewModel = Scrumbles.page;
    ko.applyBindings(viewModel);
};