
class Utils {
	static randomBetween(min, max) {
		return Math.floor((Math.random() * (max - min)) + min);
	}

	static eachPoint(arr, whatToDo) {
		for(let i = 0; i < arr.length; i++) {
			arr[i] = whatToDo(arr[i], i);
		}
	}
}


class Tree {
	constructor(x, y, w, h, hue, sat, bright) {
		this.x = x;
		this.y = y;
		if(w > h / 2) {
			w = h / 2;
		}
		this.w = w;
		this.h = h;
		this.r = hue;
		this.g = sat;
		this.b = bright;
		this.tick = 0;
		this.dx = 0.0;
		this.dy = 0.0;
		this.scaleVal = 1.0;

		this.triangles = [];
		// trunk
		this.triangles.push(new Triangle(x, y, w/4, h/2));
		// branches
		let numBranches = Utils.randomBetween(2, 4);
		let dy = 3.0*h/4.0 / numBranches;
		for(let i = 0; i < numBranches; i++) {
			let branch = new Triangle(x, y - h/6.0 - 3.0/4*i * dy, w, dy);
			this.triangles.push(branch);
			console.log(branch.toString());
		}
	}

	scale(delta) {
		this.scaleVal *= delta;
	}

	move(dx, dy) {
		this.dx += dx;
		this.dy += dy;
	}

	draw() {
		// draw rect
		scale(this.scaleVal);
		translate(this.dx, this.dy);
		let alpha = this.a;
		for(let i = 0; i < this.triangles.length; i++) {
			if(i == 0) {
				// branch is brown
				fill(35 + Utils.randomBetween(-5, 5), 96 + Utils.randomBetween(-20, 20), 65, alpha);
			} else {
				fill(this.r, this.g, this.b, alpha);
			}
			this.triangles[i].draw();
		}
		translate(-this.dx, -this.dy);
		scale(1.0 / this.scaleVal);
	}

}


class Triangle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.centerVX = 0;
		this.centerVY = 0;
		this.originalDx = [-w/2, 0, w/2];
		this.originalDy = [h/2, -h/2, h/2];
		this.dx = [-w/2, 0, w/2];
		this.dy = [h/2, -h/2, h/2];
		this.vx = [0,0,0];
		this.vy = [0,0,0];
		this.tick = 0;
	}

	draw() {
		// draw rect
	  triangle(this.x + this.dx[0], this.y + this.dy[0], this.x + this.dx[1], this.y + this.dy[1],
	  		 this.x + this.dx[2], this.y + this.dy[2]);
	}

	toString() {
		return `Triangle, x ${this.x}, y ${this.y}, w ${this.w}, h ${this.h}`;
	}

}



class MySketch {
	constructor() {
		let cx = windowWidth / 2;
		let cy = windowHeight / 2;
		this.NUM_SHAPES = 12;
		this.shapes = [];
		this.tick = 0;
		this.shapeNums = _.times(this.NUM_SHAPES, (index) => { return index });
		this.shuffle(this.shapeNums);
		// console.log(this.shapeNums);
		this.vx = 1;
		this.vy = 1;
		this.hue = 360;
		this.sat = 10;
		this.bright = 0;

		colorMode(HSB);
	}

	shuffle(a) {
  	for (let i = a.length; i; i--) {
    	let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
	}

	draw() {
		noStroke();
		let gray = (Math.cos(this.tick / 500) + 1) * 256/2;
		// background(gray);
		if(this.tick % 1000) {
			this.hue = (Math.sin(this.tick / 1000) + 1) * 360/2;
			this.sat = (Math.cos(this.tick / 1000) + 1) * 100/2;
			this.bright = (Math.sin(this.tick / 1000) + 1) * 100/2;
		}
		background(10);
		// background(this.hue, this.sat, this.bright);
		// draw in reverse. last trees behind first trees
		for(let i = this.shapes.length - 1; i >= 0; i--) {
			this.shapes[i].draw();
		}
		this.tick++;

		// maybe change direction
		if(this.tick % 10 == 0 && Math.random() < .1) {
      this.vx += Utils.randomBetween(-1, 1);
			if(this.vx < -4) {
				this.vx = 1;
			} else if(this.vx > 4) {
				this.vx = -1;
			}
    }

		let MOVE_SPEED = 1;
		if(this.tick % MOVE_SPEED == 0) {
			for(let i = 0; i < this.shapes.length; i++) {
				this.shapes[i].move(this.vx, this.vy);
			}
		}
		let SCALE_SPEED = 2;
		let DELTA = 1.008;
		if(this.tick % SCALE_SPEED == 0) {
			for(let i = 0; i < this.shapes.length; i++) {
				let tree = this.shapes[i];
				tree.scale(DELTA);
			}
		}

		let numOffscreen = 0;
		for(let i = 0; i < this.shapes.length; i++) {
			if(this.shapes[i].dy < windowHeight + 250) {
				numOffscreen = i - 1;
				break;
			}
		}
		if(numOffscreen > 0) {
			this.shapes.splice(0, numOffscreen);
		}

		let NEW_SHAPE_TIME = 10;
		if(this.tick % NEW_SHAPE_TIME == 0) {
			let numColumns = 12;
			let boxW = windowWidth / (numColumns - 4);
			let colNum = (this.tick / NEW_SHAPE_TIME) % numColumns - 2;
			let w = Utils.randomBetween(50, 100);
			let h = Utils.randomBetween(100, 200);
			let x = Utils.randomBetween(colNum * boxW - .25*boxW, colNum * boxW + .25*boxW);
			let y = Utils.randomBetween(-2*h, -h/2);
			let hue = (Math.sin(this.tick / 100) + 1) * 360/2;
			let sat = Math.max(30, this.tick / 10 % 100);
			let bright = Math.max(30, (Math.cos(this.tick) + 1) * 100/2 - 20 + Utils.randomBetween(-20, 20));
			// console.log(`x ${x} y ${y} colNum ${colNum} rowNum ${rowNum} boxW ${boxW} boxH ${boxH}`);
			this.shapes.push(new Tree(x, y, w, h, hue, sat, bright));
		}
	}

}


///////////
// sigh, p5.js puts everything in global namespace.
// so we defer to our class above for drawing
///////////
let sketch;
function setup() {
	createCanvas(windowWidth, windowHeight);
	sketch = new MySketch();
}
function draw() {
	sketch.draw();
}
