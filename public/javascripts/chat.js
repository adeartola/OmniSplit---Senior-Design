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

    socket.on('update people', function(newPeople) {
        console.log('UPDATE PEOPLE: ' + JSON.stringify(newPeople));
        room.people = newPeople;
    });

    socket.on('update order', function(newOrder) {
        console.log('UPDATE ORDER: ' + JSON.stringify(newOrder));
        room.order = newOrder;
        $('#group-order').text(JSON.stringify(newOrder));
    });

    $('#meow').click(function() {
        if (isEquivalent(room, {})) {
            socket.emit('create or join', 'meow', function(err, newRoom) {
                if (err)
                    console.error('Could not create or join room "meow"');
                else {
                    room = newRoom;
                    console.log('ROOM: ' + JSON.stringify(newRoom));
                    $('#group-order').text(JSON.stringify(newRoom.order));
                    
                }
            });
        }
    });
    
    $('#potato').click(function() {
        if (isEquivalent(room, {})) {
            socket.emit('create or join', 'potato', function(err, newRoom) {
                if (err)
                    console.error('Could not create or join room "potato"');
                else {
                    room = newRoom;
                    console.log('ROOM: ' + JSON.stringify(newRoom));
                    $('#group-order').text(JSON.stringify(newRoom.order));
                }
            });
        }
    });

    $('#add-item').click(function() {
        var itemToAdd = $('#add-item-val').val();
        if (itemToAdd) {
            $('#add-item-val').val('');
            socket.emit('add item', eval('(' + itemToAdd + ')'), function(err, order) {
                room.order = order;
                $('#group-order').text(JSON.stringify(room.order));
            });
        }
    });

    $('#remove-item').click(function() {
        var itemToRemove = $('#remove-item-val').val();
        if (itemToRemove) {
            $('#remove-item-val').val('');
            socket.emit('remove item', eval('(' + itemToRemove + ')'), function(err, order) {
                room.order = order;
                $('#group-order').text(JSON.stringify(room.order));
            });
        }
    });
    
    $('#leave').click(function() {
        if (!isEquivalent(room, {})) {
            socket.emit('leave room', function(err) {
                if (err)
                    console.error('Failed to leave room');
                else {
                    room = {};
                    $('#group-order').text('');
                }
            });
        }
    });
});
