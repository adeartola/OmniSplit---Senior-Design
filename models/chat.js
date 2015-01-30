var debug = require('debug')('orderly-comms:socket.io');
var Rooms = require('./rooms');

var Chat = function(io) {
    var rooms = new Rooms();

    io.on('connection', function(socket) {
        debug('Client ' + socket.id + ' connected.');

        socket.on('check', function(roomName, callback) {
            //Check if room exists
            return callback(rooms.roomExists(roomName));
        });

        socket.on('createRoom', function(roomName, callback) {
            rooms.addRoom(roomName, function(didAdd) {
                return callback(didAdd);
            });
        });

        socket.on('joinRoom', function(roomName, callback) {
            var personID = socket.id;
            rooms.addPerson(personID, roomName, function(didAdd) {
                return callback(didAdd, rooms.getRoom(roomName));
            });
        });

        socket.on('disconnect', function() {
            rooms.removePerson(socket.id);
            debug('Client ' + socket.id + ' disconnected.');
        });
    })
};

module.exports = Chat;
