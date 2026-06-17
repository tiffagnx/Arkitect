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
})();
