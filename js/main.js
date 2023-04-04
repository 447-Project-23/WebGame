import * as ml from "../lib/melonjs.module.js";

ml.device.onReady(function () {

	//Initialize video
	if (!ml.video.init(1600, 900, {parent : "screen", scale : "auto"})) {
		alert("Your browser does not support HTML5 canvases.");
		return;
	}

	main();

});

function main() { //Make the rest of the game lol
	var world = new ml.World(0, 0, 1600, 900);

	world.backgroundColor.setColor(0, 0, 0); //This also doesn't work
}
