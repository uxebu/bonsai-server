bonsai server
=============

This package provides a [socket.io][]-based server that is capable to play [bonsai js][] movies on a node server, streaming rendering commands to browsers and send user events back to the server.

[socket.io]: http://socket.io/
[bonsai js]: http://bonsaijs.org/

How-To
------

Nothing here yet


Upcoming Features
-----------------

The following features are planned and will be implemented in order:

1. Accept incoming connections and start a single movie for each of them.
2. Accept multiple incoming connections for a single movie.
3. Create a new movie for every <var>n</var> connections.
4. Run movies in isolated processes rather than in `vm`s.
