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
		xPos: 200, // position of ball
		yPos: 200,
		dX: 0, // velocity of ball
		dY: 0,
		size: 20,
	};

	assignPosition();
	assignPlayers();

	// hosting can change mid-game so every client subscribes, and then checks if it is host on every message
	partySubscribe('createBullet', onCreateBullet);
}

export function enter() {
	my.bomb.yPos = 100;
	my.bomb.dY = 0;
}

export function update() {
	// physics sim
	my.bomb.yPos += my.bomb.dY; // momentum
	my.bomb.dY += 0.5; // gravity
	// test collision
	// if (my.bomb.yPos > height - 50) {
	// 	my.bomb.yPos = height - 50; // eject
	// 	my.bomb.dY = -abs(my.bomb.dY) * 0.8; // bounce
	// 	my.bomb.dY += 1; // fudge
	// 	if (abs(my.bomb.dY) < 1) {
	// 		// sticky
	// 		my.bomb.dY = 0;
	// 	}
	// }
	// draw me
	image(images.avatar[0].default, my.xPos, my.yPos, 30, 30);
}

export function draw() {
	background(0);
	noStroke();
	image(images.map, 0, 0, width, height);

	// draw all players
	drawPlayers();
	moveCharacter();

	/* ------------------------------- UI/UX ------------------------------- */
	// draw info
	push();
	fill('white');
	text('play scene', 10, 20);
	pop();
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

/* --------------------------------- Host Code ---------------------------------- */

export function onCreateBullet(b) {
	if (partyIsHost()) shared.bombs.push(b);
}

/* --------------------------------- Client Code ---------------------------------- */

//set my bomb size
function castBomb(b) {
	push();
	image(images.bomb, b.xPos, b.yPos, b.size, b.size);
	pop();
	for (const p of guests) {
		if (dist(b.xPos, b.yPos, p.bomb.xPos, p.bomb.yPos) < 20) {
			b.size = 50;
		} else {
			b.size = 20;
		}
	}
}

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
	//spin when getting hit
	for (const p of shared.bombs) {
		if (dist(p.xPos, p.yPos, my.bomb.xPos, my.bomb.yPos) < 15) {
			my.bomb.spin = 0.4;
		}
	}
	// gradually stop
	my.bomb.spin *= 0.98;
	my.bomb.angle += my.bomb.spin;
}

/* --------------------------------- Input ---------------------------------- */

export function mousePressed() {
	changeScene(scenes.title);
}

export function keyPressed() {
	if (keyCode === 32) {
		// castBomb(my.bomb);
		console.log('space is pressed');
		partyEmit('createBomb', {
			xPos: my.bomb.xPos + 1,
			yPos: my.bomb.yPos - 1,
			dX: sin(my.bomb.xPos) * 8,
			dY: -cos(my.bomb.yPos) * 8,
		});
	}

	return false;
}
