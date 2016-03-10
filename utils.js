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
