/* A server side player class used for keeping track of existing players. */
var MovingObject = require('./movingObject.js');
var Util = require('./utils.js');
var util = new Util();

var RADIUS = 7.5;
var VEL = [0,0];
var COLOR = "#5BD9ED";

function ServerPlayer(startPos) {
    MovingObject.call(this, startPos, VEL, RADIUS, COLOR);
    var id;
}

util.inherits(MovingObject, ServerPlayer);

ServerPlayer.prototype.getId = function () {
    return this.id;
};

ServerPlayer.prototype.setId = function(id) {
    this.id = id;
};

ServerPlayer.prototype.getPos = function() {
    return this.pos;
};

ServerPlayer.prototype.setPos = function(pos) {
    this.pos = pos;
};

ServerPlayer.prototype.getRadius = function() {
  return this.radius;
};

ServerPlayer.prototype.setRadius = function(radius) {
  this.radius = radius;
};

exports.ServerPlayer = ServerPlayer;