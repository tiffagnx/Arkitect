# START HERE

*(Open this cold and don't remember where we were? 15-second read.)*

**Shipped: v1.6.0 is LIVE — Windows + Mac, both free.**
→ https://github.com/tiffagnx/Arkitect/releases/tag/v1.6.0
- `ARKITECT.zip` (Windows) + `DeMartinville-mac-arm64.zip` (Apple-Silicon Mac) are attached. Intel Mac builds alongside it.
- The website "download latest" + the in-app ⚙ updater serve it now. **Mac builds are free** (public repo — no money, ever).

**What v1.6.0 added (this session):**
- 🎛 **Bring-your-own native plugins** (Waves/VST3/AU) — in **Beat Lab** (🎛 Plugin on sampler/warp/slicer) and the **Studio** (right-click a clip → *Run through your plugin…*). Bakes your real plugin onto the audio.
- 🧠 **AI macros** on the plugin knobs (Smart → Brightness/Warmth/Punch, clamped safe).
- 〰 **Artifact-free Keep-Pitch stretch** (pro transient-aware engine, local — no cloud).
- ✂ **Draggable slice markers** + a **warp downbeat marker**.

**The ONE open decision** (for the new session):
- Native plugins work **on the owner's machine**, but the GPL audio engine (`pedalboard`) is **not bundled into setup**, so downloaders see "host not installed." Bundling it = plugins work for everyone (Win + Mac), but it's a **GPL licensing call + cross-platform work**. Deferred on purpose.

**Smaller leftovers:** "open the plugin's own window," a warm-worker so Waves doesn't reload ~40s per apply.

**Boogie is the ear** — have him A/B the stretch + the chops + a vocal through CLA-76 before sharpening anything.

---
### To restart, just say one of:
- *"Here's what Boogie said: ___"* → I sharpen those exact things.
- *"Bundle the plugin engine for everyone"* → we tackle the GPL + cross-platform distribution.
- *"Where are we?"* → I re-orient you.

Full detail: `NATIVE_PLUGINS_PLAN.md` · `CHANGELOG.md` · `BEAT_LAB_HANDOFF.md`

It's all saved + pushed. Go rest.
