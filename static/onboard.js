/* ============================================================================
   onboard.js — first-run walkthrough for the main chat. Pops ONCE for a brand-new
   user (localStorage flag), dims the screen, and spotlights the handful of things
   that matter — talk box → talk/voice → Settings/keys → your crew — then never
   shows again. Clean, on-brand, skippable. Re-trigger anytime: window.dmvStartTour().
   ============================================================================ */
(function () {
  "use strict";
  const KEY = "dmv_onboarded_v1";

  const STEPS = [
    { sel: null, title: "Welcome to DeMartinville 👋",
      body: "Your private creative studio — it runs on your machine, local and free. Let me show you the 4 things that matter. Takes 20 seconds." },
    { sel: "#input", title: "Talk to Tiffany",
      body: "Type right here — or tap the 🎙 mic and just talk out loud. Then hit ➤ send and she answers." },
    { sel: "#mic", title: "Talk + she talks back",
      body: "Tap 🎙 to speak, tap it again when you're done, then send. The moment you use the mic, she answers in her real voice automatically — so it's just talk, send, listen." },
    { sel: ".as-gear", title: "Your keys live here",
      body: "Open Settings to plug in a key — for her real voice, or a smarter cloud brain. Everything stays on your machine. Totally optional: the basics work with no keys at all." },
    { sel: ".crew", title: "Your crew",
      body: "Tiffany and Kit are your agents. Drag one into a room on the left — Audio, Visual — to put them to work. Build your own anytime with “+ Build your own.”" },
  ];

  function injectCSS() {
    if (document.getElementById("dmvTourCSS")) return;
    const s = document.createElement("style"); s.id = "dmvTourCSS";
    s.textContent =
      "#dmvTour{position:fixed;inset:0;z-index:100000;pointer-events:none;font-family:Inter,system-ui,sans-serif}" +
      "#dmvTour .t-ring{position:fixed;border-radius:14px;border:2px solid #E94B9C;box-shadow:0 0 0 9999px rgba(8,4,12,.74),0 0 18px 4px rgba(233,75,156,.7);transition:all .28s cubic-bezier(.4,0,.2,1)}" +
      "#dmvTour .t-card{position:fixed;width:330px;max-width:88vw;pointer-events:auto;background:linear-gradient(180deg,#1b101d,#140b13);border:1px solid rgba(233,75,156,.45);border-radius:15px;padding:17px 17px 14px;box-shadow:0 22px 60px rgba(0,0,0,.6);color:#EADFF0;transition:all .28s cubic-bezier(.4,0,.2,1)}" +
      "#dmvTour .t-title{font:800 16px Inter,sans-serif;color:#fff;margin:0 0 7px;letter-spacing:.2px}" +
      "#dmvTour .t-body{font:500 13px/1.5 Inter,sans-serif;color:#D4C6DE;margin:0 0 13px}" +
      "#dmvTour .t-foot{display:flex;align-items:center;justify-content:space-between}" +
      "#dmvTour .t-dots{font:700 10px Inter;color:#7a5a72;letter-spacing:3px}" +
      "#dmvTour .t-btns{display:flex;gap:8px}" +
      "#dmvTour button{font:700 12px Inter,sans-serif;border-radius:9px;cursor:pointer;padding:7px 13px;border:1px solid transparent}" +
      "#dmvTour .t-skip{background:transparent;border-color:rgba(255,255,255,.16);color:#9a8fa6}" +
      "#dmvTour .t-skip:hover{color:#cfc3d8;border-color:rgba(255,255,255,.3)}" +
      "#dmvTour .t-next{background:linear-gradient(135deg,#8FD4E4,#E94B9C);color:#14040E}" +
      "#dmvTour .t-next:hover{filter:brightness(1.08)}";
    document.head.appendChild(s);
  }

  function start() {
    if (document.getElementById("dmvTour")) return;
    injectCSS();
    let i = 0;
    const ov = document.createElement("div"); ov.id = "dmvTour";
    ov.innerHTML =
      '<div class="t-ring"></div>' +
      '<div class="t-card"><div class="t-title"></div><div class="t-body"></div>' +
      '<div class="t-foot"><span class="t-dots"></span><div class="t-btns">' +
      '<button class="t-skip">Skip</button><button class="t-next">Next →</button></div></div></div>';
    document.body.appendChild(ov);
    const ring = ov.querySelector(".t-ring"), card = ov.querySelector(".t-card");

    function done() { try { localStorage.setItem(KEY, "1"); } catch (e) {} ov.remove(); window.removeEventListener("resize", show); }

    function show() {
      const s = STEPS[i];
      ov.querySelector(".t-title").textContent = s.title;
      ov.querySelector(".t-body").textContent = s.body;
      ov.querySelector(".t-next").textContent = (i === STEPS.length - 1) ? "Got it ✓" : "Next →";
      ov.querySelector(".t-dots").textContent = STEPS.map((_, k) => (k === i ? "●" : "○")).join("");
      const el = s.sel ? document.querySelector(s.sel) : null;
      if (el) {
        const r = el.getBoundingClientRect();
        ring.style.borderColor = "#E94B9C";
        ring.style.left = (r.left - 8) + "px"; ring.style.top = (r.top - 8) + "px";
        ring.style.width = (r.width + 16) + "px"; ring.style.height = (r.height + 16) + "px";
        const cw = 330;
        let cx = Math.min(window.innerWidth - cw - 16, Math.max(16, r.left + r.width / 2 - cw / 2));
        let cy = r.bottom + 14;
        if (cy > window.innerHeight - 190) cy = Math.max(16, r.top - 178);
        card.style.left = cx + "px"; card.style.top = cy + "px"; card.style.transform = "none";
      } else {
        // welcome step — no target: shrink the ring to a center point so the whole screen dims, card centered
        ring.style.borderColor = "transparent";
        ring.style.left = "50%"; ring.style.top = "50%"; ring.style.width = "0"; ring.style.height = "0";
        card.style.left = "50%"; card.style.top = "50%"; card.style.transform = "translate(-50%,-50%)";
      }
    }

    ov.querySelector(".t-next").onclick = () => { if (i >= STEPS.length - 1) return done(); i++; show(); };
    ov.querySelector(".t-skip").onclick = done;
    window.addEventListener("resize", show);
    show();
  }

  window.dmvStartTour = start;   // manual re-trigger for testing / a "show me around again" button

  // auto-run once, after the app + Settings gear have settled
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  let tries = 0;
  const poll = setInterval(() => {
    tries++;
    const ready = document.getElementById("input") && (document.querySelector(".as-gear") || tries > 16);
    if (ready) { clearInterval(poll); setTimeout(start, 350); }
    if (tries > 40) clearInterval(poll);
  }, 250);
})();
