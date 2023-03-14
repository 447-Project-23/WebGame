import * as ml from "../lib/melonjs.module.js";

ml.device.onReady(function () {

	//Initialize video
	if (!ml.video.init(1280, 720, {parent : "screen", scale : "auto"})) {
		alert("Your browser does not support HTML5 canvases.");
		return;
	}

	ml.game.world.backgroundColor.parseCSS("#000000");

	ml.game.world.addChild(new me.Text(610, 360, {
		font: "Arial",
		size: 160,
		fillStyle: "#FFFFFF",
		textBaseline: "middle",
		textAlign: "center",
		text: "Hello World!"
	}));

});
