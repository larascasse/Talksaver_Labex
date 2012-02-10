var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('connect', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('addEvent', function (data) {
	    console.log(data);
	    socket.emit('addEvent', data);

  });
});