import { changeScene, scenes } from "../main.js";

import { shared, my, guests, images, PLAYER_NUM } from "../main.js";

export function setup() {
  // my.bomb = {
  //   active: false,
  //   xPos: 0, // initial position of bomb
  //   yPos: 0,
  //   dX: 0, // velocity of bomb
  //   dY: 0,
  //   r: 20,

  //   //floor: 0,
  // };

  assignPosition();
  assignPlayers();

  // hosting can change mid-game so every client subscribes, and then checks if it is host on every message
  partySubscribe("createBullet", onCreateBullet);
}

export function enter() {
  //   my.bomb.yPos = 100;
  //   my.bomb.dY = 0;
}

export function update() {
  // physics sim
  //   my.bomb.yPos += my.bomb.dY; // momentum
  //   my.bomb.dY += 0.5; // gravity
  //   image(images.avatar[0].default, my.xPos, my.yPos, 30, 30);

  updateBomb();
}

export function draw() {
  image(images.map, 0, 0, width, height);

  shared.bombs.forEach(drawBomb);

  // for (const p of guests) {
  //   if (p.player) drawPlayers(p.player);
  // }

  // draw all players
  drawPlayers();
  moveCharacter();

  /* ------------------------------- UI/UX ------------------------------- */
  // draw info
  push();
  fill("white");
  text("play scene", 10, 20);
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
    if (!guests.find((p) => p.role === "player")) {
      // find the first observer
      const o = guests.find((p) => p.role === "observer");
      // if thats me, take the role
      if (o === my) {
        o.role = "player";
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

//host create bullets
function onCreateBullet(b) {
  if (partyIsHost()) shared.bombs.push(b);
}

/* --------------------------------- Client Code ---------------------------------- */

function moveCharacter() {
  // up: w, up arrow
  if (keyIsDown(87) /*w*/ || keyIsDown(38) /*up*/) {
    if (my.yPos > 0) my.yPos--;
    my.direction = "up";
  }
  // down: s, down arrow
  if (keyIsDown(83) /*s*/ || keyIsDown(40) /*left*/) {
    if (my.yPos < height) my.yPos++;
    my.direction = "down";
  }
  // left: a, left arrow
  if (keyIsDown(65) /*a*/ || keyIsDown(37) /*left*/) {
    if (my.xPos > 0) my.xPos--;
    my.direction = "left";
  }
  // right: d, right arrow
  if (keyIsDown(68) /*d*/ || keyIsDown(39) /*right*/) {
    if (my.xPos < width) my.xPos++;
    my.direction = "right";
  }
  //spin when getting hit
  //   for (const p of shared.bombs) {
  //     if (dist(p.xPos, p.yPos, my.bomb.xPos, my.bomb.yPos) < 15) {
  //       my.bomb.spin = 0.4;
  //     }
  //   }
  //   // gradually stop
  //   my.bomb.spin *= 0.98;
  //   my.bomb.angle += my.bomb.spin;
}

// function castBomb(b) {
// 	push();
// 	image(images.bomb, b.xPos, b.yPos, b.size, b.size);
// 	pop();
// 	for (const p of guests) {
// 	  if (dist(b.xPos, b.yPos, p.bomb.xPos, p.bomb.yPos) < 20) {
// 		b.size = 50;
// 	  } else {
// 		b.size = 20;
// 	  }
// 	}
//   }

//emit bomb
export function keyPressed() {
  if (keyCode === 32) {
    partyEmit("createBullet", {
      //start bomb here
      x: my.xPos,
      y: my.yPos,
      dX: 5,
      dY: -10,
      r: 20,
      //active: true,
    });
  }
}

// function startBomb() {
//   //how to write my pos

//   my.bomb.xPos = my.xPos;
//   my.bomb.yPos = my.yPos;
//   my.bomb.floor = my.yPos;
//   my.bomb.dX = 5;
//   my.bomb.dY = -10;
//   my.bomb.active = true;
// }

// function updateBomb(b) {
//   if (!my.bomb.active) return;
//   //velocity
//   my.bomb.xPos = my.bomb.xPos + my.bomb.dX;
//   my.bomb.yPos = my.bomb.yPos + my.bomb.dY;
//   //gravity
//   my.bomb.dY += 1;

//   //hurts enemies
//   my.bomb.active = false;

// }

function updateBomb(b) {
  //if (!active) return;
  //velocity
  b.x = b.x + b.dX;
  b.y = b.y + b.dY;
  //gravity
  b.dY += 1;

  //hurts enemies
  b.active = false;
}

function drawBomb(b) {
  if (!active) return;
  fill("red");
  ellipse(b.x, b.y, b.r * 2, b.r * 2);
}

/* --------------------------------- Input ---------------------------------- */

export function mousePressed() {
  //call change scene at a different time
  changeScene(scenes.title);
}
