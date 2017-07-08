
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
			let distance = 100;
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
		this.NUM_SHAPES = 12;
		this.shapes = [];
		this.tick = 0;
		this.shapeNums = _.times(this.NUM_SHAPES, (index) => { return index });
		this.shuffle(this.shapeNums);
		// console.log(this.shapeNums);
	}

	shuffle(a) {
  	for (let i = a.length; i; i--) {
    	let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
	}

	draw() {
		noStroke();
		let gray = (Math.sin(this.tick / 500) + 1) * 256/2;
		// background(gray);
		background(10);
		for(let i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
		}

		this.tick++;
		let NEW_SHAPE_TIME = 100;
		if(this.tick % NEW_SHAPE_TIME == 1 && this.shapes.length < this.NUM_SHAPES) {
			let numVertices = Utils.randomBetween(3, 24); 	// each bezier takes 3 points
			let numColumns = Math.ceil(Math.sqrt(this.NUM_SHAPES));
			let numRows = Math.ceil(this.NUM_SHAPES / numColumns);
			let boxW = windowWidth / numColumns;
			let boxH = windowHeight / numRows;
			let shapeNum = this.shapeNums[this.shapes.length];
			let colNum = shapeNum % numColumns;
			let rowNum = Math.floor(shapeNum / numColumns);
			// let x = Utils.randomBetween((colNum+.25) * boxW, (colNum+.75) * boxW);
			// let y = Utils.randomBetween((rowNum+.25) * boxH, (rowNum+.75) * boxH);
			let x = (colNum+.5) * boxW;
			let y = (rowNum+.5) * boxH;
			// console.log(`x ${x} y ${y} colNum ${colNum} rowNum ${rowNum} boxW ${boxW} boxH ${boxH}`);
			this.shapes.push(new Blob(x, y, numVertices));
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
