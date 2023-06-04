
window.addEventListener("keydown", (e) => {
	if(e.key === "ArrowUp"){
		player.velocity.y = -10
	}
	else if(e.key === "ArrowDown"){
		player.velocity.y = 10
	}
	else if(e.key === "w"){
		enemy.velocity.y = -10
	}
	else if(e.key === "s"){
		enemy.velocity.y = 10
	}
	else if(e.key === "d"){//tmp
		circle.velocity.x += 1
	}
	else if(e.key === "a"){
		circle.velocity.x -= 1
	}


})

window.addEventListener("keyup", (e) => {
	if(e.key === "ArrowUp"){
		player.velocity.y = 0
	}
	else if(e.key === "ArrowDown"){
		player.velocity.y = 0
	}
	else if(e.key === "w"){
		enemy.velocity.y = 0
	}
	else if(e.key === "s"){
		enemy.velocity.y = 0
	}
})
