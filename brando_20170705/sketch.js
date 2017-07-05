
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

class Sphere {
  constructor(x, y, z) {
    let SMALL_INCREMENT = windowWidth > 400 ? 10 : 3;
    this.x = x;
    this.y = y;
    this.z = z;
    this.centerVX = 0;
    this.centerVY = 0;
    this.centerVZ = 0;
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

  moveShape() {
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

  draw() {
    // draw rect
    let alpha = this.a;
    if(this.tick < 500) {
      alpha = this.tick / 500.0 * alpha;
    }
    // fill(this.r, this.g, this.b, alpha);
    sphere(50);
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

  moveShape() {
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

  draw() {
    // draw rect
    let alpha = this.a;
    if(this.tick < 500) {
      alpha = this.tick / 500.0 * alpha;
    }
    fill(this.r, this.g, this.b, alpha);
    beginShape();
    vertex(this.x, this.y, this.z);
    for(let i = 0; i < this.dx.length; i++) {
      vertex(this.x + this.dx[i], this.y + this.dy[i], this.z + this.dz[i]);
		}
		// one last vertex back towards the beginning
    vertex(this.x, this.y, this.z);
    endShape();
    this.moveShape();
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
		this.yAngle = 0;
		this.zAngle = 0;
		this.xAngle = 0;
		this.run = true;
    this.r = Utils.randomBetween(0, 255);
    this.g = Utils.randomBetween(0, 255);
    this.b = Utils.randomBetween(0, 255);
    this.a = Utils.randomBetween(0, 180);
	}

	draw() {
	  background(this.r, this.g, this.b, this.a);

    this.yAngle += 0.001;
    this.zAngle += 0.002;
    this.xAngle += .0001;
    let sinVal = sin(frameCount * 0.0001 + j) * 100
    let cosVal = cos(frameCount * 0.0001 + j) * 100
    rotateY(this.yAngle);
    rotateX(this.xAngle);
    rotateZ(this.zAngle);

    let rotateVal = frameCount * 0.0002;
    for(var j = 0; j < 6; j++){
      push();
      for(var i = 0; i < 80; i++){
        sinVal = sin(frameCount * 0.0001 + j) * 100
        cosVal = cos(frameCount * 0.0001 + j) * 100
        translate(sinVal, cosVal, i * 0.1);
        rotateZ(rotateVal);
        push();
        // ambientLight(rotateVal * 255 % 255, abs(cosVal) * 5 % 255, abs(sinVal) * 5 % 255);
        sphere(8, 6, 4);
        pop();
      }
      pop();
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