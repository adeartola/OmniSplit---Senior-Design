var debug = require('debug')('orderly-comms:socket.io');
var Rooms = require('./rooms');

var Chat = function(io) {
    var rooms = new Rooms();

    io.on('connection', function(socket) {
        socket.room = '';

        debug('Client ' + socket.id + ' connected.');

        socket.on('createOrJoin', function(roomName, callback) {
            var personID = socket.id;
            if (rooms.roomExists(roomName)) { //Just join existing room
                rooms.addPerson(personID, roomName, function(err) {
                    if (err) {
                        debug(err);
                        return callback(err);
                    }
                    else {
                        socket.join(roomName);
                        socket.room = roomName;
                        socket.broadcast.to(socket.room).emit('update', rooms._rooms[roomName]);
                        debug('Person ' + personID + ' joined room ' + roomName + '.');
                        return callback(null, rooms._rooms[roomName]);
                    }
                });
            }
            else { //Room does not exist, create then join room
                rooms.addRoom(roomName, function(err) {
                    if (err) {
                        debug(err);
                        return callback(err);
                    }
                    else {
                        debug('Room ' + roomName + ' added.');
                        rooms.addPerson(personID, roomName, function(err) {
                            if (err) {
                                debug(err);
                                return callback(err);
                            }
                            else {
                                socket.join(roomName);
                                socket.room = roomName;
                                debug('Person ' + personID + ' joined room ' + roomName + '.');
                                return callback(null, rooms._rooms[roomName]);
                            }
                        });
                    }
                });
            }
        });

        socket.on('leaveRoom', function(callback) {
            var personID = socket.id;
            rooms.removePerson(personID);
            socket.broadcast.to(socket.room).emit('update', rooms._rooms[socket.room]);
            socket.leave(socket.room);
            socket.room = '';
            debug('Person ' + personID + ' left.');
            return callback(null);
        });

        socket.on('disconnect', function() {
            var personID = socket.id;
            rooms.removePerson(personID);
            socket.broadcast.to(socket.room).emit('update', rooms._rooms[socket.room]);
            socket.leave(socket.room);
            socket.room = '';
            debug('Client ' + personID + ' disconnected.');
        });
    })
};

module.exports = Chat;
