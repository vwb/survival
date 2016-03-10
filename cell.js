var Util = require('./utils.js');
var MovingObject = require('./movingObject.js');
var PlayerCell = require('./playerCell.js');

var util = new Util();

var COLOR = "#000000";

var Cell = function(pos, game, radius, vec){
	if (!vec){
		
		var vec = util.randomVec(((Math.random() * 0.3) + 0.001));
	}

	var rand = (Math.random() * 100)

	if (!radius){

		if (rand < 9 && rand > 3){
			var radius = (Math.random() * 5) + 10
		} else if (rand < 2){
			var radius = (Math.random() * 10) + 20
		} else {
			var radius = (Math.random() * 4) + 1
		}

		
	}

  MovingObject.call(this, pos, vec, radius, COLOR, game);
};

util.inherits(MovingObject, Cell);

module.exports = Cell;


// window.Asteroid = new Asteroid([20,20]);
