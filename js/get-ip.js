var os = require('os');

module.exports = function() {
    var interfaces = os.networkInterfaces();
    for (k in interfaces) {
        for (k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal)
                return address.address;
        }
    }
}
