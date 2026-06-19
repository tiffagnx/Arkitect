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

  // ── modal ──
  const ov = document.createElement("div"); ov.className = "as-overlay";
  ov.innerHTML = `
    <div class="as-panel" role="dialog" aria-label="Settings">
      <div class="as-head"><h2>SETTINGS</h2><button class="as-x" id="asClose">✕</button></div>
      <div class="as-body">
        <div class="as-sec" id="asUpdSec" style="display:none"><div class="as-upd" id="asUpd"></div></div>
        <div class="as-sec">
          <h3>Cloud models &amp; API keys — make ARKITECT smarter</h3>
          <div class="as-sub">Add a provider with <b>your own API key</b> and its model shows up in your <b>chat model picker</b> (☁) and powers <b>Swarm</b> research. Keys stay on this machine — nothing is shared. On a light PC, this is how you run a frontier brain — flat-monthly picks like <b>Featherless</b> &amp; <b>Z.ai GLM</b>, or free <b>Groq</b>.</div>
          <div class="as-steps"><b>Never done this? It's 3 steps:</b><ol><li>Pick a provider in the <b>Provider</b> dropdown below — <b>Groq</b> is free and fast.</li><li>Click <b>"get a free key ↗"</b> right under it — that opens their site. Make a free account and copy the key they give you.</li><li>Paste it in the <b>API key</b> box and hit <b>Save</b>. Done — Swarm research now runs on your key.</li></ol></div>
          <div class="as-slots" id="asSlots"><div class="as-empty">loading…</div></div>
          <div class="as-formhead">＋ Add a provider</div>
          <div class="as-form" id="asForm">
            <div class="as-field"><label>Provider</label><select id="asPreset"></select><div class="h" id="asHint"></div></div>
            <div class="as-field"><label>API key — your own free key</label><input id="asKey" type="password" placeholder="paste your key here" autocomplete="off" /></div>
            <button type="button" class="as-advtoggle" id="asAdvToggle">⚙ Advanced — name, model &amp; URL (auto-filled, leave them) ▾</button>
            <div class="as-adv" id="asAdv">
              <div class="as-frow">
                <div class="as-field"><label>Name</label><input id="asName" placeholder="Groq" /></div>
                <div class="as-field"><label>Model</label><div class="as-modelrow"><input id="asModel" list="asModelList" placeholder="llama-3.3-70b-versatile" /><button type="button" class="as-listbtn" id="asListModels" title="List this provider's current models (uses your key)">↻ list</button></div><datalist id="asModelList"></datalist><div class="h" id="asModelHint"></div></div>
              </div>
              <div class="as-field"><label>Base URL</label><input id="asBase" placeholder="https://api.groq.com/openai/v1" /></div>
            </div>
            <div class="as-btns">
              <button class="save" id="asSave">Save</button>
              <button id="asTest">Test</button>
              <button class="ghost" id="asCancel">Clear</button>
              <span class="as-status" id="asStatus"></span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const open = () => { ov.classList.add("open"); load(); checkAppUpdate(); };
  const close = () => ov.classList.remove("open");
  window.arkOpenSettings = open;   // let the "Make ARKITECT smarter" CTA (and anything else) open Settings
  gear.onclick = open;
  $("asClose").onclick = close;
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

  function setStatus(t, cls) { const s = $("asStatus"); s.textContent = t; s.className = "as-status " + (cls || ""); }

  async function loadPresets() {
    const r = await fetch("/api/swarm/presets").then(r => r.json()).catch(() => ({ presets: [] }));
    PRESETS = r.presets || [];
    const sel = $("asPreset"); sel.innerHTML = "";
    PRESETS.forEach((p, i) => { const o = document.createElement("option"); o.value = i; o.textContent = p.name; sel.appendChild(o); });
    sel.onchange = applyPreset; applyPreset();
  }
  function applyPreset() {
    const p = PRESETS[+$("asPreset").value]; if (!p) return;
    if (p.name !== "Custom") { $("asName").value = p.name; $("asBase").value = p.base_url; $("asModel").value = (p.models_hint || "").split(",")[0].trim(); }
    else { $("asName").value = ""; $("asBase").value = ""; }
    // good-model dropdown for this provider (vision / tool-use / reasoning picks) — editable
    const dl = $("asModelList"); if (dl) { dl.innerHTML = ""; (p.models_hint || "").split(",").map(s => s.trim()).filter(Boolean).forEach(m => { const o = document.createElement("option"); o.value = m; dl.appendChild(o); }); }
    const hint = (p.free && p.free !== "—" ? `${p.free}. ` : "") + (p.models_hint ? `models: ${p.models_hint}.` : "");
    const el = $("asHint"); el.textContent = hint;
    if (p.key_url) { el.appendChild(document.createTextNode(" · ")); const a = document.createElement("a"); a.href = p.key_url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "get a free key ↗"; el.appendChild(a); }
  }
  async function loadProviders() {
    const r = await fetch("/api/swarm/providers").then(r => r.json()).catch(() => ({ providers: [] }));
    const list = r.providers || []; const el = $("asSlots");
    if (!list.length) { el.innerHTML = `<div class="as-empty">No keys yet — add one below to turn on Swarm research.</div>`; return; }
    el.innerHTML = "";
    list.forEach(p => {
      const d = document.createElement("div"); d.className = "as-slot" + (p.enabled ? "" : " off");
      d.innerHTML =
        `<div class="nm">${p.name}${p.grounded ? '<span class="as-tag web">🌐</span>' : ''}<span class="as-tag ${p.enabled ? "on" : "no"}">${p.enabled ? "ON" : "OFF"}</span></div>
         <div class="meta">${p.model || "(no model)"} · key: ${p.key_masked || "—"}</div>
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
  async function load() { loadPresets(); loadProviders(); }

  // ── APP-WIDE UPDATER — on every room (the gear is everywhere). Checks GitHub Releases for the
  //    WHOLE app; if a newer version is out, badges the gear + offers a one-click whole-app update. ──
  const UPD_REPO = "tiffagnx/Arkitect";
  function cmpVer(a, b) { const p = s => String(s || "").replace(/^v/i, "").split(/[.\-+]/).map(n => parseInt(n, 10) || 0); const A = p(a), B = p(b), n = Math.max(A.length, B.length); for (let i = 0; i < n; i++) { const d = (A[i] || 0) - (B[i] || 0); if (d) return d < 0 ? -1 : 1; } return 0; }
  async function checkAppUpdate() {
    const box = $("asUpd"), sec = $("asUpdSec"); if (!box) return;
    let cur = "?"; try { cur = (await fetch("/api/version").then(r => r.json())).version || "?"; } catch (e) { }
    let rel = null; try { const r = await fetch("https://api.github.com/repos/" + UPD_REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }); if (r.ok) rel = await r.json(); } catch (e) { }
    const tag = rel && (rel.tag_name || rel.name);
    if (sec) sec.style.display = "";
    if (tag && cmpVer(tag, cur) > 0) {
      const zip = (rel.assets || []).find(a => /\.zip$/i.test(a.name || ""));
      const url = (zip && zip.browser_download_url) || rel.zipball_url || ("https://github.com/" + UPD_REPO + "/releases/latest");
      const ver = String(tag).replace(/^v/i, "");
      box.className = "as-upd avail";
      box.innerHTML = `<span>⬆ <b>Update available</b> — v${cur} → v${ver}. Updates the whole app (every room), keeps your sessions &amp; keys.</span><button class="as-upd-btn" id="asUpdGo">Install</button>`;
      gear.classList.add("upd");
      box.querySelector("#asUpdGo").onclick = () => installAppUpdate(url, ver);
    } else {
      box.className = "as-upd";
      box.innerHTML = `<span>✓ ARKITECT <b>v${cur}</b> — you're on the latest.</span>`;
      gear.classList.remove("upd");
    }
  }
  async function installAppUpdate(url, ver) {
    const box = $("asUpd");
    box.innerHTML = `<span>Saving + downloading v${ver}…</span>`;
    try {
      const r = await fetch("/api/studio/update/stage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, version: ver }) }).then(r => r.json());
      if (!r.ok) throw new Error(r.error || "couldn't stage the update");
      box.className = "as-upd avail";
      box.innerHTML = `<span>✓ <b>v${ver} is ready.</b> ARKITECT restarts to finish — your sessions &amp; keys stay put.</span><button class="as-upd-btn" id="asUpdRestart">Restart now</button>`;
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
      const dl = $("asModelList"); dl.innerHTML = ""; (r.models || []).forEach(m => { const o = document.createElement("option"); o.value = m; dl.appendChild(o); });
      const hint = $("asModelHint"); if (hint) hint.textContent = (r.models || []).length + " live models" + (r.total > (r.models || []).length ? (" (of " + r.total + ", showing first " + r.models.length + ")") : "") + " — click the Model box to pick";
      setStatus("✓ pulled " + (r.models || []).length + " live models", "ok");
      $("asModel").focus();
    } else setStatus("couldn't list models: " + (r.error || "?"), "bad");
  };
  $("asCancel").onclick = () => { ["asName","asModel","asBase","asKey"].forEach(id => { $(id).value = ""; }); setStatus(""); };
  $("asAdvToggle").onclick = () => { $("asAdv").classList.toggle("open"); };
  $("asTest").onclick = async () => {
    const body = { base_url: $("asBase").value.trim(), model: $("asModel").value.trim(), api_key: $("asKey").value.trim() };
    if (!body.base_url || !body.model || !body.api_key) { setStatus("fill in base URL, model and key first", "bad"); return; }
    setStatus("testing…");
    const r = await fetch("/api/swarm/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()).catch(() => ({ ok: false, error: "couldn't reach it" }));
    setStatus(r.ok ? `✓ works — "${(r.reply || "ok").slice(0, 30)}"` : `✕ ${r.error}`, r.ok ? "ok" : "bad");
  };
  $("asSave").onclick = async () => {
    const payload = { name: $("asName").value.trim(), base_url: $("asBase").value.trim(), model: $("asModel").value.trim(), api_key: $("asKey").value.trim(), enabled: true, grounded: /generativelanguage/i.test($("asBase").value) };
    if (!payload.name || !payload.base_url || !payload.model || !payload.api_key) { setStatus("need name, base URL, model and key", "bad"); return; }
    const r = await saveProvider(payload);
    if (r.ok) { ["asName","asModel","asBase","asKey"].forEach(id => { $(id).value = ""; }); setStatus("✓ saved — added to your providers", "ok"); } else setStatus(r.error || "save failed", "bad");
  };
})();
