/* Group of rooms containing people */

var debug = require('debug')('orderly-comms:Rooms');

function Rooms() {
    this.people = {}; //this.people[personID] = roomName
    this.rooms = {}; //this.room[roomName] = [ personID ]
}

Rooms.prototype.personExists = function(person) {
    return (this.people[person] != undefined);
}

Rooms.prototype.roomExists = function(room) {
    return (this.rooms[room] != undefined);
}

Rooms.prototype.inRoom = function(personID, room) {
    if (!this.roomExists(room) || !this.personExists(personID) || this.people[personID] != room)
        return false;
    return true;
}

Rooms.prototype.addRoom = function(room, callback) {
    if (!this.roomExists(room)) {
        this.rooms[room] = new Array();
        debug('Added room \"' + room + '\"');
        return callback();
    }
    return callback(new Error('Room ' + room + ' already exists.'));
}

Rooms.prototype.addPerson = function(personID, room, callback) {
    if (this.personExists(personID))
        return callback(new Error('Person ' + personID + ' already exists.'));
    else if (!this.roomExists(room))
        return callback(new Error('Room ' + room + ' does not exist.'));
    else {
        this.people[personID] = room;
        this.rooms[room].push(personID);
        debug('Added ' + personID + ' to room \"' + room + '\"');
        return callback();
    }
}

Rooms.prototype.removePerson = function(personID) {
    if (this.personExists(personID)) {
        var room = this.people[personID];
        var index = this.rooms[room].indexOf(personID);
        this.rooms[room].splice(index, 1); //Remove personID from room listing
        delete this.people[personID]; //Remove personID from people
        debug('Removed person ' + personID);
    }
}

Rooms.prototype.getRoom = function(room) {
    return this.rooms[room];
}

module.exports = Rooms;
