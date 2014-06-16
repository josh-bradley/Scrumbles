var Scrumbles = Scrumbles || {};
Scrumbles.LoadMessageViewModel = function(){
    var self = this;
    this.message = ko.observable();
    this.show = ko.computed(function(){
        return self.message();
    }, true);
    this.clearMessage = function(){
        self.message(undefined);
    };
};