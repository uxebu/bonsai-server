var bonsai = require('bonsai');
var fs = require('fs');
var socketIo = require('socket.io');
var requirejs = bonsai.requirejs;

var bonsaiCode = fs.readFileSync('./example/movie.js');

var socketIoRenderer = function(socket) {
  this.socket = socket;
};

var io = socketIo.listen(3000);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

  // create a new stage for every new connection
  requirejs.config({
    paths: {}
  });
  var movie = bonsai.setup({}).run(null, {
    code: bonsaiCode,
    plugins: []
  });

  movie.runnerContext.on('message', function() {
    socket.emit('message', arguments);
  });
  socket.on('message', function(msg) {
    movie.runnerContext.notifyRunner(msg);
  });

  socket.on('disconnect', function () {
    movie.destroy();
  });

});

