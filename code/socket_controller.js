/*
* Socket Controller
*/
module.exports = function(app)
{
  // Set Main variables
  var io = require('socket.io').listen(app);
  var connected_count = 0;
  var client_list = [];
  var master_node = '';

  // Main socket controller
  io.sockets.on('connection', function (socket) 
  {  
    // update client list and node list
    add_client(socket.id);

    // Load a master node and tell clients
    set_master_node();

    // Tell all clients some stuff
    broadcast_data(socket, true);

    // Send unique id
    narrowcast_data(socket, 'current_id', {id: socket.id});

    // On a disconnect
    socket.on('disconnect', function () {

      drop_client(socket.id);
      
      if(socket.id = master_node)
        set_master_node();

      broadcast_data(socket, false);
    });
  });

  // Send a base packet to let everyone know whos who
  function broadcast_data(socket, count)
  {
    if(count) {
      ++connected_count;
    }else{
      --connected_count;
    }
    
    io.sockets.emit('broadcast_data', {amount: connected_count, client_list: client_list, master_node: master_node});
  }

  // Send a more specfic targeted response to one client
  function narrowcast_data(socket, tag, data)
  {
    io.sockets.socket(socket.id).emit(tag, data);
  }

  // Add new client to client array
  function add_client(id)
  {
    client_list.push(id)
  }

  // Remove client from client array
  function drop_client(id)
  {
    var index = client_list.indexOf(id);
    client_list.splice(index, 1);
  }

  // Set master
  function set_master_node()
  {
    // Set node to zero
    if(client_list.length < 1)
      master_node = client_list[0];

    // Get a random node from the list
    master_node = client_list[Math.floor(Math.random() * client_list.length)];
  }
}
