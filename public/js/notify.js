var Scrumbles = Scrumbles || {};
Scrumbles.notify = (function(){
    function playerHasJoinedTheRoom(playerName){
        alertify.log("Player " + playerName + " has joined the room");
    }

    function playerHasLeftTheRoom(playerName){
        alertify.log("Player " + playerName + " has left the room");
    }

    function joinedRoom(roomName){
        alertify.success("Joined room " + roomName);
    }

    function promotionToOwner(){
        alertify.log("You are now the owner of the room");
    }

    return {
        playerHasJoinedTheRoom: playerHasJoinedTheRoom,
        joinedRoom: joinedRoom,
        promotionToOwner: promotionToOwner,
        playerHasLeftTheRoom: playerHasLeftTheRoom
    };
})();