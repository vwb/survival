/* This handles creating the Game Object, set the interval to step the game every 20 ms, 
and display correct divs once game over. */
var Game = require('./game.js');

function GameView(dimY, dimX){
  this.dimY = dimY;
  this.dimX = dimX;
  this.inProgress = false;
  this.firstOpen = false;
}

GameView.prototype.start = function (ctx, multiplayer = false) {

  this.game = new Game(this.dimY, this.dimX, multiplayer);
  this.playerCell = this.game.playerCell;
  // this.playerCell.vel = [0,0]
  this.inProgress = true;

  if (this.var){
    clearInterval(this.var)
  }

  var that = this;
  this.bindKeyHandlers();

  this.var = setInterval(function(){
    that.game.step(ctx);
    // that.isOver();
  }, 20);

};

GameView.prototype.isOver = function() {
  var result = this.game.checkOver();

  var infoWrapper = document.getElementById("info")
  var canvas = document.getElementById("world")
  var winEl = document.getElementById("win-game")
  var lossEl = document.getElementById("lost-game")



  if (result === "player_loss"){
    this.inProgress = false;

    infoWrapper.className = "info-wrapper group center fade-in"
    winEl.className = "info gone"
    lossEl.className = "info fade-in"
    canvas.className = "transparent"

    

  } else if (result === "player_win"){
    this.inProgress = false;

    infoWrapper.className = "info-wrapper group center fade-in"
    lossEl.className = "info gone"
    winEl.className = "info fade-in"
    canvas.className = "transparent"

  }

};

GameView.MOVES = {
  "w": [ 0, -.2],
  "a": [-.2,  0],
  "s": [ 0,  .2],
  "d": [ .2,  0],
  "up": [ 0, -.2],
  "left": [-.2,  0],
  "right": [ .2,  0],
  "down": [ 0,  .2]
};

GameView.prototype.bindKeyHandlers = function () {
  var playerCell = this.playerCell;

  Object.keys(GameView.MOVES).forEach(function (k) {
    var move = GameView.MOVES[k];
    key(k, function() { 
      playerCell.power(move); 
    });
  });

};

module.exports = GameView;
