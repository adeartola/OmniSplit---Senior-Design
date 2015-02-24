/* Group of rooms containing people */

var debug = require('debug')('omnisplit:rooms');

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function Rooms() {
    var _people = {}; //_people[personID] = roomName
    this._rooms = {}; //this._rooms[roomName] = { people: [], order: [] }

    this.person = function(personName) {
        return _people[personName];
    }

    this.personExists = function(person) {
        return (_people[person] != undefined);
    }

    this.addPerson = function(personID, room, callback) {
        if (this.personExists(personID))
            return callback(new Error('Person ' + personID + ' already exists.'));
        else if (!this.roomExists(room))
            return callback(new Error('Room ' + room + ' does not exist.'));
        else {
            _people[personID] = room;
            this._rooms[room].people.push(personID);
            debug('Added ' + personID + ' to room \"' + room + '\"');
            return callback();
        }
    }

    this.removePerson = function(personID) {
        if (this.personExists(personID)) {
            var room = this.person(personID);
            var index = this._rooms[room].people.indexOf(personID);
            this._rooms[room].people.splice(index, 1); //Remove personID from room listing
            delete _people[personID]; //Remove personID from people
            debug('Removed person ' + personID);
        }
    }
}

Rooms.prototype.room = function(room) {
    return this._rooms[room];
};

Rooms.prototype.getPeople = function(room) {
    if (!this._rooms[room])
        return null;
    else
        return this._rooms[room].people;
}

Rooms.prototype.getOrder = function(room) {
    if (!this._rooms[room])
        return null;
    else
        return this._rooms[room].order;
}

Rooms.prototype.roomExists = function(room) {
    return !(this._rooms[room] == undefined || this._rooms[room] == {});
};

Rooms.prototype.inRoom = function(personID, room) {
    if (!this.roomExists(room) || !this.personExists(personID) || this.person(personID) != room)
        return false;
    return true;
};

Rooms.prototype.addRoom = function(room, callback) {
    if (!this.roomExists(room)) {
        this._rooms[room] = {};
        this._rooms[room].people = [];
        this._rooms[room].order = [];
        debug('Added room \"' + room + '\"');
        return callback();
    }
    return callback(new Error('Room ' + room + ' already exists.'));
};

Rooms.prototype.addItem = function(room, item, callback) {
    if (!this.roomExists(room))
        return callback(new Error('Room ' + room + ' does not exist.'));
    else {
        this._rooms[room].order.push(item);

        return callback(null);
    }
};

Rooms.prototype.removeItem = function(room, item, callback) {
    if (!this.roomExists(room))
        return callback(new Error('Room ' + room + ' does not exist.'));
    else {
        for (id in this._rooms[room].order) {
            if (isEquivalent(item, this._rooms[room].order[id])) {
                this._rooms[room].order.splice(id, 1);
                return callback(null);
            }
        }
        return callback(null);
    }
};

module.exports = Rooms;
