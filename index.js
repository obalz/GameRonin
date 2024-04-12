const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false; // Initialize isAttacking to false
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height >= canvas.height) {
      this.position.y = canvas.height - this.height;
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    // Update attack box position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.draw();
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
});

const keys = {
  a: false,
  d: false,
  w: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

let timer = 5;
function decreaseTimer() {
  setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (player.health === enemy.health) {
    document.querySelector("#displayText"), (innerHTML = "Tie");
    document.querySelector("#displayText").style.display = "flex";
  }
}

decreaseTimer();

function animate() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false; // Reset isAttacking after collision detection
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false; // Reset isAttacking after collision detection
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // player movement
  if (keys.a) {
    player.velocity.x = -5;
  } else if (keys.d) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }

  // Enemy movement
  if (keys.ArrowLeft) {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight) {
    enemy.velocity.x = 5;
  } else {
    enemy.velocity.x = 0;
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      keys.a = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d = true;
      player.lastKey = "d";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
    case "ArrowLeft":
      keys.ArrowLeft = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.ArrowRight = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.isAttacking = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a = false;
      break;
    case "d":
      keys.d = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft = false;
      break;
    case "ArrowRight":
      keys.ArrowRight = false;
      break;
  }
});
