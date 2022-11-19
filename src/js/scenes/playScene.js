import {
  changeScene,
  scenes,
  shared,
  my,
  guests,
  images,
  PLAYER_NUM,
} from "../main.js";

//import { hideButtons } from "../buttons.js";

//player names
const names = [
  "Wind",
  "Snow",
  "Light",
  "Smoke",
  "Fog",
  "Cloud",
  "Bird",
  "Plane",
  "Rain",
  "Rainbow",
  "Angel",
  "Pilot",
];

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function setup() {
  my.bomb = {
    xPos: 0, // position of ball
    yPos: 0,
    dX: 0, // velocity of ball
    dY: 0,
    r: 20, // radius or
    active: true, // if the ball is visible
    floor: 0, // where the ball drops
    age: 0, // length
  };

  my.name = pick(names);
  my.life = 5;

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
  //hideButtons();

  //shared.bombs.forEach(drawBomb);
  //draw names
  for (let i = 0; i < guests.length; i++) {
    textSize(13);
    fill(60, 14, 12);
    //how to change my name into a different color?
    text(guests[i].name + ":" + guests[i].life, 100 * i + 100, 20);
  }

  // draw me
  image(images.avatar[0].default, my.xPos, my.yPos, 30, 30);
  // draw bombs
  for (const guest of guests) {
    drawBomb(guest.bomb);
  }
  // draw all players
  drawPlayers();
  // move me
  moveCharacter();
  //decrease life when getting hit

  /* ------------------------------- UI/UX ------------------------------- */
  // draw info
  push();
  fill("white");
  text("play scene", 10, 20);
  pop();

  //win&lose
  exit();
}

/* --------------------------------- Bomb ---------------------------------- */

function startBomb(bomb, player) {
  bomb.xPos = player.xPos;
  bomb.yPos = player.yPos;
  bomb.floor = player.yPos;
  //bomb.dY = -10;
  bomb.active = true;
  bomb.age = 0;
  console.log(bomb, player);

  if (player.direction == "right") {
    bomb.dX = 5;
    bomb.dY = -10;
  } else if (player.direction == "left") {
    bomb.dX = -5;
    bomb.dY = -10;
  } else if (player.direction == "up") {
    bomb.dX = 0;
    bomb.dY = -10;
  } else if (player.direction == "down") {
    bomb.dX = 0;
    bomb.dY = 5;
  }
}

function updateBomb(bomb, player) {
  if (!bomb.active) return;

  bomb.xPos += bomb.dX;
  bomb.yPos += bomb.dY; // apply velocity to y
  bomb.dY += 0.6;

  //different movement for different directions
  if (bomb.yPos > bomb.floor) {
    if (
      player.direction == "left" ||
      player.direction == "right" ||
      player.direction == "up"
    ) {
      bomb.dY = -abs(bomb.dY);
    } else if (player.direction == "down") {
      bomb.dY -= 0.7;
    }
  }
  // age bomb
  bomb.age++;
  if (bomb.age > 35) {
    // hurt enemies
    bomb.active = false;
  }

  //wait for bomb to activate
  if (bomb.age < 20) return; // return means not executing the rest of the parts

  //check distance & explode when dist < 10
  let explode = false;
  for (const guest of guests) {
    if (dist(bomb.xPos, bomb.yPos, guest.xPos, guest.yPos) < 10) {
      explode = true;
      break; // break means no longer execute this function once one collision is detected
    }
  }

  //hurt everyone within dist < 20
  //could play with the damage range here
  if (explode) {
    bomb.active = false;
    for (const guest of guests) {
      if (dist(bomb.xPos, bomb.yPos, guest.xPos, guest.yPos) < 20) {
        guest.life -= 1;
      }
    }
  }
}

function drawBomb(bomb) {
  // render
  if (!bomb.active) return;
  fill("black");
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

/* --------------------------------- Input ---------------------------------- */

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

export function mousePressed() {
  //changeScene(scenes.title);
}

export function keyPressed() {
  if (keyCode === 32) {
    startBomb(my.bomb, my);
    console.log("space is pressed");
  }
}

function exit() {
  for (const guest of guests) {
    if (guest.life == 0 && my.life > 0) {
      changeScene(scenes.win);
    } else if (guest.life > 0 && my.life == 0) {
      changeScene(scenes.lose);
    }
  }
}
