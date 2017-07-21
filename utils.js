const CONNECT = 'connect';
const DISCONNECT = 'disconnect';
const NEW_PLAYER = 'new player';
const MOVE_PLAYER = 'move player';
const REMOVE_PLAYER = 'remove player';

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

Util.prototype.getSocket = function () {
    var socket = io.connect('http://localhost:8080');
    socket.on(CONNECT, onSocketConnected);
    socket.on(DISCONNECT, onSocketDisconnect);
    socket.on(NEW_PLAYER, onNewPlayer);
    socket.on(MOVE_PLAYER, onMovePlayer);
    socket.on(REMOVE_PLAYER, onRemovePlayer);
}

function onSocketConnected() {
    console.log("Connected to socket server");
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
};

function onMovePlayer(data) {

};

function onRemovePlayer(data) {

};

module.exports = Util;
