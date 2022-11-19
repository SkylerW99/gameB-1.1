import { changeScene, scenes } from "../main.js";

export function setup() {}

export function draw() {
  /* ------------------------------- UI/UX ------------------------------- */
  // draw info
  background(0);
  push();
  fill("white");
  text("you win!", width / 2, 20);
  pop();
}

export function mousePressed() {
  //changeScene(scenes.score);
}
