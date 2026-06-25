// AUTO-GENERATED from studio-research/menu-config/*.json (verified Pro Tools menu spec).
// Regenerate from those JSON files; do not hand-edit. The Studio menu bar reads PT_MENUS;
// the right-click surfaces read PT_CONTEXT. feasibility: exists|buildable-now|buildable-later|skip.

window.PT_MENUS = [
 {
  "id": "file",
  "title": "File",
  "items": [
   {
    "label": "Create New...",
    "shortcut": "Ctrl+N",
    "ptShortcut": "Ctrl+N",
    "behavior": "Opens the Dashboard / New Session dialog to create a blank session or one from a template, setting audio file type, sample rate, bit depth, and I/O.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Session...",
    "shortcut": "Ctrl+O",
    "ptShortcut": "Ctrl+O",
    "behavior": "Opens the OS file picker to open a previously saved .ptx session; only one session may be open at a time.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Project...",
    "shortcut": "Ctrl+Alt+O",
    "ptShortcut": "Ctrl+Alt+O",
    "behavior": "Opens the Dashboard / Open Project view for local-cache or cloud-backed Avid Projects.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Recent",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu listing the 10 most recently opened sessions plus a Clear command to empty the list.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "(recent session 1…10)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Each entry reopens that session directly.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Clear",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Removes all sessions from the recent list.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Close Session",
    "shortcut": "Ctrl+Shift+W",
    "ptShortcut": "Ctrl+Shift+W",
    "behavior": "Closes the current session without quitting Pro Tools, prompting to save unsaved changes first.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Save",
    "shortcut": "Ctrl+S",
    "ptShortcut": "Ctrl+S",
    "behavior": "Saves changes since the last save to the current session file; cannot be undone and shows no dialog when a path exists.",
    "feasibility": "exists",
    "mapsTo": "saveProject()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Save As...",
    "shortcut": "Ctrl+Alt+S",
    "ptShortcut": "Ctrl+Start+S",
    "behavior": "Saves a copy under a new name/location and closes the original, continuing work on the renamed copy.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Save Copy In...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Saves a copy under a new name/location without closing the original, opening the Save Session Copy dialog with Items To Copy options.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Save As Template...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Saves the current session as a Session Template with options to install in system, choose a category, set a location, and include media.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Revert to Saved...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Restores the most recently saved version, discarding all changes since the last save.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Send To",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu for sharing/handoff to native or cloud services (DigiDelivery, SoundCloud, Sibelius/Avid Link).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Send via DigiDelivery (Avid Cloud)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Transfers the session plus all related files over the internet via Aspera DigiDelivery.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "SoundCloud...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Uploads the bounced mix to a linked SoundCloud account via a sign-in dialog.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sibelius (notation)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports MIDI/Instrument tracks to Sibelius/G7 as a MIDI file for scoring.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Bounce Down...",
    "shortcut": "Ctrl+Alt+B",
    "ptShortcut": "Ctrl+Alt+B",
    "behavior": "Opens the Bounce Down dialog to render the mix (or selected clips) to a WAV / MP3 file.",
    "feasibility": "exists",
    "mapsTo": "#exportBtn",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Import",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to bring files, clips, and data into the open session.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Session Data...",
      "shortcut": "Alt+Shift+I",
      "ptShortcut": "Alt+Shift+I",
      "behavior": "Imports selected data from another session including tracks, automation/routing, tempo/meter maps, markers, and window configurations.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio...",
      "shortcut": "Ctrl+Shift+I",
      "ptShortcut": "Ctrl+Shift+I",
      "behavior": "Imports audio files into a new track (plus Clip List) or Clip List only.",
      "feasibility": "exists",
      "mapsTo": "addFiles()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI...",
      "shortcut": "Ctrl+Alt+I",
      "ptShortcut": "Ctrl+Alt+I",
      "behavior": "Imports a Standard MIDI File's tracks into a new track or Clip List only with tempo-map and marker options.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Video...",
      "shortcut": "Ctrl+Alt+Shift+I",
      "ptShortcut": "Ctrl+Alt+Shift+I",
      "behavior": "Imports Avid/QuickTime video into the main/new video track or Clip List and can extract audio from a movie.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clip Groups...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Imports clip groups (.rgrp) into a new track or Clip List only.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Track Presets...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Imports a saved Track Preset (settings and plug-in chain) to create new tracks.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Export",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to export session tracks and data as files.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Selected Tracks as AAF/OMF...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports selected tracks in AAF/OMFI interchange format with audio, clip placement, fades, and basic automation.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Selected Tracks as New Session...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens Save Session Copy to write selected tracks and their audio as a standalone session (stems-as-session).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Selected Tracks as New Media Composer Compatible Session...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports selected tracks as a Media Composer-compatible session for sound-for-picture handoff (Pro Tools Ultimate).",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports the session or selected MIDI/Instrument tracks as a Standard MIDI File (Type 1 or Type 0) with meter/tempo/key.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sibelius / Score...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports the score as a Sibelius .sib file for notation handoff.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Session Info as Text...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Exports a tab-delimited text report of track names, plug-ins, I/O assignments, timecode, clip/file names, and crossfade info.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "(Mixdown / Stems)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Not a distinct File-menu leaf in classic builds; stem/mixdown export is done via Bounce to Disk or Export Selected Tracks as New Session.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Get Info...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the session info dialog with preference-saved topic fields and session-specific information fields for free-text notes/metadata.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Score Setup...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Score Setup window for page layout, staff spacing, title/composer, and display/layout/spacing options for the Score Editor.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Print Score...",
    "shortcut": "Ctrl+P",
    "ptShortcut": "Ctrl+P",
    "behavior": "WYSIWYG print of the score, printing only tracks shown in the score and configured via Score Setup.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Sign In",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Signs in to your Avid account to enable cloud Projects, collaboration, and marketplace; toggles to Sign Out when authenticated.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Exit",
    "shortcut": "Ctrl+Q",
    "ptShortcut": "Ctrl+Q",
    "behavior": "(Windows only.) Ends the session and closes the Pro Tools application, prompting to save unsaved changes.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "edit",
  "title": "Edit",
  "items": [
   {
    "label": "Undo",
    "shortcut": "Ctrl+Z",
    "ptShortcut": "Ctrl+Z",
    "behavior": "Sequentially undoes the last action; the menu label shows the next action (e.g. \"Undo Paste\") and some actions like Save are not undoable.",
    "feasibility": "exists",
    "mapsTo": "undoLast",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Redo",
    "shortcut": "Ctrl+Shift+Z",
    "ptShortcut": "Ctrl+Shift+Z",
    "behavior": "Re-applies the most recently undone action so you can A/B before and after.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Restore Last Selection",
    "shortcut": "Ctrl+Alt+Z",
    "ptShortcut": "Ctrl+Alt+Z",
    "behavior": "Restores the previous edit selection after it was lost, since selection changes are not part of the undo queue.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Cut",
    "shortcut": "Ctrl+X",
    "ptShortcut": "Ctrl+X",
    "behavior": "Removes the selection (clip data and any automation under it) to the clipboard, leaving a gap without rippling.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy",
    "shortcut": "Ctrl+C",
    "ptShortcut": "Ctrl+C",
    "behavior": "Copies the selection to the clipboard without altering the original.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paste",
    "shortcut": "Ctrl+V",
    "ptShortcut": "Ctrl+V",
    "behavior": "Inserts clipboard contents at the insertion/selection start on the target track, overwriting whatever is under the paste span.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Clear",
    "shortcut": "Delete",
    "ptShortcut": "Ctrl+B",
    "behavior": "Removes the selection from the Edit window without copying it to the clipboard (a delete, not a cut), leaving a gap without rippling.",
    "feasibility": "exists",
    "mapsTo": "deleteSelection(t)",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Cut Special",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that cuts a specific data layer (clip gain, clip effects, or automation) of a clip rather than the whole clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Cut Clip Gain",
      "shortcut": "Ctrl+Alt+Shift+X",
      "ptShortcut": "Start+Shift+X",
      "behavior": "Cuts only the clip-gain line under the selection to the clipboard.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut Clip Effects",
      "shortcut": null,
      "ptShortcut": "Ctrl+Alt+Start+X",
      "behavior": "Cuts clip-based (per-clip) plug-in effects; Pro Tools Ultimate only.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut All Automation",
      "shortcut": "Alt+Shift+X",
      "ptShortcut": "Alt+Shift+X",
      "behavior": "Cuts every automation type under the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut Volume Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Cuts only the volume automation under the selection (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut Pan Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Cuts only the pan automation under the selection (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut Mute Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Cuts only the mute automation under the selection (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut <Plug-In Parameter> Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "One dynamic entry per named plug-in or send parameter present (e.g. send level, a plug-in's Cutoff).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Copy Special",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that copies a specific data layer (clip gain, clip effects, or automation) of a clip rather than the whole clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Copy Clip Gain",
      "shortcut": "Ctrl+Alt+Shift+C",
      "ptShortcut": "Start+Shift+C",
      "behavior": "Copies only the clip-gain line.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy Clip Effects",
      "shortcut": null,
      "ptShortcut": "Ctrl+Alt+Start+C",
      "behavior": "Copies per-clip plug-in effects; Pro Tools Ultimate only.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy All Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies all automation under the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy Volume Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies only volume automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy Pan Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies only pan automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy Mute Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies only mute automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy <Plug-In Parameter> Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "One dynamic entry per named plug-in or send parameter present.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Paste Special",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that pastes clipboard contents in special ways (merge, fill selection, or onto the current automation type).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Merge",
      "shortcut": "Alt+M",
      "ptShortcut": "Alt+M",
      "behavior": "Pastes MIDI data without replacing existing data, merging it with what is already there (legacy name Merge Paste).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Repeat to Fill Selection",
      "shortcut": "Ctrl+Alt+V",
      "ptShortcut": "Ctrl+Alt+V",
      "behavior": "Repeatedly pastes the clipboard until it fills the selection, trimming the last copy and prompting for a crossfade if it does not divide evenly.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "To Current Automation Type",
      "shortcut": "Ctrl+Alt+Shift+V",
      "ptShortcut": "Ctrl+Start+V",
      "behavior": "Pastes the clipboard automation onto the currently displayed automation lane, regardless of the copied type.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Clear Special",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that clears a specific data layer (clip gain, clip effects, or automation) without writing to the clipboard.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Clear Clip Gain",
      "shortcut": "Ctrl+Shift+B",
      "ptShortcut": "Start+Shift+B",
      "behavior": "Clears the clip-gain line under the selection without writing to the clipboard.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Clip Effects",
      "shortcut": null,
      "ptShortcut": "Ctrl+Alt+Start+B",
      "behavior": "Clears per-clip plug-in effects; Pro Tools Ultimate only.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear All Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Clears all automation under the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Volume Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Clears only volume automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Pan Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Clears only pan automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Mute Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Clears only mute automation (dynamic per-parameter leaf).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear <Plug-In Parameter> Automation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "One dynamic entry per named plug-in or send parameter present.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Select All",
    "shortcut": "Ctrl+A",
    "ptShortcut": "Ctrl+A",
    "behavior": "Selects all audio/MIDI data on the focused track(s); the All group selects every track.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Selection",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of selection-range operations to link, play, move, and resize the selection.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "All",
      "shortcut": "Ctrl+A",
      "ptShortcut": "Ctrl+A",
      "behavior": "Mirrors Select All for the current scope, selecting the full track span.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Timeline to Match Edit",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies the edit selection onto the Timeline selection (Command-Focus quick key 0, not a menu accelerator).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Edit to Match Timeline",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies the Timeline selection onto the edit selection (Command-Focus quick key O, not a menu accelerator).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Play Edit Selection",
      "shortcut": "Alt+[",
      "ptShortcut": "Alt+[",
      "behavior": "Transport action that plays just the edit selection from its start, distinct from selection-start navigation.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Edit Selection Start",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Moves the insertion / scopes navigation to the start of the edit selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Edit Selection End",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Moves the insertion to the end of the edit selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Move Edit Left / Right (by selection amount)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Nudges the whole selection earlier/later by its own length.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Halve Selection",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Halves the selection length while keeping its start.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Double Selection",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Doubles the selection length while keeping its start.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Duplicate and Extend",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Duplicates the selected material and extends the selection to include the copy.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Move/Extend Edit Up / Down",
      "shortcut": "Ctrl+Alt+P",
      "ptShortcut": "Start+P / Start+; / Start+Shift+P / Start+Shift+;",
      "behavior": "Move or extend the selection across tracks (vertically).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove Edit from Top / Bottom",
      "shortcut": "Ctrl+Alt+Shift+P",
      "ptShortcut": "Alt+Start+P / Alt+Start+;",
      "behavior": "Shrinks a multi-track selection from the top/bottom edge.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Duplicate",
    "shortcut": "Ctrl+D",
    "ptShortcut": "Ctrl+D",
    "behavior": "Copies the selection and places the copy immediately after the original, back-to-back on the same track.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Repeat...",
    "shortcut": "Alt+R",
    "ptShortcut": "Alt+R",
    "behavior": "Like Duplicate but opens a dialog to enter the number of repetitions and lays that many back-to-back copies.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Shift...",
    "shortcut": "Alt+H",
    "ptShortcut": "Alt+H",
    "behavior": "Opens a dialog to move selected material earlier/later by a precise amount in the current time format.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Insert Silence",
    "shortcut": "Ctrl+Shift+E",
    "ptShortcut": "Ctrl+Shift+E",
    "behavior": "Inserts silence equal to the selection length across the selected track(s), rippling later material later.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Snap to",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that snaps the selected clip's start to an adjacent clip boundary (Next or Previous), distinct from the global grid-snap toggle.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Next",
      "shortcut": "Alt+.",
      "ptShortcut": "Alt+Start+.",
      "behavior": "Moves the selected clip so its start snaps to the next clip boundary / edit point to its right.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Previous",
      "shortcut": "Alt+,",
      "ptShortcut": "Alt+Start+,",
      "behavior": "Moves the selected clip so its start snaps to the previous clip boundary / edit point to its left.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Trim Clip",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of non-destructive clip-edge trims relative to the selection, insertion, fill-selection bounds, or source file.",
    "feasibility": "exists",
    "mapsTo": "bufSlice",
    "separator_after": false,
    "submenu": [
     {
      "label": "To Selection",
      "shortcut": "Ctrl+T",
      "ptShortcut": "Ctrl+T",
      "behavior": "Trims the clip down to the current selection, removing audio before and after it.",
      "feasibility": "exists",
      "mapsTo": "separateAtSelection(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Start To Insertion",
      "shortcut": "Alt+Shift+7",
      "ptShortcut": "Alt+Shift+7",
      "behavior": "Trims the clip's start to the edit insertion point (playhead).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "End To Insertion",
      "shortcut": "Alt+Shift+8",
      "ptShortcut": "Alt+Shift+8",
      "behavior": "Trims the clip's end to the insertion point.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "To Fill Selection",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Extends/trims the clip at both edges to fill the edit selection where source audio exists.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Start To Fill Selection",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Extends/trims only the clip's start to the beginning of the edit selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "End To Fill Selection",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Extends/trims only the clip's end to the end of the edit selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "To File Start",
      "shortcut": "Ctrl+Alt+R",
      "ptShortcut": "Ctrl+Start+R",
      "behavior": "Reveals trimmed audio at the head out to the underlying source-file start.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "To File End",
      "shortcut": "Ctrl+Alt+Y",
      "ptShortcut": "Ctrl+Start+Y",
      "behavior": "Reveals trimmed audio at the tail out to the source-file end.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "To File Boundaries",
      "shortcut": "Ctrl+Alt+T",
      "ptShortcut": "Ctrl+Start+T",
      "behavior": "Reveals trimmed audio at both edges out to the source-file boundaries.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Separate Clip",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that splits clip(s) at the selection, on the grid, or at transients.",
    "feasibility": "exists",
    "mapsTo": "separateAtSelection(t)",
    "separator_after": false,
    "submenu": [
     {
      "label": "At Selection",
      "shortcut": "Ctrl+E",
      "ptShortcut": "Ctrl+E",
      "behavior": "Splits the clip at the selection boundaries (or insertion point if no range), creating new clips on either side.",
      "feasibility": "exists",
      "mapsTo": "separateAtSelection(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "On Grid",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Splits the clip(s) at every grid line across the selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "At Transients",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Detects transients in the selection and splits the clip at each detected onset.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Heal Separation",
    "shortcut": "Ctrl+H",
    "ptShortcut": "Ctrl+H",
    "behavior": "Rejoins two adjacent clips into one, only if they are contiguous from the same source with unchanged start/end points.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Consolidate Clip",
    "shortcut": "Alt+Shift+3",
    "ptShortcut": "Alt+Shift+3",
    "behavior": "Renders the selection across gaps and edits into one new continuous audio file/clip, including silence in the gaps.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Mute Clips",
    "shortcut": "Ctrl+M",
    "ptShortcut": "Ctrl+M",
    "behavior": "Toggles mute on the selected clip(s), silencing playback without creating automation and greying out the clip.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Strip Silence",
    "shortcut": "Ctrl+U",
    "ptShortcut": "Ctrl+U",
    "behavior": "Opens the Strip Silence window to analyze the selection by threshold/min-length and separate out (delete) silent gaps.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "TCE Edit to Timeline Selection",
    "shortcut": "Alt+Shift+U",
    "ptShortcut": "Alt+Shift+U",
    "behavior": "Time-compresses/expands the audio in the Edit selection to fit the length of the Timeline selection; requires Edit and Timeline selections to be unlinked.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Automation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of clipboard and write operations on automation data under the selection.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Copy To Send",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies a track's current control value or automation playlist (Volume/Pan/Mute/LFE) to the corresponding send playlist via a dialog.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Cuts automation of the currently displayed type under the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copies automation of the current type.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Paste",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Pastes automation onto the current type.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim To",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Writes delta (relative) values to the selected automation, keeping the contour and shifting the level.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": [
       {
        "label": "To Current Parameter",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Trims delta values for only the displayed parameter.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       },
       {
        "label": "To All Enabled Parameters",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Trims delta values for every enabled parameter.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       }
      ]
     },
     {
      "label": "Glide To",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Creates a smooth transition from the existing value to a new value across the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": [
       {
        "label": "To Current Parameter",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Glides only the displayed parameter to a new value.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       },
       {
        "label": "To All Enabled Parameters",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Glides every enabled parameter to a new value.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       }
      ]
     },
     {
      "label": "Write To",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Writes automation snapshots in one step to the current or all enabled parameters.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": [
       {
        "label": "To Current Parameter",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Writes a snapshot for only the displayed parameter.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       },
       {
        "label": "To All Enabled Parameters",
        "shortcut": null,
        "ptShortcut": null,
        "behavior": "Writes a snapshot for every enabled parameter.",
        "feasibility": "buildable-later",
        "mapsTo": null,
        "separator_after": false,
        "submenu": null
       }
      ]
     },
     {
      "label": "Thin",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Thins overly dense automation data per the Preferences thinning amount to ease CPU.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Fades",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to create and remove fades, fade-ins/outs, and crossfades on the selection.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Create...",
      "shortcut": "Ctrl+F",
      "ptShortcut": "Ctrl+F",
      "behavior": "Opens the Fades editor and creates a fade-in/fade-out/crossfade across the selection per the chosen shape.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fade to Start",
      "shortcut": "Alt+D",
      "ptShortcut": "Start+D",
      "behavior": "Creates a fade-in from the clip start up to the insertion point with the default shape.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fade to End",
      "shortcut": "Alt+G",
      "ptShortcut": "Start+G",
      "behavior": "Creates a fade-out from the insertion point to the clip end.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Delete Fades",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Removes the fade(s) and crossfade(s) on the selected clip(s).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   }
  ]
 },
 {
  "id": "view",
  "title": "View",
  "items": [
   {
    "label": "Mix Window Views",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles; each shows/hides a row region of every Mix channel strip, staying open for multi-select.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Mic Preamps",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the per-strip mic-pre (gain/pad/phantom) row.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Instruments",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the instrument I/O row on Instrument tracks.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts A-E",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows insert slots A-E on each strip.",
      "feasibility": "exists",
      "mapsTo": "renderStripSlots",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts F-J",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows insert slots F-J (second insert bank).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends A-E",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows send slots A-E.",
      "feasibility": "exists",
      "mapsTo": "renderSends(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends F-J",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows send slots F-J.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "EQ",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows a live EQ curve mini-graph on the strip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dynamics",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows a live Dynamics curve mini-graph (gain-reduction/transfer).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Meters",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the level-meter region on each strip.",
      "feasibility": "exists",
      "mapsTo": "buildStrip",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Faders",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the volume-fader region on each strip.",
      "feasibility": "exists",
      "mapsTo": "buildStrip",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Delay Compensation",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the delay-comp value/override row.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Track Color",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the track color strip/swatch on each channel.",
      "feasibility": "exists",
      "mapsTo": "laneUi():2097",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Comments",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the per-track comment field row.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "All",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: show every Mix view region.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "None",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: hide every Mix view region.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Narrow Mix",
    "shortcut": "Ctrl+Alt+M",
    "ptShortcut": "Control+Alt+M",
    "behavior": "Toggle that shrinks all Mix channel strips to minimum width; track/send/plug-in names abbreviate.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Edit Window Views",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles; each shows/hides a column in the Edit-window track headers, staying open for multi-select.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Comments",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows comment field in the track header.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mic Preamps",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows mic-pre controls in the header.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Instruments",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows instrument I/O in the header (Instrument tracks).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts A-E",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows inserts A-E column in the header.",
      "feasibility": "exists",
      "mapsTo": "renderStripSlots",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts F-J",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows inserts F-J column.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends A-E",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows sends A-E column.",
      "feasibility": "exists",
      "mapsTo": "renderSends(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends F-J",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows sends F-J column.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "I/O",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows input/output selector column in the header.",
      "feasibility": "exists",
      "mapsTo": "renderChannel():2485",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Real-Time Properties",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the per-track MIDI Real-Time Properties strip (quantize/transpose/etc).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Track Color",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Shows the track color bar in the header.",
      "feasibility": "exists",
      "mapsTo": "laneUi():2097",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "All",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: show every Edit header column.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minimal",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: show only Track Color.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Rulers",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles selecting which Timebase and Conductor rulers show across the top of the Edit window; stays open for multi-select.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Bars|Beats",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Musical bars/beats ruler; drives tempo-aligned selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minutes:Seconds",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Min:Sec timebase ruler.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Timecode",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "SMPTE-frame ruler (frame rate/start from Session Setup).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Timecode 2",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Secondary timecode ruler (Ultimate).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Feet+Frames",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "35 mm film feet+frames ruler (Ultimate).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Samples",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Sample-count ruler for sample-accurate editing.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Markers",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Markers ruler (memory-location flags along the timeline).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tempo",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tempo ruler; expands to the Tempo Editor (tempo automation) in the ruler area.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Meter",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Meter (time-signature) ruler.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Key Signature",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Key-signature ruler; sub-toggle shows/hides the Key Signature Staff.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Chord Symbols",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Chord-symbol ruler.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Video",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Video track ruler (frames of the movie) (Ultimate).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "All",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: show every ruler.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minimal",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Quick-set: show only the main timebase ruler.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Other Displays",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles that open/close auxiliary panels and docked editors; a check mark indicates an open display.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Universe",
      "shortcut": "Alt+7",
      "ptShortcut": "Alt+7",
      "behavior": "Toggle the Universe strip: a zoomed-out colored overview of all non-hidden tracks; click/drag to navigate.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Track List",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide the Track List (track show/hide + reorder panel).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clip List",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide the Clip List (all clips/regions in session).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI Editor",
      "shortcut": "Ctrl+Alt+=",
      "ptShortcut": "Start+=",
      "behavior": "Open a MIDI Editor window; grayed if no MIDI exists.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI Editor (docked)",
      "shortcut": "Ctrl+Shift+Alt+=",
      "ptShortcut": "Shift+Alt+Start+=",
      "behavior": "Open/close a MIDI Editor docked in the Edit window.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Melodyne Editor",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Open/close the docked Melodyne (ARA) editor; maps to our own docked note editor.",
      "feasibility": "exists",
      "mapsTo": "openTune(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clip Effects",
      "shortcut": "Alt+6",
      "ptShortcut": "Alt+6",
      "behavior": "Open/close the docked Clip Effects editor (per-clip insert FX) (Ultimate/Studio).",
      "feasibility": "exists",
      "mapsTo": "openAudioSuite():709",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Track Transcription Lane",
      "shortcut": "Ctrl+Shift+U",
      "ptShortcut": "Shift+Control+U",
      "behavior": "Show/hide the AI speech-to-text transcription lane under a track.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Clip",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles controlling overlays drawn on/around clips in the Edit window.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Name",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide clip names on clips.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clip Gain Line",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide an editable clip-gain breakpoint line (per clip, like volume automation).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clip Gain Info",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide the clip-gain value icon/readout.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Overlap",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide the dog-ear corner marking overlapping clip boundaries.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sync Point",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide clip sync points (clips still align to them regardless of display).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Processing State",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide the Elastic Audio processing-state indicator on warped clips.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Channel Name",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide channel names inside clips.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scene and Take",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide scene/take metadata in clips (field-recorder workflow).",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Rating",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show/hide clip ratings.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Current Time",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Display each clip's current timeline position as a stamp.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Original Time Stamp",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Display each clip's permanent original (SMPTE-relative) time stamp.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "User Time Stamp",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Display the editable User Time Stamp.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "No Time",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Disable the clip time-stamp display (mutually exclusive radio with the three Time options above).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Display on All Channels",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Apply the chosen clip display option to all channels of a multichannel field-recorder clip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Waveforms",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu choosing how clip waveforms are calculated and drawn; Peak/Power are mutually exclusive, Rectified and Outlines are independent overlays.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Peak",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Draw waveform from sample-by-sample peak (default; shows clipping). Radio with Power.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Power",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Draw waveform from RMS (better macro shape when zoomed out). Radio with Peak.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Rectified",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Sum +/- excursions into one positive-going shape rising from the track bottom; toggle, works with Peak or Power.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Outlines",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Draw an outline around the waveform.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Overlapped Crossfades",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show the fade-in/fade-out waveforms inside crossfades.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Automation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to overlay extra automation playlists alongside the main one (Ultimate only).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Trim Playlist",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Overlay (read-only) Trim automation atop Volume/Send-level automation.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Composite Playlist",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Overlay (read-only) the composite Volume/Mute playlist reflecting a VCA Master's contribution on a slave track.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Sends A-E",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Choose whether the Sends A-E area shows Assignment (all five at once) or the expanded controls of one individual send.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Assignment",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show all five send assignments compactly.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send A",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send A to full controls (fader/pan/meter).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send B",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send B to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send C",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send C to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send D",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send D to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send E",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send E to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Sends F-J",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Same chooser for the second send bank (F-J): Assignment or one expanded send.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Assignment",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show all five send assignments compactly.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send F",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send F to full controls (fader/pan/meter).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send G",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send G to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send H",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send H to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send I",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send I to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send J",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Expand send J to full controls.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Track Number",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggle that numbers each track by its position in the Mix/Edit windows; numbers stay in positional sequence when tracks are reordered.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Transport",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of tick-box toggles selecting which control groups appear in the Transport window.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Counters",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show the counter section in the Transport window.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI Controls",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show tempo/meter/click/MIDI-merge controls in the Transport window.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Synchronization",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show sync (online/chase) controls.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minimal",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show only the basic transport buttons.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Expanded",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Show the expanded transport layout (same target as the top-level Expanded Transport toggle).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Main Counter",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu (radio) setting the Time Scale shown in the Main Counter (the primary big time readout).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Bars:Beats",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Counter reads bars|beats|ticks.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minutes:Seconds",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Counter reads minutes:seconds.",
      "feasibility": "exists",
      "mapsTo": "tickUi():3325",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Timecode",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Counter reads SMPTE frames (frame rate/start from Session Setup) (Ultimate).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Feet+Frames",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Counter reads 35 mm feet+frames (Ultimate).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Samples",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Counter reads sample count.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Expanded Transport",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggle showing the expanded transport layout (counters + MIDI/sync controls beside the basic buttons); mirrors Transport > Expanded.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "track",
  "title": "Track",
  "items": [
   {
    "label": "New...",
    "shortcut": "Ctrl+Shift+N",
    "ptShortcut": "Ctrl+Shift+N",
    "behavior": "Opens the New Tracks dialog to add one or more tracks of a chosen type, format, and timebase.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Group...",
    "shortcut": "Ctrl+G",
    "ptShortcut": "Ctrl+G",
    "behavior": "Opens the Group dialog to create, modify, duplicate, or delete mix/edit groups and choose which attributes follow the group.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Duplicate...",
    "shortcut": "Alt+Shift+D",
    "ptShortcut": "Alt+Shift+D",
    "behavior": "Opens the Duplicate dialog to copy selected track(s) and choose which data (audio/MIDI, playlists, automation, inserts, sends, group assignments) to carry over.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Split into Mono",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Splits a selected stereo/multichannel track into independent mono tracks; cannot be undone.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Make Inactive",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Makes selected tracks inactive so they stop playing and release DSP/voices; toggles to Make Active.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Delete",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Removes selected tracks; clip audio stays in the Clip List but the track and its playlist arrangement are lost.",
    "feasibility": "exists",
    "mapsTo": ".ts-x",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Freeze",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Reversibly renders a track and its inserts/automation/clip-gain to a temporary audio file to free CPU; click again to un-freeze.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Commit...",
    "shortcut": "Alt+Shift+C",
    "ptShortcut": "Alt+Shift+C",
    "behavior": "Opens the Commit Tracks dialog and renders selected track(s) to new audio track(s), printing inserts/automation permanently.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Bounce...",
    "shortcut": "Ctrl+Alt+Shift+B",
    "ptShortcut": "Ctrl+Alt+Shift+B",
    "behavior": "Opens the Bounce dialog and renders selected track(s)' output (or a chosen send) to disk as audio file(s), optionally re-imported.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Bypass Inserts",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that bypasses banks or plug-in categories of inserts on selected track(s).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "All",
      "shortcut": "Shift+A",
      "ptShortcut": "Shift+A",
      "behavior": "Bypasses or un-bypasses every insert on selected track(s) as a toggle.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts A-E",
      "shortcut": "Shift+2",
      "ptShortcut": "Shift+2",
      "behavior": "Bypasses or un-bypasses the top insert bank (slots A-E).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inserts F-J",
      "shortcut": "Shift+3",
      "ptShortcut": "Shift+3",
      "behavior": "Bypasses or un-bypasses the bottom insert bank (slots F-J).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "EQ",
      "shortcut": "Shift+E",
      "ptShortcut": "Shift+E",
      "behavior": "Bypasses or un-bypasses all EQ-category inserts on selected track(s).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dynamics",
      "shortcut": "Shift+C",
      "ptShortcut": "Shift+C",
      "behavior": "Bypasses or un-bypasses all Dynamics-category inserts (comp/limiter/gate) on selected track(s).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reverb",
      "shortcut": "Shift+V",
      "ptShortcut": "Shift+V",
      "behavior": "Bypasses or un-bypasses all Reverb-category inserts on selected track(s).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Delay",
      "shortcut": "Shift+D",
      "ptShortcut": "Shift+D",
      "behavior": "Bypasses or un-bypasses all Delay-category inserts on selected track(s).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Modulation",
      "shortcut": "Shift+W",
      "ptShortcut": "Shift+W",
      "behavior": "Bypasses or un-bypasses all Modulation-category inserts (chorus/flanger/phaser) on selected track(s).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Mute Sends",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu that mutes banks of sends on selected track(s).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "All",
      "shortcut": "Shift+Q",
      "ptShortcut": "Shift+Q",
      "behavior": "Mutes or un-mutes every send on selected track(s) as a toggle.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends A-E",
      "shortcut": "Shift+4",
      "ptShortcut": "Shift+4",
      "behavior": "Mutes or un-mutes send bank A-E.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sends F-J",
      "shortcut": "Shift+5",
      "ptShortcut": "Shift+5",
      "behavior": "Mutes or un-mutes send bank F-J.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Write MIDI Real-Time Properties",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Permanently writes the non-destructive MIDI Real-Time Properties (quantize, duration, delay, velocity, transpose) of selected MIDI/Instrument track(s) into the actual MIDI data.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Set Record Tracks to Input Only",
    "shortcut": "Alt+K",
    "ptShortcut": "Alt+K",
    "behavior": "Forces all record-armed tracks to monitor live input regardless of punch state; toggles back to Set Record Tracks to Auto Input.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Scroll to Track...",
    "shortcut": "Ctrl+Alt+F",
    "ptShortcut": "Ctrl+Alt+F",
    "behavior": "Opens a Scroll to Track entry box and scrolls the Edit window so the named/numbered track is as near the top as possible.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Clear All Clip Indicators",
    "shortcut": "Alt+C",
    "ptShortcut": "Alt+C",
    "behavior": "Resets all red clip (peak-hold) indicators on every meter in the session.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Coalesce VCA Master Automation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Commits a VCA Master's Volume/Mute automation contribution down into its slave tracks' automation playlists.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Coalesce Trim Automation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Manually applies pending Trim automation onto the main automation playlist now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Clear Trim Automation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Deletes all uncoalesced Trim breakpoints and resets all Trim faders to zero.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Create Click Track",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Creates one or more click tracks (Aux Input tracks with the Click plug-in inserted) driven by the session tempo/meter.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "clip",
  "title": "Clip",
  "items": [
   {
    "label": "Edit Lock/Unlock Clips",
    "shortcut": "Ctrl+L",
    "ptShortcut": "Ctrl+L",
    "behavior": "Toggle that prevents the selected clip from being cut, deleted, separated, trimmed, or moved, drawing a lock badge on it.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Time Lock/Unlock the selected Clip",
    "shortcut": "Ctrl+Alt+L",
    "ptShortcut": "Alt+Start+L",
    "behavior": "Toggle that locks the clip to its timeline position so it cannot be moved or deleted, while still allowing trim and processing.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Send to Back",
    "shortcut": "Alt+Shift+B",
    "ptShortcut": "Alt+Shift+B",
    "behavior": "Sends the selected clip behind overlapping neighbors, changing which clip wins where they overlap (mainly meaningful in a nudge workflow).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Bring to Front",
    "shortcut": "Alt+Shift+F",
    "ptShortcut": "Alt+Shift+F",
    "behavior": "Brings the selected clip in front of overlapping neighbors (per-clip when multiple are selected).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Tools",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to switch the active Edit tool (Zoomer, Trimmer, Selector, Grabber, Scrubber, Pencil).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Zoomer",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch the active Edit tool to the Zoomer.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trimmer",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch to the Trim tool.",
      "feasibility": "exists",
      "mapsTo": "setTool('trim')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Selector",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch to the Selector (range) tool.",
      "feasibility": "exists",
      "mapsTo": "setTool('select')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Grabber",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch to the Grabber (move) tool.",
      "feasibility": "exists",
      "mapsTo": "setTool('grab')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scrubber",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch to the Scrub tool (jog-style audition).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pencil",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Switch to the Pencil tool (draw automation / redraw waveform).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Insert",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to insert conductor-ruler events (key signature, meter, chord) at the selection.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Key Signature...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Insert a key-signature event at the selection on the conductor ruler.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Meter...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Insert a meter (time-signature) change.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Chord...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Insert a chord symbol on the Chord ruler.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Cut",
    "shortcut": "Ctrl+X",
    "ptShortcut": "Ctrl+X",
    "behavior": "Cut the Edit selection to the clipboard, removing it from the timeline (leaves a gap in Slip, slides downstream clips in Shuffle).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy",
    "shortcut": "Ctrl+C",
    "ptShortcut": "Ctrl+C",
    "behavior": "Copy the Edit selection to the clipboard, leaving the timeline intact.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paste",
    "shortcut": "Ctrl+V",
    "ptShortcut": "Ctrl+V",
    "behavior": "Paste clipboard contents at the Edit insertion, overwriting or inserting per edit mode.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Clear",
    "shortcut": "Delete",
    "ptShortcut": "Delete / Backspace",
    "behavior": "Remove the Edit selection without copying to the clipboard (i.e. delete); bound to Delete/Backspace, not Ctrl+B.",
    "feasibility": "exists",
    "mapsTo": "deleteSelection(t)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Duplicate",
    "shortcut": "Ctrl+D",
    "ptShortcut": "Ctrl+D",
    "behavior": "Copies the selection and pastes one copy immediately after itself, end-to-end.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Repeat...",
    "shortcut": "Alt+R",
    "ptShortcut": "Alt+R",
    "behavior": "Like Duplicate but pastes N copies back-to-back, with a dialog asking how many.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy To",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to copy the selection to a playlist (Main / New / Duplicate / existing) on the same track for comping.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Move To",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to move the selection to a playlist (Main / New / Duplicate / existing).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Matching Alternates",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to swap the selected clip for an alternate take/channel occupying the same timeline range.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "(list of matching Alternates)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Lists every alternate clip/take whose timestamp range matches the selection; choosing one replaces the current clip in place.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "(list of matching Channels)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "For multichannel source files, lists alternate channels to swap in.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Match Criteria...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens a dialog to define what counts as a match (name root, timestamp, channel, etc.).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Expand Alternates to New Playlists",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Lays every matching alternate onto new playlist lanes of the track.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Expand Alternates to New Tracks",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Lays every matching alternate onto new tracks.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Elastic Properties...",
    "shortcut": null,
    "ptShortcut": "Alt+5 (numeric keypad)",
    "behavior": "Opens the Elastic Properties window for clips on an Elastic-Audio track: source/destination tempo, pitch shift, and warp info.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Conform to Tempo",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "On Elastic tracks, analyzes the clip's intrinsic tempo and time-warps it to the session tempo.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Remove Warp",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Removes warping created by Warp markers (quantize/tempo-map), keeping the markers.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Remove Pitch Shift",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Removes pitch shift applied via the Elastic Properties Pitch Shift field.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Separate Clip",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to split clip(s) at the selection: At Selection, On Grid, or At Transients.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "At Selection",
      "shortcut": "Ctrl+E",
      "ptShortcut": "Ctrl+E",
      "behavior": "Split exactly at the Edit-selection boundaries into discrete clips.",
      "feasibility": "exists",
      "mapsTo": "separateAtSelection(t)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "On Grid",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Split the selection at every Grid line.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "At Transients",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Split at each detected transient (after Analysis / Tab-to-Transient).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Heal Separation",
    "shortcut": "Ctrl+H",
    "ptShortcut": "Ctrl+H",
    "behavior": "Re-joins clips split by Separate back into one continuous clip, only if pieces are still adjacent and from the same source file.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Consolidate Clip",
    "shortcut": "Alt+Shift+3",
    "ptShortcut": "Alt+Shift+3",
    "behavior": "Flattens the Edit selection (clips plus silence gaps) into one new continuous audio file/clip printed to disk.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Strip Silence...",
    "shortcut": "Ctrl+U",
    "ptShortcut": "Ctrl+U",
    "behavior": "Analyzes the selection and separates clips by removing silence (threshold/min-length/pad controls), leaving only audible regions.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Trim Clip",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to trim clip boundaries to the selection or insertion, or out to the underlying file.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Trim Clip to Selection",
      "shortcut": "Ctrl+T",
      "ptShortcut": "Ctrl+T",
      "behavior": "Trims the clip down to exactly the Edit selection, discarding audio outside it as clip boundaries.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim Start to Insertion",
      "shortcut": "Alt+Shift+7",
      "ptShortcut": "Alt+Shift+7",
      "behavior": "Trims the clip start to the insertion point.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim End to Insertion",
      "shortcut": "Alt+Shift+8",
      "ptShortcut": "Alt+Shift+8",
      "behavior": "Trims the clip end to the insertion point.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim to File Start",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Reveals trimmed audio out to the start of the underlying file.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim to File End",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Reveals trimmed audio out to the end of the underlying file.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Trim to File Boundaries",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Reveals trimmed audio out to both file start and end boundaries.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Delete Fades",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Deletes the fade(s)/crossfade(s) within the selection; only active when a fade is selected.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Fades",
    "shortcut": "Ctrl+F",
    "ptShortcut": "Ctrl+F",
    "behavior": "Submenu applying fade shapes (Standard / S-Curve / Equal Power / Equal Gain) and Batch Fades to the selection.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Standard",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Apply a standard (linear) fade shape to the selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "S-Curve",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Apply an S-curve fade shape to the selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Equal Power",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Apply an equal-power crossfade shape to the selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Equal Gain",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Apply an equal-gain crossfade shape to the selection.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Batch Fades...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens a dialog to apply fades/crossfades across multiple selected clip boundaries at once.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Clip Gain",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu for the per-clip gain layer (a dB offset drawn across the clip), independent of the track fader.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Bypass/Unbypass Clip Gain",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Toggles clip gain on/off while preserving the setting.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Clip Gain",
      "shortcut": "Ctrl+Shift+B",
      "ptShortcut": "Ctrl+Shift+B",
      "behavior": "Resets clip gain to 0 dB, removing the line/breakpoints (the Clear Special > Clear Clip Gain command).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Render Clip Gain",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Prints the clip-gain curve into the audio and resets gain to 0 dB.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut/Copy/Paste Clip Gain",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Moves the clip-gain settings to the clipboard or onto another clip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Show/Hide Clip Gain Line",
      "shortcut": "Ctrl+Shift+-",
      "ptShortcut": "Ctrl+Shift+- (hyphen)",
      "behavior": "Toggles the on-clip gain line and handle session-wide.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Clip Effects",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu for per-clip non-destructive insert FX (a mini plugin chain living on the clip); some entries are Ultimate-only.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Bypass/Unbypass Clip Effects",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Toggle the clip's effects.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Copy Clip Effects",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Copy clip-effects settings (Ultimate only).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear Clip Effects",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Remove clip effects (Ultimate only).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Render Clip Effects",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Print clip effects into the audio (Ultimate only); matches Studio's Render-onto-clip AudioSuite flow.",
      "feasibility": "exists",
      "mapsTo": "openAudioSuite()",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Melodyne",
    "shortcut": "Ctrl+Shift+A",
    "ptShortcut": "Ctrl+Shift+A",
    "behavior": "ARA2 Melodyne submenu (Edit / Bypass / Clear / Render / Show-Hide Notes) for editing audio-clip pitch; Studio maps Edit to its Tune view.",
    "feasibility": "exists",
    "mapsTo": "openTune()",
    "separator_after": true,
    "submenu": [
     {
      "label": "Edit",
      "shortcut": "Ctrl+Shift+A",
      "ptShortcut": "Ctrl+Shift+A",
      "behavior": "Open the selected audio clip in the Melodyne (note) editor; maps to Studio's Tune view.",
      "feasibility": "exists",
      "mapsTo": "openTune()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bypass",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Toggle the Melodyne/ARA pitch edit on the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Clear",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Remove the Melodyne/ARA pitch edit from the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Render",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Print the Melodyne pitch edit into the clip's audio buffer.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Show-Hide Notes",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Toggle the overlay of Melodyne note blobs on the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Snap to Next",
    "shortcut": "Ctrl+Alt+.",
    "ptShortcut": "Alt+Start+. (period)",
    "behavior": "Moves the selected clip so its end butts up against the start of the next clip, closing the gap to the right.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Snap to Previous",
    "shortcut": "Ctrl+Alt+,",
    "ptShortcut": "Alt+Start+, (comma)",
    "behavior": "Moves the selected clip so its start butts against the previous clip's end.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Spot...",
    "shortcut": null,
    "ptShortcut": "F3 (Spot mode toggle)",
    "behavior": "In Spot mode, moving/dragging a clip opens the Spot dialog to place its start/sync/end at an exact typed location.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Auto-Spot Clips",
    "shortcut": null,
    "ptShortcut": "Ctrl+P",
    "behavior": "Spots the clip to an incoming/captured timecode automatically (post workflow); actually an Options-menu command.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Mute/Unmute Clips",
    "shortcut": "Ctrl+M",
    "ptShortcut": "Ctrl+M",
    "behavior": "Toggles clip mute: the muted clip stays in place but is silenced and drawn dimmed, independent of track Mute.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Rename...",
    "shortcut": "Ctrl+Alt+Shift+R",
    "ptShortcut": "Ctrl+Alt+Shift+R",
    "behavior": "Renames the selected clip; renaming an auto-created clip promotes it to a user-defined clip.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Quantize to Grid",
    "shortcut": "Ctrl+0",
    "ptShortcut": "Ctrl+0 (zero)",
    "behavior": "Snaps the selected clip's start (or its Sync Point) to the nearest Grid line without time-stretching; applies to audio and MIDI clips.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Group",
    "shortcut": "Ctrl+Alt+G",
    "ptShortcut": "Ctrl+Alt+G",
    "behavior": "Submenu (Group Clips) bundling the selection into a single clip group that moves and edits as one unit; nestable.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Group Clips",
      "shortcut": "Ctrl+Alt+G",
      "ptShortcut": "Ctrl+Alt+G",
      "behavior": "Bundles the selection into a single clip group that moves and edits as one unit.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Ungroup",
    "shortcut": "Ctrl+Alt+U",
    "ptShortcut": "Ctrl+Alt+U",
    "behavior": "Submenu (Ungroup / Ungroup All) unpacking the front-most clip group, revealing underlying clips/nested groups.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Ungroup",
      "shortcut": "Ctrl+Alt+U",
      "ptShortcut": "Ctrl+Alt+U",
      "behavior": "Unpacks the front-most top-layer clip group, revealing underlying clips/nested groups; also unloops a looped clip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Ungroup All",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Removes all layers of nested clip groups in the selection in one step; flattens looped clips into one clip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Regroup",
    "shortcut": "Ctrl+Alt+R",
    "ptShortcut": "Ctrl+Alt+R",
    "behavior": "Submenu (Regroup) re-creating the last group you ungrouped, so you can ungroup, edit, then regroup.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Regroup",
      "shortcut": "Ctrl+Alt+R",
      "ptShortcut": "Ctrl+Alt+R",
      "behavior": "Re-creates the last group you ungrouped.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Loop...",
    "shortcut": "Ctrl+Alt+L",
    "ptShortcut": "Ctrl+Alt+L",
    "behavior": "Opens the Clip Looping dialog to loop the clip N times or to fill a length/selection, creating a single looped clip.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Unloop",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Converts a looped clip back to standard clips (one per iteration) for individual editing.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Capture...",
    "shortcut": "Ctrl+R",
    "ptShortcut": "Ctrl+R",
    "behavior": "Defines the current selection as a new clip and adds it to the Clips List without altering the timeline.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Identify Sync Point",
    "shortcut": "Ctrl+,",
    "ptShortcut": "Ctrl+, (comma)",
    "behavior": "Places a Sync Point at the cursor inside the clip so Spot/Quantize/Nudge reference it instead of the clip start.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Remove Sync Point",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Removes the sync point from the selected clip (its own menu command, not a Ctrl+, toggle).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Rating",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to rate the clip None or 1-5, used to filter comp lanes by rating.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "None",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to None (the default).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "1",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to 1.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "2",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to 2.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "3",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to 3.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "4",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to 4.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "5",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Set the clip's rating to 5.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Show/Hide Clip Rating",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "View toggle showing or hiding the rating number overlaid on every clip in the Edit window.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Commit",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Commits the selected clip by printing inserts, clip FX, and clip gain to new audio, freeing CPU.",
    "feasibility": "exists",
    "mapsTo": "openAudioSuite()",
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "event",
  "title": "Event",
  "items": [
   {
    "label": "Time Operations",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Time Operations floating window for meter/time edits over the Edit selection and conductor rulers.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Time Operations",
      "shortcut": null,
      "ptShortcut": "Alt+1 (numeric keypad)",
      "behavior": "Opens the Time Operations window on whatever page was last used.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Meter...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Inserts or replaces a meter (time-signature) event at a bar|beat location, with options for default click note value and whether to apply to the whole session or selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Insert Time...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Inserts a span of blank time across all tracks and conductor rulers, pushing everything after it later.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cut Time...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Removes a span of time across all tracks and rulers and pulls later material earlier (ripple delete across the whole session).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Move Song Start...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Redefines the Song Start Marker location, the bar that everything is measured from, with a choice to move or leave markers/regions.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Tempo Operations",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Tempo Operations floating window to write tempo events (a curve) across a time/measure range.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Tempo Operations",
      "shortcut": null,
      "ptShortcut": "Alt+2 (numeric keypad)",
      "behavior": "Opens the Tempo Operations window on the last-used page.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Constant...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Writes one constant tempo (BPM) across the selection with start/end and resolution fields.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Linear...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Ramps tempo evenly in a straight line from a start BPM to an end BPM across the selection.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Parabolic...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Ramps tempo along a parabolic curve (non-linear accelerate/decelerate) with a Curve field.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "S-Curve...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Ramps tempo along an S-shaped curve with a definable mid-curve breakpoint (time + tempo).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scale...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Multiplies existing tempo events in the selection by a percentage.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Stretch...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Re-fits the tempo events in a selection to a larger or smaller selection (proportional re-map).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Event Operations",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Event Operations floating window of MIDI transforms (quantize/transpose/etc.) on the selection.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Event Operations",
      "shortcut": null,
      "ptShortcut": "Alt+3 (numeric keypad)",
      "behavior": "Opens the Event Operations window on the last-used page.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Quantize...",
      "shortcut": "Alt+0",
      "ptShortcut": "Alt+0",
      "behavior": "Grid or groove quantize: snaps selected MIDI note starts/ends (or audio clip-starts / Elastic events) to a grid or groove template.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Restore Performance",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Reverts selected notes to their originally recorded timing/duration/velocity/pitch, regardless of edits or undo state.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Flatten Performance",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Locks current note params as the new restore-to baseline, overwriting the original-performance reference.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Velocity...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Scales or sets MIDI note attack and release velocities, with set/add/subtract/scale and smoothing over time.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Duration",
      "shortcut": "Alt+P",
      "ptShortcut": "Alt+P",
      "behavior": "Lengthens or shortens selected note durations (staccato/legato) via set/add/subtract/scale, legato, gap, and percent-of-original.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Transpose",
      "shortcut": "Alt+T",
      "ptShortcut": "Alt+T",
      "behavior": "Transposes selected notes up/down by semitones or in-key by scale steps, or to a target key.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Select/Split Notes",
      "shortcut": "Alt+Y",
      "ptShortcut": "Alt+Y",
      "behavior": "Select notes by pitch/range/velocity/duration and optionally cut/copy matched notes to split chords across tracks.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Input Quantize",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Toggle and configure auto-quantizing of MIDI notes as they are recorded, with Enable checkbox and Strength.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Step Input",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the Step Input page to enter MIDI notes one step at a time from a controller using in-window keypad note-value shortcuts.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "MIDI Real-Time Properties",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the floating Real-Time Properties window applying non-destructive, playback-time MIDI transforms (Quantize, Duration, Delay/Advance, Transpose, Velocity) to the selected track/clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "All MIDI Notes Off",
    "shortcut": "Ctrl+Shift+Period",
    "ptShortcut": "Ctrl+Shift+Period (.)",
    "behavior": "Sends an All Notes Off message to every connected MIDI device/instrument to kill stuck/hanging notes; immediate, no dialog.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Remove Duplicate Notes",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Scans selected MIDI and merges/shortens same-pitch notes that start within the first 25% of a still-sounding note (or an 1/8 note, whichever is shorter); immediate.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Add Key Change...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Key Change dialog to insert a key-signature event (Mode, Key, Location, Range, Edit Pitched Tracks) on the Key Signature ruler.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Beat Detective",
    "shortcut": "Ctrl+8",
    "ptShortcut": "Ctrl+8 (numeric keypad)",
    "behavior": "Opens the Beat Detective window to detect transients in an audio/MIDI selection and extract groove/tempo, separate into hit-aligned clips, conform them to grid/groove, and edit-smooth gaps.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Identify Beat...",
    "shortcut": "Ctrl+I",
    "ptShortcut": "Ctrl+I",
    "behavior": "Analyzes the Edit selection containing a known number of beats/bars, computes its tempo for the given meter, and inserts bar|beat markers + tempo events so the grid lines up with the audio.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Renumber Bars...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Re-labels bar numbers without moving any audio/MIDI/tempo/meter (e.g. make the current bar Bar 1).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "audiosuite",
  "title": "AudioSuite",
  "items": [
   {
    "label": "EQ",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of EQ-category AudioSuite plug-ins that bake an EQ curve permanently into the selected clip on render.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "EQ III › 1-Band",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the AudioSuite window with a single-band EQ III (HP/LP/notch/peak/shelf) and bakes one band into the clip on render.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "EQ III › 7-Band",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the AudioSuite window with full 7-band EQ III (HPF, LF, LMF, MF, HMF, HF, LPF) and prints the multiband curve onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Dynamics",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of Dynamics-category processors (compressors, limiters, gates, expanders, de-essers) that print gain reduction into the clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Dynamics III › Compressor/Limiter",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite window for the stock comp/limiter (threshold, ratio, attack, release, knee, gain) that prints gain reduction into the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dynamics III › Expander/Gate",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite window for a downward expander / noise gate (threshold, ratio, attack/hold/release, range) that prints gating into the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dynamics III › De-Esser",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite de-esser (frequency, range, HF-only listen) that permanently removes sibilance on render.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "BF76 Compressor",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Bomb Factory 1176-style FET compressor (input/output, attack, release, ratio buttons, all-buttons mode), AudioSuite-capable.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Channel Strip",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Avid Channel Strip (EQ + dynamics + filter + gain, modeled on the System 5 console) that AudioSuite-renders the full strip onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Maxim",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Look-ahead peak limiter / maximizer (threshold, ceiling, release, dither) for loudness/limiting on a clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pro Multiband Dynamics",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Optional 4-band dynamics (DSP/Native/AudioSuite) add-on that appears only if installed.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Pitch Shift",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of pitch-transposition and time-compression/expansion (TCE) plug-ins; selecting one opens the processing window to print new pitch/duration.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Pitch II",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "High-quality pitch shifter (semitones + cents, formant options) that transposes the clip without (by default) changing length.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time Shift",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Flagship TCE+pitch plug-in (Audio Mode, Range, Time Shift %, Pitch Shift, Gain, Formant, Transient, Varispeed) that prints a new duration/pitch and serves as the TCE Trim engine.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Vari-Fi",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tape/turntable speed-up-from-stop or slow-down-to-stop pitch sweep (Change, Selection Fit To/Extend) printed offline as a time-varying playbackRate ramp.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pitch Shift (Legacy)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Legacy DigiRack pitch/time tool (coarse/fine, crossfade, min pitch) present on older/compat installs.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "X-Form",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Radius/iZotope highest-quality offline-only elastic time/pitch (Polyphonic/Monophonic/Varispeed, formant, Maximum quality); AudioSuite-only add-on.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Reverb",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of Reverb-category plug-ins that print a reverb tail onto the clip (requires selecting past the dry region or using Whole File / handles).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "D-Verb",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Stock algorithmic reverb (Hall/Church/Plate/Room/Ambience; Size, Diffusion, Decay, Pre-Delay, HF Cut, LP, Wet/Dry) that prints the reverb tail onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reverb One / ReVibe II / TL Space",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Premium add-on reverbs that appear only if installed.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Delay",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of Delay-category plug-ins that print delay repeats (or sample-align) onto the clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Mod Delay III",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Stock modulated delay (delay time in ms or tempo-synced note values, Feedback, Mix, LFO Depth/Rate, LPF) that prints delay repeats; select past the dry to capture the tail.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "TimeAdjuster",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Sample-accurate delay/phase-align + gain + phase-invert utility (1-/2-/4-channel) for compensating DSP delay or nudging by samples.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Modulation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of Modulation-category plug-ins (ring/freq mod, chorus, flanger) that print the modulation onto the clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Sci-Fi",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Ring-mod / frequency-mod / sample-and-hold synth-y modulation effect (Effect type, Mod Rate, Mod Amount, Dynamic Effect, LFO waveform) printed onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Chorus / Flanger",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AIR Chorus / Flanger modulation (via Creative Collection / AIR) that lands here when installed.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Harmonic",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of Harmonic-category color processors (saturation, distortion, amp/lo-fi character) that bake harmonic coloration into the clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Lo-Fi",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Bit-crush / sample-rate reduction / saturation / distortion + anti-alias filter + noise that bakes lo-fi degradation into the clip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Recti-Fi",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Rectification-based harmonic/sub-harmonic synthesis (pre/post filter, positive/negative/full rectify, sub-harmonic).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "SansAmp PSA-1",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tube-amp/distortion modeler (Pre-Amp, Buzz, Punch, Crunch, Drive, Low/High, Level) that prints amp coloration onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Eleven Lite",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Guitar amp modeling (lite) add-on that prints the amp tone onto the clip when installed.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Noise Reduction",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of spectral/broadband noise-cleanup processors; contains no stock plug-ins and appears only when add-ons like X-Noise, DINR, or Dialogue Match are installed.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "X-Noise / DINR / Dialogue Match",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Spectral denoise / broadband + tonal noise reduction (learn-noiseprint then reduce) add-ons that are the only things ever populating this category.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Sound Field",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of surround/spatial panning and down-mixing plug-ins, largely meaningful only in multichannel/surround sessions.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "AutoPan",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "LFO-driven auto-panner (rate, depth, waveform, stereo/surround field) that prints the pan motion onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Down Mixer",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Folds a multichannel (e.g. 5.1) clip down to stereo/mono with per-channel coefficients; not meaningful in a stereo browser DAW.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Instrument",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu of virtual instruments / MIDI-driven generators exposed to AudioSuite; mostly not meaningful offline-on-a-clip without a MIDI engine.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Click II",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Metronome click instrument (accented/unaccented, sound select, level) that as AudioSuite can print a click track to a clip.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "ReWire",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Inter-app audio routing host (Reason, etc.); not available in a browser.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Effect",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Catch-all submenu for third-party / creative plug-ins that self-categorize as Effect; each opens the standard AudioSuite window to print the effect onto the clip.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "(installed creative effects)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Installed creative effects (e.g. AIR Distortion, AIR Enhancer, AIR Frequency Shifter, AIR Vintage Filter, Telephone-type FX) each opening the standard AudioSuite window to print the effect onto the clip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Other",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Utility-bin submenu of the most-used AudioSuite items (Gain, Normalize, Invert, Reverse, Duplicate, DC Offset Removal, Signal Generator, TCE), several AudioSuite-only, all following the Use In Playlist then Render pattern.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Gain",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only fixed boost/cut of clip amplitude (Gain slider in dB or %, Analyze peak readout, Peak/RMS toggle) committed on render.",
      "feasibility": "exists",
      "mapsTo": "renderAudioSuite('gain')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Normalize",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only uniform gain that raises level so the peak hits a target below clipping (Max Peak At slider, Peak/RMS toggle, Channel Mode, Clip-by-Clip vs Entire Selection).",
      "feasibility": "exists",
      "mapsTo": "renderAudioSuite('norm')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Invert",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only polarity flip (every sample times minus one) with no controls, for phase/multi-mic correction and null tests.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reverse",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only replacement of the audio with a reversed copy (no controls) for reverse-FX/foley; wraps the existing reverse buffer op as a new AudioSuite proc.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Duplicate",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only print of the selection in place to one new continuous file (flatten/consolidate), ignoring track volume/pan/insert automation; nondestructive.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "DC Offset Removal",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "AudioSuite-only removal of constant waveform bias (subtract the per-channel mean from every sample) with no controls; lives solely under Other.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Signal Generator",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Generates a test/utility tone into the selection (replacing it) with Frequency, Level, waveform buttons (sine/square/sawtooth/triangle/white/pink noise), and Peak/RMS.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time Compression/Expansion",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Legacy TCE plug-in that stretches/compresses duration without pitch change (ratio/target length, crossfade, accuracy rhythm vs sound); superseded by Time Shift and housed under Other.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pro Limiter",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "True-peak limiter with loudness analysis (AudioSuite > Other > Pro Limiter) that appears if installed.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "InTune / MasterMeter / Trim",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tuner / oversampling true-peak meter / simple trim-gain utility; metering ones do not render and are native-only, while Trim equals Gain.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   }
  ]
 },
 {
  "id": "options",
  "title": "Options",
  "items": [
   {
    "label": "Destructive Record",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggles Destructive Record mode so recording over existing clips permanently replaces the original audio in the underlying file.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Loop Record",
    "shortcut": "Alt+L",
    "ptShortcut": "Alt+L",
    "behavior": "Toggles Loop Record so the transport loops the record range and lays a new take each pass for comping.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "QuickPunch",
    "shortcut": "Ctrl+Shift+P",
    "ptShortcut": "Ctrl+Shift+P",
    "behavior": "Toggles QuickPunch so you can instantly punch in/out on record-armed tracks during playback, non-destructively making a new clip each punch.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "TrackPunch",
    "shortcut": "Ctrl+Shift+T",
    "ptShortcut": "Ctrl+Shift+T",
    "behavior": "Toggles TrackPunch so individual tracks can be punched in/out without interrupting online record/playback (PT Ultimate, non-destructive).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "DestructivePunch",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggles DestructivePunch so you can punch in/out on individual audio tracks during playback while preserving one contiguous file per track (PT Ultimate).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Prepare DPE Tracks",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Action that consolidates DestructivePunch-enabled tracks' audio so a contiguous file exists to punch into.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Transport Online",
    "shortcut": "Ctrl+J",
    "ptShortcut": "Ctrl+J",
    "behavior": "Arms the transport for online sync so playback/record is triggered by an external timecode source (SMPTE/LTC/MTC/ADAT).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Video Track Online",
    "shortcut": "Ctrl+Shift+J",
    "ptShortcut": "Ctrl+Shift+J",
    "behavior": "Enables or disables playback of the main video track to free CPU or freeze video on a frame.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Pre/Post-Roll",
    "shortcut": "Ctrl+K",
    "ptShortcut": "Ctrl+K",
    "behavior": "Toggles pre-roll and post-roll playback around the selection or insertion point.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Loop Playback",
    "shortcut": "Ctrl+Shift+L",
    "ptShortcut": "Ctrl+Shift+L",
    "behavior": "Continuously loops playback of the current selection until stopped.",
    "feasibility": "exists",
    "mapsTo": "#loop",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Dynamic Transport",
    "shortcut": "Ctrl+Alt+P",
    "ptShortcut": "Ctrl+Start+P",
    "behavior": "Decouples the playback start location from the Timeline selection so you can start playback anywhere without losing your selections.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Edit Window Scrolling",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu choosing how the Edit window scrolls during playback/record (radio group, one active).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "No Scrolling",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Disables scrolling during and after playback; the cursor moves to the right edge then stops.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "After Playback",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Scrolls the Edit window to the final playback location after playback stops.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Page",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Scrolls the view in pages: the cursor crosses to the right edge, then contents jump one page and the cursor continues from the left.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Continuous",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Scrolls contents continuously past a centered cursor, with playback based on the Timeline selection (PT Ultimate / with CPTK).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Center Playhead",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Scrolls contents continuously past a fixed centered Playhead line (PT Ultimate, Dynamic-Transport-style; not part of the standard four-option submenu).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Link Timeline and Edit Selection",
    "shortcut": "Shift+/",
    "ptShortcut": "Shift+/",
    "behavior": "When on, an Edit selection also defines the play/record range; when off you can edit one range while playing a different range.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Link Track and Edit Selection",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "When on, making an Edit selection across tracks also selects those tracks; when off, editing doesn't auto-select the tracks.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Mirrored MIDI Editing",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "When on, editing a MIDI clip applies the same edit to every MIDI clip of the same name (MIDI-only).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Automation Follows Edit",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "When on, automation events move/copy/trim with the audio or MIDI they sit under during edits.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Click",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggles the metronome so a click is generated during playback and record.",
    "feasibility": "exists",
    "mapsTo": "click()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "MIDI Thru",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "When on, routes MIDI from your controller to the record-enabled MIDI track so you hear what you play while recording MIDI.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Auto-Spot Clips",
    "shortcut": "Ctrl+Alt+P",
    "ptShortcut": "Ctrl+Alt+P",
    "behavior": "When on, clicking a clip with the Grabber auto-spots it to the current timecode/VITC frame location.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Pre-Fader Metering",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Toggles track meters between pre-fader (level independent of fader) and post-fader (meter follows fader).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Solo Mode",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu choosing how Solo buttons behave (latch options plus AFL/PFL routing).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Latch",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Pressing additional Solo buttons adds them to the soloed set so multiple tracks solo together (default latch mode).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "X-OR (Cancels Previous Solo)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Pressing a new Solo button cancels the previous solo so only one track solos at a time unless Shift-clicked.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Momentary",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Solo buttons are not sticky; a track solos only while its Solo switch is held down (PT Ultimate).",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "SIP (Solo In Place)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Default routing: soloing mutes the other tracks so the soloed track plays alone through its normal output.",
      "feasibility": "exists",
      "mapsTo": "applyTrackTo()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "AFL (After Fader Listen)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Solo routes the track's post-fader/post-pan signal to a dedicated AFL/PFL monitor path (PT Ultimate, requires Surround Mixer).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "PFL (Pre Fader Listen)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Solo routes the track's pre-fader/pre-pan signal to the AFL/PFL path (PT Ultimate, requires Surround Mixer).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Edit/Tool Mode Keyboard Lock",
    "shortcut": "Ctrl+Alt+T",
    "ptShortcut": "Start+Shift+T",
    "behavior": "When on, locks the tool type from changing via keyboard shortcuts while still allowing tool changes with the mouse.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Delay Compensation",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "When on, measures reported plug-in and routing delays for all tracks and time-aligns every track so inserts/buses don't smear timing.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Activate HEAT",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Applies HEAT analog-console saturation/soft-clip across all active audio tracks (PT Ultimate plus paid HEAT option).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Low Latency Monitoring",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Disables software monitoring for input-/record-enabled tracks so you monitor with minimal hardware latency while recording.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "setup",
  "title": "Setup",
  "items": [
   {
    "label": "Hardware...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Hardware Setup dialog to pick a connected audio interface, route physical ports to PT channels, and set Session Sample Rate and Clock Source.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Playback Engine...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Playback Engine dialog to choose the active engine/device and set H/W buffer size, host-engine options, CPU usage limit, and (on HD) voice counts.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Disk Allocation...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Disk Allocation dialog to assign each track's newly recorded audio to a specific drive/volume when recording across multiple drives.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Peripherals...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Peripherals dialog with tabbed pages for configuring external gear (Synchronization, Machine Control, MIDI/Ethernet Controllers, Mic Preamps, Satellites, VENUE).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "I/O...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the I/O Setup dialog to label and map Input, Output, Insert, Bus, and Mic Preamp paths, configure insert delay compensation, and set default Meter/Audition/track-layout paths.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Video Sync Offset...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Video Sync Offset dialog to nudge video earlier/later in frames (Avid Video Offset and QuickTime Video Offset) so audio spots accurately to picture.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Session",
    "shortcut": "Ctrl+2",
    "ptShortcut": "Ctrl+2",
    "behavior": "Opens the Session Setup window with editable format fields plus display-only system/timecode info; PT's closest thing to session properties.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Current Feet+Frames Position...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Redefines the session's feet+frames origin: place the cursor, enter the new Feet+Frames value, and PT recalculates the session's F+F start (film post).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Current Timecode Position...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Redefines the session start time: place an insertion point, enter the new SMPTE timecode for that location, and PT recomputes the relative session start.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "External Timecode Offset...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens Redefine External Timecode Offset to compensate gear offset by a fixed frame count via three independent (or linked) offset types: MMC, 9-Pin, and Synchronization peripheral (MTC).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "MIDI",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu for configuring the MIDI environment (studio setup, beat clock, input devices/filter, and machine control).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "MIDI Studio Setup...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the MIDI Studio Setup window to define external MIDI instruments/devices, their manufacturer/model, and the input/output ports and MIDI channels each is connected on.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MIDI Beat Clock...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the MIDI Beat Clock dialog to choose which MIDI devices/ports receive PT's transmitted MIDI Beat Clock for syncing drum machines and sequencers.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Input Devices...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens MIDI Input Enable to enable/disable each connected MIDI controller/control surface so its data can be recorded.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Input Filter...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the MIDI Input Filter dialog to filter which MIDI message types get recorded via three modes: Record All, Only, and All Except.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MMC Setup...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the MIDI Machine Control Setup dialog to configure PT as MMC master/slave, including transmit/receive enable and the MMC device ID.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Click/Countoff...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Click/Countoff Options dialog to set when the click plays, the accented/unaccented click sound parameters, the MIDI output, and the count-off length.",
    "feasibility": "exists",
    "mapsTo": "click()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Preferences...",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the multi-page Preferences dialog (Display, Operation, Editing, Mixing, Processing, MIDI, Synchronization, Metering) governing how PT behaves globally or per-session.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "window",
  "title": "Window",
  "items": [
   {
    "label": "Configurations",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to manage saved Window Configurations — snapshots of which windows are open, their size/position, and the internal display settings of the Edit, Mix, Transport, MIDI Editor, and Score Editor windows.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Window Configuration List",
      "shortcut": "Ctrl+Alt+J",
      "ptShortcut": "Ctrl+Alt+J",
      "behavior": "Opens the floating Window Configuration List to recall, rename, reorder, and manage stored configurations.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "New Configuration...",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the New Configuration dialog to capture the current window arrangement as a new numbered slot.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Update Active Configuration",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Overwrites the currently active configuration with the present window layout/settings.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Auto-Update Active Configuration",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Check toggle that continuously re-saves the active configuration as you move/resize windows.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Arrange",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to tile or cascade all open document windows; floating windows and the Transport window are not affected.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Tile",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Arranges all open document windows in a tiled pattern.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tile Horizontal",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tiles all open windows horizontally in stacked rows; greyed out if too many windows are open.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tile Vertical",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Tiles all open windows vertically in side-by-side columns; greyed out if too many windows are open.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cascade",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Arranges all open windows in an overlapping cascade.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Hide All Floating Windows",
    "shortcut": "Ctrl+Alt+W",
    "ptShortcut": "Ctrl+Alt+Start+W",
    "behavior": "Toggle that hides or re-shows all floating windows at once (plug-in, send, output, and other floaters) to instantly clear the screen.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Close Window",
    "shortcut": "Ctrl+W",
    "ptShortcut": "Ctrl+W",
    "behavior": "Closes the front-most Pro Tools window.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Mix",
    "shortcut": "Ctrl+=",
    "ptShortcut": "Ctrl+=",
    "behavior": "Shows the Mix window; in PT Ctrl+= toggles between Mix and Edit, bringing whichever is hidden to the front.",
    "feasibility": "exists",
    "mapsTo": "setView('mix')",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Edit",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Shows the Edit window (graphical timeline editing of audio, MIDI, automation); shares the Ctrl+= toggle with Mix and shows a checkmark when frontmost.",
    "feasibility": "exists",
    "mapsTo": "setView('edit')",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "MIDI Editor",
    "shortcut": null,
    "ptShortcut": "Start+=",
    "behavior": "Opens a MIDI Editor window for piano-roll editing of one or more MIDI/Instrument tracks; multiple windows can be open.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Score Editor",
    "shortcut": null,
    "ptShortcut": "Alt+Start+=",
    "behavior": "Opens a Score Editor window to view/edit/arrange/print session MIDI as music notation; multiple windows allowed.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "MIDI Event List",
    "shortcut": "Alt+=",
    "ptShortcut": "Alt+=",
    "behavior": "Opens the MIDI Event List — a single floating list of a MIDI track's events for fast keyboard insert/edit/locate.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "MIDI Editors",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu to choose which MIDI/Score editor window is frontmost.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Bring to Front",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Brings the targeted MIDI Editor or Score Editor window to the front.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send to Back",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Sends the MIDI/Score Editor window behind the Edit window.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "(open MIDI/Score editor window list)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Dynamic list of every open MIDI Editor / Score Editor window; selecting one brings it to the front.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Task Manager",
    "shortcut": "Alt+'",
    "ptShortcut": "Alt+'",
    "behavior": "Opens the Task window to monitor, pause, or cancel ongoing background tasks such as file copies, fades, and indexing.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "New Workspace...",
    "shortcut": "Alt+I",
    "ptShortcut": "Alt+I",
    "behavior": "Opens a new Workspace browser (DigiBase) for searching, sorting, auditioning, and importing media across mounted volumes.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Workspaces",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu listing workspace-browser commands and any currently open Workspace/Soundbase/Catalog browser windows to bring to front.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "New Workspace",
      "shortcut": "Alt+I",
      "ptShortcut": "Alt+I",
      "behavior": "Opens a default Workspace browser for search/sort/audition/import across volumes.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "New Soundbase",
      "shortcut": null,
      "ptShortcut": "Alt+Start+I",
      "behavior": "Opens a Soundbase browser for tag-based sound library search.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Show/Hide Workspace (Volumes)",
      "shortcut": "Alt+;",
      "ptShortcut": "Alt+;",
      "behavior": "Shows or hides the Volumes Workspace browser of mounted drives.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Show Project",
      "shortcut": "Alt+O",
      "ptShortcut": "Alt+O",
      "behavior": "Brings the Project browser to the front, showing files belonging to the current session.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "(open workspace/catalog browser list)",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Dynamic list of open Workspace/Soundbase/Catalog browser windows; selecting brings it to the front.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Transport",
    "shortcut": "Numpad1",
    "ptShortcut": "Ctrl+1",
    "behavior": "Opens the floating Transport window with counters, MIDI controls, and basic or expanded transport controls.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Big Counter",
    "shortcut": "Numpad3",
    "ptShortcut": "Ctrl+3",
    "behavior": "Opens the Big Counter window — a large, easy-to-read display of the current timeline position in the active Main Time Scale.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Automation",
    "shortcut": "Numpad4",
    "ptShortcut": "Ctrl+4",
    "behavior": "Opens the Automation window to globally enable/suspend writing of Volume, Pan, Mute, plug-in, send level, send pan, and send mute automation.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Memory Locations",
    "shortcut": "Numpad5",
    "ptShortcut": "Ctrl+5",
    "behavior": "Opens the Memory Locations window to store up to 999 markers/recalls of time location, selection, zoom, pre/post-roll, and track states.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Video Universe",
    "shortcut": null,
    "ptShortcut": "Ctrl+7",
    "behavior": "Opens the Video Universe — a thumbnail strip of the center frame of each clip on the main video track for navigation/zoom/selection.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Video",
    "shortcut": null,
    "ptShortcut": "Ctrl+9",
    "behavior": "Opens the Video window displaying QuickTime/Avid video imported via File > Import > Video for sample-accurate spotting to picture.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Color Palette",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Color Palette window to assign colors to tracks, clips, groups, and markers.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Metadata Inspector",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Metadata Inspector to view/edit clip, track, and session metadata for media and markers.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Undo History",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Undo History window — a list of undoable/redoable operations; click any state to jump back.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Artist Chat",
    "shortcut": "Ctrl+Shift+=",
    "ptShortcut": "Ctrl+Shift+=",
    "behavior": "Opens the Artist Chat window — text chat for Avid Cloud Collaboration / Pro Tools cloud projects.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Disk Usage",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Disk Usage window showing per-drive total size, free space, % available, and continuous track-minutes at the current sample rate/bit depth.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "System Usage",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the System Usage window with meters for CPU, Disk, and (HD systems) PCI, plus cache and DSP/voice/time-slot meters.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "marketplace",
  "title": "Marketplace",
  "items": [
   {
    "label": "Your Account",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the in-app web browser (or Avid Link) and signs you in to your online Avid Master Account showing profile, registered products, orders, and subscription status.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Plug-Ins",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Avid Marketplace in the in-app web browser filtered to Pro Tools plug-ins (effects, processors, virtual instruments) available to rent or purchase, installing silently to iLok.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Avid Support",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Avid Store / support area in the in-app web browser for support and training options such as paid support plans, training/certification, and the Avid Support Center.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Upgrades",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens the Avid Store in the in-app web browser for software options and upgrades such as newer Pro Tools tiers/versions, perpetual upgrade plans, and subscription renewals.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "help",
  "title": "Help",
  "items": [
   {
    "label": "Pro Tools Help",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Opens HTML-based, searchable Pro Tools Help in the in-application web browser (Internet required).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Knowledge Base",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Launches the online Avid Knowledge Base (kb.avid.com) in the in-app browser as Avid's primary support/troubleshooting resource.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Avid Audio Forum",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Launches the online Avid Audio Forum / Avid Pro Audio Community (duc.avid.com) in the in-app browser.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Avid Support Center",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Launches the online Avid Support Center (avid.com/support) in the in-app browser as Avid's central support portal.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Pro Tools Guides",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Submenu parent; hovering opens the bundled-documentation list and has no action of its own.",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Pro Tools Reference Guide",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the full Reference Guide PDF, the complete Pro Tools manual.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pro Tools Shortcuts",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the Shortcuts Guide PDF listing all keyboard commands for Windows and Mac.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio and MIDI Plugins Guide",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the bundled-plugins documentation PDF covering parameters for Avid's bundled audio and MIDI plug-ins.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "What's New",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the 'What's New in Pro Tools <version>' PDF for the installed version.",
      "feasibility": "buildable-now",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pro Tools Menus Guide",
      "shortcut": null,
      "ptShortcut": null,
      "behavior": "Opens the per-menu reference PDF; present in classic builds but dropped from the current documentation set.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Check For Updates",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Historically checked for Pro Tools application and plug-in updates; on current builds updates are delivered through the separate Avid Link app and this command may be absent.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "About Pro Tools",
    "shortcut": null,
    "ptShortcut": null,
    "behavior": "Displays the Pro Tools About banner with splash art and the exact software version/build number (Windows-only in this menu; last item).",
    "feasibility": "buildable-now",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 }
];

window.PT_CONTEXT = {
 "id": "context",
 "title": "Context menus",
 "items": [
  {
   "label": "Clip",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Right-click a clip with the Grabber, Selector, or Smart tool to open the clip/region context menu.",
   "feasibility": "exists",
   "mapsTo": "showWaveMenu(t, wv, e)",
   "separator_after": false,
   "submenu": [
    {
     "label": "Tools",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu to switch the active Edit tool without leaving the clip.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "Zoomer",
       "shortcut": null,
       "ptShortcut": "F5",
       "behavior": "Magnifying-glass tool; Studio zoom is button/wheel only.",
       "feasibility": "skip",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Trim",
       "shortcut": "F6",
       "ptShortcut": "F6",
       "behavior": "Trim/Trimmer tool to resize clip edges.",
       "feasibility": "exists",
       "mapsTo": "setTool('trim')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Selector",
       "shortcut": "F7",
       "ptShortcut": "F7",
       "behavior": "Time-range selection tool.",
       "feasibility": "exists",
       "mapsTo": "setTool('select')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Grabber",
       "shortcut": "F8",
       "ptShortcut": "F8",
       "behavior": "Move/Grab tool.",
       "feasibility": "exists",
       "mapsTo": "setTool('grab')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Scrubber",
       "shortcut": null,
       "ptShortcut": "F9",
       "behavior": "Jog/scrub audio under the cursor; needs a scrub playback engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Pencil",
       "shortcut": null,
       "ptShortcut": "F10",
       "behavior": "Draw automation, redraw waveform, or create MIDI; no draw/sample-pencil engine yet.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Smart Tool",
       "shortcut": "Ctrl+7",
       "ptShortcut": "F6+F7, F7+F8, or Ctrl+7",
       "behavior": "Context-sensitive grab/trim/select, enabled by pressing any two adjacent tool keys or Ctrl+7.",
       "feasibility": "exists",
       "mapsTo": "setTool('smart')",
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Insert",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu to insert a conductor event (Key Signature/Meter/Chord) at the clip/edit point.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": true,
     "submenu": [
      {
       "label": "Key Signature",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a key-signature event at the point; no key ruler/engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Meter",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a meter event at the point; no meter ruler/engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Chord",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a chord symbol at the point; no chord engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Cut",
     "shortcut": "Ctrl+X",
     "ptShortcut": "Ctrl+X",
     "behavior": "Removes the selection/clip to the clipboard.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Copy",
     "shortcut": "Ctrl+C",
     "ptShortcut": "Ctrl+C",
     "behavior": "Copies the selection/clip to the clipboard, original intact.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Paste",
     "shortcut": "Ctrl+V",
     "ptShortcut": "Ctrl+V",
     "behavior": "Inserts clipboard contents at the Edit insertion point.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Clear",
     "shortcut": "Delete",
     "ptShortcut": "Ctrl+B",
     "behavior": "Removes the selection contents without copying to the clipboard.",
     "feasibility": "exists",
     "mapsTo": "deleteClip()",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Matching Alternates",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Swap the on-track take with another take captured at the same location or a matching field-recorder channel.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": true,
     "submenu": [
      {
       "label": "Match Criteria...",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Dialog choosing how alternates are matched (by Clip Name, Clip Start, or Clip Start and End).",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "(list of matching takes)",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Each alternate take at that location; selecting one swaps it onto the track.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Expand Alternates to New Playlists",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Lays every alternate out on its own playlist lane of the current track.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Expand Alternates to New Tracks",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Lays every alternate out on its own new track.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Separate",
     "shortcut": "Ctrl+E",
     "ptShortcut": "Ctrl+E",
     "behavior": "Separate the clip at the selection, creating new clip boundaries at the selection start/end or playhead.",
     "feasibility": "exists",
     "mapsTo": "separateAtSelection()",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Copy To",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Copy the clip to Main Playlist, New Playlist, Duplicate Playlist, or an existing playlist.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Move To",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Move the clip to one of the same playlist destinations as Copy To.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Fades",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu of fade-shape commands applying fade-in/out/crossfade to the selection.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "Standard",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Standard linear fade shape.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "S-Curve",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "S-curve fade shape.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Equal Power",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Equal-power crossfade curve.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Equal Gain",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Equal-gain crossfade curve.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": true,
       "submenu": null
      },
      {
       "label": "Batch Fades...",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Dialog to apply fades across multiple selected clip boundaries at once.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Clip Effects",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu for the per-clip insert effects chain (Bypass/Unbypass, Copy, Clear, Render).",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "Bypass/Unbypass",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Toggle bypass of the per-clip effects chain.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Copy",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Copy the per-clip effects chain.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Clear",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Clear the per-clip effects chain.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Render",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Render the per-clip effects into the audio.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Delete Fades",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Removes fade-in/out/crossfade clips touching the selection.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Clip Gain",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu of clip-gain commands for the independent per-clip gain envelope.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "Show / Hide Clip Gain Line",
       "shortcut": "Ctrl+Shift+-",
       "ptShortcut": "Start+Shift+Hyphen (-)",
       "behavior": "Shows/hides the editable clip-gain line drawn across the clip (checkmark toggle).",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Show / Hide Clip Gain Info",
       "shortcut": "Ctrl+Shift+=",
       "ptShortcut": "Start+Shift+= (equals)",
       "behavior": "Shows/hides the small numeric clip-gain readout on the clip (checkmark toggle).",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Bypass Clip Gain",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Plays the clip without its gain adjustment, settings preserved (checkmark toggle).",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Render Clip Gain",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Applies clip gain to the audio and resets the value to 0 dB (destructive print).",
       "feasibility": "exists",
       "mapsTo": "709",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Clear Clip Gain",
       "shortcut": "Ctrl+Shift+B",
       "ptShortcut": "Start+Shift+B",
       "behavior": "Resets clip gain in the selection to 0 dB.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Cut Clip Gain",
       "shortcut": "Ctrl+Alt+X",
       "ptShortcut": "Start+Shift+X",
       "behavior": "Cuts the clip-gain settings to a gain clipboard.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Copy Clip Gain",
       "shortcut": "Ctrl+Alt+C",
       "ptShortcut": "Start+Shift+C",
       "behavior": "Copies clip-gain settings so they can be applied to another clip.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Paste Clip Gain",
       "shortcut": "Ctrl+V",
       "ptShortcut": "Ctrl+V (in clip-gain context)",
       "behavior": "Applies copied clip-gain settings to the selected clip.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Add Clip Gain Breakpoint",
       "shortcut": "Ctrl+Alt+E",
       "ptShortcut": "Start+Shift+E",
       "behavior": "Adds a clip-gain breakpoint at the edit cursor on the gain line.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Nudge Clip Gain Up / Down",
       "shortcut": "Ctrl+Alt+Up / Down",
       "ptShortcut": "Start+Shift+Up / Down Arrow",
       "behavior": "Raises/lowers clip gain in the selection by the nudge increment (0.5 dB).",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Snap to Next",
     "shortcut": "Ctrl+Alt+.",
     "ptShortcut": "Alt+Start+. (period)",
     "behavior": "Moves the clip so its tail butts against the start of the next clip on the track.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Snap to Previous",
     "shortcut": "Ctrl+Alt+,",
     "ptShortcut": "Alt+Start+, (comma)",
     "behavior": "Moves the clip so its head butts against the end of the previous clip.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Spot...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Opens the Spot dialog to type an exact location and move the clip there.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Mute Clips",
     "shortcut": "Ctrl+M",
     "ptShortcut": "Ctrl+M",
     "behavior": "Mutes playback of the selected clip(s); toggles to Unmute Clips (per-clip, not track mute).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Rename...",
     "shortcut": "Ctrl+Alt+Shift+R",
     "ptShortcut": "Ctrl+Alt+Shift+R",
     "behavior": "Renames the selected clip via the Name Clip dialog.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Commit...",
     "shortcut": null,
     "ptShortcut": "Alt+Shift+C",
     "behavior": "Renders the clip/track output to new audio (clip gain + inserts + Elastic Audio, plus tails for whole tracks), opening the Commit dialog.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Group",
     "shortcut": "Ctrl+Alt+G",
     "ptShortcut": "Ctrl+Alt+G",
     "behavior": "Creates a clip group from the selected clips that move/edit as one.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Ungroup",
     "shortcut": "Ctrl+Alt+U",
     "ptShortcut": "Ctrl+Alt+U",
     "behavior": "Unpacks the front-most clip group into its members and unloops looped clips.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Loop...",
     "shortcut": "Ctrl+Alt+L",
     "ptShortcut": "Ctrl+Alt+L",
     "behavior": "Opens the Clip Loop dialog to loop the clip by count, length, or to fill the selection.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Unloop...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Switches a looped clip back to a standard clip.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Rating",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Rate the clip none/1-5 (5 highest) for filtering/identifying takes when comping.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "none",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Clears the rating (default); checkmark when active.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "1",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Lowest rating.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "2",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Rating of 2.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "3",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Rating of 3.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "4",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Rating of 4.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "5",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Highest rating.",
       "feasibility": "buildable-now",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    }
   ]
  },
  {
   "label": "Track name",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Right-click a track's nameplate in the Edit or Mix window (or Track List) for the track-management menu.",
   "feasibility": "exists",
   "mapsTo": "laneUi()",
   "separator_after": false,
   "submenu": [
    {
     "label": "Hide",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Hides the track from view while it still plays; Show reveals it again.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Hide and Make Inactive",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Hides and deactivates the track to free DSP; Show and Make Active restores it.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Make Inactive",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Deactivates the track (greyed, no DSP); Make Active reactivates it.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Scroll Into View",
     "shortcut": "Ctrl+Alt+F",
     "ptShortcut": "Ctrl+Alt+F",
     "behavior": "Scrolls the track to top (Edit) or left (Mix).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Freeze",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Temporarily render inserts to free CPU; reversible.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Commit...",
     "shortcut": null,
     "ptShortcut": "Alt+Shift+C",
     "behavior": "Render the track to new audio (see Commit dialog).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Bounce...",
     "shortcut": "Ctrl+Alt+Shift+B",
     "ptShortcut": "Ctrl+Alt+Shift+B",
     "behavior": "Bounce the track to disk or a new track.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Save Track Preset...",
     "shortcut": "Alt+Shift+P",
     "ptShortcut": "Alt+Shift+P",
     "behavior": "Save inserts/sends/routing as a recallable preset.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Recall Track Preset...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Load a previously saved track preset onto this track.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "New...",
     "shortcut": "Ctrl+Shift+N",
     "ptShortcut": "Ctrl+Shift+N",
     "behavior": "Opens the New Track dialog.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Rename...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Rename the track via the Name dialog.",
     "feasibility": "exists",
     "mapsTo": "renameTrack()",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Batch Rename...",
     "shortcut": "Ctrl+Shift+4",
     "ptShortcut": "Ctrl+Shift+4",
     "behavior": "Batch-rename multiple selected tracks via numbering/find-replace dialog.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Duplicate...",
     "shortcut": "Alt+Shift+D",
     "ptShortcut": "Alt+Shift+D",
     "behavior": "Duplicate the track with options for playlist, inserts, sends, group assignments, and automation.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Split Into Mono",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Split a stereo/multichannel track into mono tracks.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Delete",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Delete the track and its clips.",
     "feasibility": "exists",
     "mapsTo": ".ts-x remove handler (2112)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Track Compositing",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Context-specific nameplate submenu for comping playlists.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Track Cloud Synchronization",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Context-specific nameplate submenu for cloud sync.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    }
   ]
  },
  {
   "label": "Lane",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Right-click empty space in a track's playlist lane (no clip under the cursor) to surface edit-insertion and creation commands.",
   "feasibility": "exists",
   "mapsTo": "showWaveMenu(t, wv, e)",
   "separator_after": false,
   "submenu": [
    {
     "label": "Tools",
     "shortcut": null,
     "ptShortcut": "F5-F10",
     "behavior": "Same edit-tool submenu as the clip menu.",
     "feasibility": "exists",
     "mapsTo": "setTool()",
     "separator_after": false,
     "submenu": [
      {
       "label": "Zoomer",
       "shortcut": null,
       "ptShortcut": "F5",
       "behavior": "Magnifying-glass tool; Studio zoom is button/wheel only.",
       "feasibility": "skip",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Trim",
       "shortcut": "F6",
       "ptShortcut": "F6",
       "behavior": "Trim/Trimmer tool to resize clip edges.",
       "feasibility": "exists",
       "mapsTo": "setTool('trim')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Selector",
       "shortcut": "F7",
       "ptShortcut": "F7",
       "behavior": "Time-range selection tool.",
       "feasibility": "exists",
       "mapsTo": "setTool('select')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Grabber",
       "shortcut": "F8",
       "ptShortcut": "F8",
       "behavior": "Move/Grab tool.",
       "feasibility": "exists",
       "mapsTo": "setTool('grab')",
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Scrubber",
       "shortcut": null,
       "ptShortcut": "F9",
       "behavior": "Jog/scrub audio under the cursor; needs a scrub playback engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Pencil",
       "shortcut": null,
       "ptShortcut": "F10",
       "behavior": "Draw automation, redraw waveform, or create MIDI; no draw/sample-pencil engine yet.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Smart Tool",
       "shortcut": "Ctrl+7",
       "ptShortcut": "F6+F7, F7+F8, or Ctrl+7",
       "behavior": "Context-sensitive grab/trim/select, enabled by pressing any two adjacent tool keys or Ctrl+7.",
       "feasibility": "exists",
       "mapsTo": "setTool('smart')",
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Insert",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Insert a Key Signature / Meter / Chord event at the click point (same submenu as the clip menu).",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": [
      {
       "label": "Key Signature",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a key-signature event at the point; no key ruler/engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Meter",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a meter event at the point; no meter ruler/engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      },
      {
       "label": "Chord",
       "shortcut": null,
       "ptShortcut": null,
       "behavior": "Insert a chord symbol at the point; no chord engine.",
       "feasibility": "buildable-later",
       "mapsTo": null,
       "separator_after": false,
       "submenu": null
      }
     ]
    },
    {
     "label": "Paste",
     "shortcut": "Ctrl+V",
     "ptShortcut": "Ctrl+V",
     "behavior": "Paste clipboard contents at the click point.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Create Fades",
     "shortcut": "F",
     "ptShortcut": "F",
     "behavior": "Create fade(s) on the selection (the Fades submenu picks the shape).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Delete Fades",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Remove fades touching the selection.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "✨ Generate a sound here…",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Studio-only AI SFX generation at the click time; no Pro Tools equivalent.",
     "feasibility": "exists",
     "mapsTo": "openSfxPrompt(t, atTime, cx, cy)",
     "separator_after": false,
     "submenu": null
    }
   ]
  },
  {
   "label": "Ruler",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Right-click a ruler name (or the Ruler-View + menu) to control which rulers show and insert conductor events.",
   "feasibility": "buildable-later",
   "mapsTo": null,
   "separator_after": false,
   "submenu": [
    {
     "label": "Bars|Beats",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the bars|beats ruler; needs a bars|beats clock plus tempo.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Minutes:Seconds",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the min:sec ruler strip above the lanes.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Timecode",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the timecode timebase; no SMPTE readout.",
     "feasibility": "skip",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Feet+Frames",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the feet+frames timebase; no film readout.",
     "feasibility": "skip",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Samples",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the samples timebase; no sample readout.",
     "feasibility": "skip",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Markers",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the Markers (memory-location) ruler; needs a marker engine.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Tempo",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the Tempo ruler/editor; needs a tempo map.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Meter",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide the Meter ruler; needs a meter map.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Key / Chords",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show/hide Key Signature / Chord rulers; no key/chord engine.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "All / Minimal (Main)",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Show every ruler or collapse to the main timebase only.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Add Tempo Change...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Insert a tempo event at the clicked bar|beat; needs a tempo map.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Add Meter Change...",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Insert a meter event; no meter map.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "New Marker / Memory Location...",
     "shortcut": null,
     "ptShortcut": "Enter (numeric keypad)",
     "behavior": "Create a marker at the location; no marker engine.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Edit / Delete event",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Right-click an existing tempo/meter/marker to edit or remove it.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    }
   ]
  },
  {
   "label": "Insert selector",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Click or right-click an insert slot in a channel strip to assign, bypass, or reorder a plug-in.",
   "feasibility": "exists",
   "mapsTo": "openPluginMenu(anchor, masterFirst, onPick)",
   "separator_after": false,
   "submenu": [
    {
     "label": "no insert",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Top item; clears the slot and removes the plug-in.",
     "feasibility": "exists",
     "mapsTo": "renderInserts (2194)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "plug-in",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Submenu of plug-ins grouped by category/manufacturer; choosing one instantiates it in the slot.",
     "feasibility": "exists",
     "mapsTo": "openPluginMenu(anchor, masterFirst, onPick)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "i/o",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Assign a bus or hardware insert (send-and-return) instead of a plug-in.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "(multichannel / multi-mono variants)",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "For non-mono tracks, choose the multichannel or multi-mono version of a plug-in.",
     "feasibility": "skip",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Bypass insert",
     "shortcut": null,
     "ptShortcut": "Ctrl-click the insert",
     "behavior": "Toggle plug-in bypass (blue); stays in the signal flow.",
     "feasibility": "exists",
     "mapsTo": "renderStripSlots (bypassed)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Make Inactive / Make Active",
     "shortcut": null,
     "ptShortcut": "Ctrl+Start-click the insert",
     "behavior": "Deactivate/reactivate the insert (greyed, frees DSP); distinct from bypass.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Move / Reorder",
     "shortcut": null,
     "ptShortcut": "drag",
     "behavior": "Reorder inserts in the chain.",
     "feasibility": "exists",
     "mapsTo": "renderStripSlots",
     "separator_after": false,
     "submenu": null
    }
   ]
  },
  {
   "label": "Send selector",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Click or right-click a send slot in a channel strip to route, configure, or mute the send.",
   "feasibility": "exists",
   "mapsTo": "renderSends",
   "separator_after": false,
   "submenu": [
    {
     "label": "no send",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Clears the send.",
     "feasibility": "exists",
     "mapsTo": "renderSends (2336)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "bus",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Route the send to an internal bus (to an Aux input).",
     "feasibility": "exists",
     "mapsTo": "t.sends=[{toAux,level}]",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "output",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Route the send to a physical output; browser has one stereo output.",
     "feasibility": "skip",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Pre / Post fader toggle",
     "shortcut": null,
     "ptShortcut": "Start-click the send slot",
     "behavior": "Pre-fader sends ignore the channel fader; post-fader follow it (default post).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Send level / pan (mini fader)",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Per-send level and pan in the send window.",
     "feasibility": "exists",
     "mapsTo": "renderSends",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Follow Main Pan",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Send pan tracks the channel pan (checkmark toggle).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Mute send",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Mute the individual send (checkmark toggle).",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    }
   ]
  },
  {
   "label": "Fader",
   "shortcut": null,
   "ptShortcut": null,
   "behavior": "Fader/knob modifier-clicks for set-to-default and fine-tune (Pro Tools sets automation mode from a separate selector, not this surface).",
   "feasibility": "exists",
   "mapsTo": "bindStripCtl() (2032)",
   "separator_after": false,
   "submenu": [
    {
     "label": "Set to default (unity / 0 / center)",
     "shortcut": null,
     "ptShortcut": "Alt-click the control",
     "behavior": "Returns fader to 0 dB, pan to center, knob to default.",
     "feasibility": "exists",
     "mapsTo": "bindStripCtl() (2032)",
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Fine / nudge value",
     "shortcut": null,
     "ptShortcut": "Ctrl-drag (fine)",
     "behavior": "Finer-resolution drag on the control.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Type exact value",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Click the value readout to enter a numeric dB/value.",
     "feasibility": "buildable-now",
     "mapsTo": null,
     "separator_after": true,
     "submenu": null
    },
    {
     "label": "Off",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: no automation read or write.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Read",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: plays back written automation (default).",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Touch",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: writes only while the control is held, then returns to read.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Latch",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: writes from first touch until transport stops.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Touch/Latch",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: volume in Touch, others in Latch.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Write",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: overwrites all enabled params from play start.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    },
    {
     "label": "Trim (Ultimate)",
     "shortcut": null,
     "ptShortcut": null,
     "behavior": "Automation mode: writes delta/relative values.",
     "feasibility": "buildable-later",
     "mapsTo": null,
     "separator_after": false,
     "submenu": null
    }
   ]
  }
 ]
};
