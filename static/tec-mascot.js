/* TEC — DeMartinville mascot. A PER-CHARACTER animated sprite perched on the send button.
   Each character has its own transparent sprite sheet (COLS frames across, 1 row, alpha-bbox
   cropped + bottom-centered so feet stay planted). Switch with window.setMascotChar("tiff"|"kit").

   ⭐ TO ANIMATE A CHARACTER: drop a transparent sprite sheet at its `sheet` path below — same
   format as Kit's (9 frames across, 1 row). That's the ONLY step. Until the sheet exists, the
   `fallback` static icon stands in automatically, so the slot is never empty. */
(function () {
  if (window.__tecMascot || document.querySelector(".tec-mascot")) return;
  window.__tecMascot = true;

  const VIEW = 72;     // rendered px
  const FPS  = 3.6;    // idle cadence — slow + dreamy
  // playback order — dwell on the eyes-shut frames (4,5,6) so they drift into the music
  const SEQ  = [0,0,0, 1,2, 3, 4,5,6, 6,5,6,5,6,6, 7,8,
                8,8,8,8,8,8,8,8,8,8, 8,8,8,8,8,8,8,8,8,8,
                8,8,8,8,8,8,8,8,8,8, 8,8,8,8,8,8,8,8,8,8,
                8,8,8,8,8,8,8,8,8,8, 8,8,8,8,8,8,8,8,8,8,
                8,8,8,8,8,8,8,8,8,8, 8,8,
                0,0];

  // ── the roster. Tiff is the default chat partner; Kit is shipped animated. ──
  const CHARS = {
    // Tiff: her real 9-frame sheet, played straight through, SLOW (fps is the speed dial — lower = slower).
    tiff: { sheet:"/static/tiff-sprites.png", cols:9, rows:1, fps:1.6,
            seq:[0,1,2,3,4,5,6,7,8], fallback:"/static/tiff.png" },
    kit:  { sheet:"/static/kit-sprites.png",  cols:9, rows:1, fps:FPS, seq:SEQ, fallback:"/static/kit.png"  },
  };

  const css = `
  .tec-mascot{position:fixed;left:16px;bottom:12px;z-index:9998;width:${VIEW}px;height:${VIEW}px;
    pointer-events:none;filter:drop-shadow(0 6px 9px rgba(0,0,0,.5));
    opacity:0;transform:translateY(6px);transition:opacity .45s ease,transform .45s ease;}
  .tec-mascot.in{opacity:1;transform:translateY(0);}
  .tec-mascot.busy{opacity:0 !important;transform:translateY(8px) !important;pointer-events:none;}
  .tec-mascot canvas{width:100%;height:100%;display:block;}
  @media (max-width:680px){ .tec-mascot{width:54px;height:54px;left:10px;bottom:8px;} }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const wrap = document.createElement("div"); wrap.className = "tec-mascot";
  const cv = document.createElement("canvas"); cv.width = VIEW; cv.height = VIEW;
  wrap.appendChild(cv);
  const ctx = cv.getContext("2d");

  // render state: animated {img,frames,scale,seq,fps} · static {staticImg} · or null (blank)
  let current = null, charId = null, si = 0, lastT = 0;

  // slice a sheet into alpha-bbox-cropped frames so each pose sits at the same size, feet planted
  function buildFrames(img, cols, rows) {
    const cw = Math.floor(img.width / cols), ch = Math.floor(img.height / rows);
    const tmp = document.createElement("canvas"); tmp.width = cw; tmp.height = ch;
    const tctx = tmp.getContext("2d", { willReadFrequently: true });
    const frames = [];
    for (let i = 0; i < cols * rows; i++) {
      const sx = (i % cols) * cw, sy = Math.floor(i / cols) * ch;
      tctx.clearRect(0, 0, cw, ch);
      tctx.drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch);
      let data = null;
      try { data = tctx.getImageData(0, 0, cw, ch).data; } catch (e) { data = null; }
      let minX = cw, minY = ch, maxX = 0, maxY = 0, found = false;
      if (data) {
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          if (data[(y * cw + x) * 4 + 3] > 16) {
            found = true;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }
      if (!found) { minX = 0; minY = 0; maxX = cw - 1; maxY = ch - 1; }
      frames.push({ sx: sx + minX, sy: sy + minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    }
    let maxH = 1; for (const f of frames) if (f.h > maxH) maxH = f.h;
    return { frames, scale: (VIEW * 0.94) / maxH };
  }

  // load a character's sheet; if it's missing, drop to its static icon; if that's missing, blank
  function loadChar(id) {
    if (!CHARS[id] || id === charId) return;
    charId = id;
    const cfg = CHARS[id];
    const img = new Image();
    img.onload = () => {
      if (charId !== id) return;                          // a newer switch already won
      const { frames, scale } = buildFrames(img, cfg.cols, cfg.rows);
      current = { img, frames, scale, seq: cfg.seq, fps: cfg.fps }; si = 0; lastT = 0;
    };
    img.onerror = () => {                                  // no animation sheet yet → static icon
      if (charId !== id) return;
      if (!cfg.fallback) { current = null; return; }
      const f = new Image();
      f.onload  = () => { if (charId === id) current = { staticImg: f }; };
      f.onerror = () => { if (charId === id) current = null; };
      f.src = cfg.fallback;
    };
    img.src = cfg.sheet;
  }

  function draw(ts) {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, VIEW, VIEW);
    if (!current) return;
    if (current.staticImg) {                              // not animated yet → draw the static icon
      const im = current.staticImg; if (!im.width) return;
      const s = (VIEW * 0.9) / Math.max(im.width, im.height);
      const dw = im.width * s, dh = im.height * s;
      ctx.drawImage(im, (VIEW - dw) / 2, VIEW - dh, dw, dh);
      return;
    }
    const c = current;
    if (!lastT) lastT = ts;
    if (ts - lastT >= 1000 / c.fps) { si = (si + 1) % c.seq.length; lastT = ts; }
    const fr = c.frames[c.seq[si]] || c.frames[0];
    const dw = fr.w * c.scale, dh = fr.h * c.scale;
    ctx.drawImage(c.img, fr.sx, fr.sy, fr.w, fr.h, (VIEW - dw) / 2, VIEW - dh, dw, dh);  // center x, plant feet
  }

  document.body.appendChild(wrap);
  // stand on the send button (paper-plane), and keep tracking it on resize
  const _send = document.querySelector("#send");
  const _row  = document.querySelector("#inputrow");
  if (_send && _row) {
    const placeTec = () => {
      const rs = _send.getBoundingClientRect(), rr = _row.getBoundingClientRect();
      wrap.style.left = (rs.left + rs.width / 2 - VIEW / 2) + "px";   // over the send button
      wrap.style.right = "auto";
      wrap.style.bottom = (window.innerHeight - rr.top + 1) + "px";   // feet ON the input-bubble's top line
    };
    placeTec();
    window.addEventListener("resize", placeTec);
  }
  requestAnimationFrame(() => wrap.classList.add("in"));
  requestAnimationFrame(draw);

  // start on whoever's active in the main chat (Tiff by default), and expose the live switch
  loadChar(window.activeBrain === "kit" ? "kit" : "tiff");
  window.setMascotChar = loadChar;
})();
