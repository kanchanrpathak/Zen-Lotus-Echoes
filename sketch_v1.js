let ballX, ballY;
let targetBallX, targetBallY
let ballSize = 130;
let lastUpdateTime = 0;
const updateInterval = 500; // Update every 0.05 second
let xMove = 0
let yMove = 0
let accel = 0.003

const friction = 0.98;
const resiliency = -0.01;
let mousePower = 0.06;
const blockSize = 6;
let main = [];
let rows = [];
let columns = [];
let flower
let leaves
let angle = 0;

let bgMusic, BG
let m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11
let moveMusicTracks=[]

function preload() {
  flower = loadImage('lotus-generated.png');
  leaves = loadImage('lotus-leaves.png');
  m1 = loadSound('1.MP3');
  m10 = loadSound('10.MP3');
  m11 = loadSound('11.MP3');
  m2 = loadSound('2.MP3');
  m3 = loadSound('3.MP3');
  m4 = loadSound('4.MP3');
  m5 = loadSound('5.MP3');
  m6 = loadSound('6.MP3');
  m7 = loadSound('7.MP3');
  m8 = loadSound('8.MP3');
  m9 = loadSound('9.MP3');
  BG = loadSound('BG.MP3')
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    [main, columns, rows] = makeGrid();
    ballX = width / 2;
    ballY = height / 2;
    targetBallX = ballX;
    targetBallY = ballY;
    moveMusicTracks.push(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11)
    bgMusic=m1
    BG.play()
    BG.loop()
}

function draw() {
    //ballSize+=0.05
    //mousePower-=0.0001
  image(leaves, 0,0, windowWidth, windowHeight)
    background('rgba(0,0,0, 0.25)');

    // Fetch new data at regular intervals
    if (millis() - lastUpdateTime > updateInterval) {
        fetchData();
        lastUpdateTime = millis();
    }
  
    // xMove+=accel
    // yMove+=accel

//     ballX+=xMove
//     ballY+=yMove

//     // Keep the ball within canvas bounds
//               ballX = constrain(ballX, ballSize / 2, width - ballSize / 2);
//               ballY = constrain(ballY, ballSize / 2, height - ballSize / 2);
  
  ballX = lerp(ballX, targetBallX, 0.03); // 0.1 is the lerp amount, adjust as needed
  ballY = lerp(ballY, targetBallY, 0.03)
  
    main.forEach((elem) => {
      elem.update();
    });

    noFill();
    stroke(200);
    strokeWeight(1);
    rows.forEach(arr=>{
      beginShape();
      arr.forEach(elem=>{curveVertex(elem.pos.x, elem.pos.y)})
      endShape();    
    })

    columns.forEach(arr=>{
      beginShape();
      arr.forEach(elem=>{curveVertex(elem.pos.x, elem.pos.y)})
      endShape();
    })
  
  burst()
  
  // Draw the ball
    fill(255)
    //ellipse(ballX, ballY, ballSize, ballSize);
    
    // Increment the angle for rotation
  angle += 0.01;

  // Save current state of the canvas
  push();

  // Translate to the desired image center
  translate(ballX, ballY);

  // Rotate around this new origin
  rotate(angle);

  // Draw the image centered at the origin
  image(flower, -ballSize/2, -ballSize/2, ballSize, ballSize);

  // Restore the original state
  pop();
  
    if (!bgMusic.isPlaying()) {
      if (significantMovement()) {
        let i= int(random(0, 11))
        bgMusic = moveMusicTracks[i]
        bgMusic.play();
      }
    } 

}

function fetchData() {
    const apiUrl = 'https://api.particle.io/v1/devices/kat_cat/xyzData?access_token=d0b2c1391dec30c25940308c6c1fda58395359be';

    httpDo(apiUrl, {
        method: 'GET'
    }, function(response) {
        // Parse the JSON response
        const jsonResponse = JSON.parse(response);
        const result = jsonResponse.result;

        // Extract XYZ values from the result string
        const matches = result.match(/X: (.*), Y: (.*), Z: (.*)/);
        if (matches && matches.length === 4) {
            // Adjust these multipliers to change the sensitivity of ball movement
            // xMove = parseFloat(matches[1]) * -0.005; 
            // yMove = parseFloat(matches[2]) * 0.005

          // xMove = constrain(xMove, -3, 3);
          // yMove = constrain(yMove, -3, 3);
          
            // Update target positions based on accelerometer data
        targetBallX += parseFloat(matches[1]) * -0.03; 
        targetBallY += parseFloat(matches[2]) * 0.03;

  // Constrain to prevent moving off canvas
  targetBallX = constrain(targetBallX, ballSize / 2, width - ballSize / 2);
  targetBallY = constrain(targetBallY, ballSize / 2, height - ballSize / 2);
            
            
        }
    }, function(error) {
        console.error(error);
    });
}

function burst() {
  let mouse = createVector(ballX, ballY);
  main.forEach((elem) => {
    let diff = elem.pos.copy().sub(mouse);
    let distance = diff.mag();
    let multi = pow(2, -(distance * mousePower));
    f = diff.mult(multi);
    elem.acc.add(f);
  });
}

function makeGrid () {
  let arr = [];
  for (let i = 0; i < width; i += blockSize) {
    for (let j = 0; j < height; j += blockSize) {
      arr.push(new Point(i, j));
    }
  }

  let columns = [];
  for (let i = 0; i < width; i += blockSize) {
    const column = arr.filter((elem) => elem.supposed.x == i);
    columns.push(column);
  }

	let rows = [];
  for (let j = 0; j < height; j += blockSize) {
    const row = arr.filter((elem) => elem.supposed.y == j);
    rows.push(row);
  }
  return [arr, columns, rows];
}
  
function Point(x, y) {
  this.supposed = createVector(x, y);
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.update = () => {
    this.seek(this.supposed);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.mult(friction);
    this.acc.mult(0); //clear acc
  };

  this.seek = (target) => {
    let diff = this.pos.copy().sub(target);
    let distance = diff.mag();
    let f = diff.mult(distance).mult(resiliency);
    this.acc.add(f);
  };
}

function significantMovement() {
  // Define what you consider significant movement
  // For example, check the speed of the flower's movement
  let movement = dist(ballX, ballY, targetBallX, targetBallY);
  console.log(movement)
  let threshold = 40; // Adjust this threshold based on your requirements
  return movement > threshold;
}
