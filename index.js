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

// create a new stage for every new connection
requirejs.config({
  paths: {}
});

var s = new Show(bonsaiCode);

io.sockets.on('connection', function (socket) {
  s.addConnection(socket);
});

function Show(code) {
  var self = this;

  this.counter = 0;
  this.connections = {};

  this.movie = bonsai.setup({}).run(null, {
    code: bonsaiCode,
    plugins: ['marker.js']
  });

  var sendTo = io.sockets;

  this.movie.runnerContext.on('message', function() {
    var messages = {};
    var args = arguments[0];
    args.data.forEach(function(message, index) {
      if (message.marker) {
        var marker = message.marker;
        if (!messages[marker.id]) { 
          messages[marker.id] = {};

          for (var a in args) {
            messages[marker.id][a] = args[a];  
          }
          
          messages[marker.id].data = [];
        }
        
        // Remove item with marker and push to messages.data array
        messages[marker.id].data.push(args.data.splice(index, 1)[0]);
      }
    });

    // Broadcast to all clients
    io.sockets.emit('message', arguments);

    // Broadcast to single clients
    for (var id in messages) {
      self.connections[id].emit('message', [messages[id]]);
    }
  });

}

Show.prototype.addConnection =function(socket) {
  var self = this;

  this.counter++;
  this.connections[this.counter] = socket;
  socket._movieId = this.counter;


  socket.on('message', function(msg) {
    if (self.movie.runnerContext) {
      self.movie.runnerContext.notifyRunner(msg);
    }
  });

  socket.on('disconnect', function() {
    delete self.connections[socket._movieId];
  });

  this.movie.sendMessage('init', {
    id: this.counter
  });
};
