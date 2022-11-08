let stats;
let shared, my, guests;
let bombSize = 20;

function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "SkyEdit_GameB1.1",
    "main"
  );
  shared = partyLoadShared("shared", { bullets: [] });
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();

  //image assets
  bomb_1 = loadImage("assets/bomb.png");
  map_1 = loadImage("assets/map.png");
  character_1 = loadImage("assets/character1.png");
}

function setup() {
  createCanvas(600, 400).parent("canvas-wrap");
  stats = new StatTracker(my);

  my.tank = {
    x: random(width),
    y: 300,
    a: random(2 * PI),
    spin: 0,
  };

  // hosting can change mid-game so every client subscribes, and then checks if it is host on every message
  partySubscribe("createBullet", onCreateBullet);
}

function draw() {
  moveTank();
  if (partyIsHost()) stepGame();
  drawScene();

  stats.tick();

  // for debug
  // debugShow({
  //   stats,
  //   guests: guests,
  // });
}

///////////////////////////////////////////
// HOST CODE

function stepGame() {
  shared.bullets.forEach(stepBullet);
}

function stepBullet(b) {
  b.x += b.dX;
  b.y += b.dY;

  // remove out of bounds bullets
  if (!pointInRect(b, new Rect(0, 0, 500, 400))) {
    const i = shared.bullets.indexOf(b);
    shared.bullets.splice(i, 1);
  }
}

function onCreateBullet(b) {
  if (partyIsHost()) shared.bullets.push(b);
}

///////////////////////////////////////////
// CLIENT CODE - LOGIC

function moveTank() {
  // forward: w
  if (keyIsDown(87) /*w*/) {
    my.tank.x += sin(my.tank.a) * 3;
    my.tank.y -= cos(my.tank.a) * 3;
  }

  // backward: s
  if (keyIsDown(83) /*s*/) {
    my.tank.x += sin(my.tank.a) * -1;
    my.tank.y -= cos(my.tank.a) * -1;
  }
  //a
  if (keyIsDown(65) /*a*/) my.tank.a -= radians(2);
  //d
  if (keyIsDown(68) /*d*/) my.tank.a += radians(2);

  //spin when getting hit
  for (const bullet of shared.bullets) {
    if (dist(bullet.x, bullet.y, my.tank.x, my.tank.y) < 15) {
      my.tank.spin = 0.4;
    }
  }
  //gradually stop
  my.tank.spin *= 0.98;
  my.tank.a += my.tank.spin;
}

function keyPressed() {
  if (key === " ") {
    partyEmit("createBullet", {
      x: my.tank.x + sin(my.tank.a) * 24,
      y: my.tank.y - cos(my.tank.a) * 24,
      dX: sin(my.tank.a) * 8,
      dY: -cos(my.tank.a) * 8,
    });
  }

  return false;
}

///////////////////////////////////////////
// CLIENT CODE - DRAW

function drawScene() {
  noStroke();
  background(map_1, 0, 0, 600, 400);
  shared.bullets.forEach(drawBullet);
  for (const p of guests) {
    if (p.tank) drawTank(p.tank);
  }
}

function drawTank(tank) {
  push();
  rectMode(CENTER);
  translate(tank.x, tank.y);
  rotate(tank.a);
  //*Note: image needs more fine tuning for the angles
  //image(character_1, 0, 0, 60, 60);
  rect(0, 0, 35, 35);
  rect(0, -20, 10, 10);
  pop();
}

//set my bomb size
function drawBullet(b) {
  push();
  image(bomb_1, b.x, b.y, bombSize, bombSize);
  pop();
  for (const p of guests) {
    if (dist(my.tank.x, my.tank.y, p.tank.x, p.tank.y) < 20) {
      bombSize = 50;
    } else {
      bombSize = 20;
    }
  }
}

window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32 && e) {
    e.preventDefault();
  }
});

//bomb becomes larger when they get closer
// function stack() {
//   for (const p of guests) {
//     if (dist(my.tank.x, my.tank.y, p.tank.x, p.tank.y) < 20) {
//       bombSize = 100;
//     } else {
//       push();
//       text("not close", 50, 50);
//       pop();
//     }
//   }
// }
