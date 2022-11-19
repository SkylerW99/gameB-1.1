import { changeScene, scenes } from "../main.js";

let startGameButton;

export function setup() {}

export function draw() {
  background(0);

  // draw info
  push();
  fill("white");
  text("title scene", 10, 20);
  pop();

  // draw title
  push();
  fill("rgba(255,255,255,0.2)");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Die Die Fun", width * 0.5, height * 0.5);
  pop();

  push();
  textSize(30);
  fill("white");
  text("Press RETURN/ENTER to start.", width * 0.5 - 200, height * 0.9);
  pop();
}

export function keyPressed() {
  if (keyCode == 13) {
    changeScene(scenes.play);
  }
}
