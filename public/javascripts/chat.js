var socket = io.connect('https://localhost');

$(document).ready(function() {
    $('#meow').click(function() {
        socket.emit('createOrJoin', 'meow', function(err, room) {
            if (err)
                console.log(err);
            else
                console.log('ROOM: ' + JSON.stringify(room));
        })
    });
    
    $('#potato').click(function() {
        socket.emit('createOrJoin', 'potato', function(err, room) {
            if (err)
                console.log(err);
            else
                console.log('ROOM: ' + JSON.stringify(room));
        })
    });
    
    $('#leave').click(function() {
        socket.emit('leaveRoom');
    });
});
