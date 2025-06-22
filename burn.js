/*  ⚠️ عدّل التوقيتات حسب الريمكس الخاص بك ⚠️  */
const FIRST_LINE_TIME  = 22;    // أول "I let the world burn"
const SECOND_LINE_TIME = 23.5;  // التكرار الذي نبدأ عنده الاحتراق
const REDIRECT_AFTER   = 2;     // ثوانى بعد الانفجار قبل الانتقال

//------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('introOverlay');
  const audio     = document.getElementById('introAudio');
  const lyric     = document.getElementById('lyricText');
  const fire      = document.getElementById('fireOverlay');
  const startBtn  = document.getElementById('startBtn');

  /* عند الضغط على زر "بــدأ" */
  startBtn.addEventListener('click', () => {
    startBtn.remove();      // نخفي الزر
    audio.play();           // نشغّل الصوت
  });

  /* كل فريم نراقب التوقيت */
  audio.addEventListener('timeupdate', () => {
    const t = audio.currentTime;

    /* إظهار النص بخفّة */
    if (t >= FIRST_LINE_TIME && t < FIRST_LINE_TIME + 1) {
      lyric.style.opacity = 1;
    }

    /* تحضير الانفجار */
    if (t >= SECOND_LINE_TIME && !overlay.dataset.burning) {
      overlay.dataset.burning = 'true';
      lyric.style.opacity = 0;
      startBurnEffect();
    }
  });

  /* التأثير الرئيسى */
  function startBurnEffect () {
    html2canvas(document.body).then(snap => {

      // إخفاء كل شيء ما عدا الـ Overlay
      [...document.body.children].forEach(el => {
        if (el.id !== 'introOverlay') el.style.visibility = 'hidden';
      });

      // نضيف Canvas أعلى الصفحة
      const burnCanvas = document.createElement('canvas');
      burnCanvas.id = 'burnCanvas';
      burnCanvas.width  = snap.width;
      burnCanvas.height = snap.height;
      overlay.appendChild(burnCanvas);
      const ctx = burnCanvas.getContext('2d');

      // نقطع الصورة إلى مربعات 32×32
      const TILE = 32, pieces = [];
      for (let y = 0; y < snap.height; y += TILE) {
        for (let x = 0; x < snap.width; x += TILE) {
          const piece = {
            x: x, y: y,
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

      // تشغيل طبقة النار
      fire.style.opacity = 1;

      // أنيميشن سقوط القطع
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
          ctx.translate(p.x + TILE/2, p.y + TILE/2);
          ctx.rotate(p.rot);
          ctx.drawImage(p.img, -TILE/2, -TILE/2);
          ctx.restore();
        });

        if (stillFalling) requestAnimationFrame(animate);
      }
      animate();

      // بعد مدة قصيرة ننتقل للصفحة التالية
      setTimeout(() => {
        window.location.href = 'index.html';
      }, REDIRECT_AFTER * 1000);
    });
  }
});
