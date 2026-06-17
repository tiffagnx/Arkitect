# DeMartin Audio Labs → a REAL DAW (Pro-Tools-grade) — Build Plan

**Read this before touching the Studio.** The owner (a 20-yr-experienced engineer who lives in Pro Tools) wants `static/studio.html` to grow from "a nice web mixer" into a **real, professional DAW** with the depth + layout of Pro Tools. What's there now is the *start*, not the destination. He showed Pro Tools screenshots to make the point; this doc captures that target in text so you don't need them.

## The core direction
1. **A real top MENU BAR**, top-LEFT, desktop-app style: `File · Edit · Track · Clip · Event · AudioSuite · Options · Setup · Window` — each a dropdown with real commands + keyboard shortcuts shown right-aligned, submenus where needed.
2. **Menus must render ABOVE everything** and escape the toolbar's `overflow:auto` (use `position:fixed` + JS-position, or portal to body, high z-index). The first File dropdown rendered *behind* the app because `.top` is a scroll container — already mitigated by making `.filemenu` `position:fixed`; apply the same to the whole menu bar.
3. **Room to grow.** Compact everything (transport already shrunk via `#play,#stop,#loop,#rec`); the bar should be dense + pro, not spaced-out with a giant Play button. He explicitly wants density like Pro Tools.
4. **Toolbar layout he asked for:** tiny **back arrow only** (done — dropped the logo img), **no redundant "DeMartin Audio Labs" title** in the bar (done — the window title already says it). **File + Ask Kit belong on the LEFT** next to the back arrow (the menu bar lives top-left; move Ask Kit there too — currently kit-helper.js appends it to the right end of `.top`).

## Pro Tools menu reference (captured from his screenshots — the TARGET structure)
Build the *skeleton* from this; populate with ARKITECT's real commands + realistic web-DAW additions (don't fake 1:1 Pro Tools).
- **File:** Create New (Ctrl+N) · Open Session (Ctrl+O) · Open Recent · Close (Ctrl+Shift+W) · Save (Ctrl+S) · Save As · Save Copy In · Save As Template · Revert to Saved · Bounce to · Import · Export · Get Info · Exit (Ctrl+Q)
- **Edit:** Undo (Ctrl+Z) · Redo · Restore Last Selection · Cut/Copy/Paste/Clear · Cut/Copy/Paste Special · Select All (Ctrl+A) · Duplicate (Ctrl+D) · Repeat (Alt+R) · Shift · Insert Silence · Trim Clip · Separate Clip · Heal Separation (Ctrl+H) · Consolidate Clip · Mute Clips (Ctrl+M) · Strip Silence (Ctrl+U) · Automation · Fades
- **Track:** New (Ctrl+Shift+N) · Group (Ctrl+G) · Duplicate · Split into Mono · Make Inactive · Delete · Freeze · Commit · Bounce · Bypass Inserts · Mute Sends · Scroll to Track · Create Click Track
- **Clip** (also a right-click context menu): Tools · Insert · Cut/Copy/Clear · Separate · Delete Fades · Clip Gain · Snap to Next/Previous · Spot · Mute Clips · Rename · Commit · Group/Ungroup · Loop/Unloop · Rating
- **Event:** tempo / meter / MIDI events (low priority for an audio-stem DAW)
- **AudioSuite** (offline processing): EQ · Dynamics · Pitch Shift · Reverb · Delay · Modulation · Harmonic · Noise Reduction · Sound Field · Other
- **Options:** Loop Record · Loop Playback (Ctrl+Shift+L) · Dynamic Transport · Link Timeline & Edit Selection · Automation Follows Edit · Click · Pre-Fader Metering · Solo Mode · Low Latency Monitoring
- **Setup:** Hardware · Playback Engine · I/O · Session · Click/Countoff · Preferences
- **Window:** Mix · Edit · Transport · Big Counter · Automation · Memory Locations · Undo History · System Usage

## Map to what ARKITECT ALREADY does (so menus aren't empty)
DeMartin today: drop stems → lanes · per-track VOL/PAN + insert plugin slots (EQ-6, Compressor, De-Ess, Saturator, Cleanup, Gate, Tape Delay, TIFF VERB, etc.) · MASTER lane mastering chain · FX buses + sends · clip edits (reverse, fades, chop 1/16, BPM delay, print VERB, Tune/Melodyne) · EDIT vs MIX toggle · transport · zoom/grid/snap · Save/Load mix · Export WAV. All currently wired by element ID (`addfiles`, `addAuxBtn`, `saveBtn`, `loadBtn`, `exportBtn`, `setupBtn`, `plugfile`) so a menu can call them directly.
- **File:** New/clear mix · Add tracks (`addfiles`) · Save mix (`saveBtn`) · Load mix (`loadBtn`) · Export WAV (`exportBtn`) · Load plugin .js (`plugfile`)
- **Edit:** Undo (exists: Ctrl+Z clip undo) · clip Cut/Copy/Paste (to add) · Separate/chop · Strip Silence (Cleanup-ish)
- **Track:** Add track · Add FX Bus (`addAuxBtn`) · Delete track · Duplicate (to add)
- **Clip:** the existing clip context tools (reverse, fades, chop, BPM delay, print VERB, Tune) → move under a Clip menu + keep the right-click
- **AudioSuite/Process:** Gain · Normalize · Fade · Pitch · Stretch (the existing AudioSuite panel) → a Process menu
- **Setup:** the existing audio-device rail (`setupBtn`)
- **Window:** toggle EDIT/MIX, Transport, etc.

## Research in flight
A 6-agent research swarm was launched on: pro-DAW menu IA across Pro Tools/Logic/Reaper/Ableton; how to build a real web menu bar that escapes overflow; mapping ARKITECT's features to menus; pro layout/density; standard keyboard shortcuts; web-DAW pitfalls + build order. **It may not have finished / may not carry to a new session — RE-RUN it** (the owner asked for the swarm explicitly). Then synthesize → **show the owner the menu-bar blueprint BEFORE building** (he was burned by building small without aligning first; map the whole skeleton, get his nod, then build).

## Build order (proposed)
1. The menu-bar **component** (top-left, File/Edit/Track/Clip/Process/Options/Setup/Window, position:fixed dropdowns, hover-to-switch, Esc/click-outside, keyboard shortcuts).
2. Wire existing commands into it (the IDs above) + move Ask Kit + the menu bar to the LEFT.
3. Add the missing high-value Edit/Track/Clip commands (Undo/Redo surfaced, clip Cut/Copy/Paste, New, Duplicate, Delete track).
4. Pro layout pass (density, edit-vs-mix, room for more).

## Owner's working style (carry this)
Plain English, doesn't code — make surgical edits, do the heavy lifting. Wants genuine enthusiasm OR genuine criticism, no flattery; he makes the final call. **Slow + exact** — mirror the vision back and align before building big. Verify in his real browser at `http://localhost:7777` (http). NEVER bulk-rewrite the emoji-heavy room HTML with PowerShell (mojibake). See `HANDOFF.md` for architecture + run instructions.
