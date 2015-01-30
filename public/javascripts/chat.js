var socket = io.connect('https://172.16.85.47');
var createOrJoin = function(groupName, callback) {
    socket.emit('check', groupName, function(match) {
        if(match) {
            console.log('MATCHED');
            socket.emit('joinRoom', groupName, function(joined, people) {
                if (joined) {
                    console.log('JOINED, ' + JSON.stringify(people));
                    return callback(null, people);
                }
                else
                    return callback(new Error('Room does not exist.'));
            });
        }
        else {
            console.log('NOT MATCHED');
            socket.emit('createRoom', groupName, function(created) {
                if (created) {
                    socket.emit('joinRoom', groupName, function(joined, people) {
                        if (joined) {
                            console.log('CREATED AND JOINED' + JSON.stringify(people));
                            return callback(null, people);
                        }
                        else {
                            return callback(new Error('Could not join room.'));
                        }
                    });
                }
                else {
                    return callback(new Error('Room already exists.'));
                }
            });
        }
    });
};

var room = 'meow';
createOrJoin('meow', function(err, result) {
    if (err)
        console.log(err);
    else {
        console.log(JSON.stringify(result));
    }
});
