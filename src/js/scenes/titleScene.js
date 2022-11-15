import { changeScene, scenes } from "../main.js";
import { noiseColor } from "../utilities.js";

export function draw() {
  background(noiseColor(millis() / 2000));

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
}

export function mousePressed() {
  changeScene(scenes.play);
}
