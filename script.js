var cvs = document.getElementById('canvas1');
var ctx = cvs.getContext('2d');
var back = addImage('images/background.jpg');
var chickenImg = [];
var pressedKeys = [];
var gunReload = 0;
var ship;

function getRandomInt(a,b) {
  return Math.floor(a)+Math.floor(Math.random()*(b-a)); //[A;B-1]
}

function addImage(path) {
  var img = new Image();
  img.src = path;
  return img;
}

class ImageObject {
  constructor(a,b,c,d,e) {
    this.x = a;
    this.y = b;
    this.w = c;
    this.h = d;
    this.img = e;
  }
}

var score = 0;
var chickens = [];
var lasers = [];

function isCollide(a,b) {
  var R = true;
  if (a.x+a.w < b.x) {R = false;}
  if (b.x+b.w < a.x) {R = false;}
  if (a.y+a.h < b.y) {R = false;}
  if (b.y+b.h < a.y) {R = false;}
  return R;
}

function keyDownEvent(e) {
  var key = e.key;
  if (pressedKeys.indexOf(key) == -1) {
    pressedKeys.push(key);
  }
}

function keyUpEvent(e) {
  var key = e.key;
  var index = pressedKeys.indexOf(key);
  if (index > -1) {
    pressedKeys.splice(index, 1);
  }
}

window.onload = function() {
  ship = new ImageObject(400,560,80,80,addImage('images/ship.png'));
  ship.vx = 0;
  ship.vy = 0;
  for (var i=0; i<18; i++) {
    chickenImg.push(addImage('images/chicken_'+i+'.png'));
  }
  for (var i=0; i<5; i++) {
    var ch1 = new ImageObject(getRandomInt(0,cvs.width-64),getRandomInt(0,60),64,64,getRandomInt(0,chickenImg.length));
    chickens.push(ch1);
  }
  document.addEventListener('keydown',keyDownEvent);
  document.addEventListener('keyup',keyUpEvent);
  var timeout = setInterval(main_loop,20); //1000:20 = 50 (FPS)
}

function main_loop() {
  if (getRandomInt(0,100)<15) {
    var ch1 = new ImageObject(getRandomInt(0,cvs.width-64),getRandomInt(0,60),64,64,getRandomInt(0,chickenImg.length));
    chickens.push(ch1);
  }
  //ctx.fillStyle = "white";
  //ctx.fillRect(0, 0, cvs.width, cvs.height);
  //console.log(pressedKeys);
  if (gunReload < 5) {
    gunReload++;
  }
  var D = 0.5; //ускорение корабля в пикселях на тик в квадрате
  var limit = 60;
  if (pressedKeys.indexOf('w') > -1) {
    if (ship.vy > -limit) ship.vy -= D;
  }
  if (pressedKeys.indexOf('s') > -1) {
    if (ship.vy < limit) ship.vy += D;
  }
  if (pressedKeys.indexOf('a') > -1) {
    if (ship.vx > -limit) ship.vx -= D;
  }
  if (pressedKeys.indexOf('d') > -1) {
    if (ship.vx < limit) ship.vx += D;
  }
  if ((pressedKeys.indexOf(' ') > -1) && (gunReload >= 5)) {
    var L1 = new ImageObject(ship.x+ship.w/2-3,ship.y-24,6,24,addImage('images/laser.png'));
    lasers.push(L1);
    gunReload = 0;
  }

  ctx.drawImage(back,0,0);
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i].y < -lasers[i].h) {lasers.splice(i,1);}
    else {
      lasers[i].y -= 3;
      ctx.drawImage(lasers[i].img,lasers[i].x,lasers[i].y)
      for (var j = 0; j < chickens.length; j++) {
        if (isCollide(lasers[i],chickens[j]) == true) {
          chickens.splice(j,1); lasers.splice(i,1); score = score + 25;
          break;
        }
      }
    }
  }
  // if (ship.vx > 0) {ship.x += 5; ship.vx -= 5;}
  // if (ship.vx < 0) {ship.x -= 5; ship.vx += 5;}
  // if (ship.vy > 0) {ship.y += 5; ship.vy -= 5;}
  // if (ship.vy < 0) {ship.y -= 5; ship.vy += 5;}
  ship.x += ship.vx;
  ship.y += ship.vy;

  if ((ship.x < 0) || (ship.x > cvs.width-ship.w)) {
    ship.vx = -ship.vx;
    ship.x += ship.vx;
  }
  if ((ship.y < 0) || (ship.y > cvs.height-ship.h)) {
    ship.vy = -ship.vy;
    ship.y += ship.vy;
  }

  ship.vx = ship.vx * 0.98;
  ship.vy = ship.vy * 0.98; 

  //ctx.font = "48px serif";
  //ctx.fillStyle = "black";
  //ctx.fillText(shipDX+'; '+shipDY, 50, 50);
  
  ctx.drawImage(ship.img,ship.x,ship.y);
  for (var i = 0; i < chickens.length; i++) {
    chickens[i].y += getRandomInt(0,2);
    ctx.drawImage(chickenImg[chickens[i].img],chickens[i].x,chickens[i].y)
    if (chickens[i].y > cvs.height) {chickens.splice(i,1);}
    if (getRandomInt(0,100)<5) {
      chickens[i].img = (chickens[i].img+1)%chickenImg.length;
    }
  }
  ctx.font = "48px Lato";
  ctx.fillStyle = "rgb(245,230,255)";
  ctx.fillText(score, 25, 50);
}

function clickEvent(event) {
  var x = parseInt(event.pageX - cvs.offsetLeft);
  var y = parseInt(event.pageY - cvs.offsetTop);
  console.log(x+' '+y);
}