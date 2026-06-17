/* ── PINK ROOM — shared room switcher + status pill ───────────────────────
   One file, included on every page (<script src="/static/pinkroom-nav.js">).
   Self-injects a floating launcher so the four+ pages feel like ONE app:
   jump between rooms from anywhere, see brain/engine status at a glance.
   Scoped `pr-` class names so it never collides with a page's own styles. */
(function () {
  const ROOMS = [
    { icon: "💬", name: "Chat",     href: "/" },
    { icon: "🎚", name: "Studio",   href: "/static/studio.html" },
    { icon: "🎬", name: "Editor",   href: "/static/editor.html" },
    { icon: "🛠", name: "Builder",  href: "/static/build.html" },
    { icon: "🖼", name: "Images",   href: "/static/images.html" },
    { icon: "🛰", name: "Swarm",    href: "/static/swarm.html" },
    { icon: "👾", name: "16-Bit",   href: "/static/bit16.html" },
    { icon: "🎙", name: "Talk Live", href: "/static/talk.html" },
  ];
  const here = location.pathname.replace(/\/+$/, "") || "/";
  const isHere = (h) => (h === "/" ? here === "/" : here.endsWith(h.split("/").pop()));

  const css = `
  .pr-fab{position:fixed;right:16px;bottom:16px;z-index:99999;width:46px;height:46px;border-radius:50%;
    border:1px solid rgba(255,255,255,.12);cursor:pointer;font-size:20px;color:#14040E;
    background:linear-gradient(120deg,#FF73BE,#E91E8C);box-shadow:0 4px 18px rgba(233,30,140,.45);
    display:flex;align-items:center;justify-content:center;transition:transform .12s;}
  .pr-fab:hover{transform:translateY(-2px) scale(1.05);}
  .pr-menu{position:fixed;right:16px;bottom:72px;z-index:99999;min-width:188px;padding:8px;border-radius:16px;
    background:rgba(14,10,20,.92);backdrop-filter:blur(22px);border:1px solid rgba(255,255,255,.1);
    box-shadow:0 12px 40px rgba(0,0,0,.5);display:none;flex-direction:column;gap:3px;
    font-family:Inter,system-ui,sans-serif;animation:prRise .15s ease-out;}
  .pr-menu.open{display:flex;}
  @keyframes prRise{from{opacity:0;transform:translateY(8px);}}
  .pr-hdr{font:700 8.5px 'Space Mono',monospace;letter-spacing:.22em;color:rgba(220,210,228,.5);
    text-transform:uppercase;padding:4px 10px 6px;}
  .pr-link{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:10px;cursor:pointer;
    text-decoration:none;color:rgba(220,210,228,.7);font:600 13px Inter;transition:all .1s;}
  .pr-link:hover{background:rgba(255,255,255,.06);color:#F2EDF4;}
  .pr-link.cur{background:rgba(233,30,140,.14);color:#FFD6EA;cursor:default;}
  .pr-link .pr-ic{font-size:15px;width:18px;text-align:center;}
  .pr-status{display:flex;gap:12px;padding:8px 11px 4px;margin-top:3px;border-top:1px solid rgba(255,255,255,.08);
    font:500 10px 'Space Mono',monospace;color:rgba(220,210,228,.55);}
  .pr-status b{font-weight:500;}
  .pr-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;background:#777;vertical-align:middle;}
  .pr-dot.on{background:#5BE38B;box-shadow:0 0 6px rgba(91,227,139,.7);}
  .pr-dot.off{background:#FF6B6B;}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const fab = document.createElement("button");
  fab.className = "pr-fab"; fab.title = "Rooms"; fab.textContent = "◆";
  const menu = document.createElement("div");
  menu.className = "pr-menu";
  menu.innerHTML =
    `<div class="pr-hdr">Pink Room</div>` +
    ROOMS.map(r => `<a class="pr-link${isHere(r.href) ? " cur" : ""}" ${isHere(r.href) ? "" : `href="${r.href}"`}>
        <span class="pr-ic">${r.icon}</span>${r.name}</a>`).join("") +
    `<div class="pr-status"><span><span class="pr-dot" id="prBrain"></span>brain</span>
       <span><span class="pr-dot" id="prEngine"></span>engine</span></div>`;

  fab.onclick = (e) => { e.stopPropagation(); menu.classList.toggle("open"); if (menu.classList.contains("open")) poll(); };
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== fab) menu.classList.remove("open"); });

  function setDot(id, on) { const d = document.getElementById(id); if (d) d.className = "pr-dot " + (on ? "on" : "off"); }
  async function poll() {
    try {
      const h = await fetch("/api/health").then(r => r.json());
      setDot("prBrain", h.brain); setDot("prEngine", h.engine);
    } catch { setDot("prBrain", false); setDot("prEngine", false); }
  }

  function mount() {
    // pages with the full left sidebar (the home/chat page) already have nav + status
    // lights there — don't add a duplicate floating popup on top of it.
    if (document.querySelector("aside.side")) return;
    document.body.appendChild(fab); document.body.appendChild(menu); poll();
    setInterval(() => { if (menu.classList.contains("open")) poll(); }, 12000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
