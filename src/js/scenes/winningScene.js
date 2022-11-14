export function setup() {}

export function draw() {
	/* ------------------------------- UI/UX ------------------------------- */
	// draw info
	push();
	fill('white');
	text('winning scene', 10, 20);
	pop();
}

export function mousePressed() {
	changeScene(scenes.score);
}
