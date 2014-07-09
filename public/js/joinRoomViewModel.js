var Scrumbles = Scrumbles || {};
Scrumbles.joinRoomViewModel = function(){
    var self = this;

    this.playerNameErrorMessage = ko.observable();

    this.errorField = ko.observable('');

    this.roomName = ko.observable()
        .extend({ required:{message:'Room Name required'} })
        .extend({validation:{
            validator:function(){
                return !self.errorField || self.errorField() !== 'roomName';
            },
            message: 'Room name already in use.'
        }});
    this.playerName = ko.observable()
                            .extend({ required:{ message:'Name required' }  })
                            .extend({validation:{
                                validator:function(){
                                    return !self.errorField || self.errorField() !== 'playerName';
                                },
                                message: 'Player name already in use.'
                            }});
};