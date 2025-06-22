/*  ⚠️ عدّل التوقيتات حسب الريمكس الخاص بك ⚠️  */
const FIRST_LINE_TIME  = 22;  // أول "I let the world burn" بالثانية
const SECOND_LINE_TIME = 23.5;  // التكرار الذي نبدأ عنده الاحتراق
const REDIRECT_AFTER   = 2;     // ثوانى بعد الانفجار قبل الانتقال

//------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('introOverlay');
  const audio     = document.getElementById('introAudio');
  const lyric     = document.getElementById('lyricText');
  const fire      = document.getElementById('fireOverlay');

  /* نضمن التشغيل حتى لو كان المتصفح يحتاج تفاعل */
  const start = () => { audio.play(); document.removeEventListener('click', start); };
  document.addEventListener('click', start);       // ضغطة واحدة تكفى
  start();                                         // جرّب فى المتصفحات التى تسمح autoplay

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

    /* نلتقط صورة كاملة للموقع قبل أن نختفى */
    html2canvas(document.body).then(snap => {

      /* نخفي كل شيء ما عدا الـ Overlay */
      [...document.body.children].forEach(el=>{
        if(el.id !== 'introOverlay'){ el.style.visibility='hidden'; }
      });

      /* نضيف Canvas أعلى الصفحة */
      const burnCanvas = document.createElement('canvas');
      burnCanvas.id = 'burnCanvas';
      burnCanvas.width  = snap.width;
      burnCanvas.height = snap.height;
      overlay.appendChild(burnCanvas);
      const ctx = burnCanvas.getContext('2d');

      // نقطع الصورة مربعات 32×32 بكسل
      const TILE = 32, pieces = [];
      for (let y=0; y<snap.height; y+=TILE) {
        for (let x=0; x<snap.width; x+=TILE) {
          const piece = {
            x: x, y: y,
            dx: (Math.random() - .5) * 6,   // سرعة أفقية
            dy: (Math.random() - .2) * 6,   // سرعة رأسية
            rot: 0,
            dr: (Math.random()-.5)*0.2      // سرعة دوران
          };
          // نحفظ صورة القطعة ذاتها لسرعة الرسم
          piece.img = document.createElement('canvas');
          piece.img.width = TILE; piece.img.height = TILE;
          piece.img.getContext('2d')
               .drawImage(snap, x, y, TILE, TILE, 0, 0, TILE, TILE);
          pieces.push(piece);
        }
      }

      // نشغّل طبقة النار
      fire.style.opacity = 1;

      /* أنيميشن سقوط القطع */
      const gravity = 0.2;
      function animate () {
        ctx.clearRect(0,0,burnCanvas.width,burnCanvas.height);
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

      /* بعد مدة نحذف الـ Overlay ونوجّه */
      setTimeout(()=>{ window.location.href = 'index.html'; }, REDIRECT_AFTER*1000);
    });
  }
});
