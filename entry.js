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
	} else if (event.which === 72 && !gameView.inProgress) {
        //player wants to host a multiplayer game, register websockets here
        removeMenu();
        gameView.start(ctx);
    } else if (event.which === 74 && !gameView.inProgress) {
        //player wants to join an existing game, register websockets here
        removeMenu();
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

