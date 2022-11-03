const webSocketsServerPort = 3001;
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

// Generates unique ID for every new connection
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const clients = {};
const users = {};



const sendMessage = (json) => {
  console.log(json.message)
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(json.message);
  });
}

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  connection.on('message', function(message) {
    sendMessage(JSON.parse(message.utf8Data));
  });
  
  connection.on('close', function() {
    console.log((new Date()) + " Peer " + userID + " disconnected.");
    delete clients[userID];
    delete users[userID];
  });
});
