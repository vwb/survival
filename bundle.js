/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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


	el.addEventListener("keydown", function(){

		if (event.which === 32 && !gameView.inProgress){

			infoEl.className = "info-wrapper center group gone"
			footerEl.className = "footer visible "
			canvasEl.className = "visible fade-in"
			newGame.className = "info gone"


			gameView.start(ctx);
		}
	})



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);

	function GameView(dimY, dimX){
	  this.dimY = dimY;
	  this.dimX = dimX;
	  this.inProgress = false;
	  this.firstOpen = false;
	}

	GameView.prototype.start = function (ctx) {

	  this.game = new Game(this.dimY, this.dimX);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Cell = __webpack_require__(4);
	var PlayerCell = __webpack_require__(7);
	var GameView = __webpack_require__(1);

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

	  var x = (Math.random() * this.dimX);
	  var y = (Math.random() * this.dimY);

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(5);
	var PlayerCell = __webpack_require__(7);

	var util = new Util();

	var COLOR = "#000000";

	var Cell = function(pos, game, radius, vec){
		if (!vec){
			
			var vec = util.randomVec(((Math.random() * 0.3) + 0.001));
		}

		var rand = (Math.random() * 100)

		if (!radius){

			if (rand < 5){
				var radius = (Math.random() * 5) + 15
			} else {
				var radius = (Math.random() * 4) + 1
			}

			
		}

	  MovingObject.call(this, pos, vec, radius, COLOR, game);
	};

	util.inherits(MovingObject, Cell);

	module.exports = Cell;


	// window.Asteroid = new Asteroid([20,20]);


/***/ },
/* 5 */
/***/ function(module, exports) {

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


	  
	  if (this.radius > other.radius) {

	    var ratio = (other.radius / this.radius) > 1 ? (other.radius / this.radius) : 1
	    this.radius += ratio/2
	    other.radius -= ratio

	    if (other.radius <= 1){
	      this.game.remove(other)
	    }

	  } else {
	    var ratio = (this.radius / other.radius) > 1 ? (this.radius / other.radius) : 1
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


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(5);
	var Util = __webpack_require__(3);
	var util = new Util();

	var COLOR = "#5BD9ED";
	var RADIUS = 6;
	var VEL = [0,0];

	function PlayerCell(pos, game){
		var vel = util.randomVec((Math.random() * 0.1))
	  MovingObject.call(this, pos, vel, RADIUS, COLOR, game);
	}

	util.inherits(MovingObject, PlayerCell);


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


/***/ }
/******/ ]);