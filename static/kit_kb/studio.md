# DeMartin Audio Labs (Studio) — the DAW

A full mixing studio (a DAW) in the browser, built to feel like Pro Tools. This
is the deep how-to for everything in Studio. Keep answers short and point to
where things are; you can't see the screen, so describe locations.

## What Studio is
DeMartin Audio Labs is a Pro-Tools-style DAW that runs locally. You import or
record audio onto tracks, edit clips, add plugins, route signal through buses and
sends, mix it, drop a master chain on a Master Fader, and export a WAV. The whole
thing is built to be compact and faithful to Pro Tools — controls are small on
purpose; zoom in rather than expecting big knobs.

## The empty session / first run
A brand-new empty session shows a hero screen with quick-start buttons: Add stems,
New track, Record a take, and Open a session. It's not a black void — pick a
quick-start to begin. Once you have tracks, the hero gets out of the way.

## Getting audio in (import stems)
Drag and drop MP3 or WAV files straight onto the board. Each file becomes its own
track (its own lane). You can drop several at once and they each land on their own
track. That's the fastest way to start a mix from stems.

## Adding tracks (Track > New)
Open the Track menu and choose New (the New Tracks dialog). You set: how many
tracks, Mono or Stereo, the track TYPE (Audio, Aux Input, or Master Fader), and
the timebase. Audio tracks hold clips; Aux Input tracks are bus returns (they
listen to a bus); a Master Fader sums the whole mix. This creates real empty
tracks ready to record or route.

## The channel strip (per track)
Every track has a strip on the left with VOL (volume/fader), PAN, and insert
slots. The strip is where you set the level and panning and stack plugins on that
track. There's a Mix view that shows all the strips side by side like a real
mixer, and an Edit view for the timeline/clips — toggle between them in the
Window menu or the view toggle in the top toolbar.

## Adding plugins (inserts)
On a track's strip, click "+ insert" to add a plugin. Available plugins include
EQ-6, Compressor, De-Ess, Saturator, Cleanup, Gate, Tape Delay, and TIFF VERB,
among others. Click a plugin's name to open its window, then drag the knobs to
dial it in. Inserts process the track in order, top to bottom.

## Cleaning up a track (hiss / noise / harshness)
To clean a noisy or harsh track, add an insert on its strip: use Cleanup or Gate
to knock down hiss/noise/air between phrases, De-Ess to tame harsh "s" sounds, and
EQ-6 to carve problem frequencies. Open the plugin window and adjust its knobs.
Process happens in insert order, so put cleanup early in the chain.

## Editing a clip
Click a clip in a lane to select it, then you can: Reverse it, add Fades, Chop to
1/16, apply a BPM Delay, Print VERB (bake in reverb), or hit "Tune" to open the
pitch editor (Melodyne-style) for pitch correction. Selected clips can also be
Cut/Copy/Pasted, Duplicated (Ctrl+D), Muted (Ctrl+M), and Renamed (from the Clip
menu — the name draws on the clip).

## Edit commands (the Edit menu)
Built and working: Undo/Redo with live "Undo X / Redo Y" labels, Duplicate
(Ctrl+D), Cut/Copy/Paste (Ctrl+X/C/V), Insert Silence, Heal Separation (rejoin a
split), Trim Clip to Selection, and Consolidate (render a selection to one clip).
Mute Clips is Ctrl+M.

## Buses and sends (routing) — the core mixing concept
A BUS is a named internal signal path — it's ROUTING, not a track. You SEND tracks
to a bus, and an AUX INPUT track takes that bus as its Input — that aux is the
"return" where you put shared FX (like one reverb several tracks share). So the
pattern is: make an Aux (it creates a paired bus) → send tracks to that bus →
stack FX on the aux → route the aux's output. There is no "FX Bus" track type; the
track types are Audio, Aux Input, and Master Fader.

## Sends — the A-E / F-J banks
Each track has two send banks: A-E and F-J (ten sends total). For each send you
set: the target bus, level (defaults to -INF, i.e. silent until you raise it),
pan, on/off, and pre/post (FMP). A send taps the track's signal and feeds it to a
bus IN ADDITION to the track's main output — that's how you feed a shared reverb
or parallel chain. Pre-fader sends ignore the channel fader; post-fader sends ride
it. Raise the send level from -INF to hear it.

## The routing popup (I/O selectors)
Click a track's INPUT or OUTPUT selector (or a send slot) to open the routing
popup. It lists No-Send, the audio interface in/outs, the existing buses, and a
"+ New Bus" option. Feedback targets (anything that would create a routing loop)
are greyed out — the DAW refuses cycles, because a feedback loop with no delay
silently mutes everything in the loop. Defaults follow Pro Tools: -INF level,
post-fader, on.

## The Master Fader (mastering)
The Master Fader is a CREATED track, not a fixed lane: make one via Track > New >
Stereo > Master Fader (one per session). It sums the whole mix and sits at the
bottom; it has an ✕ to remove it. The mix still plays even WITHOUT a Master Fader
(the output bus always runs). Drop a mastering chain on it — EQ → compressor →
maximizer — and keep the maximizer LAST in the chain.

## Recording a take (arm + record)
Arm a track with its R (record-arm) button — one track arms at a time. Hit Record
in the transport and play; the take lands on the armed track as a clip. There's an
audible monitor by default so you hear input while recording. Stop ends the take.

## Transport and playback
Top toolbar transport: Play, Stop, Loop, and Record. Spacebar = play/stop. Stop
also kills the metronome/beat. Delete removes a selected clip. The transport is
guarded mid-record so you don't fumble states while a take is rolling.

## Views: Edit vs Mix
Toggle between EDIT view (the timeline with lanes and clips) and MIX view (the
channel strips side by side, like a console) — via the Window menu or the view
toggle in the top toolbar. Edit is for arranging/cutting; Mix is for levels,
pans, inserts, and sends across all tracks at once.

## Edit tools and edit modes
The toolbar has edit tools: Grab (move clips), Trim (resize clip edges), Select
(make a time/clip selection), and Smart (context-aware). B works mainly in Slip
and Grid edit modes, and the main time scale is Bars|Beats (not minutes:seconds).
Grid snap makes edits land on the beat.

## Zoom and navigation
The bottom zoom bar shows the whole song: a horizontal zoom slider plus a Fit
button (fits the whole session to the window), and a vertical slider that grows
the height of every lane together. Ctrl + mouse wheel also zooms. Use zoom to see
detail — don't try to enlarge the controls themselves.

## Audio device setup
Open Setup (in the toolbar / Setup menu) to choose your audio device — input and
output. Set this before recording so your mic/interface is the input and you hear
playback on the right output.

## Saving and loading sessions
Save and load projects from the File menu (Save Project / Open). Saves capture
everything: tracks, clips (with mute/name/gain), buses, per-track input/output
routing, and the full send matrix, plus whether a Master Fader is present and its
inserts. Older saves are migrated forward automatically. There's also a guard so
you don't lose work by closing the tab unsaved.

## Exporting / bouncing the mix
Hit "Export WAV" on the right of the top toolbar to bounce the mix down to a WAV
file. The export renders through the exact same routing as playback (buses, sends,
master chain), so the bounced file matches what you hear.

## Keyboard shortcuts (the main ones)
Spacebar = play/stop. Delete = remove selected clip. Ctrl+D = Duplicate.
Ctrl+X/C/V = Cut/Copy/Paste. Ctrl+M = Mute clips. Ctrl+Z / Ctrl+Shift+Z = Undo /
Redo. R (on a track) = record-arm.

## The mental model B cares about
Buses are routing, not tracks. Master Fader is a created track. Everything is
compact on purpose — match Pro Tools density, zoom to see detail. Time runs in
Bars|Beats. He wants it correct and faithful, not approximate — so if you're not
certain a feature exists the way someone describes, say so honestly.

## Why is my send silent / not making sound
A fresh send defaults to -INF (silent) on purpose. To hear it: open the send
(click the send slot in the A-E or F-J bank), make sure it's ON and pointed at a
real bus, and raise the level up from -INF. Also check that an Aux Input track is
actually listening to that bus (the return) and has something on it — a send to a
bus with no aux return makes no sound.

## I press play and hear nothing
Check, in order: the track's VOL isn't all the way down on its strip; the clip
isn't muted (Ctrl+M toggles mute); the right output is selected in Setup (audio
device); and there's actually audio at the playhead. The mix plays even without a
Master Fader (the output bus always runs), so a missing Master Fader isn't the
cause.

## How do I add reverb to a track
Two ways. Quick: add the TIFF VERB plugin directly as an insert on the track's
strip. Shared (better for a mix): make an Aux Input with a bus, put TIFF VERB on
the aux, then send the track to that bus and raise the send level — now several
tracks can share one reverb.

## My recording isn't capturing anything
Arm the track first with its R (record-arm) button — only one track arms at a
time. Make sure your input is selected in Setup (audio device). Then hit Record in
the transport and play; the take lands on the armed track as a clip. There's an
audible monitor by default so you should hear input while armed.

## How do I make a track louder or quieter
Use the VOL fader on that track's strip (in Mix view you see all the faders side
by side). For a clip-level change, you can also normalize or adjust the clip. The
Master Fader (if you made one) sets the overall mix level.

## How do I undo something
Ctrl+Z undoes, Ctrl+Shift+Z redoes. The Edit menu shows live "Undo X / Redo Y"
labels so you can see what the next undo/redo will do.
