/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function Util(){}

Util.prototype.inherits = function (SuperClass, SubClass) {
  function Surrogate () {}

  Surrogate.prototype = SuperClass.prototype;
  SubClass.prototype = new Surrogate();
  SubClass.prototype.constructor = SubClass;
};

Util.prototype.randomVec = function (length) {
  var x = (Math.random() * length);
  var y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2));

  var test = Math.random()*10
	var val;
	if (test > 5){
		x *= -1
	}

	var test = Math.random()*10
	if (test > 5){
		y *= -1
	}

  return [x,y];
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* This handles creating the Game Object, set the interval to step the game every 20 ms, 
and display correct divs once game over. */
var Game = __webpack_require__(5);

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
    that.game.step();
    that.game.draw(ctx);
    that.isOver();

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
    key(k, function () { playerCell.power(move); console.log("this is the move"+move)});
  });

};

module.exports = GameView;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* Handles collision detection, absorbing, drawing, and bounds of cells. */
function MovingObject(pos, vel, radius, color, game){
  this.pos = pos;
  this.vel = vel;
  this.radius = radius;
  this.color = color;
  this.game = game;
}

MovingObject.prototype.draw = function (ctx) {

  ctx.fillStyle = this.color;
   ctx.beginPath();

   ctx.arc(
     this.pos[0],
     this.pos[1],
     this.radius,
     0,
     2 * Math.PI,
     false
   );

   ctx.fill();
};

MovingObject.prototype.move = function () {
  this.bounds(this.pos);

  this.pos[0] = this.pos[0]+this.vel[0];
  this.pos[1] = this.pos[1]+this.vel[1];

};

MovingObject.prototype.bounds = function(pos) {
  var checkOutOfBounds = this.checkOutOfBounds(pos);

  if (checkOutOfBounds){
    if (checkOutOfBounds["coord"] === "X"){ 

      if (checkOutOfBounds["low"]){
        if (this.vel[0] < 0)  {this.vel[0] *= (-1)}
      } else {
        if (this.vel[0] > 0)  {this.vel[0] *= (-1)} 
      }

    } else if (checkOutOfBounds["coord"] === "Y"){

      if (checkOutOfBounds["low"]){
        if (this.vel[1] < 0)  {this.vel[1] *= (-1)}
      } else {
        if (this.vel[1] > 0)  {this.vel[1] *= (-1)} 
      }

    }
  }
};

MovingObject.prototype.checkOutOfBounds = function(pos) {

  if ((pos[0]-this.radius) <= 0 ){
    return {coord: "X", low: true}

  } else if ((pos[0]+this.radius) >= this.game.dimX){
    return {coord: "X", low: false}

  } else if ((pos[1]-this.radius) <= 0){
    return {coord: "Y", low: true}

  } else if ((pos[1]+this.radius) >= this.game.dimY) {
    return {coord: "Y", low: false}

  } 

};

MovingObject.prototype.collidedWith = function (other) {


  var ratio = 1;
  if (this.radius > other.radius) {
    this.radius += ratio/2
    other.radius -= ratio

    if (other.radius <= 1){
      this.game.remove(other)
    }

  } else {
    this.radius -= ratio
    other.radius += ratio/2


    if (this.radius <= 1){
      this.game.remove(this)
    } 
  }

};

MovingObject.prototype.isCollidedWith = function (other) {
  var sumRadii = this.radius + other.radius;
  var xDistance = Math.pow((this.pos[0] - other.pos[0]), 2);
  var yDistance = Math.pow((this.pos[1] - other.pos[1]), 2);
  var totalDistance = Math.sqrt((xDistance + yDistance));

  if (sumRadii > totalDistance) {
    return true;
  } else {
    return false;
  }
};

module.exports = MovingObject;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var MovingObject = __webpack_require__(2);
var Util = __webpack_require__(0);
var util = new Util();

var COLOR = "#5BD9ED";
var RADIUS = 7.5;
var VEL = [0,0];

function PlayerCell(pos, game){
	var vel = util.randomVec((Math.random() * 0.1))
  MovingObject.call(this, pos, vel, RADIUS, COLOR, game);
  var id;
}

util.inherits(MovingObject, PlayerCell);

PlayerCell.prototype.getId = function () {
    return this.id;
};

PlayerCell.prototype.setId = function(id) {
    this.id = id;
};

PlayerCell.prototype.getPos = function() {
    return this.pos;
};

PlayerCell.prototype.setPos = function(pos) {
    this.pos = pos;
};

PlayerCell.prototype.power = function (impulse) {

  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
  var saveRadius = this.radius
  this.radius -= (saveRadius/35);

  var cellV = [this.vel[0]*(-1), this.vel[1]*(-1)];

  var cellOptions = {
  	pos: this.renderCounterWeightPos(saveRadius, impulse),
  	radius: saveRadius/20,
  	vel: cellV
  }



  this.game.renderCell(cellOptions);
};

PlayerCell.prototype.renderCounterWeightPos = function(saveRadius, impulse) {
	var result = [];

	var x = this.pos[0]
	var y = this.pos[1]

	var velX = this.vel[0]
	var velY = this.vel[1]

	var XOffset = -1 * ((velX/(Math.abs(velX)+Math.abs(velY)))) * (saveRadius + (saveRadius / 2.5) );
	var YOffset = -1 * ((velY/(Math.abs(velX)+Math.abs(velY)))) * (saveRadius + (saveRadius / 2.5) );

	console.log("radius:" + this.radius)
	console.log("xOffset:" + XOffset)
	console.log("YOffset:" + YOffset)

	var xPos = this.pos[0] + XOffset
	var yPos = this.pos[1] + YOffset


	return [xPos, yPos]

};


module.exports = PlayerCell;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

window.GameView = __webpack_require__(1);

var canvasEl = document.getElementById("world");

canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;

var ctx = canvasEl.getContext("2d");
var gameView = new GameView(canvasEl.width, canvasEl.height);


var el = document.getElementsByTagName('body')[0]
var infoEl = document.getElementById("info")
var footerEl = document.getElementById("footer")
var newGame = document.getElementById("new-game")
var toolTip = document.getElementById("tooltip")
var multiplayer = document.getElementById("multiplayer")


el.addEventListener("keydown", function() {

	if (event.which === 32 && !gameView.inProgress) {
        //standard game
        removeMenu();
		gameView.start(ctx);
	} else if (event.which === 77 && !gameView.inProgress) {
        //player wants to run a multiplayer game, pass along boolean
        removeMenu();
        gameView.start(ctx, true);
    }
});

function removeMenu() {
    infoEl.className = "info-wrapper center group gone"
    footerEl.className = "footer visible "
    canvasEl.className = "visible fade-in"
    newGame.className = "info gone"
    multiplayer.className = "info gone"
    toolTip.className = "gone"
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(0);
var Cell = __webpack_require__(6);
var PlayerCell = __webpack_require__(3);
var GameView = __webpack_require__(1);

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
      console.log(that.remotePlayers);
    });

    socket.on(MOVE_PLAYER, function(data) {

    });

    socket.on(REMOVE_PLAYER, function(data) {

    });
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

module.exports = Game;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(0);
var MovingObject = __webpack_require__(2);
var PlayerCell = __webpack_require__(3);

var util = new Util();

var COLOR = "#000000";

var Cell = function(pos, game, radius, vec){
	if (!vec){
		
		var vec = util.randomVec(((Math.random() * 0.3) + 0.001));
	}

	var rand = (Math.random() * 120)

	if (!radius){

		if (rand < 12 && rand > 3){
			var radius = (Math.random() * 5) + 10
		} else if (rand < 1.5){
			var radius = (Math.random() * 10) + 30
		} else {
			var radius = (Math.random() * 4) + 1
		}

		
	}

  MovingObject.call(this, pos, vec, radius, COLOR, game);
};

util.inherits(MovingObject, Cell);

module.exports = Cell;


// window.Asteroid = new Asteroid([20,20]);


/***/ })
/******/ ]);