const FIRST_LINE_TIME  = 20;   // أول "I let the world burn"
const SECOND_LINE_TIME = 23;   // لحظة الاحتراق
const REDIRECT_AFTER   = 2;    // ثوانى بعد الانفجار قبل الانتقال

window.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('introOverlay');
  const audio     = document.getElementById('introAudio');
  const lyric     = document.getElementById('lyricText');
  const fire      = document.getElementById('fireOverlay');
  const startBtn  = document.getElementById('startBtn');

  // عند الضغط على زر "بــدأ"
  startBtn.addEventListener('click', () => {
    startBtn.remove();
    audio.play();
  });

  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;

    if (t >= FIRST_LINE_TIME && t < FIRST_LINE_TIME + 1) {
      lyric.classList.add('shown');
    }

    if (t >= SECOND_LINE_TIME && !overlay.dataset.burning) {
      overlay.dataset.burning = 'true';
      lyric.classList.remove('shown');
      startBurnEffect();
    }
  });

  function startBurnEffect () {
    const fireVideo = document.getElementById('fireVideo');
    if (fireVideo) fireVideo.remove();

    const fireImage = document.createElement('img');
    fireImage.src = 'https://media.tenor.com/2cTOgkfVB0UAAAAC/fire.gif';
    fireImage.style.position = 'absolute';
    fireImage.style.top = 0;
    fireImage.style.left = 0;
    fireImage.style.width = '100%';
    fireImage.style.height = '100%';
    fireImage.style.objectFit = 'cover';
    fireImage.style.zIndex = '-1';
    document.getElementById('fireOverlay').appendChild(fireImage);

    html2canvas(document.body).then(snap => {
      [...document.body.children].forEach(el => {
        if (el.id !== 'introOverlay') el.style.visibility = 'hidden';
      });

      const burnCanvas = document.createElement('canvas');
      burnCanvas.id = 'burnCanvas';
      burnCanvas.width  = snap.width;
      burnCanvas.height = snap.height;
      overlay.appendChild(burnCanvas);
      const ctx = burnCanvas.getContext('2d');

      const TILE = 32, pieces = [];
      for (let y = 0; y < snap.height; y += TILE) {
        for (let x = 0; x < snap.width; x += TILE) {
          const piece = {
            x, y,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.2) * 6,
            rot: 0,
            dr: (Math.random() - 0.5) * 0.2
          };
          piece.img = document.createElement('canvas');
          piece.img.width = TILE;
          piece.img.height = TILE;
          piece.img.getContext('2d')
            .drawImage(snap, x, y, TILE, TILE, 0, 0, TILE, TILE);
          pieces.push(piece);
        }
      }

      fire.style.opacity = 1;

      const gravity = 0.2;
      function animate () {
        ctx.clearRect(0, 0, burnCanvas.width, burnCanvas.height);
        let stillFalling = false;

        pieces.forEach(p => {
          p.x += p.dx;
          p.y += p.dy;
          p.dy += gravity;
          p.rot += p.dr;
          if (p.y < burnCanvas.height) stillFalling = true;

          ctx.save();
          ctx.translate(p.x + TILE / 2, p.y + TILE / 2);
          ctx.rotate(p.rot);
          ctx.drawImage(p.img, -TILE / 2, -TILE / 2);
          ctx.restore();
        });

        if (stillFalling) requestAnimationFrame(animate);
      }
      animate();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, REDIRECT_AFTER * 1000);
    });
  }
});
