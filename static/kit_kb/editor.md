# LePrince Visual Labs (Editor) — the video editor

A browser video editor / compositor built to look and feel like Adobe After
Effects. Deep how-to below. Some advanced AE features are shown in the menus for
fidelity but aren't built yet — be honest about what's wired vs. greyed.

## What the Editor is
LePrince Visual Labs is an After-Effects-style NLE and compositor. You bring in
clips, stack them as layers on a timeline, set composition settings, add effects,
keyframe properties for animation, and render out a video. The layout (menu bar,
tools rail, panels, monitor) mirrors AE.

## The workspace layout
Like After Effects: a top menu bar, a tools rail down the left, panels for the
media bin, the monitor (preview), the inspector, and the timeline at the bottom.
You can switch Workspaces to rearrange/show-hide panels for different jobs.

## Workspaces (presets)
Switch between Editing, Effects, Color, Audio, Minimal, and Review workspaces.
Each changes the panel density and shows/hides the bin, inspector, and timeline
to suit the task. Your choice is remembered (saved locally). Use Minimal for a
clean preview, Editing for general work.

## The menu bar
Nine AE-style menus: File, Edit, Composition, Layer, Effect, Animation, View,
Window, Help — with the real submenu structure. Items that are wired work;
everything else renders greyed on purpose (the full AE silhouette). Don't promise
a greyed item works.

## Bringing in media
Add clips into the project, then drag them onto the timeline as layers. The editor
supports adding video, audio, and text layers. (Add Text / add video / add audio
are the entry points; new layers stack in the timeline.)

## Compositions and Composition Settings
A composition is your canvas + timeline. Open Composition Settings with Ctrl+K
(or the Composition menu / the Inspector button). It has Basic, Advanced, and
3D-Renderer tabs where you set: a Preset, Width/Height (with Lock Aspect), Frame
Rate, Resolution, Duration, and Background Color. Set this first so your canvas is
the right size and length.

## Layers
Layers stack in the timeline (top layer draws on top). You can add a Text layer
(Layer > New > Text), reset a layer, and change its Blending Mode (and step to the
next/previous blend mode). Split Layer cuts a layer at the playhead.

## Effects
Add effects from the Effect menu. Wired effects include Gaussian Blur, Brightness
& Contrast, and Hue/Saturation, plus Remove All to clear a layer's effects. The
full effect category tree is shown for AE fidelity, but only the wired ones apply
— be honest about which.

## Keyframing / animation
Animate a property over time with keyframes: Add Keyframe, Toggle Hold (a held
keyframe doesn't interpolate), and Easy Ease (In/Out) to smooth the motion. Move
the playhead, change a value, add a keyframe — repeat to build the animation.

## Editing commands
Undo/Redo (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y), Cut, Copy, Paste, Duplicate, Clear,
and Split Layer are wired in the Edit menu. There's a checkpoint-based undo stack
(one checkpoint per committed change).

## Navigation / view
View menu: Zoom In / Zoom Out and Go to Time (jump the playhead to a timecode).
The monitor centers the comp; zoom to inspect without resizing panels.

## Rendering / exporting
Use File > Export (or Composition > Add to Render Queue) to render the finished
video out. Export runs the current composition through the render backend.

## What's NOT built yet (be honest, keep greyed)
These are shown for AE fidelity but aren't functional: masks/pen/shapes, paint
(brush/clone/eraser), roto and puppet tools, a real stacked effect engine,
precompose/nesting, true 3D, start-timecode / non-square pixels / drop-frame, and
ProRes/alpha export. If asked, say they're shown for completeness but not in this
build yet — don't fake them.

## Tools rail (what's wired)
14 AE tools are present: Selection, Hand, Zoom, Rotation, Anchor/Pan-behind,
Shape, Pen, Type, Brush, Clone, Eraser, Roto, Puppet. Selection and Type are
wired and usable; the rest are shown for AE fidelity and will say "not in this
build yet" if used.

## A tool or menu item does nothing when I click it
This is on purpose. The full After Effects menu and tool set is shown for fidelity,
but only the WIRED items work — everything else renders greyed or toasts "not in
this build yet." Wired right now: Selection + Type tools; File New/Open/Save/Export;
Edit undo/redo/cut/copy/paste/duplicate/split; Composition New/Settings; Layer New
Text + blending modes; Effects Gaussian Blur / Brightness & Contrast / Hue-Sat;
Animation keyframe/hold/easy-ease; View zoom + go-to-time; Window toggles. If it's
not on that list, it's not built yet — say so, don't pretend.

## How do I change the canvas size, frame rate, or length
Open Composition Settings — Ctrl+K, or the Composition menu, or the Inspector
button. There you set Width/Height (with Lock Aspect), Frame Rate, Resolution,
Duration, and Background Color. Set this before you build out the comp.

## My layer isn't showing up
Check layer order (the top layer in the timeline draws on top of the others), that
the layer actually sits under the playhead in time, and its blending mode. Make
sure it's been added to the timeline, not just sitting in the bin.

## How do I undo
Ctrl+Z undoes, Ctrl+Shift+Z (or Ctrl+Y) redoes. There's a checkpoint-based undo
stack — one checkpoint per committed change.
