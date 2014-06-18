describe('item.cardSelect', function(){
    /*it('should broadcast item.cardSelected when status INGAME', function(){
     var handler = getCardSelectHandler();
     var emitSpy = sandbox.spy();
     var room = rooms.joinRoom('test', 'bob');
     room.status = roomStatus.INGAME;
     sandbox.stub(fakes.ioObjectFake.sockets, 'in').returns( {emit: emitSpy});

     handler({card: 8, roomName:'test', playerName: 'bob'}, room);

     expect(emitSpy.calledWith('item.cardSelected')).toBe(true);
     });


     it('should not broadcast item.cardSelected when status is INIT', function(){
     var handler = getCardSelectHandler();
     var emitSpy = sandbox.spy();
     var toSpy = sandbox.stub(fakes.socketFake.broadcast, 'to').returns( {emit: emitSpy});
     fakes.roomFake.status = 0;

     handler({card: 8});

     expect(toSpy.calledWith('test')).toBe(false);
     });

     it('should not broadcast item.cardSelected when status is REVIEW', function(){
     var handler = getCardSelectHandler();
     var emitSpy = sandbox.spy();
     var toSpy = sandbox.stub(fakes.socketFake.broadcast, 'to').returns( {emit: emitSpy});
     fakes.roomFake.status = 2;

     handler({card: 8});

     expect(toSpy.calledWith('test')).toBe(false);
     });

     it('should not broadcast item.cardSelected when status is REVIEW', function(){
     var room = rooms.createRoom('test');
     room.status = roomStatus.REVIEW;
     var handler = getCardSelectHandler();

     handler({roomName: 'test', playerName:'bob', card: 8}, room);

     expect(room.players.length).toBe(0);
     });*/
});