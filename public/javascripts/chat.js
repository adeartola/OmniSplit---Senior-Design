var socket = io.connect('https://172.16.85.47');

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
        socket.emit('createOrJoin', 'meow', function(err, room) {
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
