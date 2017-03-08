module.exports = function(){
    var requiredValidator = require('./customValidators/customValidators').requiredValidator;
    var self = this;

    this.playerNameErrorMessage = ko.observable();

    this.errorField = ko.observable('');

    this.roomName = ko.observable()
                        .extend({validation:{
                            validator: requiredValidator,
                            message: 'Room name required'
                        }})
                        .extend({validation:{
                            validator:function(){
                                return !self.errorField || self.errorField() !== 'roomName';
                            },
                            message: 'Room name already in use.'
                        }});
    this.playerName = ko.observable()
                            .extend({validation:{
                                validator: requiredValidator,
                                message: 'Player name required'
                            }})
                            .extend({validation:{
                                validator:function(){
                                    return !self.errorField || self.errorField() !== 'playerName';
                                },
                                message: 'Player name already in use.'
                            }});
};