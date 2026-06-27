/* room-glow.js — element-precise "agent at work" glow.

   ONE shared call lights up the EXACT thing an agent is touching, labeled with WHO
   + WHAT, so you can SEE the work happen:

       roomGlow(target, { agent, label, state, progress })

   Design is research-backed (see MCP/agent-work-glow work): compositor-only
   animation (opacity + transform ONLY — never box-shadow/filter in a keyframe, which
   re-rasters every frame and janks on weak machines), honest progress (indeterminate
   by default; a real crawling sweep only when a true progress signal exists),
   seizure-safe (>=2.4s breathe, never strobes), color-blind-safe (identity rides the
   text label + dot, never hue alone), and self-shipped reduced-motion + a mute toggle
   (the work rooms carry none of their own).

   Opt-in: include this <script> in a room. It rides the existing hooks — agent-dock.js
   and mcp-bridge.js fire it at action start + done, so every verb lights its element
   with no per-verb wiring. Pure presentation layer; never touches the audio/render path. */
(function () {
  "use strict";
  if (window.roomGlow) return;

  var RMQ = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false, addEventListener: function () {} };
  var reduce = !!RMQ.matches;
  var muted = false;

  // ---- agent identity -> deterministic, stable hue ----------------------------
  var RESERVED = { tiff: "#E6B86A", kit: "#5FDED0", claude: "#FFB347", "god mode": "#FFB347" };
  var RAMP = ["#B584F0", "#9FD356", "#E5786B", "#5BA8F0", "#E56FA8", "#E8C24B", "#7BD0C0", "#F0A35B"];
  function hashStr(s) { var h = 2166136261 >>> 0; s = String(s || "agent"); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function hueFor(agent) { var k = String(agent || "").toLowerCase().trim(); if (RESERVED[k]) return RESERVED[k]; return RAMP[hashStr(k) % RAMP.length]; }
  function phaseFor(agent) { return -((hashStr(agent) % 1000) / 1000) * 2.4; } // seconds; de-syncs concurrent breaths

  // ---- verb map: a dispatched fn name -> a human, present-progressive phrase ---
  var VERBS = {
    studioGainStage: "gain-staging", studioRecipe: "dialing the vibe", studioHarmonize: "adding harmonies",
    studioChoir: "stacking a choir", studioVocoder: "vocoding the vocal", studioPultec: "Pultec on the master",
    studioParallel: "parallel saturation", studioPump: "sidechain pump", studioStutter: "stutter-chopping",
    studioDrop: "building a drop", studioGenSfx: "generating an SFX", cook: "cooking a beat", groove: "reworking the groove",
    setTempo: "setting the tempo", humanize: "humanizing", randomize: "rolling a new pattern",
  };
  function verbOf(label, action) { if (label) return label; if (action && VERBS[action]) return VERBS[action]; return "working"; }
  function pastOf(label) {
    if (!label) return "done";
    return label.replace(/^adding/, "added").replace(/^stacking/, "stacked").replace(/^building/, "built")
      .replace(/^generating/, "generated").replace(/^cooking/, "cooked").replace(/^rolling/, "rolled").replace(/ing\b/, "ed");
  }

  // ---- one injected stylesheet (box-shadow is STATIC; only opacity/transform animate) ----
  var CSS =
  "@property --glow-progress{syntax:'<number>';inherits:false;initial-value:0}" +
  ".dmv-glow::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:5;border-radius:inherit;" +
    "box-shadow:inset 4px 0 0 var(--ag,#FFB347),0 0 0 1px var(--ag,#FFB347),0 0 16px -3px var(--ag,#FFB347);" +
    "opacity:.5;will-change:opacity;animation:dmvBreathe 2.4s ease-in-out infinite alternate;animation-delay:var(--ag-phase,0s)}" +
  "@keyframes dmvBreathe{from{opacity:.42}to{opacity:1}}" +
  ".dmv-glow[data-glow='arming']::after{animation:dmvBreatheDim 3.4s ease-in-out infinite alternate}" +
  "@keyframes dmvBreatheDim{from{opacity:.26}to{opacity:.58}}" +
  ".dmv-glow[data-glow='done']::after{animation:dmvDone 1.1s ease-out forwards}" +
  "@keyframes dmvDone{0%{opacity:1}28%{opacity:1}100%{opacity:0}}" +
  ".dmv-glow[data-glow='error']::after{animation:none;opacity:.85}" +
  ".dmv-glow-room::after{box-shadow:inset 0 0 0 2px var(--ag,#FFB347);opacity:.32}" +
  ".dmv-glow-room.dmv-glow-dim::after{opacity:.15}" +
  ".dmv-glow-sweep{position:absolute;top:3px;bottom:3px;left:0;width:14%;pointer-events:none;z-index:6;" +
    "background:linear-gradient(90deg,transparent,var(--ag,#FFB347),transparent);opacity:.42;mix-blend-mode:screen;" +
    "will-change:transform;transform:translateX(-120%);animation:dmvSweep 1.9s linear infinite}" +
  "@keyframes dmvSweep{from{transform:translateX(-120%)}to{transform:translateX(760%)}}" +
  ".dmv-glow-pill{position:absolute;top:0;left:0;transform:translateY(-100%);z-index:7;pointer-events:none;" +
    "display:inline-flex;align-items:center;gap:5px;max-width:92%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" +
    "font:500 11px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;color:rgba(255,255,255,.72);" +
    "background:rgba(13,14,17,.92);border:1px solid rgba(255,255,255,.09);border-left:3px solid var(--ag,#FFB347);" +
    "border-radius:4px;padding:2px 8px}" +
  ".dmv-glow-pill b{color:var(--ag,#FFB347);font-weight:600}" +
  ".dmv-glow-pill .dmv-glow-dot{width:7px;height:7px;border-radius:50%;background:var(--ag,#FFB347);flex:0 0 auto}" +
  ".dmv-glow-pill[data-state='done']{border-left-color:#7BD389}" +
  ".dmv-glow-pill[data-state='done'] b{color:#7BD389}" +
  ".dmv-glow-pill[data-state='error']{border-left-color:#C76B61}" +
  ".dmv-glow-reduce .dmv-glow::after,.dmv-glow-muted .dmv-glow::after{animation:none!important;opacity:1}" +
  ".dmv-glow-reduce .dmv-glow-sweep,.dmv-glow-muted .dmv-glow-sweep{display:none}" +
  "@media (prefers-reduced-motion:reduce){.dmv-glow::after{animation:none!important;opacity:1}.dmv-glow-sweep{display:none}}";

  var style = document.createElement("style");
  style.id = "dmv-glow-css";
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  // ---- screen-reader announce region ----
  var liveRegion = null;
  function ensureLive() {
    if (liveRegion) return liveRegion;
    liveRegion = document.createElement("div");
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
    (document.body || document.documentElement).appendChild(liveRegion);
    return liveRegion;
  }
  function announce(msg) { try { ensureLive().textContent = msg; } catch (e) {} }

  var active = {}; // key -> { el, agent, timer }

  function resolve(target) {
    if (!target) return null;
    if (target.nodeType === 1) return target;
    if (typeof target === "string") {
      if (target === "room") return document.getElementById("tracks") || document.querySelector(".tracks") || document.getElementById("songView") || document.getElementById("mixer");
      if (target === "plugin") { var ws = document.querySelectorAll("#audiosuite, .plugwin[id], [id^='beatlab-win']"); return ws.length ? ws[ws.length - 1] : null; }
      if (target.charAt(0) === "#" || target.charAt(0) === ".") { try { return document.querySelector(target); } catch (e) { return null; } }
      return document.getElementById(target);
    }
    if (typeof target === "object") {
      if (target.scope === "room") return resolve("room");
      if (target.scope === "plugin") return resolve("plugin");
      if (target.id != null) return document.getElementById("lane-" + target.id) || document.getElementById(target.id);
    }
    return null;
  }

  function isRoom(el) { return !!(el && (el.id === "tracks" || el.id === "songView" || el.id === "mixer" || (el.className && /\btracks\b/.test(el.className)))); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function setPill(el, agent, text, state, hue) {
    var pill = el.querySelector(":scope > .dmv-glow-pill");
    if (!pill) { pill = document.createElement("div"); pill.className = "dmv-glow-pill"; el.appendChild(pill); }
    pill.style.setProperty("--ag", hue);
    pill.setAttribute("data-state", state || "working");
    pill.innerHTML = "<span class='dmv-glow-dot'></span><b>" + esc(agent || "Agent") + "</b> · <span>" + esc(text) + "</span>";
  }

  function teardown(key) {
    var rec = active[key]; if (!rec) return;
    clearTimeout(rec.timer);
    var el = rec.el;
    if (el) {
      el.classList.remove("dmv-glow", "dmv-glow-room", "dmv-glow-dim");
      el.removeAttribute("data-glow");
      el.style.removeProperty("--ag"); el.style.removeProperty("--ag-phase"); el.style.removeProperty("--glow-progress");
      var pill = el.querySelector(":scope > .dmv-glow-pill"); if (pill) pill.remove();
      var sweep = el.querySelector(":scope > .dmv-glow-sweep"); if (sweep) sweep.remove();
      if (el.dataset && el.dataset.dmvPosFix) { el.style.position = ""; delete el.dataset.dmvPosFix; }
    }
    delete active[key];
    refreshRoomDim();
  }

  function anyElementGlow() { for (var k in active) { if (active[k].el && !isRoom(active[k].el)) return true; } return false; }
  function refreshRoomDim() { var dim = anyElementGlow(); for (var k in active) { if (active[k].el && isRoom(active[k].el)) active[k].el.classList.toggle("dmv-glow-dim", dim); } }

  window.roomGlow = function (target, opts) {
    opts = opts || {};
    var el = resolve(target);
    if (!el) return { id: null, update: function () {}, clear: function () {} };

    var agent = opts.agent != null ? opts.agent : "";
    var hue = hueFor(agent);
    var state = opts.state || "working";
    var vtext = verbOf(opts.label, opts.action);
    var key = String(agent) + "|" + (el.id || el.className || "el");

    if (getComputedStyle(el).position === "static") { el.style.position = "relative"; el.dataset.dmvPosFix = "1"; }
    el.classList.add("dmv-glow");
    if (isRoom(el)) el.classList.add("dmv-glow-room");
    el.style.setProperty("--ag", state === "error" ? "#C76B61" : hue);
    el.style.setProperty("--ag-phase", phaseFor(agent) + "s");
    el.dataset.glow = state;

    var pillText = state === "done" ? "✓ " + pastOf(vtext) : (state === "error" ? "couldn’t " + vtext : vtext);
    setPill(el, agent, pillText, state, hue);

    // sweep: working only, never under reduced-motion / muted / whole-room
    var sweep = el.querySelector(":scope > .dmv-glow-sweep");
    if (state === "working" && !reduce && !muted && !isRoom(el)) {
      if (!sweep) { sweep = document.createElement("div"); sweep.className = "dmv-glow-sweep"; el.appendChild(sweep); }
      if (opts.progress != null) { sweep.style.animation = "none"; sweep.style.transform = "translateX(" + (opts.progress * 620) + "%)"; }
    } else if (sweep) { sweep.remove(); }

    if (!reduce && !muted) announce((agent || "Agent") + " is " + vtext);

    var rec = active[key] || (active[key] = {});
    rec.el = el; rec.agent = agent; clearTimeout(rec.timer);
    if (state === "done") rec.timer = setTimeout(function () { teardown(key); }, 1100);
    else if (state === "error") rec.timer = setTimeout(function () { teardown(key); }, 2200);
    else rec.timer = setTimeout(function () { teardown(key); }, opts.ttlMs || 30000); // watchdog (WCAG 2.2.2 + ghost-glow guard)

    refreshRoomDim();
    return {
      id: key,
      update: function (o) { return window.roomGlow(target, Object.assign({ agent: agent }, o || {})); },
      clear: function () { teardown(key); },
    };
  };

  window.roomGlow.clear = function (t) { var el = t ? resolve(t) : null; for (var k in active) { if (k === t || (el && active[k].el === el)) teardown(k); } };
  window.roomGlow.clearAll = function () { for (var k in active) teardown(k); };
  window.roomGlow.setMuted = function (b) { muted = !!b; document.documentElement.classList.toggle("dmv-glow-muted", muted); };
  Object.defineProperty(window.roomGlow, "reducedMotion", { get: function () { return reduce; } });
  Object.defineProperty(window.roomGlow, "muted", { get: function () { return muted; } });

  if (RMQ.addEventListener) RMQ.addEventListener("change", function (e) { reduce = e.matches; document.documentElement.classList.toggle("dmv-glow-reduce", reduce); });
  document.documentElement.classList.toggle("dmv-glow-reduce", reduce);
})();
