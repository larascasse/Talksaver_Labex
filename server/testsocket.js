var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('connect', { hello: 'world' });
  socket.on('addEvent', function (data) {
	    console.log(data);
	    socket.broadcast.emit('addEvent', data);

  });
  socket.on('message', function(data) {
      socket.broadcast.send(data);
  });
});