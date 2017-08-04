
class Utils {
	static randomBetween(min, max) {
		return Math.floor((Math.random() * (max - min)) + min); 
	}

	static distance(x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
  }
}

class Preacher {
  constructor(x, y, size, preachingRadius) {
    this.x = x
    this.y = y
    this.size = size
    this.preachingRadius = preachingRadius
  }

  draw() {
    let x = this.x
    let y = this.y
    let w = this.size

    fill('#00FF00')
    ellipse(x, y, 2*w, 2*w)

    noFill()
    stroke(0)
    ellipse(x, y, 2*w, 2*w)

    // stroke(128)
    // ellipse(x, y, 2*this.preachingRadius, 2*this.preachingRadius)
  }

  getLikelihoodRatio(x, y, m) {
    let dist = Utils.distance(x, y, this.x, this.y)
    if (dist < this.preachingRadius) {
      let ratio = dist / (this.preachingRadius*2)
      if (m) {
        return 1/ratio
      } else {
        return ratio
      }
    } else {
      return 1
    }
  }
}

class Person {
  constructor(x, y, size, morality) {
    this.x = x
    this.y = y
    this.size = size
    this.morality = morality
  }

  draw() {
    let x = this.x
    let y = this.y
    let w = this.size

    if (this.morality) {
      fill('#a4c2f4')
      fill(164, 194, 244, 255)
      fill(240)
    } else {
      fill('#ea9999')
      fill(234, 153, 153, 255)
      fill(15)
    }
    ellipse(x, y, 2*w, 2*w)

    noFill()
    stroke(200)
    ellipse(x, y, 2*w, 2*w)
  }

}

const PERSON_RADIUS = 6
const POPULATION = 400
const INITIAL_SAMPLING_SIZE = 100

class MySketch {
	constructor(xMin, yMin, xMax, yMax) {
	  this.bounds = [xMin, yMin, xMax, yMax]

		this.shapes = [];
		this.tick = 0;

		this.preacher = new Preacher(400, 250, PERSON_RADIUS, 100)
    this.shapes.push(this.preacher)

    for (let i = 0; i < POPULATION; i++) {
      let samples = []
      let sampleLikelihoods = []
      let totalLikelihood = 0
      for (let j = 0; j < INITIAL_SAMPLING_SIZE || totalLikelihood < 0.01; j++) {
        let x = Utils.randomBetween(this.bounds[0] + PERSON_RADIUS + 1, this.bounds[2] - PERSON_RADIUS)
        let y = Utils.randomBetween(this.bounds[1] + PERSON_RADIUS + 1, this.bounds[3] - PERSON_RADIUS)
        let m = Utils.randomBetween(0, 2) === 0

        let l = this.getLikelihood(x, y, m, this.shapes)
        if (l > 0) {
          samples.push([x, y, m])
          sampleLikelihoods.push(l)
          totalLikelihood += l
        }
      }

      let selection = Utils.randomBetween(0, totalLikelihood)
      let cumulativeLikelihood = 0
      let selectedIndex = -1
      for (let j = 0; j < INITIAL_SAMPLING_SIZE; j++) {
        cumulativeLikelihood += sampleLikelihoods[j]

        if (selection <= cumulativeLikelihood) {
          selectedIndex = j
          break
        }
      }

      let x = samples[selectedIndex][0]
      let y = samples[selectedIndex][1]
      let m = samples[selectedIndex][2]

      this.shapes.push(new Person(x, y, PERSON_RADIUS, m))
    }

    noLoop()
	}

	getLikelihood(x, y, m, otherShapes) {
	  for (let i = 0; i < otherShapes.length; i++) {
	    let shape = otherShapes[i]
	    if (Utils.distance(x, y, shape.x, shape.y) < 2 * PERSON_RADIUS + 2) {
	      // collision
	      return 0
      }
    }

	  // return x/windowWidth
    return 1.0 * this.preacher.getLikelihoodRatio(x, y, m)
  }

	draw() {
		noStroke();

		let gray = (Math.sin(this.tick / 500) + 1) * 256/2;
		background(255);

		stroke(0)
    rect(this.bounds[0], this.bounds[1], this.bounds[2]-this.bounds[0], this.bounds[3]-this.bounds[1])
    noStroke()

		for (let i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
		}

		this.tick++;



		// let NEW_SHAPE_TIME = 100;
		// let DELETE_SHAPE_TIME = 5000;
		// let NUM_SHAPES = 7;
		// if (this.tick % NEW_SHAPE_TIME === 1 && this.shapes.length < NUM_SHAPES) {
		// 	let numVertices = Utils.randomBetween(1, 8) * 3; 	// each bezier takes 3 points
		// 	this.shapes.push(new Blob(Utils.randomBetween(0, windowWidth), Utils.randomBetween(0, windowHeight), numVertices));
		// } else if (this.tick % DELETE_SHAPE_TIME === 0) {
		// 	this.shapes = this.shapes.slice(1, this.shapes.length);
		// }
	}

}


///////////
// sigh, p5.js puts everything in global namespace. 
// so we defer to our class above for drawing
///////////
let sketch;
function setup() {
	createCanvas(windowWidth, windowHeight);
	sketch = new MySketch(0, 0, 600, 400);
}
function draw() {
	sketch.draw();
  // ellipse(50, 50, 80, 80);
}