let ballX, ballY;
let targetBallX, targetBallY
let ballSize = 180;
let lastUpdateTime = 0;
const updateInterval = 500; // Update every 0.05 second
let xMove = 0
let yMove = 0
let accel = 0.003
let angle=0;
let fishImage;
let fishes = [];
let fishScale = 0.8; // Scale factor for resizing the fish
let fleeing = false; // Fleeing state
let fleeingTimer = 0; // Timer for fleeing duration
const fleeDuration = 5000; // 5 seconds in milliseconds
const normalSpeed = 5; // Normal speed
const fleeingSpeed = 50; // Speed during fleeing
let echo = false; // Fleeing state
let echoTimer = 0; // Timer for fleeing duration
const echoDuration = 2000; // 5 seconds in milliseconds
const friction = 0.95;
const resiliency = -0.01;
let mousePower = 0.06;
const blockSize = 8;
let main = [];
let rows = [];
let columns = [];
let flower
let leaves
let bgMusic, BG
let sh1,sh2,sh3,sh4,sh5,sl1,sl2,sl3,sl4,sl5,fh1,fh2,fh3,fh4,fh5,fl1,fl2,fl3,fl4,fl5
let shTracks=[]
let fhTracks=[]
let slTracks=[]
let flTracks=[]
let currentMotionType = "idle";
let previousMotionType = "idle";
let lastFetchTime = 0;
let lastShortTime = 0;
let lastLongTime = 0;
const shortInterval = 50; // time in milliseconds
const longInterval = 1000; // time in milliseconds
class Fish {
  constructor(image, x, y, scale) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.image = image;
    this.scale = scale;
    this.scaledWidth = image.width * scale;
    this.scaledHeight = image.height * scale;
  }
  move(speed) {
    // Update velocity based on Perlin noise
    this.vel.x = map(noise(this.noiseOffsetX), 0, 1, -speed, speed);
    this.vel.y = map(noise(this.noiseOffsetY), 0, 1, -speed, speed);
    // Update position
    this.pos.add(this.vel);
    // Check boundaries and wrap around if fish goes out of canvas
    if (this.pos.x < -this.scaledWidth) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = -this.scaledWidth;
    }
    if (this.pos.y < -this.scaledHeight) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = -this.scaledHeight;
    }
    // Update noise offsets for next move
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
  }
  display() {
    push(); // Start a new drawing state
    translate(this.pos.x, this.pos.y); // Move to the position of the fish
    rotate(this.vel.heading()); // Rotate to the direction of the velocity
    imageMode(CENTER); // Draw the image from its center
    image(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
    pop(); // Restore original state
  }
}
function preload() {
  flower = loadImage('Lotus_final.png');
  leaves = loadImage('Greenback4.png');
  fishImage = loadImage("Fish_final.png")
  // m1 = loadSound('1.MP3');
  // m10 = loadSound('10.MP3');
  // m11 = loadSound('11.MP3');
  // m2 = loadSound('2.MP3');
  // m3 = loadSound('3.MP3');
  // m4 = loadSound('4.MP3');
  // m5 = loadSound('5.MP3');
  // m6 = loadSound('6.MP3');
  // m7 = loadSound('7.MP3');
  // m8 = loadSound('8.MP3');
  // m9 = loadSound('9.MP3');
  sl1=loadSound('sounds/sl1.MP3');sl2=loadSound('sounds/sl2.MP3');sl3=loadSound('sounds/sl3.MP3');sl4=loadSound('sounds/sl4.MP3');sl5=loadSound('sounds/sl5.MP3');
  sh1=loadSound('sounds/sh1.MP3');sh2=loadSound('sounds/sh2.MP3');sh3=loadSound('sounds/sh3.MP3');sh4=loadSound('sounds/sh4.MP3');sh5=loadSound('sounds/sh5.MP3');
  fl1=loadSound('sounds/fl1.MP3');fl2=loadSound('sounds/fl2.MP3');fl3=loadSound('sounds/fl3.MP3');fl4=loadSound('sounds/fl4.MP3');fl5=loadSound('sounds/fl5.MP3');
  fh1=loadSound('sounds/fh1.MP3');fh2=loadSound('sounds/fh2.MP3');fh3=loadSound('sounds/fh3.MP3');fh4=loadSound('sounds/fh4.MP3');fh5=loadSound('sounds/fh5.MP3');
  BG = loadSound('BG.MP3')
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    noCursor();
    [main, columns, rows] = makeGrid();
    ballX = width / 2;
    ballY = height / 2;
    targetBallX = ballX;
    targetBallY = ballY;
    shTracks.push(sh1,sh2,sh3,sh4,sh5)
    slTracks.push(sl1,sl2,sl3,sl4,sl5)
    fhTracks.push(fh1,fh2,fh3,fh4,fh5)
    flTracks.push(fl1,fl2,fl3,fl4,fl5)
    bgMusic=sh1
    BG.play()
    BG.loop()
      // Assume fishImage is already loaded with loadImage()
  for (let i = 0; i < 10; i++) {
    fishes.push(new Fish(fishImage, random(width), random(height), fishScale));
  }
}
function keyPressed() {
      // "w" for wave
    if (key === 'W' || key === 'w'){
      echo = true; // Set fleeing state to true
      echoTimer = 0; // Reset fleeing timer
    }
    //"c" for circle
    if(key === 'C' || key === 'c'){
      fleeing = true; // Set fleeing state to true
      fleeingTimer = 0; // Reset fleeing timer
    }
}
function draw() {
    //ballSize+=0.05
    //mousePower-=0.0001
  image(leaves, 0,0, windowWidth, windowHeight)
  background('rgba(0,0,0, 0.25)');
    // Check if fleeing state is active
  if (fleeing) {
    fleeingTimer += deltaTime; // Update fleeing timer
    if (fleeingTimer >= fleeDuration) {
      fleeing = false; // End fleeing after 5 seconds
    }
  }
  if (echo) {
    delay = new p5.Delay();
    delay.process(bgMusic, 0.12, .7, 2300);
    echoTimer += deltaTime; // Update fleeing timer
    if (echoTimer >= echoDuration) {
      echo = false; // End fleeing after 5 seconds
    }
  }
      // Fetch new data at regular intervals
      if (millis() - lastShortTime > shortInterval) {
        fetchData();
        lastShortTime = millis();
    }
    // if (millis() - lastLongTime > longInterval) {
    //     fetchMotionType();
    //     lastLongTime = millis();
    // }
  for (let fish of fishes) {
    if (fleeing) {
      fish.move(fleeingSpeed); // Use fleeing speed
    } else {
      fish.move(normalSpeed); // Use normal speed
    }
    fish.display();
  }
    // Instead of fetching data, directly update based on mouse position
    // updateTargetWithMouse();
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
        stroke(173,216,255,120);
        strokeWeight(1.5);
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
      if (!bgMusic.isPlaying() && significantMovement()) {
        let i= int(random(0, 5))
          if(targetBallX>=ballX && targetBallY>=ballY){
            bgMusic = flTracks[i]
          }
          else if (targetBallX>=ballX && targetBallY<ballY){
            bgMusic = fhTracks[i]
          }
          else if (targetBallX<ballX && targetBallY>=ballY){
            bgMusic = slTracks[i]
          }
          else{
            bgMusic = shTracks[i]
          }
          bgMusic.play()
        }
      }
// function updateTargetWithMouse() {
//     if (mouseIsPressed) {
//         // Map mouse position to target positions
//         targetBallX = mouseX;
//         targetBallY = mouseY;
//         // You could add constraints here if you want to limit the movement within a certain area
//         targetBallX = constrain(targetBallX, ballSize / 2, width - ballSize / 2);
//         targetBallY = constrain(targetBallY, ballSize / 2, height - ballSize / 2);
//     }
// }
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
  //console.log(movement)
  let threshold = 40; // Adjust this threshold based on your requirements
  return movement > threshold;
}
function fetchData() {
  const apiUrl = 'https://api.particle.io/v1/devices/kp/xyzData?access_token=8a22972b586d4e96f4d8678cf941cedd6c156d73';
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
      targetBallX += parseFloat(matches[1]) * -0.05;
      targetBallY += parseFloat(matches[2]) * 0.05;
// Constrain to prevent moving off canvas
targetBallX = constrain(targetBallX, ballSize / 2, width - ballSize / 2);
targetBallY = constrain(targetBallY, ballSize / 2, height - ballSize / 2);
      }
  }, function(error) {
      //console.error(error);
  });
}
function fetchMotionType() {
  const motionTypeUrl = 'https://api.particle.io/v1/devices/lil_rover/motionType?access_token=13e1fd8c59f8c39ea79f5d83c4d6b17b9243e5c4';
  httpDo(motionTypeUrl, {
      method: 'GET'
  }, function(response) {
      const jsonResponse = JSON.parse(response);
      currentMotionType = jsonResponse.result;
  }, function(error) {
      //console.error(error);
  });
}