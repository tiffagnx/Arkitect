/* Right-click menu — a REAL Cut / Copy / Paste / Select All menu that works EVERYWHERE in
   DeMartinville's native (WebView2) shell, where the OS right-click menu is dead. Works on
   editable fields (inputs/textareas — so you can paste your key, a prompt, anything) AND on plain
   text (messages, prompts, labels — so you can copy what Tiff/Kit give you). Self-contained.

   The room editing surfaces (studio/beats/editor canvases that use right-click for their own
   actions) are left alone. Paste uses the clipboard API (one-time "Allow" sticks via the app's
   saved profile); if the OS blocks it, it tells you to press Ctrl+V. */
(function () {
  if (window.__copyAnywhere) return;
  window.__copyAnywhere = true;

  const st = document.createElement("style");
  st.textContent =
    ".cax-menu{position:fixed;z-index:2147483640;min-width:184px;padding:5px;border-radius:10px;" +
    "background:rgba(22,25,31,.98);border:1px solid rgba(120,182,205,.42);box-shadow:0 14px 38px rgba(0,0,0,.62);" +
    "font:600 12.5px Inter,system-ui,sans-serif;color:#D7DCE4;user-select:none;-webkit-user-select:none;}" +
    ".cax-item{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:7px 11px;border-radius:7px;cursor:pointer;}" +
    ".cax-item:hover{background:rgba(62,156,184,.24);color:#fff;}" +
    ".cax-item.off{opacity:.3;pointer-events:none;}" +
    ".cax-k{font:600 10.5px 'Space Mono',monospace;color:rgba(170,180,190,.6);}" +
    ".cax-sep{height:1px;margin:4px 6px;background:rgba(255,255,255,.09);}" +
    /* keep content text selectable even if a parent set user-select:none */
    ".kit-msg,.msg,.bub,.bubble,.kit-t,.kit-s,p,li,pre,code,td,th,h1,h2,h3,h4,blockquote,[data-copyable]{-webkit-user-select:text;user-select:text;}" +
    ".cax-toast{position:fixed;z-index:2147483641;left:50%;bottom:30px;transform:translateX(-50%) translateY(10px);" +
    "background:rgba(20,26,32,.96);color:#CFE6EE;border:1px solid rgba(120,182,205,.6);border-radius:10px;padding:7px 14px;" +
    "font:700 12px Oxanium,system-ui,sans-serif;letter-spacing:.04em;box-shadow:0 8px 24px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;}" +
    ".cax-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}";
  (document.head || document.documentElement).appendChild(st);

  let toastEl = null, toastT = null;
  function toast(m) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "cax-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 1200);
  }
  function writeClip(text) {
    if (!text) return false;
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return true; } } catch (_) {}
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;top:0;opacity:0;";
    document.body.appendChild(ta); ta.focus(); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove();
    return true;
  }
  async function readClip() {
    try { if (navigator.clipboard && navigator.clipboard.readText) return await navigator.clipboard.readText(); } catch (_) {}
    return null;
  }
  function blockNode(el) { return (el && el.closest && el.closest(".kit-msg,.msg,.bub,.bubble,[data-copyable],p,li,pre,code,td,h1,h2,h3,blockquote")) || el; }
  function spliceField(field, text) {
    if (!field) return;
    if (field.value !== undefined && typeof field.selectionStart === "number") {
      const s = field.selectionStart, en = field.selectionEnd, v = field.value;
      field.value = v.slice(0, s) + text + v.slice(en);
      const pos = s + text.length; field.selectionStart = field.selectionEnd = pos;
      field.dispatchEvent(new Event("input", { bubbles: true })); field.focus();
    } else if (field.isContentEditable) { field.focus(); try { document.execCommand("insertText", false, text); } catch (_) {} }
  }
  function selectNode(n) { try { const r = document.createRange(); r.selectNodeContents(n); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (_) {} }

  let menuEl = null;
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  document.addEventListener("click", closeMenu);
  document.addEventListener("scroll", closeMenu, true);
  window.addEventListener("blur", closeMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  function openMenu(x, y, items) {
    closeMenu();
    menuEl = document.createElement("div"); menuEl.className = "cax-menu";
    items.forEach(it => {
      if (it.sep) { const s = document.createElement("div"); s.className = "cax-sep"; menuEl.appendChild(s); return; }
      const d = document.createElement("div"); d.className = "cax-item" + (it.on ? "" : " off");
      d.innerHTML = "<span>" + it.label + "</span><span class='cax-k'>" + it.key + "</span>";
      if (it.on) d.addEventListener("mousedown", ev => { ev.preventDefault(); ev.stopPropagation(); closeMenu(); Promise.resolve(it.run()).catch(() => {}); });
      menuEl.appendChild(d);
    });
    menuEl.style.left = "-9999px"; menuEl.style.top = "-9999px"; document.body.appendChild(menuEl);
    const w = menuEl.offsetWidth, h = menuEl.offsetHeight;
    menuEl.style.left = Math.max(4, Math.min(x, window.innerWidth - w - 6)) + "px";
    menuEl.style.top = Math.max(4, Math.min(y, window.innerHeight - h - 6)) + "px";
  }

  document.addEventListener("contextmenu", function (e) {
    const tgt = e.target;
    if (!tgt || !tgt.closest) return;
    // leave the room editing surfaces their own right-click
    if (tgt.closest("canvas,.step,.wave,.tstrip,.cell,#stage,.note,.clip,.lane,.keyrow,.pianoroll,.grid")) return;

    const field = tgt.closest("input,textarea,[contenteditable]");
    const editable = !!field && !field.disabled && !field.readOnly;
    let fieldSel = "";
    if (field && field.value !== undefined && typeof field.selectionStart === "number") fieldSel = field.value.slice(field.selectionStart, field.selectionEnd);
    const docSel = (window.getSelection && String(window.getSelection())) || "";
    const selText = (fieldSel || docSel || "").trim();
    const blockText = !selText ? (blockNode(tgt).innerText || blockNode(tgt).textContent || "").trim() : "";

    if (!editable && !selText && !blockText) return;   // nothing to act on → let it be
    e.preventDefault();

    const items = [
      { label: "Cut",  key: "Ctrl+X", on: editable && !!fieldSel, run: () => { writeClip(fieldSel); spliceField(field, ""); toast("cut ✓"); } },
      { label: "Copy", key: "Ctrl+C", on: !!(selText || blockText), run: () => { writeClip(selText || blockText); toast("copied ✓"); } },
      { label: "Paste", key: "Ctrl+V", on: editable, run: async () => { const t = await readClip(); if (t == null) { if (field) field.focus(); toast("press Ctrl+V to paste"); return; } spliceField(field, t); toast("pasted ✓"); } },
      { sep: true },
      { label: "Select All", key: "Ctrl+A", on: true, run: () => { if (field) { field.focus(); field.select && field.select(); } else { selectNode(blockNode(tgt)); } } },
    ];
    openMenu(e.clientX, e.clientY, items);
  });
})();
