var Util = require('./utils.js');
var Cell = require('./cell.js');
var PlayerCell = require('./playerCell.js');
var GameView = require('./gameView.js');

const CONNECT = 'connect';
const DISCONNECT = 'disconnect';
const NEW_PLAYER = 'new player';
const MOVE_PLAYER = 'move player';
const REMOVE_PLAYER = 'remove player';

var util = new Util();
var NUM_CELLS = 300;
const EDGE_BUFFER = 50;

function Game(dimX, dimY, multiplayer){

  this.cells = [];
  this.dimY = dimY;
  this.dimX = dimX;
  this.prevX = dimX;
  this.prevY = dimY;
  this.multiplayer = multiplayer;
  var playerCellPos = [randomIntFromInterval(EDGE_BUFFER, this.dimX-EDGE_BUFFER),
                       randomIntFromInterval(EDGE_BUFFER, this.dimY-EDGE_BUFFER)];
  this.playerCell = new PlayerCell(playerCellPos, this);
  this.remotePlayers = [];

  for (var i = 0; i < NUM_CELLS; i++) {
    this.addcells();
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

Game.prototype.draw = function (ctx) {

  ctx.clearRect(0, 0, this.dimX, this.dimY);

  this.allObjects.forEach(function (object) {
    object.draw(ctx);
  });

  this.remotePlayers.forEach(function (object) {
    object.draw(ctx);
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

Game.prototype.checkCollision = function () {
  var that = this;
  this.allObjects.forEach(function (cell, index) {
    var k = 0;
    for (var i = index + 1; k < that.allObjects.length - 1; i++) {
      i = i % that.allObjects.length;
      var result = cell.isCollidedWith(that.allObjects[i]);
      if (result) {
        cell.collidedWith(that.allObjects[i]);
      }
      k++;
    }
  });
};

Game.prototype.remove = function (object) {
  var index = this.allObjects.indexOf(object);
  if (index > -1){

    this.allObjects.splice(index, 1);
  }
};

Game.prototype.checkOver = function() {


  if (this.allObjects.indexOf(this.playerCell) === -1){
    return ("player_loss")
  } else if (this.allObjects.length === 1 && this.allObjects.indexOf(this.playerCell) > -1){
    return ("player_win")
  }

};

Game.prototype.step = function () {
  this.checkOver();
  this.moveObjects();
  this.checkCollision();
  var x = this.playerCell.getPos()[0];
  var y = this.playerCell.getPos()[1];

  if (x != this.prevX || y != this.prevY) {
    this.socket.emit('move player', {pos: this.playerCell.getPos()});
  }
  this.prevX = x;
  this.prevY = y;
};

Game.prototype.getSocket = function () {
    var socket = io.connect('http://localhost:8080');
    var that = this;

    socket.on(CONNECT, function() {
      socket.emit('new player', {pos: that.playerCell.getPos()});
    });

    socket.on(DISCONNECT, function() {

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
    return socket;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};



module.exports = Game;
