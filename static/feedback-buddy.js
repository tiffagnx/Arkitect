/* FEEDBACK BUDDY — the in-room "help us build it" collector. Kept SEPARATE from Kit on purpose:
   Kit helps you make the music; this one only collects what broke, what you'd change, what you
   wish it did — and bundles it clean so you can fire it to the team. "You're early = you're a
   builder." Talk or type. Self-contained, injected by pinkroom-nav.js, loads in rooms, skips chat.

   v0 delivery: copy-to-send (your early people know you — they text/DM it). It ALSO tries to POST
   /api/feedback, so the day that inbox/endpoint exists, it auto-files with zero changes here. */
(function () {
  if (window.__fbk) return;
  const path = location.pathname.toLowerCase();
  const ROOMS = { studio: "DeMartin Audio Labs", beats: "The Kitchen", build: "Blueprint Builds", editor: "LePrince Visual Labs",
    images: "Imagination Station", stream: "The Stream" };
  let room = null; for (const k in ROOMS) if (path.includes(k + ".html")) { room = k; break; }
  if (!room) return;
  window.__fbk = true;
  const ROOM = ROOMS[room], KEY = "ark_feedback_items";
  let items = [];
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) items = s; } catch (e) {}

  const css = `
  .fbk-fab { position:fixed; right:18px; bottom:68px; z-index:9996; display:flex; align-items:center; gap:7px;
    height:38px; padding:0 14px 0 12px; border-radius:19px; cursor:pointer; border:1px solid rgba(120,182,205,.32);
    background:linear-gradient(180deg,rgba(42,46,54,.96),rgba(22,24,30,.96)); color:#CFE6EE;
    font:700 11.5px Oxanium,sans-serif; letter-spacing:.05em; box-shadow:0 6px 18px rgba(0,0,0,.5); transition:transform .14s,box-shadow .14s; }
  .fbk-fab:hover { transform:translateY(-2px); box-shadow:0 9px 24px rgba(62,156,184,.3); border-color:rgba(120,182,205,.7); }
  .fbk-fab.in-bar { position:static; height:34px; border-radius:10px; padding:0 12px; margin-left:6px; flex:none; box-shadow:none; }
  .fbk-win.from-bar { left:auto; right:16px; bottom:auto; top:62px; }
  .fbk-fab .ct { display:none; min-width:16px; height:16px; padding:0 4px; border-radius:8px; background:#D9A441; color:#1a1408; font:800 9.5px 'Space Mono'; align-items:center; justify-content:center; }
  .fbk-fab .ct.on { display:inline-flex; }
  .fbk-win { position:fixed; left:16px; bottom:62px; z-index:9997; width:340px; max-width:92vw; display:none; flex-direction:column;
    max-height:min(560px,82vh); border-radius:16px; overflow:hidden; border:1px solid rgba(230,193,106,.22);
    background:linear-gradient(160deg,#211e18,#16140f 60%,#100e0a); box-shadow:0 22px 60px rgba(0,0,0,.7); }
  .fbk-win.open { display:flex; animation:fbkrise .16s ease-out; }
  @keyframes fbkrise { from { opacity:0; transform:translateY(10px); } }
  .fbk-bar { display:flex; align-items:center; gap:9px; padding:11px 13px; border-bottom:1px solid rgba(255,255,255,.06); }
  .fbk-bar .ic { font-size:17px; }
  .fbk-t { font:700 13px Oxanium; letter-spacing:.06em; color:#F0E4C8; line-height:1; }
  .fbk-s { font:500 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(200,185,150,.5); display:block; margin-top:3px; }
  .fbk-x { margin-left:auto; background:rgba(0,0,0,.28); border:none; color:#D9C79A; width:22px; height:22px; border-radius:6px; cursor:pointer; font-size:12px; }
  .fbk-x:hover { background:rgba(217,164,65,.3); color:#fff; }
  .fbk-intro { padding:12px 14px 4px; font:500 12px Inter; line-height:1.5; color:#CFC6B2; }
  .fbk-intro b { color:#E6C16A; }
  .fbk-list { flex:1; overflow-y:auto; padding:8px 12px; display:flex; flex-direction:column; gap:7px; min-height:30px; }
  .fbk-item { display:flex; gap:8px; align-items:flex-start; font:400 12px Inter; line-height:1.45; color:#E4DDCB;
    background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.06); border-radius:9px; padding:7px 9px; }
  .fbk-item .rm { margin-left:auto; flex:none; background:none; border:none; color:rgba(200,185,150,.5); cursor:pointer; font-size:13px; line-height:1; }
  .fbk-item .rm:hover { color:#E5565B; }
  .fbk-empty { font:italic 400 11.5px Inter; color:rgba(200,185,150,.45); padding:4px 2px; }
  .fbk-foot { border-top:1px solid rgba(255,255,255,.06); padding:9px 11px; display:flex; flex-direction:column; gap:8px; }
  .fbk-inrow { display:flex; gap:7px; align-items:flex-end; }
  .fbk-in { flex:1; resize:none; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.1); border-radius:10px;
    color:#EDE6D6; font:500 12px Inter; padding:8px 10px; outline:none; max-height:84px; }
  .fbk-in:focus { border-color:rgba(230,193,106,.5); }
  .fbk-mic, .fbk-add { flex:none; border:none; border-radius:10px; cursor:pointer; height:36px; }
  .fbk-mic { width:36px; background:rgba(255,255,255,.06); color:#D9C79A; font-size:15px; }
  .fbk-mic.live { background:#E5565B; color:#fff; animation:fbkpulse 1s infinite; }
  @keyframes fbkpulse { 50% { opacity:.6; } }
  .fbk-add { padding:0 13px; background:rgba(230,193,106,.16); color:#F0E4C8; font:700 11.5px Inter; border:1px solid rgba(230,193,106,.3); }
  .fbk-add:hover { background:rgba(230,193,106,.26); }
  .fbk-send { width:100%; border:none; border-radius:11px; cursor:pointer; padding:11px; font:700 12.5px Inter; color:#1a1408;
    background:linear-gradient(120deg,#E6C16A,#D9A441); box-shadow:0 3px 12px rgba(217,164,65,.3); }
  .fbk-send:disabled { opacity:.45; cursor:default; box-shadow:none; }
  .fbk-note { font:500 10px 'Space Mono'; letter-spacing:.02em; color:rgba(200,185,150,.55); text-align:center; line-height:1.4; }
  @media (max-width:680px){ .fbk-win { left:8px; right:8px; width:auto; } }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const win = document.createElement("div"); win.className = "fbk-win";
  win.innerHTML =
    `<div class="fbk-bar"><span class="ic">📣</span><span><span class="fbk-t">MAKE IT BETTER</span><span class="fbk-s">${ROOM}</span></span><button class="fbk-x" title="close">✕</button></div>
     <div class="fbk-intro">You're early — so you're a <b>builder</b>, not just a user. Hit a bug, something clunky, something you wish it did? Drop it here. I'll bundle your notes clean so you can fire 'em to the team.</div>
     <div class="fbk-list"></div>
     <div class="fbk-foot">
       <div class="fbk-inrow"><textarea class="fbk-in" rows="1" placeholder="What broke / what you'd change…"></textarea><button class="fbk-mic" title="talk it">🎤</button><button class="fbk-add">Add</button></div>
       <button class="fbk-send">Send it to the team</button>
       <div class="fbk-note"></div>
     </div>`;
  document.body.appendChild(win);
  const listEl = win.querySelector(".fbk-list"), input = win.querySelector(".fbk-in"),
        micBtn = win.querySelector(".fbk-mic"), addBtn = win.querySelector(".fbk-add"),
        sendBtn = win.querySelector(".fbk-send"), noteEl = win.querySelector(".fbk-note");

  const fab = document.createElement("div"); fab.className = "fbk-fab"; fab.title = "Help build DeMartinville — report bugs + ideas";
  fab.innerHTML = `<span>📣</span><span>Feedback</span><span class="ct"></span>`;
  const _fbar = document.querySelector(".kit-mount, .top");
  if (_fbar) { fab.classList.add("in-bar"); win.classList.add("from-bar"); _fbar.appendChild(fab); } else { document.body.appendChild(fab); }
  const fabCt = fab.querySelector(".ct");

  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function render() {
    listEl.innerHTML = "";
    if (!items.length) { const e = document.createElement("div"); e.className = "fbk-empty"; e.textContent = "Nothing yet — what'd you run into today?"; listEl.appendChild(e); }
    items.forEach((it, i) => {
      const d = document.createElement("div"); d.className = "fbk-item";
      d.innerHTML = `<span>• ${esc(it)}</span><button class="rm" title="remove">✕</button>`;
      d.querySelector(".rm").onclick = () => { items.splice(i, 1); save(); render(); };
      listEl.appendChild(d);
    });
    fabCt.textContent = items.length; fabCt.classList.toggle("on", items.length > 0);
    sendBtn.disabled = !items.length;
    listEl.scrollTop = listEl.scrollHeight;
  }
  function addItem() {
    const v = input.value.trim(); if (!v) return;
    items.push(v); save(); input.value = ""; input.style.height = "auto"; render();
    noteEl.textContent = "Got it. Anything else? (or hit send)";
  }
  addBtn.onclick = addItem;
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addItem(); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(84, input.scrollHeight) + "px"; });

  // ── talk-to-text (browser speech, same as the chat) ──
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, listening = false;
  if (!SR) { micBtn.style.display = "none"; }
  else {
    micBtn.onclick = () => {
      if (listening) { rec && rec.stop(); return; }
      rec = new SR(); rec.lang = "en-US"; rec.interimResults = true; rec.continuous = true;
      let base = input.value ? input.value + " " : "";
      rec.onresult = e => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = base + t; input.dispatchEvent(new Event("input")); };
      rec.onend = () => { listening = false; micBtn.classList.remove("live"); micBtn.textContent = "🎤"; };
      rec.onerror = () => { listening = false; micBtn.classList.remove("live"); micBtn.textContent = "🎤"; };
      rec.start(); listening = true; micBtn.classList.add("live"); micBtn.textContent = "■"; input.focus();
    };
  }

  // ── send: bundle clean, copy to clipboard, AND try to auto-file (graceful) ──
  sendBtn.onclick = async () => {
    if (!items.length) return;
    const stamp = new Date().toString().split(" GMT")[0];
    const text = `DeMartinville feedback — ${ROOM} — ${stamp}\n` + items.map(x => "• " + x).join("\n");
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch (e) {}
    // forward-compatible: auto-file if an inbox endpoint exists; silently ignore if not
    try { fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room, items, ts: Date.now() }) }).catch(() => {}); } catch (e) {}
    noteEl.innerHTML = copied
      ? "✓ Copied — paste it to the team (text / DM) and you've helped build it. 🤝"
      : "Couldn't auto-copy — select &amp; copy this:<br><textarea readonly style='width:100%;height:54px;margin-top:5px;font:11px monospace;background:#0d0c0a;color:#ddd;border:1px solid #333;border-radius:6px'>" + esc(text) + "</textarea>";
    items = []; save(); render();
  };

  fab.onclick = () => { win.classList.toggle("open"); if (win.classList.contains("open")) { input.focus(); render(); } };
  win.querySelector(".fbk-x").onclick = () => win.classList.remove("open");
  render();
})();
