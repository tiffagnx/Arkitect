/* TEC — ARKITECT mascot. Shared idle-animated sprite, perched in every room.
   Sheet: /static/tec-sprites.png — 6 cols x 2 rows = 12 frames (already transparent).
   Each frame is alpha-bbox cropped + recentered BOTTOM-CENTER so his feet stay
   planted and he never jitters as the idle cycles. Self-injecting, like the nav. */
(function () {
  if (window.__tecMascot || document.querySelector(".tec-mascot")) return;
  window.__tecMascot = true;

  const COLS = 6, ROWS = 2, FRAMES = COLS * ROWS;
  const FPS = 6;       // idle cadence
  const VIEW = 72;     // rendered px

  const css = `
  .tec-mascot{position:fixed;left:16px;bottom:12px;z-index:9998;width:${VIEW}px;height:${VIEW}px;
    pointer-events:none;filter:drop-shadow(0 6px 9px rgba(0,0,0,.5));
    opacity:0;transform:translateY(6px);transition:opacity .45s ease,transform .45s ease;}
  .tec-mascot.in{opacity:1;transform:translateY(0);}
  .tec-mascot canvas{width:100%;height:100%;display:block;}
  @media (max-width:680px){ .tec-mascot{width:54px;height:54px;left:10px;bottom:8px;} }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const wrap = document.createElement("div"); wrap.className = "tec-mascot";
  const cv = document.createElement("canvas"); cv.width = VIEW; cv.height = VIEW;
  wrap.appendChild(cv);
  const ctx = cv.getContext("2d");

  const img = new Image();
  img.onload = () => {
    const cw = Math.floor(img.width / COLS), ch = Math.floor(img.height / ROWS);
    const tmp = document.createElement("canvas"); tmp.width = cw; tmp.height = ch;
    const tctx = tmp.getContext("2d", { willReadFrequently: true });
    const frames = [];
    for (let i = 0; i < FRAMES; i++) {
      const sx = (i % COLS) * cw, sy = Math.floor(i / COLS) * ch;
      tctx.clearRect(0, 0, cw, ch);
      tctx.drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch);
      let data = null;
      try { data = tctx.getImageData(0, 0, cw, ch).data; } catch (e) { data = null; }
      let minX = cw, minY = ch, maxX = 0, maxY = 0, found = false;
      if (data) {
        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            if (data[(y * cw + x) * 4 + 3] > 16) {
              found = true;
              if (x < minX) minX = x; if (x > maxX) maxX = x;
              if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
          }
        }
      }
      if (!found) { minX = 0; minY = 0; maxX = cw - 1; maxY = ch - 1; }
      frames.push({ sx: sx + minX, sy: sy + minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    }
    // one shared scale so every pose sits at the same size (tallest fills ~94%)
    let maxH = 1; for (const f of frames) if (f.h > maxH) maxH = f.h;
    const scale = (VIEW * 0.94) / maxH;

    let cur = 0, last = 0;
    function draw(ts) {
      if (!last) last = ts;
      if (ts - last >= 1000 / FPS) { cur = (cur + 1) % FRAMES; last = ts; }
      const f = frames[cur];
      const dw = f.w * scale, dh = f.h * scale;
      ctx.clearRect(0, 0, VIEW, VIEW);
      ctx.drawImage(img, f.sx, f.sy, f.w, f.h, (VIEW - dw) / 2, VIEW - dh, dw, dh); // center x, plant feet
      requestAnimationFrame(draw);
    }
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("in"));
    requestAnimationFrame(draw);
  };
  img.onerror = () => {};   // sheet missing -> no mascot, no error
  img.src = "/static/tec-sprites.png";
})();
