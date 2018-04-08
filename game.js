var Util = require('./utils.js');
var Cell = require('./cell.js');
var PlayerCell = require('./playerCell.js');
var GameView = require('./gameView.js');

const CONNECT = 'connect';
const DISCONNECT = 'disconnect';
const NEW_PLAYER = 'new player';
const MOVE_PLAYER = 'move player';
const REMOVE_PLAYER = 'remove player';
const RESIZE_PLAYER = 'resize player';

var util = new Util();
var NUM_CELLS = 300;
const EDGE_BUFFER = 50;

function Game(dimX, dimY, multiplayer){

  this.cells = [];
  this.dimY = dimY;
  this.dimX = dimX;
  this.multiplayer = multiplayer;
  var playerCellPos = [randomIntFromInterval(EDGE_BUFFER, this.dimX-EDGE_BUFFER),
                       randomIntFromInterval(EDGE_BUFFER, this.dimY-EDGE_BUFFER)];
  this.playerCell = new PlayerCell(playerCellPos, this);
  this.remotePlayers = [];

  if (!this.multiplayer) {
    for (var i = 0; i < NUM_CELLS; i++) {
      this.addcells();
    }
  }
  
  this.allObjects = [this.playerCell].concat(this.cells);

  if (this.multiplayer) {
    this.socket = this.getSocket();
  }
}

Game.prototype.addcells = function (pos, vel, radius) {

  if (!pos){ 
    var pos = this.randomPosition();
    this.cells.push(new Cell(pos, this));
  } else {
    this.cells.push(new Cell(pos, this, radius, vel));
  }

};

Game.prototype.randomPosition = function () {
  var center = [this.dimX / 2, this.dimY / 2]
  var x = (Math.random() * this.dimX);
  var y = (Math.random() * this.dimY);
  if ((Math.abs(center[0] - x) < 75) && Math.abs(center[1] - y) < 75){
    return this.randomPosition();
  }
  return [x,y];
};

Game.prototype.renderCell = function(cell) {
  var newCell = new Cell(cell.pos, this, cell.radius, cell.vel)
  this.allObjects.push(newCell)
};

function draw(ctx, cell) {
  ctx.fillStyle = cell.color;
  ctx.beginPath();

   ctx.arc(
     cell.pos[0],
     cell.pos[1],
     cell.radius,
     0,
     2 * Math.PI,
     false
   );

   ctx.fill();
}

Game.prototype.draw = function (ctx) {

  ctx.clearRect(0, 0, this.dimX, this.dimY);

  this.allObjects.forEach(function (object) {
    draw(ctx, object);
  });

  this.remotePlayers.forEach(function (object) {
    draw(ctx, object);
  });
};

Game.prototype.on = function() {
  if (this.allObjects.indexOf(this.playerCell) > -1){
    return true
  } else {
    return false
  }
};

Game.prototype.moveObjects = function () {
  this.allObjects.forEach(function (object) {
    object.move();
  });
};

Game.prototype.movePlayer = function() {
  this.playerCell.move();
};

Game.prototype.checkCollision = function () {
  var that = this;
  this.allObjects.forEach(function (cell, index) {
    var k = 0;
    for (var i = index + 1; k < that.allObjects.length - 1; i++) {
      i = i % that.allObjects.length; // this is so it wraps to check all values in array
      var result = cell.isCollidedWith(that.allObjects[i]);
      if (result) {
        cell.collidedWith(that.allObjects[i]);
      }
      k++;
    }
    //emit new cell size (eventually will also have to do that.allObject[i])
    if (that.multiplayer && cell == that.playerCell) {
      that.socket.emit('resize player', {radius: cell.getRadius()});
    }
  });
};

Game.prototype.checkPlayerCollision = function() {
  //fill this in to just check player collision and update. 
  // I actually think this should just be done server side. Client is ONLY going to be drawing stuff
  // and updating player location via keypresses. 
};

Game.prototype.remove = function (object) {
  var index = this.allObjects.indexOf(object);
  if (index > -1){

    this.allObjects.splice(index, 1);
  }
};

Game.prototype.checkOver = function() {


  if (this.allObjects.indexOf(this.playerCell) === -1){
    this.socket.disconnect();
    return ("player_loss")
  } else if (this.allObjects.length === 1 && this.allObjects.indexOf(this.playerCell) > -1){
    this.socket.disconnect();
    return ("player_win")
  }

};

Game.prototype.step = function () {
  if (this.multiplayer) {
    this.movePlayer();
    this.socket.emit('move player', {pos: this.playerCell.getPos()});
    this.draw(ctx)
  } else {
    this.checkOver();
    this.moveObjects();
    this.checkCollision();
  }
};

Game.prototype.getSocket = function () {
    var socket = io.connect('http://localhost:8080');
    var that = this;

    socket.on(CONNECT, function() {
      socket.emit('new player', {pos: that.playerCell.getPos()});
    });

    socket.on(NEW_PLAYER, function(data) {
      var newPlayer = new PlayerCell(data.pos, this);
      newPlayer.setId(data.id);
      that.remotePlayers.push(newPlayer);
    });

    socket.on(MOVE_PLAYER, function(data) {
      var movePlayer;
      for (var i = 0; i < that.remotePlayers.length; i++) {
        if (that.remotePlayers[i].id == data.id) {
          movePlayer = that.remotePlayers[i];
        }
      }

      if (!movePlayer) {
        console.log("Player not found: "+ data.id);
        return;
      }

      movePlayer.setPos(data.pos);
    });

    socket.on(REMOVE_PLAYER, function(data) {
      var playerToRemove;
      for (var i = 0; i < that.remotePlayers.length; i++) {
        if (that.remotePlayers[i].id == data.id) {
          playerToRemove = that.remotePlayers[i];
        }
      }

      if (!playerToRemove) {
        console.log("Player not found: "+ data.id);
        return;
      }

      that.remotePlayers.splice(that.remotePlayers.indexOf(playerToRemove), 1);
    });

    socket.on(RESIZE_PLAYER, function(data) {
        var resizePlayer;
        for (var i = 0; i < that.remotePlayers.length; i++) {
          if (that.remotePlayers[i].id == data.id) {
            resizePlayer = that.remotePlayers[i];
          }
        }

        if (!resizePlayer) {
          console.log("Player not found: " + data.id);
          return;
        }

        resizePlayer.setRadius(data.radius);
    });

    socket.on('update cells', function(data) {
      that.allObjects = [that.playerCell].concat(data.cells);
    });

    return socket;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

module.exports = Game;
