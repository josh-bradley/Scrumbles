function createUser(name){
    return new User(name);
}

function User(name){

    function setCardNumber(cardNumber){

    }

    this.setCardNumber = setCardNumber;
}

exports.createUser = createUser;