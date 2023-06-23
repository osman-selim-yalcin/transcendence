class Sprite {
	velocity = {x: 0, y:0}
	constructor(position){
		this.position = position;
	}

}

class Paddle extends Sprite{
	height = 150
	width = 50
	score = 0

	draw(){
		c.fillStyle = "red"
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(){
		this.draw()
		if (!isPaddleCollidingWithWall(this))
			this.position.y += this.velocity.y
	}
}


class Circle extends Sprite{
	radius = 30
	maxSpeed = 10
	minSpeed = 5
	lastHit = true

	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.velocity.x *= 1.001;
	}
	draw(){
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
		c.strokeStyle= "#fff";
		c.fillStyle = "#fff";
		c.fill()
		c.stroke();
	}

}
