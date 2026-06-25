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
    studio: "DeMartin Audio Labs", beats: "The Kitchen", build: "Blueprint Builds",
    editor: "LePrince Visual Labs", images: "Imagination Station", "imagine-cloud": "Imagination Station",
    draw: "Sketch Pad", character: "Agent Forge",
  };
  let room = null;
  for (const k in ROOMS) { if (path.includes(k + ".html")) { room = k; break; } }
  if (!room) return;                 // chat / non-room → no roster
  // ── a character is only in a room if you DRAGGED them in from the front page:
  //    ?brain=kit|tiff for the two built-ins, or ?char=ID for a user-built one. No param →
  //    nothing mounts here at all; rooms have NO helper until you bring someone in. ──
  let broughtId = null;
  try {
    const sp = new URLSearchParams(location.search);
    const brain = (sp.get("brain") || "").toLowerCase();
    if (brain === "kit" || brain === "tiff") broughtId = brain;
    else { const cid = sp.get("char"); if (cid) broughtId = cid; }
  } catch (_) {}
  // remembered from a previous room/page (so a dragged-in agent rides the local→cloud switch + room hops).
  // The Agent Forge stays CLEAN until you hit "Start here" — so don't auto-restore an agent there.
  if (!broughtId && room !== "character") { try { broughtId = localStorage.getItem("dmv_active_brain") || null; } catch (_) {} }
  if (!broughtId) return;            // nobody dragged in (and none remembered) → this room stays empty
  window.__kit = true;

  // ── the two built-in helpers, and the ONLY pre-made characters: Kit (the in-room build-bot)
  //    and Tiff (the creative partner). Everyone else in the roster is a REAL character a human
  //    builds for themselves — we never ship invented people. ──
  const CHARACTERS_BUILTIN = [
    { id: "kit",  name: "Kit",  tag: "creative partner · build", color: "#7BB6CD", sprite: true,
      intro: r => `Yo — I'm Kit. I know my way around ${r}. Stuck on anything? Ask me and I'll walk you through it.` },
    { id: "tiff", name: "Tiff", tag: "your creative partner",  color: "#E58FB5",
      intro: r => r === "Agent Forge"
        ? `Hey — welcome! First time forging an agent? Here's the cool part: I'm one, so this is a live demo of how it works. Tell me what you do and I'll walk you through the whole thing — you talk, I do the rest. (Or just fill it in yourself below.) Want me to run you through it?`
        : `Hey — it's Tiff. I usually live up in the main chat, but I'm here in ${r} too. Talk to me about the song, the vision, the words — the creative side of what you're making.` },
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
      id: c.id, name: c.name || "Agent", tag: c.tagline || c.craftLabel || "",
      color: c.color || "#7BB6CD", avatar: c.avatar || "", avatarType: c.avatarType || "color", mine: true,
      persona: c.persona || "", knowledge: c.knowledge || "",
      craft: c.craft || "", craftLabel: c.craftLabel || "",
      readiness: typeof c.readiness === "number" ? c.readiness : 0,
      intro: r => `${c.name || "I'm in"} — ${c.craftLabel || "your agent"} in ${r}. ${c.tagline || "Let's get to work."}`,
    }));
  }
  function rebuildCharacters() { return CHARACTERS_BUILTIN.concat(loadMine()); }

  const css = `
  /* PASSIVE presence chip — a small green "online" dot + the agent's name. NOT a button (no hover lift). */
  .kit-fab { position:fixed; right:18px; bottom:18px; z-index:9996; display:flex; align-items:center; gap:7px;
    height:30px; padding:0 12px; border-radius:15px; cursor:default; border:1px solid rgba(255,255,255,.12);
    background:linear-gradient(180deg,rgba(42,46,54,.92),rgba(22,24,30,.92)); color:#CFE6EE;
    font:700 11px Oxanium,sans-serif; letter-spacing:.05em; box-shadow:0 4px 14px rgba(0,0,0,.4); }
  .kit-fab.in-bar { position:static; height:24px; border-radius:13px; padding:0 11px; margin-left:6px; flex:none; box-shadow:none; background:rgba(255,255,255,.04); }
  .fab-dot { width:8px; height:8px; border-radius:50%; flex:none; background:#39D98A; box-shadow:0 0 6px rgba(57,217,138,.85); animation:fabpulse 2.4s ease-in-out infinite; }
  @keyframes fabpulse { 0%,100%{ box-shadow:0 0 5px rgba(57,217,138,.55);} 50%{ box-shadow:0 0 9px rgba(57,217,138,.95);} }
  .fab-lbl { line-height:1; }
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
  img.kit-av, img.cav { object-fit:cover; display:block; }
  .kit-av.px, .cav.px { image-rendering:pixelated; }
  .kit-t { font:700 14px Oxanium; letter-spacing:.1em; color:#E4F1F5; line-height:1; }
  .kit-s { font:500 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(198,201,208,.5); display:block; margin-top:3px; }
  .kit-x { margin-left:auto; background:rgba(0,0,0,.28); border:none; color:#9FCFDD; width:22px; height:22px; border-radius:6px; cursor:pointer; font-size:12px; }
  .kit-x:hover { background:rgba(62,156,184,.3); color:#fff; }
  /* the roster strip — the cast you can drag into the room */
  .kit-roster { display:flex; gap:6px; overflow-x:auto; padding:6px 10px 5px; border-bottom:1px solid rgba(255,255,255,.06); background:rgba(0,0,0,.18); }
  .kit-roster::-webkit-scrollbar { height:0; }
  .kit-chip { flex:none; display:flex; align-items:center; gap:6px; padding:4px 9px 4px 4px; border-radius:20px; cursor:grab;
    border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.03); transition:border-color .12s, background .12s, transform .1s; }
  .kit-chip:hover { border-color:rgba(120,182,205,.6); transform:translateY(-1px); }
  .kit-chip.on { border-color:rgba(120,182,205,.85); background:rgba(62,156,184,.16); }
  .kit-chip.drag { opacity:.5; }
  .kit-chip .cav { width:20px; height:20px; border-radius:50%; flex:none; display:grid; place-items:center; font:800 9.5px Oxanium; color:#10131a; }
  .kit-chip .cn { font:700 10.5px Oxanium; letter-spacing:.04em; color:#DCE6EA; white-space:nowrap; }
  .kit-chip .cp { font:700 7px 'Space Mono'; letter-spacing:.1em; color:#E6C16A; margin-left:2px; }
  .kit-chip.mine .cp { color:#7FD3B0; }
  .kit-chip-build { cursor:pointer; border-style:dashed; border-color:rgba(120,182,205,.4); padding:4px 11px; }
  .kit-chip-build:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.12); }
  .kit-chip-build .cn { color:#9FCFDD; }
  .kit-hint { font:500 8.5px 'Space Mono'; letter-spacing:.08em; color:rgba(170,180,190,.45); padding:0 11px 5px; background:rgba(0,0,0,.18); }
  .room-drop { outline:2px dashed rgba(120,182,205,.0); transition:outline-color .15s; }
  .room-drop.armed { outline:2px dashed rgba(120,182,205,.8); outline-offset:-10px; }
  .drop-flash { position:fixed; z-index:9998; pointer-events:none; font:800 13px Oxanium; letter-spacing:.05em; color:#CFE6EE;
    background:rgba(20,26,32,.92); border:1px solid rgba(120,182,205,.6); border-radius:12px; padding:9px 14px; box-shadow:0 8px 24px rgba(0,0,0,.5); }
  .kit-body { flex:1; overflow-y:auto; padding:12px 13px; display:flex; flex-direction:column; gap:9px; }
  .kit-msg { font:400 12.5px Inter; line-height:1.5; padding:9px 11px; border-radius:11px; max-width:88%; white-space:pre-wrap; word-wrap:break-word; }
  .kit-msg.you { align-self:flex-end; background:rgba(62,156,184,.18); color:#DCEEF4; border:1px solid rgba(62,156,184,.3); }
  .kit-msg.kit { align-self:flex-start; background:rgba(255,255,255,.04); color:#D7DCE4; border:1px solid rgba(255,255,255,.07); }
  .kit-msg.kit b { color:#9FCFDD; }
  /* fenced copy-block inside an agent message (matches the chat): own ghost copy icon, hover-reveal */
  .kblk { position:relative; margin:7px 0; border:1px solid rgba(255,255,255,.12); border-radius:9px; background:rgba(0,0,0,.32); }
  .kblk pre { margin:0; padding:10px 34px 10px 11px; white-space:pre-wrap; word-break:break-word; font:12px 'Space Mono',ui-monospace,monospace; line-height:1.5; color:#e7e9ee; }
  .kblk-copy { position:absolute; top:5px; right:5px; display:inline-flex; align-items:center; justify-content:center; width:24px; height:20px; padding:0; background:none; border:none; border-radius:6px; color:rgba(255,255,255,.5); cursor:pointer; opacity:0; transition:opacity .15s,color .12s,background .12s; }
  .kblk:hover .kblk-copy { opacity:1; }
  .kblk-copy:hover { color:#E4F1F5; background:rgba(255,255,255,.08); }
  .kblk-copy .ic-check { display:none; color:#3FD98A; }
  .kblk-copy.done .ic-copy { display:none; } .kblk-copy.done .ic-check { display:inline; } .kblk-copy.done { color:#3FD98A; }
  .kit-msg.think { color:rgba(198,201,208,.6); font-style:italic; }
  .kit-msg.riff .riff-who { font:800 11px Oxanium; letter-spacing:.04em; }
  .kit-mic { flex:none; width:36px; height:31px; border:1px solid rgba(120,182,205,.4); border-radius:9px; cursor:pointer; background:rgba(255,255,255,.05); color:#CFE6EE; font-size:14px; }
  .kit-mic:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.16); }
  .kit-mic:disabled { opacity:.45; cursor:default; }
  .kit-mic.rec { border-color:#E0245E; background:rgba(224,36,94,.22); color:#fff; animation:kitmic 1.1s ease-in-out infinite; }
  @keyframes kitmic { 0%,100%{ box-shadow:0 0 0 0 rgba(224,36,94,.5);} 50%{ box-shadow:0 0 0 7px rgba(224,36,94,0);} }
  .kit-tier { display:flex; align-items:center; gap:5px; padding:5px 10px; border-bottom:1px solid rgba(255,255,255,.06); background:rgba(0,0,0,.12); }
  .kit-tier .kt-l { font:700 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(170,180,190,.5); margin-right:3px; }
  .kt-pill { font:700 9.5px Oxanium; letter-spacing:.04em; padding:3px 9px; border-radius:20px; cursor:pointer; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.03); color:#C6CBD3; }
  .kt-pill.on[data-tier="local"] { border-color:rgba(120,182,205,.85); background:rgba(62,156,184,.18); color:#BFE6F2; }
  .kt-pill.on[data-tier="private"] { border-color:rgba(217,164,65,.85); background:rgba(217,164,65,.2); color:#F0CE8C; }
  .kt-pill.on[data-tier="max"] { border-color:rgba(240,90,120,.9); background:rgba(240,90,120,.22); color:#FFB4C4; }
  .kt-keylink { margin-left:auto; font:700 9px 'Space Mono',monospace; letter-spacing:.06em; color:#9FCFDD; background:none; border:none; cursor:pointer; padding:3px 4px; }
  .kt-keylink:hover { color:#CFE6EE; text-decoration:underline; }
  /* BRAIN LEVER — a slider (not buttons): Local → Private → Max Drive. The fill "charges up" toward Max
     with a slow GLITCH-charging vibe (RGB-split jitter), not a fast bright pulse. */
  .kt-lever { display:flex; align-items:center; gap:7px; flex:1; }
  .kl-track { position:relative; flex:1; min-width:64px; height:7px; border-radius:99px; background:rgba(255,255,255,.1); cursor:pointer; }
  .kl-fill { position:absolute; left:0; top:0; bottom:0; width:7px; border-radius:99px;
    background:linear-gradient(90deg,#2E8FAE,#7BB6CD 45%,#3E9CB8 75%,#2E8FAE); background-size:300% 100%;
    animation:klflow 5s linear infinite; box-shadow:0 0 6px rgba(120,182,205,.38); transition:width .2s cubic-bezier(.4,0,.2,1); }
  @keyframes klflow { to { background-position:-300% 0; } }
  .kl-thumb { position:absolute; top:50%; left:0; width:14px; height:14px; border-radius:50%; transform:translate(-50%,-50%);
    background:radial-gradient(circle at 35% 30%,#fff,#CFE6EE 58%,#7BB6CD); box-shadow:0 0 0 1px rgba(0,0,0,.4),0 0 8px rgba(120,182,205,.5); cursor:grab; transition:left .2s cubic-bezier(.4,0,.2,1); }
  .kl-thumb:active { cursor:grabbing; }
  .kl-name { font:700 9px Oxanium; letter-spacing:.03em; color:#9FCFDD; min-width:50px; text-align:right; white-space:nowrap; }
  /* Private — warmer, slow glitch */
  .kt-lever.t2 .kl-fill { animation-duration:4s; background:linear-gradient(90deg,#3E9CB8,#7BB6CD 35%,#E6C16A 70%,#3E9CB8); box-shadow:0 0 9px rgba(217,164,65,.45); }
  .kt-lever.t2 .kl-thumb { animation:klglitch 3.6s steps(1,end) infinite; }
  .kt-lever.t2 .kl-name { color:#F0CE8C; }
  /* Max Drive — full-spectrum "God Particle" charge: cooler but hotter, faster glitch */
  .kt-lever.t3 .kl-fill { animation-duration:3s; background:linear-gradient(90deg,#3E9CB8,#7BB6CD 20%,#E6C16A 45%,#E94B9C 66%,#7BB6CD 86%,#3E9CB8); background-size:340% 100%; box-shadow:0 0 12px rgba(233,75,156,.5),0 0 6px rgba(230,193,106,.45); }
  .kt-lever.t3 .kl-thumb { animation:klglitch 2.3s steps(1,end) infinite; box-shadow:0 0 0 1px rgba(0,0,0,.4),0 0 13px rgba(233,75,156,.7); }
  .kt-lever.t3 .kl-name { color:#FFD9EC; text-shadow:0 0 8px rgba(233,75,156,.5); }
  /* glitch-charging: mostly still, then a quick digital RGB-split jitter — a charge surge, not a glow throb */
  @keyframes klglitch {
    0%,80%,100% { transform:translate(-50%,-50%); filter:none; }
    84% { transform:translate(calc(-50% - 1.6px),-50%); filter:drop-shadow(1.6px 0 #E94B9C) drop-shadow(-1.6px 0 #3E9CB8); }
    88% { transform:translate(calc(-50% + 1.4px),-50%); filter:none; }
    92% { transform:translate(calc(-50% - 1px),-50%); filter:drop-shadow(-1.6px 0 #E94B9C) drop-shadow(1.6px 0 #3E9CB8); }
    96% { transform:translate(-50%,-50%); filter:none; }
  }
  @media (prefers-reduced-motion: reduce) { .kl-fill, .kl-thumb { animation:none !important; } }
  /* honest dial: tiers that need a cloud key are dimmed + locked until one exists */
  .kl-lock { font-size:9px; margin-left:1px; opacity:.75; display:none; cursor:pointer; }
  .kt-lever.cloud-locked .kl-track { opacity:.5; }
  .kt-lever.cloud-locked .kl-name { color:rgba(170,180,190,.6) !important; text-shadow:none !important; }
  .kt-lever.cloud-locked .kl-lock { display:inline; }
  .kit-win.tier-private { border-color:rgba(217,164,65,.5); box-shadow:0 22px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(217,164,65,.28), 0 0 26px rgba(217,164,65,.12), inset 0 1px 0 rgba(255,255,255,.06); }
  .kit-win.tier-max { border-color:rgba(240,90,120,.6); box-shadow:0 22px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(240,90,120,.32), 0 0 36px rgba(240,90,120,.2), inset 0 1px 0 rgba(255,255,255,.06); }
  .kit-foot { display:flex; flex-direction:column; gap:7px; padding:9px 11px 11px; border-top:1px solid rgba(255,255,255,.07); }
  .kit-in { width:100%; box-sizing:border-box; resize:none; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.1); border-radius:10px;
    color:#E9EAED; font:500 12.5px Inter; padding:9px 11px; outline:none; max-height:90px; }
  .kit-in:focus { border-color:rgba(62,156,184,.55); }
  .kit-go { flex:none; width:42px; height:31px; border:none; border-radius:9px; cursor:pointer;
    background:linear-gradient(180deg,#6FC0D8,#3E9CB8); color:#08171c; font-size:15px; }
  .kit-go:disabled { opacity:.5; cursor:default; }
  .kit-up, .kit-look, .kit-more { flex:none; width:36px; height:31px; border:1px solid rgba(120,182,205,.4); border-radius:9px; cursor:pointer; background:rgba(255,255,255,.05); color:#CFE6EE; font-size:14px; }
  .kit-up:hover, .kit-look:hover, .kit-more:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.16); }
  .kit-look.busy { opacity:.5; cursor:default; }
  .kit-more { font-size:17px; line-height:1; color:#9FCFDD; }
  /* tools live on their OWN row UNDER the input — agent-agnostic (built for ANY agent the user brings in) */
  .kit-tools { display:flex; align-items:center; gap:6px; }
  .kit-tools-sp { flex:1; }   /* spacer → leaves room on the LEFT for future tools (the + menu) */
  .kit-more-menu { position:fixed; z-index:9998; min-width:154px; padding:5px; border-radius:10px; background:rgba(22,25,31,.98); border:1px solid rgba(120,182,205,.42); box-shadow:0 12px 32px rgba(0,0,0,.55); }
  .kit-more-item { padding:7px 10px; border-radius:7px; cursor:pointer; font:600 12px Inter,system-ui,sans-serif; color:#D7DCE4; white-space:nowrap; }
  .kit-more-item:hover { background:rgba(62,156,184,.22); color:#fff; }
  .kit-pic { display:none; align-items:center; gap:8px; padding:8px 11px 0; }
  .kit-pic img { max-width:84px; max-height:84px; border-radius:9px; border:1px solid rgba(120,182,205,.5); display:block; }
  .kit-picx { background:#E0245E; border:none; color:#fff; width:20px; height:20px; border-radius:50%; cursor:pointer; font-size:10px; flex:none; }
  .kit-dock { display:inline-flex; align-items:center; gap:5px; margin-left:auto; height:25px; padding:0 10px; border-radius:8px; cursor:pointer;
    border:1px solid rgba(120,182,205,.7); background:rgba(62,156,184,.22); color:#DCEFF5; font:800 9.5px Oxanium; letter-spacing:.1em;
    box-shadow:0 0 10px rgba(62,156,184,.25); animation:kitdockglow 2.4s ease-in-out infinite; }
  .kit-dock:hover { background:rgba(62,156,184,.42); border-color:rgba(140,200,220,.95); color:#fff; box-shadow:0 0 16px rgba(62,156,184,.55); }
  @keyframes kitdockglow { 0%,100%{ box-shadow:0 0 8px rgba(62,156,184,.2);} 50%{ box-shadow:0 0 15px rgba(62,156,184,.45);} }
  .kit-win:not(.docked) { resize:both; min-width:300px; min-height:300px; }   /* drag the bottom-right corner to reshape: square / rectangle / long */
  .kit-win.docked { position:static; left:auto; right:auto; top:auto; bottom:auto; width:100%; max-width:none; max-height:420px;
    margin:0 0 14px; border-radius:14px; box-shadow:0 2px 14px rgba(0,0,0,.4); animation:none; }
  .agent-dock { width:100%; }
  .agent-dock:empty { display:none; }
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
    // user characters can carry a real face image (pixel/upload) — render it; else color circle + initial
    if (ch.avatar && ch.avatarType && ch.avatarType !== "color") {
      const im = document.createElement("img");
      im.src = ch.avatar; im.alt = ch.name || "";
      im.className = (size === "chip" ? "cav" : "kit-av") + (ch.avatarType === "pixel" ? " px" : "");
      return im;
    }
    const d = document.createElement("div"); d.className = size === "chip" ? "cav" : "kit-av";
    d.style.background = `radial-gradient(circle at 35% 30%, ${ch.color}, ${ch.color}99)`;
    d.textContent = ((ch.name && ch.name[0]) || "?").toUpperCase();
    return d;
  }

  // ── window ──
  const winSpr = makeSprite(34, 3);
  const win = document.createElement("div"); win.className = "kit-win";
  win.innerHTML =
    `<div class="kit-bar"><span class="kit-host"></span><span><span class="kit-t">KIT</span><span class="kit-s">${ROOMS[room]}</span></span><button class="kit-x" title="close">✕</button></div>
     <div class="kit-roster"></div>
     <div class="kit-hint">drag an agent into the room, or tap to bring them in</div>
     <div class="kit-tier"><span class="kt-l">Brain</span><div class="kt-lever t1" id="ktLever"><span class="kl-track" id="ktTrack"><span class="kl-fill" id="ktFill"></span><span class="kl-thumb" id="ktThumb"></span></span><span class="kl-name" id="ktName">Local</span><span class="kl-lock" id="ktLock" title="Private &amp; Max Drive need a cloud key — tap 🔑">🔒</span></div><button class="kt-keylink" title="Get a cloud key — turns on Private / Max Drive">🔑 key</button></div>
     <div class="kit-body"></div>
     <div class="kit-pic"></div>
     <div class="kit-foot"><textarea class="kit-in" rows="1" placeholder="Ask, or hit 🎙 to talk…"></textarea><div class="kit-tools"><button class="kit-up" title="Show the agent an image">📎</button><button class="kit-look" title="Let the agent look at your screen">👁</button><button class="kit-more" title="More tools">+</button><span class="kit-tools-sp"></span><button class="kit-mic" title="Talk to type — press, speak, it types for you">🎙</button><button class="kit-go" title="Send">➤</button></div></div>`;
  document.body.appendChild(win);
  const hostSlot = win.querySelector(".kit-host"), titleEl = win.querySelector(".kit-t"),
        subEl = win.querySelector(".kit-s"), roster = win.querySelector(".kit-roster"),
        body = win.querySelector(".kit-body"), input = win.querySelector(".kit-in"), go = win.querySelector(".kit-go");
  // copy a fenced block (prompt/JSON) inside an agent message → swap the icon to a check
  body.addEventListener("click", function (e) {
    const b = e.target.closest && e.target.closest(".kblk-copy"); if (!b) return;
    const pre = b.parentElement.querySelector("pre"); if (!pre) return;
    const text = pre.innerText;
    try { navigator.clipboard.writeText(text); }
    catch (_) { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e2) {} ta.remove(); }
    b.classList.add("done"); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove("done"), 1600);
  });

  // ── 📎 image upload — so the agent can SEE what you show her and write the prompt from it ──
  let pendingImage = "";
  const picRow = win.querySelector(".kit-pic"), upBtn = win.querySelector(".kit-up");
  function renderPic(){
    if (!picRow) return;
    if (pendingImage){
      picRow.innerHTML = '<img src="' + pendingImage + '" alt=""><button class="kit-picx" title="remove">✕</button>';
      picRow.style.display = "flex";
      const x = picRow.querySelector(".kit-picx"); if (x) x.onclick = () => { pendingImage = ""; renderPic(); };
    } else { picRow.innerHTML = ""; picRow.style.display = "none"; }
  }
  if (upBtn) upBtn.onclick = () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return;
      const rd = new FileReader(); rd.onload = () => { pendingImage = rd.result; renderPic(); }; rd.readAsDataURL(f); };
    inp.click();
  };

  // ── 👁 LOOK — the agent's eyes: HIDE the window (snap the screen BEHIND her, she's not in her own
  //    shot), grab server-side (no browser "allow" prompt), then open the annotator to mark it up.
  //    Generic on purpose — works for WHATEVER agent the user brought in. ──
  const lookBtn = win.querySelector(".kit-look");
  if (lookBtn) lookBtn.onclick = async () => {
    if (lookBtn.classList.contains("busy")) return;
    lookBtn.classList.add("busy"); lookBtn.textContent = "…";
    const prevVis = win.style.visibility; win.style.visibility = "hidden";   // snap behind her
    await new Promise(r => setTimeout(r, 90));                               // let the hide paint before the OS grab
    let j = null;
    try {
      const r = await fetch("/api/screenshot", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      j = await r.json();
    } catch (e) { j = null; }
    win.style.visibility = prevVis;                                          // bring her back
    lookBtn.classList.remove("busy"); lookBtn.textContent = "👁";
    if (j && j.image) openAnnotator(j.image);
    else if (typeof addMsg === "function") addMsg("kit", "Couldn't grab the screen just now — you can still paste or attach a screenshot with 📎. (If you're on a cloud brain, make sure the model can see images.)");
  };

  // ── "+" MORE TOOLS — the dropdown for extra/future tools. Add an entry to MORE_TOOLS and it shows up;
  //    that's the room the slim tool row was built to leave. Agent-agnostic. ──
  const moreBtn = win.querySelector(".kit-more");
  const MORE_TOOLS = [
    { label: "📋  Copy last reply", run: () => {
        const msgs = body.querySelectorAll(".kit-msg.kit"); const last = msgs[msgs.length - 1];
        const txt = last ? (last.innerText || last.textContent || "").trim() : "";
        if (txt) { try { navigator.clipboard.writeText(txt); } catch (_) {} }
      } },
    { label: "🗑  Clear chat", run: () => { if (body) body.innerHTML = ""; } },
  ];
  let moreMenu = null;
  function closeMore() { if (moreMenu) { moreMenu.remove(); moreMenu = null; document.removeEventListener("mousedown", onMoreDown, true); } }
  function onMoreDown(e) { if (moreMenu && !moreMenu.contains(e.target) && e.target !== moreBtn) closeMore(); }
  if (moreBtn) moreBtn.onclick = () => {
    if (moreMenu) { closeMore(); return; }
    moreMenu = document.createElement("div"); moreMenu.className = "kit-more-menu";
    MORE_TOOLS.forEach(it => { const d = document.createElement("div"); d.className = "kit-more-item"; d.textContent = it.label;
      d.onclick = () => { closeMore(); try { it.run(); } catch (_) {} }; moreMenu.appendChild(d); });
    document.body.appendChild(moreMenu);
    const r = moreBtn.getBoundingClientRect();
    moreMenu.style.left = Math.max(6, r.left) + "px";
    moreMenu.style.top = (r.top - moreMenu.offsetHeight - 6) + "px";   // pop ABOVE the tool row
    setTimeout(() => document.addEventListener("mousedown", onMoreDown, true), 0);
  };

  // ── 👁 ANNOTATOR — mark up the captured shot (arrows / freehand, pick a color) to point at exactly
  //    what you're explaining, THEN send it to whoever's in the room. Self-contained; styles inject once. ──
  function openAnnotator(srcUrl) {
    document.querySelectorAll(".ka-ov").forEach(o => o.remove());   // never stack two markup editors
    if (!document.getElementById("ka-style")) {
      const s = document.createElement("style"); s.id = "ka-style";
      s.textContent =
        ".ka-ov{position:fixed;inset:0;z-index:2147483646;background:rgba(8,10,14,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}" +
        ".ka-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;background:rgba(20,25,31,.97);border:1px solid rgba(120,182,205,.35);border-radius:12px;padding:8px 12px;box-shadow:0 12px 40px rgba(0,0,0,.55)}" +
        ".ka-ttl{font:700 11px Oxanium,system-ui,sans-serif;letter-spacing:.05em;color:#CFE6EE;margin-right:6px}" +
        ".ka-tool,.ka-undo,.ka-cancel,.ka-send{font:700 12px Oxanium,system-ui,sans-serif;border-radius:8px;cursor:pointer;border:1px solid rgba(120,182,205,.4);background:rgba(255,255,255,.05);color:#CFE6EE;height:30px;padding:0 11px}" +
        ".ka-tool{width:34px;padding:0;font-size:15px}.ka-tool.on{border-color:#6FC0D8;background:rgba(62,156,184,.22);color:#fff}" +
        ".ka-tool:hover,.ka-undo:hover,.ka-cancel:hover{border-color:rgba(120,182,205,.8);background:rgba(62,156,184,.16)}" +
        ".ka-cols{display:flex;gap:5px;margin:0 4px}" +
        ".ka-col{width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;padding:0}.ka-col.on{border-color:#fff;transform:scale(1.12)}" +
        ".ka-sp{flex:1;min-width:8px}" +
        ".ka-send{border:none;background:linear-gradient(180deg,#6FC0D8,#3E9CB8);color:#08171c}" +
        ".ka-stage{max-width:94vw;max-height:78vh;overflow:auto;border-radius:10px;border:1px solid rgba(120,182,205,.3);box-shadow:0 16px 50px rgba(0,0,0,.6)}" +
        ".ka-cv{display:block;cursor:crosshair}";
      document.head.appendChild(s);
    }
    const who = (typeof active !== "undefined" && active && active.name) ? active.name : "the agent";
    const ov = document.createElement("div"); ov.className = "ka-ov";
    ov.innerHTML =
      '<div class="ka-bar"><span class="ka-ttl">Mark it up — point at what you mean</span>' +
      '<button class="ka-tool on" data-tool="arrow" title="Arrow">↗</button>' +
      '<button class="ka-tool" data-tool="pen" title="Draw freehand">✎</button>' +
      '<span class="ka-cols"><button class="ka-col on" data-col="#FF3B30" style="background:#FF3B30"></button>' +
      '<button class="ka-col" data-col="#FFD60A" style="background:#FFD60A"></button>' +
      '<button class="ka-col" data-col="#34C759" style="background:#34C759"></button>' +
      '<button class="ka-col" data-col="#0A84FF" style="background:#0A84FF"></button></span>' +
      '<button class="ka-undo" title="Undo">↶ undo</button><span class="ka-sp"></span>' +
      '<button class="ka-cancel">Cancel</button><button class="ka-send">Send to ' + who + '</button></div>' +
      '<div class="ka-stage"><canvas class="ka-cv"></canvas></div>';
    document.body.appendChild(ov);
    const cv = ov.querySelector(".ka-cv"), ctx = cv.getContext("2d");
    let tool = "arrow", color = "#FF3B30", shapes = [], drawing = null, scale = 1;
    const img = new Image();
    img.onload = () => {
      const maxW = window.innerWidth * 0.92, maxH = window.innerHeight * 0.74;
      scale = Math.min(maxW / img.width, maxH / img.height, 1);
      cv.width = img.width; cv.height = img.height;                                 // native res → crisp export
      cv.style.width = (img.width * scale) + "px"; cv.style.height = (img.height * scale) + "px";
      redraw();
    };
    img.src = srcUrl;
    function redraw() { ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0); shapes.forEach(drawShape); if (drawing) drawShape(drawing); }
    function drawShape(s) {
      ctx.strokeStyle = s.color; ctx.fillStyle = s.color; ctx.lineWidth = Math.max(3, cv.width / 350); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (s.type === "arrow") {
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
        const a = Math.atan2(s.y2 - s.y1, s.x2 - s.x1), h = Math.max(16, cv.width / 55);
        ctx.beginPath(); ctx.moveTo(s.x2, s.y2);
        ctx.lineTo(s.x2 - h * Math.cos(a - Math.PI / 7), s.y2 - h * Math.sin(a - Math.PI / 7));
        ctx.lineTo(s.x2 - h * Math.cos(a + Math.PI / 7), s.y2 - h * Math.sin(a + Math.PI / 7));
        ctx.closePath(); ctx.fill();
      } else if (s.type === "pen") { ctx.beginPath(); s.pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); }
    }
    function pos(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; }
    cv.onmousedown = e => { const p = pos(e); drawing = (tool === "arrow") ? { type:"arrow", color, x1:p.x, y1:p.y, x2:p.x, y2:p.y } : { type:"pen", color, pts:[p] }; };
    cv.onmousemove = e => { if (!drawing) return; const p = pos(e); if (drawing.type === "arrow") { drawing.x2 = p.x; drawing.y2 = p.y; } else drawing.pts.push(p); redraw(); };
    function up() { if (drawing) { shapes.push(drawing); drawing = null; redraw(); } }
    window.addEventListener("mouseup", up);
    ov.querySelectorAll(".ka-tool").forEach(b => b.onclick = () => { tool = b.dataset.tool; ov.querySelectorAll(".ka-tool").forEach(x => x.classList.toggle("on", x === b)); });
    ov.querySelectorAll(".ka-col").forEach(b => b.onclick = () => { color = b.dataset.col; ov.querySelectorAll(".ka-col").forEach(x => x.classList.toggle("on", x === b)); });
    ov.querySelector(".ka-undo").onclick = () => { shapes.pop(); redraw(); };
    function close() { window.removeEventListener("mouseup", up); ov.remove(); }
    ov.querySelector(".ka-cancel").onclick = close;
    ov.querySelector(".ka-send").onclick = () => { pendingImage = cv.toDataURL("image/jpeg", 0.85); renderPic(); close(); if (input) input.focus(); };
  }

  const KCOPY_SVG = '<svg class="ic-copy" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><svg class="ic-check" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  function fmt(t) {
    t = t || "";
    const blocks = [];
    // pull fenced ``` blocks out first → render each as its own copyable block (a prompt/JSON gets a copy button)
    t = t.replace(/```[a-zA-Z0-9]*\n?([\s\S]*?)```/g, function (m, code) { blocks.push(code.replace(/\s+$/, "")); return "B" + (blocks.length - 1) + ""; });
    t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    t = t.replace(/B(\d+)/g, function (m, i) {
      const esc = blocks[+i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return '<div class="kblk"><button class="kblk-copy" type="button" title="Copy this">' + KCOPY_SVG + '</button><pre>' + esc + '</pre></div>';
    });
    return t;
  }
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
    subEl.textContent = active.mine ? Math.round(active.readiness || 0) + "% · " + ROOMS[room]
                       : active.preview ? "PREVIEW · " + ROOMS[room] : ROOMS[room];
    if (fabLabel) fabLabel.textContent = active.name;   // passive presence chip — just the name (the green dot stays)
  }
  function setActive(ch, announce) {
    active = ch;
    try { localStorage.setItem("dmv_active_brain", ch.id); } catch (_) {}   // remember across room/page hops
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
        chip.classList.add("mine");
        const p = document.createElement("span"); p.className = "cp"; p.textContent = Math.round(ch.readiness || 0) + "%"; chip.appendChild(p);
        chip.title = (ch.tag || ch.name) + " — your agent (" + Math.round(ch.readiness || 0) + "% ready)";
      } else if (ch.preview) {
        const p = document.createElement("span"); p.className = "cp"; p.textContent = "PREVIEW"; chip.appendChild(p);
        chip.title = ch.tag + " (preview agent)";
      } else {
        chip.title = ch.tag || ch.name;
      }
      chip.onclick = () => setActive(ch, true);
      chip.addEventListener("dragstart", e => { chip.classList.add("drag"); _dragId = ch.id; try { e.dataTransfer.setData("text/plain", ch.id); e.dataTransfer.effectAllowed = "copy"; } catch (_) {} });
      chip.addEventListener("dragend", () => { chip.classList.remove("drag"); _dragId = null; document.body.classList.remove("room-drop", "armed"); rmFlash(); });
      roster.appendChild(chip);
    });
    // trailing "+ Build" chip → the character creator
    const build = document.createElement("div"); build.className = "kit-chip kit-chip-build"; build.title = "Build your own agent";
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

  // ── passive presence chip (a green "online" dot + the active agent's name) ──
  const fab = document.createElement("div"); fab.className = "kit-fab"; fab.title = "Who's in this room";
  fab.innerHTML = '<span class="fab-dot"></span><span class="fab-lbl"></span>';
  const fabLabel = fab.querySelector(".fab-lbl");
  const _bar = document.querySelector(".kit-mount") || document.querySelector(".top");
  if (_bar) { fab.classList.add("in-bar"); win.classList.add("from-bar"); _bar.appendChild(fab); } else { document.body.appendChild(fab); }
  // It is NOT a button — the single "Summon agent" button (pinkroom-nav.js) opens the window.
  win.querySelector(".kit-x").onclick = () => win.classList.remove("open");
  window.__kitOpen = () => { win.classList.add("open"); input.focus(); };   // opener used by the "Summon agent" button

  // ── DOCK — rooms with a dock slot (image / cloud) can DOCK the agent into the layout (part of the
  //    room, above the generator) instead of floating. Reversible toggle + remembered. Other rooms
  //    (no #agentDock) only ever float, so dense layouts (studio/beats/editor) are never touched. ──
  const dockSlot = document.getElementById("agentDock");
  let docked = false;
  if (dockSlot) {
    const db = document.createElement("button"); db.className = "kit-dock"; db.innerHTML = "⤵ DOCK"; db.title = "Dock me into the room (lock me into the layout)";
    win.querySelector(".kit-bar").insertBefore(db, win.querySelector(".kit-x"));
    const setDocked = (on) => {
      docked = on;
      if (on) { win.style.left = win.style.top = win.style.width = win.style.height = ""; dockSlot.appendChild(win); win.classList.add("docked", "open"); db.innerHTML = "⤴ FLOAT"; db.title = "Undock — float me again"; }
      else { document.body.appendChild(win); win.classList.remove("docked"); db.innerHTML = "⤵ DOCK"; db.title = "Dock me into the room (lock me into the layout)"; }
      try { localStorage.setItem("dmv_agent_docked", on ? "1" : "0"); } catch (_) {}
    };
    db.onclick = () => setDocked(!docked);
    try { if (localStorage.getItem("dmv_agent_docked") === "1") setDocked(true); } catch (_) {}
  }

  // ── BRAIN TIER: Local / Private overdrive / Max Drive. Switching UP into a cloud lane
  //    recolors the window + dings, so you ALWAYS know you've left local-private. (Actually
  //    routing to a cloud brain rides the existing bring-your-own-cloud-model path; the tier
  //    is passed to /api/kit so the backend can route when that lane is wired.) ──
  let tier = "local";
  const TIER_NOTE = {
    local:   "Local — free · private · on your machine · slower",
    private: "Private overdrive — fast · private by policy (leaves your machine, not used to train anyone)",
    max:     "Max Drive — the smartest brains · NOT private (goes to a big provider)"
  };
  function ding(){
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ac = ding._ac || (ding._ac = new AC());
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(880, ac.currentTime); o.frequency.exponentialRampToValueAtTime(1320, ac.currentTime + 0.09);
      g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.16, ac.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.28);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.3);
    } catch (e) {}
  }
  const TIERS = [{ v:"local", t:"Local", cls:"t1" }, { v:"private", t:"Private", cls:"t2" }, { v:"max", t:"Max Drive", cls:"t3" }];
  const lever = win.querySelector("#ktLever"), klTrack = win.querySelector("#ktTrack"),
        klFill = win.querySelector("#ktFill"), klThumb = win.querySelector("#ktThumb"), klName = win.querySelector("#ktName");
  let tierIdx = 0, maxIdx = TIERS.length - 1, cloudOk = true, hintedLock = false;
  function applyTier(i, announce){
    i = Math.min(i, maxIdx);   // never land on a tier the active brain can't actually run
    const goingUp = i > tierIdx;
    tierIdx = Math.max(0, Math.min(TIERS.length - 1, i));
    const s = TIERS[tierIdx], frac = TIERS.length > 1 ? tierIdx / (TIERS.length - 1) : 0, w = (klTrack && klTrack.clientWidth) || 90;
    tier = s.v;
    try { localStorage.setItem("dmv_brain_tier", tier); } catch (_) {}
    if (lever) { lever.classList.remove("t1","t2","t3"); lever.classList.add(s.cls); lever.title = TIER_NOTE[tier]; }
    if (klName) klName.textContent = s.t;
    if (klFill) klFill.style.width = Math.max(7, frac * w) + "px";
    if (klThumb) klThumb.style.left = (frac * w) + "px";
    win.classList.toggle("tier-private", tier === "private");
    win.classList.toggle("tier-max", tier === "max");
    if (announce && goingUp && tier !== "local") ding();
  }
  function tierFromX(clientX){
    const r = klTrack.getBoundingClientRect();
    let frac = r.width ? (clientX - r.left) / r.width : 0; frac = Math.max(0, Math.min(1, frac));
    const want = Math.round(frac * (TIERS.length - 1));
    if (want > maxIdx && !hintedLock) { hintedLock = true;
      addMsg("kit", "🔒 Private & Max Drive run on a cloud brain — tap the 🔑 to add a free key, then they unlock."); }
    applyTier(want, true);   // applyTier clamps to maxIdx
  }
  if (klTrack) {
    klTrack.addEventListener("mousedown", e => { e.preventDefault(); tierFromX(e.clientX);
      const mv = e2 => tierFromX(e2.clientX);
      const up = () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); };
      document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
    });
    klTrack.addEventListener("touchmove", e => { if (e.touches[0]) tierFromX(e.touches[0].clientX); }, { passive:true });
  }
  { const _kl = win.querySelector(".kt-keylink"); if (_kl) _kl.onclick = () => { if (window.openKeys) window.openKeys("brain"); }; }
  { let _t = "local"; try { _t = localStorage.getItem("dmv_brain_tier") || "local"; } catch (_) {}
    const si = TIERS.findIndex(s => s.v === _t); applyTier(si >= 0 ? si : 0, false); }
  requestAnimationFrame(() => applyTier(tierIdx, false));   // fix px positions once the window is laid out
  window.addEventListener("resize", () => applyTier(tierIdx, false));

  // ── HONEST DIAL — only let the lever reach tiers that actually DO something. Private/Max Drive
  //    need a cloud brain; with none configured /api/kit silently falls back to local, so LOCK them
  //    (dimmed + 🔒) until a cloud key exists. /api/models lists enabled cloud slots in `.cloud`. ──
  const ktLock = win.querySelector("#ktLock");
  function setCap(ok){
    cloudOk = !!ok; maxIdx = cloudOk ? TIERS.length - 1 : 0;
    if (cloudOk) hintedLock = false;
    if (lever) lever.classList.toggle("cloud-locked", !cloudOk);
    if (tierIdx > maxIdx) applyTier(maxIdx, false);
  }
  function refreshCap(){
    fetch("/api/models").then(r => r.json()).then(j => setCap(!!(j && Array.isArray(j.cloud) && j.cloud.length))).catch(() => {});
  }
  if (ktLock) ktLock.onclick = () => { if (window.openKeys) window.openKeys("brain"); };
  refreshCap();
  window.addEventListener("ark:providers-changed", () => setTimeout(refreshCap, 80));
  window.addEventListener("focus", refreshCap);

  // ── merge in user-made characters, paint the roster, then default to Kit ──
  function refreshRoster(reactivate) {
    const prevId = active && active.id;
    CHARACTERS = rebuildCharacters();
    // keep the currently-active character if it still exists; pull its fresh data in
    const still = CHARACTERS.find(c => c.id === prevId);
    if (still) active = still;
    buildRoster();
    if (reactivate) paintHost();   // refresh header label/avatar in case readiness/name changed
  }
  refreshRoster(false);
  // Agent Forge = a SOLO guided build (only Tiff). Hide the roster/switcher (Kit + "+ Build" just confuse
  // a first-timer) and the "drag an agent in" hint — so it's just "talk to Tiff," with room to type.
  if (room === "character") {
    if (roster) roster.style.display = "none";
    const _h = win.querySelector(".kit-hint"); if (_h) _h.style.display = "none";
  }
  // bring in ONLY the character dragged here from the front page (kit/tiff, or a user-built one)
  const bring = CHARACTERS.find(c => c.id === broughtId) || CHARACTERS[0];
  win.classList.add("open");
  setActive(bring, true);

  // live refresh when a character is saved/edited/deleted (same tab via CustomEvent,
  // other tabs via storage). Best-effort — never disrupts an in-progress chat.
  function onMineChanged() { refreshRoster(true); }
  window.addEventListener("dmv-characters-changed", onMineChanged);
  window.addEventListener("storage", e => { if (!e || e.key === "dmv_characters" || e.key === null) onMineChanged(); });

  // ── ask the active character (carries `character`; backend may route per-character later) ──
  let busy = false;
  async function ask() {
    const q = input.value.trim(); if ((!q && !pendingImage) || busy) return;   // allow an image-only ask
    busy = true; go.disabled = true;
    const sentImage = pendingImage;
    addMsg("you", q || "(image)");
    if (sentImage) { const im = document.createElement("img"); im.src = sentImage;
      im.style.cssText = "max-width:130px;border-radius:9px;margin-top:5px;display:block;border:1px solid rgba(120,182,205,.4);";
      body.appendChild(im); body.scrollTop = body.scrollHeight; }
    input.value = ""; input.style.height = "auto"; pendingImage = ""; renderPic();
    const think = addMsg("kit", active.name + "'s on it…"); think.classList.add("think"); winSpr.setSpeed(9);
    try {
      // base body is unchanged for Kit + the preview cast. User-made (mine) characters ALSO
      // carry persona/knowledge/charName/charCraft so the backend answers genuinely as them.
      const payload = { room, message: q || "Look at this image and write a great prompt I can generate from it.", character: active.id, tier };
      if (sentImage) payload.image = sentImage;
      // session-aware: if this room exposes a live snapshot (the studio does), hand the agent the REAL session
      if (typeof window.dmvSessionSnapshot === "function") { const snap = window.dmvSessionSnapshot(); if (snap) payload.session = snap; }
      if (active.mine) {
        payload.persona = active.persona || "";
        payload.knowledge = active.knowledge || "";
        payload.charName = active.name || "";
        payload.charCraft = active.craftLabel || active.craft || "";
      }
      const r = await fetch("/api/kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json(); think.remove();
      let reply = j.reply || "Hm, I blanked — ask me again?";
      if (active.preview && !active.mine) reply = "*(" + active.name + " is a preview character — answering through the room brain for now)*\n\n" + reply;
      addMsg("kit", reply);
      // ── the agent DRIVES the room: run a server-validated action through the room's window.RoomAPI ──
      if (j.action && window.RoomAPI && typeof window.RoomAPI.run === "function") {
        const a = j.action;
        if (a.action === "fill_agent") {
          try { window.RoomAPI.run(a); addMsg("kit", "✍️ Filling that in for you…"); }
          catch (err) { addMsg("kit", "(couldn't fill the form — " + err.message + ")"); }
        } else if (window.RoomAPI.room === "imagine-cloud" && window.RoomAPI.hasKey && !window.RoomAPI.hasKey()) {
          addMsg("kit", "Drop your cloud key in the key box up top first, then ask me again — I'll fire it.");
        } else {
          addMsg("kit", "⚙ " + (a.action === "generate_video" ? "Generating that video…" : "Dropping the prompt in + generating…"));
          try {
            window.RoomAPI.run(a.action === "generate_video"
              ? { kind: "video", prompt: a.prompt, seconds: a.seconds }
              : { kind: "image", prompt: a.prompt, mode: a.mode, size: a.size, realism: a.realism, aspect: a.aspect, count: a.count, image: sentImage });
          } catch (err) { addMsg("kit", "(couldn't drive the room — " + err.message + ")"); }
        }
      }
    } catch (e) { think.remove(); addMsg("kit", "Connection hiccup — try me again."); }
    finally { busy = false; go.disabled = false; winSpr.setSpeed(3); input.focus(); }
  }
  // (Retired: the riff/pipeline "two agents talking in one window" experiment — owner's call,
  //  it's confusing. The model is now ONE agent per window; bring in more by stacking windows.)

  go.onclick = ask;

  // ── 🎙 TALK-TO-TYPE — press, speak, it types into the box (browser speech, same as the chat).
  //    Press again to stop. Each agent window gets its own, so in a stack you talk to one, then the next. ──
  (function setupMic(){
    const micBtn = win.querySelector(".kit-mic"); if (!micBtn) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { micBtn.disabled = true; micBtn.title = "Talk-to-type isn't available in this build"; return; }
    let rec = null, listening = false, manualStop = false, committed = "", lastFinal = "", got = false;
    const reset = () => { listening = false; micBtn.classList.remove("rec"); micBtn.textContent = "🎙"; micBtn.title = "Talk to type — press, speak, it types for you"; };
    const errText = c => ({
      "not-allowed": "mic is blocked — allow the microphone for the app, then try again",
      "service-not-allowed": "Windows is blocking the mic — check Settings ▸ Privacy ▸ Microphone",
      "audio-capture": "no microphone found on this machine",
      "network": "speech needs an internet connection — check you're online",
    }[c] || ("mic hiccup (" + c + ") — try again"));
    // accumulate ALL finalized speech (committed) + the live interim words; survives pauses.
    function startRec(){
      rec = new SR(); rec.lang = "en-US"; rec.interimResults = true; rec.continuous = true; lastFinal = "";
      rec.onresult = e => {
        let fin = "", interim = "";
        for (let i = 0; i < e.results.length; i++){ const seg = e.results[i][0].transcript; if (e.results[i].isFinal) fin += seg; else interim += seg; }
        lastFinal = fin;                                  // this session's finalized text (folded in on restart)
        const full = committed + fin + interim;
        if (full.trim()) got = true;
        input.value = full; input.dispatchEvent(new Event("input"));
      };
      rec.onerror = ev => { const err = ev && ev.error;
        if (err === "no-speech" || err === "aborted") return;   // transient (a pause) — let onend auto-restart
        manualStop = true; reset(); addMsg("kit", "🎙 " + errText(err)); };
      rec.onend = () => {
        committed += lastFinal; lastFinal = "";            // keep what was said before the pause/restart
        if (committed && !/\s$/.test(committed)) committed += " ";
        if (!manualStop && listening) { try { startRec(); return; } catch (_) {} }   // keep listening through pauses
        reset();
        if (!got) addMsg("kit", "🎙 didn't catch anything — press the mic and talk; your words land in the box as you go.");
      };
      try { rec.start(); } catch (err) { reset(); addMsg("kit", "🎙 couldn't start the mic — " + ((err && err.message) || err)); }
    }
    micBtn.onclick = () => {
      if (listening) { manualStop = true; rec && rec.stop(); return; }   // press again = stop (it never sends; you read it + hit ➤)
      manualStop = false; got = false;
      committed = input.value ? input.value.replace(/\s*$/, "") + " " : "";   // start from whatever's already typed
      listening = true; micBtn.classList.add("rec"); micBtn.textContent = "■"; micBtn.title = "Listening… press to stop"; input.focus();
      startRec();
    };
  })();
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(90, input.scrollHeight) + "px"; });

  // ── drag the window by its header ──
  win.querySelector(".kit-bar").addEventListener("mousedown", (e) => {
    if (e.target.closest(".kit-x") || e.target.closest(".kit-dock") || win.classList.contains("docked")) return; e.preventDefault();
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
