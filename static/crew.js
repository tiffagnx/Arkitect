/* ============================================================================
   crew.js — CREW MODE (opt-in multi-LLM conductor)
   ----------------------------------------------------------------------------
   ONE switch. You drop a few API keys in the Keys hub like always; flip Crew
   Mode on, and the app reads WHATEVER models you've got enabled and runs them
   as a team — a lead/conductor brain + specialists — instead of one brain.
   We never prescribe which models do what; the system configures the crew
   around your list. Off by default. With <2 brains it's a silent passthrough.

   ── ISOLATION CONTRACT (this file is a guest in a repo with many parallel
      sessions — it must not step on anyone) ──
   • Loads AFTER cloud-ai.js + cloud-bridge.js. It captures the CURRENT
     window.fetch (already cloud-bridge's override on the hosted site) as
     `prevFetch` and wraps THAT, delegating every non-/api/chat call straight
     through — so cloud-bridge keeps routing cloud:<id> slots, and the desktop
     backend keeps working untouched.
   • Touches ONLY: localStorage `dmv_crew_mode` and the global `window.DMV_CREW`.
     It READS /api/swarm/providers and (read-only) dmv_characters / activeBrain.
     It NEVER writes any other dmv_ key or any other DMV_ / window global.
   • Wraps POST /api/chat ONLY (front-door main chat — Slice 1). It NEVER
     touches /api/kit, /api/beatbrain, /api/vocalassist, /api/build,
     /api/stream/*, /api/swarm/*, /api/memory, /api/sessions, or the agent dock.
   • Returns a SYNTHETIC SSE Response in the EXACT app framing:
     `data: {json}\n\n` with {type:'delta'|'step'|'error'|'done'}.
   ============================================================================ */
(function () {
  "use strict";
  if (window.__dmvCrew) return;
  window.__dmvCrew = true;

  // Capture whatever fetch is installed RIGHT NOW (cloud-bridge's override on
  // the hosted site, native fetch on desktop). Either way, calling this with
  // model='cloud:<id>' routes correctly through the existing chain.
  var prevFetch = window.fetch.bind(window);

  var LS = "dmv_crew_mode";
  function isOn() { try { return localStorage.getItem(LS) === "1"; } catch (e) { return false; } }
  function setOn(v) { try { localStorage.setItem(LS, v ? "1" : "0"); } catch (e) {} }

  // ── strip a reasoning model's private <think>…</think> before handing a
  //    specialist's take to the lead (the OUTER stream still splits the lead's
  //    own thinking via the front-door consumer, so we forward the lead raw). ──
  function stripThink(t) {
    t = t || "";
    return t.replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/<think>[\s\S]*$/i, "")   // unbalanced (stream cut off)
            .trim();
  }

  /* ───────────────────────── the classifier ─────────────────────────
     Heuristic, name-based, and deliberately tunable. We don't have a
     capability oracle, so we read the model id / provider for rough
     strengths. Good enough to seat a crew; easy to refine later. */
  function classify(p) {
    var s = ((p.model || "") + " " + (p.name || "") + " " + (p.base_url || "")).toLowerCase();
    var fam = "other";
    if (/claude|anthropic/.test(s)) fam = "claude";
    else if (/gpt|openai|\bo1\b|\bo3\b|\bo4\b|chatgpt/.test(s)) fam = "openai";
    else if (/gemini|generativelanguage|google/.test(s)) fam = "gemini";
    else if (/grok|x-ai|xai/.test(s)) fam = "grok";
    else if (/deepseek/.test(s)) fam = "deepseek";
    else if (/qwen/.test(s)) fam = "qwen";
    else if (/llama|meta-/.test(s)) fam = "llama";
    else if (/mistral|mixtral|pixtral|codestral|magistral/.test(s)) fam = "mistral";

    var reasoning = 55;
    if (/opus|gpt-5|\bo1\b|\bo3\b|grok-4|pro|deepseek-r1|deepseek-reasoner|405b|qwen-max|mistral-large|sonnet|claude-4|claude-opus|claude-sonnet/.test(s)) reasoning = 88;
    if (/opus|gpt-5|grok-4|deepseek-r1|reasoner/.test(s)) reasoning = 96;
    if (/haiku|flash-lite|mini|nano|\b8b\b|\b7b\b|turbo|fast|lite|small|gemma|phi|instant/.test(s)) reasoning = Math.min(reasoning, 44);

    var code = 58;
    if (/coder|\bcode\b|deepseek|codestral|qwen/.test(s)) code = 90;
    if (/claude|gpt-5|gpt-4|sonnet|opus/.test(s)) code = Math.max(code, 82);
    if (/flash-lite|mini|nano|\b8b\b|lite|gemma|phi/.test(s)) code = Math.min(code, 46);

    var vision = (/claude|opus|sonnet|haiku|gpt-5|gpt-4o|gpt-4\.|gemini|grok-4|pixtral|llama-3\.2|qwen.*vl|vl-|vision|multimodal/.test(s))
                 && !/embed|tts|whisper|audio|moderation|reranker|rerank/.test(s);

    var cheap = 45;
    if (/flash|mini|nano|\b8b\b|\b7b\b|turbo|fast|lite|small|haiku|free|gemma|phi|instant|groq|cerebras/.test(s)) cheap = 88;
    if (/opus|gpt-5|grok-4|pro|large|405b|max|sonnet/.test(s)) cheap = Math.min(cheap, 20);

    return { fam: fam, reasoning: reasoning, code: code, vision: vision, cheap: cheap };
  }

  // the display chair + the role frame a specialist gets, from its top strength
  function chairOf(c) {
    if (c.code >= 85 && c.code >= c.reasoning) return { k: "Code", icon: "⚙️", desc: "the implementation / code angle" };
    if (c.vision && c.cheap < 60) return { k: "Visual", icon: "🎨", desc: "the visual / creative angle" };
    if (c.cheap >= 80) return { k: "Fast", icon: "⚡", desc: "the quick, practical, no-fluff angle" };
    return { k: "Reasoning", icon: "🧠", desc: "the deep reasoning / strategy angle" };
  }

  function famRank(f) { return ({ claude: 6, openai: 5, grok: 4, gemini: 4, deepseek: 3, qwen: 3, mistral: 2, llama: 2 })[f] || 1; }

  function decorate(x) { var ch = chairOf(x.c); x.chair = ch.k; x.icon = ch.icon; x.chairDesc = ch.desc; return x; }

  // Assemble the crew from the user's enabled slots. Returns null = "don't crew"
  // (fewer than 2 usable brains, or an image the crew can't all see).
  function assemble(provs, hasImage) {
    var pool = (provs || []).filter(function (p) { return p && p.enabled !== false && p.id; })
      .map(function (p) {
        return { id: p.id, modelId: "cloud:" + p.id, name: p.name || "brain", model: p.model || "", base_url: p.base_url || "", c: classify(p) };
      });
    if (hasImage) pool = pool.filter(function (x) { return x.c.vision; });
    if (pool.length < 2) return null;

    // lead = strongest reasoning; ties → family pedigree → less-cheap (more capable)
    pool.sort(function (a, b) {
      return (b.c.reasoning - a.c.reasoning) || (famRank(b.c.fam) - famRank(a.c.fam)) || (a.c.cheap - b.c.cheap);
    });
    var lead = decorate(pool[0]);
    var rest = pool.slice(1).map(decorate);
    var specialists = rest.slice(0, 3);          // engage up to 3
    var bench = rest.slice().sort(function (a, b) { return b.c.cheap - a.c.cheap; })[0] || null;  // cheapest spare (Slice-2 grunt)
    return { lead: lead, specialists: specialists, bench: bench, all: pool };
  }

  // live read of the user's model list (works hosted + desktop via prevFetch)
  function fetchProviders() {
    return prevFetch("/api/swarm/providers")
      .then(function (r) { return r.ok ? r.json() : { providers: [] }; })
      .then(function (j) { return (j && j.providers) || []; })
      .catch(function () { return []; });
  }

  function hasImageInBody(body) {
    try {
      var ms = body.messages || [];
      for (var i = ms.length - 1; i >= 0; i--) {
        var c = ms[i].content;
        if (Array.isArray(c) && c.some(function (p) { return p && p.type === "image_url"; })) return true;
      }
    } catch (e) {}
    return false;
  }

  /* ─────────────────────── SSE plumbing (mirror of cloud-bridge.sse) ─────────────────────── */
  function crewStream(run) {
    var stream = new ReadableStream({
      start: function (c) {
        var enc = new TextEncoder();
        var send = function (o) { try { c.enqueue(enc.encode("data: " + JSON.stringify(o) + "\n\n")); } catch (e) {} };
        Promise.resolve().then(function () { return run(send); })
          .catch(function (e) { send({ type: "error", text: String((e && e.message) || e) }); })
          .then(function () { send({ type: "done" }); try { c.close(); } catch (e) {} });
      }
    });
    return new Response(stream, { status: 200, headers: { "content-type": "text/event-stream", "cache-control": "no-cache" } });
  }

  // call ONE brain through the existing /api/chat path (full persona + memory +
  // god-layer + native-Claude effort come free from the backend/bridge).
  function callBrain(modelId, messages, opts) {
    opts = opts || {};
    var body = { messages: messages, model: modelId, mode: opts.mode || "chat",
                 effort: opts.effort || "low", character: opts.character || "tiff" };
    return prevFetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), signal: opts.signal
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error("brain http " + (res && res.status));
      var reader = res.body.getReader(), dec = new TextDecoder(), buf = "", acc = "";
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return acc;
          buf += dec.decode(r.value, { stream: true });
          var parts = buf.split("\n\n"); buf = parts.pop();
          for (var i = 0; i < parts.length; i++) {
            var line = parts[i]; if (line.indexOf("data: ") !== 0) continue;
            var ev; try { ev = JSON.parse(line.slice(6)); } catch (e) { continue; }
            if (ev.type === "delta") { acc += ev.text; if (opts.onDelta) opts.onDelta(ev.text); }
            else if (ev.type === "error") { throw new Error(ev.text || "brain error"); }
          }
          return pump();
        });
      })();
    });
  }

  // clone messages, appending a role frame to the last user turn
  function withFrame(messages, frame) {
    var ms = (messages || []).map(function (m) { return { role: m.role, content: m.content }; });
    for (var i = ms.length - 1; i >= 0; i--) {
      if (ms[i].role !== "user") continue;
      var c = ms[i].content;
      if (Array.isArray(c)) {
        var cc = c.map(function (p) { return p && p.type === "text" ? { type: "text", text: (p.text || "") } : p; });
        var hit = cc.filter(function (p) { return p && p.type === "text"; })[0];
        if (hit) hit.text += frame; else cc.unshift({ type: "text", text: frame.trim() });
        ms[i] = { role: "user", content: cc };
      } else {
        ms[i] = { role: "user", content: (c == null ? "" : String(c)) + frame };
      }
      break;
    }
    return ms;
  }

  function specialistMessages(body, sp) {
    return withFrame(body.messages,
      "\n\n[CREW ROLE — You are the " + sp.chair + " specialist on a crew. Give your sharpest take on " +
      sp.chairDesc + " of this. Be concise and concrete — bullet the essentials. The lead will combine everyone's input into the final answer.]");
  }

  function synthMessages(body, takes) {
    var notes = takes.map(function (t) {
      return "— " + t.sp.name + " (" + t.sp.chair + " specialist):\n" + t.text;
    }).join("\n\n");
    var frame =
      "\n\n[YOU ARE THE LEAD of an AI crew answering the above. Your specialists handed you these takes. " +
      "Use the best of each, resolve any conflicts, and reply as YOURSELF in one clean, complete answer. " +
      "Do NOT mention the crew, the specialists, or that you synthesized anything — just give the answer.\n\n" +
      (notes || "(no specialist input came back — answer it yourself, fully.)") + "]";
    return withFrame(body.messages, frame);
  }

  /* ─────────────────────────── the conductor ─────────────────────────── */
  function conduct(body, input, init) {
    var hasImg = hasImageInBody(body);
    return fetchProviders().then(function (provs) {
      var crew = assemble(provs, hasImg);
      if (!crew) return prevFetch(input, init);   // <2 usable brains → normal single-brain answer

      var signal = init && init.signal;
      var character = body.character || "tiff";

      return crewStream(function (send) {
        var specs = crew.specialists;
        send({ type: "step", icon: "🎬", text: "**Crew on it** — " + crew.lead.name + " leading " + specs.length + " specialist" + (specs.length === 1 ? "" : "s") });
        specs.forEach(function (sp) { send({ type: "step", icon: sp.icon, text: sp.chair + " · **" + sp.name + "** — on it" }); });

        // specialists in parallel (lower effort = snappy + cheaper; lead does the deep pass)
        var jobs = specs.map(function (sp) {
          return callBrain(sp.modelId, specialistMessages(body, sp), { effort: "medium", character: character, signal: signal })
            .then(function (txt) { return { ok: true, sp: sp, text: stripThink(txt) }; })
            .catch(function (e) { return { ok: false, sp: sp, err: e }; });
        });

        return Promise.all(jobs).then(function (results) {
          var takes = [];
          results.forEach(function (r) {
            if (r.ok && r.text) { takes.push(r); send({ type: "step", icon: "✓", text: r.sp.name + " weighed in" }); }
            else { send({ type: "step", icon: "·", text: r.sp.name + " sat this one out" }); }
          });
          send({ type: "step", icon: "🧩", text: "**" + crew.lead.name + "** pulling it together…" });

          return callBrain(crew.lead.modelId, synthMessages(body, takes), {
            effort: body.effort || "low", character: character, signal: signal,
            onDelta: function (t) { send({ type: "delta", text: t }); }
          }).then(function (out) {
            // lead came back empty but a specialist had something → don't leave them hanging
            if (!stripThink(out) && takes.length) send({ type: "delta", text: takes[0].text });
          }).catch(function (e) {
            if (takes.length) send({ type: "delta", text: takes[0].text });   // graceful: best take
            else send({ type: "error", text: "Crew lead failed: " + ((e && e.message) || e) });
          });
        });
      });
    }).catch(function () {
      return prevFetch(input, init);   // any setup hiccup → normal answer, never a dead end
    });
  }

  /* ─────────────────────── the fetch wrap (POST /api/chat only) ─────────────────────── */
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === "string") ? input : (input && input.url) || "";
      var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
      if (isOn() && method === "POST" && /\/api\/chat(\?|$)/.test(url)) {
        var raw = (init && init.body) || (input && input.body) || "{}";
        var body = null; try { body = JSON.parse(raw); } catch (e) { body = null; }
        if (body && Array.isArray(body.messages)) return conduct(body, input, init);
      }
    } catch (e) {}
    return prevFetch(input, init);
  };

  /* ──────────────────────────────── UI ────────────────────────────────
     Slice 1 surfaces on the FRONT DOOR (the main chat that hits /api/chat).
     A pill button in the topbar opens a small panel: the switch + a live
     "here's your crew" lineup assembled from the keys you've got. */
  function mountUI() {
    if (!document.getElementById("model")) return;              // front-door only (it owns the brain picker)
    if (window.self !== window.top) return;                     // not inside an embedded-plugin iframe
    if (document.querySelector("[data-crew-toggle]")) return;   // guard against double-mount

    var css = document.createElement("style");
    css.textContent =
      "[data-crew-toggle]{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border-radius:10px;cursor:pointer;" +
      "font:700 11.5px Oxanium,system-ui,sans-serif;letter-spacing:.03em;background:rgba(255,255,255,.05);" +
      "border:1px solid rgba(120,182,205,.4);color:#9FCFDD;transition:all .15s;}" +
      "[data-crew-toggle]:hover{border-color:rgba(150,210,228,.85);color:#CFE6EE;}" +
      "[data-crew-toggle].on{background:linear-gradient(180deg,rgba(230,193,106,.22),rgba(40,40,30,.5));border-color:rgba(230,193,106,.8);" +
      "color:#F4D23E;box-shadow:0 0 16px rgba(230,193,106,.4);}" +
      "[data-crew-toggle] .cdot{width:7px;height:7px;border-radius:50%;background:#5b6470;transition:all .15s;}" +
      "[data-crew-toggle].on .cdot{background:#F4D23E;box-shadow:0 0 8px #F4D23E;}" +
      ".crewpanel{position:fixed;z-index:99999;width:330px;max-width:92vw;background:linear-gradient(180deg,#1b1e25,#14161c);" +
      "border:1px solid rgba(120,182,205,.32);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.6);padding:15px 16px;" +
      "font:13px Inter,system-ui,sans-serif;color:#DDE6EC;display:none;}" +
      ".crewpanel.open{display:block;}" +
      ".crewpanel h4{margin:0 0 2px;font:800 14px Oxanium,sans-serif;color:#fff;letter-spacing:.02em;}" +
      ".crewpanel .sub{color:#9FB4C0;font-size:11.5px;line-height:1.45;margin-bottom:11px;}" +
      ".crewrow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:11px;}" +
      ".crewsw{position:relative;width:42px;height:23px;border-radius:13px;background:#39414c;cursor:pointer;transition:background .16s;flex:none;}" +
      ".crewsw.on{background:linear-gradient(90deg,#E6C16A,#F4D23E);}" +
      ".crewsw b{position:absolute;top:2px;left:2px;width:19px;height:19px;border-radius:50%;background:#fff;transition:left .16s;}" +
      ".crewsw.on b{left:21px;}" +
      ".crewlineup{border-top:1px solid rgba(255,255,255,.08);padding-top:11px;}" +
      ".crewchip{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:9px;margin-bottom:6px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);}" +
      ".crewchip.lead{background:linear-gradient(180deg,rgba(230,193,106,.14),rgba(255,255,255,.03));border-color:rgba(230,193,106,.4);}" +
      ".crewchip .ico{font-size:15px;line-height:1;flex:none;width:20px;text-align:center;}" +
      ".crewchip .nm{font-weight:700;color:#EAF2F6;}" +
      ".crewchip .role{font-size:10.5px;color:#9FB4C0;margin-left:auto;text-transform:uppercase;letter-spacing:.05em;flex:none;}" +
      ".crewchip .mdl{font-size:10.5px;color:#7E92A0;display:block;margin-top:1px;}" +
      ".crewnote{font-size:11px;color:#9FB4C0;line-height:1.5;margin-top:4px;}" +
      ".crewnote a{color:#7CC7DC;cursor:pointer;text-decoration:underline;}";
    document.head.appendChild(css);

    var btn = document.createElement("button");
    btn.setAttribute("data-crew-toggle", "1");
    btn.type = "button";
    btn.innerHTML = '<span class="cdot"></span><span>CREW</span>';

    var panel = document.createElement("div");
    panel.className = "crewpanel";
    document.body.appendChild(panel);

    function syncBtn() { btn.classList.toggle("on", isOn()); }

    function renderPanel() {
      var on = isOn();
      panel.innerHTML =
        '<h4>🎬 Crew Mode</h4>' +
        '<div class="sub">Your brains work as a <b>team</b> — a lead conductor plus specialists, assembled from the keys you\'ve already added. Off = one brain, like normal.</div>' +
        '<div class="crewrow"><div style="font-weight:700">' + (on ? "On" : "Off") + '</div>' +
        '<div class="crewsw' + (on ? " on" : "") + '" data-crew-sw><b></b></div></div>' +
        '<div class="crewlineup" data-crew-lineup><div class="crewnote">reading your brains…</div></div>';
      panel.querySelector("[data-crew-sw]").onclick = function () {
        setOn(!isOn()); syncBtn(); renderPanel();
      };
      fetchProviders().then(function (provs) {
        var box = panel.querySelector("[data-crew-lineup]"); if (!box) return;
        var enabled = provs.filter(function (p) { return p && p.enabled !== false; });
        if (enabled.length < 2) {
          box.innerHTML = '<div class="crewnote">You\'ve got <b>' + enabled.length + '</b> brain' + (enabled.length === 1 ? "" : "s") +
            ' enabled. A crew needs <b>2+</b>. <a data-crew-keys>Add another brain →</a><br><span style="color:#7E92A0">' +
            '(One key on OpenRouter can give you several models — the easy way to field a crew.)</span></div>';
          var k = box.querySelector("[data-crew-keys]"); if (k) k.onclick = function () { try { window.openKeys && window.openKeys(); } catch (e) {} };
          return;
        }
        var crew = assemble(enabled, false);
        var html = '<div class="crewchip lead"><span class="ico">🎖️</span><span><span class="nm">' + esc(crew.lead.name) +
          '</span><span class="mdl">' + esc(crew.lead.model || "model") + '</span></span><span class="role">Lead</span></div>';
        crew.specialists.forEach(function (sp) {
          html += '<div class="crewchip"><span class="ico">' + sp.icon + '</span><span><span class="nm">' + esc(sp.name) +
            '</span><span class="mdl">' + esc(sp.model || "model") + '</span></span><span class="role">' + sp.chair + '</span></div>';
        });
        if (crew.bench && crew.specialists.indexOf(crew.bench) < 0) {
          html += '<div class="crewnote">On the bench: <b>' + esc(crew.bench.name) + '</b> (cheapest — joins for grunt tasks in the next update).</div>';
        }
        html += '<div class="crewnote">~' + (1 + crew.specialists.length) + ' model calls per message (lead + specialists). Your depth dial sets the lead\'s effort.</div>';
        box.innerHTML = html;
      });
    }

    function place() {
      var r = btn.getBoundingClientRect();
      panel.style.top = (r.bottom + 8) + "px";
      panel.style.right = Math.max(8, (window.innerWidth - r.right)) + "px";
    }
    btn.onclick = function (e) {
      e.stopPropagation();
      var open = panel.classList.toggle("open");
      if (open) { renderPanel(); place(); }
    };
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) panel.classList.remove("open");
    });
    window.addEventListener("ark:providers-changed", function () { if (panel.classList.contains("open")) renderPanel(); });

    // land it in the topbar next to the brain controls; float as a fallback
    var host = document.querySelector(".topbar") || (document.getElementById("model") && document.getElementById("model").parentElement);
    if (host) { host.appendChild(btn); }
    else { btn.style.position = "fixed"; btn.style.top = "12px"; btn.style.right = "120px"; btn.style.zIndex = "99998"; document.body.appendChild(btn); }
    syncBtn();
  }

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountUI);
  else mountUI();

  // small, read-mostly public surface (debug + future slices)
  window.DMV_CREW = {
    isOn: isOn,
    setOn: function (v) { setOn(v); var b = document.querySelector("[data-crew-toggle]"); if (b) b.classList.toggle("on", isOn()); },
    providers: fetchProviders,
    preview: function () { return fetchProviders().then(function (p) { return assemble(p.filter(function (x) { return x && x.enabled !== false; }), false); }); }
  };

  try { console.log("%c[DMV Crew] loaded — " + (isOn() ? "ON" : "off") + " (opt-in multi-LLM conductor; wraps /api/chat only)", "color:#E6C16A"); } catch (e) {}
})();
