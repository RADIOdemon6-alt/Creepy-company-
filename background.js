const canvas = document.getElementById("bloodCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];
let pool = []; // تجمع دم في الأسفل

function createDrop() {
  const drop = {
    x: Math.random() * canvas.width,
    y: 0,
    width: 2 + Math.random(),
    height: 18 + Math.random() * 8,
    speed: 4,
    opacity: 0.9,
    pooled: false
  };
  drops.push(drop);
}

function drawDrop(drop) {
  ctx.beginPath();
  const grad = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.height);
  grad.addColorStop(0, `rgba(100,0,0,${drop.opacity})`);
  grad.addColorStop(1, `rgba(255,0,0,${drop.opacity})`);
  ctx.fillStyle = grad;
  ctx.roundRect(drop.x, drop.y, drop.width, drop.height, drop.width / 2);
  ctx.fill();
}

function drawPool() {
  for (let i = 0; i < pool.length; i++) {
    const blood = pool[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(100, 0, 0, ${blood.opacity})`;
    ctx.ellipse(blood.x, blood.y, blood.size, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    if (blood.grow < 20) {
      blood.size += 0.1; // يزحف بشكل خفيف
      blood.y -= 0.05;
      blood.grow += 0.1;
    }
  }
}

function updateDrops() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    drop.y += drop.speed;
    drawDrop(drop);

    if (drop.y > canvas.height - drop.height - 5 && !drop.pooled) {
      pool.push({
        x: drop.x,
        y: canvas.height - 2,
        size: 2 + Math.random() * 3,
        opacity: 0.9,
        grow: 0
      });
      drop.pooled = true;
      drops.splice(i, 1);
      i--;
    }
  }

  drawPool();
}

function animate() {
  createDrop();
  updateDrops();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
