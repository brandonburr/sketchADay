
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


class Triangle {
	constructor(points, rgba) {
		this.points = points;
		this.rgba = rgba;
	}

	draw() {
		// draw rect
		fill(this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]);
	  triangle(this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1]);
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
	}

	shuffle(a) {
  	for (let i = a.length; i; i--) {
    	let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
	}

	drawWindmills() {
		let seed = (frameCount+20) / 50;
		translate(windowWidth/2, windowHeight/2);
		rotate(seed / 10);
		scale((Math.sin(seed) + 1) / 2);
		rotate(seed);
		this.windmill(windowWidth/2, windowHeight/3, seed*2);
		scale(20.0)
		rotate(180)
		translate(windowWidth/4, -windowHeight/7);
		this.windmill(2*windowWidth/3, windowHeight/5, seed*3);
		scale(20.0)
		translate(-3*windowWidth/4, -windowHeight/7);
		rotate(70)
		this.windmill(2*windowWidth/3, windowHeight/5, seed*4);
	}

	windmill(dx, dy, seed) {
		let x = Math.sin(seed) * windowWidth/6 + windowWidth/6;
		let y = Math.sin(seed) * windowHeight/6 + windowHeight/6;
		let x2 = Math.atan2(x, y) / Math.PI * windowWidth/6 + windowWidth/6;
		let y2 = Math.hypot(x, y);
		let x3 = 500;
		let y3 = 500;

		let r = (seed/.5 % 255);
		let g = ((255 - seed*seed) % 255);
		let b = ((seed*.5*seed) % 255);
		let a = 255 - 255/seed;

		for(let i = 1; i < 6; i++) {
			translate(dx, dy);
			scale(.5)
			rotate(Math.atan(x*i, y2*i))
			let t = new Triangle([[x*i,y*i],[x2*(i+1),y2*(i-1)],[x3*i-x,y3*i-y]], [r*i%255,(g*i) % 255,b*i % 255,a%255]);
			t.draw();
		}
	}

	draw() {
		noStroke();
		let gray = (Math.cos(this.tick / 500) + 1) * 256/2;
		// background(255);
		background(255, 255, 2, .2);
		this.drawWindmills();
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
