function isBallCollidingWithPlayer(ball, paddle){
	if (
		ball.position.x - ball.radius < paddle.position.x + paddle.width &&
		ball.position.y - ball.radius < paddle.position.y + paddle.height &&
		ball.position.y + ball.radius > paddle.position.y && !ball.lastHit) 
	{
		return true
	}
	return false
}

function isBallCollidingWithEnemy(ball, paddle){
	if (
		ball.position.x + ball.radius > paddle.position.x &&

		ball.position.y - ball.radius < paddle.position.y + paddle.height &&
		ball.position.y + ball.radius > paddle.position.y && ball.lastHit) {
		return true
	}
	return false
}

function isGameOver(ball, enemy, player){
	if (ball.position.x - ball.radius < enemy.width / 4 || ball.position.x + ball.radius > canvas.width - enemy.width / 4){
		if (circle.lastHit) {
			player.score += 1
		} else {
			enemy.score += 1
		}
		return true
	}
	return false
}

function isBallCollidingWithWall(ball){
	if (ball.position.y + ball.radius > canvas.height || ball.position.y - ball.radius < 0){
		return true
	}
	return false
}

function isPaddleCollidingWithWall(paddle){
	if (paddle.position.y + paddle.velocity.y + paddle.height > canvas.height || paddle.position.y + paddle.velocity.y < 0){
		return true
	}
	return false
}


function collisions(circle, player, enemy){
	if (isBallCollidingWithPlayer(circle, player) || isBallCollidingWithEnemy(circle, enemy)) {
		circle.lastHit = !circle.lastHit
		circle.velocity.x = -circle.velocity.x	
	}
	
	if (isBallCollidingWithWall(circle)) {
		circle.velocity.y = -circle.velocity.y
	}
}