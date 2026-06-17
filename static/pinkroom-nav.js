/* ── ARKITECT — shared room switcher + status pill ────────────────────────
   One file, included on every page (<script src="/static/pinkroom-nav.js">).
   Self-injects a floating launcher so the rooms feel like ONE app: jump
   between rooms from anywhere, see brain/engine status at a glance.
   Scoped `pr-` class names so it never collides with a page's own styles.
   Also defines the shared `a.pr-back` button used by every room's header. */
(function () {
  const ROOMS = [
    { icon: "💬", name: "Chat",      href: "/" },
    { icon: "🎚", name: "Studio",    href: "/static/studio.html" },
    { icon: "🎬", name: "Editor",    href: "/static/editor.html" },
    { icon: "🛠", name: "Builder",   href: "/static/build.html" },
    { icon: "🖼", name: "Images",    href: "/static/images.html" },
    { icon: "🛰", name: "Swarm",     href: "/static/swarm.html" },
    { icon: "👾", name: "16-Bit",    href: "/static/bit16.html" },
    { icon: "🎙", name: "Talk Live", href: "/static/talk.html" },
  ];
  const here = location.pathname.replace(/\/+$/, "") || "/";
  const isHere = (h) => (h === "/" ? here === "/" : here.endsWith(h.split("/").pop()));

  const css = `
  /* shared back button — identical in every room (ARKITECT steel) */
  a.pr-back{display:inline-flex;align-items:center;gap:7px;text-decoration:none;cursor:pointer;
    padding:7px 13px;border-radius:10px;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.02em;
    color:rgba(206,210,218,.72);background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.10);transition:color .12s,border-color .12s,background .12s,transform .12s;}
  a.pr-back:hover{color:#E9EAED;border-color:rgba(95,180,206,.55);background:rgba(62,156,184,.10);transform:translateY(-1px);}
  a.pr-back:active{transform:translateY(0);}

  /* floating launcher */
  .pr-fab{position:fixed;right:18px;bottom:18px;z-index:99999;width:48px;height:48px;border-radius:14px;
    border:1px solid rgba(255,255,255,.14);cursor:pointer;font:800 19px Oxanium,sans-serif;color:#0B1417;
    background:linear-gradient(135deg,#6FC0D8,#3E9CB8 62%,#2C7E97);
    box-shadow:0 6px 20px rgba(62,156,184,.40),0 1px 0 rgba(255,255,255,.25) inset;
    display:flex;align-items:center;justify-content:center;transition:transform .14s,box-shadow .14s;}
  .pr-fab:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(62,156,184,.55),0 1px 0 rgba(255,255,255,.3) inset;}
  .pr-fab:active{transform:translateY(0) scale(.97);}

  .pr-menu{position:fixed;right:18px;bottom:78px;z-index:99999;min-width:204px;padding:9px;border-radius:18px;
    background:linear-gradient(180deg,rgba(26,27,33,.96),rgba(18,19,24,.96));
    backdrop-filter:blur(26px) saturate(1.3);-webkit-backdrop-filter:blur(26px) saturate(1.3);
    border:1px solid rgba(255,255,255,.10);
    box-shadow:0 24px 60px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.06) inset,0 0 0 1px rgba(0,0,0,.3);
    display:none;flex-direction:column;gap:2px;font-family:Inter,system-ui,sans-serif;
    animation:prRise .18s cubic-bezier(.2,.8,.2,1);transform-origin:bottom right;}
  .pr-menu.open{display:flex;}
  @keyframes prRise{from{opacity:0;transform:translateY(10px) scale(.97);}}

  .pr-hdr{font:800 12px Oxanium,sans-serif;letter-spacing:.34em;text-indent:.34em;text-align:center;
    color:#CFE6EE;padding:7px 8px 9px;margin-bottom:4px;
    border-bottom:1px solid rgba(255,255,255,.08);
    text-shadow:0 0 14px rgba(62,156,184,.35);}

  .pr-link{display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:11px;cursor:pointer;
    text-decoration:none;color:rgba(206,210,218,.74);font:600 13px Inter;transition:background .1s,color .1s;}
  .pr-link:hover{background:rgba(255,255,255,.05);color:#F2F4F6;}
  .pr-link.cur{background:rgba(62,156,184,.14);color:#CFE6EE;cursor:default;}
  .pr-link .pr-ic{font-size:15px;width:19px;text-align:center;opacity:.92;}

  .pr-status{display:flex;gap:14px;padding:9px 11px 4px;margin-top:4px;border-top:1px solid rgba(255,255,255,.08);
    font:500 10px 'Space Mono',monospace;letter-spacing:.04em;color:rgba(206,210,218,.55);}
  .pr-status b{font-weight:500;}
  .pr-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;background:#5a5f66;vertical-align:middle;}
  .pr-dot.on{background:#46D6A8;box-shadow:0 0 7px rgba(70,214,168,.7);}
  .pr-dot.off{background:#E06A6E;}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const fab = document.createElement("button");
  fab.className = "pr-fab"; fab.title = "Rooms"; fab.textContent = "A";
  const menu = document.createElement("div");
  menu.className = "pr-menu";
  menu.innerHTML =
    `<div class="pr-hdr">ARKITECT</div>` +
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
    // the home/chat page has its own left sidebar nav + status lights —
    // don't stack a duplicate floating popup on top of it.
    if (document.querySelector("aside.side")) return;
    document.body.appendChild(fab); document.body.appendChild(menu); poll();
    setInterval(() => { if (menu.classList.contains("open")) poll(); }, 12000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
