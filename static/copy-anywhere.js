/* Copy Anywhere — reliable copy in DeMartinville's native (WebView2) shell, where the OS
   right-click "Copy" menu is flaky/absent. Right-click ANY text — a prompt Tiff gives you, a
   chat message, a label — and it copies (your selection if you have one, else that whole text
   block) with a quick "copied ✓" toast. Also guarantees text content stays selectable.

   Editable fields (input/textarea) are left ALONE so they keep native paste + Ctrl+V, and the
   room editing surfaces (studio/beats/editor canvases that use right-click for their own actions)
   are skipped. Self-contained; loads once. */
(function () {
  if (window.__copyAnywhere) return;
  window.__copyAnywhere = true;

  const st = document.createElement("style");
  st.textContent =
    /* make text content selectable even if a parent set user-select:none for a "native app" feel */
    ".kit-msg,.msg,.bub,.bubble,.kit-t,.kit-s,p,li,pre,code,td,th,h1,h2,h3,h4,blockquote,[data-copyable]{-webkit-user-select:text;user-select:text;}" +
    ".copy-toast{position:fixed;z-index:2147483600;left:50%;bottom:30px;transform:translateX(-50%) translateY(10px);" +
    "background:rgba(20,26,32,.96);color:#CFE6EE;border:1px solid rgba(120,182,205,.65);border-radius:10px;" +
    "padding:7px 14px;font:700 12px Oxanium,system-ui,sans-serif;letter-spacing:.04em;box-shadow:0 8px 24px rgba(0,0,0,.5);" +
    "opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;}" +
    ".copy-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}";
  (document.head || document.documentElement).appendChild(st);

  let toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "copy-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 1100);
  }
  function copyText(text) {
    text = (text || "").replace(/\s+$/, "");
    if (!text.trim()) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); }
      else throw 0;
    } catch (_) {
      const ta = document.createElement("textarea"); ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;"; document.body.appendChild(ta);
      ta.focus(); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove();
    }
    toast("copied ✓"); return true;
  }
  // the most useful text to grab when nothing is selected: the nearest message / prompt / paragraph block
  function blockText(el) {
    if (!el || !el.closest) return "";
    const box = el.closest(".kit-msg,.msg,.bub,.bubble,[data-copyable],p,li,pre,code,td,h1,h2,h3,blockquote");
    return box ? (box.innerText || box.textContent || "") : (el.innerText || el.textContent || "");
  }

  document.addEventListener("contextmenu", function (e) {
    const t = e.target;
    if (!t || !t.closest) return;
    // leave editable fields native (they need paste); leave the room editing surfaces their own right-click
    if (t.closest("input,textarea,[contenteditable],canvas,.step,.wave,.tstrip,.cell,#stage,.note,.clip,.lane,.keyrow,.pianoroll,.grid")) return;
    const sel = (window.getSelection && String(window.getSelection())) || "";
    const text = sel.trim() ? sel : blockText(t);
    if (text && text.trim()) { e.preventDefault(); copyText(text); }
  });
})();
