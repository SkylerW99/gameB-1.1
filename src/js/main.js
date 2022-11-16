/**
 * main.js
 *
 * This is the entry point for the game. It doesn't do much itself, but rather
 * loads the other modules, sets things up, and coordinates the main game
 * scenes.
 *
 * A major organizing principle of this code is that it is organized into
 * "scenes". See sceneTemplate.js for more info.
 *
 * main.js exports a function changeScene() that scenes can use to switch to
 * other scenes.
 *
 */

import * as titleScene from './scenes/titleScene.js';
import * as playScene from './scenes/playScene.js';
import * as onboardingScene from './scenes/onboardingScene.js';
import * as winningScene from './scenes/winningScene.js';
import * as losingScene from './scenes/losingScene.js';
import * as scoreScene from './scenes/scoreScene.js';

export let shared, my, guests;
export let images = {};
let fonts = {};
let sounds = {};

export const PLAYER_NUM = 4;

let currentScene; // the scene being displayed

// all the available scenes
export let scenes = {
	title: titleScene, // Scene 1: Game Tile & Cover Page
	onboard: onboardingScene, // Scene 2: Onboarding
	play: playScene, // Scene 3: Main Game Page
	win: winningScene,
	lose: losingScene,
	score: scoreScene,
};

// p5.js auto detects your setup() and draw() before "installing" itself but
// since this code is a module the functions aren't global. This creates aliases
// of the p5 functions on window, so p5.js can find them
Object.assign(window, {
	preload,
	draw,
	setup,
	mousePressed,
	keyPressed,
});

function preload() {
	/* ----------------------------- p5.party setup ----------------------------- */
	partyConnect(
		'wss://deepstream-server-1.herokuapp.com',
		'DDF_wk2-1115_bysimone',
		'main'
	);
	shared = partyLoadShared('shared'); // create shared data
	my = partyLoadMyShared(); // create local data of my object
	guests = partyLoadGuestShareds(); // create data of all players

	/* ----------------------------- load assets ----------------------------- */
	// load image
	images.bomb = loadImage('../../assets/images/bomb.png');
	images.map = loadImage('../../assets/images/map.png');

	// load avatar
	images.avatar = [];
	for (let i = 0; i < PLAYER_NUM; i++) {
		images.avatar[i] = {};
		let j = 0;
		images.avatar[i].left = loadImage(
			'../../assets/images/character' + j + '/left.png'
		);
		images.avatar[i].right = loadImage(
			'../../assets/images/character' + j + '/right.png'
		);
		images.avatar[i].up = loadImage(
			'../../assets/images/character' + j + '/back.png'
		);
		images.avatar[i].down = loadImage(
			'../../assets/images/character' + j + '/front.png'
		);
		images.avatar[i].default = images.avatar[i].left;
	}

	/* ----------------------------- load setup config from other scenes ----------------------------- */
	Object.values(scenes).forEach((scene) => scene.preload?.());
}

function setup() {
	createCanvas(800, 600).parent('canvas-wrap');

	// set shared variables
	if (partyIsHost()) {
		// when the player is the first player of the game
		partySetShared(shared, {
			bombs: [],
			bombSize: 20,
			loadingTime: 10,
			timer: 90,
		});
	}
	// assign local data to my object
	partySetShared(my, {
		role: 'observer',
		xPos: random(0, width / 2),
		yPos: 300,
		direction: 'left',
		side: 'left',
	});

	Object.values(scenes).forEach((scene) => scene.setup?.());
	changeScene(scenes.title);
}

function draw() {
	// update
	currentScene?.update?.();
	// draw
	currentScene?.draw?.();
}

function mousePressed() {
	currentScene?.mousePressed?.();
}

function keyPressed() {
	currentScene?.keyPressed?.();
}

export function changeScene(newScene) {
	if (!newScene) {
		console.error('newScene not provided');
		return;
	}
	if (newScene === currentScene) {
		console.error('newScene is already currentScene');
		return;
	}
	currentScene?.leave?.();
	currentScene = newScene;
	currentScene.enter?.();
}
