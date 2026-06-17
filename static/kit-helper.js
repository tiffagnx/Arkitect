/* KIT — the in-room build-bot helper. A draggable "Ask Kit" window with his
   animated sprite + a text box, wired to /api/kit (room-aware brain). Loads in
   every ROOM and self-skips the main chat (that's Tiff's house) + non-rooms.
   Self-contained; injected by pinkroom-nav.js, same pattern as the exit pill. */
(function () {
  if (window.__kit) return;
  const path = location.pathname.toLowerCase();
  const ROOMS = {
    studio: "DeMartin Audio Labs", build: "Blueprint Builds",
    editor: "LePrince Visual Labs", images: "Imagination Station", bit16: "Bit1Six",
  };
  let room = null;
  for (const k in ROOMS) { if (path.includes(k + ".html")) { room = k; break; } }
  if (!room) return;                 // chat / non-room → no Kit
  window.__kit = true;

  const css = `
  .kit-fab { position:fixed; right:18px; bottom:18px; z-index:9996; display:flex; align-items:center; gap:7px;
    height:42px; padding:0 15px 0 9px; border-radius:21px; cursor:pointer; border:1px solid rgba(120,182,205,.4);
    background:linear-gradient(180deg,rgba(42,46,54,.96),rgba(22,24,30,.96)); color:#CFE6EE;
    font:700 12px Oxanium,sans-serif; letter-spacing:.06em; box-shadow:0 6px 20px rgba(0,0,0,.5); transition:transform .14s,box-shadow .14s; }
  .kit-fab:hover { transform:translateY(-2px); box-shadow:0 9px 26px rgba(62,156,184,.4); border-color:rgba(120,182,205,.75); }
  .kit-fab canvas { width:28px; height:28px; display:block; }
  .kit-fab.in-bar { position:static; height:34px; border-radius:10px; padding:0 12px 0 7px; margin-left:6px; flex:none; box-shadow:none; }
  .kit-fab.in-bar canvas { width:24px; height:24px; }
  .kit-win.from-bar { bottom:auto; top:62px; }
  .kit-win { position:fixed; right:18px; bottom:70px; z-index:9997; width:340px; max-width:92vw; display:none; flex-direction:column;
    max-height:min(560px,80vh); border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,.1);
    background:linear-gradient(160deg,#21232B,#15161B 60%,#101116); box-shadow:0 22px 60px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06); }
  .kit-win.open { display:flex; animation:kitrise .16s ease-out; }
  @keyframes kitrise { from { opacity:0; transform:translateY(10px); } }
  .kit-bar { display:flex; align-items:center; gap:10px; padding:10px 12px; cursor:move; user-select:none;
    border-bottom:1px solid rgba(255,255,255,.07); background:linear-gradient(180deg,rgba(255,255,255,.05),transparent); }
  .kit-bar canvas { width:34px; height:34px; display:block; flex:none; }
  .kit-t { font:700 14px Oxanium; letter-spacing:.1em; color:#E4F1F5; line-height:1; }
  .kit-s { font:500 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(198,201,208,.5); display:block; margin-top:3px; }
  .kit-x { margin-left:auto; background:rgba(0,0,0,.28); border:none; color:#9FCFDD; width:22px; height:22px; border-radius:6px; cursor:pointer; font-size:12px; }
  .kit-x:hover { background:rgba(62,156,184,.3); color:#fff; }
  .kit-body { flex:1; overflow-y:auto; padding:12px 13px; display:flex; flex-direction:column; gap:9px; }
  .kit-msg { font:400 12.5px Inter; line-height:1.5; padding:9px 11px; border-radius:11px; max-width:88%; white-space:pre-wrap; word-wrap:break-word; }
  .kit-msg.you { align-self:flex-end; background:rgba(62,156,184,.18); color:#DCEEF4; border:1px solid rgba(62,156,184,.3); }
  .kit-msg.kit { align-self:flex-start; background:rgba(255,255,255,.04); color:#D7DCE4; border:1px solid rgba(255,255,255,.07); }
  .kit-msg.kit b { color:#9FCFDD; }
  .kit-msg.think { color:rgba(198,201,208,.6); font-style:italic; }
  .kit-foot { display:flex; gap:8px; padding:10px 11px; border-top:1px solid rgba(255,255,255,.07); }
  .kit-in { flex:1; resize:none; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.1); border-radius:10px;
    color:#E9EAED; font:500 12.5px Inter; padding:9px 11px; outline:none; max-height:90px; }
  .kit-in:focus { border-color:rgba(62,156,184,.55); }
  .kit-go { flex:none; width:40px; border:none; border-radius:10px; cursor:pointer;
    background:linear-gradient(180deg,#6FC0D8,#3E9CB8); color:#08171c; font-size:15px; }
  .kit-go:disabled { opacity:.5; cursor:default; }
  @media (max-width:680px){ .kit-win { right:8px; left:8px; width:auto; } }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ── animated Kit sprite (reuses the 12-frame sheet; idle slow, "thinking" fast) ──
  function makeSprite(view, fps) {
    const cv = document.createElement("canvas"); cv.width = view; cv.height = view;
    const ctx = cv.getContext("2d");
    const img = new Image();
    let frames = [], scale = 1, cur = 0, last = 0, speed = fps;
    const SEQ = [0,0,0,1,2,3,4,5,6,6,5,6,5,6,6,7,8,0,0];   // dwell on eyes-shut (the music) — same as the home mascot
    img.onload = () => {
      const COLS = 9, cw = Math.floor(img.width / COLS), ch = img.height;
      const tmp = document.createElement("canvas"); tmp.width = cw; tmp.height = ch;
      const tctx = tmp.getContext("2d", { willReadFrequently: true });
      for (let i = 0; i < COLS; i++) {
        const sx = i * cw; tctx.clearRect(0, 0, cw, ch); tctx.drawImage(img, sx, 0, cw, ch, 0, 0, cw, ch);
        let data = null; try { data = tctx.getImageData(0, 0, cw, ch).data; } catch (e) {}
        let minX = cw, minY = ch, maxX = 0, maxY = 0, found = false;
        if (data) for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          if (data[(y * cw + x) * 4 + 3] > 16) { found = true; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
        }
        if (!found) { minX = 0; minY = 0; maxX = cw - 1; maxY = ch - 1; }
        frames.push({ sx: sx + minX, sy: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
      }
      let maxH = 1; frames.forEach(f => { if (f.h > maxH) maxH = f.h; }); scale = (view * 0.92) / maxH;
      requestAnimationFrame(draw);
    };
    img.onerror = () => {};
    img.src = "/static/kit-sprites.png";
    function draw(ts) {
      if (!last) last = ts;
      if (ts - last >= 1000 / speed) { cur = (cur + 1) % SEQ.length; last = ts; }
      const f = frames[SEQ[cur]] || frames[0];
      if (f) { const dw = f.w * scale, dh = f.h * scale; ctx.clearRect(0, 0, view, view); ctx.drawImage(img, f.sx, f.sy, f.w, f.h, (view - dw) / 2, view - dh, dw, dh); }
      requestAnimationFrame(draw);
    }
    return { cv, setSpeed: (f) => { speed = f; } };
  }

  // ── window ──
  const winSpr = makeSprite(34, 3);
  const win = document.createElement("div"); win.className = "kit-win";
  win.innerHTML =
    `<div class="kit-bar"><span class="kit-spr"></span><span><span class="kit-t">KIT</span><span class="kit-s">${ROOMS[room]}</span></span><button class="kit-x" title="close">✕</button></div>
     <div class="kit-body"></div>
     <div class="kit-foot"><textarea class="kit-in" rows="1" placeholder="Ask Kit about this room…"></textarea><button class="kit-go" title="ask">➤</button></div>`;
  document.body.appendChild(win);
  win.querySelector(".kit-spr").appendChild(winSpr.cv);
  const body = win.querySelector(".kit-body"), input = win.querySelector(".kit-in"), go = win.querySelector(".kit-go");

  function fmt(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function addMsg(who, text) {
    const d = document.createElement("div"); d.className = "kit-msg " + who;
    if (who === "kit") d.innerHTML = fmt(text); else d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
  }
  addMsg("kit", `Hey — I'm Kit. I know my way around ${ROOMS[room]}. Stuck on anything? Ask me and I'll walk you through it.`);

  // ── floating "Ask Kit" button ──
  const fabSpr = makeSprite(28, 3);
  const fab = document.createElement("div"); fab.className = "kit-fab"; fab.title = "Ask Kit about this room";
  fab.appendChild(fabSpr.cv); const lbl = document.createElement("span"); lbl.textContent = "Ask Kit"; fab.appendChild(lbl);
  const _bar = document.querySelector(".top");
  if (_bar) { fab.classList.add("in-bar"); win.classList.add("from-bar"); _bar.appendChild(fab); } else { document.body.appendChild(fab); }
  fab.onclick = () => { win.classList.toggle("open"); if (win.classList.contains("open")) input.focus(); };
  win.querySelector(".kit-x").onclick = () => win.classList.remove("open");

  // ── ask Kit ──
  let busy = false;
  async function ask() {
    const q = input.value.trim(); if (!q || busy) return;
    busy = true; go.disabled = true;
    addMsg("you", q); input.value = ""; input.style.height = "auto";
    const think = addMsg("kit", "Kit's on it…"); think.classList.add("think"); winSpr.setSpeed(9);
    try {
      const r = await fetch("/api/kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room, message: q }) });
      const j = await r.json(); think.remove(); addMsg("kit", j.reply || "Hm, I blanked — ask me again?");
    } catch (e) { think.remove(); addMsg("kit", "Connection hiccup — try me again."); }
    finally { busy = false; go.disabled = false; winSpr.setSpeed(3); input.focus(); }
  }
  go.onclick = ask;
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(90, input.scrollHeight) + "px"; });

  // ── drag by the header ──
  win.querySelector(".kit-bar").addEventListener("mousedown", (e) => {
    if (e.target.closest(".kit-x")) return; e.preventDefault();
    const r = win.getBoundingClientRect();
    win.style.right = "auto"; win.style.bottom = "auto"; win.style.left = r.left + "px"; win.style.top = r.top + "px";
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    const mv = (ev) => {
      win.style.left = Math.max(4, Math.min(window.innerWidth - r.width - 4, ev.clientX - ox)) + "px";
      win.style.top = Math.max(4, Math.min(window.innerHeight - 44, ev.clientY - oy)) + "px";
    };
    const up = () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
  });
})();
