var fs = require('fs');
var infostream = fs.createWriteStream(__dirname + '/logs/info.txt');
var errorStream = fs.createWriteStream(__dirname + '/logs/error.txt');
var debugStream = fs.createWriteStream(__dirname + '/logs/debug.txt');
var info = function (msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    infoStream.write(message);
};
var debug = function (msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    debugStream.write(message);

};
var error = function (msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    errorStream.write(message);
};

exports.Logger = {
    "info": info,
    "debug": debug,
    "error": error
};
