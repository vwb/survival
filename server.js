const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('disconnect', onClientDisconnect);
  ws.on('new player', onNewPlayer);
  ws.on('move player', onMovePlayer);

  ws.send('something');
});

function onClientDisconnect() {};
function onNewPlayer() {};
function onMovePlayer() {};