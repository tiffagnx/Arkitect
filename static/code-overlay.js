/* ──────────────────────────────────────────────────────────────────────────
   code-overlay.js — the floating Code box that rides over EVERY room.

   THE point (B fought 17+ hrs for this): a single, in-app, draggable code
   panel that floats ON TOP of whatever room you're in — DeMartin Audio,
   LePrince, Imagination Station, anything — so you can SEE the room behind it,
   screenshot it, and tell Kit to change it. It is a DIV inside the page, so it
   can NEVER be a browser window and can NEVER have a browser frame. There is no
   pop-out, no second OS window, no duplicates — one box, summoned anywhere.

   Injected into every room by pinkroom-nav.js.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  // Never run: inside an iframe (the panel's own code.html), on the code page
  // itself, or on the main chat/home (index.html already has its own float).
  if (window.self !== window.top) return;
  var path = (location.pathname || "").toLowerCase();
  if (path.indexOf("code.html") !== -1) return;
  if (path === "/" || path === "" || path.indexOf("index.html") !== -1) return;
  if (window.__codeOverlay) return;
  window.__codeOverlay = true;

  var POS_KEY  = "dmv-codeov-pos";
  var SIZE_KEY = "dmv-codeov-size";

  // ── styles ──
  var css = ''
  + '#dmvCodeLauncher{position:fixed;right:18px;bottom:18px;z-index:2147483000;'
  +   'display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;'
  +   'border-radius:12px;cursor:pointer;border:1px solid rgba(62,156,184,.5);'
  +   'background:linear-gradient(180deg,#123247,#0a1d2b);color:#cfe8f3;'
  +   'font:700 13px Inter,system-ui,sans-serif;letter-spacing:.02em;'
  +   'box-shadow:0 6px 22px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07);'
  +   'transition:transform .12s,border-color .12s,box-shadow .12s;user-select:none;}'
  + '#dmvCodeLauncher:hover{transform:translateY(-1px);border-color:rgba(62,156,184,.9);'
  +   'box-shadow:0 10px 28px rgba(62,156,184,.35),inset 0 1px 0 rgba(255,255,255,.1);}'
  + '#dmvCodeLauncher.hidden{display:none;}'
  + '#dmvCodeOv{position:fixed;inset:0;z-index:2147483100;display:none;pointer-events:none;}'
  + '#dmvCodeOv.open{display:block;}'
  + '#dmvCodePanel{position:absolute;width:960px;height:680px;min-width:480px;min-height:360px;'
  +   'background:#0a1520;border:1px solid rgba(62,156,184,.4);border-radius:14px;'
  +   'box-shadow:0 30px 90px rgba(0,0,0,.85),0 0 0 1px rgba(62,156,184,.12);'
  +   'display:flex;flex-direction:column;overflow:hidden;pointer-events:all;resize:both;}'
  + '#dmvCodeBar{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#060e17;'
  +   'border-bottom:1px solid rgba(62,156,184,.18);cursor:grab;user-select:none;flex:0 0 auto;}'
  + '#dmvCodeBar:active{cursor:grabbing;}'
  + '#dmvCodeTitle{font:700 12px Inter,system-ui,sans-serif;letter-spacing:.04em;'
  +   'color:rgba(120,200,225,.95);flex:1;}'
  + '.dmvCodeBtn{border:0;background:rgba(255,255,255,.06);color:rgba(205,215,225,.8);'
  +   'border-radius:7px;padding:4px 10px;font:700 12px Inter,system-ui,sans-serif;'
  +   'cursor:pointer;transition:background .12s,color .12s;}'
  + '.dmvCodeBtn:hover{background:rgba(62,156,184,.25);color:#eaf4fa;}'
  + '#dmvCodeClose:hover{background:rgba(220,70,70,.3);color:#fff;}'
  + '#dmvCodeFrame{flex:1;border:none;width:100%;min-height:0;background:#0a1520;}'
  + '#dmvCodeShield{display:none;position:absolute;inset:0;z-index:5;cursor:grabbing;}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ── launcher button ──
  var launcher = document.createElement("button");
  launcher.id = "dmvCodeLauncher";
  launcher.innerHTML = '<span style="font-size:15px">⌨</span> Code';
  launcher.title = "Open the floating Code box over this room";
  document.body.appendChild(launcher);

  // ── overlay + panel ──
  var ov = document.createElement("div"); ov.id = "dmvCodeOv";
  ov.innerHTML =
      '<div id="dmvCodePanel">'
    +   '<div id="dmvCodeBar">'
    +     '<span id="dmvCodeTitle">⌨ Code — Kit</span>'
    +     '<button class="dmvCodeBtn" id="dmvCodeMax" title="Maximize / restore">⤢</button>'
    +     '<button class="dmvCodeBtn" id="dmvCodeClose" title="Close (your work stays saved)">✕</button>'
    +   '</div>'
    +   '<div id="dmvCodeShield"></div>'
    +   '<iframe id="dmvCodeFrame" allow="microphone; clipboard-read; clipboard-write"></iframe>'
    + '</div>';
  document.body.appendChild(ov);

  var panel  = document.getElementById("dmvCodePanel");
  var bar    = document.getElementById("dmvCodeBar");
  var frame  = document.getElementById("dmvCodeFrame");
  var shield = document.getElementById("dmvCodeShield");

  // ── restore saved size + position ──
  function restore() {
    try {
      var s = JSON.parse(localStorage.getItem(SIZE_KEY) || "null");
      if (s && s.w) { panel.style.width = s.w + "px"; panel.style.height = s.h + "px"; }
    } catch (e) {}
    try {
      var p = JSON.parse(localStorage.getItem(POS_KEY) || "null");
      var pw = panel.offsetWidth || 960, ph = panel.offsetHeight || 680;
      if (p && typeof p.x === "number") {
        panel.style.left = Math.max(0, Math.min(p.x, window.innerWidth  - 120)) + "px";
        panel.style.top  = Math.max(0, Math.min(p.y, window.innerHeight - 60))  + "px";
      } else {
        panel.style.left = Math.max(10, (window.innerWidth  - pw) / 2) + "px";
        panel.style.top  = Math.max(10, (window.innerHeight - ph) / 3) + "px";
      }
    } catch (e) { panel.style.left = "80px"; panel.style.top = "60px"; }
  }

  function open() {
    restore();
    ov.classList.add("open");
    launcher.classList.add("hidden");
    if (!frame.src) frame.src = "/static/code.html";
  }
  function close() {
    ov.classList.remove("open");
    launcher.classList.remove("hidden");
  }

  launcher.onclick = open;
  document.getElementById("dmvCodeClose").onclick = close;

  // ── maximize / restore (inside the app — never a window) ──
  var maxed = false, prev = null;
  document.getElementById("dmvCodeMax").onclick = function () {
    if (!maxed) {
      prev = { w: panel.style.width, h: panel.style.height, l: panel.style.left, t: panel.style.top };
      panel.style.left = "2vw"; panel.style.top = "2vh";
      panel.style.width = "96vw"; panel.style.height = "94vh";
      maxed = true;
    } else {
      if (prev) {
        panel.style.width  = prev.w || "960px"; panel.style.height = prev.h || "680px";
        panel.style.left   = prev.l || "80px";  panel.style.top    = prev.t || "60px";
      }
      maxed = false;
    }
  };

  // ── drag the panel by its title bar ──
  var dragging = false, ox = 0, oy = 0;
  bar.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    dragging = true;
    shield.style.display = "block";        // stops the iframe stealing the mouse mid-drag
    var r = panel.getBoundingClientRect();
    ox = e.clientX - r.left; oy = e.clientY - r.top;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  });
  function onMove(e) {
    if (!dragging) return;
    var x = Math.max(0, e.clientX - ox), y = Math.max(0, e.clientY - oy);
    panel.style.left = x + "px"; panel.style.top = y + "px";
    try { localStorage.setItem(POS_KEY, JSON.stringify({ x: x, y: y })); } catch (e2) {}
  }
  function onUp() {
    dragging = false; shield.style.display = "none";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }

  // ── remember size after a resize-drag ──
  try {
    var ro = new ResizeObserver(function () {
      if (!maxed && panel.offsetWidth) {
        try { localStorage.setItem(SIZE_KEY, JSON.stringify({ w: panel.offsetWidth, h: panel.offsetHeight })); } catch (e) {}
      }
    });
    ro.observe(panel);
  } catch (e) {}
})();
