/* help.js — the quiet in-room guide.

   A small "?" sits in the corner of every room. It NEVER auto-opens, never nags.
   Tap it and a slim panel slides in from the right with JUST this room's how-to —
   the room stays fully usable behind it (no blocking backdrop). Tap × or hit Esc to
   close. That's the whole thing. Content is per-room, distilled from GUIDE.md, baked
   in so it works offline. Loaded app-wide by pinkroom-nav.js. */
(function () {
  "use strict";
  if (window.__dmvHelp) return;
  if (window.self !== window.top) return;          // not inside an embedded-plugin iframe
  window.__dmvHelp = true;

  var slug = (location.pathname.split("/").pop() || "index").replace(/\.html?$/i, "").toLowerCase() || "index";

  var HELP = {
    index: { t: "Main hub & chat", e: "🏠", d: "Talk to your agents, jump to any room, and keep your memory + sessions.", s: [
      "Type to chat with Tiff or Kit — ➤ or Enter to send (Shift+Enter = new line).",
      "Switch who you're talking to with the agent buttons up top; pick the brain with the model dropdown.",
      "＋ attaches images, audio, PDFs, code — the agent reads them.",
      "Drag the effort lever right for deeper thinking (🔱 God mode lights up on Claude).",
      "Left sidebar = your past chats; the memory rail = what it remembers about you." ] },
    studio: { t: "DeMartin Audio Labs", e: "🎚️", d: "The DAW — record, edit, mix, master, then bounce.", s: [
      "Record a take or drag audio in — each becomes its own track (stem).",
      "Tools: Grabber moves clips, Trimmer resizes, Smart Tool does both; grab top corners for fades, the dB badge for clip volume.",
      "Click a track to open its mixer strip; add plugins in the empty insert slots.",
      "Dock an agent with the 🎙 button on a track, then say \"brighter\", \"warmer\", \"add harmonies\", or \"fix it\".",
      "Export WAV from the File menu — the master, one stem, or your selection." ] },
    beats: { t: "Leon Production Labs", e: "🥁", d: "Make beats — by hand or by command.", s: [
      "Hit 🍳 Cook and describe a vibe (\"trap at 140\", \"lo-fi boom-bap\") — it builds the whole beat, in key.",
      "Or build by hand: click steps in the Channel Rack, draw notes in the Piano Roll.",
      "Drag BPM / Swing; lock the key with 🔒. Use Add ▸ to bring in instruments.",
      "Turn your voice into an instrument, or generate melodies/chords with ✨.",
      "Export WAV / stems / MIDI, or ⤓ Send to Studio." ] },
    editor: { t: "LePrince Visual Labs", e: "🎬", d: "Edit video + visuals, After-Effects style.", s: [
      "＋ or drag in video/images, then drag clips onto the timeline.",
      "Select a clip → the Inspector (right) sets position, scale, opacity.",
      "Effect menu adds effects; Animation ▸ Add Keyframe to animate anything.",
      "Pen / Mask tools + Content-Aware Fill mask or remove objects.",
      "▶ Export (top-right) renders your MP4." ] },
    images: { t: "Imagination Station — local", e: "🎨", d: "Generate images free on your own GPU.", s: [
      "Write a prompt (or ✨ Polish to sharpen it), pick a mode + size.",
      "Modes: DRAFT (fast), PHOTO (realistic), Z-IMAGE (fast realistic), EDIT (change a photo).",
      "Attach a reference image to remix or instruction-edit it.",
      "✦ Generate. Remix or re-roll any result from the gallery.",
      "Tap 🧹 free memory when you're done so the machine doesn't lag." ] },
    "imagine-cloud": { t: "Imagination Station — cloud", e: "🎨", d: "Premium image + video gen on your own key.", s: [
      "Save your Atlas key once (encrypted, stays on your machine).",
      "Pick IMAGE or VIDEO, a model, and the options (aspect, duration…).",
      "Write your prompt; attach a reference for image-to-image / image-to-video.",
      "✦ Generate — up to 4 images at once.",
      "Heads up: images cost pennies; video genuinely costs money." ] },
    character: { t: "Agent Forge", e: "🧬", d: "Build + train your own AI agent.", s: [
      "Name your agent and give it a face (pixel, photo, or a color).",
      "Pick its craft (that sets its home room) and its voice.",
      "Add notes on how you work; optionally train it (Watch / Feed / Work).",
      "The readiness bar fills as you build it + train it on your real moves.",
      "Save + Take to drop it into its room." ] },
    build: { t: "Berner Builder", e: "🛠️", d: "Describe an app or audio plugin → it builds it.", s: [
      "Describe what you want, then Talk (discuss) or Build (make it).",
      "Toggle 🌐 App vs 🎛 Plugin up top.",
      "📎 attach reference images or video.",
      "View menu = Preview / Code / Console; Auto-fix patches runtime errors.",
      "File ▸ Save (apps → Your Builds; plugins get sent to the Studio)." ] },
    stream: { t: "The Stream", e: "📡", d: "Publish + listen/watch. You keep 100%.", s: [
      "NOTIFI = music, CRATEL = video — switch with the tabs up top.",
      "Click anything to play; search + sort on the left.",
      "+ Publish: drop a file, add a title + creator, optional cover + payout link.",
      "Your payout link (Cash App / PayPal / Ko-fi) takes you 100% — no middleman.",
      "The settings chip sets your name + Local / Shared mode." ] },
    market: { t: "Marketplace", e: "🏪", d: "Browse + deploy agents (\"skills\").", s: [
      "Browse every skill by craft using the chips at the top.",
      "Search by name; filter by which room it deploys to.",
      "Open a skill in a room, or drag its card onto a deploy target." ] },
    swarm: { t: "Research Swarm", e: "🛰", d: "Borrow brains — ask many LLMs at once.", s: [
      "Add LLM providers with your own free keys (+ Add provider).",
      "Pick a local model to merge with, then type a research question.",
      "🛰 Run swarm — it asks all of them in parallel and merges one answer + sources." ] },
    wall: { t: "The Wall", e: "🧱", d: "Sign your mark — it lives here forever.", s: [
      "Sign the Wall: claim a rectangular spot, then draw your mark in the pad.",
      "Pick a color + brush size; add an @tag so people can find you.",
      "Place it on the wall — it's saved for good." ] },
  };

  var info = HELP[slug] || { t: "DeMartinville", e: "✨", d: "Part of your creative studio.", s: [
    "Tap \"Summon agent\" and just ask — Tiff or Kit knows this room inside out." ] };

  // ---- styles ----
  var css =
    "#dmvHelpBtn{position:fixed;left:14px;top:10px;width:34px;height:34px;border-radius:50%;z-index:2147482000;" +
      "display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5;transition:opacity .15s,border-color .15s,transform .12s;" +
      "background:linear-gradient(180deg,rgba(42,46,54,.92),rgba(20,22,28,.94));border:1px solid rgba(255,255,255,.16);" +
      "color:rgba(220,224,230,.92);font:600 16px Oxanium,system-ui,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.4);" +
      "-webkit-app-region:no-drag;user-select:none}" +
    "#dmvHelpBtn:hover{opacity:1;border-color:rgba(230,184,106,.7);transform:translateY(-1px)}" +
    /* in the shared top bar (next to Feedback) — out of the canvas/timeline entirely */
    "#dmvHelpBtn.in-bar{position:static;left:auto;top:auto;width:auto;height:34px;border-radius:10px;padding:0 12px;margin-left:6px;opacity:.85;box-shadow:none}" +
    "#dmvHelpPanel{position:fixed;top:0;right:0;bottom:0;width:360px;max-width:86vw;z-index:2147482001;" +
      "background:rgba(14,15,18,.97);border-left:1px solid rgba(255,255,255,.1);box-shadow:-12px 0 40px rgba(0,0,0,.5);" +
      "transform:translateX(102%);transition:transform .26s cubic-bezier(.4,0,.2,1);" +
      "display:flex;flex-direction:column;color:#cfd2d8;font:14px/1.55 system-ui,sans-serif;backdrop-filter:blur(4px)}" +
    "#dmvHelpPanel.open{transform:translateX(0)}" +
    "#dmvHelpPanel .hd{display:flex;align-items:center;gap:10px;padding:18px 18px 12px;border-bottom:1px solid rgba(255,255,255,.07)}" +
    "#dmvHelpPanel .hd .em{font-size:22px;line-height:1}" +
    "#dmvHelpPanel .hd h3{margin:0;font:600 16px Oxanium,system-ui,sans-serif;color:#e6e8ec;flex:1}" +
    "#dmvHelpPanel .x{cursor:pointer;background:none;border:none;color:rgba(220,224,230,.6);font-size:20px;line-height:1;padding:2px 6px;border-radius:6px}" +
    "#dmvHelpPanel .x:hover{color:#fff;background:rgba(255,255,255,.08)}" +
    "#dmvHelpPanel .bd{padding:14px 18px 20px;overflow-y:auto}" +
    "#dmvHelpPanel .lead{color:#9aa0a8;margin:0 0 16px;font-size:13.5px}" +
    "#dmvHelpPanel ol{margin:0;padding:0;list-style:none;counter-reset:hs}" +
    "#dmvHelpPanel li{counter-increment:hs;position:relative;padding:0 0 14px 30px;margin:0}" +
    "#dmvHelpPanel li:before{content:counter(hs);position:absolute;left:0;top:-1px;width:20px;height:20px;border-radius:50%;" +
      "background:rgba(230,184,106,.16);border:1px solid rgba(230,184,106,.4);color:#E6B86A;font:600 11px Oxanium,sans-serif;" +
      "display:flex;align-items:center;justify-content:center}" +
    "#dmvHelpPanel .ft{margin-top:6px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);color:#7d828a;font-size:12.5px}";

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  function mount() {
    if (document.getElementById("dmvHelpBtn")) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    var btn = el("button"); btn.id = "dmvHelpBtn"; btn.type = "button"; btn.textContent = "?";
    btn.title = "Quick guide for this room"; btn.setAttribute("aria-label", "Open the quick guide for this room");

    var panel = el("div"); panel.id = "dmvHelpPanel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", info.t + " guide");
    var steps = "<ol>" + info.s.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>";
    panel.innerHTML =
      "<div class='hd'><span class='em'>" + info.e + "</span><h3>" + esc(info.t) + "</h3>" +
      "<button class='x' type='button' aria-label='Close'>&times;</button></div>" +
      "<div class='bd'><p class='lead'>" + esc(info.d) + "</p>" + steps +
      "<div class='ft'>Want more? Tap <b>Summon agent</b> and just ask — the agent knows this room inside out.</div></div>";

    function open() { panel.classList.add("open"); }
    function close() { panel.classList.remove("open"); }
    function toggle() { panel.classList.contains("open") ? close() : open(); }

    btn.addEventListener("click", toggle);
    panel.querySelector(".x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    // Mount the "?" into the shared top bar (the SAME mount the Feedback button uses) so it lives
    // UP TOP, out of the canvas / timeline — never floating over your work. Pages with no bar fall
    // back to a small top-corner button (never bottom, never over content).
    var bar = document.querySelector(".kit-mount, .top");
    if (bar) { btn.classList.add("in-bar"); bar.appendChild(btn); }
    else { document.body.appendChild(btn); }
    document.body.appendChild(panel);
    window.dmvHelp = { open: open, close: close, toggle: toggle };
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
