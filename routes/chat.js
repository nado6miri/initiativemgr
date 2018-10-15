var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

const socket_server = http.createServer((req, res) => { }).listen(5555);
// upgrade http server to socket.io server
var io = require('socket.io').listen(socket_server);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' }); // header 설정
  fs.readFile('./views/round0.html', (err, data) => { // 파일 읽는 메소드
  //fs.readFile('./views/chat.html', (err, data) => { // 파일 읽는 메소드
      if (err) {
          return console.error(err); // 에러 발생시 에러 기록하고 종료
      }
      res.end(data, 'utf-8'); // 브라우저로 전송   
  });
});


// http://bcho.tistory.com/899 
io.sockets.on('connection', function (socket) {
  socket.on('clientcmd', function (data) {
      var cmd = data.msg;
      if ("first" == cmd) {
          socket.emit('insert_first', { msg: '[Round0] New Contribution... Insert row First !!' });
          console.log('insert first row :' + data.msg);
      }
      else if ("last" == cmd) {
          socket.emit('insert_last', { msg: '[Round0] New Contribution... Insert row Last !!' });
          console.log('insert last row :' + data.msg);
      }
      else {
          testnet_config.keyProvider = ['5KPdP9wjD7hPdNcYeWZ2JLjEnf4kuwwTrJpHQ2fDxaNrm2gCvrc']
          var list = get_table(Eos(testnet_config), "goldenbucket", 'goldenbucket', 'roundinfos', 'id');
          socket.emit('insert_first', { msg: '[Round0] Get Contribution List OK...... update row !!' });
          console.log("list return value = ");
          console.log(list);
      }
      console.log('Message from client :' + data.msg);
  });
});


module.exports = router;
