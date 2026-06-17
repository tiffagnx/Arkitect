# THE BUILDER → THE STUDIO — plugin pipeline

The Builder (`static/build.html`) can now make **real Studio plugins**, not just web pages.
Flip the **🎛 Plugin** toggle, describe an effect, hit Build. The local coder model writes
one `TIFF_PLUGINS.register({...})` plugin, it lands on a **pro test bench** (faceplate +
transport + A/B + spectrum/meters), and an **OfflineAudioContext validator** checks it
(constructs → connects → renders → finite → non-silent → in-range) and auto-repairs failures
before you ever see them.

## How a built plugin reaches the Studio

1. **Today, zero Studio changes needed:** the Builder's **⬇ Download** gives a `.js` file that
   loads through the Studio's existing **⚡ Load plugin (.js)** button.
2. **Auto-appear (one line in the Studio):** the Builder's **💾 Send to Studio** saves the
   plugin to a store. The Studio can load *all* saved plugins on boot with a single fetch —
   no per-plugin step.

### Backend (already live in `app.py`)
- `POST /api/plugins`            — save `{name, subtitle, code}` (Send to Studio)
- `GET  /api/plugins`            — list `{id, name, subtitle, ts}`
- `GET  /api/plugins/{id}`       — full record incl. `code`
- `GET  /api/plugins/bundle.js`  — **all** saved plugins concatenated, each wrapped in its own
  try/catch so one bad plugin can't break the rest
- `DELETE /api/plugins/{id}`
- `POST /api/build` with `mode:"plugin"` — writes/updates a plugin (auto-routes to the coder
  model, low temp, `PLUGIN_SYSTEM` contract + worked example).

### The one-line Studio hook (for whoever owns `studio.html`)
Add this **after** the built-in plugins register (right after the `refreshPlugUi()` /
`$("plugfile")` block). It's purely additive — it just calls `TIFF_PLUGINS.register` more times:

```js
// Builder-made plugins — load them all so they show up in the effect chain + add-FX menu.
fetch('/api/plugins/bundle.js').then(r => r.text()).then(js => {
  try { (new Function(js))(); } catch (e) { console.error('[plugins] bundle failed', e); }
}).catch(() => {});
```

I did **not** edit `studio.html` myself — that file was being worked on in parallel and I
didn't want to collide. Drop the snippet in whenever the Studio work settles (or ping me and
I'll add it).

## The plugin contract (what the model writes)
```js
TIFF_PLUGINS.register({
  name, subtitle?, foot?,
  params: [{ id, label, min, max, step?, value, fmt? }],
  create(c){ /* AudioContext c */
    const input = c.createGain(), output = c.createGain();
    /* graph between input and output */
    return { input, output, set(id,v){…}, dispose?(){…} };
  }
});
```
Native Web-Audio nodes only (no AudioWorklet) so it drops straight into the Studio chain and
the bench's offline render. Full rules live in `PLUGIN_SYSTEM` in `app.py`.

## Note
`app.py` changed (new endpoints + plugin build mode) — **restart the Pink Room once** to pick
them up. `static/build.html` is served fresh per load, so the new UI shows on next refresh.
