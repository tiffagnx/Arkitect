/* ARKITECT — Settings panel (gear → modal). The findable home for plugging in
   YOUR OWN LLM API keys for swarm research (so people you share ARKITECT with use
   their keys, not yours). Self-injecting; include on any page. Reuses the same
   /api/swarm/* endpoints as the Swarm room. Scoped `as-` classes — no collisions. */
(function () {
  if (window.__arkSettings) return;
  window.__arkSettings = true;

  const css = `
  .as-gear{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;margin-left:8px;
    border-radius:10px;cursor:pointer;color:rgba(206,210,218,.8);font-size:17px;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);transition:all .14s;}
  .as-gear:hover{color:#E9EAED;border-color:rgba(95,180,206,.55);background:rgba(62,156,184,.10);transform:rotate(30deg);}
  .as-overlay{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;
    background:rgba(6,7,10,.62);backdrop-filter:blur(4px);}
  .as-overlay.open{display:flex;}
  .as-panel{width:min(580px,94vw);max-height:88vh;overflow-y:auto;border-radius:18px;
    background:linear-gradient(180deg,rgba(26,27,33,.98),rgba(18,19,24,.98));
    border:1px solid rgba(255,255,255,.10);box-shadow:0 30px 80px rgba(0,0,0,.6);
    font-family:Inter,system-ui,sans-serif;color:#E9EAED;animation:asRise .18s cubic-bezier(.2,.8,.2,1);}
  @keyframes asRise{from{opacity:0;transform:translateY(12px) scale(.98);}}
  .as-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 12px;border-bottom:1px solid rgba(255,255,255,.08);}
  .as-head h2{font:800 16px Oxanium,sans-serif;letter-spacing:.16em;color:#CFE6EE;}
  .as-x{cursor:pointer;border:none;background:none;color:rgba(206,210,218,.7);font-size:20px;line-height:1;}
  .as-x:hover{color:#E9EAED;}
  .as-body{padding:16px 20px 20px;}
  .as-sec{margin-bottom:8px;}
  .as-sec h3{font:700 10px 'Space Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(198,201,208,.6);margin-bottom:6px;}
  .as-sub{font:400 12.5px Inter;color:rgba(198,201,208,.7);line-height:1.55;margin-bottom:12px;}
  .as-sub b{color:#9CD3E4;}
  .as-steps{font:400 12px Inter;color:rgba(198,201,208,.82);background:rgba(62,156,184,.06);border:1px solid rgba(62,156,184,.18);border-radius:12px;padding:11px 14px;margin-bottom:14px;line-height:1.6;}
  .as-steps b{color:#CFE6EE;}
  .as-steps ol{margin:6px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:5px;}
  .as-steps a{color:#9CD3E4;}
  .as-slots{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}
  .as-empty{font:400 12.5px Inter;color:rgba(198,201,208,.55);padding:10px 2px;}
  .as-slot{border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:11px 13px;background:rgba(255,255,255,.025);}
  .as-slot.off{opacity:.55;}
  .as-slot .nm{font:700 13px Oxanium;letter-spacing:.03em;display:flex;align-items:center;gap:7px;}
  .as-slot .meta{font:400 10.5px 'Space Mono';color:rgba(198,201,208,.6);word-break:break-all;line-height:1.5;margin-top:3px;}
  .as-slot .row{display:flex;gap:6px;margin-top:8px;}
  .as-slot button{font:500 10.5px Inter;padding:5px 10px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);color:rgba(206,210,218,.85);}
  .as-slot button:hover{color:#E9EAED;border-color:rgba(95,180,206,.5);}
  .as-slot button.del:hover{border-color:rgba(229,86,109,.5);color:#FF9DAB;}
  .as-tag{font:600 8px 'Space Mono';padding:2px 6px;border-radius:6px;letter-spacing:.04em;}
  .as-tag.on{background:rgba(70,214,168,.14);color:#7fe8c0;} .as-tag.no{background:rgba(255,255,255,.06);color:rgba(198,201,208,.6);}
  .as-tag.web{background:rgba(62,156,184,.16);color:#9CD3E4;}
  .as-addbtn{width:100%;font:600 12.5px Inter;padding:10px;border-radius:11px;cursor:pointer;color:#0B1417;
    background:linear-gradient(120deg,#5FB4CE,#3E9CB8);border:none;box-shadow:0 4px 16px rgba(62,156,184,.3);}
  .as-formhead{font:700 12px Oxanium,sans-serif;letter-spacing:.08em;color:#CFE6EE;margin:10px 0 2px;}
  .as-form{display:flex;flex-direction:column;gap:11px;margin-top:4px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px;}
  .as-advtoggle{align-self:flex-start;background:none;border:none;cursor:pointer;color:rgba(198,201,208,.6);font:500 11px Inter;padding:2px 0;text-align:left;}
  .as-advtoggle:hover{color:#9CD3E4;}
  .as-adv{display:none;flex-direction:column;gap:11px;}
  .as-adv.open{display:flex;}
  .as-form.open{display:flex;}
  .as-field{display:flex;flex-direction:column;gap:5px;}
  .as-field label{font:600 10px 'Space Mono';letter-spacing:.12em;text-transform:uppercase;color:rgba(198,201,208,.6);}
  .as-field input,.as-field select{width:100%;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);
    color:#E9EAED;border:1px solid rgba(255,255,255,.10);font:400 13px Inter;outline:none;color-scheme:dark;}
  .as-field input:focus,.as-field select:focus{border-color:rgba(62,156,184,.55);}
  .as-field select option{background:#15161A;}
  .as-field .h{font:400 10.5px Inter;color:rgba(198,201,208,.6);line-height:1.5;}
  .as-field .h a{color:#9CD3E4;}
  .as-frow{display:flex;gap:10px;flex-wrap:wrap;} .as-frow .as-field{flex:1;min-width:160px;}
  .as-btns{display:flex;gap:8px;align-items:center;}
  .as-btns button{font:600 12px Inter;padding:9px 15px;border-radius:10px;cursor:pointer;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.05);color:#E9EAED;}
  .as-btns .save{background:linear-gradient(120deg,#5FB4CE,#3E9CB8);color:#0B1417;border:none;}
  .as-btns .ghost{color:rgba(198,201,208,.7);}
  .as-status{font:400 11.5px 'Space Mono';} .as-status.ok{color:#7fe8c0;} .as-status.bad{color:#FF9DAB;}
  .as-gear{position:relative;}
  .as-gear.upd::after{content:"";position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;background:#D9A441;box-shadow:0 0 7px #D9A441;animation:asPulse 1.5s ease-in-out infinite;}
  @keyframes asPulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  .as-upd{display:flex;align-items:center;gap:10px;font:500 12.5px Inter;color:rgba(198,201,208,.85);padding:11px 13px;border-radius:12px;border:1px solid var(--hairline);background:rgba(255,255,255,.025);margin-bottom:14px;line-height:1.5;}
  .as-upd.avail{border-color:rgba(217,164,65,.5);background:rgba(217,164,65,.08);color:#F0D49A;}
  .as-upd b{color:#CFE6EE;}
  .as-upd a{color:#9CD3E4;}
  .as-upd-btn{margin-left:auto;flex:none;font:600 11.5px Inter;padding:7px 14px;border-radius:9px;cursor:pointer;border:none;color:#0B1417;background:linear-gradient(120deg,#E6C16A,#D9A441);}
  .as-upd-btn:hover{filter:brightness(1.08);}
  .as-modelrow{display:flex;gap:6px;} .as-modelrow input{flex:1;min-width:0;}
  .as-listbtn{flex:none;white-space:nowrap;font:600 10.5px Inter;padding:0 11px;border-radius:10px;cursor:pointer;color:#9CD3E4;background:rgba(62,156,184,.10);border:1px solid rgba(95,180,206,.35);}
  .as-listbtn:hover{color:#E9EAED;border-color:rgba(95,180,206,.6);background:rgba(62,156,184,.18);}
  .as-listbtn:disabled{opacity:.6;cursor:default;}
  /* Connect to Claude Desktop (MCP) */
  .as-mcpdot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#6b7178;vertical-align:middle;margin-left:7px;}
  .as-mcpdot.amber{background:#D9A441;box-shadow:0 0 7px rgba(217,164,65,.7);}
  .as-mcpdot.green{background:#46d6a8;box-shadow:0 0 7px rgba(70,214,168,.7);}
  .as-mcprecheck{float:right;background:none;border:none;cursor:pointer;color:rgba(198,201,208,.55);font:500 10px Inter;padding:2px 0;}
  .as-mcprecheck:hover{color:#9CD3E4;}
  .as-mcpconsent{font:400 11px Inter;color:rgba(198,201,208,.6);margin-top:8px;line-height:1.5;}
  .as-mcpconsent b{color:#9CD3E4;}
  .as-mcpcode{font:400 11px 'Space Mono',monospace;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:10px 12px;white-space:pre-wrap;word-break:break-all;color:#bfe6f2;margin-top:8px;max-height:170px;overflow:auto;line-height:1.55;}
  .as-mcpok{font:400 12.5px Inter;color:rgba(206,210,218,.85);line-height:1.6;background:rgba(70,214,168,.07);border:1px solid rgba(70,214,168,.25);border-radius:12px;padding:11px 13px;}
  .as-mcpok b{color:#7fe8c0;}
  .as-mcperr{font:400 11.5px Inter;color:#F0D49A;background:rgba(230,193,106,.08);border:1px solid rgba(230,193,106,.28);border-radius:10px;padding:9px 12px;margin-top:8px;line-height:1.5;}
  .as-mcperr b{color:#fbe7b6;}
  .as-mcprow{display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap;}
  .as-mcprow button{font:600 11.5px Inter;padding:7px 13px;border-radius:9px;cursor:pointer;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.05);color:#E9EAED;}
  .as-mcprow button:hover{border-color:rgba(95,180,206,.5);}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const $ = (id) => document.getElementById(id);
  let PRESETS = [];

  // ── gear: drop into the topbar if there is one, else float top-right ──
  const gear = document.createElement("button");
  gear.className = "as-gear"; gear.title = "Settings — plug in your API keys"; gear.textContent = "⚙";
  const host = document.querySelector(".topbar") || document.querySelector(".top");
  if (host) host.appendChild(gear);
  else { gear.style.position = "fixed"; gear.style.top = "12px"; gear.style.right = "14px"; gear.style.zIndex = "99998"; document.body.appendChild(gear); }

  // version badge intentionally REMOVED from every room — it lives ONLY on the front page (the chat,
  // next to brain/engine). Owner's call: one version readout, one place. (Was here next to the gear.)

  // ── modal ──
  const ov = document.createElement("div"); ov.className = "as-overlay";
  ov.innerHTML = `
    <div class="as-panel" role="dialog" aria-label="Settings">
      <div class="as-head"><h2>SETTINGS</h2><button class="as-x" id="asClose">✕</button></div>
      <div class="as-body">
        <div class="as-sec" id="asUpdSec" style="display:none"><div class="as-upd" id="asUpd"></div></div>
        <div class="as-sec" id="asMcpSec">
          <h3>Connect to Claude Desktop<span id="asMcpDot" class="as-mcpdot"></span><button type="button" class="as-mcprecheck" id="asMcpRecheck">Re-check</button></h3>
          <div class="as-sub">Let Claude — or Claude Code — drive DeMartinville from outside. Talk to your agents, make a beat, cut a video, generate art, run any room, just by asking Claude.</div>
          <div id="asMcpBody"><div class="as-empty">checking…</div></div>
        </div>
        <div class="as-sec">
          <h3>Cloud models &amp; API keys — make DeMartinville smarter</h3>
          <div class="as-sub">Add a provider with <b>your own API key</b> and its model shows up in your <b>chat model picker</b> (☁) and powers <b>Swarm</b> research. Keys stay on this machine — nothing is shared. On a light PC, this is how you run a frontier brain — flat-monthly picks like <b>Featherless</b> &amp; <b>Z.ai GLM</b>, or free <b>Groq</b>.</div>
          <div class="as-steps"><b>Never done this? It's 3 steps:</b><ol><li>Pick a provider in the <b>Provider</b> dropdown below — <b>Groq</b> is free and fast.</li><li>Click <b>"get a free key ↗"</b> right under it — that opens their site. Make a free account and copy the key they give you.</li><li>Paste it in the <b>API key</b> box and hit <b>Save</b>. Done — Swarm research now runs on your key.</li></ol></div>
          <div class="as-note" style="margin-top:10px;padding:9px 11px;border-radius:9px;background:rgba(230,193,106,.08);border:1px solid rgba(230,193,106,.28);font:600 11.5px Inter,sans-serif;color:#E6D3A8;line-height:1.5">⚠️ On privacy: a cloud model sends your inputs to that provider to answer — it's not 100% on-your-machine like a local model. <b>Your agent's knowledge always stays on your computer; we never see it.</b> Each provider below shows whether it trains on your data — pick one that doesn't for sensitive work.</div>
          <div class="as-slots" id="asSlots"><div class="as-empty">loading…</div></div>
          <div class="as-formhead">＋ Add a provider</div>
          <div class="as-form" id="asForm">
            <div class="as-field"><label>Provider</label><select id="asPreset"></select><div class="h" id="asHint"></div></div>
            <div class="as-field"><label>Models — pick one or more (each becomes its own brain)</label>
              <div id="asModelChips" style="margin:2px 0 7px"></div>
              <div class="as-modelrow"><input id="asModel" list="asModelList" placeholder="type or pick a model, then ＋ add" /><button type="button" class="as-listbtn" id="asAddModel" title="Add this model to the list">＋ add</button><button type="button" class="as-listbtn" id="asListModels" title="List ALL this provider's models (uses your key)">↻ all</button></div>
              <datalist id="asModelList"></datalist>
              <div class="h" id="asModelHint">One key, as many models as you want. Pick models that can SEE + THINK + use TOOLS — the agent drives the app with tool calls, so tiny/old models can't run it. Hit <b>↻ all</b> to list the agent-ready ones.</div>
            </div>
            <div class="as-field"><label>API key — your own free key</label><input id="asKey" type="password" placeholder="paste your key here" autocomplete="off" /></div>
            <button type="button" class="as-advtoggle" id="asAdvToggle">⚙ Advanced — name &amp; URL (auto-filled, leave them) ▾</button>
            <div class="as-adv" id="asAdv">
              <div class="as-frow">
                <div class="as-field"><label>Name</label><input id="asName" placeholder="Groq" /></div>
                <div class="as-field"><label>Base URL</label><input id="asBase" placeholder="https://api.groq.com/openai/v1" /></div>
              </div>
            </div>
            <div class="as-btns">
              <button class="save" id="asSave">Save</button>
              <button id="asTest">Test</button>
              <button class="ghost" id="asCancel">Clear</button>
              <span class="as-status" id="asStatus"></span>
            </div>
          </div>
        </div>
        <div class="as-sec" id="asVoiceSec">
          <h3>Voices — make your agents talk back 🔊</h3>
          <div class="as-sub">Add your <b>Fish Audio</b> key and your agents <b>speak their replies in a real voice</b>, with emotion. No key? They still talk with the free built-in browser voice. The <b>voice model id</b> is a voice/clone from fish.audio — leave the default for the stock voice, or paste your own clone's id.</div>
          <div class="as-field"><label>Fish Audio API key</label>
            <div class="as-modelrow"><input id="asFishKey" type="password" placeholder="paste your Fish Audio key here" autocomplete="off" /><button type="button" class="as-listbtn" id="asFishSave">Save</button></div>
            <div class="h"><a href="https://fish.audio/go-api/api-keys/" target="_blank" rel="noopener">get a Fish Audio key ↗</a></div>
          </div>
          <div class="as-field"><label>Voice model id per agent</label>
            <div id="asVoiceRows" style="margin-top:4px"></div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const open = (anchor) => {
    ov.classList.add("open"); load(); checkAppUpdate(); loadMcp(); loadVoices();
    const _rc = $("asMcpRecheck"); if (_rc) _rc.onclick = loadMcp;
    if (anchor === "mcp") { const s = $("asMcpSec"); if (s) setTimeout(() => s.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }
    if (anchor === "voices") { const s = $("asVoiceSec"); if (s) setTimeout(() => s.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }
  };
  const close = () => ov.classList.remove("open");
  window.arkOpenSettings = open;   // let the "Make ARKITECT smarter" CTA (and anything else) open Settings
  gear.onclick = open;
  $("asClose").onclick = close;
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

  // ── Voices section: Fish Audio key (server-side, the SAME key /api/tts reads) + per-agent voice ids
  //    (local). ONE keys hub — every key the app uses gets its own labeled section here. As we add
  //    features that need a key, add a section; never a second window. (Owner's law: one place for keys.) ──
  const VOICE_DEFAULTS = { tiff: "1811b3df4182496dbf94eb3a46bdc1e2", kit: "5312c04032034388bb6bac44c94c804d" };
  const VOICE_AGENTS = [{ id: "tiff", name: "Tiffany" }, { id: "kit", name: "Kit" }];
  function loadVoiceModels(){ try { return JSON.parse(localStorage.getItem("dmv_voice_models") || "{}"); } catch(_){ return {}; } }
  function saveVoiceModel(id, mid){ const m = loadVoiceModels(); if (mid) m[id] = mid; else delete m[id]; try { localStorage.setItem("dmv_voice_models", JSON.stringify(m)); } catch(_){} }
  // one labeled voice-id row: [name] [id input] [Save]. Saves to dmv_voice_models[id] (what /api/tts reads).
  function _voiceRow(wrap, id, name, defVal, sub){
    const vm = loadVoiceModels();
    const row = document.createElement("div"); row.className = "as-modelrow"; row.style.cssText = "margin:0 0 7px;align-items:center";
    const lab = document.createElement("span");
    lab.style.cssText = "min-width:78px;font:700 11.5px Inter,sans-serif;color:#CFE6EE;display:flex;flex-direction:column;line-height:1.15";
    lab.innerHTML = name + (sub ? '<span style="font:600 9px Inter,sans-serif;color:#8AA2AE">' + sub + '</span>' : '');
    const inp = document.createElement("input"); inp.type = "text"; inp.autocomplete = "off"; inp.placeholder = name + " voice id";
    inp.value = vm[id] || defVal || "";
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "as-listbtn"; btn.textContent = "Save";
    btn.onclick = () => { saveVoiceModel(id, inp.value.trim()); btn.textContent = "✓ saved"; setTimeout(() => { btn.textContent = "Save"; }, 1200); };
    row.appendChild(lab); row.appendChild(inp); row.appendChild(btn); wrap.appendChild(row);
  }
  async function loadVoices(){
    let saved = false; try { saved = !!((await fetch("/api/cloud/key?provider=fish_audio").then(r => r.json())).has_key); } catch(_){}
    const k = $("asFishKey"); if (k) k.placeholder = saved ? "✓ Fish Audio key saved — paste to replace" : "paste your Fish Audio key here";
    const wrap = $("asVoiceRows"); if (!wrap) return; wrap.innerHTML = "";
    // built-ins — always here, labeled
    _voiceRow(wrap, "tiff", "Tiffany", VOICE_DEFAULTS.tiff, "built-in");
    _voiceRow(wrap, "kit", "Kit", VOICE_DEFAULTS.kit, "built-in");
    // YOUR agents — auto-grows as you build more (10, 100, however many), each gets its own slot
    let mine = [];
    try { const arr = JSON.parse(localStorage.getItem("dmv_characters") || "[]"); if (Array.isArray(arr)) mine = arr.filter(c => c && c.id && c.mine && c.name && c.name.trim()); } catch(_){}
    if (mine.length){
      const hd = document.createElement("div"); hd.style.cssText = "margin:12px 0 5px;font:700 10px 'Space Mono',monospace;letter-spacing:.06em;color:#9FCFDD"; hd.textContent = "YOUR AGENTS";
      wrap.appendChild(hd);
      mine.forEach(c => _voiceRow(wrap, c.id, c.name, c.voiceModelId || ""));
    }
    // ＋ build more — agents are created in the builder, then show up here automatically with their own voice slot
    const add = document.createElement("button"); add.type = "button"; add.className = "as-listbtn"; add.style.cssText = "margin-top:10px";
    add.textContent = mine.length ? "＋ Build another agent" : "＋ Build your own agent (it gets its own voice here)";
    add.onclick = () => { location.href = "/static/character.html"; };
    wrap.appendChild(add);

    // 🎵 Pitch check — tap a known note, HEAR it, and confirm the detector reads it right.
    //    For someone who "just sings" and doesn't know notes: the tone is the answer key.
    const pt = document.createElement("div"); pt.style.cssText = "margin-top:15px;padding-top:13px;border-top:1px solid rgba(255,255,255,.08)";
    pt.innerHTML = '<div style="font:700 11.5px Inter,sans-serif;color:#CFE6EE;margin-bottom:3px">🎵 Test pitch detection</div>' +
      '<div class="as-sub" style="margin:0 0 9px">Tap a note — you\'ll HEAR it, and it confirms the detector reads it right. Then sing that same note into the 🎙 mic in chat and watch the "heard you" chip match. (You don\'t need to know notes — the tone is the answer key.)</div>' +
      '<div id="asPitchBtns" style="display:flex;flex-wrap:wrap;gap:6px"></div>' +
      '<div id="asPitchOut" style="margin-top:9px;font:600 12.5px Inter,sans-serif;color:#9FCFDD;min-height:17px"></div>';
    wrap.appendChild(pt);
    const btnWrap = pt.querySelector("#asPitchBtns"), out = pt.querySelector("#asPitchOut");
    ["C3", "E3", "G3", "A3", "C4", "E4", "A4"].forEach(nm => {
      const b = document.createElement("button"); b.type = "button"; b.className = "as-listbtn"; b.textContent = nm;
      b.onclick = () => {
        try {
          if (window.DMV_EAR && window.DMV_EAR.playNote) window.DMV_EAR.playNote(nm);
          const t = (window.DMV_EAR && window.DMV_EAR.testNote) ? window.DMV_EAR.testNote(nm) : null;
          if (t && t.ok) out.innerHTML = "♪ played <b>" + nm + "</b> → detector reads <b>" + t.detected + "</b> " +
            (t.detected === nm ? '<span style="color:#7FD3B0">✓ spot on</span>' : '(' + (t.cents >= 0 ? "+" : "") + t.cents + "¢)");
          else out.textContent = "♪ played " + nm + " — listen + sing it back in chat";
        } catch (e) { out.textContent = "couldn't play that one"; }
      };
      btnWrap.appendChild(b);
    });
  }
  (function wireVoices(){
    const sb = $("asFishSave"), kb = $("asFishKey"); if (!sb || !kb) return;
    sb.onclick = async () => {
      const v = kb.value.trim(); if (!v) { setStatus("paste a Fish Audio key first", "bad"); return; }
      sb.textContent = "saving…";
      try {
        const r = await fetch("/api/cloud/key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: "fish_audio", api_key: v }) }).then(r => r.json());
        if (r && r.ok) { sb.textContent = "✓ saved"; kb.value = ""; loadVoices(); }
        else setStatus("couldn't save key", "bad");
      } catch(_){ setStatus("couldn't save key", "bad"); }
      setTimeout(() => { if (sb.textContent !== "Save") sb.textContent = "Save"; }, 1500);
    };
  })();

  function setStatus(t, cls) { const s = $("asStatus"); s.textContent = t; s.className = "as-status " + (cls || ""); }

  async function loadPresets() {
    const r = await fetch("/api/swarm/presets").then(r => r.json()).catch(() => ({ presets: [] }));
    PRESETS = r.presets || [];
    const sel = $("asPreset"); sel.innerHTML = "";
    PRESETS.forEach((p, i) => { const o = document.createElement("option"); o.value = i; o.textContent = p.name; sel.appendChild(o); });
    sel.onchange = applyPreset; applyPreset();
  }
  // Some presets' models_hint is a DESCRIPTION, not a model id (OpenRouter = "pick any model id ending
  // in :free"). Dropping that sentence into the Model box made Save/Test choke ("that's not a model").
  // Map those to a REAL default model + real suggestions so it just works; the user can still change it
  // or hit ↻ for the live list.
  // MULTI-MODEL — one key → as many models as you want, each saved as its own brain (slot). The
  // chips are the models the user picked; Save loops them into one provider record each (same key).
  let pendingModels = [];
  function renderChips() {
    const c = $("asModelChips"); if (!c) return; c.innerHTML = "";
    pendingModels.forEach((m, i) => {
      const ch = document.createElement("span");
      ch.style.cssText = "display:inline-flex;align-items:center;gap:5px;font:600 11px Inter,sans-serif;color:#BFE6F2;background:rgba(62,156,184,.16);border:1px solid rgba(120,182,205,.45);border-radius:14px;padding:3px 4px 3px 9px;margin:0 5px 5px 0;";
      ch.innerHTML = '<span></span><button type="button" style="border:none;background:rgba(0,0,0,.25);color:#9FCFDD;width:15px;height:15px;border-radius:50%;cursor:pointer;font-size:9px;line-height:1">✕</button>';
      ch.firstChild.textContent = m;
      ch.querySelector("button").onclick = () => { pendingModels.splice(i, 1); renderChips(); };
      c.appendChild(ch);
    });
  }
  function addModel(m) { m = (m || ($("asModel").value || "")).trim(); if (!m) return; if (pendingModels.indexOf(m) < 0) pendingModels.push(m); $("asModel").value = ""; renderChips(); $("asModel").focus(); }

  // Some presets' models_hint is a DESCRIPTION, not a model id (OpenRouter = "pick any model id ending
  // in :free"). Map those to a REAL default model + suggestions so the Model box never gets a sentence.
  const _hintIsDesc = (h) => /pick any|any open|ending in|any model|openai-compat/i.test(h || "");
  const _provDefaults = {
    // OpenRouter ids use DOTS (claude-opus-4.8, not -4-8) and rotate fast — these are the CURRENT
    // capable set: every one SEES (vision) + THINKS + TOOL-CALLS, which the agent needs. The ↻ all
    // pull also filters the live catalog to vision+tools models, so it self-heals when versions bump.
    openrouter: { model: "google/gemini-3.5-flash", picks: ["google/gemini-3.5-flash", "anthropic/claude-opus-4.8", "anthropic/claude-sonnet-4.6", "x-ai/grok-4.3", "openai/gpt-5.5", "google/gemini-3.1-flash-lite"] },
  };
  const _provKey = (p) => (p.name || "").toLowerCase().replace(/[^a-z]/g, "");
  function applyPreset() {
    const p = PRESETS[+$("asPreset").value]; if (!p) return;
    const firstHint = (p.models_hint || "").split(",")[0].trim();
    const def = _provDefaults[_provKey(p)];
    const defModel = _hintIsDesc(firstHint) ? (def ? def.model : "") : firstHint;   // never a placeholder sentence
    if (p.name !== "Custom") { $("asName").value = p.name; $("asBase").value = p.base_url; }
    else { $("asName").value = ""; $("asBase").value = ""; }
    $("asModel").value = "";                          // the input is for ADDING more models
    pendingModels = defModel ? [defModel] : [];       // start with the provider's default model selected
    renderChips();
    // model suggestions (datalist): real picks when the hint was a description, else the preset's list.
    const dl = $("asModelList"); if (dl) { dl.innerHTML = "";
      const picks = _hintIsDesc(firstHint) ? (def ? def.picks : []) : (p.models_hint || "").split(",").map(s => s.trim()).filter(Boolean);
      picks.forEach(m => { const o = document.createElement("option"); o.value = m; dl.appendChild(o); }); }
    const hint = (p.free && p.free !== "—" ? `${p.free}. ` : "") + (p.models_hint ? `models: ${p.models_hint}.` : "");
    const el = $("asHint"); el.textContent = hint;
    if (p.key_url) { el.appendChild(document.createTextNode(" · ")); const a = document.createElement("a"); a.href = p.key_url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "get a free key ↗"; el.appendChild(a); }
    // honest privacy label: 🔒 doesn't train on you (green) · ⚠️ free tier may (gold) · ☁ check policy (neutral)
    if (p.privacy) { const pv = document.createElement("div"); pv.textContent = p.privacy;
      pv.style.cssText = "margin-top:6px;font:600 11px Inter,sans-serif;line-height:1.4;color:" + (/^⚠/.test(p.privacy) ? "#E6C16A" : /^🔒/.test(p.privacy) ? "#7FD3B0" : "#9FB4C0");
      el.appendChild(pv); }
  }
  // an honest privacy label for a SAVED provider, looked up from its matching preset (by base URL, then name)
  function privacyFor(p) {
    const n = s => (s || "").replace(/\/+$/, "").toLowerCase();
    const hit = (PRESETS || []).find(x => x.base_url && p.base_url && n(x.base_url) === n(p.base_url))
             || (PRESETS || []).find(x => x.name && p.name && x.name.toLowerCase() === p.name.toLowerCase());
    return (hit && hit.privacy) ? hit.privacy : "☁ Your inputs go to this provider — check its data-use policy";
  }
  async function loadProviders() {
    const r = await fetch("/api/swarm/providers").then(r => r.json()).catch(() => ({ providers: [] }));
    const list = r.providers || []; const el = $("asSlots");
    if (!list.length) { el.innerHTML = `<div class="as-empty">No keys yet — add one below to turn on Swarm research.</div>`; return; }
    el.innerHTML = "";
    list.forEach(p => {
      const d = document.createElement("div"); d.className = "as-slot" + (p.enabled ? "" : " off");
      const priv = privacyFor(p);
      const pcol = /^⚠/.test(priv) ? "#E6C16A" : /^🔒/.test(priv) ? "#7FD3B0" : "#9FB4C0";
      d.innerHTML =
        `<div class="nm">${p.name}${p.grounded ? '<span class="as-tag web">🌐</span>' : ''}<span class="as-tag ${p.enabled ? "on" : "no"}">${p.enabled ? "ON" : "OFF"}</span></div>
         <div class="meta">${p.model || "(no model)"} · key: ${p.key_masked || "—"}</div>
         <div class="meta" style="margin-top:4px;color:${pcol};font-weight:600;line-height:1.4">${priv}</div>
         <div class="row">
           <button data-act="toggle">${p.enabled ? "Disable" : "Enable"}</button>
           <button class="del" data-act="del">Delete</button>
         </div>`;
      d.querySelector('[data-act="toggle"]').onclick = () => saveProvider({ id: p.id, name: p.name, base_url: p.base_url, model: p.model, enabled: !p.enabled, grounded: p.grounded });
      d.querySelector('[data-act="del"]').onclick = async () => { if (confirm(`Remove ${p.name}?`)) { await fetch(`/api/swarm/providers/${p.id}`, { method: "DELETE" }); loadProviders(); window.dispatchEvent(new Event("ark:providers-changed")); } };
      el.appendChild(d);
    });
  }
  async function saveProvider(payload) {
    const r = await fetch("/api/swarm/providers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(r => r.json()).catch(() => ({ error: "failed" }));
    await loadProviders(); window.dispatchEvent(new Event("ark:providers-changed")); return r;   // refresh the chat model picker live
  }
  async function load() { await loadPresets(); loadProviders(); }   // presets first → saved cards get the right privacy label/colour on open

  // ── APP-WIDE UPDATER — on every room (the gear is everywhere). Checks GitHub Releases for the
  //    WHOLE app; if a newer version is out, badges the gear + offers a one-click whole-app update. ──
  const UPD_REPO = "tiffagnx/Arkitect";
  let _updInfo = null, _updBtn = null;   // chat's glowing Updates button + the changelog modal it opens
  function cmpVer(a, b) { const p = s => String(s || "").replace(/^v/i, "").split(/[.\-+]/).map(n => parseInt(n, 10) || 0); const A = p(a), B = p(b), n = Math.max(A.length, B.length); for (let i = 0; i < n; i++) { const d = (A[i] || 0) - (B[i] || 0); if (d) return d < 0 ? -1 : 1; } return 0; }
  async function checkAppUpdate() {
    const box = $("asUpd"), sec = $("asUpdSec"); if (!box) return;
    // The WEB version auto-updates on refresh — the desktop "Update" button + badge don't belong here.
    if (window.DMV_AI && DMV_AI.CLOUD_MODE) { if (sec) sec.style.display = "none"; try { gear.classList.remove("upd"); } catch (e) {} return; }
    let cur = "?"; try { cur = (await fetch("/api/version").then(r => r.json())).version || "?"; } catch (e) { }
    let rel = null; try { const r = await fetch("https://api.github.com/repos/" + UPD_REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }); if (r.ok) rel = await r.json(); } catch (e) { }
    const tag = rel && (rel.tag_name || rel.name);
    if (sec) sec.style.display = "";
    if (tag && cmpVer(tag, cur) > 0) {
      // Pick the WINDOWS distributable specifically. The release also carries Mac .app zips
      // (e.g. DeMartinville-mac-arm64.zip) and "-mac-" sorts BEFORE ".zip", so a naive first-zip
      // grab downloaded the Mac build → staging failed ("no app.py / static"). Exclude platform builds.
      const zips = (rel.assets || []).filter(a => /\.zip$/i.test(a.name || ""));
      const zip = zips.find(a => !/-(mac|intel|arm64|universal|darwin)/i.test(a.name || "")) || zips[0];
      const url = (zip && zip.browser_download_url) || rel.zipball_url || ("https://github.com/" + UPD_REPO + "/releases/latest");
      const ver = String(tag).replace(/^v/i, "");
      _updInfo = { cur, ver, url, notes: (rel.body || "") };
      ensureUpdBtn();   // glowing "Update" pill in the topbar → opens the slim changelog modal
      box.className = "as-upd avail";
      box.innerHTML = `<span>⬆ <b>Update available</b> — v${cur} → v${ver}. Updates the whole app (every room), keeps your sessions &amp; keys.</span><button class="as-upd-btn" id="asUpdGo">Install</button>`;
      gear.classList.add("upd");
      box.querySelector("#asUpdGo").onclick = () => installAppUpdate(url, ver);
    } else {
      box.className = "as-upd";
      box.innerHTML = `<span>✓ DeMartinville <b>v${cur}</b> — you're on the latest.</span>`;
      gear.classList.remove("upd");
    }
  }
  function ensureUpdBtn() {
    if (!_updInfo || _updBtn) return;
    if (!document.getElementById("ark-upd-kf")) { const s = document.createElement("style"); s.id = "ark-upd-kf";
      s.textContent = "@keyframes arkUpdPulse{0%,100%{box-shadow:0 0 0 1px rgba(217,164,65,.45),0 0 9px rgba(217,164,65,.4)}50%{box-shadow:0 0 0 1px rgba(217,164,65,.7),0 0 20px rgba(217,164,65,.8)}}"; document.head.appendChild(s); }
    _updBtn = document.createElement("button"); _updBtn.id = "ark-upd-btn"; _updBtn.type = "button";
    _updBtn.textContent = "⬆ Update"; _updBtn.title = "A new version is ready — see what's new";
    _updBtn.style.cssText = "display:inline-flex;align-items:center;height:24px;padding:0 11px;margin-right:6px;border:none;border-radius:9px;cursor:pointer;font:600 11px Inter,system-ui,sans-serif;color:#14120a;background:linear-gradient(120deg,#E6C16A,#D9A441);animation:arkUpdPulse 1.6s ease-in-out infinite;";
    if (host) host.insertBefore(_updBtn, gear);
    else { _updBtn.style.position = "fixed"; _updBtn.style.top = "13px"; _updBtn.style.right = "118px"; _updBtn.style.zIndex = "99998"; document.body.appendChild(_updBtn); }
    _updBtn.onclick = openUpdModal;
  }
  function openUpdModal() {
    if (!_updInfo) return;
    const old = document.getElementById("ark-upd-modal"); if (old) old.remove();
    const E = s => String(s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const ov = document.createElement("div"); ov.id = "ark-upd-modal";
    ov.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(6,7,10,.62);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;";
    ov.innerHTML = `<div style="width:430px;max-width:92vw;background:linear-gradient(180deg,#1b1d24,#131419);border:1px solid rgba(217,164,65,.35);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.7),0 0 50px rgba(217,164,65,.12);overflow:hidden;font:400 13px Inter,system-ui,sans-serif;color:#dfe3ea">`+
      `<div style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.07)"><span style="font:700 12px 'Space Mono',ui-monospace,monospace;letter-spacing:.18em;color:#E6C16A">UPDATE READY</span><button id="aum-x" style="background:none;border:none;color:rgba(206,210,218,.7);font-size:17px;cursor:pointer;line-height:1">✕</button></div>`+
      `<div style="padding:15px 16px"><div style="font:600 15px Inter;margin-bottom:10px"><span style="color:rgba(206,210,218,.6)">v${E(_updInfo.cur)}</span> <span style="color:#E6C16A">→</span> <span style="color:#fff">v${E(_updInfo.ver)}</span></div>`+
      `<div style="max-height:228px;overflow-y:auto;white-space:pre-wrap;font:400 12px Inter;line-height:1.65;color:rgba(214,219,228,.82);background:rgba(0,0,0,.22);border-radius:10px;padding:11px 13px">${E(_updInfo.notes).slice(0, 2200) || "A newer build is ready."}</div>`+
      `<div style="font:400 10.5px Inter;color:rgba(160,166,178,.7);margin-top:9px">One click installs it — your sessions &amp; keys stay put.</div></div>`+
      `<div style="display:flex;gap:9px;justify-content:flex-end;padding:0 16px 15px"><button id="aum-close" style="font:600 12px Inter;padding:8px 15px;border-radius:9px;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#dfe3ea">Later</button><button id="aum-go" style="font:600 12px Inter;padding:8px 16px;border-radius:9px;cursor:pointer;border:none;color:#14120a;background:linear-gradient(120deg,#E6C16A,#D9A441)">Install v${E(_updInfo.ver)}</button></div></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.querySelector("#aum-x").onclick = close; ov.querySelector("#aum-close").onclick = close;
    ov.addEventListener("mousedown", e => { if (e.target === ov) close(); });
    ov.querySelector("#aum-go").onclick = () => { close(); try { gear.click(); } catch (e) {} installAppUpdate(_updInfo.url, _updInfo.ver); };
  }
  async function installAppUpdate(url, ver) {
    const box = $("asUpd");
    box.innerHTML = `<span>Saving + downloading v${ver}…</span>`;
    try {
      const r = await fetch("/api/studio/update/stage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, version: ver }) }).then(r => r.json());
      if (!r.ok) throw new Error(r.error || "couldn't stage the update");
      box.className = "as-upd avail";
      box.innerHTML = `<span>✓ <b>v${ver} is ready.</b> DeMartinville restarts to finish — your sessions &amp; keys stay put.</span><button class="as-upd-btn" id="asUpdRestart">Restart now</button>`;
      box.querySelector("#asUpdRestart").onclick = async () => { box.innerHTML = `<span>Restarting…</span>`; try { await fetch("/api/studio/update/restart", { method: "POST" }); } catch (e) { } };
    } catch (e) {
      box.innerHTML = `<span>Update failed: ${e.message}. <a href="https://github.com/${UPD_REPO}/releases/latest" target="_blank" rel="noopener">Download it manually ↗</a></span>`;
    }
  }
  checkAppUpdate();   // run once on load so the gear badges even before the panel is opened

  $("asListModels").onclick = async () => {
    const base = $("asBase").value.trim(), key = $("asKey").value.trim();
    if (!base) { setStatus("pick a provider (or fill the Base URL) first", "bad"); return; }
    const btn = $("asListModels"); btn.disabled = true; const lbl = btn.textContent; btn.textContent = "↻ …";
    const r = await fetch("/api/swarm/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ base_url: base, api_key: key }) }).then(r => r.json()).catch(() => ({ ok: false, error: "couldn't reach it" }));
    btn.disabled = false; btn.textContent = lbl;
    if (r.ok) {
      // Show ALL models in the list — vision+tools filter was hiding good models (DeepSeek, etc.)
      // that have tools but no image input. User picks what they want; capable count is informational.
      const all = r.models || [];
      const capable = r.capable || [];
      const dl = $("asModelList"); dl.innerHTML = "";
      all.forEach(m => { const o = document.createElement("option"); o.value = m; o.label = capable.includes(m) ? m + " ★" : m; dl.appendChild(o); });
      const hint = $("asModelHint"); if (hint) hint.textContent =
        all.length + " models — type to search. ★ = vision + tools (agent-ready). Others work great for chat + coding.";
      setStatus("✓ " + all.length + " models" + (capable.length ? " · " + capable.length + " vision+tools ★" : ""), "ok");
      $("asModel").focus();
    } else setStatus("couldn't list models: " + (r.error || "?"), "bad");
  };
  $("asAddModel").onclick = () => addModel();
  $("asModel").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addModel(); } });
  $("asCancel").onclick = () => { ["asName","asModel","asBase","asKey"].forEach(id => { $(id).value = ""; }); pendingModels = []; renderChips(); setStatus(""); };
  $("asAdvToggle").onclick = () => { $("asAdv").classList.toggle("open"); };
  $("asTest").onclick = async () => {
    const m = ($("asModel").value.trim()) || pendingModels[0] || "";   // test the typed/first picked model
    const body = { base_url: $("asBase").value.trim(), model: m, api_key: $("asKey").value.trim() };
    if (!body.base_url || !body.model || !body.api_key) { setStatus("add a model + your key first", "bad"); return; }
    setStatus("testing…");
    const r = await fetch("/api/swarm/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()).catch(() => ({ ok: false, error: "couldn't reach it" }));
    setStatus(r.ok ? `✓ works — "${(r.reply || "ok").slice(0, 30)}"` : `✕ ${r.error}`, r.ok ? "ok" : "bad");
  };
  $("asSave").onclick = async () => {
    const typed = $("asModel").value.trim(); if (typed) addModel(typed);   // fold an un-added typed model in
    const models = pendingModels.slice();
    const name = $("asName").value.trim(), base = $("asBase").value.trim(), key = $("asKey").value.trim();
    if (!name || !base || !key) { setStatus("need name, base URL and key", "bad"); return; }
    if (!models.length) { setStatus("pick at least one model", "bad"); return; }
    setStatus("saving " + models.length + " model" + (models.length > 1 ? "s" : "") + "…");
    const grounded = /generativelanguage/i.test(base);
    let ok = 0, lastErr = "";
    // one provider RECORD per model, same key → each shows as its own brain in the picker
    for (const m of models) { const r = await saveProvider({ name, base_url: base, model: m, api_key: key, enabled: true, grounded }); if (r && r.ok) ok++; else lastErr = (r && r.error) || "save failed"; }
    if (ok) { pendingModels = []; renderChips(); ["asModel", "asKey"].forEach(id => { $(id).value = ""; }); setStatus("✓ added " + ok + " model" + (ok > 1 ? "s" : "") + " on your key", "ok"); }
    else setStatus(lastErr, "bad");
  };

  // ── Connect to Claude Desktop (MCP) — discover + one-click setup + honest status ──
  const _E = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function _mcpJson(d) { return JSON.stringify({ mcpServers: { demartinville: { command: d.python || "python", args: [d.server || ""] } } }, null, 2); }
  function _mcpManual(d, lead) {
    return (lead ? '<div class="as-mcperr">' + _E(lead) + '</div>' : '') +
      '<div class="as-sub" style="margin:8px 0 4px">Paste this into your Claude config (<code>' + _E(d.config_path || "your Claude Desktop config file") + '</code>), then fully restart Claude Desktop:</div>' +
      '<div class="as-mcpcode">' + _E(_mcpJson(d)) + '</div>' +
      '<div class="as-mcprow"><button type="button" id="asMcpCopy">Copy</button></div>';
  }
  function _wireCopy(text) { const b = $("asMcpCopy"); if (!b) return; b.onclick = () => { try { navigator.clipboard.writeText(text); b.textContent = "Copied ✓"; setTimeout(() => { b.textContent = "Copy"; }, 1400); } catch (e) {} }; }
  function _mcpDot(state) { const dot = $("asMcpDot"); if (!dot) return; dot.className = "as-mcpdot" + (state === "configured" ? " green" : state === "stale" ? " amber" : ""); dot.title = state === "configured" ? "In your Claude config" : state === "stale" ? "Present, needs updating" : "Not set up yet"; }
  function _wireManualToggle(d) { const t = $("asMcpManualT"); if (!t) return; t.onclick = () => { const w = $("asMcpManualWrap"); if (!w) return; if (w.innerHTML) { w.innerHTML = ""; } else { w.innerHTML = _mcpManual(d, ""); _wireCopy(_mcpJson(d)); } }; }
  async function loadMcp() {
    const body = $("asMcpBody"); if (!body) return;
    _mcpDot("none");
    let d; try { d = await fetch("/api/mcp/status").then(r => r.json()); } catch (e) { body.innerHTML = '<div class="as-empty">couldn’t check status</div>'; return; }
    _mcpDot(d.state);
    if (d.state === "configured") {
      body.innerHTML = '<div class="as-mcpok"><b>✓ Set up.</b> DeMartinville is in your Claude Desktop config. If you just did this, fully <b>quit Claude Desktop and reopen it</b> (closing the window isn’t enough), then in Claude hit <b>＋ → Connectors</b> (or find the 🔨 tools icon) — “demartinville” should be listed.</div><button type="button" class="as-advtoggle" id="asMcpManualT" style="margin-top:8px">Show the config entry ▾</button><div id="asMcpManualWrap"></div>';
      _wireManualToggle(d); return;
    }
    body.innerHTML = '<div class="as-mcpconsent">You’ll need <b>Claude Desktop</b> installed. DeMartinville’s already running — that’s this. ✓</div><div class="as-mcprow"><button type="button" class="as-addbtn" id="asMcpSetup" style="width:auto;flex:1">' + (d.state === "stale" ? "Update the connection" : "Set it up for me") + '</button></div><div class="as-mcpconsent">We add one entry to your Claude Desktop config and <b>back it up first</b> — nothing of yours gets overwritten.</div><button type="button" class="as-advtoggle" id="asMcpManualT" style="margin-top:6px">Rather do it by hand? ▾</button><div id="asMcpManualWrap"></div>';
    $("asMcpSetup").onclick = () => setupMcp();
    _wireManualToggle(d);
  }
  async function setupMcp() {
    const body = $("asMcpBody"); if (!body) return;
    body.innerHTML = '<div class="as-mcpconsent">Writing the connection… (backing up your Claude config first, then adding ours)</div>';
    let r; try { r = await fetch("/api/mcp/setup", { method: "POST" }).then(x => x.json()); } catch (e) { r = { ok: false, reason: "write_failed", error: "couldn’t reach the app" }; }
    if (r.ok) {
      _mcpDot("configured");
      body.innerHTML = '<div class="as-mcpok">' + (r.already_set ? '<b>✓ Already connected.</b> DeMartinville is in your Claude Desktop config.' : '<b>✓ Done.</b> Added DeMartinville to Claude Desktop' + (r.backup ? ' (your old config is backed up)' : '') + '.') + ' One last step only you can do: <b>fully quit Claude Desktop and open it again</b> — closing the window isn’t enough. Then check <b>＋ → Connectors</b> in Claude.</div><div class="as-mcprow"><button type="button" id="asMcpRecheck2">Re-check</button></div>';
      const rc = $("asMcpRecheck2"); if (rc) rc.onclick = loadMcp;
      try { window.dispatchEvent(new Event("dmv:mcp-changed")); } catch (e) {}
      return;
    }
    if (r.reason === "mcp_package_missing") {
      body.innerHTML = '<div class="as-mcperr">One quick install first — Claude needs a small piece (the <b>mcp</b> package). Run this in your DeMartinville Python, then hit “Set it up” again:</div><div class="as-mcpcode">' + _E(r.pip || "pip install mcp") + '</div><div class="as-mcprow"><button type="button" id="asMcpRetry">Try again</button></div>';
      const rt = $("asMcpRetry"); if (rt) rt.onclick = loadMcp; return;
    }
    const lead = r.reason === "needs_manual" ? "Couldn’t auto-find your DeMartinville Python from here — here’s the quick manual way (just a copy-paste, your paths are filled in)." : r.reason === "path_too_long" ? "Your install path is too long for auto-setup — here’s the manual way:" : "Couldn’t write it automatically (" + (r.error || r.reason || "unknown") + "). Here’s the manual way:";
    body.innerHTML = _mcpManual(r, lead) + '<div class="as-mcprow"><button type="button" id="asMcpRetry">Try again</button></div>';
    _wireCopy(_mcpJson(r));
    const rt = $("asMcpRetry"); if (rt) rt.onclick = loadMcp;
  }
})();
