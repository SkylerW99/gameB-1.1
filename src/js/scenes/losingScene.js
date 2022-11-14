export function setup() {}

export function draw() {
	/* ------------------------------- UI/UX ------------------------------- */
	// draw info
	push();
	fill('white');
	text('losing scene', 10, 20);
	pop();
}

export function mousePressed() {
	changeScene(scenes.score);
}
