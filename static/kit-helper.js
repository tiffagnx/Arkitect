/* CHARACTERS — the in-room AI roster. Was just "Kit"; now Kit is one of a draggable
   CAST you pull into a room to be your brain there. Drag a character onto the room →
   it becomes the active helper; it's already room-aware (audio brain in Audio, video
   brain in Video — the room context switches automatically). Self-contained, injected
   by pinkroom-nav.js, loads in every ROOM, self-skips the main chat.

   v1 (this file = frontend/UX): roster, drag-to-activate, per-character identity, and the
   /api/kit call now carries `character`. The PER-CHARACTER BRAIN (each one's own trained
   knowledge/style) is the next step on the backend (/api/kit + kit_kb.py) — owned by the
   Kit session; until then every character answers via the shared room-aware brain, and the
   non-Kit ones are honestly marked "preview." */
(function () {
  if (window.__kit) return;
  const path = location.pathname.toLowerCase();
  const ROOMS = {
    studio: "DeMartin Audio Labs", build: "Blueprint Builds",
    editor: "LePrince Visual Labs", images: "Imagination Station", bit16: "Bit1Six",
  };
  let room = null;
  for (const k in ROOMS) { if (path.includes(k + ".html")) { room = k; break; } }
  if (!room) return;                 // chat / non-room → no roster
  window.__kit = true;

  // ── the cast. Kit is the default/built-in; the rest are PREVIEW personas that show the
  //    mechanic (real trained characters + their own brains arrive with the marketplace). ──
  const CHARACTERS_BUILTIN = [
    { id: "kit",    name: "Kit",    tag: "your build-bot",        color: "#7BB6CD", sprite: true,
      intro: r => `Yo — I'm Kit. I know my way around ${r}. Stuck on anything? Ask me and I'll walk you through it.` },
    { id: "boogie", name: "Boogie", tag: "mix engineer · 30 yrs", color: "#E6C16A", preview: true,
      intro: () => `Boogie here — three decades on the board. Drag me in and we'll get your record sounding like it belongs on the radio.\n\n**Preview character** — my real brain (trained on how I actually mix) comes with the marketplace. For now I answer through the room's helper.` },
    { id: "vex",    name: "Vex",    tag: "video editor",          color: "#6FbF9B", preview: true,
      intro: () => `Vex. I cut for pace and punch — every frame earns its place. Drag me into the video room and let's make it move.\n\n**Preview character** — full brain coming with the marketplace.` },
    { id: "quill",  name: "Quill",  tag: "songwriter",            color: "#C98BD0", preview: true,
      intro: () => `Quill. Words are my thing — hooks, structure, the line that sticks. Drag me in and let's write.\n\n**Preview character** — full brain coming with the marketplace.` },
  ];
  let CHARACTERS = CHARACTERS_BUILTIN.slice();   // merged cast (built-in + user-made); rebuilt on load/refresh
  let active = CHARACTERS[0];

  // ── user-created characters (the roster builder, character.html) live in localStorage
  //    under "dmv_characters". They're appended AFTER the built-in cast and carry their own
  //    persona/knowledge so the brain genuinely answers AS them. mine:true. ──
  function loadMine() {
    let arr = [];
    try {
      const raw = localStorage.getItem("dmv_characters");
      if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) arr = p; }
    } catch (_) { arr = []; }
    return arr.filter(c => c && c.id && c.mine).map(c => ({
      id: c.id, name: c.name || "Character", tag: c.tagline || c.craftLabel || "",
      color: c.color || "#7BB6CD", glyph: c.glyph || "", mine: true,
      persona: c.persona || "", knowledge: c.knowledge || "",
      craft: c.craft || "", craftLabel: c.craftLabel || "",
      readiness: typeof c.readiness === "number" ? c.readiness : 0,
      intro: r => `${c.name || "I'm in"} — ${c.craftLabel || "your character"} in ${r}. ${c.tagline || "Let's get to work."}`,
    }));
  }
  function rebuildCharacters() { return CHARACTERS_BUILTIN.concat(loadMine()); }

  const css = `
  .kit-fab { position:fixed; right:18px; bottom:18px; z-index:9996; display:flex; align-items:center; gap:7px;
    height:42px; padding:0 15px 0 9px; border-radius:21px; cursor:pointer; border:1px solid rgba(120,182,205,.4);
    background:linear-gradient(180deg,rgba(42,46,54,.96),rgba(22,24,30,.96)); color:#CFE6EE;
    font:700 12px Oxanium,sans-serif; letter-spacing:.06em; box-shadow:0 6px 20px rgba(0,0,0,.5); transition:transform .14s,box-shadow .14s; }
  .kit-fab:hover { transform:translateY(-2px); box-shadow:0 9px 26px rgba(62,156,184,.4); border-color:rgba(120,182,205,.75); }
  .kit-fab canvas { width:28px; height:28px; display:block; }
  .kit-fab .fab-av { width:26px; height:26px; }
  .kit-fab.in-bar { position:static; height:34px; border-radius:10px; padding:0 12px 0 7px; margin-left:6px; flex:none; box-shadow:none; }
  .kit-fab.in-bar canvas, .kit-fab.in-bar .fab-av { width:24px; height:24px; }
  .kit-win.from-bar { bottom:auto; top:62px; }
  .kit-win { position:fixed; right:18px; bottom:70px; z-index:9997; width:344px; max-width:92vw; display:none; flex-direction:column;
    max-height:min(600px,82vh); border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,.1);
    background:linear-gradient(160deg,#21232B,#15161B 60%,#101116); box-shadow:0 22px 60px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06); }
  .kit-win.open { display:flex; animation:kitrise .16s ease-out; }
  @keyframes kitrise { from { opacity:0; transform:translateY(10px); } }
  .kit-bar { display:flex; align-items:center; gap:10px; padding:10px 12px; cursor:move; user-select:none;
    border-bottom:1px solid rgba(255,255,255,.07); background:linear-gradient(180deg,rgba(255,255,255,.05),transparent); }
  .kit-bar canvas { width:34px; height:34px; display:block; flex:none; }
  .kit-av { width:34px; height:34px; border-radius:50%; flex:none; display:grid; place-items:center; font:800 15px Oxanium; color:#10131a; }
  .kit-t { font:700 14px Oxanium; letter-spacing:.1em; color:#E4F1F5; line-height:1; }
  .kit-s { font:500 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(198,201,208,.5); display:block; margin-top:3px; }
  .kit-x { margin-left:auto; background:rgba(0,0,0,.28); border:none; color:#9FCFDD; width:22px; height:22px; border-radius:6px; cursor:pointer; font-size:12px; }
  .kit-x:hover { background:rgba(62,156,184,.3); color:#fff; }
  /* the roster strip — the cast you can drag into the room */
  .kit-roster { display:flex; gap:6px; overflow-x:auto; padding:8px 10px; border-bottom:1px solid rgba(255,255,255,.06); background:rgba(0,0,0,.18); }
  .kit-roster::-webkit-scrollbar { height:0; }
  .kit-chip { flex:none; display:flex; align-items:center; gap:6px; padding:4px 9px 4px 4px; border-radius:20px; cursor:grab;
    border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03); transition:border-color .12s, background .12s, transform .1s; }
  .kit-chip:hover { border-color:rgba(120,182,205,.6); transform:translateY(-1px); }
  .kit-chip.on { border-color:rgba(120,182,205,.85); background:rgba(62,156,184,.16); }
  .kit-chip.drag { opacity:.5; }
  .kit-chip .cav { width:20px; height:20px; border-radius:50%; flex:none; display:grid; place-items:center; font:800 9.5px Oxanium; color:#10131a; }
  .kit-chip .cn { font:700 10.5px Oxanium; letter-spacing:.04em; color:#DCE6EA; white-space:nowrap; }
  .kit-chip .cp { font:700 7px 'Space Mono'; letter-spacing:.1em; color:#E6C16A; margin-left:2px; }
  .kit-hint { font:500 8.5px 'Space Mono'; letter-spacing:.08em; color:rgba(170,180,190,.45); padding:0 11px 7px; background:rgba(0,0,0,.18); }
  .room-drop { outline:2px dashed rgba(120,182,205,.0); transition:outline-color .15s; }
  .room-drop.armed { outline:2px dashed rgba(120,182,205,.8); outline-offset:-10px; }
  .drop-flash { position:fixed; z-index:9998; pointer-events:none; font:800 13px Oxanium; letter-spacing:.05em; color:#CFE6EE;
    background:rgba(20,26,32,.92); border:1px solid rgba(120,182,205,.6); border-radius:12px; padding:9px 14px; box-shadow:0 8px 24px rgba(0,0,0,.5); }
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

  // ── animated Kit sprite (only Kit has one; the rest get a lettered avatar) ──
  function makeSprite(view, fps) {
    const cv = document.createElement("canvas"); cv.width = view; cv.height = view;
    const ctx = cv.getContext("2d");
    const img = new Image();
    let frames = [], scale = 1, cur = 0, last = 0, speed = fps;
    const SEQ = [0,0,0,1,2,3,4,5,6,6,5,6,5,6,6,7,8,0,0];
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
  function avatar(ch, size) {
    const d = document.createElement("div"); d.className = size === "chip" ? "cav" : "kit-av";
    d.style.background = `radial-gradient(circle at 35% 30%, ${ch.color}, ${ch.color}99)`;
    // user characters can carry a glyph; fall back to the name initial (same as built-in cast)
    d.textContent = (ch.glyph && ch.glyph.trim()) ? ch.glyph : (ch.name[0] || "?").toUpperCase();
    return d;
  }

  // ── window ──
  const winSpr = makeSprite(34, 3);
  const win = document.createElement("div"); win.className = "kit-win";
  win.innerHTML =
    `<div class="kit-bar"><span class="kit-host"></span><span><span class="kit-t">KIT</span><span class="kit-s">${ROOMS[room]}</span></span><button class="kit-x" title="close">✕</button></div>
     <div class="kit-roster"></div>
     <div class="kit-hint">drag a character into the room, or tap to bring them in</div>
     <div class="kit-body"></div>
     <div class="kit-foot"><textarea class="kit-in" rows="1" placeholder="Ask about this room…"></textarea><button class="kit-go" title="ask">➤</button></div>`;
  document.body.appendChild(win);
  const hostSlot = win.querySelector(".kit-host"), titleEl = win.querySelector(".kit-t"),
        subEl = win.querySelector(".kit-s"), roster = win.querySelector(".kit-roster"),
        body = win.querySelector(".kit-body"), input = win.querySelector(".kit-in"), go = win.querySelector(".kit-go");

  function fmt(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function addMsg(who, text) {
    const d = document.createElement("div"); d.className = "kit-msg " + who;
    if (who === "kit") d.innerHTML = fmt(text); else d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
  }

  // paint the active character into the header (sprite for Kit, lettered avatar for the rest)
  function paintHost() {
    hostSlot.innerHTML = "";
    if (active.sprite) hostSlot.appendChild(winSpr.cv);
    else hostSlot.appendChild(avatar(active, "host"));
    titleEl.textContent = active.name.toUpperCase();
    subEl.textContent = active.preview ? "PREVIEW · " + ROOMS[room] : ROOMS[room];
    fab && fabLabel && (fabLabel.textContent = active.name === "Kit" ? "Yo, Kit" : active.name);
  }
  function setActive(ch, announce) {
    active = ch;
    [...roster.children].forEach(c => c.classList.toggle("on", c._id === ch.id));
    paintHost();
    if (announce) { body.innerHTML = ""; addMsg("kit", (ch.intro ? ch.intro(ROOMS[room]) : `${ch.name} is in. ${ROOMS[room]}.`)); }
  }

  // build the roster strip (each chip is draggable "into the room"). Re-runnable so user-made
  // characters can appear without a full reload. Built-in cast show "PREVIEW"; user (mine)
  // characters show their readiness % — the honest "you actually built this" signal.
  function buildRoster() {
    roster.innerHTML = "";
    CHARACTERS.forEach(ch => {
      const chip = document.createElement("div"); chip.className = "kit-chip"; chip._id = ch.id; chip.draggable = true;
      if (active && active.id === ch.id) chip.classList.add("on");
      chip.appendChild(avatar(ch, "chip"));
      const nm = document.createElement("span"); nm.className = "cn"; nm.textContent = ch.name; chip.appendChild(nm);
      if (ch.mine) {
        const p = document.createElement("span"); p.className = "cp"; p.textContent = Math.round(ch.readiness || 0) + "%"; chip.appendChild(p);
        chip.title = (ch.tag || ch.name) + " — your character (" + Math.round(ch.readiness || 0) + "% ready)";
      } else if (ch.preview) {
        const p = document.createElement("span"); p.className = "cp"; p.textContent = "PREVIEW"; chip.appendChild(p);
        chip.title = ch.tag + " (preview character)";
      } else {
        chip.title = ch.tag || ch.name;
      }
      chip.onclick = () => setActive(ch, true);
      chip.addEventListener("dragstart", e => { chip.classList.add("drag"); _dragId = ch.id; try { e.dataTransfer.setData("text/plain", ch.id); e.dataTransfer.effectAllowed = "copy"; } catch (_) {} });
      chip.addEventListener("dragend", () => { chip.classList.remove("drag"); _dragId = null; document.body.classList.remove("room-drop", "armed"); rmFlash(); });
      roster.appendChild(chip);
    });
    // trailing "+ Build" chip → the character creator
    const build = document.createElement("div"); build.className = "kit-chip kit-chip-build"; build.title = "Build your own character";
    const bn = document.createElement("span"); bn.className = "cn"; bn.textContent = "+ Build"; build.appendChild(bn);
    build.onclick = () => { location.href = "/static/character.html"; };
    roster.appendChild(build);
  }

  // ── drag a character ONTO the room → activate them there ──
  let _dragId = null, _flash = null;
  function rmFlash() { if (_flash) { _flash.remove(); _flash = null; } }
  document.addEventListener("dragover", e => {
    if (!_dragId) return; e.preventDefault(); try { e.dataTransfer.dropEffect = "copy"; } catch (_) {}
    document.body.classList.add("room-drop", "armed");
    const ch = CHARACTERS.find(c => c.id === _dragId);
    if (!_flash) { _flash = document.createElement("div"); _flash.className = "drop-flash"; document.body.appendChild(_flash); }
    _flash.textContent = "drop to bring " + (ch ? ch.name : "them") + " into " + ROOMS[room];
    _flash.style.left = Math.min(window.innerWidth - 240, e.clientX + 14) + "px";
    _flash.style.top = (e.clientY + 14) + "px";
  });
  document.addEventListener("drop", e => {
    if (!_dragId) return; e.preventDefault();
    const ch = CHARACTERS.find(c => c.id === _dragId); _dragId = null;
    document.body.classList.remove("room-drop", "armed"); rmFlash();
    if (ch) { if (!win.classList.contains("open")) win.classList.add("open"); setActive(ch, true); }
  });
  document.addEventListener("dragend", () => { document.body.classList.remove("room-drop", "armed"); rmFlash(); });

  // ── floating launcher (labelled with the active character) ──
  const fabSpr = makeSprite(28, 3);
  const fab = document.createElement("div"); fab.className = "kit-fab"; fab.title = "Your in-room character — tap to open, drag the cast in";
  fab.appendChild(fabSpr.cv); const fabLabel = document.createElement("span"); fabLabel.textContent = "Yo, Kit"; fab.appendChild(fabLabel);
  const _bar = document.querySelector(".kit-mount, .top");
  if (_bar) { fab.classList.add("in-bar"); win.classList.add("from-bar"); _bar.appendChild(fab); } else { document.body.appendChild(fab); }
  fab.onclick = () => { win.classList.toggle("open"); if (win.classList.contains("open")) input.focus(); };
  win.querySelector(".kit-x").onclick = () => win.classList.remove("open");

  setActive(CHARACTERS[0], true);   // default: Kit, room-aware

  // ── ask the active character (carries `character`; backend may route per-character later) ──
  let busy = false;
  async function ask() {
    const q = input.value.trim(); if (!q || busy) return;
    busy = true; go.disabled = true;
    addMsg("you", q); input.value = ""; input.style.height = "auto";
    const think = addMsg("kit", active.name + "'s on it…"); think.classList.add("think"); winSpr.setSpeed(9);
    try {
      const r = await fetch("/api/kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room, message: q, character: active.id }) });
      const j = await r.json(); think.remove();
      let reply = j.reply || "Hm, I blanked — ask me again?";
      if (active.preview) reply = "*(" + active.name + " is a preview character — answering through the room brain for now)*\n\n" + reply;
      addMsg("kit", reply);
    } catch (e) { think.remove(); addMsg("kit", "Connection hiccup — try me again."); }
    finally { busy = false; go.disabled = false; winSpr.setSpeed(3); input.focus(); }
  }
  go.onclick = ask;
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(90, input.scrollHeight) + "px"; });

  // ── drag the window by its header ──
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
