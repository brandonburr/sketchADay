
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
  constructor(x, y, numVertices) {
  	let SMALL_INCREMENT = windowWidth > 400 ? 10 : 3;
    this.x = x;
    this.y = y;
    if(numVertices < 4) {
    	numVertices = 4;
		}
    this.vertices = numVertices;
    this.centerVX = 0;
    this.centerVY = 0;

		this.dx = [];
		this.dy = [];
		let wedgeAngle = 360 / numVertices;
		// build dx and dy around a circle around the center
		for(let i = 0; i < numVertices; i++) {
			let angle = i*wedgeAngle;
			// let angle =  Utils.randomBetween(i*wedgeAngle, (i+1)*wedgeAngle);
			// let distance = Utils.randomBetween(20, 100);
			let distance = 25;
			let x = distance * Math.cos(angle);
			let y = distance * Math.sin(angle);
			this.dx.push(x);
			this.dy.push(y);
			// console.log(`i ${i} angle ${angle} distance ${distance} x ${x} y ${y}`)
		}
		// console.log(`x ${x} y ${y} dx and dys:`)
		// console.log(this.dx);
		// console.log(this.dy);
    this.vx = _.times(numVertices, (index) => { return -1 * numVertices + 2 * index});
    this.vy = _.times(numVertices, (index) => { return -1 * numVertices + 2 * index});
    this.r = Utils.randomBetween(0, 255);
    this.g = Utils.randomBetween(0, 255);
    this.b = Utils.randomBetween(0, 255);
    this.a = 255;
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
    fill(this.r, this.g, this.b, alpha);
		// ellipse(this.x, this.y, 10, 10);
		let tightness = Math.sin(this.tick / 500) * 5;
		curveTightness(tightness);

    beginShape();
    vertex(this.x, this.y);
    for(let i = 0; i < this.dx.length; i++) {
			// fill(0);
			// ellipse(this.x + this.dx[i], this.y + this.dy[i], 3*i, 3*i);
			fill(this.r, this.g, this.b, alpha);
      curveVertex(this.x + this.dx[i], this.y + this.dy[i]);
		}
		// one last curve back towards the beginning
    curveVertex(this.x, this.y);
    endShape();

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

class Circle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.centerVX = 0;
		this.centerVY = 0;
		this.originalDx = [0];
		this.originalDy = [0];
		this.dx = [0];
		this.dy = [0];
		this.vx = [0,0,0];
		this.vy = [0,0,0];
		this.r = Utils.randomBetween(0, 255);
		this.g = Utils.randomBetween(0, 255);
		this.b = Utils.randomBetween(0, 255);
		this.a = 255;
		this.tick = 0;

		this.maybeChangeVelocity = this.maybeChangeVelocity.bind(this);
	}

	maybeChangeVelocity(val, index) {
		if(Math.random() < .1) {
			val = Utils.randomBetween(-1, 1);
		}
		return val;
	}

	draw() {
		// draw rect
		let alpha = this.a;
		fill(this.r, this.g, this.b, alpha);
	  ellipse(this.x, this.y, this.w + this.dx[0], this.h + this.dy[0]);
	  // fill(100, 255, 100);
	  // ellipse(this.x, this.y, 10, 10);

		if(this.tick % 3 == 0) {
			// move each corner by its velocity
		  Utils.eachPoint(this.dx, (val, index) => {
		  	if(val - this.originalDx[index] > 50) {
		  		this.vx[index] = -1;
		  	} else if(val - this.originalDx[index] < -50) {
		  		this.vx[index] = 1;
		  	}
		  	return val += this.vx[index];
		  });
		  Utils.eachPoint(this.dy, (val, index) => {
		  	if(val - this.originalDy[index] > 50) {
		  		this.vy[index] = -1;
		  	} else if(val - this.originalDy[index] < -50) {
		  		this.vy[index] = 1;
		  	}
		  	return val += this.vy[index];
		  });

		  // maybe change corner velocity
		  Utils.eachPoint(this.vx, this.maybeChangeVelocity);
		  Utils.eachPoint(this.vy, this.maybeChangeVelocity);
		}

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



class Triangle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.centerVX = 0;
		this.centerVY = 0;
		this.originalDx = [-w/2, 0, w/2];
		this.originalDy = [h/2, -h/2, h/2];
		this.dx = [-w/2, 0, w/2];
		this.dy = [h/2, -h/2, h/2];
		this.vx = [0,0,0];
		this.vy = [0,0,0];
		this.r = Utils.randomBetween(0, 255);
		this.g = Utils.randomBetween(0, 255);
		this.b = Utils.randomBetween(0, 255);
		this.a = 255;
		this.tick = 0;

		this.maybeChangeVelocity = this.maybeChangeVelocity.bind(this);
	}

	maybeChangeVelocity(val, index) {
		if(Math.random() < .1) {
			val = Utils.randomBetween(-1, 1);
		}
		return val;
	}

	draw() {
		// draw rect
		let alpha = this.a;
		fill(this.r, this.g, this.b, alpha);
	  triangle(this.x + this.dx[0], this.y + this.dy[0], this.x + this.dx[1], this.y + this.dy[1],
	  		 this.x + this.dx[2], this.y + this.dy[2]);
	  // fill(100, 255, 100);
	  // ellipse(this.x, this.y, 10, 10);

		if(this.tick % 3 == 0) {
			// move each corner by its velocity
		  Utils.eachPoint(this.dx, (val, index) => {
		  	if(val - this.originalDx[index] > 50) {
		  		this.vx[index] = -1;
		  	} else if(val - this.originalDx[index] < -50) {
		  		this.vx[index] = 1;
		  	}
		  	return val += this.vx[index];
		  });
		  Utils.eachPoint(this.dy, (val, index) => {
		  	if(val - this.originalDy[index] > 50) {
		  		this.vy[index] = -1;
		  	} else if(val - this.originalDy[index] < -50) {
		  		this.vy[index] = 1;
		  	}
		  	return val += this.vy[index];
		  });

		  // maybe change corner velocity
		  Utils.eachPoint(this.vx, this.maybeChangeVelocity);
		  Utils.eachPoint(this.vy, this.maybeChangeVelocity);
		}

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


class Rect {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.centerVX = 0;
		this.centerVY = 0;
		this.originalDx = [-w/2, w/2, w/2, -w/2];
		this.originalDy = [-h/2, -h/2, h/2, h/2];
		this.dx = [-w/2, w/2, w/2, -w/2];
		this.dy = [-h/2, -h/2, h/2, h/2];
		this.vx = [0,0,0,0];
		this.vy = [0,0,0,0];
		this.r = Utils.randomBetween(0, 255);
		this.g = Utils.randomBetween(0, 255);
		this.b = Utils.randomBetween(0, 255);
		this.a = 255;
		this.tick = 0;

		this.maybeChangeVelocity = this.maybeChangeVelocity.bind(this);
	}

	maybeChangeVelocity(val, index) {
		if(Math.random() < .1) {
			val = Utils.randomBetween(-1, 1);
		}
		return val;
	}

	draw() {
		// draw rect
		let alpha = this.a;
		fill(this.r, this.g, this.b, alpha);
	  quad(this.x + this.dx[0], this.y + this.dy[0], this.x + this.dx[1], this.y + this.dy[1],
	  		 this.x + this.dx[2], this.y + this.dy[2], this.x + this.dx[3], this.y + this.dy[3]);
	  // fill(100, 255, 100);
	  // ellipse(this.x, this.y, 10, 10);

		if(this.tick % 3 == 0) {
			// move each corner by its velocity
		  Utils.eachPoint(this.dx, (val, index) => {
		  	if(val - this.originalDx[index] > 50) {
		  		this.vx[index] = -1;
		  	} else if(val - this.originalDx[index] < -50) {
		  		this.vx[index] = 1;
		  	}
		  	return val += this.vx[index];
		  });
		  Utils.eachPoint(this.dy, (val, index) => {
		  	if(val - this.originalDy[index] > 50) {
		  		this.vy[index] = -1;
		  	} else if(val - this.originalDy[index] < -50) {
		  		this.vy[index] = 1;
		  	}
		  	return val += this.vy[index];
		  });

		  // maybe change corner velocity
		  Utils.eachPoint(this.vx, this.maybeChangeVelocity);
		  Utils.eachPoint(this.vy, this.maybeChangeVelocity);
		}

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
		this.NUM_SHAPES = 1;
		this.shapes = [];
		this.tick = 0;

		// let y = Utils.randomBetween((rowNum+.25) * boxH, (rowNum+.75) * boxH);
		let w = windowWidth;
		let h = windowHeight;
		// grass
		this.shapes.push(new Rect(w/2, 15/16*h, 1.3*w, 2/8*h));
		// house
		this.shapes.push(new Rect(6/8*w, 11/16*h, 1/4*w, 4/8*h));
		// roof
		this.shapes.push(new Triangle(6/8*w, 5.5/16*h, 6/16*w, 1/4*h));

		// windows
		this.shapes.push(new Rect(11/16*w, 9/16*h, 1/16*w, 1.5/16*h));
		this.shapes.push(new Rect(13/16*w, 9/16*h, 1/16*w, 1.5/16*h));
		this.shapes.push(new Rect(11/16*w, 12/16*h, 1/16*w, 1.5/16*h));
		// door
		this.shapes.push(new Rect(13/16*w, 13.5/16*h, 1/16*w, 3/16*h));
		this.shapes.push(new Circle(12.75/16*w, 13.5/16*h, .5/16*h, .5/16*h));

		// sun
		this.shapes.push(new Circle(4.5/16*w, 2.5/16*h, 3/16*h, 3/16*h));

		// flowers
		this.shapes.push(new Blob(2.5/16*w, 14/16*h, 12));
		this.shapes.push(new Blob(3.5/16*w, 14.25/16*h, 18));
		this.shapes.push(new Blob(4.5/16*w, 14.5/16*h, 8));
		this.shapes.push(new Blob(5/16*w, 14/16*h, 16));
		this.shapes.push(new Blob(5.75/16*w, 14.5/16*h, 9));
		this.shapes.push(new Blob(6.25/16*w, 14.75/16*h, 26));
		this.shapes.push(new Blob(7/16*w, 14.25/16*h, 15));
	}

	shuffle(a) {
  	for (let i = a.length; i; i--) {
    	let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
	}

	draw() {
		noStroke();
		let gray = (Math.sin(this.tick / 10) + 1) * 256/2;
		background(gray);
		// background(255);
		for(let i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
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
