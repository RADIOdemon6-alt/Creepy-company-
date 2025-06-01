const canvas = document.getElementById("bloodCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];
let dropRate = 1;

function createDrop() {
  for (let i = 0; i < dropRate; i++) {
    const drop = {
      x: Math.random() * canvas.width,
      y: 0,
      width: 3 + Math.random() * 2,
      height: 20 + Math.random() * 30,
      speed: 4 + Math.random() * 4,
      opacity: 0.7 + Math.random() * 0.3,
      splashed: false
    };
    drops.push(drop);
  }
}

function drawDrop(drop) {
  ctx.beginPath();
  const grad = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.height);
  grad.addColorStop(0, `rgba(120,0,0,${drop.opacity})`);
  grad.addColorStop(1, `rgba(255,0,0,${drop.opacity})`);
  ctx.fillStyle = grad;
  ctx.roundRect(drop.x, drop.y, drop.width, drop.height, drop.width / 2);
  ctx.fill();
}

function drawSplash(x, y) {
  for (let i = 0; i < 5; i++) {
    const radius = Math.random() * 4 + 2;
    ctx.beginPath();
    ctx.fillStyle = `rgba(150,0,0,0.8)`;
    ctx.arc(x + Math.random() * 20 - 10, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateDrops() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    drop.y += drop.speed;

    if (drop.y + drop.height >= canvas.height && !drop.splashed) {
      drawSplash(drop.x, canvas.height);
      drop.splashed = true;
    }

    if (drop.y < canvas.height) {
      drawDrop(drop);
    } else if (drop.y > canvas.height + 50) {
      drops.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  createDrop();
  updateDrops();
  requestAnimationFrame(animate);
}

setInterval(() => {
  dropRate += 0.2; // زيادة معدل النزيف تدريجياً
}, 3000);

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
