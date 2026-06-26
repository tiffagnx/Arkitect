/* The Stream — shared publish helper, loaded into every room by pinkroom-nav.js.
   Exposes:
     window.publishToStream(opts)      → raw POST to /api/stream/publish, returns the item
     window.streamPublishDialog(opts)  → a small branded sheet (title + creator [+ desc for video]),
                                          then publishes. Accepts media as:
                                            opts.path        (a server-side disk path)
                                            opts.editor_jid  (a Visual Labs export job id)
                                            opts.file        (a data URI)
                                            opts.blob        (a Blob — converted here)
   kind:"music" → Notifi, kind:"video" → Cratel. */
(function () {
  if (window.publishToStream) return;
  const CY = "#3E9CB8", CY2 = "#6FC0D8";
  const PAYLABEL = { cashapp: "Cash App", venmo: "Venmo", paypal: "PayPal", kofi: "Ko-fi", link: "Support" };
  function payUrl(m, raw) { raw = (raw || "").trim(); if (!raw) return "";
    if (m === "link") return "https://" + raw.replace(/^https?:\/\//i, "").replace(/^\/+/, "");
    if (m === "cashapp") return "https://cash.app/$" + raw.replace(/^[$@]/, "");
    if (m === "venmo") return "https://venmo.com/u/" + raw.replace(/^@/, "");
    if (m === "paypal") return "https://paypal.me/" + raw.replace(/^@/, "");
    if (m === "kofi") return "https://ko-fi.com/" + raw.replace(/^@/, "");
    return ""; }

  function blobToDataURL(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); }); }
  function probeDur(src, kind) {
    return new Promise(res => {
      try {
        const el = document.createElement(kind === "video" ? "video" : "audio"); el.preload = "metadata"; let obj = null;
        el.onloadedmetadata = () => { const d = el.duration || 0; if (obj) URL.revokeObjectURL(obj); res(isFinite(d) ? d : 0); };
        el.onerror = () => res(0);
        if (src instanceof Blob) { obj = URL.createObjectURL(src); el.src = obj; } else { el.src = src; }
      } catch (e) { res(0); }
    });
  }

  function strmBase(){ try { const c = JSON.parse(localStorage.getItem("dmv_stream_cfg") || "{}"); return (c.mode === "shared" && c.url) ? c.url.replace(/\/+$/, "") : ""; } catch (_) { return ""; } }
  window.publishToStream = async function (opts) {
    const r = await fetch(strmBase() + "/api/stream/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(opts) });
    let j = {}; try { j = await r.json(); } catch (_) {}
    if (!r.ok || j.error) throw new Error(j.error || ("HTTP " + r.status));
    return j.item;
  };

  function toast(msg, withLink) {
    let t = document.getElementById("__strToast");
    if (!t) {
      t = document.createElement("div"); t.id = "__strToast";
      t.style.cssText = "position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);opacity:0;z-index:100000;" +
        "background:rgba(20,22,28,.97);border:1px solid rgba(255,255,255,.12);color:#E9EAED;padding:12px 20px;border-radius:12px;" +
        "font:600 13px Inter,system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.55);transition:opacity .22s,transform .22s;display:flex;gap:14px;align-items:center;";
      document.body.appendChild(t);
    }
    t.innerHTML = msg + (withLink ? ` <a href="/static/stream.html" style="color:${CY2};font-weight:700;text-decoration:none">Open The Stream →</a>` : "");
    requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)"; });
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(20px)"; }, withLink ? 5200 : 2800);
  }

  window.streamPublishDialog = function (opts) {
    opts = opts || {};
    const kind = opts.kind === "video" ? "video" : "music";
    const svc = kind === "video" ? "Cratel" : "Notifi";
    let saved = ""; try { saved = localStorage.getItem("dmv_creator") || ""; } catch (_) {}
    const q = s => (s || "").replace(/"/g, "&quot;");
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:99990;background:rgba(8,9,12,.66);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif;";
    ov.innerHTML = `
      <div style="width:min(440px,100%);background:linear-gradient(180deg,#1b1d23,#15161a);border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden;color:#E9EAED">
        <div style="display:flex;align-items:center;padding:15px 20px;border-bottom:1px solid rgba(255,255,255,.08)">
          <div style="font:700 13px Oxanium,sans-serif;letter-spacing:.08em">📡 PUBLISH TO ${svc.toUpperCase()}</div>
          <button data-x style="margin-left:auto;border:none;background:transparent;color:#9aa0ab;cursor:pointer;font-size:20px;line-height:1">✕</button>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
          <div><div style="font:600 10px Oxanium;letter-spacing:.1em;color:#9aa0ab;text-transform:uppercase;margin-bottom:6px">Title</div>
            <input data-t value="${q(opts.title)}" maxlength="120" placeholder="Name your ${kind === "video" ? "video" : "track"}" style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E9EAED;font:400 13.5px Inter;padding:10px 12px;outline:none"></div>
          <div><div style="font:600 10px Oxanium;letter-spacing:.1em;color:#9aa0ab;text-transform:uppercase;margin-bottom:6px">${kind === "video" ? "Creator" : "Artist"}</div>
            <input data-by value="${q(saved)}" maxlength="80" placeholder="Your name" style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E9EAED;font:400 13.5px Inter;padding:10px 12px;outline:none"></div>
          ${kind === "music" ? `<div><div style="font:600 10px Oxanium;letter-spacing:.1em;color:#9aa0ab;text-transform:uppercase;margin-bottom:6px">Cover art <span style="opacity:.6;text-transform:none;font-weight:500">— optional</span></div>
            <div data-covdrop style="display:flex;align-items:center;gap:11px;border:1.5px dashed rgba(255,255,255,.1);border-radius:11px;padding:9px 11px;cursor:pointer">
              <div data-covthumb style="width:42px;height:42px;min-width:42px;border-radius:8px;display:grid;place-items:center;font-size:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);overflow:hidden">🎨</div>
              <div data-covtxt style="font-size:12.5px;color:#9aa0ab">Add album art</div>
              <input data-cover type="file" accept="image/*" style="display:none"></div></div>` : ""}
          ${kind === "video" ? `<div><div style="font:600 10px Oxanium;letter-spacing:.1em;color:#9aa0ab;text-transform:uppercase;margin-bottom:6px">Description</div>
            <textarea data-desc rows="2" maxlength="800" placeholder="What's this about? (optional)" style="width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E9EAED;font:400 13.5px Inter;padding:10px 12px;resize:vertical;outline:none"></textarea></div>` : ""}
          <div><div style="font:600 10px Oxanium;letter-spacing:.1em;color:#9aa0ab;text-transform:uppercase;margin-bottom:6px">Where fans pay you <span style="opacity:.6;text-transform:none;font-weight:500">— 100% yours, 0% to Notifi</span></div>
            <div style="display:flex;gap:8px">
              <select data-paym style="flex:none;width:100px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E9EAED;font:600 12px Inter;padding:9px 7px;outline:none">
                <option value="">— none —</option><option value="cashapp">Cash App</option><option value="venmo">Venmo</option><option value="paypal">PayPal</option><option value="kofi">Ko-fi</option><option value="link">Link</option></select>
              <input data-payh placeholder="$cashtag · @handle · link" maxlength="200" style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E9EAED;font:400 13px Inter;padding:9px 11px;outline:none"></div></div>
          <label data-ownrow style="display:flex;gap:9px;align-items:flex-start;cursor:pointer;border-radius:8px">
            <input type="checkbox" data-own style="margin-top:2px;width:16px;height:16px;accent-color:#3E9CB8;flex:none">
            <span style="font-size:11.5px;color:#9aa0ab;line-height:1.5">I made this &amp; own the rights — not uploading anyone else's music. <span style="opacity:.7">(Required.)</span></span></label>
          <button data-go style="height:46px;border:none;border-radius:12px;cursor:pointer;color:#0B1417;background:linear-gradient(135deg,${CY2},${CY});font:700 12.5px Oxanium;letter-spacing:.08em;box-shadow:0 0 18px rgba(62,156,184,.4)">Publish to ${svc}</button>
          <div style="font-size:11px;color:#9aa0ab;text-align:center">Goes live on The Stream — local &amp; private to this machine.</div>
        </div>
      </div>`;
    document.body.appendChild(ov);
    try { const p = JSON.parse(localStorage.getItem("dmv_pay") || "{}"); if (p.method) ov.querySelector("[data-paym]").value = p.method; if (p.handle) ov.querySelector("[data-payh]").value = p.handle; } catch (_) {}
    const close = () => ov.remove();
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    ov.querySelector("[data-x]").onclick = close;
    const esc = e => { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
    const tIn = ov.querySelector("[data-t]"); tIn.focus(); tIn.select();
    const covDrop = ov.querySelector("[data-covdrop]");
    if (covDrop) {
      const cin = ov.querySelector("[data-cover]");
      covDrop.onclick = () => cin.click();
      cin.onchange = () => { const f = cin.files[0]; if (!f) return;
        const u = URL.createObjectURL(f);
        ov.querySelector("[data-covthumb]").innerHTML = `<img src="${u}" style="width:100%;height:100%;object-fit:cover">`;
        ov.querySelector("[data-covtxt]").textContent = f.name; covDrop.style.borderColor = "rgba(62,156,184,.6)"; };
    }

    ov.querySelector("[data-go]").onclick = async () => {
      const title = tIn.value.trim(); if (!title) { tIn.focus(); return; }
      const by = ov.querySelector("[data-by]").value.trim();
      try { localStorage.setItem("dmv_creator", by); } catch (_) {}
      if (!ov.querySelector("[data-own]").checked) { const r = ov.querySelector("[data-ownrow]"); r.style.outline = "1px solid rgba(255,94,114,.75)"; setTimeout(() => r.style.outline = "", 1800); toast("Check the box to confirm you own this"); return; }
      const pmethod = ov.querySelector("[data-paym]").value, phandle = ov.querySelector("[data-payh]").value.trim(), pay = payUrl(pmethod, phandle);
      try { localStorage.setItem("dmv_pay", JSON.stringify({ method: pmethod, handle: phandle })); } catch (_) {}
      const go = ov.querySelector("[data-go]"); go.disabled = true; go.style.opacity = ".6"; go.textContent = "Publishing…";
      try {
        const body = { kind, title, creator: by, ext: opts.ext || "", meta: opts.meta || null, pay, payLabel: pay ? (PAYLABEL[pmethod] || "Support") : "", owns: true };
        if (opts.dur) body.dur = opts.dur;
        const descEl = ov.querySelector("[data-desc]"); if (descEl) body.desc = descEl.value.trim();
        if (opts.editor_jid) body.editor_jid = opts.editor_jid;
        else if (opts.path) body.path = opts.path;
        else if (opts.file) body.file = opts.file;
        else if (opts.blob) {
          body.file = await blobToDataURL(opts.blob);
          if (!body.ext && opts.blob.type) body.ext = ({ "audio/wav": "wav", "audio/mpeg": "mp3", "audio/ogg": "ogg", "video/mp4": "mp4", "video/webm": "webm" })[opts.blob.type] || "";
        }
        if (!body.dur && (opts.blob || opts.file)) { try { body.dur = await probeDur(opts.blob || opts.file, kind); } catch (_) {} }
        const covEl = ov.querySelector("[data-cover]");
        if (kind === "music" && covEl && covEl.files && covEl.files[0]) { try { body.cover = await blobToDataURL(covEl.files[0]); } catch (_) {} }
        await window.publishToStream(body);
        close(); document.removeEventListener("keydown", esc);
        toast(`Published to ${svc} ✓`, true);
      } catch (e) {
        go.disabled = false; go.style.opacity = "1"; go.textContent = "Publish to " + svc;
        toast("Publish failed — " + (e.message || "try again"));
      }
    };
  };
})();
