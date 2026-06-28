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
  // EMBEDDED-as-a-plugin (e.g. Leon Production Labs opened INSIDE the Studio via <iframe>): the host room
  // already has THE agent — don't spawn a duplicate Tiff window inside the plugin frame. The one
  // agent in the host works through the embedded room as a plugin.
  if (window.self !== window.top) return;
  const path = location.pathname.toLowerCase();
  const ROOMS = {
    studio: "DeMartin Audio Labs", beats: "Leon Production Labs", build: "Berner Builder",
    editor: "LePrince Visual Labs", images: "Imagination Station", "imagine-cloud": "Imagination Station",
    stream: "The Stream", character: "Agent Forge",
  };
  let room = null;
  for (const k in ROOMS) { if (path.includes(k + ".html")) { room = k; break; } }
  if (!room) return;                 // chat / non-room → no roster
  // ── a character is only in a room if you DRAGGED them in from the front page:
  //    ?brain=kit|tiff for the two built-ins, or ?char=ID for a user-built one. No param →
  //    nothing mounts here at all; rooms have NO helper until you bring someone in. ──
  let broughtId = null, explicit = false;   // explicit = the user actively brought someone in THIS time (drag / summon)
  try {
    const sp = new URLSearchParams(location.search);
    if (sp.get("summon") === "1") explicit = true;                          // the "Summon agent" button re-injects with ?summon=1
    const brain = (sp.get("brain") || "").toLowerCase();
    if (brain === "kit" || brain === "tiff") { broughtId = brain; explicit = true; }
    else { const cid = sp.get("char"); if (cid) { broughtId = cid; explicit = true; } }   // dragged in from the front page
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
    { id: "kit",  name: "Kit",  tag: "the technical one · build", color: "#7BB6CD", sprite: true,
      intro: r => `Kit online. I run the technical side of ${r} — the levels, the settings, the exact moves. Tell me the target and I'll dial it in precise.` },
    { id: "tiff", name: "Tiffany", tag: "one of the crew · artist",  color: "#E58FB5",
      intro: r => r === "Agent Forge"
        ? `Yo, welcome — first time building an agent? Cool part: I'm one, so this is me showing you live. Tell me what you do and I'll handle the whole thing — you talk, I build. (Or fill it in yourself below.) Wanna run it together?`
        : `What's good — it's Tiffany. I'm right here in ${r} making stuff with you — I write, I make beats, I do a little of everything. So whatchu working on? Let's get it.` },
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
      model: c.model || "auto",                                       // per-agent brain (rides onto the mine object)
      craft: c.craft || "", craftLabel: c.craftLabel || "",
      readiness: typeof c.readiness === "number" ? c.readiness : 0,   // BUILD score (0..80) — who they are
      trained: typeof c.trained === "number" ? c.trained : 0,         // TRAINED score (0..20) — pack evidence
      intro: r => `${c.name || "I'm in"} — ${c.craftLabel || "your agent"} in ${r}. ${c.tagline || "Let's get to work."}`,
    }));
  }
  function rebuildCharacters() { return CHARACTERS_BUILTIN.concat(loadMine()); }
  // COMBINED readiness shown everywhere in-room: build (<=80) + trained (<=20), clamped to 100.
  function combinedPct(ch){ return Math.min(100, Math.round((ch.readiness || 0) + (ch.trained || 0))); }
  // write the server-authoritative trained score back into the agent's dmv_characters entry
  // (leaves its build `readiness` untouched), then fire the same repaint event a save would.
  function persistTrained(id, trained){
    try {
      const arr = JSON.parse(localStorage.getItem("dmv_characters") || "[]");
      const i = arr.findIndex(c => c && c.id === id);
      if (i >= 0) { arr[i].trained = Math.min(20, trained | 0); localStorage.setItem("dmv_characters", JSON.stringify(arr));
        window.dispatchEvent(new CustomEvent("dmv-characters-changed")); }
    } catch (e) {}
  }

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
  .kit-win { position:fixed; right:18px; bottom:70px; z-index:9997; width:362px; max-width:92vw; display:none; flex-direction:column;
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
  .kit-speak { flex:none; width:36px; height:31px; border:1px solid rgba(120,182,205,.4); border-radius:9px; cursor:pointer; background:rgba(255,255,255,.05); color:#CFE6EE; font-size:14px; }
  .kit-speak:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.16); }
  .kit-speak.on { border-color:rgba(127,211,176,.85); background:rgba(127,211,176,.18); color:#BFF0DA; box-shadow:0 0 9px rgba(127,211,176,.4); }
  .kit-speak.playing { animation:kitspeak 1s ease-in-out infinite; }
  @keyframes kitspeak { 0%,100%{ box-shadow:0 0 0 0 rgba(127,211,176,.5);} 50%{ box-shadow:0 0 0 7px rgba(127,211,176,0);} }
  .kit-tier { display:flex; align-items:center; gap:5px; padding:5px 10px; border-bottom:1px solid rgba(255,255,255,.06); background:rgba(0,0,0,.12); }
  .kit-tier .kt-l { font:700 8.5px 'Space Mono'; letter-spacing:.14em; text-transform:uppercase; color:rgba(170,180,190,.5); margin-right:3px; }
  .kt-pill { font:700 9.5px Oxanium; letter-spacing:.04em; padding:3px 9px; border-radius:20px; cursor:pointer; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.03); color:#C6CBD3; }
  .kt-pill.on[data-tier="local"] { border-color:rgba(120,182,205,.85); background:rgba(62,156,184,.18); color:#BFE6F2; }
  .kt-pill.on[data-tier="private"] { border-color:rgba(217,164,65,.85); background:rgba(217,164,65,.2); color:#F0CE8C; }
  .kt-pill.on[data-tier="max"] { border-color:rgba(240,90,120,.9); background:rgba(240,90,120,.22); color:#FFB4C4; }
  .kt-effort { flex:none; white-space:nowrap; }
  .kt-effort.god { color:#FFE6A3; border-color:rgba(230,193,106,.6); background:rgba(230,193,106,.10); box-shadow:0 0 10px rgba(230,193,106,.4); }
  .kt-crew { flex:none; white-space:nowrap; }
  .kt-crew.on { color:#CDEBF5; border-color:rgba(120,182,205,.9); background:rgba(62,156,184,.24); box-shadow:0 0 9px rgba(62,156,184,.4); }
  .kit-crewpop { position:fixed; z-index:9999; width:250px; max-width:88vw; background:rgba(20,23,29,.99); border:1px solid rgba(120,182,205,.42); border-radius:12px; box-shadow:0 14px 38px rgba(0,0,0,.62); padding:11px 12px; display:none; }
  .kit-crewpop.open { display:block; }
  .kit-crewpop h5 { margin:0 0 3px; font:800 12.5px Oxanium,sans-serif; color:#EAF2F6; letter-spacing:.02em; }
  .kit-crewpop .cw-sub { font:500 10.5px Inter,sans-serif; color:#9FB4C0; line-height:1.45; margin-bottom:7px; }
  .kit-crewpop .cw-lead { font:700 10px Inter,sans-serif; color:#7FD3B0; padding:4px 5px 7px; border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:5px; }
  .kit-crewpop label { display:flex; align-items:center; gap:8px; padding:5px 6px; border-radius:7px; cursor:pointer; font:600 11.5px Inter,sans-serif; color:#D7DCE4; }
  .kit-crewpop label:hover { background:rgba(62,156,184,.15); }
  .kit-crewpop input[type=checkbox] { accent-color:#3E9CB8; width:14px; height:14px; flex:none; }
  .kit-crewpop .cw-empty { font:500 11px Inter,sans-serif; color:#9FB4C0; line-height:1.5; padding:3px 5px; }
  .kit-crewpop a { color:#7CC7DC; cursor:pointer; text-decoration:underline; }
  .kt-keylink { margin-left:auto; font:700 9px 'Space Mono',monospace; letter-spacing:.06em; color:#9FCFDD; background:none; border:none; cursor:pointer; padding:3px 4px; }
  .kt-keylink:hover { color:#CFE6EE; text-decoration:underline; }
  /* per-agent MODEL picker — a pill-styled <select>; each agent shows ITS own saved brain (honest, from /api/models) */
  select.kt-model { flex:1; min-width:64px; max-width:100%; appearance:none; -webkit-appearance:none; outline:none;
    font:700 9.5px Oxanium; letter-spacing:.04em; padding:3px 22px 3px 11px; border-radius:20px; cursor:pointer;
    border:1px solid rgba(120,182,205,.5); background:rgba(62,156,184,.12); color:#BFE6F2;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='%239FCFDD' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 8px center; }
  select.kt-model:hover { border-color:rgba(120,182,205,.85); }
  select.kt-model option { color:#1a1c22; }
  /* God-Particle window glow — kept, now keyed to a top-tier Claude/Opus cloud model being selected. */
  .kit-win.tier-max { border-color:rgba(240,90,120,.6); box-shadow:0 22px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(240,90,120,.32), 0 0 36px rgba(240,90,120,.2), inset 0 1px 0 rgba(255,255,255,.06); }
  .kit-foot { display:flex; flex-direction:column; gap:7px; padding:9px 11px 11px; border-top:1px solid rgba(255,255,255,.07); }
  /* 🎙🔊 voice meter — dances pink to HER voice, blue to YOURS (gender-reveal convention). */
  .kit-vm { display:none; align-items:flex-end; justify-content:center; gap:2px; height:0; overflow:hidden; transition:height .14s ease; }
  .kit-vm.on { display:flex; height:20px; }
  .kit-vm .vmb { width:3px; height:3px; border-radius:2px; background:var(--kvm,#56C2DE); box-shadow:0 0 5px var(--kvm,#56C2DE); transition:height .06s linear; }
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
  /* ── Owner 2026-06-28: clean bottom bar — send INSIDE the bubble, tools folded into two labeled menus ── */
  .kit-inwrap { position:relative; display:block; }
  .kit-inwrap .kit-in { padding-right:86px; }                 /* room for the in-bubble mic + send */
  .kit-inwrap .kit-mic { position:absolute; right:45px; bottom:7px; width:32px; height:32px; border-radius:9px; }   /* mic sits right next to send, in the bubble */
  .kit-inwrap .kit-go { position:absolute; right:7px; bottom:7px; width:32px; height:32px; border-radius:9px; font-size:14px; }
  .kt-hidden { display:none !important; }                      /* old icon buttons kept as action sinks for the menus */
  .kit-plus { flex:none; width:38px; height:31px; border:1px solid rgba(120,182,205,.4); border-radius:9px; cursor:pointer; background:rgba(255,255,255,.05); color:#9FCFDD; font-size:18px; line-height:1; }
  .kit-plus:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.16); color:#fff; }
  .kit-voice { flex:none; width:36px; height:31px; border:1px solid rgba(120,182,205,.4); border-radius:9px; cursor:pointer; background:rgba(255,255,255,.05); color:#9FCFDD; display:inline-flex; align-items:center; justify-content:center; transition:all .12s; }
  .kit-voice:hover { border-color:rgba(120,182,205,.85); background:rgba(62,156,184,.18); color:#fff; transform:translateY(-1px); }
  .kit-voice.on { color:#BFF0DA; border-color:rgba(127,211,176,.7); box-shadow:0 0 9px rgba(127,211,176,.35); }
  .kit-voice svg { display:block; }
  .kit-more-item { display:flex; align-items:center; gap:10px; }
  .kit-more-item.dis { opacity:.4; cursor:default; }
  .kmi-ic { width:18px; text-align:center; flex:none; font-size:13px; }
  .kmi-lbl { flex:1; }
  .kmi-ck { color:#7FD3B0; font-size:12px; flex:none; }
  .kit-menu-sep { height:1px; margin:4px 7px; background:rgba(255,255,255,.09); }
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
     <div class="kit-tier"><span class="kt-l">Brain</span><select class="kt-model kt-pill" id="ktModel" title="This agent's brain"></select><button class="kt-effort kt-pill" id="ktEffort" type="button" title="How hard this agent thinks — tap to change. 🔱 God unlocks on a Claude brain.">⚡ Quick</button><button class="kt-crew kt-pill" id="ktCrew" type="button" title="Back this agent with a crew of other brains — they weigh in, this agent gives you the answer">+ crew</button><button class="kt-keylink" title="Get a cloud key — turns on a cloud brain">🔑 key</button></div>
     <div class="kit-body"></div>
     <div class="kit-pic"></div>
     <div class="kit-foot"><div class="kit-vm" aria-hidden="true"></div>
       <div class="kit-inwrap"><textarea class="kit-in" rows="1" placeholder="Ask, or hit 🎙 to talk…"></textarea><button class="kit-mic" title="Talk to type — press, speak, it types for you">🎙</button><button class="kit-go" title="Send">➤</button></div>
       <div class="kit-tools"><button class="kit-plus" title="Tools — image, screen, teach, and more">＋</button><button class="kit-up kt-hidden" title="Show the agent an image">📎</button><button class="kit-look kt-hidden" title="Let the agent look at your screen">👁</button><button class="kit-watch kt-hidden" title="Watch me work">⏺</button><button class="kit-teach kt-hidden" title="Teach this">📌</button><button class="kit-speak kt-hidden" title="Voice toggle">🔇</button><span class="kit-tools-sp"></span><button class="kit-voice" title="Voice options"></button></div></div>`;
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
  let pendingAudio = null;   // {dataURL, meta, name} — a song/clip the agent will HEAR (same 📎)
  const picRow = win.querySelector(".kit-pic"), upBtn = win.querySelector(".kit-up");
  function renderPic(){
    if (!picRow) return;
    if (pendingImage){
      picRow.innerHTML = '<img src="' + pendingImage + '" alt=""><button class="kit-picx" title="remove">✕</button>';
      picRow.style.display = "flex";
      const x = picRow.querySelector(".kit-picx"); if (x) x.onclick = () => { pendingImage = ""; renderPic(); };
    } else if (pendingAudio){
      const dur = pendingAudio.meta && pendingAudio.meta.durationSec;
      picRow.innerHTML = '<span style="display:inline-flex;align-items:center;gap:7px;font:600 11px Inter;color:#BFE6F2;background:rgba(62,156,184,.16);border:1px solid rgba(120,182,205,.45);border-radius:9px;padding:6px 10px">🎵 ' +
        String(pendingAudio.name || "audio").replace(/[<>&]/g, "") + (dur ? " · " + Math.floor(dur / 60) + ":" + ("0" + Math.floor(dur % 60)).slice(-2) : "") +
        "</span><button class=\"kit-picx\" title=\"remove\">✕</button>";
      picRow.style.display = "flex";
      const x = picRow.querySelector(".kit-picx"); if (x) x.onclick = () => { pendingAudio = null; renderPic(); };
    } else { picRow.innerHTML = ""; picRow.style.display = "none"; }
  }
  if (upBtn) upBtn.onclick = () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*,audio/*";   // ONE clip — image OR a song
    inp.onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return;
      if ((f.type || "").indexOf("audio") === 0 || /\.(wav|mp3|m4a|flac|aac|ogg|aiff?)$/i.test(f.name || "")) {
        pendingImage = "";
        const rd = new FileReader();
        rd.onload = async () => {
          let meta = {};
          try { if (window.DMV_EAR) meta = await window.DMV_EAR.analyze(f); } catch (_) {}
          pendingAudio = { dataURL: rd.result, meta: meta, name: f.name || "audio" }; renderPic();
        };
        rd.readAsDataURL(f);
        return;
      }
      pendingAudio = null;
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

  // ── ⏺ WATCH  +  📌 TEACH — the in-room TRAINERS. They sit right next to 👁 on purpose: 👁 looks ONCE,
  //    ⏺/📌 look + LEARN. Both feed the active (mine) agent's pack, distilled server-side, honest about
  //    empties (the bar NEVER moves without a real distilled rule). Only YOUR agents take a pack — the
  //    built-ins (Kit/Tiff) don't, so these dim out unless one of your agents is the active brain. ──
  const watchBtn = win.querySelector(".kit-watch"), teachBtn = win.querySelector(".kit-teach");
  function syncTrainTools() {
    const on = !!(active && active.mine);
    [watchBtn, teachBtn].forEach(b => { if (b) b.style.opacity = on ? "" : ".3"; });
  }
  function trainMine(kind, raw, okWord) {
    if (!(active && active.mine)) { addMsg("kit", "Bring one of YOUR agents in to train them — the built-ins (Kit/Tiff) don't take a pack."); return; }
    if (!raw || !raw.trim()) return;
    fetch("/api/agents/" + encodeURIComponent(active.id) + "/train", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active.id, name: active.name, craft: active.craftLabel || active.craft || "", kind, raw, context: room })
    }).then(r => r.json()).then(res => {
      if (res && res.added > 0) {
        active.trained = Math.min(20, res.trained | 0); persistTrained(active.id, res.trained); paintHost();
        addMsg("kit", (okWord || "Banked") + " +" + res.added + " — " + res.trained + "/20 trained.");
      } else { addMsg("kit", "Nothing concrete in that to bank yet — give me a real move + the why."); }
    }).catch(() => {});
  }
  function captureMove() {
    if (!(active && active.mine)) { addMsg("kit", "Bring one of your own agents in to train them first."); return; }
    const note = prompt("📌 Teach this — what did you just do, and why? (becomes a rule)"); if (!note) return;
    const snap = (typeof window.dmvSessionSnapshot === "function") ? (window.dmvSessionSnapshot() || "") : "";
    trainMine("watch", note + (snap ? "\nROOM STATE:\n" + snap : ""), "Banked");
  }
  async function watchMe() {
    if (!(active && active.mine)) { addMsg("kit", "Bring one of your own agents in to train them first."); return; }
    const note = prompt("⏺ Watch me — talk me through what you're working on right now (the move + the why). I'll read your live session too."); if (!note) return;
    if (watchBtn) { watchBtn.classList.add("busy"); watchBtn.textContent = "…"; }
    const snap = (typeof window.dmvSessionSnapshot === "function") ? (window.dmvSessionSnapshot() || "") : "";
    trainMine("watch", "NARRATION: " + note + (snap ? "\nROOM STATE:\n" + snap : ""), "Learned");
    setTimeout(() => { if (watchBtn) { watchBtn.classList.remove("busy"); watchBtn.textContent = "⏺"; } }, 700);
  }
  if (teachBtn) teachBtn.onclick = captureMove;
  if (watchBtn) watchBtn.onclick = watchMe;

  // ── TWO LABELED MENUS (owner 2026-06-28) — the old gaudy icon row is folded into a left "＋" tools menu
  //    and a right "🎙 ▾" voice menu, each item named in PLAIN TEXT (no hover-to-learn). The original
  //    buttons stay in the DOM (hidden) as action sinks, so every handler keeps working untouched; the
  //    menu items just .click() them. ONE build → every agent window (Tiff, Kit, anything you build).
  //    Add an item to either list and it shows up — built to grow, like a real menu bar. ──
  let kMenu = null;
  function kCloseMenu() { if (kMenu) { kMenu.remove(); kMenu = null; document.removeEventListener("mousedown", kOnDown, true); } }
  function kOnDown(e) { if (kMenu && !kMenu.contains(e.target) && e.target !== kMenu._for && !(kMenu._for && kMenu._for.contains(e.target))) kCloseMenu(); }
  function kOpenMenu(trigger, items) {
    const same = kMenu && kMenu._for === trigger; kCloseMenu(); if (same) return;   // tap the same trigger again = close
    kMenu = document.createElement("div"); kMenu.className = "kit-more-menu"; kMenu._for = trigger;
    items.forEach(it => {
      if (it.sep) { const s = document.createElement("div"); s.className = "kit-menu-sep"; kMenu.appendChild(s); return; }
      const d = document.createElement("div"); d.className = "kit-more-item" + (it.disabled ? " dis" : "");
      d.innerHTML = '<span class="kmi-ic">' + (it.ic || "") + '</span><span class="kmi-lbl">' + it.label + '</span>' + (it.check ? '<span class="kmi-ck">✓</span>' : '');
      if (!it.disabled) d.onclick = () => { kCloseMenu(); try { it.run(); } catch (_) {} };
      kMenu.appendChild(d);
    });
    document.body.appendChild(kMenu);
    const r = trigger.getBoundingClientRect();
    kMenu.style.left = Math.max(6, Math.min(r.left, window.innerWidth - kMenu.offsetWidth - 6)) + "px";
    kMenu.style.top = (r.top - kMenu.offsetHeight - 6) + "px";   // pop ABOVE the bar
    setTimeout(() => document.addEventListener("mousedown", kOnDown, true), 0);
  }
  function clickEl(sel) { const b = win.querySelector(sel); if (b) b.click(); }
  const plusBtn = win.querySelector(".kit-plus");
  if (plusBtn) plusBtn.onclick = () => {
    const mine = !!(active && active.mine);
    kOpenMenu(plusBtn, [
      { ic: "📎", label: "Show me an image or file", run: () => clickEl(".kit-up") },
      { ic: "👁", label: "Look at my screen", run: () => clickEl(".kit-look") },
      { ic: "⏺", label: "Watch me work" + (mine ? " (learn from it)" : " — for agents you build"), disabled: !mine, run: () => clickEl(".kit-watch") },
      { ic: "📌", label: "Teach a rule" + (mine ? "" : " — for agents you build"), disabled: !mine, run: () => clickEl(".kit-teach") },
      { sep: true },
      { ic: "📋", label: "Copy last reply", run: () => { const m = body.querySelectorAll(".kit-msg.kit"); const last = m[m.length - 1]; const t = last ? (last.innerText || last.textContent || "").trim() : ""; if (t) { try { navigator.clipboard.writeText(t); } catch (_) {} } } },
      { ic: "🗑", label: "Clear chat", run: () => { if (body) body.innerHTML = ""; } },
    ]);
  };
  const voiceMenuBtn = win.querySelector(".kit-voice");
  // a chunky, rounded down-arrow (graffiti-ish) instead of the thin cut-off caret
  if (voiceMenuBtn) voiceMenuBtn.innerHTML = '<svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M6 11l6 6 6-6"/></svg>';
  if (voiceMenuBtn) voiceMenuBtn.onclick = () => {
    const on = getVoiceOn(active), nm = (active && active.name) || "the agent";
    kOpenMenu(voiceMenuBtn, [
      { ic: "🔊", label: nm + " reads replies aloud", check: on, run: () => clickEl(".kit-speak") },
      { ic: "🎙", label: "Talk to type", run: () => clickEl(".kit-mic") },
      { sep: true },
      { ic: "👂", label: "Wake word — “Hey Tiffany” / “Hey Kit”", check: wakeOn, disabled: !SRdock, run: () => setWakeOn(!wakeOn) },
    ]);
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
    subEl.textContent = active.mine ? combinedPct(active) + "% · " + ROOMS[room]
                       : active.preview ? "PREVIEW · " + ROOMS[room] : ROOMS[room];
    if (fabLabel) fabLabel.textContent = active.name;   // passive presence chip — just the name (the green dot stays)
    if (typeof syncTrainTools === "function") syncTrainTools();
  }
  function setActive(ch, announce) {
    active = ch;
    try { localStorage.setItem("dmv_active_brain", ch.id); } catch (_) {}   // remember across room/page hops
    [...roster.children].forEach(c => c.classList.toggle("on", c._id === ch.id));
    if (typeof syncModelToActive === "function") syncModelToActive();       // show THIS agent's own saved brain
    paintHost();
    if (announce) { body.innerHTML = ""; addMsg("kit", (ch.intro ? ch.intro(ROOMS[room]) : `${ch.name} is in. ${ROOMS[room]}.`)); }
    // sync the TRAINED score from the server so the in-room % is truthful even if training
    // happened in another tab. Best-effort, non-blocking — never breaks the sync render above.
    if (ch.mine && ch.id) {
      fetch("/api/agents/" + encodeURIComponent(ch.id) + "/readiness")
        .then(r => r.json()).then(res => {
          if (!res || typeof res.trained !== "number") return;
          ch.trained = Math.min(20, res.trained | 0);
          if (active && active.id === ch.id) { active.trained = ch.trained; paintHost(); }
          persistTrained(ch.id, res.trained);
        }).catch(() => {});
    }
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
        const p = document.createElement("span"); p.className = "cp"; p.textContent = combinedPct(ch) + "%"; chip.appendChild(p);
        chip.title = (ch.tag || ch.name) + " — your agent (" + combinedPct(ch) + "% ready)";
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
  // push a message into her chat from outside (e.g. the dock posts the "hearing report") + open the window
  window.__kitSay = (text) => { try { addMsg("kit", text); win.classList.add("open"); } catch (e) {} };

  // ── WARM HANDOFF — if the user just walked in from the main chat, pick up the idea they came with
  //    instead of starting cold (the "it vanished" fix). The brief was stashed in localStorage by the
  //    chat right before nav; we greet them already caught up + seed her first reply with it (ONE time,
  //    scoped — then she runs on the room's own thread). Read HERE (window exists = an agent's in) so
  //    it isn't consumed before there's a window to show it in; waits in localStorage (10-min TTL) if not. ──
  let handoff = null;
  try { const _h = JSON.parse(localStorage.getItem("dmv_handoff") || "null"); if (_h && _h.room === room && (Date.now() - (_h.ts || 0)) < 600000) { handoff = _h; localStorage.removeItem("dmv_handoff"); } } catch (e) {}
  if (handoff && handoff.gist) {
    // defer past the agent's own intro — setActive() wipes the chat body on mount, so post AFTER it
    const _hoGist = handoff.gist;
    setTimeout(function () { try { addMsg("kit", "🔗 Caught up from chat — you were on: “" + _hoGist + "”. Let's pick it up right here."); win.classList.add("open"); } catch (e) {} }, 450);
  }

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

  // ── PER-AGENT BRAIN PICKER: each dragged-in agent (kit / tiff / a user-built one) gets its OWN
  //    concrete model dropdown. The choice persists INDEPENDENTLY per agent — Tiff→Opus in Audio Lab
  //    does NOT change Kit, and never touches the main chat. Options come HONESTLY from /api/models
  //    (real local ids + real keyed cloud:slot ids only); no key → local + an "add a cloud model"
  //    affordance, never a fabricated Opus. The chosen id ("auto" | bare local id | "cloud:<slot>")
  //    rides every /api/kit call as `model`; the legacy `tier` field stays for backward-compat. ──
  let tier = "local";   // kept ONLY as the backend's legacy fallback (no longer the primary control)
  const modelSel = win.querySelector("#ktModel");

  // per-agent storage — built-ins (kit/tiff, not in dmv_characters) use a per-id key; user (mine)
  // agents carry the choice as a `model` field on their dmv_characters entry (persistTrained pattern).
  function getAgentModel(ch){
    if (!ch) return "auto";
    if (ch.mine) return ch.model || "auto";
    try { return localStorage.getItem("dmv_agent_model_" + ch.id) || "auto"; } catch (_) { return "auto"; }
  }
  function setAgentModel(ch, id){
    if (!ch) return;
    if (ch.mine) {
      ch.model = id;
      try {
        const arr = JSON.parse(localStorage.getItem("dmv_characters") || "[]");
        const i = arr.findIndex(c => c && c.id === ch.id);
        if (i >= 0) { arr[i].model = id; localStorage.setItem("dmv_characters", JSON.stringify(arr));
          window.dispatchEvent(new CustomEvent("dmv-characters-changed")); }
      } catch (e) {}
    } else {
      try { localStorage.setItem("dmv_agent_model_" + ch.id, id); } catch (_) {}
    }
  }

  // ── VOICE OUT — the agent SPEAKS its reply via Fish Audio (/api/tts), in that agent's cloned
  //    voice (a Fish "reference_id"/model id). Per-agent on/off + model id, mirroring the brain picker:
  //    built-ins (kit/tiff) carry a default voice id; user (mine) agents store one on their entry.
  //    No Fish key / no model id → fall back to the browser's built-in voice so it ALWAYS talks. ──
  const VOICE_DEFAULTS = { kit: "5312c04032034388bb6bac44c94c804d", tiff: "8526ee26387448b2a86c1d1052148a4b" };
  function getVoiceModelId(ch){
    if (!ch) return "";
    try { const m = JSON.parse(localStorage.getItem("dmv_voice_models") || "{}"); if (m && m[ch.id]) return m[ch.id]; } catch (_) {}
    if (ch.mine) return ch.voiceModelId || "";
    return VOICE_DEFAULTS[ch.id] || "";
  }
  function getVoiceOn(ch){ if (!ch) return false; try { return localStorage.getItem("dmv_voice_on_" + ch.id) === "1"; } catch (_) { return false; } }
  function setVoiceOn(ch, on){ if (!ch) return; try { localStorage.setItem("dmv_voice_on_" + ch.id, on ? "1" : "0"); } catch (_) {} }
  // strip chat-only cruft so the spoken line is clean. KEEP [expression] tags (Fish S2 fires them);
  // the browser fallback strips them since it can't perform them.
  // valid Fish S2 expression tags — anything else in brackets is stripped, so Fish never tries to
  // vocalize a bad tag and run off into noise / another language. (docs.fish.audio — S2 uses [tags])
  const FISH_TAGS = new Set(["whispering","soft tone","sad","excited","joyful","delighted","embarrassed","proud","grateful","confident","curious","serious","empathetic","comforting","sincere","relaxed","amused","chuckling","laughing","surprised","worried","nervous","frustrated","confused","moved","interested","satisfied","sarcastic","scared","astonished"]);
  function cleanForSpeech(t){
    return String(t || "")
      .replace(/```[\s\S]*?```/g, " ")          // code/action fences — don't read them aloud
      .replace(/\*\([\s\S]*?\)\*/g, " ")         // *(preview / +learned)* asides
      .replace(/\[([^\]]+)\]\((https?:[^)]*)\)/g, "$1")   // markdown links → just the text
      .replace(/\[([^\]]{1,22})\]/g, (m,g) => FISH_TAGS.has(g.trim().toLowerCase()) ? "[" + g.trim().toLowerCase() + "]" : " ")   // keep ONLY real Fish tags; drop the rest
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}]/gu, " ")   // strip emoji/symbols
      .replace(/[*_`#>~]/g, "")                    // markdown chars
      .replace(/\s*(?:…|\.{2,})\s*/g, ". ")        // ellipses / trailing-off → a clean stop (kills the run-on)
      .replace(/([!?])\1+/g, "$1")                 // !!! → !
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/\s+/g, " ").trim()
      .replace(/([^.!?])$/, "$1.");                // always end on a terminator so Fish stops cleanly
  }
  let _audioEl = null;
  // ── 🎙 RICH VOICE state (shared by the mic + ask()): the live tone read of the last take, the
  //    recording (for Whisper uncensor), and the open ear handle. Mirrors the main chat. ──
  let lastVoiceTone = null, lastVoiceBlob = null, voiceListen = null;
  // ── voice meter — pink to HER voice, blue to YOURS (matches the main chat) ──
  const vmEl = win.querySelector(".kit-vm"); const _vmBars = [];
  if (vmEl) { for (let i = 0; i < 11; i++) { const b = document.createElement("div"); b.className = "vmb"; vmEl.appendChild(b); _vmBars.push(b); } }
  function vmShow(who){ if (!vmEl) return; vmEl.style.setProperty("--kvm", who === "her" ? "#E94B9C" : "#56C2DE"); vmEl.classList.add("on"); }
  function vmHide(){ if (!vmEl) return; vmEl.classList.remove("on"); _vmBars.forEach(b => { b.style.height = "3px"; }); }
  function vmLevel(v){ v = Math.max(0, Math.min(1, v || 0)); const n = _vmBars.length;
    for (let i = 0; i < n; i++){ const c = 1 - Math.abs(i - (n - 1) / 2) / ((n - 1) / 2); const h = 3 + v * 17 * (0.5 + 0.5 * c) * (0.65 + 0.7 * Math.random()); _vmBars[i].style.height = Math.min(20, h).toFixed(1) + "px"; } }
  function vmFromAudio(audioEl){ try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ac = new AC(); if (ac.state === "suspended") { try { ac.resume(); } catch(e){} }
    const src = ac.createMediaElementSource(audioEl), an = ac.createAnalyser(); an.fftSize = 256; src.connect(an); an.connect(ac.destination);
    const buf = new Uint8Array(an.fftSize);
    const tick = () => { if (audioEl.paused || audioEl.ended) { vmHide(); try { ac.close(); } catch(e){} return; }
      an.getByteTimeDomainData(buf); let peak = 0; for (let i = 0; i < buf.length; i++){ const d = Math.abs(buf[i] - 128) / 128; if (d > peak) peak = d; }
      vmLevel(Math.min(1, peak * 1.7)); requestAnimationFrame(tick); };
    audioEl.addEventListener("play", () => { vmShow("her"); requestAnimationFrame(tick); });
    audioEl.addEventListener("ended", vmHide);
  } catch(e){} }

  // ── 👂 WAKE WORD — say "Hey Tiffany" / "Hey Kit" and the agent wakes up, opens, and listens
  //    hands-free for your command (then sleeps, like a smart speaker). Opt-in (always-on mic),
  //    persisted per machine. Uses ONE recognizer at a time: the wake listener detects the phrase,
  //    hands off to the command mic, then resumes when that mic ends. setupMic publishes the
  //    dockMicStart/dockMicStop hooks below. ──
  const SRdock = window.SpeechRecognition || window.webkitSpeechRecognition;
  let wakeOn = false; try { wakeOn = localStorage.getItem("dmv_wake_on") === "1"; } catch(_){}
  let wakeRec = null;
  let dockMicStart = null, dockMicStop = null, micIsListening = function(){ return false; };   // wired by setupMic
  function agentForWake(said){
    if (/tiffan|tiff|jeff/.test(said)) return "tiff";   // tolerate the common mishears of "Tiffany"
    if (/\bkit+\b|kitt/.test(said)) return "kit";
    return null;
  }
  function onWakeResult(e){
    let txt = ""; for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
    const m = txt.toLowerCase().match(/\bhey,?\s+(tiffan\w*|tiff|jeff|kit+t?)\b/);
    if (!m) return;
    const id = agentForWake(m[1]); if (!id) return;
    pauseWake();                                                           // free the mic for the command recognizer
    const ch = CHARACTERS.find(c => c.id === id);
    if (ch && (!active || active.id !== ch.id)) { try { setActive(ch, false); } catch(_){} }   // switch without wiping the chat
    win.classList.add("open");
    try { addMsg("kit", "👂 _listening…_"); } catch(_){}
    setTimeout(() => { if (dockMicStart) dockMicStart({ viaWake: true }); }, 220);   // hands-free: capture the command, auto-send on a pause
  }
  function startWake(){
    if (!SRdock || !wakeOn || wakeRec || (micIsListening && micIsListening())) return;
    try {
      wakeRec = new SRdock(); wakeRec.lang = "en-US"; wakeRec.interimResults = true; wakeRec.continuous = true;
      wakeRec.onresult = onWakeResult;
      wakeRec.onerror = function(){};                                       // transient — onend revives it
      wakeRec.onend = function(){ wakeRec = null; if (wakeOn && !(micIsListening && micIsListening())) setTimeout(startWake, 500); };
      wakeRec.start();
    } catch(_){ wakeRec = null; }
  }
  function pauseWake(){ if (wakeRec) { try { wakeRec.onend = null; wakeRec.abort(); } catch(_){} wakeRec = null; } }
  function setWakeOn(on){ wakeOn = on; try { localStorage.setItem("dmv_wake_on", on ? "1" : "0"); } catch(_){} if (on) startWake(); else pauseWake(); }

  const speakBtn = win.querySelector(".kit-speak");
  function paintSpeak(){
    if (!speakBtn) return;
    const on = getVoiceOn(active), nm = (active && active.name) || "the agent";
    speakBtn.classList.toggle("on", on);
    speakBtn.textContent = on ? "🔊" : "🔇";
    speakBtn.title = on ? ("Voice ON — " + nm + " speaks replies. Tap to mute.") : ("Voice off — tap so " + nm + " talks out loud");
    const vb = win.querySelector(".kit-voice"); if (vb) { vb.classList.toggle("on", on); vb.title = on ? (nm + " reads replies aloud — voice options") : "Voice options"; }   // the caret glows when voice is on
  }
  // hide spoken-only [expression] tags from the BUBBLE (Fish still reads them). Lowercase emotion tags
  // only — never [Verse]/[Hook] (capitalized) or markdown links. Mirrors the main chat's stripTags.
  function stripVoiceTags(s){ return String(s).replace(/\[[a-z][a-z ,'\-]{0,24}\](?!\()/g, "").replace(/[ \t]{2,}/g, " "); }
  function _pickBrowserVoice(){ try { const vs = speechSynthesis.getVoices() || [];
    return vs.find(v => /en/i.test(v.lang) && /(female|woman|zira|aria|jenny|samantha|google us english|hazel|susan|eva|fiona)/i.test(v.name))
        || vs.find(v => /en/i.test(v.lang) && !/(david|mark|george|guy|\bmale\b|paul|fred|alex)/i.test(v.name))
        || vs.find(v => /en/i.test(v.lang)) || vs[0] || null; } catch(_){ return null; } }
  function speakBrowser(text){
    try { const u = new SpeechSynthesisUtterance(String(text).replace(/\[[^\]]*\]/g, "")); u.rate = 1.04;
      const _v = _pickBrowserVoice(); if (_v) { u.voice = _v; u.lang = _v.lang; }   // dodge the default robot-dude voice
      speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (_) {}
  }
  async function playTTS(text, modelId){
    const clean = cleanForSpeech(text); if (!clean) return;
    if (!modelId) { speakBrowser(clean); return; }            // no voice id at all → free browser voice
    if (speakBtn) speakBtn.classList.add("playing");
    try {
      const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: clean, model_id: modelId }) });
      const j = await r.json();
      if (j && j.audio) {
        if (_audioEl) { try { _audioEl.pause(); } catch (_) {} }
        _audioEl = new Audio(j.audio);
        _audioEl.onended = _audioEl.onerror = () => { if (speakBtn) speakBtn.classList.remove("playing"); vmHide(); };
        vmFromAudio(_audioEl);                                 // 🔊 meter dances pink to her voice
        _audioEl.play().catch(() => { if (speakBtn) speakBtn.classList.remove("playing"); vmHide(); });
      } else {
        if (speakBtn) speakBtn.classList.remove("playing");
        const err = (j && j.error) || "";
        // NO ROBOT mid-convo (owner's hard rule): browser voice ONLY when there's no Fish key (free user).
        // A real Fish failure (bad/"reference not found" voice id, 4xx, credit) → STAY TEXT + say why.
        if (/key/i.test(err)) speakBrowser(clean);
        else addMsg("kit", "*(🔊 voice off — Fish: " + (String(err).slice(0, 70) || "unavailable") + " · fix this agent's voice id in Settings → Voices)*");
      }
    } catch (_) { if (speakBtn) speakBtn.classList.remove("playing"); vmHide(); addMsg("kit", "*(🔊 couldn't reach Fish — staying text)*"); }
  }
  if (speakBtn) speakBtn.onclick = () => {
    if (!active) return;
    const on = !getVoiceOn(active); setVoiceOn(active, on); paintSpeak();
    if (!on) { if (_audioEl) { try { _audioEl.pause(); } catch (_) {} } try { speechSynthesis.cancel(); } catch (_) {} speakBtn.classList.remove("playing"); }
  };

  // top-tier Claude/Opus cloud model selected → keep the God-Particle gold/pink window glow.
  function isTopClaude(v){
    if (!v || v.indexOf("cloud:") !== 0) return false;
    const lbl = (modelSel && modelSel.selectedOptions && modelSel.selectedOptions[0]) ? modelSel.selectedOptions[0].textContent : "";
    return /claude|opus/i.test(lbl);
  }
  function applyGlow(){
    win.classList.toggle("tier-max", isTopClaude(modelSel ? modelSel.value : ""));
    win.classList.remove("tier-private");   // private no longer applies (lever retired)
    try { paintEffort(); } catch (e) {}      // keep the effort chip's 🔱 God stop locked/unlocked with the brain
  }

  // rebuild the option list from /api/models: auto, then local 🖥, then cloud ☁ — or, when there's no
  // cloud slot, a final "➕ Add a cloud model…" affordance that opens the key flow (never a fake model).
  function populateModels(j){
    if (!modelSel) return;
    const locals = (j && Array.isArray(j.models)) ? j.models : [];
    const clouds = (j && Array.isArray(j.cloud)) ? j.cloud : [];
    let html = '<option value="auto">Auto (local)</option>';
    const _seen = new Set();
    locals.forEach(id => { const base = String(id).replace(/:\d+$/, "");   // collapse duplicate LM Studio instances (gemma, gemma:2, gemma:3 → ONE)
      if (_seen.has(base)) return; _seen.add(base);
      html += '<option value="' + base + '">🖥 ' + base + '</option>'; });
    clouds.forEach(c => { if (c && c.id) html += '<option value="' + c.id + '">' + (c.label || c.id) + '</option>'; });
    if (!clouds.length) html += '<option value="__addkey">➕ Add a cloud model…</option>';
    modelSel.innerHTML = html;
    // show THIS agent's saved model; a stale/removed id falls back to "auto" (no phantom option)
    const want = getAgentModel(active);
    const has = [...modelSel.options].some(o => o.value === want);
    modelSel.value = has ? want : "auto";
    applyGlow();
    try { paintCrew(); } catch (_) {}
  }
  function refreshModels(){
    fetch("/api/models").then(r => r.json()).then(j => populateModels(j)).catch(() => populateModels(null));
  }
  // re-sync the dropdown to whatever agent is now active (called from setActive + refreshRoster)
  function syncModelToActive(){
    if (!modelSel) return;
    const want = getAgentModel(active);
    const has = [...modelSel.options].some(o => o.value === want);
    modelSel.value = has ? want : "auto";
    applyGlow();
    try { paintCrew(); } catch (_) {}
    try { paintSpeak(); } catch (_) {}
  }

  if (modelSel) modelSel.onchange = () => {
    const v = modelSel.value;
    if (v === "__addkey") { if (window.openKeys) window.openKeys("brain"); modelSel.value = getAgentModel(active); return; }
    setAgentModel(active, v);
    { let _c = getAgentCrew(active); if (_c.indexOf(v) >= 0) setAgentCrew(active, _c.filter(x => x !== v)); paintCrew(); if (crewPop) crewPop.classList.remove("open"); }   // a brain can't be both lead AND its own crew member
    applyGlow();
  };
  { const _kl = win.querySelector(".kt-keylink"); if (_kl) _kl.onclick = () => { if (window.openKeys) window.openKeys("brain"); }; }

  // ── CREW (per-agent BREADTH) — back THIS agent with a team of OTHER brains the user picks. The
  //    agent you dragged in stays the LEAD (it speaks + drives the room); the crew weighs in and the
  //    agent synthesizes the best of it. Opt-in, per-agent. Storage mirrors the model picker:
  //    built-ins → dmv_agent_crew_<id>; user-made → a `crew` field on the dmv_characters entry.
  //    NOT the same as the front-door "Your Crew" roster — this is one agent's backing brains. ──
  const crewBtn = win.querySelector("#ktCrew");
  let crewPop = null;
  function cwEsc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function getAgentCrew(ch){
    if (!ch) return [];
    try {
      if (ch.mine) return Array.isArray(ch.crew) ? ch.crew : [];
      const v = localStorage.getItem("dmv_agent_crew_" + ch.id); const a = v ? JSON.parse(v) : [];
      return Array.isArray(a) ? a : [];
    } catch (_) { return []; }
  }
  function setAgentCrew(ch, arr){
    if (!ch) return;
    arr = (arr || []).filter(Boolean);
    if (ch.mine) {
      ch.crew = arr;
      try { const all = JSON.parse(localStorage.getItem("dmv_characters") || "[]");
        const i = all.findIndex(c => c && c.id === ch.id);
        if (i >= 0) { all[i].crew = arr; localStorage.setItem("dmv_characters", JSON.stringify(all));
          window.dispatchEvent(new CustomEvent("dmv-characters-changed")); } } catch (_) {}
    } else {
      try { localStorage.setItem("dmv_agent_crew_" + ch.id, JSON.stringify(arr)); } catch (_) {}
    }
  }
  function paintCrew(){
    if (!crewBtn) return;
    const n = getAgentCrew(active).length;
    crewBtn.textContent = n ? ("🧠 crew ×" + n) : "+ crew";
    crewBtn.classList.toggle("on", n > 0);
  }
  // candidate backups = every brain in the model dropdown EXCEPT auto/add-key and the agent's own lead
  function crewOptions(){
    const lead = modelSel ? modelSel.value : "auto", out = [];
    if (modelSel) [...modelSel.options].forEach(o => {
      if (o.value === "auto" || o.value === "__addkey" || o.value === lead) return;
      out.push({ id: o.value, label: o.textContent });
    });
    return out;
  }
  function renderCrewPop(){
    if (!crewPop) { crewPop = document.createElement("div"); crewPop.className = "kit-crewpop"; document.body.appendChild(crewPop); }
    const opts = crewOptions(), sel = getAgentCrew(active);
    const leadLbl = (modelSel && modelSel.selectedOptions[0]) ? modelSel.selectedOptions[0].textContent : "this agent";
    const who = (active && active.name) || "this agent";
    let html = '<h5>🧠 ' + cwEsc(who) + "'s crew</h5>" +
      '<div class="cw-sub">Pick other brains to back ' + cwEsc(who) + ' up — they weigh in, ' + cwEsc(who) + ' gives you the answer.</div>' +
      '<div class="cw-lead">🎖️ Lead (answers): ' + cwEsc(leadLbl.replace(/^☁ ?/, "")) + '</div>';
    if (!opts.length) {
      html += '<div class="cw-empty">No other brains yet — a crew needs more than one. <a data-cw-keys>Add a cloud key →</a><br><span style="color:#7E92A0">One OpenRouter key gives you Claude, GPT, Grok, Gemini &amp; more.</span></div>';
    } else {
      opts.forEach(o => { const on = sel.indexOf(o.id) >= 0;
        html += '<label><input type="checkbox" data-cw="' + cwEsc(o.id) + '"' + (on ? " checked" : "") + '>' + cwEsc(o.label.replace(/^☁ ?/, "")) + '</label>'; });
    }
    crewPop.innerHTML = html;
    const kk = crewPop.querySelector("[data-cw-keys]"); if (kk) kk.onclick = () => { if (window.openKeys) window.openKeys("brain"); };
    crewPop.querySelectorAll("[data-cw]").forEach(cb => cb.onchange = () => {
      let cur = getAgentCrew(active); const id = cb.getAttribute("data-cw");
      if (cb.checked) { if (cur.indexOf(id) < 0) cur = cur.concat([id]); } else cur = cur.filter(x => x !== id);
      setAgentCrew(active, cur); paintCrew();
    });
  }
  if (crewBtn) crewBtn.onclick = (e) => {
    e.stopPropagation();
    if (crewPop && crewPop.classList.contains("open")) { crewPop.classList.remove("open"); return; }
    renderCrewPop();
    const r = crewBtn.getBoundingClientRect();
    crewPop.style.top = (r.bottom + 6) + "px";
    crewPop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 260)) + "px";
    crewPop.classList.add("open");
  };
  document.addEventListener("click", (e) => {
    if (crewPop && crewPop.classList.contains("open") && !crewPop.contains(e.target) && e.target !== crewBtn && !(crewBtn && crewBtn.contains(e.target))) crewPop.classList.remove("open");
  });
  paintCrew();

  // ── EFFORT LEVER (agent window) — tap to set how hard THIS agent thinks; rides every /api/kit call
  //    as `effort`. 🔱 God only unlocks on a Claude brain (same as the main chat); on a Claude brain the
  //    backend now injects the "show out" depth layer AT THIS LEVEL, so a docked Claude really shows out
  //    instead of getting the same prompt a 4B model gets. ──
  var kitEffort = "low";
  var effortBtn = win.querySelector("#ktEffort");
  var EFFORT_STOPS = [{ v: "low", t: "⚡ Quick" }, { v: "medium", t: "🧠 Balanced" }, { v: "high", t: "🔥 Deep" }];
  var EFFORT_GOD = { v: "max", t: "🔱 God" };
  function effortStops() { return isTopClaude(modelSel ? modelSel.value : "") ? EFFORT_STOPS.concat([EFFORT_GOD]) : EFFORT_STOPS; }
  function paintEffort() {
    if (!effortBtn) return;
    var stops = effortStops();
    if (!stops.some(function (s) { return s.v === kitEffort; })) kitEffort = "high";   // God lost (brain isn't Claude) → drop to Deep
    var cur = stops.filter(function (s) { return s.v === kitEffort; })[0] || stops[0];
    effortBtn.textContent = cur.t;
    effortBtn.classList.toggle("god", kitEffort === "max");
  }
  if (effortBtn) effortBtn.onclick = function () {
    var stops = effortStops();
    var i = stops.findIndex(function (s) { return s.v === kitEffort; }); if (i < 0) i = 0;
    kitEffort = stops[(i + 1) % stops.length].v;
    paintEffort();
  };
  paintEffort();
  refreshModels();
  window.addEventListener("ark:providers-changed", () => setTimeout(refreshModels, 80));
  window.addEventListener("focus", refreshModels);

  // ── merge in user-made characters, paint the roster, then default to Kit ──
  function refreshRoster(reactivate) {
    const prevId = active && active.id;
    CHARACTERS = rebuildCharacters();
    // keep the currently-active character if it still exists; pull its fresh data in
    const still = CHARACTERS.find(c => c.id === prevId);
    if (still) active = still;
    buildRoster();
    if (typeof syncModelToActive === "function") syncModelToActive();   // re-sync picker to the (possibly refreshed) active agent
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
  // DON'T auto-pop the agent window on a plain room visit (a merely-REMEMBERED agent stays ready but CLOSED,
  // out of the way). It opens only when explicitly brought — dragged in, summoned (?summon=1), or in Agent
  // Forge. "Summon agent" calls __kitOpen(); a front-page drag carries ?brain/?char. A warm handoff self-opens.
  if (explicit || room === "character") win.classList.add("open");
  setActive(bring, explicit || room === "character");

  // live refresh when a character is saved/edited/deleted (same tab via CustomEvent,
  // other tabs via storage). Best-effort — never disrupts an in-progress chat.
  function onMineChanged() { refreshRoster(true); }
  window.addEventListener("dmv-characters-changed", onMineChanged);
  window.addEventListener("storage", e => { if (!e || e.key === "dmv_characters" || e.key === null) onMineChanged(); });

  // ── ask the active character (carries `character`; backend may route per-character later) ──
  let busy = false;
  async function ask() {
    if (dockMicStop) dockMicStop();   // pressing send (or auto-send) stops the mic recording — restart it to talk again
    // ── DOCKED-AGENT FIX (Studio). If she's parented to stem(s) and you give a fix command
    //    ("brighter", "less harsh", "fix it"…), she DOES it — clamped-safe, in-house, free —
    //    instead of just talking. Guarded so it's a pure no-op in every other room / when
    //    nothing's parented / when it's not a fix verb (then the brain answers as normal). ──
    if (window.DMV_DOCK_FIX && !busy) {
      const dq = input.value.trim();
      if (dq) {
        try {
          const res = await window.DMV_DOCK_FIX(dq, (active && active.id) || "");
          if (res && res.handled) {
            addMsg("you", dq); input.value = ""; input.style.height = "auto";
            addMsg("kit", res.reply); winSpr && winSpr.setSpeed && winSpr.setSpeed(2);
            if (getVoiceOn(active)) { try { playTTS(res.reply, getVoiceModelId(active)); } catch (_) {} }   // 🔊 she says what she just did, too
            lastVoiceTone = null; lastVoiceBlob = null;
            return;
          }
        } catch (_) {}
      }
    }
    let q = input.value.trim(); if ((!q && !pendingImage && !pendingAudio) || busy) return;   // allow an image- OR audio-only ask
    busy = true; go.disabled = true;
    const sentImage = pendingImage;
    const sentAudio = pendingAudio;
    // 🔊→📝 UNCENSOR: if the browser bleeped a cuss (***) and we recorded the mic take, re-transcribe via Whisper
    if (lastVoiceBlob && /\*/.test(q)) {
      try {
        const dataUrl = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(lastVoiceBlob); });
        const tr = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audio: dataUrl, audio_name: "voice.webm" }) }).then(r => r.json());
        if (tr && tr.text && tr.text.trim() && !/\*/.test(tr.text)) q = tr.text.trim();
      } catch (_) {}
    }
    addMsg("you", q || (sentAudio ? "🎵 " + (sentAudio.name || "audio") : "(image)"));
    if (sentImage) { const im = document.createElement("img"); im.src = sentImage;
      im.style.cssText = "max-width:130px;border-radius:9px;margin-top:5px;display:block;border:1px solid rgba(120,182,205,.4);";
      body.appendChild(im); body.scrollTop = body.scrollHeight; }
    input.value = ""; input.style.height = "auto"; pendingImage = ""; pendingAudio = null; renderPic();
    const think = addMsg("kit", active.name + (sentAudio ? " is having a listen…" : "'s on it…")); think.classList.add("think"); winSpr.setSpeed(9);
    try {
      // base body is unchanged for Kit + the preview cast. User-made (mine) characters ALSO
      // carry persona/knowledge/charName/charCraft so the backend answers genuinely as them.
      // 🎙 RICH VOICE + 🔊 VOICE MODE — fold the live tone read + the spoken-delivery directive into the prompt (mirrors the main chat)
      let voiceFold = "";
      if (lastVoiceTone && lastVoiceTone.ok) {
        if (lastVoiceTone.kind === "sung") {
          const shaky = lastVoiceTone.confidence < 0.5 ? " (the read was shaky — fine to tell me to run it back)" : "";
          voiceFold += "\n\n[🎙 Rich Voice — performed live, dry vocal, measured: " + lastVoiceTone.line + "." + shaky
            + " Be the engineer in the room: my style is never 'wrong,' but call the pitch/timing straight and we fix it in post. Only claim what you can actually hear.]";
        } else { voiceFold += "\n\n[🎙 voice (how I said it): " + lastVoiceTone.line + "]"; }
      }
      if (getVoiceOn(active)) {
        voiceFold += "\n\n[VOICE MODE — your reply is read aloud in your REAL voice (Fish Audio S2). Talk like a person, not a song:\n"
          + "• MIRROR MY EMOTION. Read how I sound from the [🎙 Rich Voice] note + my words, and match it: I'm down/sad -> [sad] or [whispering] or [comforting]; I'm hyped/happy -> [excited] or [joyful]; I praise you / say good job -> [grateful] or [joyful] or [proud]; I say you messed up -> [embarrassed] then [sincere]; things going wrong / I'm stressed -> [worried] or [nervous]; I'm chill -> [relaxed]; I impress you -> [surprised] or [amused].\n"
          + "• Put ONE tag right before the words it colors — about one every 2-3 sentences, never every line. Use ONLY these EXACT tags: [whispering] [soft tone] [sad] [excited] [joyful] [delighted] [embarrassed] [proud] [grateful] [confident] [curious] [serious] [empathetic] [comforting] [sincere] [relaxed] [amused] [chuckling] [laughing] [surprised] [worried] [nervous] [frustrated] [confused]. NO other bracket words. Tags are hidden from the reader.\n"
          + "• Natural flowing phrases. Do NOT trail off with \"…\" and do NOT use ellipses — finish every sentence and END on a period. No markdown, no emoji, no stage directions.\n"
          + "• If I sang or held a note, SAY you heard it — call the vibe or the pitch.]";
      }
      const payload = { room, message: (q || (sentImage && !sentAudio ? "Look at this image and write a great prompt I can generate from it." : "")) + voiceFold, character: active.id, tier, model: getAgentModel(active), effort: kitEffort };
      lastVoiceTone = null; lastVoiceBlob = null;   // the take is consumed — fresh read next mic press
      { const _crew = getAgentCrew(active); if (_crew && _crew.length) payload.crew = _crew; }   // CREW: the user-picked backing brains for THIS agent
      if (handoff && handoff.brief) { payload.handoff = handoff.brief; handoff = null; }   // seed the room ONCE with the chat brief, then run on the room's own thread
      if (sentImage) payload.image = sentImage;
      if (sentAudio) { payload.audio = sentAudio.dataURL; payload.audio_meta = sentAudio.meta || {}; payload.audio_name = sentAudio.name || "audio"; }   // HEAR it: Whisper transcript + the free measured numbers
      // session-aware: if this room exposes a live snapshot (the studio does), hand the agent the REAL session
      if (typeof window.dmvSessionSnapshot === "function") { const snap = window.dmvSessionSnapshot(); if (snap) payload.session = snap; }
      if (active.mine) {
        payload.persona = active.persona || "";
        payload.knowledge = active.knowledge || "";
        payload.charName = active.name || "";
        payload.charCraft = active.craftLabel || active.craft || "";
        payload.agentId = active.id;   // backend loads this agent's distilled pack and injects its rules
      }
      const r = await fetch("/api/kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json(); think.remove();
      let reply = j.reply || "Hm, I blanked — ask me again?";
      if (active.preview && !active.mine) reply = "*(" + active.name + " is a preview character — answering through the room brain for now)*\n\n" + reply;
      addMsg("kit", getVoiceOn(active) ? stripVoiceTags(reply) : reply);   // hide spoken-only [tags] from the bubble when voice is on
      // ── VOICE: speak the reply when 🔊 is on for this agent (Fish Audio in its voice; browser voice if no key) ──
      if (getVoiceOn(active)) { try { playTTS(reply, getVoiceModelId(active)); } catch (_) {} }   // playTTS gets the FULL reply so Fish performs the [tags]
      // ── LEARNS AS YOU WORK — fire-and-forget: distill this real exchange into the agent's pack.
      //    Only for user (mine) agents with a real question (built-in Kit/Tiff NEVER write a user pack);
      //    repaints ONLY when the model found genuine, durable rules (res.added > 0) — never on empties. ──
      if (active.mine && q && q.trim().length >= 25) {
        // provenance + signal: learn from what the USER said/did + the REAL room state — NEVER the agent's
        // own reply (that'd bank the bot's advice as your rule), and skip trivial turns ("thanks", "ok").
        const raw = "USER: " + q + (payload.session ? "\nROOM STATE:\n" + payload.session : "");
        fetch("/api/agents/" + encodeURIComponent(active.id) + "/train", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: active.id, name: active.name, craft: active.craftLabel || active.craft || "", kind: "work", raw, context: room })
        }).then(r => r.json()).then(res => {
          if (res && res.added > 0) { active.trained = Math.min(20, res.trained | 0); persistTrained(active.id, res.trained);
            addMsg("kit", "*(+" + res.added + " learned — " + res.trained + "/20 trained)*"); }
        }).catch(() => {});
      }
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
    let viaWake = false, silenceT = null;                  // a WAKE-WORD capture auto-sends after a short pause (hands-free)
    micIsListening = function(){ return listening; };
    function clearSilence(){ if (silenceT) { clearTimeout(silenceT); silenceT = null; } }
    function finishEar(){                                  // 🎙 close the ear, keep the tone read for the next send
      if (!voiceListen) return;
      const h = voiceListen; voiceListen = null;
      let sum = null; try { sum = h.stop(); } catch(_){}
      vmHide();
      if (sum && sum.ok) lastVoiceTone = sum;
    }
    const reset = () => { listening = false; clearSilence(); micBtn.classList.remove("rec"); micBtn.textContent = "🎙"; micBtn.title = "Talk to type — press, speak, it types for you"; finishEar(); viaWake = false; if (wakeOn) startWake(); };
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
        if (viaWake && full.trim()) { clearSilence(); silenceT = setTimeout(() => { if (dockMicStop) dockMicStop(); ask(); }, 2300); }   // wake capture: ~2.3s pause → send it hands-free
      };
      rec.onerror = ev => { const err = ev && ev.error;
        if (err === "no-speech" || err === "aborted") return;   // transient (a pause) — let onend auto-restart
        manualStop = true; reset(); addMsg("kit", "🎙 " + errText(err)); };
      rec.onend = () => {
        committed += lastFinal; lastFinal = "";            // keep what was said before the pause/restart
        if (committed && !/\s$/.test(committed)) committed += " ";
        if (!manualStop && listening) { try { startRec(); return; } catch (_) {} }   // keep listening through pauses
        reset();
        if (!got && !viaWake) addMsg("kit", "🎙 didn't catch anything — press the mic and talk; your words land in the box as you go.");
      };
      try { rec.start(); } catch (err) { reset(); addMsg("kit", "🎙 couldn't start the mic — " + ((err && err.message) || err)); }
    }
    function startMicCapture(opts){
      if (listening) return;
      pauseWake();                                          // only one recognizer at a time (wake listener stands down)
      manualStop = false; got = false; viaWake = !!(opts && opts.viaWake);
      committed = input.value ? input.value.replace(/\s*$/, "") + " " : "";   // start from whatever's already typed
      lastVoiceTone = null; lastVoiceBlob = null;                              // fresh take — drop any prior read
      if (active && !getVoiceOn(active)) { setVoiceOn(active, true); paintSpeak(); }   // 🔊 talk = she answers in voice (auto-on)
      try { if (window.DMV_EAR && DMV_EAR.startListen) { vmShow("you"); voiceListen = DMV_EAR.startListen(function(lv){ vmLevel(lv); }, function(blob){ lastVoiceBlob = blob; }); } } catch(_){}   // 🎙 ear + live meter + recording
      listening = true; micBtn.classList.add("rec"); micBtn.textContent = "■"; micBtn.title = "Listening… press to stop"; input.focus();
      startRec();
    }
    micBtn.onclick = () => {
      if (listening) { manualStop = true; clearSilence(); rec && rec.stop(); return; }   // press again = stop (you read it + hit ➤)
      startMicCapture();
    };
    dockMicStart = startMicCapture;                         // the wake word hands its command capture to this
    dockMicStop = function(){ if (listening) { manualStop = true; clearSilence(); try { rec && rec.stop(); } catch(_){} } finishEar(); };   // SEND auto-stops the mic
  })();
  if (wakeOn) startWake();                                  // resume the always-on wake listener if it was left enabled
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
