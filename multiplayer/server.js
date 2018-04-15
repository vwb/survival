var app = require('http').createServer()
var io = require('socket.io')(app);
const util = require('util');
const ServerPlayer = require('./serverPlayer.js').ServerPlayer;
const Cell = require('./cell.js');

const CONNECTION = 'connection';
const NEW_PLAYER = 'new player';
const DISCONNECT = 'disconnect';
const MOVE_PLAYER = 'move player';
const RESIZE_PLAYER = 'resize player';
const REMOVE_PLAYER = 'remove player';
const STEP_CELLS = 'step cells'
const ADD_CELL = 'add cell';
const NUM_CELLS = 100;

var players = [];
var cells = [];
var dimX = 800;
var dimY = 600;
var inProgress = false;
var lock;

app.listen(8080);

io.on(CONNECTION, onSocketConnection);

function onSocketConnection(client) {
    util.log("Hey we got a connection from: " + client.id);
    client.on(DISCONNECT, onClientDisconnect);
    client.on(NEW_PLAYER, onNewPlayer);
    client.on(MOVE_PLAYER, onMovePlayer);
    client.on(RESIZE_PLAYER, onResizePlayer);
    client.on(STEP_CELLS, onStepCells);
    client.on(ADD_CELL, onAddCell);
    if (!inProgress) {
        inProgress = true;
        runGame();
    }

};

function runGame() {
    for (var i = 0; i < NUM_CELLS; i++) {
        addCells();
    }

    if (lock) {
        clearInterval(lock);
    }
   
    lock = setInterval( function() {
        cells.forEach(function (object) {
            object.move();
            checkCollision();
        });
    }, 20);
}

function addCells() {
    var pos = randomPosition();
    cells.push(new Cell(pos));
};

function randomPosition() {
  var center = [dimX / 2, dimY / 2]
  var x = (Math.random() * dimX);
  var y = (Math.random() * dimY);
  if ((Math.abs(center[0] - x) < 75) && Math.abs(center[1] - y) < 75) {
    return randomPosition();
  }
  return [x,y];
};
function checkCollision() {
    allObjects = players.concat(cells);
    allObjects.forEach(function (cell, index) {
        var k = 0;
        for (var i = index + 1; k < allObjects.length - 1; i++) {
            i = i % allObjects.length; // this is so it wraps to check all values in array
            var result = cell.isCollidedWith(allObjects[i]);
            if (result) {
                removed = cell.collidedWith(allObjects[i]);
                if (removed) {
                    var idx = players.indexOf(removed);
                    if (idx > -1) {
                        players.splice(idx, 1);
                        // removePlayer(removed.id);
                        // this.broadcast.emit(REMOVE_PLAYER, {id: this.id});
                    } else {
                        idx = cells.indexOf(removed);
                        cells.splice(idx, 1);
                    }
                }
            }
            k++;
        }
    });
};

function removePlayer(id) {
    // var playerToRemove()
}

function onResizePlayer(data) {
    var resizePlayer = getPlayerById(this.id);

    if (!resizePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }
    resizePlayer.setRadius(data.radius);
    this.broadcast.emit(RESIZE_PLAYER, {id: this.id, radius: data.radius});
};

function onClientDisconnect() {
    util.log("Aw player has disconnected: " + this.id);
    var playerToRemove = getPlayerById(this.id);

    if (!playerToRemove) {
        util.log("Merr no player to remove :(");
        return;
    }

    players.splice(players.indexOf(playerToRemove), 1);
    this.broadcast.emit(REMOVE_PLAYER, {id: this.id});
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

function onMovePlayer(data) {
    var movePlayer = getPlayerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    }
    movePlayer.setPos(data.pos);
    this.broadcast.emit(MOVE_PLAYER, {id: this.id, pos: data.pos});
};

function onStepCells() {
    this.emit(STEP_CELLS, {cells: cells})
}

function onAddCell(data) {
    var newCell = new Cell(data.pos, data.radius, data.vec);
    cells.push(newCell);
}

function getPlayerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }
    return false;
};
