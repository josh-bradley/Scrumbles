var ko = require('knockout');

module.exports = function(){
    var self = this;
    this.message = ko.observable();
    this.show = ko.pureComputed(function(){
        return this.message();
    }, this);
    this.clearMessage = function(){
        self.message(undefined);
    };
};