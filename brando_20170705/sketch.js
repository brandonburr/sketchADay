
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


class Blob {
  constructor(x, y, z, numVertices) {
  	let SMALL_INCREMENT = windowWidth > 400 ? 10 : 3;
    this.x = x;
    this.y = y;
    this.z = z;
    if(numVertices < 4) {
    	numVertices = 4;
		}
    this.vertices = numVertices;
    this.centerVX = 0;
    this.centerVY = 0;
    this.centerVZ = 0;
    this.dx = _.times(numVertices, (index) => { return -SMALL_INCREMENT * numVertices + 2 * SMALL_INCREMENT * index});
    this.dy = _.times(numVertices, (index) => { return -SMALL_INCREMENT * numVertices + 2 * SMALL_INCREMENT * index});
    this.dz = _.times(numVertices, (index) => { return -SMALL_INCREMENT * numVertices + 2 * SMALL_INCREMENT * index});
    this.vx = _.times(numVertices, (index) => { return -1 * numVertices + 2 * index});
    this.vy = _.times(numVertices, (index) => { return -1 * numVertices + 2 * index});
    this.vz = _.times(numVertices, (index) => { return -1 * numVertices + 2 * index});
    this.r = Utils.randomBetween(0, 255);
    this.g = Utils.randomBetween(0, 255);
    this.b = Utils.randomBetween(0, 255);
    this.a = Utils.randomBetween(0, 180);
    this.tick = 0;

    this.maybeChangeVelocity = this.maybeChangeVelocity.bind(this);
  }

  maybeChangeVelocity(val, index) {
    if(Math.random() < .1) {
      val = Utils.randomBetween(-2, 3);
    }
    return val;
  }

  draw() {
    // draw rect
    let alpha = this.a;
    if(this.tick < 500) {
      alpha = this.tick / 500.0 * alpha;
    }
    fill(this.r, this.g, this.b, alpha);
    beginShape();
    vertex(this.x, this.y, this.z);
    for(let i = 0; i < this.dx.length - 3; i += 3) {
      bezierVertex(this.x + this.dx[i], this.y + this.dy[i], this.z + this.dz[i],
									this.x + this.dx[i+1], this.y + this.dy[i+1], this.z + this.dz[i+1],
										this.x + this.dx[i+2], this.y + this.dy[i+2], this.z + this.dz[i+2],);
		}
		// one last bezier back towards the beginning
    bezierVertex(this.x - this.dx[1], this.y - this.dy[1], this.z + this.dz[1],
								this.x - this.dx[0], this.y - this.dy[0], this.z + this.dz[0],
      					this.x, this.y, this.z);
    endShape();

    // move each corner by its velocity
    Utils.eachPoint(this.dx, (val, index) => {
			if(val > 300) {
				this.vx[index] = -2;
			} else if(val < -300) {
				this.vx[index] = 2;
			}
			return val += this.vx[index];
		});
    Utils.eachPoint(this.dy, (val, index) => {
      if(val > 300) {
  	    this.vy[index] = -2;
    	} else if(val < -300) {
      	this.vy[index] = 2;
    	}
    	return val += this.vy[index];
	  });
    Utils.eachPoint(this.dz, (val, index) => {
      if(val > 300) {
      this.vz[index] = -2;
    } else if(val < -300) {
      this.vz[index] = 2;
    }
    return val += this.vy[index];
  });

    // maybe change corner velocity
    Utils.eachPoint(this.vx, this.maybeChangeVelocity);
    Utils.eachPoint(this.vy, this.maybeChangeVelocity);
    Utils.eachPoint(this.vz, this.maybeChangeVelocity);

    // move centroid by velocity and bounce
    this.x += this.centerVX;
    this.y += this.centerVY;
    this.z += this.centerVZ;
    if(this.x > windowWidth || this.x < 0) {
      this.centerVX *= -1;
    }
    if(this.y > windowHeight || this.y < 0) {
      this.centerVY *= -1;
    }
    if(this.z > windowHeight || this.z < 0) {
      this.centerVZ *= -1;
    }
    this.tick++;
  }
}

class Quad {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.centerVX = 2;
		this.centerVY = 2;
		this.dx = [-20, -20, 20, 20];
		this.dy = [-15, -15, 15, 15];
		this.vx = [-1, -1, 1, 1];
		this.vy = [-1, -1, 1, 1];
		this.r = Utils.randomBetween(0, 255);
		this.g = Utils.randomBetween(0, 255);
		this.b = Utils.randomBetween(0, 255);
		this.a = Utils.randomBetween(0, 255);
		this.tick = 0;

		this.maybeChangeVelocity = this.maybeChangeVelocity.bind(this);
	}

	maybeChangeVelocity(val, index) {
		if(Math.random() < .1) {
			val = Utils.randomBetween(-2, 2);
		}
		return val;
	}

	draw() {
		// draw rect
		let alpha = this.a;
		if(this.tick < 500) {
			alpha = this.tick / 500.0 * alpha;
		}
		fill(this.r, this.g, this.b, alpha);
	  quad(this.x + this.dx[0], this.y + this.dy[0], this.x + this.dx[1], this.y + this.dy[1],
	  		 this.x + this.dx[2], this.y + this.dy[2], this.x + this.dx[3], this.y + this.dy[3]);
	  // fill(100, 255, 100);
	  // ellipse(this.x, this.y, 10, 10);

	  // move each corner by its velocity
	  Utils.eachPoint(this.dx, (val, index) => {
	  	if(val > 300) {
	  		this.vx[index] = -2;
	  	} else if(val < -300) {
	  		this.vx[index] = 2;
	  	}
	  	return val += this.vx[index];
	  });
	  Utils.eachPoint(this.dy, (val, index) => {
	  	if(val > 300) {
	  		this.vy[index] = -2;
	  	} else if(val < -300) {
	  		this.vy[index] = 2;
	  	}
	  	return val += this.vy[index];
	  });

	  // maybe change corner velocity
	  Utils.eachPoint(this.vx, this.maybeChangeVelocity);
	  Utils.eachPoint(this.vy, this.maybeChangeVelocity);

	  // move centroid by velocity and bounce
	  this.x += this.centerVX;
	  this.y += this.centerVY;
	  if(this.x > windowWidth || this.x < 0) {
	  	this.centerVX *= -1;
	  }
	  if(this.y > windowHeight || this.y < 0) {
	  	this.centerVY *= -1;
	  }
	  this.tick++;
	}

}

class MySketch {
	constructor() {
		let cx = windowWidth / 2;
		let cy = windowHeight / 2;
		let NUM_SHAPES = 10;
		this.shapes = [];
		this.tick = 0;
	}

	draw() {
		noStroke();
		let gray = (Math.sin(this.tick / 500) + 1) * 256/2;
		background(gray);
		// background(0, 0, 5, 20);
		for(let i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
		}
		this.tick++;
		let NEW_SHAPE_TIME = 100;
		let DELETE_SHAPE_TIME = 5000;
		let NUM_SHAPES = 5;
		if(this.tick % NEW_SHAPE_TIME == 1 && this.shapes.length < NUM_SHAPES) {
			let numVertices = Utils.randomBetween(1, 8) * 3; 	// each bezier takes 3 points
			let x = Utils.randomBetween(0, windowWidth);
			let y = Utils.randomBetween(0, windowHeight);
      let z = Utils.randomBetween(-windowHeight, windowHeight);
      this.shapes.push(new Blob(x, y, z, numVertices));
		} else if(this.tick % DELETE_SHAPE_TIME == 0) {
			this.shapes = this.shapes.slice(1, this.shapes.length);
		}
	}

}


///////////
// sigh, p5.js puts everything in global namespace. 
// so we defer to our class above for drawing
///////////
let sketch;
function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	sketch = new MySketch();
}
function draw() {
	sketch.draw();
}