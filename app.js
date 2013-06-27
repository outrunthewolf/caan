var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var request = require('request');

var count = 0;
var clients = [];
var node = '';

app.listen(3000);

// Basic index page route
function handler (req, res) 
{
  fs.readFile(__dirname + '/index.html',
  function (err, data) 
  {
    if (err) 
    {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// Socket controller
io.sockets.on('connection', function (socket) 
{  
  // update client list and node list
  loop_clients(io.sockets.clients());
  choose_node();

  // Emit a count function everytime someone connects
  io.sockets.emit('online_count', {amount: ++count, who: clients, node: node});

  // on a disconnect emit the decreased count function
  socket.on('disconnect', function () {

    // update client list and node
    loop_clients(io.sockets.clients());
    var a = clients.indexOf(socket.id);
    clients.splice(a, 1);
    choose_node();

    io.sockets.emit('online_count', {amount: --count, who: clients, node: node});
  });

});


function loop_clients(arr)
{
  clients = [];

  for(var i = 0; i < arr.length; ++i)
  {
    clients.push(arr[i].id)
  }
}

function choose_node()
{
  // Set node to zero
  if(clients.length < 1)
    node = clients[0];

  // Get a random node from the list
  node = clients[Math.floor(Math.random() * clients.length)];
}

