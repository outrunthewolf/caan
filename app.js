
var app = require('http').createServer(handler);
var fs = require('fs');
var request = require('request');
var app_port = 3000;

// Set app listening
app.listen(app_port);

// Basic index page route
function handler (req, res) 
{
  fs.readFile(__dirname + '/layout/index.html',
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

require(__dirname + '/code/socket_controller.js')(app);

