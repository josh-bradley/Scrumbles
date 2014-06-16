var Scrumbles = Scrumbles || {};
Scrumbles.joinRoomViewModel = function(){
    var self = this;

    this.playerNameErrorMessage = ko.observable();

    this.roomName = ko.observable()
        .extend({ required:{message:'Room Name required'} });
    this.playerName = ko.observable()
                            .extend({ required:{ message:'Name required' }  })
                            .extend({validation:{
                                validator:function(){
                                    return !self.playerNameErrorMessage() || self.playerNameErrorMessage().length === 0;
                                },
                                message: 'Player name already in use.'
                            }});
};