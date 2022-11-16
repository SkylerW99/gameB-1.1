import {
	changeScene,
	scenes,
	shared,
	my,
	guests,
	images,
	PLAYER_NUM,
} from '../main.js';

export function setup() {
	my.bomb = {
		xPos: 0, // position of ball
		yPos: 0,
		dX: 0, // velocity of ball
		dY: 0,
		r: 20, // radius or size
		active: true, // if the ball is visible
		floor: 0, // where the ball drops
		age: 0, // length
	};

	assignPosition();
	assignPlayers();
}

export function enter() {}

export function update() {
	updateBomb(my.bomb, my);
}

export function draw() {
	background(0);
	noStroke();
	image(images.map, 0, 0, width, height);

	// draw me
	image(images.avatar[0].default, my.xPos, my.yPos, 30, 30);
	// draw bombs
	drawBomb(my.bomb);
	// draw all players
	drawPlayers();
	// move me
	moveCharacter();

	/* ------------------------------- UI/UX ------------------------------- */
	// draw info
	push();
	fill('white');
	text('play scene', 10, 20);
	pop();
}

/* --------------------------------- Bomb ---------------------------------- */

function startBomb(bomb, player) {
	bomb.xPos = player.xPos;
	bomb.yPos = player.yPos;
	bomb.floor = player.yPos;
	bomb.dX = 5;
	bomb.dY = -10;
	bomb.active = true;
	bomb.age = 0;
	console.log(bomb, player);
}

function updateBomb(bomb, player) {
	if (!bomb.active) return;

	if (player.direction == 'right') {
		bomb.xPos += bomb.dX; // apply velocity to x
	} else if (player.direction == 'left') {
		bomb.xPos -= bomb.dX; // apply velocity to x
	}
	bomb.yPos += bomb.dY; // apply velocity to y
	bomb.dY += 0.6; // apply gravity

	// bounce off bottom of screen
	// if (bomb.y + bomb.r > height) {
	//   bomb.y = height - bomb.r;
	//   bomb.dY = -abs(bomb.dY);
	// }

	if (bomb.yPos > bomb.floor) {
		bomb.dY = -abs(bomb.dY);
		// hurt enemies
		// bomb.active = false;
	}

	// age bomb
	bomb.age++;
	if (bomb.age > 35) {
		// hurt enemies
		bomb.active = false;
	}

	//console.log(bomb, player);
}

function drawBomb(bomb) {
	// render
	if (!bomb.active) return;
	fill('black');
	ellipse(bomb.xPos, bomb.yPos, bomb.r, bomb.r);
}

/* --------------------------------- Player Assignment ---------------------------------- */

function assignPosition() {
	let playerSum = PLAYER_NUM > guests.length ? guests.length : PLAYER_NUM;
	for (let i = 0; i < playerSum; i++) {
		guests[i].xPos = random(width);
		guests[i].yPos = random(height);
	}
}

function assignPlayers() {
	let playerSum = PLAYER_NUM > guests.length ? guests.length : PLAYER_NUM;
	for (let i = 0; i < playerSum; i++) {
		if (!guests.find((p) => p.role === 'player')) {
			// find the first observer
			const o = guests.find((p) => p.role === 'observer');
			// if thats me, take the role
			if (o === my) {
				o.role = 'player';
			}
		}
	}
}
function drawPlayers() {
	let playerSum = PLAYER_NUM > guests.length ? guests.length : PLAYER_NUM;
	for (let i = 0; i < playerSum; i++) {
		image(
			images.avatar[i][guests[i].direction],
			guests[i].xPos,
			guests[i].yPos,
			30,
			30
		);
	}
}

/* --------------------------------- Input ---------------------------------- */

function moveCharacter() {
	// up: w, up arrow
	if (keyIsDown(87) /*w*/ || keyIsDown(38) /*up*/) {
		if (my.yPos > 0) my.yPos--;
		my.direction = 'up';
	}
	// down: s, down arrow
	if (keyIsDown(83) /*s*/ || keyIsDown(40) /*left*/) {
		if (my.yPos < height) my.yPos++;
		my.direction = 'down';
	}
	// left: a, left arrow
	if (keyIsDown(65) /*a*/ || keyIsDown(37) /*left*/) {
		if (my.xPos > 0) my.xPos--;
		my.direction = 'left';
	}
	// right: d, right arrow
	if (keyIsDown(68) /*d*/ || keyIsDown(39) /*right*/) {
		if (my.xPos < width) my.xPos++;
		my.direction = 'right';
	}
}

export function mousePressed() {
	changeScene(scenes.title);
}

export function keyPressed() {
	if (keyCode === 32) {
		startBomb(my.bomb, my);
		console.log('space is pressed');
	}
}
