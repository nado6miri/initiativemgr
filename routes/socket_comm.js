var http = require('http');
var socket_server = 0;

// http://bcho.tistory.com/899 
function socket_communication()
{
    if(socket_server == 0)
    {
        console.log("Initialize socket communication");
        socket_server = http.createServer((req, res) => { }).listen(5555);
        // upgrade http server to socket.io server
        var socketcommm = require('socket.io').listen(socket_server);

        socketcommm.sockets.on('connection', function (socket) {
        socket.on('clientcmd', function (data) {
            var cmd = data.msg;
            if ("fromclient" == cmd) {
                socket.emit('toclient', { msg: '[fromclient] New Contribution... Insert row First !!' });
                console.log('toclient :' + data.msg);
            }
            else if ("initiative_lists" == cmd) {
                socket.emit('toclient', { msg: '[initiative_lists] New Contribution... Insert row Last !!' });
                console.log('toclient :' + data.msg);
            }
            else {
            }
            console.log('Message from client :' + data.msg);
           });
        });
    }
    else{
        console.log("Already opened socket communication - Skip Initializing socket communication");
    }
}

module.exports = socket_communication;
