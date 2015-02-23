var debug = require('debug')('orderly-server:socket.io');
var Rooms = require('./rooms');
var Menu  = require('../models/menu');

var Chat = function(io) {
    var rooms = new Rooms();

    io.on('connection', function(socket) {
        socket.room = '';

        debug('Client ' + socket.id + ' connected.');

        socket.on('create or join', function(roomName, callback) {
            //Either (1) create a new room and join it, or (2) join an existing room and update others in the room
            var personID = socket.id;
            if (rooms.roomExists(roomName)) { //Just join existing room
                rooms.addPerson(personID, roomName, function(err) {
                    if (err) {
                        debug(err.stack);
                        return callback(err);
                    }
                    else {
                        socket.join(roomName);
                        socket.room = roomName;
                        socket.broadcast.to(socket.room).emit('update people', rooms.room(roomName));
                        debug('Person ' + personID + ' joined room ' + roomName + '.');
                        return callback(null, rooms.room(roomName));
                    }
                });
            }
            else { //Room does not exist, create then join room
                rooms.addRoom(roomName, function(err) {
                    if (err) {
                        debug(err.stack);
                        return callback(err);
                    }
                    else {
                        debug('Room ' + roomName + ' added.');
                        rooms.addPerson(personID, roomName, function(err) {
                            if (err) {
                                debug(err.stack);
                                return callback(err);
                            }
                            else {
                                socket.join(roomName);
                                socket.room = roomName;
                                debug('Person ' + personID + ' joined room ' + roomName + '.');
                                return callback(null, rooms.room(roomName));
                            }
                        });
                    }
                });
            }
        });

        socket.on('add item', function(item, callback) {
            //Add item to cart
            rooms.addItem(socket.room, item, function(err) {
                if (err) {
                    debug(err.stack);
                    return callback(err);
                }
                else {
                    socket.broadcast.to(socket.room).emit('update order', rooms.getOrder(socket.room));
                    debug('Added new item to order');
                    return callback(null, rooms.getOrder(socket.room));
                }
            });
        });

        socket.on('leave room', function(callback) {
            //Leave room and update others in room
            var personID = socket.id;
            rooms.removePerson(personID);
            socket.broadcast.to(socket.room).emit('update people', rooms.getPeople(socket.room));
            socket.leave(socket.room);
            socket.room = '';
            debug('Person ' + personID + ' left.');
            return callback(null);
        });

        socket.on('disconnect', function() {
            //Leave room and update others in room
            var personID = socket.id;
            rooms.removePerson(personID);
            socket.broadcast.to(socket.room).emit('update people', rooms.getPeople(socket.room))
            socket.leave(socket.room);
            socket.room = '';
            debug('Client ' + personID + ' disconnected.');
        });
    })
};

module.exports = Chat;
