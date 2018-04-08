var MovingObject = require('./movingObject.js');
var Util = require('./utils.js');

var util = new Util();

var COLOR = "#000000";

var Cell = function(pos, radius, vec) {
    if (!vec) {        
        var vec = util.randomVec(((Math.random() * 0.3) + 0.001));
    }

    var rand = (Math.random() * 120)

    if (!radius) {
        if (rand < 12 && rand > 3){
            var radius = (Math.random() * 5) + 10
        } else if (rand < 1.5){
            var radius = (Math.random() * 10) + 30
        } else {
            var radius = (Math.random() * 4) + 1
        }
    }
  MovingObject.call(this, pos, vec, radius, COLOR);
};

util.inherits(MovingObject, Cell);

module.exports = Cell;
