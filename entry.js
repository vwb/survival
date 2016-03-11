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


el.addEventListener("keydown", function(){

	if (event.which === 32 && !gameView.inProgress){

		infoEl.className = "info-wrapper center group gone"
		footerEl.className = "footer visible "
		canvasEl.className = "visible fade-in"
		newGame.className = "info gone"
		toolTip.className = "gone"


		gameView.start(ctx);
	}
})

