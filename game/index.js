const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d")

const scoreDiv = document.querySelector("#score")
scoreDiv.innerHTML = "0 - 0"

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

const player = new Paddle(
	position = {
		x: 0,
		y: (canvas.height / 2) - 75
	}
)

const enemy = new Paddle(
	position = {
		x: canvas.width - 50,
		y: (canvas.height / 2) - 75
	}
)

const circle = new Circle(
	position = {
		x : canvas.width / 2,
		y : canvas.height / 2
	}
)

function game_restart(){
	round_restart()
	circle.lastHit = true
	
	player.score = 0
	enemy.score = 0
	scoreDiv.innerHTML = player.score + " - " + enemy.score
}
	

function round_restart(){
	circle.position.x = canvas.width / 2
	circle.position.y = canvas.height / 2
	circle.velocity.x = Math.random() * (circle.maxSpeed - circle.minSpeed) + circle.minSpeed;
	if (!circle.lastHit)
		circle.velocity.x *= -1

	circle.velocity.y = Math.random() * (circle.maxSpeed - circle.minSpeed) + circle.minSpeed;
	if (Math.random() < 0.5) {
		circle.velocity.y *= -1;
	}

	player.position.x = 0
	player.position.y = (canvas.height / 2) - 75
	player.velocity.x = 0
	player.velocity.y = 0

	enemy.position.x = canvas.width - 50
	enemy.position.y = (canvas.height / 2) - 75
	enemy.velocity.x = 0
	enemy.velocity.y = 0

	scoreDiv.innerHTML = player.score + " - " + enemy.score
}
		
function animate(){
	c.clearRect(0, 0, canvas.width, canvas.height)
	circle.update()
	player.update()
	enemy.update()
	collisions(circle, player, enemy)
	if (isGameOver(circle, enemy, player))
		round_restart()
	window.requestAnimationFrame(animate)
}
round_restart()
animate()