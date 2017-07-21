var app = require('http').createServer()
var io = require('socket.io')(app);
const util = require('util');
const ServerPlayer = require('./serverPlayer.js').ServerPlayer;

const CONNECTION = 'connection';
const NEW_PLAYER = 'new player';
const DISCONNECT = 'disconnect';
const MOVE_PLAYER = 'move player';

var players = [];

app.listen(8080);

io.on(CONNECTION, onSocketConnection);

function onSocketConnection(client) {
    util.log("Hey we got a connection from: " + client.id);

    client.on(DISCONNECT, onClientDisconnect);
    client.on(NEW_PLAYER, onNewPlayer);
    client.on(MOVE_PLAYER, onMovePlayer);
};


function onClientDisconnect() {
    util.log("Aw player has disconnected: " + this.id);
};

function onNewPlayer(data) {
    util.log("New player located at: " + data.pos);
    var newPlayer = new ServerPlayer(data.pos);
    newPlayer.id = this.id;

    // Broadcast to everyone else.
    this.broadcast.emit(NEW_PLAYER, {id: newPlayer.id, pos: newPlayer.getPos()});

    // Let this player know about everyone else
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit(NEW_PLAYER, {id: existingPlayer.id, pos: existingPlayer.getPos()});
    }
    players.push(newPlayer);
};

function onMovePlayer(data) {};