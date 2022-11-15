import { changeScene, scenes } from "../main.js";

import { shared, my, guests, images, PLAYER_NUM } from "../main.js";

export function setup() {
  assignPosition();
  assignPlayers();

  // hosting can change mid-game so every client subscribes, and then checks if it is host on every message
  partySubscribe("createBullet", onCreateBullet);
}

export function enter() {}

export function update() {
  for (const p of guests) {
    updateBomb(p);
  }
  updateBomb(my);
}

export function draw() {
  image(images.map, 0, 0, width, height);

  //shared.bombs.forEach(drawBomb);
  for (const p of guests) {
    drawBomb(p);
  }
  drawBomb(my);

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
}

//emit bomb, initate bomb
export function keyPressed() {
  if (keyCode === 32) {
    partyEmit("createBullet", {
      //start bomb here
      x: my.xPos,
      y: my.yPos,
      dX: 5,
      dY: -10,
      r: 20,
      active: true,
    });
  }
}

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
  if (!b.active) return;
  fill("red");
  ellipse(b.x, b.y, b.r * 2, b.r * 2);
}

/* --------------------------------- Input ---------------------------------- */

export function mousePressed() {
  //call change scene at a different time
  changeScene(scenes.title);
}
