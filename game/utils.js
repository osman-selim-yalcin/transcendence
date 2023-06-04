function isBallCollidingWithPlayer(ball, paddle){
	if (
		ball.position.x - ball.radius < paddle.position.x + paddle.width &&

		ball.position.y - ball.radius < paddle.position.y + paddle.height &&
		ball.position.y + ball.radius > paddle.position.y && !ball.lastHit) {
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

function isGameOver(ball, paddle){
	if (ball.position.x - ball.radius < paddle.width / 4 || ball.position.x + ball.radius > canvas.width - paddle.width / 4){
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