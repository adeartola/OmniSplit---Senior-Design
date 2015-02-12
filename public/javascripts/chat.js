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

$(document).ready(function() {
    var room = {};
    var socket = io.connect('https://localhost');

    socket.on('update', function(newRoom) {
        console.log('UPDATE: ' + JSON.stringify(newRoom));
        room = newRoom;
    });

    $('#meow').click(function() {
        if (isEquivalent(room, {})) {
            socket.emit('createOrJoin', 'meow', function(err, newRoom) {
                if (err)
                    console.error('Could not create or join room "meow"');
                else {
                    room = newRoom;
                    console.log('ROOM: ' + JSON.stringify(newRoom));
                }
            });
        }
    });
    
    $('#potato').click(function() {
        if (isEquivalent(room, {})) {
            socket.emit('createOrJoin', 'potato', function(err, newRoom) {
                if (err)
                    console.error('Could not create or join room "potato"');
                else {
                    room = newRoom;
                    console.log('ROOM: ' + JSON.stringify(newRoom));
                }
            });
        }
    });
    
    $('#leave').click(function() {
        if (!isEquivalent(room, {})) {
            socket.emit('leaveRoom', function(err) {
                if (err)
                    console.error('Failed to leave room');
                else {
                    room = {};
                }
            });
        }
    });
});
