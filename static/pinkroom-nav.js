/* ARKITECT — shared exit-button style.
   The old floating room-switcher ("A" launcher) was removed per B: every room
   now has the identical "← ARKITECT" pill + Tec, so the floating button is gone.
   This file just injects the premium back-pill style so the exit looks the same
   everywhere, even before a room gets its own local copy. */
(function () {
  if (window.__arkBack) return;
  window.__arkBack = true;
  const css = `
  a.pr-back{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px 0 11px;border-radius:11px;
    text-decoration:none;cursor:pointer;
    background:linear-gradient(180deg,rgba(42,46,54,.92),rgba(24,26,32,.92));border:1px solid rgba(255,255,255,.13);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 3px 10px rgba(0,0,0,.4);
    transition:border-color .14s,box-shadow .14s,transform .14s;}
  a.pr-back:hover{border-color:rgba(120,182,205,.65);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 6px 16px rgba(62,156,184,.3);transform:translateY(-1px);}
  a.pr-back:active{transform:translateY(0);}
  a.pr-back .pr-ar{color:rgba(220,224,230,.9);font:700 15px Oxanium,sans-serif;line-height:1;margin-top:-1px;}
  a.pr-back img{height:14px;width:auto;display:block;opacity:.95;}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  // force the app-window (Edge/Chrome --app mode) title bar to graphite, overriding the OS accent color
  if(!document.querySelector('meta[name="theme-color"]')){ const tc = document.createElement("meta"); tc.name = "theme-color"; tc.content = "#0C0D10"; document.head.appendChild(tc); }
  // app/taskbar icon = Tec (matches the desktop shortcut), not the generic Edge icon
  if(!document.querySelector('link[rel="icon"]')){ const ic = document.createElement("link"); ic.rel = "icon"; ic.href = "/static/kit.ico"; document.head.appendChild(ic); }
  // pro polish: strip internal hrefs so hovering a button doesn't flash localhost URLs in the corner
  document.querySelectorAll('a[href^="/"]').forEach(a => { const dest = a.getAttribute('href'); if(!dest) return; a.removeAttribute('href'); a.style.cursor = 'pointer'; a.addEventListener('click', e => { e.preventDefault(); location.href = dest; }); });
  // load Kit, the in-room build-bot helper (kit-helper.js self-skips the main chat + non-rooms)
  if (!document.querySelector('script[data-kit]')) { const ks = document.createElement("script"); ks.src = "/static/kit-helper.js"; ks.setAttribute("data-kit", "1"); document.body.appendChild(ks); }
  // The ONE agent button in every room: "Summon agent" opens the agent window (with the Kit/Tiff/your-agents
  // chooser inside) — works even if nobody's been dragged in yet. The little agent name-chip in the bar is a
  // PASSIVE indicator (shows who's in the room), NOT a button — so there's only ever one thing to click.
  if (!document.querySelector('[data-summon]')) {
    const sb = document.createElement("button");
    sb.textContent = "Summon agent"; sb.setAttribute("data-summon", "1");
    sb.style.cssText = "background:rgba(255,255,255,.05);border:1px solid rgba(120,182,205,.4);color:#9FCFDD;" +
      "font:600 11px Oxanium,system-ui,sans-serif;letter-spacing:.04em;padding:6px 12px;border-radius:9px;cursor:pointer;margin-left:8px;";
    sb.onmouseover = () => { sb.style.borderColor = "rgba(120,182,205,.8)"; sb.style.color = "#CFE6EE"; };
    sb.onmouseout = () => { sb.style.borderColor = "rgba(120,182,205,.4)"; sb.style.color = "#9FCFDD"; };
    sb.onclick = () => {
      if (window.__kitOpen) { window.__kitOpen(); return; }     // agent already in the room → just open the window
      try { const u = new URL(location.href); u.searchParams.set("brain", "kit"); location.href = u.toString(); }  // none yet → bring Kit in
      catch (_) { location.href = location.pathname + "?brain=kit"; }
    };
    (document.querySelector(".kit-mount") || document.querySelector(".top") || document.querySelector(".menubar") || document.body).appendChild(sb);
  }
  // the in-room FEEDBACK BUDDY (separate from Kit) — "you're early = you're a builder", collects bugs/ideas
  if (!document.querySelector('script[data-fbk]')) { const fs = document.createElement("script"); fs.src = "/static/feedback-buddy.js"; fs.setAttribute("data-fbk", "1"); document.body.appendChild(fs); }
  // KEYS — the unified API-key window (exposes window.openKeys): curated picks + deep links + paste, saved locally
  if (!document.querySelector('script[data-keys]')) { const kys = document.createElement("script"); kys.src = "/static/keys.js"; kys.setAttribute("data-keys", "1"); document.body.appendChild(kys); }
  // COPY ANYWHERE — reliable right-click→copy in the native shell (where the OS menu is flaky)
  if (!document.querySelector('script[data-copy]')) { const cpy = document.createElement("script"); cpy.src = "/static/copy-anywhere.js"; cpy.setAttribute("data-copy", "1"); document.body.appendChild(cpy); }
  // NO version badge in the rooms — owner's call: the version lives ONLY on the front page (the chat,
  // next to brain/engine). The corner badge here was cluttering the rooms, so it's intentionally gone.
})();
