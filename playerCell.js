var MovingObject = require('./movingObject.js');
var Util = require('./utils.js');
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

PlayerCell.prototype.getRadius = function() {
  return this.radius;
};

PlayerCell.prototype.setRadius = function(radius) {
  this.radius = radius;
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
