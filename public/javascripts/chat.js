var socket = io.connect('https://localhost');
var createRoom = function(groupName, callback) {
    socket.emit('check', groupName, function(match) {
        if(match) {
            return callback(new Error('Group name already exists.'));
        }
        else {
            socket.emit('createRoom', groupName);
            return callback();
        }
    });
};

var room = 'meow';
createRoom('meow', function(err) {
    if (err)
        console.log(err);
    else
        console.log('done');
});
createRoom('meow', function(err) {
    if (err)
        console.log(err);
    else
        console.log('done');
});
