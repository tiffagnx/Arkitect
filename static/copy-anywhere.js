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
    ".cax-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}" +
    /* per-message ghost copy icon (Claude Code style): tiny, no bg/border, row below the bubble, hover-reveal, check on copy */
    ".msgcol{display:flex;flex-direction:column;min-width:0;max-width:78%}.msg.you .msgcol{align-items:flex-end}.msgcol .bubble{max-width:100%}" +
    ".msgacts{display:flex;gap:2px;justify-content:flex-end;margin-top:3px;height:20px;opacity:0;transition:opacity .16s ease}" +
    ".msg:hover .msgacts,.msg:focus-within .msgacts{opacity:1}" +
    ".gcopy{display:inline-flex;align-items:center;justify-content:center;width:26px;height:20px;padding:0;background:none;border:none;border-radius:6px;color:rgba(255,255,255,.5);cursor:pointer;transition:color .12s,background .12s}" +
    ".gcopy:hover{color:#E4F1F5;background:rgba(255,255,255,.08)}.gcopy:active{transform:scale(.9)}" +
    ".gcopy .ic-check{display:none;color:#3FD98A}.gcopy.is-copied .ic-copy{display:none}.gcopy.is-copied .ic-check{display:inline}.gcopy.is-copied{color:#3FD98A}" +
    "@media (hover:none){.msgacts{opacity:1}}";
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
      { label: "Paste", key: "Ctrl+V", on: editable, run: async () => {
          if (field) field.focus();
          // 1) text — the common case
          const t = await readClip();
          if (t) { spliceField(field, t); toast("pasted ✓"); return; }
          // 2) image (e.g. a screenshot): read it and re-fire it as a REAL paste the composer
          //    understands, so the picture actually lands instead of a silent "pasted ✓" lie.
          try {
            if (field && navigator.clipboard && navigator.clipboard.read) {
              const items = await navigator.clipboard.read();
              for (const it of items) {
                const type = (it.types || []).find(ty => ty.startsWith("image/"));
                if (!type) continue;
                const blob = await it.getType(type);
                const file = new File([blob], "pasted-image.png", { type: blob.type || "image/png" });
                const dt = new DataTransfer(); dt.items.add(file);
                const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
                const notCancelled = field.dispatchEvent(ev);   // false => a handler consumed it
                if (!notCancelled) { toast("image pasted ✓"); return; }
                break;   // had an image but nothing here accepts images → fall through honestly
              }
            }
          } catch (_) {}
          // 3) nothing we could place programmatically — native Ctrl+V still works for text AND images
          toast("press Ctrl+V to paste");
        } },
      { sep: true },
      { label: "Select All", key: "Ctrl+A", on: true, run: () => { if (field) { field.focus(); field.select && field.select(); } else { selectNode(blockNode(tgt)); } } },
    ];
    openMenu(e.clientX, e.clientY, items);
  });

  // ── per-message ghost copy icon (the .gcopy in .msgacts, rendered below each bubble) ──
  document.addEventListener("click", function (e) {
    const btn = e.target.closest && e.target.closest(".gcopy[data-copy]"); if (!btn) return;
    const msg = btn.closest(".msg"), bub = msg && msg.querySelector(".bubble");
    let text = bub ? (typeof bub._raw === "string" ? bub._raw : (bub.innerText || bub.textContent || "")) : "";
    text = (text || "").trim(); if (!text) return;
    if (writeClip(text)) { btn.classList.add("is-copied"); clearTimeout(btn._t); btn._t = setTimeout(() => btn.classList.remove("is-copied"), 2000); }
  });
})();
