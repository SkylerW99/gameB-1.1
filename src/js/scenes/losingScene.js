import { changeScene, scenes } from "../main.js";

export function setup() {}

export function draw() {
  /* ------------------------------- UI/UX ------------------------------- */
  // draw info
  push();
  background(0);
  fill("white");
  text("You lose...", width / 2, 20);
  pop();
}

export function mousePressed() {
  changeScene(scenes.score);
}
