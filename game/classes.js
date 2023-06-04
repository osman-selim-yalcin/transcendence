class Sprite {
	constructor({position, velocity}){
		this.position = position;
		this.velocity = velocity;
	}

	
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
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
}


class Circle extends Sprite{
	radius = 30
	lastHit = true
	draw(){
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
		c.strokeStyle= "#fff";
		c.fillStyle = "#fff";
		c.fill()
		c.stroke();
	}

}
