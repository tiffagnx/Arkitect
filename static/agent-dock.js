/* DeMartin Studio — PARENT THE AGENT to stems  (Phase 0 v3: AE-style parenting, NO workspace clutter)
   ───────────────────────────────────────────────────────────────────────────
   A TINY 🎙 snap button on every track strip (down in the control area, under
   record/solo/mute — NOT in the name row). Click it to PARENT the agent to that
   stem; click again to unparent. Parent ONE stem, SIX, the MASTER, or a blank —
   any combo. The ONLY readout lives in HER floating window (the one B likes) —
   NO panel cluttering the workspace. What's parented is shown right on the stems:
   the lit 🎙 button + a left-edge glow on the lane. She "hears" each parented
   stem (measure()+detectType()) and posts the report into her chat.

   100% additive: hooks studio.html globals (tracks, laneUi, measure, detectType,
   t.buffer) + kit-helper's window.__kitSay. studio.html only gains a <script>
   include + `window.tracks = tracks`. The AE drag-a-line pick-whip is a visual
   polish layer to add on top of these snap buttons.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.__dmvDock) return; window.__dmvDock = true;

  window.agentScope = { trackIds: [] };          // what she's parented to (many stems, the master, or none)
  function parented() { return window.agentScope.trackIds; }
  function isParented(id) { return parented().indexOf(id) >= 0; }
  function trackById(id) { try { return (window.tracks || []).filter(function (t) { return t.id === id; })[0] || null; } catch (e) { return null; } }

  // ── styles — ONLY the in-stem button + lane glow. No floating panel. ──
  var css = ""
    + ".dock-btn{display:inline-flex;align-items:center;justify-content:center;width:22px;height:16px;margin-top:3px;"
    + "font-size:10px;line-height:1;color:#8fd0df;background:rgba(62,156,184,.10);border:1px solid rgba(95,180,206,.38);"
    + "border-radius:5px;cursor:pointer;transition:all .12s;padding:0}"
    + ".dock-btn:hover{color:#dff2f7;border-color:rgba(95,180,206,.85);background:rgba(62,156,184,.22)}"
    + ".dock-btn.on{color:#06161b;background:linear-gradient(120deg,#7BF0E4,#3E9CB8);border-color:transparent;box-shadow:0 0 8px rgba(95,222,208,.6)}"
    + ".lane.parented{box-shadow:inset 3px 0 0 #5fded0}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ── HEARING REPORT — existing measure()+detectType() → one engineer-grade line ──
  function loudWord(r) { return r > -9 ? "loud" : r > -16 ? "healthy" : r > -24 ? "a bit low" : "quiet"; }
  function brightWord(c) { return c < 1500 ? "dark" : c > 3800 ? "bright/airy" : "balanced up top"; }
  function dynWord(cr) { return cr > 14 ? "wide & dynamic" : cr < 8 ? "squashed/flat" : "even"; }

  // PHASE 2 — the snapshot goes DEEPER than raw audio: she also "sees" what's already ON the stem
  //   (the plugin chain + its key knobs + routing/state). So when she's docked she knows the full
  //   picture — the sound AND the processing — not just a level reading. A few notable knob values
  //   are read out so it's a real "read its settings," not just plugin names.
  var KEYP = { Compressor: ["ratio", ":1", 1], "De-Ess": ["thr", "dB", 0], Reverb: ["mix", "%", 100], Saturator: ["mix", "%", 100], Slap: ["mix", "%", 100], Delay: ["mix", "%", 100] };
  function chainSummary(t) {
    var ins = (t.inserts || []).filter(function (x) { return x && x.name; });
    var out = [];
    var user = ins.filter(function (x) { return !(x._doc || (x.params && x.params.__doc)); });
    var doc = ins.filter(function (x) { return x._doc || (x.params && x.params.__doc); });
    if (user.length) {
      out.push("already on it: " + user.map(function (x) {
        var k = KEYP[x.name], lbl = x.name + (x.bypassed ? " (off)" : "");
        if (k && x.params && typeof x.params[k[0]] === "number") { var v = x.params[k[0]]; lbl += " (" + (k[2] === 100 ? Math.round(v * 100) : Math.round(v * 10) / 10) + k[1] + ")"; }
        return lbl;
      }).join(" → "));
    }
    if (doc.length) out.push("my chain's loaded");
    var sends = (t.sends || []).filter(function (sd) { return sd && sd.on !== false && (sd.level > 0.001); });
    if (sends.length) out.push("→ verb send");
    if (t.muted) out.push("muted");
    if (typeof t.pan === "number" && Math.abs(t.pan) > 0.1) out.push("panned " + (t.pan < 0 ? "L" : "R"));
    return out.join(", ");
  }

  async function hearingReport(t) {
    if (!t) return "—";
    if (t.type === "master") {
      var cm = chainSummary(t);
      return "the MASTER — the whole mix routes through here" + (cm ? " · " + cm : "") + ". Snap me here to treat everything as one.";
    }
    var buf = t.buffer || (t.clips && t.clips[0] && t.clips[0].buffer);
    if (!buf) return "blank — nothing on it. Say what to build (e.g. “80 BPM boom-bap”) and I’ll lay it down here";
    try {
      var m = await measure(buf);
      if (!m || !m.ok || !m.features) return "couldn’t read it clearly yet";
      var f = m.features, dt = detectType(f), typeName = dt.type === "beat" ? "beat" : dt.type;
      var conf = dt.confidence ? " (" + Math.round(dt.confidence * 100) + "%)" : "";
      var bits = [];
      if (isFinite(f.rmsDb)) bits.push(f.rmsDb.toFixed(1) + " dB " + loudWord(f.rmsDb));
      if (f.centroid) bits.push(brightWord(f.centroid));
      if (f.sibRatio > 0.22) bits.push("harsh ~" + (f.sibPeakHz | 0) + "Hz");
      if (isFinite(f.crestDb)) bits.push(dynWord(f.crestDb) + " (crest " + f.crestDb.toFixed(0) + ")");
      var ci = chainSummary(t);
      return typeName + conf + " — " + bits.join(", ") + (ci ? " · " + ci : "");
    } catch (e) { return "snag reading it"; }
  }
  window.DMV_DOCK_HEAR = hearingReport;   // Phase 1 will reuse this

  // ── push the parented set + what she hears into HER chat (debounced; the only readout) ──
  var _sayT = null;
  function sayToAgent() {
    clearTimeout(_sayT);
    _sayT = setTimeout(async function () {
      try {
        var ids = parented();
        if (!ids.length) { if (window.__kitSay) window.__kitSay("Unparented — I’m off the stems. Snap me onto whatever you want me on."); return; }
        if (!window.__kitSay) return;   // no agent summoned → the lit buttons + lane glow show what's parented
        var lines = [];
        for (var i = 0; i < ids.length; i++) { var t = trackById(ids[i]); lines.push("• " + (t ? t.name : ids[i]) + (t && t.type === "master" ? " (MASTER)" : "") + ": " + (await hearingReport(t))); }
        var head = ids.length === 1 ? "I’m parented to 1 stem:" : ("I’m parented to " + ids.length + " stems:");
        window.__kitSay(head + "\n" + lines.join("\n") + "\n\nTell me what to do — one, some, or all of them.");
      } catch (e) {}
    }, 600);
  }

  function refresh() {
    document.querySelectorAll(".lane.parented").forEach(function (l) { l.classList.remove("parented"); });
    document.querySelectorAll(".dock-btn.on").forEach(function (b) { b.classList.remove("on"); });
    parented().forEach(function (id) {
      var lane = document.getElementById("lane-" + id);
      if (lane) { lane.classList.add("parented"); var b = lane.querySelector(".dock-btn"); if (b) b.classList.add("on"); }
    });
    sayToAgent();
  }

  function toggleParent(t) {
    if (!t) return;
    var ids = parented(), i = ids.indexOf(t.id);
    if (i >= 0) ids.splice(i, 1); else ids.push(t.id);
    refresh();
  }
  function unparentAll() { window.agentScope.trackIds = []; refresh(); }
  window.DMV_DOCK = {
    toggle: toggleParent, unparentAll: unparentAll,
    parentAll: function () { window.agentScope.trackIds = (window.tracks || []).filter(function (t) { return t.type !== "aux"; }).map(function (t) { return t.id; }); refresh(); },
    list: function () { return parented().slice(); }, hearingReport: hearingReport
  };

  // ── the tiny 🎙 snap button — in the control area UNDER record/solo/mute ──
  function addDockBtn(t) {
    if (!t || t.type === "aux") return;
    var lane = document.getElementById("lane-" + t.id); if (!lane) return;
    var ctrls = lane.querySelector(".ts-ctrls"); if (!ctrls || ctrls.querySelector(".dock-btn")) return;
    var btn = document.createElement("button");
    btn.className = "dock-btn" + (isParented(t.id) ? " on" : ""); btn.type = "button";
    btn.textContent = "🎙";   // 🎙
    btn.title = "Parent the agent to this " + (t.type === "master" ? "master (she hears the whole mix)" : "stem") + " — click to connect / unconnect. Parent as many as you want.";
    btn.onclick = function (e) { e.stopPropagation(); toggleParent(t); };
    ctrls.appendChild(btn);
  }

  function scanAll() { try { (window.tracks || []).forEach(addDockBtn); } catch (e) {} }
  if (typeof window.laneUi === "function") {
    var _laneUi = window.laneUi;
    window.laneUi = function (t) { var r = _laneUi.apply(this, arguments); try { addDockBtn(t); if (isParented(t.id)) { var l = document.getElementById("lane-" + t.id); if (l) l.classList.add("parented"); } } catch (e) {} return r; };
  }
  scanAll(); setTimeout(scanAll, 400); setTimeout(scanAll, 1500);

  /* ══════════════════════════════════════════════════════════════════════════
     PHASE 1 — SHE ACTS. When she's parented and you give a fix command
     ("brighter", "warmer", "more punch", "less harsh", "more space", "fix it"),
     she APPLIES it to the parented stem(s) — through the Studio's existing
     Vocal-Doctor engine, every move CLAMPED to a safe band so she physically
     can't wreck the mix. 100% in-house + client-side → free, works on ANY brain
     (even none), desktop AND cloud. The brain still answers everything else.
     ══════════════════════════════════════════════════════════════════════════ */
  function clampU(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }

  // PHASE 3 — TASTE. Same toolbelt, different HANDS. `bias` nudges how far each move goes (so the
  //   SAME "brighter" lands differently per agent); `sig` is the signature finish on a "fix it"; `flair`
  //   is her voice tag. Never a refusal — ask either for anything, you just get it with their fingerprint.
  //   User-built agents can override/extend via window.DMV_AGENT_STYLE (their taste grows from memory later).
  var STYLE = Object.assign({
    // Kit = the technical one (he's a robot): precise, spec-driven, clean & forward.
    kit:  { bias: { bright: +0.08, smooth: +0.08, deess: +0.05, demud: +0.06, tight: +0.05, throw: +0.05, warm: -0.03, space: -0.06 },
            sig: [{ macro: "bright", u: 0.63 }, { macro: "smooth", u: 0.62 }, { macro: "deess", u: 0.6 }],
            flair: "Calibrated — crisp, forward, every move in spec. ⚙️" },
    // Tiff = laid-back, one of the crew, a real artist who actually makes music. Warm, easy, by feel.
    tiff: { bias: { warm: +0.09, space: +0.08, throw: +0.03, bright: -0.03, smooth: -0.03, deess: -0.02, demud: -0.02, tight: -0.04 },
            sig: [{ macro: "warm", u: 0.63 }, { macro: "space", u: 0.6 }, { macro: "smooth", u: 0.55 }],
            flair: "That's the vibe — warm, easy, sittin' right in the pocket. We good? 🫶" },
  }, window.DMV_AGENT_STYLE || {});

  function parseIntent(text) {
    // LEFT-TO-RIGHT WORD WALK. "less"/"more" set a pending polarity that binds to the NEXT attribute
    // word and then resets — so "brighter, less harsh, more warmth" reads bright=UP, harsh=more-deess,
    // warmth=UP, with no cross-clause bleed. de-ess is always "apply more" (its targets are all bad);
    // smooth honors less/more — "less compression"/"less punch" must REDUCE it, not tighten harder.
    var s = " " + (text || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ") + " ";
    s = s.replace(/\btop end\b/g, "topend").replace(/\blow end\b/g, "lowend").replace(/\bde ess\b/g, "deess").replace(/\bad lib\b/g, "adlib");
    s = s.replace(/\bease up\b/g, "ease");   // "ease up X" = LESS X — keep the NEG, don't let "up" flip it to more
    s = s.replace(/\bhigh pass\b/g, "highpass").replace(/\bhi pass\b/g, "highpass").replace(/\bin your face\b/g, "forward").replace(/\bsit back\b/g, "sitback").replace(/\bpull back\b/g, "sitback");
    s = s.replace(/\btight(en)?\s+(the\s+)?low(s|\s*end)?\b/g, " highpass ");   // "tighten the lows" = HIGH-PASS, not compression ("tighten it up" stays compression)
    s = s.replace(/\ba little\b/g, "little").replace(/\ba lot\b/g, "alot").replace(/\ba bit\b/g, "bit").replace(/\ba tad\b/g, "tad").replace(/\ba touch\b/g, "touch").replace(/\ba hair\b/g, "hair");
    var words = s.split(/\s+/).filter(Boolean);
    var NEG = { less: 1, too: 1, reduce: 1, tame: 1, cut: 1, soften: 1, lower: 1, kill: 1, ease: 1, pull: 1, dial: 1, down: 1, calm: 1, drop: 1 };
    var POS = { more: 1, add: 1, boost: 1, up: 1, increase: 1, raise: 1, extra: 1, bump: 1, give: 1 };
    // INTENSITY (degree) — "a touch / a little" → gentle move · "way / a lot / really" → strong move.
    var GENTLE = { little: 1, bit: 1, touch: 1, tad: 1, hair: 1, slightly: 1, slight: 1, smidge: 1, smidgen: 1, subtle: 1, subtly: 1, barely: 1, gently: 1, gentle: 1, tiny: 1 };
    var STRONG = { way: 1, much: 1, alot: 1, lot: 1, lots: 1, lotta: 1, really: 1, real: 1, super: 1, heavy: 1, heavily: 1, hard: 1, tons: 1, ton: 1, mad: 1, crazy: 1, aggressive: 1, aggressively: 1 };
    var DRY = { dry: 1, drier: 1, intimate: 1, sitback: 1, closer: 1 };   // → less space (forced down)
    var ATTR = [
      { m: "bright", polar: true,  stems: ["bright", "crisp", "airy", "air", "presence", "present", "forward", "clear", "clarity", "sheen", "sparkle", "shimmer", "shine", "open", "topend", "treble", "cutthrough"] },
      { m: "warm",   polar: true,  stems: ["warm", "warmth", "fat", "fatten", "fuller", "full", "thick", "thicken", "body", "rich", "beef", "round", "chest", "lowend", "bottom", "weight", "meat"] },
      { m: "space",  polar: true,  stems: ["space", "spacious", "spacey", "wide", "widen", "room", "reverb", "verb", "wet", "ambien", "depth", "lush", "big", "huge", "cathedral", "hall"] },
      { m: "throw",  polar: true,  stems: ["throw", "slap", "echo", "delay", "bounce", "adlib", "tail"] },
      { m: "smooth", polar: true,  stems: ["punch", "punchy", "tight", "tighten", "glue", "grab", "control", "controlled", "smooth", "compress", "rein", "consistent", "steady", "even", "squeeze", "ride", "level"] },
      { m: "deess",  polar: false, stems: ["harsh", "sibilan", "essy", "ess", "esses", "deess", "piercing", "sharp", "spit", "sizzle", "sss"] },
      { m: "demud",  polar: false, stems: ["mud", "muddy", "boxy", "honky", "honk", "cloudy", "congest", "demud"] },
      { m: "tight",  polar: false, stems: ["rumble", "boomy", "subby", "highpass"] },
    ];
    function macroFor(w) { for (var a = 0; a < ATTR.length; a++) { var st = ATTR[a].stems; for (var k = 0; k < st.length; k++) if (w === st[k] || w.indexOf(st[k]) === 0) return ATTR[a]; } return null; }
    var moves = [], seen = {}, pending = 0, pInt = 1;
    function push(macro, dir) { if (!seen[macro]) { moves.push({ macro: macro, dir: dir, intensity: pInt }); seen[macro] = 1; } pending = 0; pInt = 1; }
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (NEG[w]) { pending = -1; continue; }
      if (POS[w]) { pending = 1; continue; }
      if (GENTLE[w]) { pInt = 0.55; continue; }
      if (STRONG[w]) { pInt = 1.6; continue; }
      if (DRY[w]) { push("space", -1); continue; }
      var at = macroFor(w);
      if (at) push(at.m, at.polar ? (pending < 0 ? -1 : 1) : 1);
    }
    var FF = ["fix", "clean", "sweeten", "polish", "master", "do your thing", "work your magic", "sound better", "vocal chain", "treat it", "treat em", "treat the"];
    var raw = " " + (text || "").toLowerCase() + " ", fullFix = false;
    for (var f = 0; f < FF.length; f++) if (raw.indexOf(FF[f]) >= 0) { fullFix = true; break; }
    return { moves: moves, fullFix: fullFix };
  }

  function macWord(macro, dir, intensity) {
    var up = dir > 0;
    var deg = (intensity && intensity <= 0.7) ? "lightly " : (intensity && intensity >= 1.4) ? "really " : "";
    switch (macro) {
      case "bright": return up ? deg + "brought up the air & presence" : deg + "eased the brightness back";
      case "warm":   return up ? deg + "added low-end body & warmth" : deg + "trimmed some low-end weight";
      case "smooth": return up ? deg + "tightened it with compression (more glue)" : deg + "eased the compression back";
      case "deess":  return deg + "tamed the harsh sibilance";
      case "demud":  return deg + "cleaned out the boxy low-mids";
      case "tight":  return deg + "high-passed the low rumble (tighter low end)";
      case "space":  return up ? deg + "opened up the space (reverb)" : deg + "pulled the space back in (drier, closer)";
      case "throw":  return up ? deg + "added a slap throw" : deg + "pulled the throw back";
    }
    return "adjusted it";
  }

  // build the Doctor state QUIETLY (no per-stem panel popping). Falls back to the full Doctor.
  async function ensureDoctor(t) {
    if (t._doctor) return true;
    var buf = t.buffer || (t.clips && t.clips[0] && t.clips[0].buffer); if (!buf) return false;
    if (typeof vdPlan === "function" && typeof vdBuildChain === "function" && typeof VDOC_MACROS !== "undefined" && typeof measure === "function") {
      try {
        var m = await measure(buf); if (!m || !m.ok) throw 0;
        var f = m.features, det = (typeof detectType === "function" ? detectType(f) : { type: "vocal" }), plan = vdPlan(f);
        vdBuildChain(t, plan);
        var base = { space: plan.space };
        VDOC_MACROS.forEach(function (mac) { mac.targets.forEach(function (tg) { if (!tg.send) base[tg.ins + "." + tg.param] = (plan[tg.ins] || {})[tg.param]; }); });
        t._doctor = { features: f, det: det, base: base, macroU: {}, summary: (typeof vdSummary === "function" ? vdSummary(f, det, plan) : "") };
        if (typeof renderInserts === "function") renderInserts(t);
        return true;
      } catch (e) {}
    }
    if (typeof runVocalDoctor === "function") { try { await runVocalDoctor(t, null); } catch (e) {} return !!t._doctor; }
    return false;
  }

  function applyMacroU(t, macroId, u) {
    if (typeof VDOC_MACROS === "undefined" || typeof vdApplyMacro !== "function") return false;
    var mac = VDOC_MACROS.filter(function (m) { return m.id === macroId; })[0]; if (!mac) return false;
    try { vdApplyMacro(t, mac, u); return true; } catch (e) { return false; }
  }

  // RECEIPTS — proof, not a claim. Render the stem THROUGH its current chain (renderBounce) and
  //   re-measure, then report the REAL change vs the raw take (band levels are taken RELATIVE to
  //   overall RMS so makeup gain can't fake a "brighter"). This is how she can never lie about what
  //   she did — the numbers come from the actual processed audio. Best-effort: "" if it can't render.
  function _rel(f, band) { return (f && f.bandDb && isFinite(f.bandDb[band]) && isFinite(f.rmsDb)) ? (f.bandDb[band] - f.rmsDb) : null; }
  async function receipts(t) {
    try {
      if (typeof renderBounce !== "function" || typeof measure !== "function" || !t._doctor || !t._doctor.features) return "";
      var dry = t._doctor.features;
      var end = (typeof _trackEnd === "function") ? _trackEnd(t) : (t.buffer ? t.buffer.duration : 0);
      if (!end || end < 0.05) return "";
      var rendered = await renderBounce({ source: "track:" + t.id, startT: 0, endT: end, tap: "post" });
      var m = await measure(rendered); if (!m || !m.ok || !m.features) return "";
      var wet = m.features, out = [];
      var dAir = (_rel(wet, "air") != null && _rel(dry, "air") != null) ? _rel(wet, "air") - _rel(dry, "air") : null;
      if (dAir != null && Math.abs(dAir) >= 0.4) out.push("air " + (dAir > 0 ? "+" : "") + dAir.toFixed(1) + " dB");
      var dLow = (_rel(wet, "low") != null && _rel(dry, "low") != null) ? _rel(wet, "low") - _rel(dry, "low") : null;
      if (dLow != null && Math.abs(dLow) >= 0.4) out.push("low-end " + (dLow > 0 ? "+" : "") + dLow.toFixed(1) + " dB");
      if (isFinite(wet.sibRatio) && isFinite(dry.sibRatio) && dry.sibRatio > 0.02) { var ds = (wet.sibRatio - dry.sibRatio) / dry.sibRatio * 100; if (Math.abs(ds) >= 5) out.push("harshness " + (ds > 0 ? "+" : "") + Math.round(ds) + "%"); }
      if (isFinite(wet.crestDb) && isFinite(dry.crestDb)) { var dc = wet.crestDb - dry.crestDb; if (Math.abs(dc) >= 0.6) out.push("dynamics " + (dc > 0 ? "+" : "") + dc.toFixed(1) + " dB crest"); }
      if (isFinite(wet.rmsDb) && isFinite(dry.rmsDb)) { var dr = wet.rmsDb - dry.rmsDb; if (Math.abs(dr) >= 0.5) out.push("level " + (dr > 0 ? "+" : "") + dr.toFixed(1) + " dB"); }
      return out.join(", ");
    } catch (e) { return ""; }
  }
  async function applyMovesToTrack(t, parsed, style) {
    if (!t.buffer && !(t.clips && t.clips[0] && t.clips[0].buffer)) return { name: t.name, blank: true };
    var ok = await ensureDoctor(t);
    if (!ok) return { name: t.name, fail: true };
    var done = [];
    parsed.moves.forEach(function (mv) {
      // INTENSITY: distance from neutral (0.5) scales by how hard they asked ("a touch" → 0.55× … "way" → 1.6×).
      var dist = mv.dir > 0 ? 0.20 : 0.18;
      var u = clampU(0.5 + (mv.dir > 0 ? 1 : -1) * dist * (mv.intensity || 1));
      if (style && style.bias && typeof style.bias[mv.macro] === "number") u = clampU(u + style.bias[mv.macro] * (mv.dir > 0 ? 1 : -1));   // TASTE bias
      if (applyMacroU(t, mv.macro, u)) done.push(macWord(mv.macro, mv.dir, mv.intensity));
    });
    if (!done.length && parsed.fullFix) {
      if (style && style.sig) { style.sig.forEach(function (sg) { applyMacroU(t, sg.macro, sg.u); }); done.push("readied your full chain + put my own finish on it"); }
      else done.push("readied your full vocal chain — EQ, de-ess, comp, saturation, slap + a touch of verb");
    }
    try { if (typeof applyTrack === "function") applyTrack(t); } catch (e) {}
    try { if (typeof renderInserts === "function") renderInserts(t); } catch (e) {}
    try { if (typeof renderMixWindow === "function") renderMixWindow(); } catch (e) {}
    try { if (typeof playing !== "undefined" && playing && typeof restartPlayback === "function") restartPlayback(); } catch (e) {}
    var rcp = done.length ? await receipts(t) : "";          // PROOF — measured, not claimed
    return { name: t.name, done: done, receipts: rcp };
  }

  function buildReply(results, flair) {
    var ok = results.filter(function (r) { return r && r.done && r.done.length; });
    var blanks = results.filter(function (r) { return r && r.blank; });
    var fails = results.filter(function (r) { return r && r.fail; });
    var lines = [];
    if (ok.length) lines.push(ok.map(function (r) { return "**" + r.name + "** — " + r.done.join(", ") + (r.receipts ? "\n  ↳ _measured vs your raw take: " + r.receipts + "_" : ""); }).join("\n"));
    if (blanks.length) { var bn = blanks.map(function (r) { return r.name; }); lines.push(bn.join(", ") + (bn.length > 1 ? " are" : " is") + " empty — drop something on " + (bn.length > 1 ? "them" : "it") + " first, or tell me what to build."); }
    if (fails.length) lines.push("Couldn't read " + fails.map(function (r) { return r.name; }).join(", ") + " clearly.");
    if (!ok.length && !blanks.length && !fails.length) return "I'm parented but didn't catch a move there — try “a touch brighter”, “warmer”, “more punch”, “less harsh”, “de-mud it”, “tighten the lows”, “way more space”, or “fix it”.";
    if (ok.length) lines.push("\nHave a listen 🎧 — it's all clamped to a safe range, nothing's wrecked. Want more or less?");
    if (ok.length && flair) lines.push("_" + flair + "_");
    return lines.join("\n");
  }

  // ── SESSION-WIDE commands (the agent works the WHOLE mix, like Mixstein — but on our own DAW + honest) ──
  function _ssHeadroom(s) {
    var map = { one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,twelve:12 };
    var m = s.replace(/negative\s+([a-z]+)/g, function(_,w){ return " -"+(map[w]!=null?map[w]:w)+" "; })
             .replace(/minus\s+([a-z0-9]+)/g, function(_,w){ return " -"+(map[w]!=null?map[w]:w)+" "; });
    var nums=[], re=/-?\d+(?:\.\d+)?/g, x; while((x=re.exec(m))){ var n=parseFloat(x[0]); if(n<=0 && n>=-30) nums.push(n); }
    if (nums.length>=2) return { hi:Math.min(nums[0],nums[1]), lo:Math.max(nums[0],nums[1]) };
    if (nums.length===1) return { hi:nums[0]-1.5, lo:nums[0]+1.5 };
    return { hi:-6, lo:-3 };
  }
  function _ssGainReply(r) {
    if (!r || !r.ok) return (r&&r.msg) || "Couldn't gain-stage that.";
    var lines = ["**Gain-staged "+r.count+" of "+r.total+" track"+(r.total>1?"s":"")+"** — trimmed the input on each (faders stay at unity, like a Utility first)."];
    if (r.masterPeak!=null) lines.push("  ↳ _master now peaks at "+r.masterPeak+" dB"+(r.corrected?" (after one corrective pass)":"")+" — you asked for "+r.floor+" to "+r.ceil+" dB of headroom._");
    if (r.skipped&&r.skipped.length) lines.push("Couldn't read: "+r.skipped.join(", ")+".");
    lines.push("\nClean headroom to mix into now. 🎚️");
    return lines.join("\n");
  }
  function _ssRecipeReply(r) {
    if (!r || !r.ok) return (r&&r.msg) || "Couldn't apply that recipe.";
    var lines = ["**"+r.recipe+"** — "+(r.note||"")+"."];
    var byRole = {};
    (r.applied||[]).forEach(function(a){ if(a.moves&&a.moves.length){ (byRole[a.role]=byRole[a.role]||[]).push(a.name+" ("+a.moves.join(" + ")+")"); } });
    Object.keys(byRole).forEach(function(role){ lines.push("• **"+role+"** → "+byRole[role].join(", ")); });
    if (r.skipped&&r.skipped.length) { var sk=r.skipped.map(function(s){ return s.name+(s.why?" ("+s.why+")":""); }); lines.push("_Left alone: "+sk.join(", ")+"._"); }
    lines.push("\nDressed "+r.count+" track"+(r.count!==1?"s":"")+" — some on the track, reverb routed to the bus. AB it; too subtle? tell me to push it. 🎛️");
    return lines.join("\n");
  }
  function _ssVocalReply(kind, r){
    if(!r || !r.ok) return (r&&r.msg) || "Couldn't do that — select a vocal clip first.";
    if(kind==='harmony') return "**Harmonies up** — added "+(r.voices||[]).join(" + ")+" off “"+r.src+"”, panned out and tucked under the lead on their own tracks. Mute any you don't want. 🎶";
    if(kind==='choir')   return "**Choir stacked** — "+r.voices+" detuned voices spread across the stereo field (+ octaves for body) into one Choir track, from “"+r.src+"”. 🎼";
    if(kind==='vocoder') return "**Vocal → instrument** — ran “"+r.src+"” through a "+r.bands+"-band vocoder onto a new “Vocal Synth” track. Your voice plays the synth now. 🤖🎹";
    return "Done.";
  }
  function _ssTrickReply(kind, r){
    if(!r || !r.ok) return (r&&r.msg) || "Couldn't do that.";
    if(kind==='pultec')   return "**Pultec punch on the master** — +"+r.boost+" dB shelf at "+r.freq+" Hz with a -"+r.scoop+" dB scoop just above. Fat low end, no mud. 🔊";
    if(kind==='parallel') return "**Parallel saturation** — spun up a “"+r.bus+"” (HPF → drive) and sent "+(r.targets||[]).join(", ")+" into it pre-fader. Blend it under the dry with the aux fader. 🔥";
    if(kind==='pump')     return "**Sidechain pump** — ducked **"+r.track+"** with the beat ("+r.bpm+" BPM) so it breathes around the kick, clearing the low end. 🫷";
    return "Done.";
  }
  function _ssCreativeReply(kind, r){
    if(!r || !r.ok) return (r&&r.msg) || "Couldn't do that — select a clip first.";
    if(kind==='stutter') return "**Stutter** — beat-repeated “"+r.clip+"” ("+r.reps+"× accelerating) into the downbeat. 🔫";
    if(kind==='drop')    return "**Build to a drop** — swept “"+r.clip+"” down with a rising riser and a breath of silence right before the 1. Drop your beat after it. 💥";
    return "Done.";
  }
  function _ssSfxReply(r){
    if(!r || !r.ok) return (r&&r.msg) || "SFX failed.";
    return "**Sound dropped** — generated “"+r.prompt+"” ("+r.dur+"s) onto a new track at the playhead. 🔊";
  }

  // the entry point kit-helper's ask() calls. Returns {handled, reply}. handled:false → let the brain answer.
  window.DMV_DOCK_FIX = async function (text, agentId) {
    try {
      var t2 = (text || "").toLowerCase();
      // Session-wide passes first — these work the WHOLE mix, even with nothing parented (studio only).
      if (typeof window.studioGainStage === "function" && /(gain[ -]?stage|gainstage|stage (the|this|my|it|everything|all|session)|set (the )?levels?\b|headroom|level (everything|it all|the session))/.test(t2)) {
        return { handled: true, reply: _ssGainReply(await window.studioGainStage(_ssHeadroom(t2))) };
      }
      if (typeof window.studioRecipe === "function" && /(recipe|dimension|nineties|90's|\b90s\b|boom[ -]?bap|\bglue\b|\bvibe\b|dress (the|it|this)|fill (the|in)\b|make (it|the mix|this) (wider|bigger|spacious|lush|huge|wide))/.test(t2)) {
        return { handled: true, reply: _ssRecipeReply(await window.studioRecipe(text)) };
      }
      // AI-vocal (selected clip) — harmony / choir / vocal→instrument
      if (typeof window.studioVocoder === "function" && /(vocod|talk ?box|robot voice|turn (my |the )?(voice|vocal) into|(voice|vocal) (in)?to (an? )?(instrument|synth)|synth(esize|esise)? (my |the )?(voice|vocal))/.test(t2)) {
        return { handled: true, reply: _ssVocalReply('vocoder', await window.studioVocoder()) };
      }
      if (typeof window.studioChoir === "function" && /(choir|gang vocal|ensemble of|stack (a )?choir|\bvocal stack\b)/.test(t2)) {
        return { handled: true, reply: _ssVocalReply('choir', window.studioChoir()) };
      }
      if (typeof window.studioHarmonize === "function" && /(harmoni|harmony|backing vocal|stack (a |some )?harmon|third and fifth)/.test(t2)) {
        var hset = /thick|big|wall|stack/.test(t2)?'thick' : /octave|8va/.test(t2)?'octave' : /minor/.test(t2)?'minor' : /major|triad|third|3rd/.test(t2)?'triad' : 'safe';
        return { handled: true, reply: _ssVocalReply('harmony', window.studioHarmonize(hset)) };
      }
      // Mixing-trick moves
      if (typeof window.studioPultec === "function" && /(pultec|low.?end punch|thicken (the )?(low|bottom|master)|fatten (the )?(low|bottom|master)|punch (the )?(master|low|bottom))/.test(t2)) {
        return { handled: true, reply: _ssTrickReply('pultec', window.studioPultec()) };
      }
      if (typeof window.studioParallel === "function" && /(parallel[ -]?sat|parallel satur|p-sat|smash (the )?(room|drum|drums)|crush (the )?(room|drum|drums)|distort (the )?(room|drum))/.test(t2)) {
        return { handled: true, reply: _ssTrickReply('parallel', window.studioParallel(/drum|room/.test(t2)?'drum':'vocal')) };
      }
      if (typeof window.studioPump === "function" && /(side ?chain|duck (the )?bass|pump (the )?bass|bass under the kick|duck it (to|under) the kick)/.test(t2)) {
        return { handled: true, reply: _ssTrickReply('pump', window.studioPump()) };
      }
      // Creative FX (selected clip)
      if (typeof window.studioDrop === "function" && /(build (a |to a |it to a |into the )?(drop|up)|build[ -]?up|drop build|riser into|build into (a|the) (drop|chorus))/.test(t2)) {
        return { handled: true, reply: _ssCreativeReply('drop', await window.studioDrop()) };
      }
      if (typeof window.studioStutter === "function" && /(stutter|beat ?repeat|glitch (it|this|the)|machine ?gun|chop .* (drop|into))/.test(t2)) {
        return { handled: true, reply: _ssCreativeReply('stutter', window.studioStutter()) };
      }
      // AI sound-FX (ElevenLabs, BYO-key) — generate a sound and drop it on the timeline
      if (typeof window.studioGenSfx === "function" && /(\bsfx\b|sound ?effect|drop (a |an |some )?(whoosh|riser|braam|boom|impact|sub ?drop|downlifter|foley|crackle|swoosh|stab|laser|zap|sweep)|generate (a |an |some )?(sound|whoosh|riser|braam|impact|foley)|make (a |an |me a )?(whoosh|riser|braam|boom|impact|sound ?effect))/.test(t2)) {
        var sfxP = (text||"").replace(/^.*?\b(sfx|sound ?effects?|drop|generate|make|create|add|give me|i want)\b[:\s]*(a |an |some |me a |me an )?/i, "").trim() || (text||"");
        return { handled: true, reply: _ssSfxReply(await window.studioGenSfx(sfxP)) };
      }
      var ids = parented(); if (!ids.length) return { handled: false };
      var parsed = parseIntent(text || "");
      if (!parsed.moves.length && !parsed.fullFix) return { handled: false };   // not a fix command → brain answers
      var style = STYLE[agentId] || null;
      var results = [];
      for (var i = 0; i < ids.length; i++) { var t = trackById(ids[i]); if (t) results.push(await applyMovesToTrack(t, parsed, style)); }
      return { handled: true, reply: buildReply(results, style && style.flair) };
    } catch (e) { return { handled: false }; }
  };

  try { console.info("[DMV] agent parenting + Phase-1 fix engine ready — snap stems, then tell her “brighter / fix it”."); } catch (e) {}
})();
