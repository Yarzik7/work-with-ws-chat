console.log('Hello world from server!');
// WebSockets

const WebSocketServer = new require('ws');

const wss = new WebSocketServer.Server({ port: 8080 });

let clients = [];

wss.on('connection', ws => {
  let clientId = clients.length; // Assigning an ID to a client
  clients[clientId] = ws;
  console.log(`New connection #${clientId}`);
  clients[clientId].send(`Hi, you got number №${clientId}`); // Sending congratulation to new client

  // Alert to other clients about new client connection
  clients.forEach((client, idx) => {
    if (idx !== clientId) {
      client.send(`Client №${clientId} joined to us!`);
    }
  });
});
