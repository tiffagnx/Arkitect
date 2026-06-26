/* DeMartinville — CLOUD AI ENGINE (browser-direct, bring-your-own-key).
   ───────────────────────────────────────────────────────────────────────────
   This is the foundation of the HOSTED version (demartinlabs.com IS the app).
   It is the browser-side twin of swarm_routes.py: the SAME universal slot
   contract {name, base_url, api_key, model}, but the chat call fires STRAIGHT
   FROM THE BROWSER instead of through our Python server. That single choice is
   what makes the whole cloud move work:
     • the user's LOCAL LM Studio (http://localhost:1234/v1) is reachable —
       because the browser IS on the user's machine ("localhost" = THEIR box).
     • our server never touches their key or their audio. Nothing to host.

   Drop-in: include <script src="/static/cloud-ai.js"></script> on any room.
   Rooms talk to window.DMV_AI.chatStream(...) instead of /api/chat etc.
   Additive + self-contained — including it changes nothing until a room calls it.

   CORS reality (honest, baked into the presets below):
     • Browser-direct, no proxy:  LM Studio/Ollama (flip "Enable CORS"),
       Anthropic (with the dangerous-direct-browser header), OpenRouter (gateway
       to OpenAI/Groq/Gemini/Claude models with ONE browser-callable key).
     • Blocked from the browser:  OpenAI, Groq, Google direct — they don't send
       CORS headers. Route those THROUGH OpenRouter, or use the desktop app.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.DMV_AI) return;

  var LS_PROV = "dmv_cloud_providers";   // [{id,name,base_url,model,key,enabled}]
  var LS_ACTIVE = "dmv_cloud_active";    // id of the chosen slot
  var LS_SEEN = "dmv_cloud_setup_seen";  // "1" once the user has dealt with the front-door card

  // hosted site (demartinlabs.com) vs the desktop engine (127.0.0.1:7777).
  // On the desktop we let rooms keep using the Python server; on the web they go browser-direct.
  var host = (location.hostname || "").toLowerCase();
  var IS_DESKTOP = host === "localhost" || host === "127.0.0.1" || host === "" || host === "0.0.0.0";
  // Dev/testing override: open with ?cloud=1 (or set localStorage.dmv_force_cloud="1") to
  // exercise the hosted browser-direct path on localhost; ?cloud=0 forces desktop. The URL
  // param PERSISTS to localStorage so it sticks as you click between rooms. Lets us preview
  // cloud mode without deploying. Normal users never touch this — detection is by hostname.
  try { var qp = new URLSearchParams(location.search).get("cloud"); if (qp === "1") localStorage.setItem("dmv_force_cloud", "1"); else if (qp === "0") localStorage.setItem("dmv_force_cloud", "0"); } catch (e) {}
  var FORCE = null; try { var f = localStorage.getItem("dmv_force_cloud"); if (f === "1") FORCE = true; else if (f === "0") FORCE = false; } catch (e) {}
  var CLOUD_MODE = FORCE !== null ? FORCE : !IS_DESKTOP;

  // Presets — mirror of swarm_routes.PRESETS, re-ordered for the browser and tagged with
  // whether each one actually answers a DIRECT browser call. "direct:false" still SHOWS (so
  // desktop users see it) but warns in cloud mode and points at OpenRouter.
  var PRESETS = [
    { name: "OpenRouter", base_url: "https://openrouter.ai/api/v1", model: "anthropic/claude-sonnet-4.6",
      direct: true, key_url: "https://openrouter.ai/keys",
      blurb: "One key → every model (Claude, GPT, Gemini, Llama). Works straight from the browser. Easiest." },
    { name: "Claude (Anthropic)", base_url: "https://api.anthropic.com/v1", model: "claude-sonnet-4-6",
      direct: true, key_url: "https://console.anthropic.com/settings/keys",
      blurb: "Top-tier brain. Works direct in the browser. Pay-per-use." },
    { name: "LM Studio (local)", base_url: "http://localhost:1234/v1", model: "",
      direct: true, local: true, key_url: "https://lmstudio.ai",
      blurb: "Free + private. Run a model on YOUR machine. Start its server + turn ON “Enable CORS,” then leave the URL as-is." },
    { name: "Groq", base_url: "https://api.groq.com/openai/v1", model: "openai/gpt-oss-120b",
      direct: false, key_url: "https://console.groq.com/keys",
      blurb: "Free + fast — but blocks direct browser calls. Use it via OpenRouter, or in the desktop app." },
    { name: "Google Gemini", base_url: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.5-flash",
      direct: true, key_url: "https://aistudio.google.com/apikey",
      blurb: "Big free budget. Works straight from the browser (verified). Models: gemini-2.5-flash, gemini-3.5-flash, gemini-2.5-pro." },
    { name: "xAI Grok", base_url: "https://api.x.ai/v1", model: "grok-4-fast",
      direct: true, key_url: "https://console.x.ai",
      blurb: "Grok — works straight from the browser (verified). Models: grok-4-fast, grok-4, grok-2-vision-1212." },
    { name: "Custom (any OpenAI-compatible /v1)", base_url: "", model: "",
      direct: true, key_url: "",
      blurb: "Point at any OpenAI-compatible endpoint — your own server, Ollama, anything." }
  ];

  // ── storage ────────────────────────────────────────────────────────────────
  function _read(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function _write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function getProviders() { return _read(LS_PROV, []); }
  function saveProvider(p) {
    var list = getProviders();
    if (!p.id) p.id = "p" + Math.abs((p.name + p.base_url).split("").reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) | 0; }, 7)) + "" + list.length;
    list = list.filter(function (x) { return x.id !== p.id; }).concat([p]);
    _write(LS_PROV, list);
    if (p.enabled !== false) _write(LS_ACTIVE, p.id);
    try { window.dispatchEvent(new Event("dmv:ai-changed")); } catch (e) {}
    return p.id;
  }
  function deleteProvider(id) {
    _write(LS_PROV, getProviders().filter(function (x) { return x.id !== id; }));
    if (_read(LS_ACTIVE, null) === id) localStorage.removeItem(LS_ACTIVE);   // guarded read (parity with getActive — a malformed LS value won't throw mid-delete)
    try { window.dispatchEvent(new Event("dmv:ai-changed")); } catch (e) {}
  }
  function setActive(id) { _write(LS_ACTIVE, id); try { window.dispatchEvent(new Event("dmv:ai-changed")); } catch (e) {} }
  function getActive() {
    var list = getProviders().filter(function (x) { return x.enabled !== false; });
    if (!list.length) return null;
    var id = _read(LS_ACTIVE, null);
    return list.filter(function (x) { return x.id === id; })[0] || list[0];
  }
  function isConfigured() { return !!getActive(); }

  // ── one provider call (browser-direct) ──────────────────────────────────────
  function _isLocal(base) { return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(base || ""); }
  function headersFor(slot) {
    var h = { "Content-Type": "application/json" };
    var base = (slot.base_url || "").toLowerCase();
    if (slot.key && !_isLocal(base)) h["Authorization"] = "Bearer " + slot.key;
    // Anthropic's OpenAI-compat endpoint needs this to permit a cross-origin browser call.
    if (base.indexOf("api.anthropic.com") >= 0) h["anthropic-dangerous-direct-browser-access"] = "true";
    // OpenRouter attribution (optional, but nice for the dashboard).
    if (base.indexOf("openrouter.ai") >= 0) { h["HTTP-Referer"] = location.origin; h["X-Title"] = "DeMartinville"; }
    return h;
  }
  function _corsHint(slot, err) {
    var p = (PRESETS.filter(function (x) { return (slot.base_url || "").indexOf(x.base_url) === 0 && x.base_url; })[0]) || {};
    if (CLOUD_MODE && p.direct === false)
      return slot.name + " blocks direct browser calls. Add an OpenRouter key instead (reaches the same models), or use the desktop app.";
    if (_isLocal(slot.base_url))
      return "Couldn't reach your local server. In LM Studio: start the server AND turn ON “Enable CORS,” then try again. (Safari can't reach local servers — use Chrome/Edge/Firefox.)";
    return slot.name + " couldn't be reached (" + (err && err.message ? err.message : "network/CORS") + ").";
  }

  function _buildMessages(opts) {
    if (opts.messages) return opts.messages;
    var m = [];
    if (opts.system) m.push({ role: "system", content: opts.system });
    if (opts.user != null) m.push({ role: "user", content: opts.user });
    return m;
  }

  // ── ANTHROPIC NATIVE (/v1/messages) — the REAL effort dial in the browser ────────────────────
  //    When the slot is Claude we skip the OpenAI-compat door and call Anthropic's own endpoint, so
  //    the effort lever becomes the genuine output_config.effort knob + adaptive thinking. NO
  //    temperature/top_p (they 400 on Opus 4.8). Mirrors anthropic_native_stream() server-side.
  function _isClaudeBase(base) { return ((base || "").toLowerCase().indexOf("api.anthropic.com") >= 0); }
  function _flatText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.filter(function (c) { return c && c.type === "text"; }).map(function (c) { return c.text || ""; }).join(" ");
    return "";
  }
  function _oaContentToAnthropic(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      var blocks = [];
      content.forEach(function (c) {
        if (!c || typeof c !== "object") return;
        if (c.type === "text") blocks.push({ type: "text", text: c.text || "" });
        else if (c.type === "image_url") {
          var u = (c.image_url && c.image_url.url) || "";
          if (u.indexOf("data:") === 0) { try { var p = u.split(","); var media = p[0].split(":")[1].split(";")[0]; blocks.push({ type: "image", source: { type: "base64", media_type: media, data: p[1] } }); } catch (e) {} }
          else if (u) blocks.push({ type: "image", source: { type: "url", url: u } });
        }
      });
      return blocks.length ? blocks : "";
    }
    return String(content);
  }
  async function _chatStreamClaudeNative(opts, slot) {
    var base = (slot.base_url || "").replace(/\/+$/, "");
    var url = /\/v1$/.test(base) ? base + "/messages" : base + "/v1/messages";
    var src = _buildMessages(opts), system = "", out = [];
    for (var i = 0; i < src.length; i++) {
      var m = src[i];
      if (m.role === "system") system += (typeof m.content === "string" ? m.content : _flatText(m.content)) + "\n\n";
      else if (m.role === "user" || m.role === "assistant") out.push({ role: m.role, content: _oaContentToAnthropic(m.content) });
    }
    while (out.length && out[0].role === "assistant") out.shift();   // Anthropic: first message MUST be user (a trimmed window can start on assistant → 400)
    if (!out.length) out = [{ role: "user", content: "Hello" }];
    var body = { model: opts.model || slot.model, max_tokens: opts.max_tokens || 1024, messages: out,
      output_config: { effort: opts.effort || "high" }, thinking: { type: "adaptive" }, stream: true };
    if (system.trim()) body.system = system.trim();
    var headers = { "Content-Type": "application/json", "x-api-key": slot.key || "",
      "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
    var res;
    try { res = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body), signal: opts.signal }); }
    catch (e) { if (opts.onError) opts.onError(_corsHint(slot, e)); return; }
    if (!res.ok) { var t = ""; try { t = await res.text(); } catch (e) {} if (opts.onError) opts.onError("Claude error " + res.status + ": " + String(t).slice(0, 220)); return; }
    if (!res.body || !res.body.getReader) { if (opts.onError) opts.onError("Claude: no stream"); return; }
    var reader = res.body.getReader(), dec = new TextDecoder(), buf = "";
    try {
      while (true) {
        var rr = await reader.read(); if (rr.done) break;
        buf += dec.decode(rr.value, { stream: true });
        var nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          var line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
          if (line.indexOf("data:") !== 0) continue;
          var data = line.slice(5).trim(); if (!data) continue;
          try {
            var d = JSON.parse(data);
            if (d.type === "content_block_delta" && d.delta && d.delta.type === "text_delta" && d.delta.text) { if (opts.onDelta) opts.onDelta(d.delta.text); }
            else if (d.type === "message_stop") { if (opts.onDone) opts.onDone(); return; }
            else if (d.type === "error") { if (opts.onError) opts.onError((d.error && d.error.message) || "Claude stream error"); return; }
          } catch (e) {}
        }
      }
      // flush a final event delivered with no trailing newline + no message_stop sentinel
      var _tail = buf.trim();
      if (_tail.indexOf("data:") === 0) {
        try { var _td = JSON.parse(_tail.slice(5).trim());
          if (_td.type === "content_block_delta" && _td.delta && _td.delta.type === "text_delta" && _td.delta.text && opts.onDelta) opts.onDelta(_td.delta.text);
        } catch (e) {}
      }
      if (opts.onDone) opts.onDone();
    } catch (e) { if (e.name !== "AbortError" && opts.onError) opts.onError("stream error: " + e.message); }
  }

  // ── REASONING EFFORT for browser-direct non-Claude brains (Grok / Gemini; GPT-5 isn't CORS-direct).
  //    Mirror of swarm_routes._provider_of/_effort_field: add reasoning_effort only when the MODEL
  //    supports it, send nothing when unsure, and strip temperature for GPT-5 reasoning (hard 400).
  function _providerOf(base) { base = (base || "").toLowerCase();
    if (base.indexOf("api.x.ai") >= 0) return "xai";
    if (base.indexOf("generativelanguage.googleapis") >= 0) return "gemini";
    if (base.indexOf("api.openai.com") >= 0) return "openai";
    return "other"; }
  function _effortField(provider, model, effort) {
    model = (model || "").toLowerCase(); var e = (effort || "high").toLowerCase();
    var map = function (top) { return ({ low: "low", medium: "medium", high: "high", max: top })[e] || "high"; };
    if (provider === "xai") {
      if (/fast|vision/.test(model) || !(/grok-3-mini/.test(model) || /grok-(4\.[3-9]|[5-9])/.test(model))) return null;
      return ["reasoning_effort", map("high")];
    }
    if (provider === "gemini") {
      if (!/gemini-(2\.5|3)/.test(model) || /image/.test(model)) return null;
      var v = map("high"); if (/pro/.test(model) && v === "medium") v = "low"; return ["reasoning_effort", v];
    }
    if (provider === "openai") {
      if (!/^(gpt-5|o[134])/.test(model) || /chat/.test(model)) return null;
      return ["reasoning_effort", map(/gpt-5\.[45]|codex/.test(model) ? "xhigh" : "high")];
    }
    return null;
  }

  // STREAM chat deltas. Calls opts.onDelta(text) per chunk, onDone(), onError(msg).
  // Mirrors provider_stream() in swarm_routes.py but runs in the browser.
  async function chatStream(opts) {
    var slot = opts.slot || getActive();
    if (!slot) { if (opts.onError) opts.onError("No AI key yet — add one to use AI here."); return; }
    if (_isClaudeBase(slot.base_url)) return _chatStreamClaudeNative(opts, slot);   // REAL effort dial via /v1/messages
    var url = (slot.base_url || "").replace(/\/+$/, "") + "/chat/completions";
    var body = {
      model: opts.model || slot.model,
      messages: _buildMessages(opts),
      stream: true,
      temperature: opts.temperature != null ? opts.temperature : 0.4,
      max_tokens: opts.max_tokens || 1024
    };
    if (opts.reasoning_effort) body.reasoning_effort = opts.reasoning_effort;
    // engage the provider's native reasoning dial from the effort lever (safe per-model gate)
    var _prov = _providerOf(slot.base_url), _mdl = (body.model || "").toLowerCase();
    if (_prov === "openai" && /^(gpt-5|o[134])/.test(_mdl) && !/chat/.test(_mdl)) delete body.temperature;   // GPT-5 reasoning 400s on temperature
    if (opts.effort) { var _ef = _effortField(_prov, body.model, opts.effort); if (_ef) body[_ef[0]] = _ef[1]; }
    var res;
    try {
      res = await fetch(url, { method: "POST", headers: headersFor(slot), body: JSON.stringify(body), signal: opts.signal });
    } catch (e) { if (opts.onError) opts.onError(_corsHint(slot, e)); return; }
    if (!res.ok) { var t = ""; try { t = await res.text(); } catch (e) {} if (opts.onError) opts.onError(slot.name + " error " + res.status + ": " + String(t).slice(0, 220)); return; }
    if (!res.body || !res.body.getReader) {   // no streaming support → fall back to whole-body
      try { var j = await res.json(); var c = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content; if (c && opts.onDelta) opts.onDelta(c); if (opts.onDone) opts.onDone(); } catch (e) { if (opts.onError) opts.onError("bad reply"); }
      return;
    }
    var reader = res.body.getReader(), dec = new TextDecoder(), buf = "";
    var sawContent = false, reasoningBuf = "";
    // Only stream the ANSWER (delta.content). NEVER show delta.reasoning_content — that's the
    // model's private chain-of-thought; weak/thinking models leak it inline ("The user said yo…
    // according to my personality…"). Keep reasoning only as a last-resort fallback if a model
    // returns literally nothing in content.
    var finish = function () { if (!sawContent && reasoningBuf && opts.onDelta) opts.onDelta(reasoningBuf.trim()); if (opts.onDone) opts.onDone(); };
    try {
      while (true) {
        var r = await reader.read(); if (r.done) break;
        buf += dec.decode(r.value, { stream: true });
        var nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          var line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
          if (line.indexOf("data:") !== 0) continue;
          var data = line.slice(5).trim();
          if (data === "[DONE]") { finish(); return; }
          try {
            var d = JSON.parse(data);
            var delta = (d.choices && d.choices[0] && d.choices[0].delta) || {};
            if (delta.content) { sawContent = true; if (opts.onDelta) opts.onDelta(delta.content); }
            else if (delta.reasoning_content) { reasoningBuf += delta.reasoning_content; }
          } catch (e) {}
        }
      }
      // flush a final frame delivered with no trailing newline + no [DONE] sentinel
      var _tail2 = buf.trim();
      if (_tail2.indexOf("data:") === 0) {
        var _td2 = _tail2.slice(5).trim();
        if (_td2 && _td2 !== "[DONE]") { try { var _d3 = JSON.parse(_td2);
          var _dl = (_d3.choices && _d3.choices[0] && _d3.choices[0].delta) || {};
          if (_dl.content) { sawContent = true; if (opts.onDelta) opts.onDelta(_dl.content); }
          else if (_dl.reasoning_content) { reasoningBuf += _dl.reasoning_content; }
        } catch (e) {} }
      }
      finish();
    } catch (e) { if (e.name !== "AbortError" && opts.onError) opts.onError("stream error: " + e.message); }
  }

  // Non-streaming convenience → resolves the full text (or throws).
  function chatOnce(opts) {
    return new Promise(function (resolve, reject) {
      var out = "";
      chatStream(Object.assign({}, opts, {
        onDelta: function (t) { out += t; },
        onDone: function () { resolve(out); },
        onError: function (m) { reject(new Error(m)); }
      }));
    });
  }

  async function listModels(slot) {
    slot = slot || getActive(); if (!slot) return [];
    var url = (slot.base_url || "").replace(/\/+$/, "") + "/models";
    var h = {}; if (slot.key && !_isLocal(slot.base_url)) h["Authorization"] = "Bearer " + slot.key;
    if ((slot.base_url || "").indexOf("api.anthropic.com") >= 0) h["anthropic-dangerous-direct-browser-access"] = "true";
    var r = await fetch(url, { headers: h });
    if (!r.ok) throw new Error(r.status + "");
    var j = await r.json();
    var data = j.data || j.models || (Array.isArray(j) ? j : []);
    return data.map(function (m) { return typeof m === "string" ? m : m.id; }).filter(Boolean).sort();
  }

  async function test(slot) {
    slot = slot || getActive();
    try { var txt = await chatOnce({ slot: slot, system: "Reply with the single word: ok", user: "ping", max_tokens: 5, temperature: 0 }); return { ok: true, reply: (txt || "ok").slice(0, 40) }; }
    catch (e) { return { ok: false, error: e.message }; }
  }

  // Turn a raw /models list into the CHAT models worth picking — drop the ones that can't
  // hold a conversation (embeddings, image-gen, tts, etc.), then sort CHEAPEST → priciest
  // by a tier heuristic (lite/flash before pro/opus). The modern flash/pro chat models all
  // do vision + tool-calls + thinking, which is what the rooms need.
  function _isChatModel(id) {
    id = (id || "").toLowerCase();
    return !/embed|imagen|image-?gen|\btts\b|text-to-speech|audio|whisper|speech|veo|\baqa\b|rerank|moderation|guard|safety|learnlm|-vision-only|dall-?e|sora/.test(id);
  }
  function _modelTier(id) {
    id = (id || "").toLowerCase();
    if (/flash-?lite|[-_]lite|[-_]mini|[-_]nano|8b|haiku|small|scout|[-_]fast|grok-4-fast/.test(id)) return 0;  // cheapest + fast (separators avoid matching "ge-mini")
    if (/flash|turbo/.test(id)) return 1;                                                            // cheap + fast
    if (/pro|opus|ultra|large|sonnet|grok-4(?!-fast)|grok-3/.test(id)) return 3;                     // smartest (pricier)
    return 2;                                                                                        // balanced
  }
  function _modelVer(id) { var m = (id || "").match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : 0; }
  function _tierTag(t) { return t <= 0 ? "cheapest + fast" : t === 1 ? "cheap + fast" : t === 2 ? "balanced" : "smartest (pricier)"; }
  function rankedChatModels(ids) {
    return ids.filter(_isChatModel)
      .sort(function (a, b) {
        var ta = _modelTier(a), tb = _modelTier(b); if (ta !== tb) return ta - tb;
        var va = _modelVer(a), vb = _modelVer(b); if (va !== vb) return va - vb;   // older/cheaper version first
        return a.localeCompare(b);
      })
      .map(function (id) { return { id: id, label: id + "  ·  " + _tierTag(_modelTier(id)) }; });
  }

  // ── front-door "first 10 seconds" card (minimal). Shows in cloud mode when no key is set. ──
  function openSetup(force) {
    if (document.getElementById("dmv-ai-setup")) return;
    var ov = document.createElement("div");
    ov.id = "dmv-ai-setup";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(6,7,10,.72);backdrop-filter:blur(5px);font-family:Inter,system-ui,sans-serif;";
    var opts = PRESETS.map(function (p, i) { return '<option value="' + i + '">' + p.name + (CLOUD_MODE && p.direct === false ? "  (desktop / via OpenRouter)" : "") + "</option>"; }).join("");
    ov.innerHTML =
      '<div style="width:min(520px,94vw);max-height:90vh;overflow:auto;background:linear-gradient(180deg,#1b1d24,#131419);border:1px solid rgba(95,180,206,.28);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);color:#E9EAED;padding:22px 22px 20px">' +
      '<div style="font:800 17px Oxanium,sans-serif;letter-spacing:.04em;color:#CFE6EE;margin-bottom:6px">This is DeMartinville — a whole studio in your browser</div>' +
      '<div style="font:400 13px Inter;color:rgba(198,201,208,.82);line-height:1.6;margin-bottom:14px">It runs on <b style="color:#9CD3E4">your own AI key</b>. Paste a cloud key, or point it at your local <b>LM Studio</b> to run free + private. Nothing is sent to us — your key stays in this browser.</div>' +
      '<label style="font:600 10px \'Space Mono\',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(198,201,208,.6)">Provider</label>' +
      '<select id="dmv-pp" style="width:100%;margin:5px 0 12px;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);color:#E9EAED;border:1px solid rgba(255,255,255,.12);font:400 13px Inter;color-scheme:dark">' + opts + "</select>" +
      '<div id="dmv-blurb" style="font:400 11.5px Inter;color:rgba(198,201,208,.66);line-height:1.5;margin-bottom:12px"></div>' +
      '<label style="font:600 10px \'Space Mono\',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(198,201,208,.6)">API key <span id="dmv-keyopt" style="text-transform:none;color:rgba(198,201,208,.45)"></span></label>' +
      '<div style="display:flex;gap:6px;margin:5px 0 10px">' +
      '<input id="dmv-pk" type="password" spellcheck="false" placeholder="click here, then Ctrl+V to paste" autocomplete="off" style="flex:1;min-width:0;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);color:#E9EAED;border:1px solid rgba(255,255,255,.12);font:400 13px Inter" />' +
      '<button type="button" id="dmv-eye" title="Show / hide the key" style="flex:none;width:42px;border-radius:10px;cursor:pointer;color:#9CD3E4;background:rgba(62,156,184,.12);border:1px solid rgba(95,180,206,.4);font-size:15px">👁</button>' +
      '</div>' +
      '<div id="dmv-modelwrap"><label style="font:600 10px \'Space Mono\',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(198,201,208,.6)">Model</label>' +
      '<div style="display:flex;gap:6px;margin:5px 0 4px">' +
      '<select id="dmv-pm" style="flex:1;min-width:0;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);color:#E9EAED;border:1px solid rgba(255,255,255,.12);font:400 12px \'Space Mono\',monospace;color-scheme:dark"></select>' +
      '<button type="button" id="dmv-list" title="Reload the model list (uses your key)" style="flex:none;white-space:nowrap;font:600 12px Inter;padding:0 12px;border-radius:10px;cursor:pointer;color:#9CD3E4;background:rgba(62,156,184,.12);border:1px solid rgba(95,180,206,.4)">↻</button>' +
      '</div>' +
      '<div id="dmv-modelhint" style="font:400 10.5px Inter;color:rgba(198,201,208,.55);margin-bottom:10px"></div></div>' +
      '<div id="dmv-urlwrap" style="display:none"><label style="font:600 10px \'Space Mono\',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(198,201,208,.6)">Endpoint URL</label>' +
      '<input id="dmv-purl" style="width:100%;margin:5px 0 10px;padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);color:#E9EAED;border:1px solid rgba(255,255,255,.12);font:400 12px \'Space Mono\',monospace" /></div>' +
      '<div style="display:flex;gap:8px;align-items:center;margin-top:6px">' +
      '<button id="dmv-go" style="font:700 13px Inter;padding:10px 18px;border-radius:11px;border:none;cursor:pointer;color:#0B1417;background:linear-gradient(120deg,#5FB4CE,#3E9CB8)">Test &amp; go</button>' +
      '<a id="dmv-getkey" href="#" target="_blank" rel="noopener" style="font:500 12px Inter;color:#9CD3E4">get a key ↗</a>' +
      '<button id="dmv-skip" style="margin-left:auto;font:500 12px Inter;padding:8px 12px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:none;color:rgba(198,201,208,.7);cursor:pointer">Look around first</button>' +
      '<span id="dmv-st" style="font:400 11.5px \'Space Mono\',monospace"></span></div>' +
      "</div>";
    document.body.appendChild(ov);

    var $ = function (id) { return document.getElementById(id); };
    function apply() {
      var p = PRESETS[+$("dmv-pp").value];
      $("dmv-blurb").textContent = p.blurb || "";
      $("dmv-urlwrap").style.display = (p.name.indexOf("Custom") === 0 || p.local) ? "block" : "none";
      $("dmv-purl").value = p.base_url || "";
      $("dmv-modelwrap").style.display = p.local ? "none" : "block";   // local model auto-detected
      setModelOptions([{ id: p.model || "", label: p.model || "(paste your key to load models)" }]);
      $("dmv-modelhint").textContent = p.local ? "" : "👉 paste your key → the dropdown fills with every model it can use (cheapest first)";
      $("dmv-keyopt").textContent = p.local ? "— not needed for local" : "";
      $("dmv-pk").placeholder = p.local ? "(leave blank)" : "click here, then Ctrl+V to paste";
      var gk = $("dmv-getkey"); if (p.key_url) { gk.style.display = ""; gk.href = p.key_url; } else gk.style.display = "none";
    }
    function setModelOptions(list) {
      var sel = $("dmv-pm"); if (!sel) return; var cur = sel.value;
      sel.innerHTML = "";
      list.forEach(function (m) { var o = document.createElement("option"); o.value = m.id; o.textContent = m.label; sel.appendChild(o); });
      if (cur && list.some(function (m) { return m.id === cur; })) sel.value = cur;   // keep prior pick if still there
    }
    var _listedKey = "";
    async function loadLiveModels(force) {
      var p = PRESETS[+$("dmv-pp").value];
      var slot = { base_url: ($("dmv-purl").value || p.base_url || "").trim(), key: $("dmv-pk").value.trim() };
      if (!slot.key && !p.local) { if (force) $("dmv-modelhint").textContent = "paste your key first"; return; }
      if (!force && slot.key === _listedKey) return;          // already listed this exact key
      _listedKey = slot.key;
      $("dmv-modelhint").textContent = "loading every model your key can use…";
      try {
        var ranked = rankedChatModels(await listModels(slot));
        if (!ranked.length) { $("dmv-modelhint").textContent = "no chat models came back — double-check the key"; return; }
        setModelOptions(ranked);
        $("dmv-modelhint").textContent = ranked.length + " models — cheapest first. flash = cheap+fast · pro = smartest. all do vision + tools + thinking.";
      } catch (e) { _listedKey = ""; $("dmv-modelhint").textContent = "couldn't load models: " + ((e && e.message) || e); }
    }
    $("dmv-pp").onchange = apply; apply();
    $("dmv-eye").onclick = function () { var i = $("dmv-pk"); i.type = i.type === "password" ? "text" : "password"; };
    $("dmv-list").onclick = function () { loadLiveModels(true); };
    // auto-fill the dropdown the instant a real key lands (paste = a length jump)
    $("dmv-pk").oninput = function () { if ($("dmv-pk").value.trim().length >= 18) loadLiveModels(false); };
    $("dmv-pk").onchange = function () { loadLiveModels(false); };
    $("dmv-skip").onclick = function () { _write(LS_SEEN, "1"); ov.remove(); };
    $("dmv-go").onclick = async function () {
      var p = PRESETS[+$("dmv-pp").value];
      var slot = { name: p.name.replace(/ \(.*/, ""), base_url: ($("dmv-purl").value || p.base_url || "").trim(), model: ($("dmv-pm").value || p.model || "").trim(), key: $("dmv-pk").value.trim(), enabled: true };
      if (!slot.base_url) { $("dmv-st").textContent = "need an endpoint URL"; $("dmv-st").style.color = "#FF9DAB"; return; }
      if (!slot.key && !p.local) { $("dmv-st").textContent = "paste your key (or pick LM Studio)"; $("dmv-st").style.color = "#FF9DAB"; return; }
      if (!slot.model && !p.local) { $("dmv-st").textContent = "pick a model from the dropdown (hit ↻ to load them)"; $("dmv-st").style.color = "#FF9DAB"; return; }
      $("dmv-st").style.color = "#9CD3E4"; $("dmv-st").textContent = "testing…";
      // local LM Studio: model may be blank → grab the first one it's serving
      if (p.local && !slot.model) { try { var ms = await listModels(slot); slot.model = ms[0] || "local-model"; } catch (e) {} }
      var res = await test(slot);
      if (res.ok) { saveProvider(slot); _write(LS_SEEN, "1"); $("dmv-st").style.color = "#7fe8c0"; $("dmv-st").textContent = "✓ connected"; setTimeout(function () { ov.remove(); }, 500); }
      else { $("dmv-st").style.color = "#FF9DAB"; $("dmv-st").textContent = "✕ " + res.error.slice(0, 80); }
    };
  }

  // Show the front door automatically in cloud mode, once, when nothing's configured.
  function maybeOnboard() {
    if (CLOUD_MODE && !isConfigured() && _read(LS_SEEN, null) !== "1") {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { openSetup(); });
      else openSetup();
    }
  }

  window.DMV_AI = {
    CLOUD_MODE: CLOUD_MODE, IS_DESKTOP: IS_DESKTOP, PRESETS: PRESETS,
    getProviders: getProviders, saveProvider: saveProvider, deleteProvider: deleteProvider,
    getActive: getActive, setActive: setActive, isConfigured: isConfigured,
    chatStream: chatStream, chatOnce: chatOnce, listModels: listModels, test: test,
    rankedChatModels: rankedChatModels,
    openSetup: openSetup, maybeOnboard: maybeOnboard
  };
  maybeOnboard();
})();
