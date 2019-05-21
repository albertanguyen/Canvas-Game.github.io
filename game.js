/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d"); //grab the context from your destination canvas
//ctx = canvas.getContext("2d");
//ctx.scale(20,20);
ctx.fillStyle = "white";
ctx.font = "500px serif"; // does not work!!!
canvas.width = 1280 + 180; // 2560
canvas.height = 720 + 180; //1440

document.body.appendChild(canvas);

//secondcanvas = document.createElement("secondcanvas");

//call its drawImage() function passing it the source canvas directly
//ctx.drawImage(secondcanvas, 0, 0);

// define all global params
var bgReady, heroReady, monsterReady, beeReady, mapReady;
var bgImage, heroImage, monsterImage, beeImage, mapImage;
var bgSound;
var startTime = Date.now();
const SECONDS_PER_ROUND = 60;
var elapsedTime = 0;
const monsterMax = 3; // number of monster that u can catch, default: 20
var total = 0;
var heroImageSize = 180;
var monsterImageSize = 952;
var beeImageSize = 75;
//var beeImages = [];
var acceleration = [1, 1, 2, 3, 5, 8, 13, 21]; // level 1,2,3,4

// function resize() {
//   // Our canvas must cover full height of screen
//   // regardless of the resolution
//   var height = window.innerHeight;

//   // So we need to calculate the proper scaled width
//   // that should work well with every resolution
//   var ratio = canvas.width / canvas.height;
//   var width = height * ratio;

//   canvas.style.width = width + "px";
//   canvas.style.height = height + "px";
// }


function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/Battlefield_bg.png";
  mapImage = new Image();
  mapImage.onload = function () {
    // show the map image
    mapReady = true;
  };
  mapImage.src = "images/Battlefield_bg-scaled.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/chibi_dinosaur-scaled.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/Cheeseburger-scaled2.png";
  beeImage = new Image();
  beeImage.onload = function () {
    // show bee images
    beeReady = true;
  };
  beeImage.src = "images/beelogo-scaled.png";
}

// function sound(src) {
//   this.sound = document.createElement("audio");
//   this.sound.src = src;
//   this.sound.setAttribute("preload", "auto");
//   this.sound.setAttribute("controls", "none");
//   this.sound.style.display = "none";
//   document.body.appendChild(this.sound);
//   this.play = function() {
//     this.sound.play();
//   };
//   this.stop = function() {
//     this.sound.pause();
//   };
// }

// function loadSound() {
//   bgSound = new sound("sound/ElvisPreley.mp3");
// //  catchSound = new sound("");
// //  gameOver = new sound("");
// //  winnerSound = new sound("");
// //  walkSound = new sound("");
// }


// function rotating(x, y, r) {
//   ctx.beginPath();
//   ctx.arc(x, y, r, 0, Math.PI * 2); // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//   ctx.fillStyle = "#0095DD";
//   ctx.fill();
//   ctx.closePath();
// }

// function flipHorizontally(img,x,y){
//     // move to x + img's width
//     ctx.translate(x+img.width,y);

//     // scaleX by -1; this "trick" flips horizontally
//     ctx.scale(-1,1);

//     // draw the img
//     // no need for x,y since we've already translated
//     ctx.drawImage(img,0,0);

//     // always clean up -- reset transformations to default
//     ctx.setTransform(1,0,0,1,0,0);
// }

// function flipVertically(img, x, y) {
//   // move to x + img's width
//   ctx.translate(x + img.width, y);

//   // scaleX by -1; this "trick" flips horizontally
//   ctx.scale(-1, 1);

//   // draw the img
//   // no need for x,y since we've already translated
//   ctx.drawImage(img, 0, 0);

//   // always clean up -- reset transformations to default
//   ctx.setTransform(1, 0, 0, 1, 0, 0);
// }



let Startbutton = function (key) {
  // press S to start
  if (key.keyCode == 83) {
    Restart();
  }
}

function reset() {
  monsterX =
    monsterImageSize * (Math.floor(Math.random() * 10) + 1) -
    monsterImageSize / 2;
  monsterY =
    monsterImageSize * (Math.floor(Math.random() * 10) + 1) -
    monsterImageSize / 2;
}

//  switch (level) {
//  }
//  switch (formattedCurrency) {
//    case "level1":
//      break;
//    case "level2":
//      break;
//    case "level3":
//      break;
//  }

// used to indentify the direction of monster, x and y are hero's coord
// function direction(x,y, acceleration) {
//     acceleration.map( element => {
//     if (Math.cos(x / y) > 0 && Math.cos(x / y) < 1) {
//       return  element = ;
//     }
//     if (Math.cos(x / y) < 0 && Math.cos(x / y) > -1) {
//       return (acceleration = -1);
//     }
//     if (Math.cos(x / y) === 0 || Math.cos(x / y) === -1) {
//       return (acceleration = 0);
//     }
//     })
// }

// Set offsets
let heroX = Math.round(canvas.width / 2);
let heroY = Math.round(canvas.height / 2);

let monsterX = monsterImageSize * (Math.floor(Math.random() * 10) + 10) - monsterImageSize / 2; 
let monsterY = monsterImageSize * (Math.floor(Math.random() * 10) + 10) - monsterImageSize / 2;

let beeX = 2 * beeImageSize;
let beeY = canvas.height - 2 * beeImageSize;


  // Boundary conditions:
const heroXMin = Math.min(canvas.width - heroImageSize, heroX);
const heroXMax = Math.max(0, heroX);

const heroYMin = Math.min(canvas.height - heroImageSize, heroY);
const heroYMax = Math.max(0, heroY);

  // monsterX = monsterImageSize * (Math.floor(Math.random() * 10) + 10) - monsterImageSize / 2;
  // monsterY = monsterImageSize * (Math.floor(Math.random() * 10) + 10) - monsterImageSize / 2;


const monsterXMin = Math.min(canvas.width - monsterImageSize, monsterX);
const monsterXMax = Math.max(0, monsterX);

const monsterYMin = Math.min(canvas.height - monsterImageSize, monsterY);
const monsterYMax = Math.max(0, monsterY);


/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
  addEventListener("keydown", Startbutton, false); 
}

let finished = false;
let timeUpdate = function() {
  eslaped = Math.floor((Date.now() - startTime) / 1000);
};

function Restart() {
  startTime = Date.now();
  total = 0;
  setupKeyboardListeners();
  clearInterval(timeUpdate);
  setInterval(timeUpdate, 1000);
  setupKeyboardListeners();
}

function Timer() {
  SECONDS_PER_ROUND--; // countown by 1 every second
  // when count reaches 0 clear the timer, hide monster and
  // hero and finish the game
  if (SECONDS_PER_ROUND <= 0) {
    // stop the timer
    startTime = Date.now()
    // set game to finished
    finished = true;
    timeUpdate = 0;
    monsterReady = false;
    heroReady = false;
  }
}


function game_over() {
  ctx.fillStyle = "red";
  ctx.font = "30px Courier New";
  ctx.fillText("Game over!", 170, 220);
  ctx.fillText(`Mini- dinosaur has eaten ${total} burger(s). Opps!`, 90, 250);
  startTime = Date.now();
  //bgSound.stop();
  //catchSound.stop();
  //walkSound.stop();
  //gameOver.play();
  heroX = 0;
  heroY = 0;
  monsterReady = false;
  heroReady = false;
}


function winner() {
  ctx.fillStyle = "white";
  ctx.font = "36px Courier New";
  ctx.fillText("You win!", 180, 220);
  ctx.font = "24px Courier New";
  ctx.fillText("Your score is: " + total, 140, 250);
  startTime = Date.now();
  //walkSound.stop();
  //bgSound.stop();
  //catchSound.stop();
  //winnerSound.play();
  heroX = 0;
  heroY = 0;
  monsterReady = false;
  heroReady = false;
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  // This is not updated accordingly
  heropos = Math.pow(Math.abs(heroX - heroY), 2);
  monsterpos = Math.pow(Math.abs(monsterX - monsterY), 2);
  distance = Math.sqrt(Math.pow(heropos, 2) + Math.pow(monsterpos, 2));

  // move faster when moving upward and forward, move slower when moving backward and downward
  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 30;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 10;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 30;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 10;
  }
  // all bees' movement: horizontally (forward, backward)
    for (let val of acceleration) {
      //setTimeout(100)
  //    beeX = beeX + val/10000 * Math.round(Math.random() * canvas.width); // from middle page
      beeX = beeX + beeImageSize/80;
  //    beeY += Math.floor(Math.sqrt(beeImageSize/2));
      //  beeX = canvas.width - beeX;
      //
    }

  // Collision conditions:
  if ((distance < monsterImageSize + heroImageSize && distance > 0) ||
    heroX <= monsterX + heroImageSize &&
      monsterX <= heroX + monsterImageSize &&
      heroY <= monsterY + heroImageSize &&
      monsterY <= heroY + monsterImageSize)
  {
    // New coordinate for the monster. old + speed * randomizedNumber
    for (let val of acceleration) {
      monsterY = monsterImageSize + val * Math.round(Math.random() * (monsterYMax - monsterYMin)) + 1;
      monsterX = monsterImageSize + val * Math.round(Math.random() * (monsterXMax - monsterXMin)) + 1;
    }
    // distance = Math.sqrt(
    //   Math.pow(Math.abs(monsterX - heroX), 2) +
    //   Math.pow(Math.abs(monsterY - heroY), 2)
    total++;
    //catchSound.play();
    reset();
  }
  if (heroX <= beeX + heroImageSize &&
      beeX <= heroX + beeImageSize &&
      heroY <= beeY + heroImageSize &&
      beeY <= heroY + beeImageSize) {
    total--;
    //catchSound.play();
    reset();
  }

  // Boundary conditions
  if (heroX < 0 || heroX > canvas.width) {
    heroX = Math.floor(heroImageSize / 2);
  }
  if (heroY < 0) {
    heroY = canvas.height - Math.floor(heroImageSize / 3);
  }
  if (heroY > canvas.height) {
    heroY = heroY / 2;
  }
  if (monsterX + monsterImageSize > canvas.width || monsterX < 0) {
    monsterX = monsterXMax;
    monsterY = monsterYMin;
  }
  if (monsterY + monsterImageSize > canvas.height || monsterY < 0) {
    monsterY = monsterYMax;
    monsterX = monsterXMin;
  }
  if ((beeX < 0 || beeX > canvas.width) && heroX === canvas.width / 2) {
    beeX = canvas.width - 2 * beeImageSize - (1 / 2) * beeX;
    beeY = canvas.height - 2 * beeImageSize - (1 / 2) * beeY;
  }
  // if ((monsterX < 0 || monsterX > canvas.width) && distance > canvas.width) {
  //   monsterX = canvas.width - monsterX + distance / 2;
  // }
  // if ((monsterY < 0 || monsterY > canvas.height) && distance > canvas.width) {
  //   monsterY = canvas.heigth - monsterY + distance / 2;
  // }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  //bgSound.play();
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (mapReady) {
    ctx.drawImage(mapImage, 0, 0); // render second canvas here!
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (beeReady) {
    ctx.drawImage(beeImage, beeX, beeY);
  }
  if (finished == true) {
    game_over();
    elapsedTime = Date.now();
  } else if (total === monsterMax) {
    elapsedTime = Date.now();
    Restart()
  }
  ctx.fillText(`Mini-dinosaur has eaten: ${total} bugger(s)`, canvas.width - monsterImageSize, 50, 500);
  ctx.fillText(`High score: `, canvas.width - monsterImageSize, 110, 500);
  ctx.font = "24px Monospace";
  ctx.textBaseline = "top";
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime} s`, canvas.width - monsterImageSize, 80, 500); 
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
//resize();
loadImages();
//loadSound();
setupKeyboardListeners();
main();