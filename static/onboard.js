/* ============================================================================
   onboard.js — first-run setup wizard. Fires ONCE on a brand-new install
   (localStorage flag dmv_onboarded_v2). Capability-aware: checks whether a
   local model loaded and adjusts the pitch accordingly. Covers the four real
   setup steps: cloud key → settings → voices → rooms. Skippable at any point.
   Re-trigger anytime: window.dmvStartTour().
   ============================================================================ */
(function () {
  "use strict";
  const KEY = "dmv_onboarded_v2";

  /* ── steps ── each may have a `link: {url, label}` button ── */
  function buildSteps(hasLocal) {
    const keyStep = hasLocal ? {
      sel: null,
      title: "Cloud keys unlock everything",
      body: "You've got a local model running — nice. When you want smarter cloud models (or image + video generation when that's ready), OpenRouter is the move. One key gets you every model.",
      link: { url: "https://openrouter.ai/keys", label: "Get OpenRouter key →" }
    } : {
      sel: null,
      title: "First: grab one API key",
      body: "No local model detected — that's fine. OpenRouter gives you every AI model on one free key: chat models, and soon image + video generation too. Takes 30 seconds.",
      link: { url: "https://openrouter.ai/keys", label: "Get OpenRouter key →" }
    };

    return [
      {
        sel: null,
        title: "Welcome to DeMartinville 👋",
        body: "Your private creative OS — DAW, video editor, beat room, image gen, in-app coder. Let me walk you through setup. Takes about 2 minutes."
      },
      keyStep,
      {
        sel: ".as-gear",
        title: "Paste your key in Settings",
        body: "Hit the ⚙ gear above → API Keys → OpenRouter. Paste your key and pick whatever models you want. The list pulls everything available on your key automatically."
      },
      {
        sel: null,
        title: "Tiffany & Kit already have voices",
        body: "Their voice model IDs are baked in — you don't need to do anything except add a Fish Audio key. One key and both of them speak in their real voices. No setup beyond that.",
        link: { url: "https://fish.audio", label: "Get Fish Audio key →" }
      },
      {
        sel: ".roomrail",
        title: "Step into a room",
        body: "The rooms are on the left — Audio, Visual, Code, and more. Drag Tiffany or Kit into any room and they work with you: mix tracks, edit footage, build code. Not just chat."
      }
    ];
  }

  /* ── CSS ── */
  function injectCSS() {
    if (document.getElementById("dmvTourCSS")) return;
    const s = document.createElement("style"); s.id = "dmvTourCSS";
    s.textContent =
      "#dmvTour{position:fixed;inset:0;z-index:100000;pointer-events:none;font-family:Inter,system-ui,sans-serif}" +
      "#dmvTour .t-ring{position:fixed;border-radius:14px;border:2px solid #3E9CB8;" +
        "box-shadow:0 0 0 9999px rgba(6,8,12,.82),0 0 20px 4px rgba(62,156,184,.55);" +
        "transition:all .28s cubic-bezier(.4,0,.2,1)}" +
      "#dmvTour .t-card{position:fixed;width:340px;max-width:90vw;pointer-events:auto;" +
        "background:linear-gradient(180deg,#171c22,#0f1318);" +
        "border:1px solid rgba(62,156,184,.45);border-radius:15px;padding:18px 18px 14px;" +
        "box-shadow:0 24px 64px rgba(0,0,0,.7);color:#E7E9EE;" +
        "transition:all .28s cubic-bezier(.4,0,.2,1)}" +
      "#dmvTour .t-title{font:800 15px Inter,sans-serif;color:#fff;margin:0 0 8px;letter-spacing:.2px}" +
      "#dmvTour .t-body{font:500 12.5px/1.55 Inter,sans-serif;color:#9AACB8;margin:0 0 12px;white-space:pre-line}" +
      "#dmvTour .t-link{display:inline-flex;align-items:center;margin-bottom:12px;" +
        "padding:7px 12px;border-radius:8px;font:600 12px Inter;text-decoration:none;" +
        "background:rgba(62,156,184,.18);border:1px solid rgba(62,156,184,.45);color:#8FD4E4;" +
        "transition:background .14s,border-color .14s}" +
      "#dmvTour .t-link:hover{background:rgba(62,156,184,.3);border-color:rgba(62,156,184,.7);color:#CFE6EE}" +
      "#dmvTour .t-foot{display:flex;align-items:center;justify-content:space-between;margin-top:2px}" +
      "#dmvTour .t-dots{font:700 10px Inter;color:#3E5A6A;letter-spacing:3px}" +
      "#dmvTour .t-btns{display:flex;gap:8px}" +
      "#dmvTour button{font:700 12px Inter,sans-serif;border-radius:9px;cursor:pointer;padding:7px 13px;border:1px solid transparent;transition:all .12s}" +
      "#dmvTour .t-skip{background:transparent;border-color:rgba(255,255,255,.12);color:#6A7A88}" +
      "#dmvTour .t-skip:hover{color:#9AACB8;border-color:rgba(255,255,255,.25)}" +
      "#dmvTour .t-next{background:linear-gradient(135deg,#2BB6A8,#3E9CB8);color:#0a0e12;border-color:transparent}" +
      "#dmvTour .t-next:hover{filter:brightness(1.1)}";
    document.head.appendChild(s);
  }

  /* ── tour engine ── */
  function start(steps) {
    if (document.getElementById("dmvTour")) return;
    injectCSS();
    let i = 0;
    const ov = document.createElement("div"); ov.id = "dmvTour";
    ov.innerHTML =
      '<div class="t-ring"></div>' +
      '<div class="t-card">' +
        '<div class="t-title"></div>' +
        '<div class="t-body"></div>' +
        '<a class="t-link" target="_blank" rel="noopener" style="display:none"></a>' +
        '<div class="t-foot">' +
          '<span class="t-dots"></span>' +
          '<div class="t-btns"><button class="t-skip">Skip</button><button class="t-next">Next →</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    const ring = ov.querySelector(".t-ring");
    const card = ov.querySelector(".t-card");
    const linkEl = ov.querySelector(".t-link");

    function done() {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      ov.style.opacity = "0"; ov.style.transition = "opacity .3s";
      setTimeout(() => ov.remove(), 320);
      window.removeEventListener("resize", render);
    }

    function render() {
      const s = steps[i];
      ov.querySelector(".t-title").textContent = s.title;
      ov.querySelector(".t-body").textContent = s.body;
      ov.querySelector(".t-next").textContent = (i === steps.length - 1) ? "Got it ✓" : "Next →";
      ov.querySelector(".t-dots").textContent = steps.map((_, k) => k === i ? "●" : "○").join("");

      if (s.link) {
        linkEl.href = s.link.url;
        linkEl.textContent = s.link.label;
        linkEl.style.display = "inline-flex";
      } else {
        linkEl.style.display = "none";
      }

      const el = s.sel ? document.querySelector(s.sel) : null;
      if (el) {
        const r = el.getBoundingClientRect();
        ring.style.borderColor = "#3E9CB8";
        ring.style.left  = (r.left - 8) + "px"; ring.style.top    = (r.top - 8) + "px";
        ring.style.width = (r.width + 16) + "px"; ring.style.height = (r.height + 16) + "px";
        const cw = 340;
        let cx = Math.min(window.innerWidth - cw - 16, Math.max(16, r.left + r.width / 2 - cw / 2));
        let cy = r.bottom + 14;
        if (cy > window.innerHeight - 200) cy = Math.max(16, r.top - 185);
        card.style.left = cx + "px"; card.style.top = cy + "px"; card.style.transform = "none";
      } else {
        ring.style.borderColor = "transparent";
        ring.style.left = "50%"; ring.style.top = "50%"; ring.style.width = "0"; ring.style.height = "0";
        card.style.left = "50%"; card.style.top = "50%"; card.style.transform = "translate(-50%,-50%)";
      }
    }

    ov.querySelector(".t-next").onclick = () => { if (i >= steps.length - 1) return done(); i++; render(); };
    ov.querySelector(".t-skip").onclick = done;
    window.addEventListener("resize", render);
    render();
  }

  /* ── entry point — check capability then launch ── */
  async function launch() {
    let hasLocal = false;
    try {
      const r = await fetch("/api/models").then(r => r.json());
      hasLocal = Array.isArray(r.models) && r.models.length > 0;
    } catch (_) {}
    start(buildSteps(hasLocal));
  }

  window.dmvStartTour = launch;   // re-trigger: window.dmvStartTour()

  /* ── auto-run once, after the page settles ── */
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  // only on main chat, not in rooms
  if (!document.getElementById("input")) return;
  let tries = 0;
  const poll = setInterval(() => {
    tries++;
    const ready = document.getElementById("input") && (document.querySelector(".as-gear") || tries > 16);
    if (ready) { clearInterval(poll); setTimeout(launch, 600); }
    if (tries > 40) clearInterval(poll);
  }, 250);
})();
