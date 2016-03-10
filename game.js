var Util = require('./utils.js');
var Cell = require('./cell.js');
var PlayerCell = require('./playerCell.js');
var GameView = require('./gameView.js');

var NUM_CELLS = 300;

function Game(dimX, dimY){

  this.cells = [];
  this.dimY = dimY;
  this.dimX = dimX;
  var playerCellPos = [(dimX / 2), (dimY / 2)]
  this.playerCell = new PlayerCell(playerCellPos, this);

  for (var i = 0; i < NUM_CELLS; i++) {
    this.addcells();
  }

  this.allObjects = [this.playerCell].concat(this.cells);
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
  if ((Math.abs(center[0] - x) < 50) && Math.abs(center[1] - y) < 50){
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
};

module.exports = Game;