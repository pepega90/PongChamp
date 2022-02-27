import kaboom from "kaboom";

kaboom({
	width: 800,
	height: 600,
	background: [0, 0, 0],
});

// game variable
let score1 = 0;
let score2 = 0;
let scored = false;

scene("menu", () => {
	onKeyPress("space", () => {
		go("game");
	});

	onDraw(() => {
		drawText({
			text: "PongChamp",
			pos: vec2(width() / 2, height() / 4),
			origin: "center",
		});

		drawText({
			text: 'Tekan "SPACE" untuk play',
			size: 30,
			pos: center(),
			origin: "center",
		});

		drawText({
			text: "created by aji mustofa @pepega90",
			size: 25,
			pos: vec2(width() / 2, height() - 20),
			origin: "center",
			//   color: YELLOW,
		});
	});
});

scene("game", () => {
	// create player
	let player = add([
		rect(20, 100),
		pos(width() - 60, height() / 2 - 40),
		area(),
		{
			speed: 300,
		},
	]);

	// create musuh
	let musuh = add([
		rect(20, 100),
		pos(30, height() / 2 - 40),
		area(),
		{
			speed: 5,
		},
	]);

	// create bola
	let bola = add([
		circle(10),
		pos(center()),
		origin("center"),
		"bola",
		{ speed: vec2(5, 5) },
	]);

	// control player
	onKeyDown("up", () => {
		if (player.pos.y > 0) player.move(0, -player.speed);
	});

	onKeyDown("down", () => {
		if (player.pos.y < height() - player.height)
			player.move(0, player.speed);
	});

	// AI musuh
	musuh.onUpdate(() => {
		// batas bawah musuh
		if (
			musuh.pos.y + musuh.height / 2 < bola.pos.y &&
			musuh.pos.y < height() - musuh.height
		) {
			musuh.pos.y += musuh.speed;
		}

		// batas atas musuh
		if (musuh.pos.y + musuh.height / 2 > bola.pos.y && musuh.pos.y > 0) {
			musuh.pos.y += -musuh.speed;
		}
	});

	bola.onUpdate(() => {
		// check bola dengan batas atas dan bawah layar
		if (bola.pos.y > height() - 10 || bola.pos.y < 10) {
			bola.speed.y *= -1;
		}

		// check jika bola goal ke player
		if (bola.pos.x > width() && !scored) {
			scored = true;
			score1 += 1;
			wait(1, () => {
				scored = false;
				bola.pos = center();
				bola.speed.x *= -1;
			});
		}
		// check jika bola goal ke musuh
		else if (bola.pos.x < 0 && !scored) {
			scored = true;
			score2 += 1;
			wait(1, () => {
				scored = false;
				bola.pos = center();
				bola.speed.x *= -1;
			});
		}
		// check collision dimana bola collide ke player dan musuh
		if (
			checkBolaCollision(bola, player) ||
			checkBolaCollision(bola, musuh)
		) {
			bola.speed.x *= -1;
		}

		// update bola position
		bola.pos.y += bola.speed.y;
		bola.pos.x += bola.speed.x;
	});

	//   function untuk menambahkan kecepatan bola setiap 5 detik
	function speedUp() {
		if (bola.speed.x > 0) bola.speed.x += 1;
		if (bola.speed.x < 0) bola.speed.x -= 1;

		if (bola.speed.y > 0) bola.speed.y += 1;
		if (bola.speed.y < 0) bola.speed.y -= 1;

		wait(5, () => {
			if (
				bola.speed.x == -8 ||
				(bola.speed.x == 8 && bola.speed.y == 8) ||
				bola.speed.y == -8
			)
				return;

			speedUp();
		});
	}
	speedUp();

	// draw section
	onDraw(() => {
		drawText({
			text: "" + score1,
			pos: vec2(width() / 2 - 50, 35),
			origin: "center",
		});

		drawText({
			text: "" + score2,
			pos: vec2(width() / 2 + 50, 35),
			origin: "center",
		});
		for (let i = 0; i < height(); i++) {
			drawRect({
				width: 5,
				height: 5,
				pos: vec2(width() / 2, i * 15),
				origin: "center",
			});
		}
	});
});

go("menu");

// function untuk melakukan check collision antara bola dengan player/musuh
function checkBolaCollision(bola, papan) {
	let posX = bola.pos.x;
	let posY = bola.pos.y;

	if (bola.pos.x < papan.pos.x) posX = papan.pos.x;
	else if (bola.pos.x > papan.pos.x + papan.width)
		posX = papan.pos.x + papan.width;

	if (bola.pos.y < papan.pos.y) posY = papan.pos.y;
	else if (bola.pos.y > papan.pos.y + papan.height)
		posY = papan.pos.y + papan.height;

	let p = vec2(posX, posY);
	let distance = bola.pos.dist(p);
	// let distX = bola.pos.x - posX;
	// let distY = bola.pos.y - posY;
	// let distance = Math.sqrt(distX * distX + distY * distY);

	// 10 adalah radius dari bola
	if (distance <= 10) return true;
	return false;
}
