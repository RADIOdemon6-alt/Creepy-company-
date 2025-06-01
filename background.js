const canvas = document.getElementById("bloodCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bloodPuddles = [];

function createBlood() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5; // تنزل من منتصف الشاشة
  const radius = Math.random() * 10 + 5;
  const spreadSpeed = Math.random() * 0.3 + 0.05;

  bloodPuddles.push({ x, y, radius, spreadSpeed, alpha: 1 });
}

function drawBlood(puddle) {
  const gradient = ctx.createRadialGradient(
    puddle.x,
    puddle.y,
    0,
    puddle.x,
    puddle.y,
    puddle.radius
  );
  gradient.addColorStop(0, `rgba(139, 0, 0, ${puddle.alpha})`);
  gradient.addColorStop(1, `rgba(80, 0, 0, 0)`);

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(puddle.x, puddle.y, puddle.radius, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < bloodPuddles.length; i++) {
    const p = bloodPuddles[i];
    drawBlood(p);

    // توسّع تدريجي
    p.radius += p.spreadSpeed;
    p.alpha -= 0.0008;

    if (p.alpha <= 0.01) {
      bloodPuddles.splice(i, 1);
      i--;
    }
  }

  if (Math.random() < 0.4) {
    createBlood();
  }

  requestAnimationFrame(update);
}

update();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
