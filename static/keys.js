/* KEYS — one window for every API key. Per need, a few CURATED picks with the cheap/good one
   flagged, a deep link straight to that provider's key page, paste it back, saved on your
   machine. Brain keys power the cloud lane (the swarm provider store); media keys (image /
   video / SFX) save locally for those features. Injected app-wide (pinkroom-nav.js in rooms +
   a tag on the front door). Exposes window.openKeys(category). Keys never leave this machine. */
(function () {
  if (window.__keys) return; window.__keys = true;

  // ── curated MEDIA providers (image / video / sound). Verified key pages 2026-06-21 —
  //    re-check the URLs over time, providers move their dashboards. ──
  const MEDIA = [
    { id: "atlascloud", name: "Atlas Cloud", note: "Image + video, 300+ models — the cheapest", rec: true, url: "https://www.atlascloud.ai/" },
    { id: "fal",        name: "FAL",         note: "Fast image + video generation",              url: "https://fal.ai/dashboard/keys" },
    { id: "kie",        name: "KIE",         note: "One key, many models — image / video / music", url: "https://kie.ai/api-key" },
  ];
  const MEDIA_STORE = "dmv_media_keys";
  const loadMedia = () => { try { return JSON.parse(localStorage.getItem(MEDIA_STORE)) || {}; } catch (e) { return {}; } };
  function saveMedia(id, key) { const m = loadMedia(); if (key) m[id] = key; else delete m[id]; try { localStorage.setItem(MEDIA_STORE, JSON.stringify(m)); } catch (e) {} }

  const css = `
  .kw-ov { position:fixed; inset:0; z-index:100001; display:none; align-items:center; justify-content:center;
    background:rgba(6,7,10,.66); backdrop-filter:blur(4px); }
  .kw-ov.open { display:flex; }
  .kw-panel { width:560px; max-width:94vw; max-height:88vh; overflow:hidden; display:flex; flex-direction:column;
    background:linear-gradient(180deg,#1b1d24,#131419); border:1px solid rgba(120,182,205,.32); border-radius:18px;
    box-shadow:0 28px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.05); font:400 13px Inter,system-ui,sans-serif; color:#E9EAED; }
  .kw-head { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid rgba(255,255,255,.07); }
  .kw-head h2 { font:800 15px Oxanium,sans-serif; letter-spacing:.06em; color:#EAF4F8; margin:0; }
  .kw-head .sub { font:500 11px Inter; color:rgba(198,201,208,.55); }
  .kw-x { margin-left:auto; background:rgba(0,0,0,.28); border:none; color:#9FCFDD; width:24px; height:24px; border-radius:7px; cursor:pointer; font-size:13px; }
  .kw-x:hover { background:rgba(62,156,184,.3); color:#fff; }
  .kw-body { overflow-y:auto; padding:14px 16px 18px; }
  .kw-cat { font:700 10.5px 'Space Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:#8FC9DA; margin:12px 4px 9px; }
  .kw-cat:first-child { margin-top:2px; }
  .kw-card { border:1px solid rgba(255,255,255,.08); border-radius:13px; background:rgba(255,255,255,.025); padding:12px 13px; margin-bottom:10px; }
  .kw-card.rec { border-color:rgba(217,164,65,.4); background:rgba(217,164,65,.06); }
  .kw-card.hero { border-color:rgba(120,182,205,.6); background:linear-gradient(180deg,rgba(62,156,184,.14),rgba(62,156,184,.04)); box-shadow:0 0 24px rgba(62,156,184,.14); }
  .kw-card.hero .kw-nm { font-size:14.5px; }
  .kw-card.hero .kw-rec { background:linear-gradient(120deg,#7BF0E4,#3E9CB8); color:#06161b; }
  .kw-card.hero .kw-get { border-color:rgba(120,182,205,.75); background:rgba(62,156,184,.22); color:#DFF2F7; }
  .kw-crow { display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
  .kw-nm { font:700 13.5px Oxanium,sans-serif; letter-spacing:.02em; color:#EAF0F4; }
  .kw-rec { font:700 8.5px 'Space Mono',monospace; letter-spacing:.1em; color:#0C0D10; background:linear-gradient(120deg,#F0CE8C,#D9A441); padding:2px 7px; border-radius:6px; }
  .kw-saved { font:700 8.5px 'Space Mono',monospace; letter-spacing:.08em; color:#7FD3B0; margin-left:2px; }
  .kw-note { font:500 11px Inter; color:rgba(198,201,208,.6); margin-top:2px; }
  .kw-get { margin-left:auto; font:700 11px Inter; color:#9FCFDD; text-decoration:none; padding:6px 11px; border-radius:9px; border:1px solid rgba(120,182,205,.4); background:rgba(62,156,184,.08); white-space:nowrap; }
  .kw-get:hover { border-color:rgba(120,182,205,.8); background:rgba(62,156,184,.18); color:#CFE6EE; }
  .kw-paste { display:flex; gap:7px; margin-top:10px; }
  .kw-paste input { flex:1; background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.1); border-radius:9px; color:#E9EAED; font:500 12px Inter; padding:8px 11px; outline:none; }
  .kw-paste input:focus { border-color:rgba(62,156,184,.55); }
  .kw-paste button { flex:none; border:none; border-radius:9px; cursor:pointer; padding:0 15px; font:700 12px Inter; color:#08171c; background:linear-gradient(180deg,#6FC0D8,#3E9CB8); }
  .kw-paste button:disabled { opacity:.5; cursor:default; }
  .kw-foot { font:500 10.5px Inter; color:rgba(160,166,178,.6); padding:0 4px; margin-top:6px; }
  .kw-explain { font:500 11.5px Inter; line-height:1.5; color:rgba(206,210,218,.78); background:rgba(62,156,184,.06); border:1px solid rgba(120,182,205,.18); border-radius:11px; padding:9px 12px; margin:0 4px 11px; }
  .kw-explain b { color:#CFE6EE; font-weight:700; }
  .kw-explain details { margin-top:7px; }
  .kw-explain summary { cursor:pointer; color:#9FCFDD; font-weight:700; list-style:none; }
  .kw-explain summary::-webkit-details-marker { display:none; }
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const ov = document.createElement("div"); ov.className = "kw-ov";
  ov.innerHTML = `<div class="kw-panel">
    <div class="kw-head"><h2>🔑 KEYS</h2><span class="sub">cheap picks · one click to the key · paste it back</span><button class="kw-x" title="close">✕</button></div>
    <div class="kw-body" id="kwBody"></div>
  </div>`;
  document.body.appendChild(ov);
  const body = ov.querySelector("#kwBody");
  ov.querySelector(".kw-x").onclick = () => ov.classList.remove("open");
  ov.addEventListener("mousedown", e => { if (e.target === ov) ov.classList.remove("open"); });

  function card(p, opts) {
    const d = document.createElement("div"); d.className = "kw-card" + (p.rec ? " rec" : "") + (opts.hero ? " hero" : "");
    d.innerHTML =
      `<div class="kw-crow"><span class="kw-nm">${p.name}</span>${p.rec ? '<span class="kw-rec">' + (opts.recLabel || "CHEAPEST") + '</span>' : ''}` +
      `<span class="kw-saved" style="display:${opts.saved ? "inline" : "none"}">✓ saved</span>` +
      `<a class="kw-get" href="${p.url}" target="_blank" rel="noopener">Get key ↗</a></div>` +
      `<div class="kw-note">${p.note || ""}</div>` +
      `<div class="kw-paste"><input type="password" placeholder="paste your ${(p.name || '').split(/\s+[—–-]\s+/)[0].trim()} key here" autocomplete="off" /><button>Save</button></div>`;
    const inp = d.querySelector("input"), btn = d.querySelector("button"), savedTag = d.querySelector(".kw-saved");
    btn.onclick = async () => {
      const k = inp.value.trim(); if (!k) { inp.focus(); return; }
      btn.disabled = true; btn.textContent = "…";
      try {
        await opts.save(k);
        savedTag.style.display = "inline"; savedTag.textContent = "✓ saved"; savedTag.style.color = ""; savedTag.title = "";
        inp.value = ""; inp.placeholder = "saved ✓ — paste a new one to replace";
        if (opts.verify) {   // confirm the key actually works so they KNOW it landed (no guessing)
          savedTag.textContent = "✓ saved · checking…";
          let r = null; try { r = await opts.verify(k); } catch (e) {}
          if (r && r.ok) { savedTag.textContent = "✓ saved & verified"; savedTag.style.color = "#7FD3B0"; }
          else { savedTag.textContent = "✓ saved"; savedTag.title = "couldn't auto-verify from here — that's fine if your key's right"; }
        }
      } catch (e) { btn.textContent = "Retry"; }
      finally { if (btn.textContent === "…") btn.textContent = "Save"; btn.disabled = false; }
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") btn.click(); });
    return d;
  }

  async function render() {
    body.innerHTML = `<div class="kw-cat">loading…</div>`;
    // BRAIN — reuse the server's curated provider presets (they already carry key-page links +
    // free-tier notes); saving a key here turns on the cloud lane (Max Drive). ──
    let presets = [], configured = [];
    try { presets = (await fetch("/api/swarm/presets").then(r => r.json())).presets || []; } catch (e) {}
    try { configured = (await fetch("/api/swarm/providers").then(r => r.json())).providers || []; } catch (e) {}
    const haveName = new Set(configured.map(c => (c.name || "").toLowerCase()));
    body.innerHTML = "";

    // 🧭 WHAT POWERS WHAT — capability → key/model guide. So a user knows EXACTLY what to get (or
    //    install) for each thing they want to do, and what's free/local vs paid. (Owner's ask.)
    body.insertAdjacentHTML("beforeend",
      '<div style="background:linear-gradient(180deg,rgba(230,193,106,.10),rgba(255,255,255,.02));border:1px solid rgba(230,193,106,.32);border-radius:12px;padding:13px 15px;margin-bottom:16px">' +
      '<div style="font:800 13px Oxanium,sans-serif;color:#E6C16A;letter-spacing:.04em;margin-bottom:6px">🧭 WHAT YOU NEED FOR EACH THING</div>' +
      '<div style="font:500 12px Inter,sans-serif;color:#cfd6de;line-height:1.5;margin-bottom:10px">Easiest free start: <b>one Groq key</b> (no credit card) powers chat, deep thinking, <i>and</i> song transcription. Add a free <b>Gemini</b> key for seeing/images. Or grab <b>one OpenRouter key</b> for nearly everything.</div>' +
      '<div style="font:500 11.5px Inter,sans-serif;color:#aeb6c0;line-height:1.75">' +
      '💬 <b style="color:#dfe6ee">Chat / writing</b> → any key below — or 100% free + offline (install <b>LM Studio</b> + a model)<br>' +
      '👁 <b style="color:#dfe6ee">See images</b> → a vision model: Gemini (free), Claude, GPT, or Grok<br>' +
      '🎧 <b style="color:#dfe6ee">Hear a song — the SOUND</b> (loudness, brightness, mix read) → <span style="color:#7FD3B0">FREE, built in, no key</span><br>' +
      '📝 <b style="color:#dfe6ee">Hear a song — the LYRICS</b> → a <b>Groq</b> key (free Whisper). Tip: run the isolated vocal for cleaner lyrics<br>' +
      '🎨 <b style="color:#dfe6ee">Make images</b> → free on your own GPU (built-in FLUX), or a media key (Atlas/FAL/KIE) for pennies<br>' +
      '🎬 <b style="color:#dfe6ee">Make video</b> → a media key (Atlas = cheapest). <span style="color:#E6C16A">This one actually costs money</span> (~pennies/sec)<br>' +
      '🔱 <b style="color:#dfe6ee">God Mode</b> (deepest reasoning) → a paid <b>Claude</b> key; free-ish alt = Groq <code>gpt-oss-120b</code>' +
      '</div>' +
      '<div style="font:500 11px Inter,sans-serif;color:#8b94a0;line-height:1.55;margin-top:10px;border-top:1px solid rgba(255,255,255,.07);padding-top:8px">Straight talk: chat, seeing, hearing + transcription can all be <b style="color:#7FD3B0">$0</b>. Images = pennies. Video is the one that genuinely costs. Want zero cloud? LM Studio (brain) + built-in FLUX (images) run free on your machine; only video &amp; Claude God Mode need the cloud.</div>' +
      '</div>');

    const bh = document.createElement("div"); bh.className = "kw-cat"; bh.textContent = "Cloud brain — your key powers the cloud lane"; body.appendChild(bh);

    // first model in the hint, unless it's a description ("pick any model…") → no default
    const realModel = (p) => { const m = (p.models_hint || "").split(",")[0].trim(); return (m && !/pick any|any open/i.test(m)) ? m : ""; };
    const saveBrain = (p, k) => fetch("/api/swarm/providers", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: p.name, base_url: p.base_url, model: (realModel(p) || p._defModel || ""), api_key: k, enabled: true, grounded: /generativelanguage/i.test(p.base_url || "") }) })
      .then(r => r.json()).then(r => { if (!r.ok) throw new Error(r.error || "failed"); try { window.dispatchEvent(new Event("ark:providers-changed")); } catch (e) {} });
    // verify = does the KEY work? GET /models (credit-free, model-agnostic — best for OpenRouter's free tier).
    const verifyBrain = (p, k) => fetch("/api/swarm/models", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_url: p.base_url, api_key: k }) }).then(r => r.json()).then(j => ({ ok: !!(j && j.ok && j.total) })).catch(() => ({ ok: false }));

    const brain = presets.filter(p => p.name && p.name !== "Custom");
    const orp = brain.find(p => /openrouter/i.test(p.name));
    const rest = brain.filter(p => !/openrouter/i.test(p.name));

    // HERO — OpenRouter = ONE key, every model (the "I don't wanna chase ten sites" option)
    if (orp) {
      body.insertAdjacentHTML("beforeend", '<div class="kw-explain"><b>🌐 Want it all in one?</b> One OpenRouter key → Claude, GPT, Grok, Gemini, Llama &amp; dozens more — one signup, one bill. It has <b>free models</b> (the <code>:free</code> tag' + (orp.free ? ', ' + orp.free : '') + ') <i>and</i> top-tier ones for <b>pennies</b>. Heads up: the recommended default is a strong <i>paid</i> model (sees + thinks + uses tools) — swap to a <code>:free</code> one anytime if you want $0. Per-model best is a direct key below; this is the easy button.</div>');
      orp._defModel = "google/gemini-3.5-flash";   // capable default (sees + thinks + tool-calls); switch anytime
      body.appendChild(card(
        { name: "OpenRouter — one key, every model", note: "Claude · GPT · Grok · Gemini · Llama & dozens more, on a single key", rec: true, url: orp.key_url || "#" },
        { saved: haveName.has("openrouter"), hero: true, recLabel: "ONE KEY, ALL MODELS", save: (k) => saveBrain(orp, k), verify: (k) => verifyBrain(orp, k) }
      ));
      const orh = document.createElement("div"); orh.className = "kw-cat"; orh.style.marginTop = "14px"; orh.textContent = "Or connect a provider directly — all the options"; body.appendChild(orh);
    }
    body.insertAdjacentHTML("beforeend", '<div class="kw-explain"><b>Groq is free to start.</b> The rest are pay-as-you-go on your own key — and a direct key gets each provider at its best (e.g. Claude\'s real God-Mode depth).</div>');
    if (!rest.length) { const e = document.createElement("div"); e.className = "kw-foot"; e.textContent = "Add a provider in Settings (the gear)."; body.appendChild(e); }
    rest.forEach(p => body.appendChild(card(
      { name: p.name, note: (p.free && p.free !== "—" ? p.free + " · " : "") + (realModel(p) || ""), rec: /groq/i.test(p.name), url: p.key_url || "#" },
      { saved: haveName.has((p.name || "").toLowerCase()), save: (k) => saveBrain(p, k), verify: (k) => verifyBrain(p, k) }
    )));

    const mh = document.createElement("div"); mh.className = "kw-cat"; mh.textContent = "Images & video"; body.appendChild(mh);
    body.insertAdjacentHTML("beforeend", '<div class="kw-explain">Heads up — these run on <b>your own account</b>, and image/video isn\'t free: most start you with <b>free credits</b>, then it\'s pay-as-you-go (usually pennies per image). You add a little money on their site to keep going.' +
      '<details><summary>Never done this? Here\'s the whole thing ↓</summary><div style="margin-top:6px">1. Hit <b>Get key ↗</b> — it opens the provider.<br>2. Make a free account (most hand you <b>free credits</b> to try it).<br>3. When the credits run low, drop a few dollars on — pay-as-you-go, you only pay for what you actually make.<br>4. Copy your key, paste it here, hit Save. That\'s it.</div></details></div>');
    const media = loadMedia();
    MEDIA.forEach(p => body.appendChild(card(p, { saved: !!media[p.id], save: (k) => { saveMedia(p.id, k); return Promise.resolve(); } })));

    const f = document.createElement("div"); f.className = "kw-foot";
    f.textContent = "Keys are saved on this machine only — never shared, never shipped.";
    body.appendChild(f);
  }

  window.openKeys = function (cat) {
    ov.classList.add("open");
    render().then(() => {
      if (cat) { const el = [...body.querySelectorAll(".kw-cat")].find(e => (cat === "media" ? /image/i : /brain/i).test(e.textContent)); if (el) el.scrollIntoView({ block: "start" }); }
    });
  };
})();
