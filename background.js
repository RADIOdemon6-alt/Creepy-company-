const canvas = document.getElementById("bloodCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];

function createDrop() {
  const drop = {
    x: Math.random() * canvas.width,
    y: 0,
    size: Math.random() * 2 + 2,
    speed: Math.random() * 5 + 2,
    opacity: Math.random() * 0.5 + 0.3
  };
  drops.push(drop);
}

function drawDrop(drop) {
  ctx.beginPath();
  ctx.fillStyle = `rgba(255, 0, 0, ${drop.opacity})`;
  ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
  ctx.fill();
}

function updateDrops() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < drops.length; i++) {
    drops[i].y += drops[i].speed;
    drawDrop(drops[i]);
    if (drops[i].y > canvas.height) {
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

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
