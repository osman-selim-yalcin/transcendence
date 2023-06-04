const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d")

const scoreDiv = document.querySelector("#score")
scoreDiv.innerHTML = "0 - 0"

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

const player = new Paddle({
	position : {
		x: 0,
		y: (canvas.height / 2) - 75
	},
	velocity : {
		x: 0,
		y: 0
	}
})

const enemy = new Paddle({
	position : {
		x: canvas.width - 50,
		y: (canvas.height / 2) - 75
	},
	velocity : {
		x: 0,
		y: 0
	}
})

const circle = new Circle({
	position : {
		x : canvas.width / 2,
		y : canvas.height / 2
	},
	velocity : {
		x: 1,
		y: Math.random() * 10
	}
})

function game_restart(){
	round_restart()
	circle.velocity.x = 10
	circle.lastHit = true
	
	player.score = 0
	enemy.score = 0
	scoreDiv.innerHTML = player.score + " - " + enemy.score
}
	

function round_restart(){
	circle.position.x = canvas.width / 2
	circle.position.y = canvas.height / 2
	circle.velocity.x = 10
	if (!circle.lastHit)
		circle.velocity.x = -10

	circle.velocity.y = Math.random() * 10

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
	if (isBallCollidingWithPlayer(circle, player) || isBallCollidingWithEnemy(circle, enemy)) {
		circle.lastHit = !circle.lastHit
		circle.velocity.x = -circle.velocity.x	
	}
	
	if (isBallCollidingWithWall(circle)) {
		circle.velocity.y = -circle.velocity.y
	}
	if (isGameOver(circle, enemy)) {
		if (circle.lastHit) {
			player.score += 1
		} else {
			enemy.score += 1
		}
		round_restart()
	}

	window.requestAnimationFrame(animate)
}
animate()