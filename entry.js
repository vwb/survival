window.GameView = require('./gameView.js');

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
        //player wants to run a multiplayer game, register websockets here
        removeMenu();
        registerWebsocket();
        gameView.start(ctx);
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

function registerWebsocket() {
    var connection = new WebSocket('ws://localhost:8080');

    connection.onopen = function () {
      console.log("opened");
    };

    // Log errors
    connection.onerror = function (error) {
      console.error('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log(e.data);
    };
}
