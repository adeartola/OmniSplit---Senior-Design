var debug = require('debug')('orderly-comms:socket.io');

var Chat = function(io) {
    var people = {};
    var rooms = {};

    io.on('connection', function(socket) {
        debug('Client connected.');
        socket.on('check', function(room, callback) {
            //Check if room exists
            
            for (name in rooms) {
                if (name === room) {
                    return callback(true);
                }
            }
            return callback(false);
        });
    })
};

module.exports = Chat;
