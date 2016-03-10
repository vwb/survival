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
