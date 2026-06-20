// AUTO-GENERATED from studio-research/video-editor/ae-config/*.json (deep AE research).
// Regenerate with studio-research/video-editor/gen_ae_menus.py. The editor reads these globals.
// feasibility: exists | buildable-now | buildable-later | skip.  mapsTo: action key wired in editor.html.

window.AE_MENUS = [
 {
  "id": "file",
  "title": "File",
  "items": [
   {
    "label": "New",
    "behavior": "AE: submenu to create project containers and external-app source files (New Project, New Team Project, New Folder, Adobe Photoshop File, MAXON CINEMA 4D File). In LePrince it collapses to a working 'New Project' plus greyed AE-only items.",
    "feasibility": "buildable-now",
    "mapsTo": "btnNew (New Project); others grey/later",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "New Project",
      "behavior": "AE: closes the current project and opens an empty one (prompts to save). Ctrl+Alt+N. LePrince: the top-bar New button already does this — confirm, tear down media, reset to a fresh project, redraw.",
      "feasibility": "exists",
      "mapsTo": "btnNew",
      "shortcut": "Ctrl+Alt+N",
      "aeShortcut": "Ctrl+Alt+N",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "New Team Project",
      "behavior": "AE: creates a cloud Adobe Team Project for collaborative editing. LePrince has no cloud/collab backend, so this is rendered greyed for silhouette fidelity.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "New Folder",
      "behavior": "AE: creates an organizational folder in the Project panel. Ctrl+Alt+Shift+N. LePrince's bin is a flat media list with no folder model; bin grouping is real but non-trivial, so later-tier.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": "Ctrl+Alt+Shift+N",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Adobe Photoshop File",
      "behavior": "AE: creates a new .psd on disk sized to the active comp and imports it. LePrince has no Photoshop/layered-PSD pipeline — skip, render greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MAXON CINEMA 4D File",
      "behavior": "AE (2024+): creates a .c4d scene and opens it in Cinema 4D/Cineware. LePrince has no 3D/C4D integration — skip, render greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Open Project",
    "behavior": "AE: opens an .aep/.aepx from disk, replacing the current project (Ctrl+O). LePrince has no local project file; openPicker() lists server-saved projects and loads the chosen one via loadProject — this is our Open.",
    "feasibility": "exists",
    "mapsTo": "openPicker()",
    "shortcut": "Ctrl+O",
    "aeShortcut": "Ctrl+O",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Team Project",
    "behavior": "AE: opens a cloud Team Project. No collab backend in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Recent",
    "behavior": "AE: submenu of recently opened projects. LePrince: build a submenu from GET /api/editor/projects (last N), each entry calling loadProject(p). Small, high value.",
    "feasibility": "buildable-now",
    "mapsTo": "recent list from /api/editor/projects -> loadProject(p)",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Browse in Bridge",
    "behavior": "AE: launches Adobe Bridge for visual asset browsing (Ctrl+Alt+Shift+O). No Bridge in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": "Ctrl+Alt+Shift+O",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Close",
    "behavior": "AE: closes the active panel/comp viewer, not the project (Ctrl+W). LePrince's fixed 4-pane layout has no closeable comp tabs — not meaningful, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": "Ctrl+W",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Close Project",
    "behavior": "AE: closes the project (prompts to save), leaving AE open with no project. LePrince: reuse the New flow to drop to an empty state; realistic but largely redundant with New.",
    "feasibility": "buildable-now",
    "mapsTo": "reuse btnNew flow -> empty state",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Save",
    "behavior": "AE: writes the current .aep (Ctrl+S). LePrince: save() autosaves the project JSON to the server; the Save button and Ctrl/Cmd+S already call it and toast 'Saved'.",
    "feasibility": "exists",
    "mapsTo": "save()",
    "shortcut": "Ctrl+S",
    "aeShortcut": "Ctrl+S",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Save As",
    "behavior": "AE: family of save-as operations. LePrince has no on-disk file and no version interop, so only Save As and Save a Copy are meaningful (clone + save); XML and earlier-version are skipped.",
    "feasibility": "buildable-now",
    "mapsTo": "clone project then save()",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Save As…",
      "behavior": "AE: save under a new name/location and continue in the new file (Ctrl+Shift+S). LePrince: prompt for a new title, clone project with a fresh uid(), save(), keep editing the clone.",
      "feasibility": "buildable-now",
      "mapsTo": "clone project w/ new id+title -> save()",
      "shortcut": "Ctrl+Shift+S",
      "aeShortcut": "Ctrl+Shift+S",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Save a Copy…",
      "behavior": "AE: writes a copy to disk but keeps editing the original (Ctrl+Alt+S). LePrince: deep-clone project, save the copy server-side, stay on the original.",
      "feasibility": "buildable-now",
      "mapsTo": "deep-clone -> reallySave copy, keep original active",
      "shortcut": "Ctrl+Alt+S",
      "aeShortcut": "Ctrl+Alt+S",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Save a Copy As XML…",
      "behavior": "AE: writes an .aepx XML project for automation/interchange. LePrince already serializes to JSON over HTTP; an XML twin has no consumer — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Save a Copy As (earlier version)…",
      "behavior": "AE: down-saves to the prior major version's format. LePrince is single-app, single-format with no version skew — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Increment and Save",
    "behavior": "AE: saves a new file with the trailing version number bumped (v01 -> v02) without overwriting; the classic safety habit (Ctrl+Alt+Shift+S). LePrince: clone project, bump a version suffix on title + fresh uid(), reallySave(), keep editing the new one. Adopt AE's shortcut verbatim.",
    "feasibility": "buildable-now",
    "mapsTo": "clone, increment title suffix + new id, reallySave",
    "shortcut": "Ctrl+Alt+Shift+S",
    "aeShortcut": "Ctrl+Alt+Shift+S",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Revert",
    "behavior": "AE: discards all changes since last save, reloading the on-disk project. LePrince: re-fetch the project by id (GET /api/editor/projects/{id}) and loadProject(), dropping in-memory edits (confirm first).",
    "feasibility": "buildable-now",
    "mapsTo": "re-fetch project by id -> loadProject",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Import",
    "behavior": "AE: import family. LePrince has one real path (doImport(): native server file dialog -> bin), which covers single and multiple files; the interchange/3D/library sub-options are skipped.",
    "feasibility": "exists",
    "mapsTo": "doImport()",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "File…",
      "behavior": "AE: import one footage item (Ctrl+I). LePrince: doImport() opens the native picker and adds media to the bin via renderBin.",
      "feasibility": "exists",
      "mapsTo": "doImport()",
      "shortcut": "Ctrl+I",
      "aeShortcut": "Ctrl+I",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Multiple Files…",
      "behavior": "AE: repeated import dialog (Ctrl+Alt+I). LePrince: doImport() is already multi-select — paths is an array — so it handles this directly.",
      "feasibility": "exists",
      "mapsTo": "doImport()",
      "shortcut": "Ctrl+Alt+I",
      "aeShortcut": "Ctrl+Alt+I",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Adobe Premiere Pro Project…",
      "behavior": "AE: import a .prproj and choose sequences. LePrince has no Premiere interchange — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pro Import After Effects…",
      "behavior": "AE: Automatic Duck import of AAF/OMF/XML/EDL from Avid/FCP (historically intermittent on Windows). LePrince: no NLE interchange — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Vanishing Point (.vpe)…",
      "behavior": "AE: import Photoshop Vanishing Point exchange as 3D planes. No 3D in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Placeholder…",
      "behavior": "AE: insert a colored stand-in footage item to relink later. LePrince has no offline/relinkable-media concept; a placeholder stub needs relink plumbing — later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Solid…",
      "behavior": "AE: create a solid-color footage item/layer. LePrince GAP: feasible as a synthetic 'solid' media kind (color rect) but it's a new media/layer type, so later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "From Libraries…",
      "behavior": "AE: pull assets from Creative Cloud Libraries. No CC Libraries in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Import Recent Footage",
    "behavior": "AE: submenu re-importing recently used footage files. LePrince: feasible from /api/editor/media as a 'recent paths' submenu, but marginal since the bin already persists.",
    "feasibility": "buildable-now",
    "mapsTo": "recent paths -> re-POST /api/editor/import",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Export",
    "behavior": "AE: primary output paths (Render Queue, AME Queue). LePrince: a single Export modal (server ffmpeg -> downloadable MP4) is our render path; both AE entries map to it.",
    "feasibility": "exists",
    "mapsTo": "btnExport",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Add to Render Queue",
      "behavior": "AE: queues the active comp in AE's internal Render Queue (Ctrl+M). LePrince: opens the Export modal which renders via server ffmpeg (NVENC/x264) to a downloadable MP4 — the single most important File action to surface.",
      "feasibility": "exists",
      "mapsTo": "btnExport",
      "shortcut": "Ctrl+M",
      "aeShortcut": "Ctrl+M",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Add to Adobe Media Encoder Queue",
      "behavior": "AE: hands the comp to AME for encoding (Ctrl+Alt+M). LePrince has no separate AME; the same Export modal covers it.",
      "feasibility": "exists",
      "mapsTo": "btnExport",
      "shortcut": "Ctrl+Alt+M",
      "aeShortcut": "Ctrl+Alt+M",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Add Fonts from Adobe",
    "behavior": "AE: opens fonts.adobe.com to activate Adobe Fonts. LePrince text uses bundled/system fonts (Inter) with no Adobe Fonts activation — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Adobe Dynamic Link",
    "behavior": "AE: live link to Premiere/Audition comps without rendering. No Dynamic Link in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "New Premiere Pro Sequence…",
      "behavior": "AE: create a linked Premiere sequence via Dynamic Link. No cross-app linking in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Import Premiere Pro Sequence…",
      "behavior": "AE: import a linked Premiere sequence via Dynamic Link. Skip — no Dynamic Link backend.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Find…",
    "behavior": "AE: search the Project panel for footage/comps by name (Ctrl+F). LePrince: a filter box over the bin (the MEDIA list / renderBin) matching m.name — small and useful as the bin grows.",
    "feasibility": "buildable-now",
    "mapsTo": "filter #binBody by name over MEDIA",
    "shortcut": "Ctrl+F",
    "aeShortcut": "Ctrl+F",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Add Footage to Comp",
    "behavior": "AE: inserts the selected Project-panel footage into the active comp, centered and on top (Ctrl+/). LePrince: addClipToBestTrack(mid) adds the selected bin media to the right track at the playhead.",
    "feasibility": "exists",
    "mapsTo": "addClipToBestTrack(mid)",
    "shortcut": "Ctrl+/",
    "aeShortcut": "Ctrl+/",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "New Comp from Selection",
    "behavior": "AE: builds a new comp matching the selected footage's settings and places those items inside. LePrince (project==one comp): seed a fresh project sized to the selected media's dimensions and add the clip — reuses newProject() + addClipToBestTrack.",
    "feasibility": "buildable-now",
    "mapsTo": "new comp sized to selected media, then add it",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Dependencies",
    "behavior": "AE: project-hygiene tools (find missing effects/fonts/footage, Collect Files, Consolidate, Remove Unused, Reduce Project) that operate on a multi-item project. LePrince's flat single-comp model has nothing to consolidate — all skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Find Missing Effects",
      "behavior": "AE: locate layers using missing/unavailable effects. No plugin-effect model in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Find Missing Fonts",
      "behavior": "AE: locate text layers with missing fonts. LePrince uses bundled fonts only — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Find Missing Footage",
      "behavior": "AE: locate offline/missing footage. No offline-media concept in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Collect Files…",
      "behavior": "AE: gather project + all footage into one folder for handoff. LePrince media lives server-side; no collect step — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Consolidate All Footage",
      "behavior": "AE: merge duplicate footage items. Flat single-comp model — nothing to consolidate, skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove Unused Footage",
      "behavior": "AE: delete footage items not used by any comp. Skip — no separate footage/comp split.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reduce Project",
      "behavior": "AE: strip everything not feeding the selected comps. Skip — single-comp model.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Watch Folder…",
    "behavior": "AE: point AE at a folder for network/background (watch-folder) rendering. No render-farm pipeline in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Scripts",
    "behavior": "AE: run/install ExtendScript .jsx automation (Run Script File…, Open Script Editor, Install ScriptUI Panel…). No scripting engine in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Run Script File…",
      "behavior": "AE: execute a .jsx automation script. No ExtendScript engine in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Open Script Editor",
      "behavior": "AE: open the built-in script editor. Skip — no scripting.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Install ScriptUI Panel…",
      "behavior": "AE: install a dockable ScriptUI panel. Skip — no panel-script system.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Create Proxy",
    "behavior": "AE: render a low-res still/movie stand-in for footage to speed editing. Out of scope for a browser NLE; LePrince already auto-generates server-side proxies/posters/peaks — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Still",
      "behavior": "AE: create a still proxy from the current frame. Skip — automatic server-side proxies already exist.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Movie",
      "behavior": "AE: render a movie proxy for footage/comp. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Set Proxy",
    "behavior": "AE: attach an existing file as the proxy for selected footage (File / None). No user-managed proxy model in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "File…",
      "behavior": "AE: pick a file to use as the proxy. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "None",
      "behavior": "AE: detach the proxy. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Interpret Footage",
    "behavior": "AE: per-footage interpretation (alpha, frame rate, fields/pulldown, pixel aspect, color profile; Main…, Proxy, Remember/Apply). LePrince has no color mgmt/fields/pixel-aspect; the full dialog is skip (a narrow still-duration/fps override would be later).",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Main…",
      "behavior": "AE: open the Interpret Footage dialog for the selected item (Ctrl+Alt+G in AE). Skip — no interpretation model.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": "Ctrl+Alt+G",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Proxy…",
      "behavior": "AE: interpret the proxy separately. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Remember Interpretation",
      "behavior": "AE: copy the current interpretation to reuse. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Apply Interpretation",
      "behavior": "AE: paste remembered interpretation onto another footage item. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Replace Footage",
    "behavior": "AE: relink selected footage to a different file (File…, Placeholder, Solid…), updating every layer that uses it. LePrince: narrow buildable-now — import a new file and repoint every clip whose mediaId matches; Placeholder/Solid sub-options stay skip.",
    "feasibility": "buildable-now",
    "mapsTo": "import new media, reassign matching clip.mediaId",
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "File…",
      "behavior": "AE: relink to a chosen file (Ctrl+Alt+/). LePrince: import a new media item and reassign clip.mediaId for every clip using the old one.",
      "feasibility": "buildable-now",
      "mapsTo": "import new media, reassign matching clip.mediaId",
      "shortcut": null,
      "aeShortcut": "Ctrl+Alt+/",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Placeholder",
      "behavior": "AE: replace with a relinkable placeholder. No offline-media model in LePrince — skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Solid…",
      "behavior": "AE: replace footage with a solid. Tied to the unbuilt Solid layer type — skip for now.",
      "feasibility": "skip",
      "mapsTo": null,
      "shortcut": null,
      "aeShortcut": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Reload Footage",
    "behavior": "AE: re-read selected footage from disk to pick up external edits (Ctrl+Alt+L). LePrince: bust the media caches (imgCache, vels, poster/strip URLs) for a media id and re-fetch; only matters if the source changed server-side.",
    "feasibility": "buildable-now",
    "mapsTo": "drop imgCache/vels entry, re-fetch media",
    "shortcut": "Ctrl+Alt+L",
    "aeShortcut": "Ctrl+Alt+L",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "License…",
    "behavior": "AE: manage Creative Cloud licensing/sign-in. No licensing in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Reveal in Explorer",
    "behavior": "AE: open the OS file browser at the selected footage's location. A browser tab is sandboxed and cannot open Explorer — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Reveal in Bridge",
    "behavior": "AE: show the selected file in Adobe Bridge. No Bridge in LePrince — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "shortcut": null,
    "aeShortcut": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Project Settings…",
    "behavior": "AE: project-wide settings — time display, color working space/bit depth, audio sample rate, expressions engine (Ctrl+Alt+Shift+K). LePrince: the closest analog to the owner-requested Composition Settings — promote the Inspector's live width/height/fps bindings into a real modal that also sets title (and future duration/bg). Highest-priority build.",
    "feasibility": "buildable-now",
    "mapsTo": "compSettings() modal over project.width/height/fps/title (reuse Inspector Project bindings)",
    "shortcut": "Ctrl+Alt+Shift+K",
    "aeShortcut": "Ctrl+Alt+Shift+K",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Exit",
    "behavior": "AE: quits the application, prompting to save (Ctrl+Q). LePrince: a browser tab can't truly quit; honest behavior is save() then navigate home (the existing back-pill to /), with a beforeunload guard for unsaved work.",
    "feasibility": "buildable-now",
    "mapsTo": "save() then navigate to / (home)",
    "shortcut": "Ctrl+Q",
    "aeShortcut": "Ctrl+Q",
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
    "aeShortcut": "Ctrl+Z",
    "behavior": "AE steps backward through the undo stack (label is dynamic, e.g. 'Undo Move Layer'; default 32 levels). We have no undo engine yet — build a snapshot stack that pushes JSON.stringify(project) before each mutation and rehydrates on Ctrl+Z, then renderTimeline()+refreshInspector(). Make the label dynamic.",
    "feasibility": "buildable-now",
    "mapsTo": "new undo(): snapshot stack around save()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Redo",
    "shortcut": "Ctrl+Shift+Z",
    "aeShortcut": "Ctrl+Shift+Z",
    "behavior": "AE re-applies the last undone action (label 'Redo <action>'). For us, pop from the redo stack that Undo populated and rehydrate the project snapshot. Same engine as Undo.",
    "feasibility": "buildable-now",
    "mapsTo": "new redo(): redoStack rehydrate",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "History",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE opens the History panel — a scrubbable list of undo states you can click to jump to. For us, expose the undo snapshot stack as a clickable list later; full scrubbable panel is a polish item.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Quick Apply…",
    "shortcut": "Ctrl+Enter",
    "aeShortcut": "Ctrl+Enter",
    "behavior": "AE opens a fuzzy palette to search and run any menu command, effect, or animation preset. We can generate a command palette from this menu config (and the 5 fx + blend modes) that fuzzy-matches labels and invokes the same handlers.",
    "feasibility": "buildable-now",
    "mapsTo": "new quickApply() command palette over menu config",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Cut",
    "shortcut": "Ctrl+X",
    "aeShortcut": "Ctrl+X",
    "behavior": "AE copies the selection to the clipboard then deletes it. For us, serialize selClip().clip into an internal JS clipboard var, then call deleteSel(). Use an in-app clipboard, not the OS clipboard. The keydown guard already yields to focused text fields so in-field Cut stays native.",
    "feasibility": "buildable-now",
    "mapsTo": "new cutSel(): clipboard=deepClone(clip) + deleteSel()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy",
    "shortcut": "Ctrl+C",
    "aeShortcut": "Ctrl+C",
    "behavior": "AE copies the selected layers/properties/keyframes to the clipboard. For us, store {kind:'clip', data:deepClone(selClip().clip)} (or a keyframed property channel) in an internal clipboard var.",
    "feasibility": "buildable-now",
    "mapsTo": "new copySel(): clipboard=deepClone(clip)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy with Property Links",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE copies properties so a subsequent Paste creates a live expression link back to the source (edits propagate). Requires an expression engine, which we don't have. Render greyed for silhouette only.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Copy with Relative Property Links",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "Same as Copy with Property Links but the generated thisComp references resolve relative to the destination composition. No expression engine here — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Copy Expression Only",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE copies just a property's expression string (no values/keyframes) to paste onto other properties. We have no expressions — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paste",
    "shortcut": "Ctrl+V",
    "aeShortcut": "Ctrl+V",
    "behavior": "AE pastes clipboard layers/properties at the current time/target. For us, if clipboard is a clip, push a fresh-uid deep clone onto the selected/best track at the playhead (reuse addClipFromMedia placement + snapping); if a keyframed channel was copied, paste it onto the selected clip's same-named property rebased to the playhead. Focused text fields keep native paste via the existing keydown guard.",
    "feasibility": "buildable-now",
    "mapsTo": "new pasteClipboard(): clone clip at playhead",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paste Text and Match Formatting",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE 2026 (25.2+): when editing a text layer, pastes clipboard text but forces the DESTINATION layer's font/size/color. For us this is only meaningful on text clips — set clip.text to the clipboard text while leaving size/color/x/y untouched.",
    "feasibility": "buildable-now",
    "mapsTo": "new pasteTextMatch(): set clip.text, keep clip styling",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paste Text Formatting Only",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE 2026 (25.2+): applies only the source text's formatting (font/style) to the target, leaving target characters. Our text clip has only size+color (no font family / rich runs) so 'formatting' is thin — implement once a font/style field exists.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Clear",
    "shortcut": "Delete",
    "aeShortcut": "Delete",
    "behavior": "AE deletes the selection WITHOUT writing to the clipboard (unlike Cut). We already have exactly this — deleteSel() removes the selected clip and re-renders.",
    "feasibility": "exists",
    "mapsTo": "deleteSel()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Duplicate",
    "shortcut": "Ctrl+D",
    "aeShortcut": "Ctrl+D",
    "behavior": "AE duplicates the selected layer(s) stacked above the original. For us, deep-clone selClip().clip, assign a new uid(), offset start (or place on the next track), re-render, select the copy, save. Trivial given the clone idiom in doSplit.",
    "feasibility": "buildable-now",
    "mapsTo": "new duplicateSel(): deep-clone clip, new uid, offset start",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Split Layer",
    "shortcut": "Ctrl+Shift+D",
    "aeShortcut": "Ctrl+Shift+D",
    "behavior": "AE splits the selected layer at the playhead into two layers. We already have doSplit(track,c,f) which cuts at a frame, rebases in, shifts keyframes, and clears the trailing fade — wire a menu item that calls it with the current selection and playhead.",
    "feasibility": "exists",
    "mapsTo": "doSplit(track,c,f)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Lift Work Area",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE removes content under the work-area band but leaves a gap (no ripple). We have no work-area range UI yet; once an in/out range exists, delete/trim spans intersecting [in,out] in place. Catalog now, build later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Extract Work Area",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE removes content under the work area and closes the gap (ripple delete). Needs the same work-area range prereq; then trim [in,out] and shift later clips left by (out-in). Catalog now, build later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Select All",
    "shortcut": "Ctrl+A",
    "aeShortcut": "Ctrl+A",
    "behavior": "AE selects all layers in the active comp/panel. Our sel is a single {trackId,clipId}; generalize to a Set of clip ids, or ship a pragmatic v1 that highlights every .clip and routes Delete/move to the whole highlight group.",
    "feasibility": "buildable-now",
    "mapsTo": "new selectAll(): multi-select set",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Deselect All",
    "shortcut": "Ctrl+Shift+A",
    "aeShortcut": "Ctrl+Shift+A",
    "behavior": "AE clears the selection. We already have deselect() which nulls sel, clears .sel classes, and refreshes the inspector.",
    "feasibility": "exists",
    "mapsTo": "deselect()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Label",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu of 16 named label colors (names editable in Preferences) that tint the selected layer's timeline bar/bin row. For us, add clip.label and apply a tint override in clipEl(); the submenu sets the color.",
    "feasibility": "buildable-now",
    "mapsTo": "new clip.label + tint in clipEl()",
    "separator_after": false,
    "submenu": [
     {
      "label": "None",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Clears the label color (clip.label = null). Bar reverts to its per-kind default color.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label=null",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Red",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='red'; tints the clip bar red in clipEl().",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Yellow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='yellow'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Aqua",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='aqua'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pink",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='pink'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Lavender",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='lavender'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Peach",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='peach'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sea Foam",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='seafoam'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Blue",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='blue'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Green",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='green'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Purple",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='purple'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Orange",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='orange'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Brown",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='brown'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fuchsia",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='fuchsia'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cyan",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='cyan'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sandstone",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='sandstone'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dark Green",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Sets clip.label='darkgreen'; tints the clip bar.",
      "feasibility": "buildable-now",
      "mapsTo": "set clip.label",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Select Label Group",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE selects every layer sharing the selected layer's label color. For us, filter all clips by clip.label matching the selection (pairs with multi-select from Select All).",
    "feasibility": "buildable-now",
    "mapsTo": "filter clips by clip.label",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Purge",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to free RAM/disk caches used for previews and renders. We don't manage AE-style caches, so most entries are not meaningful; the exception is Purge>Undo which maps to clearing our snapshot stacks.",
    "feasibility": "buildable-now",
    "mapsTo": "new purgeMenu() (only Undo is meaningful)",
    "separator_after": true,
    "submenu": [
     {
      "label": "All Memory & Disk Cache",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE purges all RAM caches plus the on-disk cache. We have no comparable disk cache — skip, render greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "All Memory",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE purges all RAM caches. Optional local analog: empty our proxy <video> (vels{}) and image (imgCache{}) pools to free browser memory — buildable-now but not AE-named. As a strict AE map, skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Undo",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE frees memory held by undo history. For us, clear undoStack/redoStack from the snapshot engine — clean map once Undo ships.",
      "feasibility": "buildable-now",
      "mapsTo": "clear undoStack/redoStack",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Image Cache Memory",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE purges the rendered-frame image cache. No equivalent frame cache here — skip, render greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Snapshot",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE clears the viewer Snapshot held in memory (the Shift+F5 comparison snapshot). No snapshot feature here — skip, render greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Edit Original",
    "shortcut": "Ctrl+E",
    "aeShortcut": "Ctrl+E",
    "behavior": "AE opens the selected footage in its native external editor (Photoshop/Illustrator) for round-trip editing. A browser NLE can't launch desktop editors; at best a later backend 'open source file path' hook. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Edit in Adobe Audition",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE sends selected audio to Adobe Audition via Dynamic Link for cleanup/mixing. Dynamic Link to a desktop app is out of scope for a browser NLE — skip, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Team Project",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for Adobe's cloud collaboration (create/open/invite/share/manage shared projects). Cloud-collab service — skip entirely, render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Create Team Project…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE creates a new cloud-hosted Team Project. Out of scope — skip, greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Open Team Project…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE opens an existing cloud Team Project. Out of scope — skip, greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Invite…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE invites collaborators to the current Team Project. Out of scope — skip, greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Share…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE shares (commits) local Team Project changes to the cloud. Out of scope — skip, greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Manage Shared Projects…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE manages archived/shared Team Projects. Out of scope — skip, greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Templates",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to manage reusable Render Settings and Output Module presets for the Render Queue. We can offer a light analog: named export presets over our existing Export modal selects.",
    "feasibility": "buildable-now",
    "mapsTo": "new exportPresets() over #expRes/#expQual/#expFps",
    "separator_after": true,
    "submenu": [
     {
      "label": "Render Settings…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE edits project-wide render quality/resolution/frame-blending presets. Thin for us (we expose only fps/res/quality) — buildable-later as render-quality presets.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Output Module…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE edits output format/codec presets used by the Render Queue. Maps to saving our Export modal's Format/Quality/Frame-rate choices as named presets.",
      "feasibility": "buildable-now",
      "mapsTo": "new exportPresets() over #expRes/#expQual/#expFps",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Preferences",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu opening the Preferences dialog to a category (General opens with Ctrl+Alt+; / Cmd+,). We have no Preferences dialog; build one exposing the few categories that map (density/appearance, snap, new-project defaults, labels, auto-save) and grey the rest for silhouette.",
    "feasibility": "buildable-now",
    "mapsTo": "new preferences() dialog (density, snap, defaults, autosave)",
    "separator_after": true,
    "submenu": [
     {
      "label": "General…",
      "shortcut": "Ctrl+Alt+;",
      "aeShortcut": "Ctrl+Alt+;",
      "behavior": "AE General prefs (undo levels, tooltips, etc.). For us, opens the Preferences dialog; expose undo-stack depth here once the engine exists.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('general')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Previews…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE preview/playback prefs (adaptive resolution, audio sample). Minimal analog here — buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Display…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE display prefs (motion path, thumbnails). Our timeline already shows filmstrips/waveforms — buildable-later toggles.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Import…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE import prefs (still duration, sequence frame rate). Maps to our default image clip length (currently 5s in addClipFromMedia) — buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('import'): default still length",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Output…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE output prefs (overflow volumes, segment sizes). Out of scope for our single-file export — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Grids & Guides…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE grid/guide/safe-margin appearance. Pairs with the planned monitor overlay (grid/guides/title-safe) — buildable-now once that overlay lands.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('guides'): overlay colors/spacing",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Labels…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE edits the 16 label color names/values. Maps to editing our clip.label palette — buildable-now (pairs with the Label submenu).",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('labels'): label palette",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Media & Disk Cache…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE disk-cache size/location and conformed media. No disk cache here — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Video Preview…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE external video-monitor (Mercury Transmit) output. No hardware output in a browser — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Appearance…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE UI brightness/highlight colors. Maps to our Simple/Director density toggle and theme — buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('appearance'): density/theme",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "New Project…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE new-project defaults (e.g. color settings). Maps to default width/height/fps used by newProject() — buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('newproject'): default w/h/fps",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Auto-Save…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE auto-save interval and copy count. We already debounce save(); expose cadence/on-off here — buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "new preferences('autosave'): debounce cadence",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Memory & Performance…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE RAM allocation and multi-frame rendering. Not user-tunable in a browser tab — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio Hardware…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE selects the audio output device/buffer. Browser audio routing is automatic — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio Output Mapping…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE maps comp channels to hardware outputs. No hardware mapping in a browser — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sync Settings…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE syncs preferences via Creative Cloud account. No CC account model here — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Type…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE type engine and default font prefs. Maps to a default font/size for new text clips — buildable-later once a font field exists.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scripting & Expressions…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE scripting access and expression engine prefs. No scripting/expression engine here — skip/grey.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Keyboard Shortcuts…",
    "shortcut": "Ctrl+Alt+'",
    "aeShortcut": "Ctrl+Alt+'",
    "behavior": "AE opens the visual keyboard-shortcut editor (search a command, rebind keys, save presets). Our keymap is hardcoded in the keydown handler; v1 = a modal listing current shortcuts generated from this menu config (read-only); v2 = data-driven rebinding (buildable-later).",
    "feasibility": "buildable-now",
    "mapsTo": "new shortcutsHelp() list from menu config",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Paste Mocha Mask",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "Not a literal AE Edit item — Mocha exports mask/track data to the clipboard and you use ordinary Edit>Paste onto a layer/mask (modern Mocha uses panel buttons instead). We have no masks/Mocha/corner-pin tracking, so this contextual paste variant is not meaningful — skip, render greyed for silhouette completeness.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "comp",
  "title": "Composition",
  "items": [
   {
    "label": "New Composition…",
    "shortcut": "Ctrl+N",
    "aeShortcut": "Ctrl+N",
    "behavior": "In AE this opens the Composition Settings dialog and creates a brand-new, empty composition (name, preset, w/h, pixel aspect, fps, resolution, start timecode, duration, background color). In our editor a project IS one composition, so this maps to creating a fresh blank project — wire it to newProject()/btnNew, but FIRST route through a 'New Composition' dialog (preset + w/h/fps/duration/bg) so the new project starts with the chosen settings instead of always 1920x1080@30.",
    "feasibility": "exists",
    "mapsTo": "btnNew",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Composition Settings…",
    "shortcut": "Ctrl+K",
    "aeShortcut": "Ctrl+K",
    "behavior": "In AE this opens the settings dialog for the CURRENT comp (Basic tab: name, w/h with lock-aspect, pixel aspect ratio, fps, resolution, start timecode, duration, background color; Advanced tab: anchor, shutter, motion blur, renderer 3D). In our editor this is the high-priority dialog the owner explicitly asked for: a modal editing project.title/width/height/fps/duration/bg, writing back into the project object and triggering re-render + canvas resize + fitScreen(). Changing w/h must NOT scale existing clips; duration just resizes the work/timeline length.",
    "feasibility": "buildable-now",
    "mapsTo": "new compSettings() modal → edits project.{title,width,height,fps} + new project.bg/duration fields; on save call renderTimeline()+drawFrame()+fitScreen()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Set Poster Time",
    "shortcut": "Shift+P",
    "aeShortcut": null,
    "behavior": "In AE this marks the current-time frame as the comp's thumbnail/poster frame shown in the Project panel. In our editor we have a single-project bin, but we can store project.posterFrame = current playhead and use that frame as the project/export thumbnail and the bin preview; render the poster icon on the playhead. Cheap to add via setPlayhead state.",
    "feasibility": "buildable-now",
    "mapsTo": "set project.posterFrame = playhead; redraw bin thumbnail from that frame",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Trim Comp to Work Area",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE this trims the composition's total duration down to the current Work Area span (the trimmed-bar region on the time ruler). We have no Work Area band yet; this depends on first adding a work-area in/out range to the timeline ruler. Once a work area exists, set project.duration = workEnd-workStart and offset clips. Real but multi-part, so buildable-later (or buildable-now if a work-area range is added first).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Crop Comp to Region of Interest",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE this resizes the comp's w/h to the Region of Interest rectangle drawn on the Composition viewer. We have no ROI marquee on the program monitor; this needs an ROI overlay tool first, then set project.width/height to the ROI box and offset layer positions. Conceptually fits our data model but requires the ROI UI, so buildable-later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Crop Comp to Selected Layers Bounds",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "Newer AE item: resizes the comp to the bounding box of the currently selected layers (auto-crop to content). We could compute the union bounding box of selected clips from posX/posY/scale and set project.width/height + reposition, but it needs reliable per-clip transformed bounds math. Real and in-model but non-trivial, so buildable-later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Add to Adobe Media Encoder Queue…",
    "shortcut": null,
    "aeShortcut": "Ctrl+Alt+M",
    "behavior": "In AE this hands the comp off to the standalone Adobe Media Encoder app for queued background encoding via Dynamic Link. We have no external encoder/Dynamic Link; our single Export path is the equivalent. Skip the AME concept — keep only our own Export (see Add to Render Queue).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Add to Render Queue",
    "shortcut": "Ctrl+M",
    "aeShortcut": "Ctrl+M",
    "behavior": "In AE this adds the comp to the internal Render Queue panel where you set output module + destination and click Render. We have no multi-item queue, but our existing Export button IS the render action. Map this to btnExport (our one-shot render/export). A real queue panel is buildable-later; for now this triggers the export flow directly.",
    "feasibility": "exists",
    "mapsTo": "btnExport",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Add Output Module",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE this (enabled only with a Render Queue item selected) adds an extra output module so one render produces multiple formats. With no render-queue panel and a single fixed export format, this has nothing to attach to. Skip; greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Preview",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu controlling RAM/standard preview playback. In our editor this groups the existing transport: Play/Pause (space), Stop, and step controls already wired to play()/stop()/togglePlay() and frame stepping. Each child maps to an existing function.",
    "feasibility": "exists",
    "mapsTo": "togglePlay()",
    "separator_after": false,
    "submenu": [
     {
      "label": "Play / Pause",
      "shortcut": "Space",
      "aeShortcut": "Space",
      "behavior": "AE: toggles standard playback from the playhead. In our editor: toggle play/pause of the program monitor from the current playhead.",
      "feasibility": "exists",
      "mapsTo": "togglePlay()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "RAM Preview / Play Cached",
      "shortcut": "Num 0",
      "aeShortcut": "Num 0",
      "behavior": "AE: renders frames to RAM then plays them back at full frame rate. We render live to canvas with no frame cache; treat this as a normal real-time play() rather than a cached preview. Maps to play() — a true cached preview is buildable-later.",
      "feasibility": "exists",
      "mapsTo": "play()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Stop",
      "shortcut": "Esc",
      "aeShortcut": null,
      "behavior": "AE: halts the active preview. In our editor: stop playback and keep the playhead where it is.",
      "feasibility": "exists",
      "mapsTo": "stop()",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Save Frame As",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to export the single current frame as a still — 'File…' (immediate still, Ctrl+Alt+S) or 'Photoshop Layers…' (layered PSD). In our editor we can grab the program-monitor canvas at the current playhead via toDataURL and download a PNG. The PSD-layers option is skip (no layered export).",
    "feasibility": "buildable-now",
    "mapsTo": "monitorCanvas.toDataURL('image/png') → trigger download of current frame",
    "separator_after": false,
    "submenu": [
     {
      "label": "File…",
      "shortcut": "Ctrl+Alt+S",
      "aeShortcut": "Ctrl+Alt+S",
      "behavior": "AE: adds a single-frame still render to the queue and renders it. In our editor: snapshot the current canvas frame and save it as a PNG immediately.",
      "feasibility": "buildable-now",
      "mapsTo": "drawFrame() then monitorCanvas.toDataURL('image/png') download",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Photoshop Layers…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exports the frame as a layered PSD, one layer per comp layer. We have no PSD writer / per-layer raster export. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Pre-render…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: adds the comp to the render queue with a post-render 'Import & Replace Usage' action so a nested/expensive comp is baked to a movie and swapped in to speed up the parent project. This is a nesting/proxy optimization; we have no nesting or proxy system, so it's meaningless here. Skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Save Current Preview…",
    "shortcut": "Ctrl+Num 0",
    "aeShortcut": "Ctrl+Num 0",
    "behavior": "AE: saves the most recently RAM-previewed clip out to a movie file. We have no RAM-preview cache to export, so there is nothing to save. Skip (our Export covers movie output).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Open in Essential Graphics",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: opens the comp in the Essential Graphics panel to author a Motion Graphics Template (.mogrt) by exposing selected controls. We have no template-authoring / controls-export pipeline. Skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Responsive Design — Time",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu (Create Protected Region from selected markers / from Work Area) that locks intro/outro regions so they don't stretch when a comp is time-remapped or used as a template. Depends on comp markers, work area, and nested time-stretch — none of which we have. Skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Create Protected Region from Selected Markers",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: turns the time between two selected comp markers into a non-stretching protected region. No comp markers or template time-stretch in our editor. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create Protected Region from Work Area",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: makes the current Work Area span a protected (non-stretching) region. No work area or template stretch model. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Composition Flowchart",
    "shortcut": "Ctrl+Shift+F11",
    "aeShortcut": "Ctrl+Shift+F11",
    "behavior": "AE: opens the Flowchart panel, a node graph of comps, nested comps, layers, and footage showing how the project is wired. With one flat comp and no nesting, a flowchart adds little; a trivial single-node view is possible but low value. Skip for now (revisit if precompose/nesting ships).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Composition Mini-Flowchart",
    "shortcut": "Tab",
    "aeShortcut": "Tab",
    "behavior": "AE: a lightweight pop-up flowchart for quickly navigating up/down the nesting chain of the active comp. We have no nesting chain to navigate. Skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "VR",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for 360/VR authoring (Extract Cubemap, Convert Cubemap↔Equirectangular, Create VR Environment, Add 3D Editing Camera, Add Edges, etc.), built on AE's 3D renderer and immersive effects. Pure 360-degree spherical/3D work, entirely out of scope for a flat 2D browser NLE. Skip the whole submenu (render greyed for silhouette).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Extract Cubemap",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: un-distorts 360 equirectangular footage into six cube-face camera views. No 360/3D pipeline. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Convert Cubemap to Equirectangular / Equirectangular to Cubemap",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts between cubemap and equirectangular 360 projections. No 360 projection support. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create VR Environment",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: auto-builds a VR comp with a 3D camera rig and environment layers for immersive editing. Requires AE's 3D renderer; out of scope. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Add 3D Editing Camera / Add Edges",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: helpers for placing 2D layers into a 360 scene without distortion. No 3D camera or 360 scene. Skip.",
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
  "id": "layer",
  "title": "Layer",
  "items": [
   {
    "label": "New",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu that creates a brand-new layer in the active comp (Text, Solid, Light, Camera, Null, Shape, Adjustment, Content-Aware Fill, Photoshop File, CINEMA 4D File). In our editor 'New' becomes the layer/element creation menu: Text maps to addText(); Solid/Adjustment/Null are buildable-later as new clip 'kinds'; the rest skip (no 3D, no Ps/C4D round-trip).",
    "feasibility": "buildable-now",
    "mapsTo": "addText() for Text; others per-submenu",
    "separator_after": true,
    "submenu": [
     {
      "label": "Text",
      "shortcut": "Ctrl+Alt+Shift+T",
      "aeShortcut": "Ctrl+Alt+Shift+T",
      "behavior": "AE adds an empty point-text layer and drops you into edit mode in the Composition viewer. In our editor this is exactly addText(): it finds/creates the Titles track, inserts a 3s text clip at the playhead, selects it, and opens the Inspector so you can type. Wire it straight to addText().",
      "feasibility": "exists",
      "mapsTo": "addText()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Solid…",
      "shortcut": "Ctrl+Y",
      "aeShortcut": "Ctrl+Y",
      "behavior": "AE creates a full-frame solid-color layer (a Solid Settings dialog sets name/size/color), used for backgrounds, mattes and effect carriers. We have no 'solid' clip type. Buildable-later: add a synthetic clip kind {kind:'solid', color, w, h} the renderer fills as a flat rect honoring the same transform/opacity/blend props — a small but real renderer + data-model addition.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Light…",
      "shortcut": "Ctrl+Alt+Shift+L",
      "aeShortcut": "Ctrl+Alt+Shift+L",
      "behavior": "AE adds a 3D light (Parallel/Spot/Point/Ambient) that illuminates 3D layers and casts shadows. Our editor is a flat 2D canvas compositor with no 3D lighting model. Skip — render the item greyed for menu fidelity.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Camera…",
      "shortcut": "Ctrl+Alt+Shift+C",
      "aeShortcut": "Ctrl+Alt+Shift+C",
      "behavior": "AE adds a 3D camera with depth-of-field/focus controls to fly through 3D-enabled layers. No 3D camera in a 2D NLE. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Null Object",
      "shortcut": "Ctrl+Alt+Shift+Y",
      "aeShortcut": "Ctrl+Alt+Shift+Y",
      "behavior": "AE adds an invisible 100×100 null layer used as a parent/control handle for rigging. We have no parenting/expressions, so a null is only meaningful once parenting exists. Buildable-later: a non-rendering 'null' clip whose transform other clips can inherit — depends on a parenting system we don't have yet.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Shape Layer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE creates an empty vector shape layer (rects/ellipses/paths with fills/strokes, fully animatable). We have no vector/path engine. Buildable-later (large) — would need a shape data model, an editor, and a canvas vector renderer.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Adjustment Layer",
      "shortcut": "Ctrl+Alt+Y",
      "aeShortcut": "Ctrl+Alt+Y",
      "behavior": "AE adds a full-frame layer whose effects apply to every layer beneath it in the stack. We composite tracks bottom-up, so an adjustment layer maps cleanly to a clip flagged isAdjustment that, instead of drawing pixels, applies our 5 canvas filters (blur/bright/contrast/sat/hue) to the accumulated frame below it. Buildable-later — needs a render-pipeline pass over the composited buffer, not just per-clip drawImage.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Content-Aware Fill Layer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE generates a new footage layer from the Content-Aware Fill panel that paints out masked objects across a clip using ML inpainting. Requires server ML video inpainting we don't have. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Adobe Photoshop File…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE creates a new .psd on disk sized to the comp and imports it as a layered footage item for round-trip editing in Photoshop. No Ps integration in a browser NLE. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "MAXON CINEMA 4D File…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE creates a new .c4d scene and opens it in Cineware/Cinema 4D Lite for 3D content. No 3D / C4D pipeline. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Layer Settings…",
    "shortcut": "Ctrl+Shift+Y",
    "aeShortcut": null,
    "behavior": "Context-sensitive in AE: for a solid it opens Solid Settings (name/size/color); for text/shape/camera/light it opens the matching settings dialog. We have no solids yet; the closest live equivalent is the Inspector, which already edits the selected clip's name-adjacent fields. Buildable-now once Solids exist (a solidSettings() dialog); for now route to refreshInspector() / focus the Inspector.",
    "feasibility": "buildable-now",
    "mapsTo": "focus Inspector — refreshInspector()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Layer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE opens the selected layer in its own Layer panel viewer (for masks/paint/precise trimming). We have a single Program monitor and no per-layer viewer. Buildable-later — could open a 'solo this clip' isolated preview, but it's a real new viewer mode.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Open Layer Source",
    "shortcut": "Alt+double-click",
    "aeShortcut": "Alt+double-click layer",
    "behavior": "AE opens the layer's underlying footage/comp in its source viewer or, for a precomp, opens that comp. In our model a clip's source is its MEDIA[mediaId] bin item. Buildable-now: select+scroll-to the matching bin entry and show its source poster/info — reuse the existing media bin and the /api/editor/media/:id/src endpoint.",
    "feasibility": "buildable-now",
    "mapsTo": "select clip's MEDIA[mediaId] in #binBody; open /media/:id/src",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Reveal in Explorer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE opens the OS file browser (Explorer/Finder) at the footage file's location on disk. We're a browser app and can't open the host file manager. Skip (or, server-side, we know the imported path — a low-value 'copy path' could be buildable-later). Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Mask",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for the selected layer's masks: New Mask (Ctrl+Shift+N), Mask Shape (Ctrl+Shift+M), Mask Feather (Ctrl+Shift+F), Mask Opacity, Mask Expansion, Reset/Remove All Masks, Free Transform Points, Lock/Unlock, modes (Add/Subtract/Intersect), Motion Blur, Locked. We have no mask/path engine at all. Buildable-later (large) — needs a path data model, a pen tool, per-clip mask compositing, and feather. Catalog the whole submenu but ship none of it now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "New Mask",
      "shortcut": "Ctrl+Shift+N",
      "aeShortcut": "Ctrl+Shift+N",
      "behavior": "AE adds a full-layer rectangular mask you then reshape. No masks in our editor. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mask Shape…",
      "shortcut": null,
      "aeShortcut": "Ctrl+Shift+M",
      "behavior": "AE opens a dialog to set the mask path's bounding box numerically (and shape: rect/ellipse). Depends on a mask engine we lack. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mask Feather…",
      "shortcut": null,
      "aeShortcut": "Ctrl+Shift+F",
      "behavior": "AE softens the mask edge by a pixel radius. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mask Opacity…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE sets how opaque the masked-in region is. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mask Expansion…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE grows/shrinks the mask region by pixels. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reset Mask",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE resets the selected mask path to a full-layer rectangle. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove Mask",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE deletes the selected mask (Remove All Masks deletes every mask). No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove All Masks",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE deletes every mask on the layer. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mode",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE submenu for mask blending: None/Add/Subtract/Intersect/Lighten/Darken/Difference, plus Inverted toggle. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Locked",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE locks the mask against edits. No masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Motion Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE applies motion blur to an animated mask path. No masks / no motion blur. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Mask and Shape Path",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for path-level ops shared by masks and shapes: Free Transform Points (Ctrl+T to bound-box-transform a path), RotoBezier, Closed, First Vertex, etc. Requires the same path engine masks/shapes need. Buildable-later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Free Transform Points",
      "shortcut": null,
      "aeShortcut": "Ctrl+T (double-click path)",
      "behavior": "AE wraps the selected path points in a free-transform box to scale/rotate them together. No paths in our editor. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "RotoBezier",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE toggles a path between manual Bezier handles and auto-calculated RotoBezier curvature. No paths. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Closed",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE toggles whether the path is open or closed. No paths. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Set First Vertex",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE designates which point is vertex #1 (matters for path-trim and morphs). No paths. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Quality",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu setting the layer's render quality: Best (Ctrl+Alt+J), Draft (Ctrl+Shift+Alt+J), Wireframe, Bilinear/Bicubic sampling. This is a render-precision toggle. Our canvas always renders at full quality with default smoothing; there's no meaningful draft/wireframe mode. Skip (or expose imageSmoothingEnabled as a single 'Best/Draft' toggle — minor). Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Best",
      "shortcut": null,
      "aeShortcut": "Ctrl+Alt+J",
      "behavior": "AE renders the layer at full quality (anti-aliased). Our canvas is always full-quality. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Draft",
      "shortcut": null,
      "aeShortcut": "Ctrl+Shift+Alt+J",
      "behavior": "AE renders faster with no anti-aliasing for quick previews. We could flip ctx.imageSmoothingEnabled=false, but it has near-zero value here. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Wireframe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE draws only the layer's bounding outline for ultra-fast layout previews. No equivalent need. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bilinear / Bicubic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE chooses the pixel-sampling algorithm when scaling the layer. Canvas drawImage handles sampling internally. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Switches",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu mirroring the Timeline's per-layer switch column: Shy, Collapse Transformations/Continuously Rasterize, Quality, Effects (enable), Frame Blending, Motion Blur, Adjustment Layer, 3D Layer, plus Lock (Ctrl+L) / Unlock All. Most are 3D/quality/precomp switches we don't have. Buildable-later: a per-clip 'enabled' (eye) and 'lock' toggle on the clip data model are realistic; the rest skip. Treat as buildable-later overall.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Shy",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE hides 'shy' layers from the timeline (declutter) without affecting render. We have few tracks and no shy concept. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Effects (Enable)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE toggles whether the layer's effects render. We could add a per-clip 'fxEnabled' that bypasses clipFilter() in drawClip(). Buildable-now — a one-line guard plus an Inspector toggle.",
      "feasibility": "buildable-now",
      "mapsTo": "per-clip fxEnabled guard in clipFilter()/drawClip()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Frame Blending",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE toggles per-layer frame blending (mirrors the Frame Blending menu item). No frame-blend pipeline. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Motion Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE toggles per-layer motion blur on animated transforms. No motion-blur renderer. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Adjustment Layer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE flips a normal layer into an adjustment layer (effects affect layers below). Depends on the adjustment-layer render pass. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "3D Layer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE gives the layer Z/orientation and 3D compositing. 2D-only canvas. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Lock",
      "shortcut": null,
      "aeShortcut": "Ctrl+L",
      "behavior": "AE prevents the layer from being selected/edited. We could add a per-clip 'locked' flag that blocks select()/drag. Buildable-now — small guard in attachClipDrag()/select().",
      "feasibility": "buildable-now",
      "mapsTo": "per-clip locked flag guarding select()/attachClipDrag()",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Transform",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to reset and nudge the selected layer's transform (Anchor Point, Position, Scale, Orientation, Rotation, Opacity) plus flips, centering and auto-orient. Our clips already carry posX/posY/scale/rotation/opacity as keyable Inspector props (bindKRow). This whole submenu maps onto the existing transform model: Reset and the flips/centering are buildable-now helpers that write those same fields.",
    "feasibility": "exists",
    "mapsTo": "Inspector transform props (posX/posY/scale/rotation/opacity via bindKRow)",
    "separator_after": false,
    "submenu": [
     {
      "label": "Reset",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE resets all transform properties (position, scale, rotation, opacity, anchor) to defaults. Buildable-now: set the selected clip's posX/posY=0, scale=1, rotation=0, opacity=1 (our KDEF values), strip any keyframes on those fields, then refreshInspector()+drawFrame()+save(true). One small resetTransform() helper.",
      "feasibility": "buildable-now",
      "mapsTo": "resetTransform() → posX/posY=0,scale=1,rotation=0,opacity=1 + refreshInspector()",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Anchor Point",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reveals/edits the layer's anchor point (rotation/scale pivot). Our clips rotate/scale about the canvas center, with no per-clip anchor field. Buildable-later — would add an anchorX/anchorY to the data model and the drawClip() transform math.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Position",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reveals the Position property in the timeline. We expose posX/posY in the Inspector and they're keyable. Exists — focus those fields.",
      "feasibility": "exists",
      "mapsTo": "Inspector posX/posY (bindKRow)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scale",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reveals Scale. We expose scale in the Inspector, keyable via pval()/bindKRow. Exists.",
      "feasibility": "exists",
      "mapsTo": "Inspector scale (bindKRow)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Orientation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE sets a 3D layer's fixed orientation (separate from animated rotation). 3D-only. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Rotation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reveals Rotation. We expose rotation (degrees) in the Inspector, keyable. Exists.",
      "feasibility": "exists",
      "mapsTo": "Inspector rotation (bindKRow)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Opacity",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reveals Opacity. We expose opacity (0–1), keyable, and it also drives clip fades via clipAlpha(). Exists.",
      "feasibility": "exists",
      "mapsTo": "Inspector opacity (bindKRow / clipAlpha)",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Flip Horizontal",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE mirrors the layer left-to-right (internally Scale X *= -1). We render scale uniformly (ctx.scale(sc,sc)), so a true horizontal flip needs a signed scaleX. Buildable-now: add a per-clip flipH flag and apply ctx.scale(-1,1) in drawClip() — tiny renderer tweak.",
      "feasibility": "buildable-now",
      "mapsTo": "per-clip flipH → ctx.scale(-1,1) in drawClip()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Flip Vertical",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE mirrors the layer top-to-bottom (Scale Y *= -1). Same as flip horizontal: add flipV and apply ctx.scale(1,-1). Buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "per-clip flipV → ctx.scale(1,-1) in drawClip()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Center Anchor Point in Layer Content",
      "shortcut": "Ctrl+Alt+Home",
      "aeShortcut": "Ctrl+Alt+Home",
      "behavior": "AE moves the anchor to the visual center of the layer's content without moving the layer. We don't have per-clip anchors yet. Buildable-later (depends on the anchor-point feature).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Center In View",
      "shortcut": "Ctrl+Home",
      "aeShortcut": "Ctrl+Home",
      "behavior": "AE moves the layer so it's centered in the current comp view. Our clips already center by default (posX/posY=0 == comp center in drawClip). Buildable-now: set posX=0,posY=0 on the selected clip — a one-liner reusing the transform model.",
      "feasibility": "buildable-now",
      "mapsTo": "set selected clip posX=0,posY=0 + drawFrame()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fit to Comp",
      "shortcut": "Ctrl+Alt+F",
      "aeShortcut": "Ctrl+Alt+F",
      "behavior": "AE scales the layer (non-uniformly) to exactly fill the comp. Our renderer already letterboxes media to fit the project frame via stageFit(), so 'Fit to Comp' is effectively the default (scale=1). Buildable-now as a Reset-scale helper; true non-uniform stretch would need a separate scaleX/scaleY.",
      "feasibility": "buildable-now",
      "mapsTo": "set selected clip scale=1 (already fit by stageFit())",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fit to Comp Width",
      "shortcut": "Ctrl+Shift+Alt+H",
      "aeShortcut": "Ctrl+Shift+Alt+H",
      "behavior": "AE uniformly scales the layer so its width matches the comp width. With our uniform scale we can compute the scale factor from the media aspect vs project width. Buildable-now (small math helper writing scale).",
      "feasibility": "buildable-now",
      "mapsTo": "compute+set scale to match comp width",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fit to Comp Height",
      "shortcut": "Ctrl+Shift+Alt+G",
      "aeShortcut": "Ctrl+Shift+Alt+G",
      "behavior": "AE uniformly scales the layer so its height matches the comp height. Same approach as Fit to Comp Width. Buildable-now.",
      "feasibility": "buildable-now",
      "mapsTo": "compute+set scale to match comp height",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Auto-Orient…",
      "shortcut": "Ctrl+Alt+O",
      "aeShortcut": "Ctrl+Alt+O",
      "behavior": "AE auto-rotates a layer to face along its motion path / toward a camera. Requires path-following / camera we don't have. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Time",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for retiming the layer: Enable Time Remapping, Time-Reverse Layer, Time Stretch, Freeze Frame, Freeze On Last Frame. Our clips have a source in-point (in) and dur but no speed/remap field. Time-Reverse and Freeze are buildable-later; Time Stretch (a speed factor) is buildable-later but the most useful. Catalog all.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Enable Time Remapping",
      "shortcut": "Ctrl+Alt+T",
      "aeShortcut": "Ctrl+Alt+T",
      "behavior": "AE adds a keyframable Time Remap property so you can freely retime/loop/hold footage. We have no time-warp model. Buildable-later (large) — needs a per-clip time-remap curve feeding the source seek in drawFrameInto()/syncPlay().",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time-Reverse Layer",
      "shortcut": "Ctrl+Alt+R",
      "aeShortcut": "Ctrl+Alt+R",
      "behavior": "AE plays the footage backwards. Buildable-later: a per-clip 'reversed' flag that inverts the source-time math (want = in + (dur-1-(f-start))) in both preview seek and the export frame server — moderate but self-contained.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time Stretch…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE opens a dialog to change layer speed by a stretch % (200% = half speed) or to a new duration. Buildable-later: add a per-clip speed factor that scales source-time and clip dur, threaded through the seek math and export. The most valuable Time item — promote when retiming is on the roadmap.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Freeze Frame",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE freezes the layer on the frame at the playhead (holds one frame for the whole layer via Time Remap). Buildable-later — depends on time-remap; alternatively a 'freeze at in-point' that locks the source seek to a single frame is a smaller subset.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Freeze On Last Frame",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE plays normally then holds the final frame indefinitely (time-remap with a held last key). Buildable-later — same dependency as Freeze Frame.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Frame Blending",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE cycles the layer's frame-blending mode (Off → Frame Mix → Pixel Motion) to smooth retimed/slow footage. Only meaningful with time-stretch/retiming, which we don't have, and pixel-motion is an optical-flow renderer we lack. Buildable-later (depends on retiming + a blend pass). Greyed for now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "3D Layer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE toggles the layer into 3D space (adds Z position, orientation, material options, casts/receives shadows). Our compositor is strictly 2D. Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Guide Layer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE marks a layer visible only in the comp (for reference/overlays) and excluded from final render/output. Buildable-now: a per-clip 'guide' flag that drawFrameInto() draws during preview but the export path (exportViaFrameServer/projectNeedsFrameServer) skips. Small, self-contained data-model + two guards.",
    "feasibility": "buildable-now",
    "mapsTo": "per-clip guide flag — draw in preview, skip in export",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Environment Layer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE flags a footage layer (usually a 360°/HDRI) as the lighting/reflection environment for 3D layers. 3D-only concept. Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Markers",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to add/manage per-layer markers (notes, chapter points, cue triggers) shown on the layer bar: Add Marker (* numpad), Settings, Remove. We have no marker model. Buildable-later: a clip.markers array drawn on the clip bar — a modest add, but a new data type + render + UI. Catalog the submenu.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Add Marker",
      "shortcut": null,
      "aeShortcut": "* (numpad)",
      "behavior": "AE drops a marker at the playhead on the selected layer. Buildable-later — push {t} into a clip.markers array and render a pip on the clip bar.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Settings…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE opens the marker dialog (comment, chapter, duration, cue params). Depends on a marker model. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove All Markers",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE clears every marker on the layer. Buildable-later — clear clip.markers.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Preserve Transparency",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE makes a layer composite only where the accumulated alpha of layers beneath it already exists (a stacking-context alpha-clamp, the 'T' switch). Needs an alpha-aware multi-layer composite buffer we don't keep (we drawImage directly to the output). Buildable-later. Greyed for now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Blending Mode",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to pick the layer's blend mode (Normal, Add, Screen, Multiply, Overlay, Darken/Lighten, Difference, etc.). We already ship exactly this: clip.blend drives ctx.globalCompositeOperation in drawClip(), chosen from the BLENDS list in the Inspector. Maps 1:1 — our 10 modes (Normal/Add/Screen/Multiply/Overlay/Lighten/Darken/Soft Light/Hard Light/Difference) cover AE's common set.",
    "feasibility": "exists",
    "mapsTo": "Inspector Blend select (clip.blend → BLENDS / ctx.globalCompositeOperation)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Next Blending Mode",
    "shortcut": "Shift+=",
    "aeShortcut": "Shift+= (numpad)",
    "behavior": "AE steps the selected layer to the next blend mode in the list. Buildable-now: advance clip.blend to the next entry in our BLENDS array and redraw — a trivial wrapper over the existing blend field and a keyboard binding.",
    "feasibility": "buildable-now",
    "mapsTo": "cycle clip.blend +1 in BLENDS[] + drawFrame()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Previous Blending Mode",
    "shortcut": "Shift+-",
    "aeShortcut": "Shift+- (numpad)",
    "behavior": "AE steps to the previous blend mode. Buildable-now: clip.blend to the previous BLENDS entry + redraw.",
    "feasibility": "buildable-now",
    "mapsTo": "cycle clip.blend -1 in BLENDS[] + drawFrame()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Track Matte",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE uses the layer above as a matte for this layer: Alpha, Alpha Inverted, Luma, Luma Inverted (No Track Matte to clear). Needs an offscreen-buffer compositing pass with a matte source — we composite directly to the visible canvas. Buildable-later (moderate): render the matte layer to an OffscreenCanvas, use globalCompositeOperation 'destination-in'/'destination-out' or luma extraction. Catalog the submenu.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "No Track Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE clears any matte assignment. Trivial once mattes exist. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Alpha Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE keeps this layer only where the matte layer's alpha is opaque. Buildable-later via destination-in on an offscreen buffer.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Alpha Inverted Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE keeps this layer where the matte's alpha is transparent. Buildable-later via destination-out.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Luma Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE keeps this layer scaled by the matte layer's luminance (white=opaque). Buildable-later — needs a luma-to-alpha pass on the matte buffer.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Luma Inverted Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE keeps this layer scaled by inverse luminance (black=opaque). Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Layer Styles",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu adding Photoshop-style layer effects: Drop Shadow, Inner Shadow, Outer/Inner Glow, Bevel & Emboss, Satin, Color/Gradient/Pattern Overlay, Stroke (plus Show All / Remove All). We have no per-layer style stack; canvas could fake Drop Shadow/Stroke/Color Overlay but it's a real feature set. Buildable-later. Catalog the submenu.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Drop Shadow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE casts a soft offset shadow behind the layer. Canvas shadowColor/shadowBlur/shadowOffset could approximate it (text clips already use shadows). Buildable-later — generalize to a per-clip style.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inner Shadow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE adds a shadow inside the layer's edges. Needs compositing inside the alpha. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Outer Glow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE adds a glow outside the layer edges. Buildable-later via blurred alpha halo.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inner Glow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE adds a glow inside the edges. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bevel and Emboss",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE adds simulated 3D edge lighting. Complex shading. Buildable-later (low priority).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Satin",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE adds an interior satin sheen. Niche. Buildable-later (low priority).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Overlay",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE fills the layer's alpha with a flat color. Buildable-later — source-atop fill on the clip buffer; one of the cheaper styles.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gradient Overlay",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE fills the alpha with a gradient. Buildable-later via canvas gradient + source-atop.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pattern Overlay",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE tiles a pattern over the alpha. Buildable-later (low priority).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Stroke",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE outlines the layer's alpha edge with a colored stroke. Buildable-later — edge-detect/offset the alpha; useful for titles.",
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
    "aeShortcut": null,
    "behavior": "AE submenu to restack the selected layer in the comp's z-order: Bring to Front, Bring Forward, Send Backward, Send to Back. In our model compositing order is the TRACK index (tracks render bottom-up). We have no per-clip z within a track, so Arrange maps to reordering the clip's TRACK among same-kind tracks. Buildable-now: splice project.tracks (or move the clip to a higher/lower video track) then renderTimeline()+save(true).",
    "feasibility": "buildable-now",
    "mapsTo": "reorder track in project.tracks[] (bottom-up composite) + renderTimeline()",
    "separator_after": false,
    "submenu": [
     {
      "label": "Bring Layer to Front",
      "shortcut": "Ctrl+Shift+]",
      "aeShortcut": "Ctrl+Shift+]",
      "behavior": "AE moves the layer to the top of the stack (renders last/on top). Our top-most = highest video-track index. Buildable-now: move the clip to the top-most video track (creating one if needed) or move its track to the front of the video group.",
      "feasibility": "buildable-now",
      "mapsTo": "move clip/track to top video index + renderTimeline()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bring Layer Forward",
      "shortcut": "Ctrl+]",
      "aeShortcut": "Ctrl+]",
      "behavior": "AE moves the layer up one in the stack. Buildable-now: swap the clip's track with the next video track up (or shift one slot).",
      "feasibility": "buildable-now",
      "mapsTo": "shift clip up one video track + renderTimeline()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send Layer Backward",
      "shortcut": "Ctrl+[",
      "aeShortcut": "Ctrl+[",
      "behavior": "AE moves the layer down one in the stack. Buildable-now: shift the clip's track one slot lower.",
      "feasibility": "buildable-now",
      "mapsTo": "shift clip down one video track + renderTimeline()",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Send Layer to Back",
      "shortcut": "Ctrl+Shift+[",
      "aeShortcut": "Ctrl+Shift+[",
      "behavior": "AE moves the layer to the bottom of the stack. Buildable-now: move the clip to the bottom-most video track.",
      "feasibility": "buildable-now",
      "mapsTo": "move clip/track to bottom video index + renderTimeline()",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Reveal",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu to jump to the layer's source/usage: Reveal Layer Source in Project, Reveal Layer in Composition, Reveal Expression Errors, Reveal in Explorer/Finder. We map the useful one: 'Reveal Source in Project' selects the clip's MEDIA[mediaId] in the media bin. Buildable-now; expression-errors and OS-reveal skip.",
    "feasibility": "buildable-now",
    "mapsTo": "select clip's MEDIA[mediaId] in #binBody",
    "separator_after": false,
    "submenu": [
     {
      "label": "Reveal Layer Source in Project",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE selects/highlights the layer's footage item in the Project panel. Buildable-now: add 'sel' to the matching .media element in the bin and scroll it into view — reuse renderBin()'s click handler.",
      "feasibility": "buildable-now",
      "mapsTo": "highlight MEDIA[mediaId] in #binBody",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reveal Layer in Composition",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE scrolls the timeline so the selected layer is visible. Buildable-now: scroll #lanesWrap to the selected clip's track/start (we already select clips and know c.start*ppf).",
      "feasibility": "buildable-now",
      "mapsTo": "scroll #lanesWrap to selected clip",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reveal Expression Errors",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE jumps to properties whose expressions errored. No expression engine. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reveal in Explorer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE opens the OS file browser at the source file. Browser sandbox can't. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Create",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu of conversions/generators: Create Shapes from Text, Create Masks from Text, Create Shapes from Vector Layer, Convert to Editable Text, Pre-compose, and (25.2+) Create 3D Layer Instance. All depend on shapes/masks/text-outlining/precomp engines we don't have. Buildable-later/skip per item; the only near-term one is Pre-compose (still buildable-later for us).",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Create Shapes from Text",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE outlines each glyph of a text layer into editable vector shape layers. Needs a font-to-path + shape engine. Buildable-later (large).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create Masks from Text",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE converts glyph outlines into mask paths on a new solid. Needs font-to-path + masks. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create Shapes from Vector Layer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE converts an imported Illustrator/EPS/SVG layer into native editable shapes. No vector import/engine. Buildable-later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Convert to Editable Text",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE turns a (Premiere/imported) caption or outlined text back into an editable AE text layer. Our text clips are already editable strings; nothing to convert. Skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pre-compose…",
      "shortcut": "Ctrl+Shift+C",
      "aeShortcut": "Ctrl+Shift+C",
      "behavior": "AE nests the selected layers into a new sub-composition. Our project == one timeline with no nesting. Buildable-later (large) — needs nested compositions as a media type the renderer can rasterize. Mirrors the standalone 'Pre-compose' item below.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create 3D Layer Instance",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE 25.2 (April 2025) addition: lets you apply 2D effects to a 3D model layer via an instance. 3D-only. Skip — greyed.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Camera",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for camera ops (Set Focus Distance to Layer, Link Focus Distance to Layer/Point of Interest, Create Stereo 3D Rig, etc.). 3D camera concepts only. Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Light",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE submenu for light ops, including 25.2's 'Control Light with Camera' and 'Create Environment Light Background Layer'. 3D lighting only. Skip — greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Auto-trace…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE traces a layer's alpha or luminance into animated mask paths (for rotoscope-style outlines). Needs an edge-trace-to-path engine + masks. Buildable-later (large). Greyed for now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Pre-compose…",
    "shortcut": "Ctrl+Shift+C",
    "aeShortcut": "Ctrl+Shift+C",
    "behavior": "AE collapses selected layers into a new nested comp, replacing them with one precomp layer — the core of grouping/organizing in AE. Our project is a single flat timeline. Buildable-later (large): introduce nested compositions as a renderable media type (rasterize the sub-timeline, then treat it as a clip). High future value for grouping + reusing effect stacks.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Scene Edit Detection",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE analyzes a flattened/pre-cut footage layer and splits it at detected cut points (adding layer markers or actually cutting), great for re-editing exported sequences. We already cut clips (doSplit) but have no shot-boundary detector. Buildable-later: a server-side scene-detect (ffmpeg select='gt(scene,...)' or PySceneDetect) returning cut frames, then call doSplit() at each — moderate, server work required; the client splice is trivial.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "effect",
  "title": "Effect",
  "items": [
   {
    "label": "Effect Controls",
    "shortcut": "F3",
    "aeShortcut": "F3",
    "behavior": "AE: opens/focuses the Effect Controls panel listing every applied effect and its parameters for the selected layer. LePrince: focus and refresh our Properties/Inspector pane, scrolling to the Effects group for the selected clip.",
    "feasibility": "exists",
    "mapsTo": "refreshInspector()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Last Effect",
    "shortcut": "Ctrl+Alt+Shift+E",
    "aeShortcut": "Ctrl+Alt+Shift+E",
    "behavior": "AE: re-applies the most recently applied effect to the current selection without browsing the menu. LePrince: no effect stack to re-apply; could re-apply the last-used filter tweak/preset to the selected clip. Low priority.",
    "feasibility": "buildable-now",
    "mapsTo": "lastFilterPreset memory -> apply to selected clip",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Remove All",
    "shortcut": "Ctrl+Shift+E",
    "aeShortcut": "Ctrl+Shift+E",
    "behavior": "AE: strips every effect off the selected layer(s) at once. LePrince: reset the 5 filters to KDEF defaults (fxBlur:0, fxBright:1, fxContrast:1, fxSat:1, fxHue:0) on selected clips and clear keyframes on those fields.",
    "feasibility": "buildable-now",
    "mapsTo": "new resetFilters(clip) -> write KDEF + drawFrame()/refreshInspector()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Manage Effects...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: dialog to enable/disable installed effects and plug-ins (hide third-party packs, recover from a crashing plug-in). LePrince: no plug-in system; nothing to manage.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "3D Channel",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: readers for 3D-render channels in multichannel EXR/3D passes (depth, ID, cryptomatte, etc.). LePrince has no 3D render channels.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "3D Channel Extract",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: extracts auxiliary channels (depth/normals) from a 3D render. No 3D passes in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cryptomatte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: ID-based matte extraction from Cryptomatte EXR metadata. No EXR/3D in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Depth Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: builds a matte from a 3D depth channel. No depth channel in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Depth of Field",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: depth-driven blur using a 3D depth pass. No depth pass in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "EXtractoR",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: extracts arbitrary named channels from multichannel EXR. No EXR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fog 3D",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: depth-based fog using a 3D depth channel. No depth channel in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "ID Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: isolates objects via an object/material ID channel. No ID channel in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "IDentifier",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: visualizes ID channel values from a 3D render. No ID channel in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Material Edge",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: edge detection from a 3D material/ID pass. No 3D pass in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Audio",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: real-time audio DSP on audio layers (EQ, reverb, delay, etc.). LePrince has volume + fades but no DSP graph; a WebAudio chain could host these later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Backwards",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: plays audio in reverse. LePrince: would need a reversed WebAudio buffer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bass & Treble",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simple low/high shelf tone control. LePrince: WebAudio BiquadFilter shelves; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Delay",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: echoes the audio with feedback. LePrince: WebAudio DelayNode; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Flange & Chorus",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: modulated-delay flange/chorus. LePrince: WebAudio modulated delay; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "High-Low Pass",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: high-pass/low-pass filtering. LePrince: WebAudio BiquadFilter; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Modulator",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: amplitude/frequency modulation (vibrato/tremolo). LePrince: WebAudio LFO; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Parametric EQ",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: multi-band parametric equalizer. LePrince: WebAudio biquad band stack; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reverb",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: room/space reverberation. LePrince: WebAudio ConvolverNode; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Stereo Mixer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: pan/mix left-right channels. LePrince: WebAudio StereoPannerNode; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tone",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: synthesizes a tone (sine/triangle/etc.). LePrince: WebAudio OscillatorNode; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Blur & Sharpen",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: blur and sharpen filters. LePrince: contains our flagship mapping — Gaussian Blur maps to the existing fxBlur (CSS blur) filter.",
    "feasibility": "exists",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Bilateral Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: edge-preserving smoothing blur. LePrince: needs a custom canvas/WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Camera Lens Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: realistic lens (iris-shaped bokeh) blur. LePrince: heavy WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Camera-Shake Deblur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: AI-assisted deblur of camera-shake. LePrince: out of scope for canvas.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Cross Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: independent horizontal/vertical blur. LePrince: simple separable blur; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Radial Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: spin/zoom radial blur. LePrince: WebGL radial pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Radial Fast Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: faster radial blur variant. LePrince: WebGL radial pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Vector Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blur along a vector/displacement map. LePrince: needs displacement engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Channel Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-channel blur amounts. LePrince: needs channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Compound Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blur driven by a control layer's luminance. LePrince: needs control-layer model; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Directional Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: motion blur along an angle. LePrince: WebGL directional pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fast Box Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fast iterated box blur (default modern blur). LePrince: could approximate, but fxBlur (Gaussian) already covers the common need; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gaussian Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: classic Gaussian blur with adjustable radius. LePrince: maps directly to the existing fxBlur filter (CSS blur(px)), keyable via the Blur inspector row.",
      "feasibility": "exists",
      "mapsTo": "fxBlur",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Radial Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: spin/zoom blur about a center point. LePrince: WebGL radial pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sharpen",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: increases edge contrast (unsharp-style). LePrince: convolution canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Smart Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blurs while preserving edges by threshold. LePrince: custom pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Unsharp Mask",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: sharpening via subtracted blur. LePrince: convolution pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Boris FX Mocha",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: third-party Mocha AE planar tracker / roto, exported back as corner-pin or mask data. LePrince has no planar tracker, masks, or corner-pin model.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Mocha AE",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: launches the Mocha planar tracking UI. No tracker/mask pipeline in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Channel",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: per-channel and alpha math/compositing. LePrince: Invert is trivial; the rest need a channel-math engine. Note AE's Blend effect overlaps our clip-level blend dropdown.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Alpha Levels",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: remaps alpha black/white/gamma. LePrince: needs alpha-channel editing; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Arithmetic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-channel arithmetic operations. LePrince: channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Blend",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blends the layer with another layer by mode/amount. LePrince has a clip-level blend dropdown (c.blend), not a stackable effect; conceptually covered.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Calculations",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: combine channels from two layers via blend math. LePrince: channel-math engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Composite",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: composites the layer with itself using a blend mode. LePrince: covered by blend dropdown; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Channel Combiner",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts/recombines channels (e.g. RGB to HLS). LePrince: channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Compound Arithmetic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: arithmetic blend with a second layer. LePrince: channel-math engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Invert",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: inverts colors/channels. LePrince: trivial canvas invert() or per-pixel pass; a good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minimax",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: spreads min/max channel values (erode/dilate). LePrince: morphology pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove Color Matting",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: removes fringe from premultiplied edges. LePrince: needs premult handling; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Set Channels",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: sets channels from other layers' channels. LePrince: channel-math engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Set Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: replaces alpha with a channel of another layer. LePrince: needs matte model; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Shift Channels",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: swaps/redirects channels. LePrince: channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Solid Composite",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: composites a solid color behind/with the layer via mode. LePrince: needs solid layer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "CINEMA 4D",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: Cineware live link to a Maxon Cinema 4D scene; requires the C4D renderer and Dynamic-Link-style pipeline. Out of scope for a browser NLE.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "CINEWARE",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: renders a live C4D scene inside the comp. No C4D renderer in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Color Correction",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: tonal/color grading effects. LePrince: contains two real mappings — Brightness & Contrast (fxBright/fxContrast) and Hue/Saturation (fxSat/fxHue) — plus several buildable-later tone ops.",
    "feasibility": "exists",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Auto Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: auto color balance via image stats. LePrince: needs histogram analysis; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Auto Contrast",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: auto-stretches contrast from image stats. LePrince: histogram pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Auto Levels",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps lightest/darkest per channel to white/black, redistributing midtones (good for deflicker). LePrince: histogram pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Black & White",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts to grayscale with per-color-channel control. LePrince: a saturate(0) shortcut or weighted desaturation pass; later (fxSat:0 partially covers it).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Brightness & Contrast",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adjusts overall brightness and contrast. LePrince: maps directly to existing fxBright (CSS brightness) + fxContrast (CSS contrast), both keyable via Bright/Contrast inspector rows.",
      "feasibility": "exists",
      "mapsTo": "fxBright + fxContrast",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Broadcast Colors",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: clamps colors to broadcast-safe levels. LePrince: not relevant for web canvas output.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Color Neutralizer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: neutralizes color casts per shadow/mid/high. LePrince: tone-curve engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Color Offset",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: phase-shifts each RGB channel independently. LePrince: channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Kernel",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: applies a custom 3x3 convolution kernel. LePrince: convolution pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Toner",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps shadows/mids/highlights to chosen colors (duo/tri/quad-tone). LePrince: gradient-map pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shifts hue/lightness/saturation of a selected color range. LePrince: keyed color-range pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Change to Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: replaces one color with another with tolerance. LePrince: keyed color-replace pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Channel Mixer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: rebuilds each output channel from a mix of input channels. LePrince: channel-math pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Balance",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shifts shadow/mid/highlight color balance. LePrince: tone-curve engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Balance (HLS)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: hue/lightness/saturation balance. LePrince: partly overlaps fxHue/fxSat; full version later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Link",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: tints a layer using the average color of another layer. LePrince: needs control-layer sampling; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Stabilizer",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: holds color steady across frames by sample points. LePrince: needs per-frame sampling; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Colorama",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: psychedelic gradient remapping of brightness to a color ramp. LePrince: gradient-map pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Curves",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-channel tonal curve editor. LePrince: LUT/curve canvas pass plus a curve UI; significant; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Equalize",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: histogram equalization. LePrince: histogram pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Exposure",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: photographic exposure/offset/gamma in stops. LePrince: a refined brightness math on top of fxBright; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gamma/Pedestal/Gain",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-channel gamma, black-point, and gain. LePrince: tone-curve pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Hue/Saturation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: rotates hue and scales saturation/lightness. LePrince: maps to existing fxHue (CSS hue-rotate) + fxSat (CSS saturate), both keyable via Hue/Saturate inspector rows.",
      "feasibility": "exists",
      "mapsTo": "fxHue + fxSat",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Leave Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: desaturates everything except a chosen color. LePrince: keyed selective-desaturate pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Levels",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: input/output black-white points and gamma per channel. LePrince: tone-curve pass + UI; later (high value).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Levels (Individual Controls)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: Levels with separate sliders per channel. LePrince: same tone engine as Levels; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Lumetri Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: full grading panel (basic/creative/curves/wheels/LUT). LePrince: a large grading subsystem; out of near-term scope.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Photo Filter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simulates warming/cooling lens filters at a density. LePrince: color-overlay/tint pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "PS Arbitrary Map",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: applies a Photoshop arbitrary curve map (.amp). LePrince: needs .amp parsing + LUT; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Selective Color",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adjusts CMYK amounts within named color ranges. LePrince: keyed color-range pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Shadow/Highlight",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: independently lifts shadows and recovers highlights. LePrince: tone-curve pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tint",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps black and white points to two chosen colors (duotone). LePrince: monochrome + 2-color map canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tritone",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps shadows/mids/highlights to three colors. LePrince: 3-color gradient-map pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Vibrance",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: smart saturation that protects skin tones and already-saturated pixels. LePrince: weighted saturation pass; later (fxSat is the blunt version).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Distort",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: geometric and warp distortions. LePrince: a few (Mirror, Offset, Transform) are simple canvas passes; mesh warps and Warp Stabilizer are out of scope.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Bezier Warp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: warps the layer with a Bezier-edge cage. LePrince: needs mesh/UV warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bulge",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: bulges/pinches the image around a point. LePrince: WebGL displacement pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Bend It",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: bends a region between two points. LePrince: mesh warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Bender",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: bends the whole layer along an axis. LePrince: mesh warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Blobbylize",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blobby displacement from a map. LePrince: displacement engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Flo Motion",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: dual-knot flow/pinch distortion. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Griddler",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: tiles the image into a moving grid. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Lens",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fisheye lens distortion. LePrince: WebGL lens pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Page Turn",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: page-curl peel of the layer. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Power Pin",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: 4-corner perspective pin with extras. LePrince: needs corner-pin warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Ripple Pulse",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: expanding ripple pulse from a center. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Slant",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shears/slants the layer. LePrince: simple affine shear canvas transform; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Smear",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: smears between two points. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Split",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: splits the image apart between two points. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Split 2",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: variant split with independent points. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Tiler",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: repeats the layer in a scalable tile. LePrince: canvas tiling pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Corner Pin",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: pins the four corners for perspective placement. LePrince: needs corner-pin warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Detail-preserving Upscale",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: high-quality upscale preserving edges. LePrince: out of scope for canvas.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Displacement Map",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: displaces pixels using another layer's channels. LePrince: displacement engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Liquify",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: push/twirl/pucker brush warping. LePrince: needs brush + mesh warp; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Magnify",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: localized magnifier lens. LePrince: WebGL lens pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mesh Warp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: grid of Bezier patches to deform regions. LePrince: mesh warp engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mirror",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: reflects the image across a line. LePrince: easy canvas flip/reflect pass; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Offset",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: pans/wraps the image within its bounds. LePrince: canvas wrap-draw pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Optics Compensation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds/removes lens barrel distortion. LePrince: WebGL lens pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Polar Coordinates",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts between rectangular and polar space. LePrince: WebGL coordinate pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reshape",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: morphs between mask shapes. LePrince: needs masks; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Ripple",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: concentric animated ripples. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Rolling Shutter Repair",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: corrects rolling-shutter skew. LePrince: out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Smear",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: mask-based smear distortion. LePrince: needs masks; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Spherize",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: wraps the image onto a sphere bulge. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Transform",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: an effect that adds extra position/scale/rotation/skew/opacity with anchor. LePrince already has clip transform props (posX/posY/scale/rotation, keyable); overlaps strongly.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Turbulent Displace",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fractal-noise turbulent warping (water/flags). LePrince: noise-displacement engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Twirl",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: twists the image around a center. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Warp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: preset warps (arc, bulge, fisheye, etc.). LePrince: WebGL warp pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Warp Stabilizer VFX",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: analyzes and stabilizes shaky footage. LePrince: requires tracking/analysis pipeline; out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Wave Warp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animated sine/triangle wave distortion. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Expression Controls",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: adds parameter controls (sliders, checkboxes, color, etc.) for expressions to read. Meaningless without an expressions engine, which LePrince lacks.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "3D Point Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a 3D point param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Angle Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes an angle param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Checkbox Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a boolean param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a color param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dropdown Menu Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a dropdown param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Layer Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a layer-reference param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Point Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a 2D point param for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Slider Control",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: exposes a numeric slider for expressions. No expressions in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Generate",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: synthesizes new pixels (gradients, shapes, light, fills). LePrince: Fill/Gradient Ramp/Checkerboard/Grid are achievable canvas generators; light/lens/audio renderers are out of scope.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "4-Color Gradient",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: four animatable color zones blended across the layer. LePrince: canvas gradient generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Advanced Lightning",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keyframable CG lightning bolts. LePrince: bespoke renderer; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio Spectrum",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: draws a spectrum from an audio layer. LePrince: WebAudio FFT + canvas draw; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Audio Waveform",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: draws a waveform from an audio layer. LePrince: WebAudio + canvas draw; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Beam",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animated light beam between two points. LePrince: canvas line/glow generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Glue Gun",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: paints glue-like blobs along a path. LePrince: bespoke; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Light Burst 2.5",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: radial light burst from image highlights. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Light Rays",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: god-ray light streaks. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Light Sweep",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: sweeping highlight band across the layer. LePrince: canvas gradient sweep; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Threads",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: woven thread/fabric texture overlay. LePrince: texture generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cell Pattern",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animated cellular noise patterns. LePrince: procedural generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Checkerboard",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: generates a checkerboard pattern. LePrince: easy canvas generator; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Circle",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: draws a solid/ring circle. LePrince: easy canvas generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Ellipse",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: draws an ellipse ring/fill. LePrince: easy canvas generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Eyedropper Fill",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fills the layer with a color sampled from a point. LePrince: canvas sample + fill; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fill",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fills the layer/mask with a solid color. LePrince: trivial canvas fill; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fractal",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: renders Mandelbrot/Julia fractals. LePrince: WebGL fractal generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gradient Ramp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: linear/radial color ramp generator. LePrince: easy canvas gradient generator; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Grid",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: generates a customizable grid. LePrince: easy canvas generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Lens Flare",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simulates a photographic lens flare. LePrince: bespoke renderer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Paint Bucket",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: flood-fills a region by tolerance. LePrince: flood-fill pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Radio Waves",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: emits expanding concentric waves. LePrince: canvas animated generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scribble",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: fills a mask with animated scribble strokes. LePrince: needs masks; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Stroke",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: strokes along a mask path. LePrince: needs masks/paths; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Vegas",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animated running lights along edges/paths. LePrince: needs paths; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Write-on",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animated brush write-on along keyframed positions. LePrince: needs paint engine; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Immersive Video",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: 360/VR equirectangular operations (blur, glow, sphere/plane conversion, etc.). LePrince is flat 2D with no VR projection.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "VR Converter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts between VR projection formats. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Digital Glitch",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: VR-aware glitch. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR De-Noise",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: VR-aware denoise. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: seam-aware blur for 360 footage. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Chromatic Aberrations",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: VR-aware chromatic aberration. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Color Gradients",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: VR-aware gradients. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Fractal Noise",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: seam-aware fractal noise. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Glow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: seam-aware glow. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Plane to Sphere",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps flat content onto a 360 sphere. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Rotate Sphere",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: rotates a 360 sphere. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Sharpen",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: seam-aware sharpen. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "VR Sphere to Plane",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: re-projects 360 to a flat view. No VR in LePrince.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Keying",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: chroma/luma keying to pull mattes. LePrince: a basic Color/Luma Key is a feasible per-pixel canvas pass and genuinely useful for a compositor — the highest-value buildable-later here.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Advanced Spill Suppressor",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: removes green/blue spill after keying. LePrince: after a keyer exists; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Simple Wire Removal",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: hides rigging wires between two points. LePrince: niche; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Difference Key",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: advanced two-matte color-difference keyer. LePrince: complex keyer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Key",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys out a single color with tolerance. LePrince: simple per-pixel canvas key; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Range",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys across a color range in Lab/YUV/RGB. LePrince: range keyer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Difference Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys by difference from a clean plate. LePrince: needs reference frame; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Extract",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys based on a luminance/channel range. LePrince: luma keyer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Inner/Outer Key",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: extracts an object using inside/outside mask paths. LePrince: needs masks; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Key Cleaner",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: cleans up matte edges/temporal noise after keying. LePrince: after a keyer exists; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Keylight (1.2)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: industry-standard third-party chroma keyer (The Foundry). LePrince: third-party; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Linear Color Key",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys with a linear tolerance falloff. LePrince: per-pixel keyer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Luma Key",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: keys out by luminance threshold. LePrince: easy per-pixel luma key; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Spill Suppressor",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: classic spill removal. LePrince: after a keyer exists; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Matte",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: refines edges of an existing alpha/matte (choke/refine). Depends on a matte/mask model LePrince does not yet have.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Matte Choker",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: chokes/spreads a matte to seal holes. LePrince: after mattes exist; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "mocha shape",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: imports Mocha shape data as a matte. LePrince: third-party/no Mocha; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Refine Hard Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: refines a hard-edged matte. LePrince: after mattes exist; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Refine Soft Matte",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: refines soft/hair matte edges. LePrince: after mattes exist; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Simple Choker",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simple matte choke amount. LePrince: after mattes exist; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Noise & Grain",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: procedural noise/grain add and removal. LePrince: Add Grain/Noise is an easy canvas overlay; Fractal Noise is a popular generator. Strong phase-2 candidates.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Add Grain",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: synthesizes filmic grain. LePrince: canvas noise-overlay pass; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Dust & Scratches",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: reduces small defects via median-like filtering. LePrince: median pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Fractal Noise",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: extremely versatile fractal/Perlin noise generator. LePrince: WebGL/canvas noise generator; later (high value).",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Match Grain",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: samples and matches grain from another layer. LePrince: needs sampling; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Median",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: median filter (denoise/posterize look). LePrince: median canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Median (Legacy)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: older median implementation kept for compatibility. LePrince: skip in favor of modern Median.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Noise",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds random RGB noise. LePrince: easy canvas noise pass; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Noise Alpha",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds noise to the alpha channel. LePrince: needs alpha editing; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Noise HLS",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds noise in HLS space. LePrince: HLS noise pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Noise HLS Auto",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animating HLS noise. LePrince: HLS noise pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Remove Grain",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: analyzes and removes grain/noise. LePrince: denoise is heavy; later/skip.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Turbulent Noise",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: faster non-tiling fractal noise variant. LePrince: noise generator; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Obsolete",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: deprecated effects retained only so legacy projects still open; Adobe greys/deprioritizes them. Never expose in a new app.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Basic 3D",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: legacy pseudo-3D rotation, superseded. LePrince: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Basic Text",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: legacy text generator, superseded by text layers. LePrince: skip (we have real text clips).",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Lightning",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: legacy lightning, superseded by Advanced Lightning. LePrince: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Path Text",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: legacy text-on-path, superseded by text layers. LePrince: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reduce Interlace Flicker",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: legacy interlace deflicker. LePrince: irrelevant for progressive web output; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gaussian Blur (Legacy)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: old Gaussian blur kept for compatibility. LePrince: skip; use the fxBlur mapping instead.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Perspective",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: pseudo-3D shading and shadows. LePrince: Drop Shadow maps cleanly to canvas/CSS drop-shadow and is high-value for text/clips; the CC 3D items are out of scope.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "3D Camera",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: integrates a tracked 3D camera. LePrince: no 3D camera; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "3D Glasses",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: combines left/right views into stereo 3D. LePrince: no stereo; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bevel Alpha",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds a chiseled bevel from the alpha edge. LePrince: edge-bevel canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bevel Edges",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: bevels the rectangular layer edges. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Cylinder",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: wraps the layer onto a 3D cylinder. LePrince: WebGL 3D; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Environment",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: maps an environment for reflections. LePrince: WebGL 3D; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Sphere",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: wraps the layer onto a 3D sphere. LePrince: WebGL 3D; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Spotlight",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: casts a spotlight cone onto the layer. LePrince: canvas gradient pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Drop Shadow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: casts an offset, blurred shadow from the layer alpha. LePrince: maps cleanly to canvas/CSS drop-shadow; high-value for text/clips; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Radial Shadow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shadow cast from a point light. LePrince: canvas shadow pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sided",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: lets a 3D layer show different content front/back. LePrince: no 3D layers; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Simulation",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: particle and physics simulators (rain, snow, shatter, foam, etc.). Far beyond a 2D canvas NLE's scope.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Card Dance",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: splits a layer into animated cards driven by a control layer. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Caustics",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simulates underwater caustic light. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Ball Action",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: turns the layer into animated balls/spheres. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Bubbles",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: generates floating bubbles. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Drizzle",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: ripple-on-water raindrops. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Hair",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simulated hair/fur. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Mr. Mercury",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: metallic/mercury blob particle system. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Particle Systems II",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: 2D particle emitter. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Particle World",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: full 3D particle world emitter. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Pixel Polly",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shatters the layer into flying polygons. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Rainfall",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: realistic falling rain. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Snowfall",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: realistic falling snow. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Star Burst",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: starfield burst particles. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Foam",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: physically simulated flowing/popping bubbles. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Particle Playground",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: rule-based 2D particle generator. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Shatter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: explodes the layer into 3D shards. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Wave World",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: simulates a water surface that drives Caustics. Out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Stylize",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: artistic/stylization filters. LePrince: Mosaic, Posterize, Find Edges, Glow, Threshold, and CC Vignette are viable canvas/WebGL passes and crowd-pleasers; the rest are out of scope.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Brush Strokes",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: painterly brush-stroke look. LePrince: bespoke pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cartoon",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: posterized cel-shaded look with edges. LePrince: edge+quantize pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Block Load",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: progressive block-loading reveal. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Burn Film",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: burning-film hole effect. LePrince: bespoke; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Glass",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: glassy displacement/lighting from a bump. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC HexTile",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: hexagonal tiling. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Kaleida",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: kaleidoscope mirroring. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Mr. Smoothie",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: smears colors along a flow map. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Plastic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: plastic shading from a bump map. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC RepeTile",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: repeats/extends edges in tiles. LePrince: canvas tile pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Threshold",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: luminance threshold to black/white. LePrince: easy per-pixel pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Threshold RGB",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-channel RGB thresholding. LePrince: per-pixel pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Vignette",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: darkens/brightens toward the frame edges. LePrince: easy radial gradient overlay; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Emboss",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: emboss while keeping color. LePrince: convolution pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Emboss",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: relief emboss from edges. LePrince: convolution pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Find Edges",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: highlights edges (pencil-sketch look). LePrince: edge-detect convolution; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Glow",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blooms bright areas with a soft glow. LePrince: blur+screen composite pass; high value; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Mosaic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: pixelates into colored blocks. LePrince: easy downsample canvas pass; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Motion Tile",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: tiles the layer across the frame with phase. LePrince: canvas tile pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Posterize",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: reduces the number of tonal levels. LePrince: easy per-pixel quantize; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Roughen Edges",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: roughens alpha edges with noise. LePrince: needs alpha-edge processing; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scatter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: randomly displaces pixels. LePrince: noise-displacement pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Strobe Light",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: periodically flashes/inverts frames. LePrince: per-frame toggle pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Texturize",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: embosses another layer's texture onto this one. LePrince: needs control layer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Threshold",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: hard luminance threshold to pure black/white. LePrince: easy per-pixel pass; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Text",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: generates dynamic text (counters, timecode) onto a layer. LePrince has real text clips (addText()); these effect-generated strings could ride on that model.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Numbers",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: generates animatable numbers/counters. LePrince: could drive a text clip's content; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Timecode",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: burns in a running timecode/frame counter. LePrince: could compute from playhead into a text clip; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Time",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: temporal effects (frame blending, echo, retime). LePrince: needs a frame-history buffer; Posterize Time is the only cheap one. Clip speed/retime is a timeline feature, not this menu.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "CC Force Motion Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: synthesizes motion blur by blending sub-frames. LePrince: needs sub-frame render; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Wide Time",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: echoes frames forward/backward in time. LePrince: needs frame buffer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Echo",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: blends multiple time-offset frames (trails). LePrince: needs frame buffer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Pixel Motion Blur",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: optical-flow motion blur. LePrince: out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Posterize Time",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: snaps playback to a lower frame rate (stutter). LePrince: cheap playhead-quantize trick; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time Difference",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: shows difference between frames over time. LePrince: needs frame buffer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time Displacement",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: displaces pixels in time using a map. LePrince: needs frame buffer; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Timewarp",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: high-quality variable retiming with frame blending. LePrince: out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Transition",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: per-layer transition reveals driven by a Transition Completion parameter. LePrince already has clip-edge transIn/transOut (a different model); AE-style wipes are buildable-later canvas shaders.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Block Dissolve",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: dissolves via random blocks. LePrince: canvas wipe pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Card Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: flips a grid of cards to reveal. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Glass Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: melts one layer into another. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Grid Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: grid-cell wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Image Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: gradient-map-driven wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Jaws",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: zig-zag jaws wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Light Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: expanding light-edge wipe. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Line Sweep",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: angled line sweep wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Radial ScaleWipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: radial scaling wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Scale Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: directional scaling/stretch wipe. LePrince: canvas pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Twister",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: twisting page reveal. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC WarpoMatic",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: difference-driven warp dissolve. LePrince: WebGL pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Gradient Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: reveals based on a gradient layer's luminance. LePrince: canvas luma-wipe pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Iris Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: polygonal iris open/close. LePrince: canvas mask pass; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Linear Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: straight-edge directional wipe. LePrince: easy canvas clip wipe; good early add.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Radial Wipe",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: clock-style radial wipe. LePrince: canvas arc wipe; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Venetian Blinds",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: slatted blinds wipe. LePrince: canvas stripe wipe; later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Utility",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: pipeline/colorspace utilities (LUTs, Cineon, color-profile/OCIO conversion, HDR compander). The OCIO/ACES/HDR items are the 2025/2026 color-management additions. Out of scope for a browser canvas NLE.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Apply Color LUT",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: applies a 1D/3D LUT (.cube etc.). LePrince: LUT engine is heavy; skip for now.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "CC Overbrights",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: visualizes over-range (HDR) values. LePrince: no HDR pipeline; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Cineon Converter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: log-to-linear Cineon conversion. LePrince: out of scope; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Color Profile Converter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts between ICC color profiles. LePrince: no color management; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Compander",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: compresses/expands tonal range. LePrince: out of scope; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Grow Bounds",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: enlarges the layer's working bounds so effects aren't clipped. LePrince: no per-layer bounds clipping model; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "HDR Compander",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: compresses HDR for 8/16-bit effects then expands. LePrince: no HDR; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "HDR Highlight Compression",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: compresses over-range highlights into displayable range. LePrince: no HDR; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "OpenColorIO",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: OCIO/ACES color-managed transform (2025/2026 color-management addition). LePrince: no color management; skip.",
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
  "id": "animation",
  "title": "Animation",
  "items": [
   {
    "label": "Save Animation Preset…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: saves selected properties, keyframes, expressions and effects to an .ffx preset file for reuse. Ours: snapshot the selected clip's keyable transform/filter fields + blend + transIn/Out to a JSON preset in localStorage.",
    "feasibility": "buildable-now",
    "mapsTo": "new saveAnimPreset() → JSON snapshot of selClip keyable fields to localStorage",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Apply Animation Preset…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: opens a file browser to apply a saved .ffx onto the selected layer(s). Ours: paste a saved JSON preset's fields onto the selected clip, offsetting keyframe times to the playhead.",
    "feasibility": "buildable-now",
    "mapsTo": "new applyAnimPreset() → write preset fields onto selClip, reTime keys to playhead",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Recent Animation Presets",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: submenu listing the last applied presets for one-click reuse. Ours: dynamic submenu populated from the localStorage preset MRU list (empty until presets exist).",
    "feasibility": "buildable-now",
    "mapsTo": "dynamic submenu from localStorage preset MRU",
    "separator_after": false,
    "submenu": [
     {
      "label": "(no recent presets)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Placeholder shown until presets are saved; replaced at runtime by the most-recently-used preset entries.",
      "feasibility": "buildable-now",
      "mapsTo": "runtime-populated MRU items",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Browse Presets…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: opens Adobe Bridge to visually browse bundled/installed presets. Ours: skip Bridge; repurpose as a local 'Manage Presets…' dialog (list/rename/delete saved JSON presets).",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Add Keyframe",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: with a property selected, adds a keyframe at the current time using the property's value (labelled contextually, e.g. 'Add Position Keyframe'). Ours: insert a keyframe at the playhead for the inspector-focused field of the selected clip, default easing 'ease'.",
    "feasibility": "exists",
    "mapsTo": "toggleKeyHere(c,field)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Toggle Hold Keyframe",
    "shortcut": "Ctrl+Alt+H",
    "aeShortcut": "Ctrl+Alt+H",
    "behavior": "AE: converts the keyframe(s) at the current time to/from Hold interpolation (value holds constant then jumps). Ours: flip the key at the playhead between its prior easing and 'hold' — the engine already interprets 'hold'.",
    "feasibility": "buildable-now",
    "mapsTo": "set k.e='hold' on key at playhead (engine already supports hold easing)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Keyframe Interpolation…",
    "shortcut": "Ctrl+Alt+K",
    "aeShortcut": "Ctrl+Alt+K",
    "behavior": "AE: dialog to set temporal and spatial interpolation (Linear/Bezier/Continuous/Auto/Hold) and Roving for selected keyframes. Ours: reduced popover that sets the key's easing enum (ease/in/out/hold); no spatial bezier or roving.",
    "feasibility": "buildable-now",
    "mapsTo": "new keyInterpDialog() → sets k.e to ease|in|out|hold",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Keyframe Velocity…",
    "shortcut": "Ctrl+Shift+K",
    "aeShortcut": "Ctrl+Shift+K",
    "behavior": "AE: dialog for precise incoming/outgoing speed and influence (%) per keyframe. Ours: our easing is a discrete enum, not a continuous speed/influence curve, so true velocity needs a bezier-handle model the data model lacks.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Keyframe Assistant",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: submenu of keyframe automation tools (audio→keyframes, sequence layers, exponential scale, time-reverse, easy eases). Ours: ship the three Easy Eases, Time-Reverse, and Sequence Layers; the rest depend on missing subsystems.",
    "feasibility": "buildable-now",
    "mapsTo": "submenu of keyframe assistants",
    "separator_after": true,
    "submenu": [
     {
      "label": "Convert Audio to Keyframes",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: analyzes work-area audio amplitude and writes Left/Right/Both Channels sliders as keyframes on a null. Ours: Web Audio could supply amplitude, but there is no Null/Slider layer to hold the result yet.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Convert Expression to Keyframes",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: bakes the current expression on a property into keyframes. Ours: no expression evaluator exists, so there is nothing to bake.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Create Keyframes from Data",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: imports data-driven keyframes (and historically RPF Camera Import) from JSON/CSV/camera data. Ours: no data-layer or 3D-camera pipeline; out of scope.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Sequence Layers…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: auto-staggers selected layers in time with optional crossfade overlap. Ours: offset the start of selected clips sequentially and optionally set transIn/transOut overlaps — maps cleanly onto our timeline.",
      "feasibility": "buildable-now",
      "mapsTo": "new sequenceLayers() → stagger selected clip.start (+ optional transIn/Out overlap)",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Exponential Scale",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: converts a linear scale keyframe pair into exponential for a natural zoom feel. Ours: would resample the scale-field keyframes; doable but niche and needs a key-resampling utility.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Time-Reverse Keyframes",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: reverses the time order of the selected keyframes. Ours: mirror each selected key's t around its span (t' = maxT - (t - minT)) and re-sort.",
      "feasibility": "buildable-now",
      "mapsTo": "new timeReverseKeys(c,field) → mirror key.t around span and re-sort",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Easy Ease",
      "shortcut": "F9",
      "aeShortcut": "F9",
      "behavior": "AE: applies Bezier ease in and out (33% influence) to selected keyframes. Ours: set the key's easing to 'ease' (our smooth mode) — direct mapping onto the existing engine enum.",
      "feasibility": "exists",
      "mapsTo": "toggleKeyHere(c,field) / set k.e='ease'",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Easy Ease In",
      "shortcut": "Shift+F9",
      "aeShortcut": "Shift+F9",
      "behavior": "AE: applies ease on the incoming side only. Ours: set the key's easing to 'in'.",
      "feasibility": "exists",
      "mapsTo": "set k.e='in' on selected key (engine supports 'in')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Easy Ease Out",
      "shortcut": "Ctrl+Shift+F9",
      "aeShortcut": "Ctrl+Shift+F9",
      "behavior": "AE: applies ease on the outgoing side only. Ours: set the key's easing to 'out'.",
      "feasibility": "exists",
      "mapsTo": "set k.e='out' on selected key (engine supports 'out')",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Animate Text",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: submenu adding a property Text Animator (Position, Scale, Opacity, Tracking, Character Offset, etc.) with a Range Selector for per-character animation. Ours: we can keyframe a whole text block now, but AE's per-character animator/selector model does not exist in our data.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Anchor Point",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: adds an animator that offsets each character's anchor point. Ours: no per-character animator model; whole-clip transform keyframing exists instead.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Position",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-character position animator. Ours: whole-text posX/posY are keyable today; per-character is later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Scale",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-character scale animator. Ours: whole-text scale keyable today; per-character is later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Rotation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-character rotation animator. Ours: whole-text rotation keyable today; per-character is later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Opacity",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: per-character opacity animator (type-on/fade). Ours: whole-text opacity keyable today; per-character is later.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Tracking",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: animates inter-character spacing. Ours: no tracking property on text clips yet.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Character Offset",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: scrambles/cycles character glyphs over time. Ours: no character-offset model; skip near-term.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Add Text Selector",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: adds an additional selector (Range, Wiggly, or Expression) to an existing text animator to scope which characters it affects. Ours: depends on the animator model, which does not exist.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Range",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: selects a contiguous range of characters by start/end/offset. Ours: requires the missing animator model.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Wiggly",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: randomized selector that wiggles selection amount over time. Ours: requires the missing animator model.",
      "feasibility": "buildable-later",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Expression",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: expression-driven selector. Ours: no expression engine and no animator model.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Remove All Text Animators",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: strips every animator and selector from the selected text layer. Ours: meaningless until animators exist; if simple whole-block text keyframing ships, this becomes 'clear text keyframes'.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Add Expression",
    "shortcut": "Alt+Shift+=",
    "aeShortcut": "Alt+Shift+=",
    "behavior": "AE: adds a JavaScript expression to the selected property (stopwatch turns red; value driven procedurally). Ours: no expression evaluator; a sandboxed JS expression engine is a large separate effort — effectively skip near-term.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Separate Dimensions",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: splits Position into independent X/Y (and Z) for separate keyframing. Ours: our model already stores posX and posY as separate keyable fields, so dimensions are permanently separated — render this checked/greyed (no-op).",
    "feasibility": "exists",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Track Camera",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: runs the 3D Camera Tracker (same as Effect > Perspective > 3D Camera Tracker) to solve camera motion and place 3D track points. Ours: no 3D scene or camera solve — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Track in Boris FX Mocha",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: launches the bundled Mocha planar tracker for the selected layer. Ours: external app / planar tracking is out of scope — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Warp Stabilizer VFX",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: applies the Warp Stabilizer effect to smooth shaky footage (background analysis). Ours: no optical-flow/warp pipeline in a canvas NLE — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Track Motion",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: opens the Tracker panel for point tracking (position/rotation/scale/perspective) in the Layer panel. Ours: no tracker engine — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Track Mask",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: tracks a mask shape across frames, keyframing the Mask Path. Ours: masks themselves don't exist yet (buildable-later), and tracking them is further out — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Track this Property",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: tracks footage and applies the result directly to the selected property (streamlined tracking). Ours: depends on the tracker engine — skip.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Reveal Properties with Keyframes",
    "shortcut": "U",
    "aeShortcut": "U",
    "behavior": "AE: in the Timeline, twirls open only properties that have keyframes on the selected layer(s). Ours: filter the inspector (and/or timeline rows) to fields where isKeyed(c,field) is true.",
    "feasibility": "buildable-now",
    "mapsTo": "new revealKeyed() → filter inspector to fields where isKeyed(c,field)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Reveal Properties with Animation",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: reveals properties driven by keyframes or expressions. Ours: identical to 'with Keyframes' since we have no expressions — can collapse the two.",
    "feasibility": "buildable-now",
    "mapsTo": "new revealAnimated() (== revealKeyed(); no expressions)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Reveal All Modified Properties",
    "shortcut": "UU",
    "aeShortcut": "UU",
    "behavior": "AE: reveals every property changed from its default, even without keyframes (double-tap U). Ours: filter the inspector to fields whose value differs from KDEF[field], which the engine already tracks.",
    "feasibility": "buildable-now",
    "mapsTo": "new revealModified() → show fields where value !== KDEF[field]",
    "separator_after": false,
    "submenu": null
   }
  ]
 },
 {
  "id": "view",
  "title": "View",
  "items": [
   {
    "label": "New Viewer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: opens an additional independent viewer panel locked to its own comp/time so you can watch two views at once. Ours: skip — single fixed Program monitor, no second floating viewer (full docking is out of scope). Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Zoom In",
    "shortcut": ".",
    "aeShortcut": ".",
    "behavior": "AE: magnifies the composition viewer one step (render unchanged, only on-screen magnification). Ours: zoom the monitor preview in one step via a monZoom scale on the canvas wrapper; fitScreen() is the natural reset.",
    "feasibility": "buildable-now",
    "mapsTo": "monitor zoom step-in: monZoom scale on #mon, re-clamp on resize",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Zoom Out",
    "shortcut": ",",
    "aeShortcut": ",",
    "behavior": "AE: reduces magnification one step. Ours: inverse of Zoom In on the monitor, sharing the monZoom state.",
    "feasibility": "buildable-now",
    "mapsTo": "monitor zoom step-out, shares monZoom state",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Zoom (Timeline)",
    "shortcut": "= / -",
    "aeShortcut": null,
    "behavior": "Not an AE View-menu item — added for NLE ergonomics. Ours: drives the existing timeline ppf via the #zoom slider, re-rendering the timeline and recentering on the playhead.",
    "feasibility": "exists",
    "mapsTo": "timeline zoom via ppf + #zoom slider",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Resolution",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: sets preview render resolution of the active viewer (Full/Half/Third/Quarter/Custom) to trade quality for speed; never affects final output. Ours: a previewScale knob that composites to an offscreen buffer at the chosen fraction then upscales to fit the monitor.",
    "feasibility": "buildable-now",
    "mapsTo": "previewScale on monitor offscreen composite",
    "separator_after": true,
    "submenu": [
     {
      "label": "Full",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: render every pixel. Ours: previewScale=1, full-res offscreen composite.",
      "feasibility": "buildable-now",
      "mapsTo": "previewScale=1",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Half",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: render at 1/2 for faster previews. Ours: previewScale=0.5.",
      "feasibility": "buildable-now",
      "mapsTo": "previewScale=0.5",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Third",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: render at 1/3. Ours: previewScale=1/3.",
      "feasibility": "buildable-now",
      "mapsTo": "previewScale=0.3333",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Quarter",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: render at 1/4. Ours: previewScale=0.25.",
      "feasibility": "buildable-now",
      "mapsTo": "previewScale=0.25",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Custom...",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: type horizontal/vertical down-sample factors. Ours: small dialog with numeric X/Y down-sample mapping to previewScale.",
      "feasibility": "buildable-now",
      "mapsTo": "custom down-sample dialog -> previewScale",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Use Display Color Management",
    "shortcut": null,
    "aeShortcut": "Shift+/ (numpad)",
    "behavior": "AE: converts comp colors to the monitor's ICC profile so the image looks identical across profiled displays without changing data; on by default. Ours: skip — no ICC pipeline in the browser canvas; color management is out of scope. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Simulate Output",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: per-viewer soft-proof — applies a chosen output color space to the preview then converts back to display space so you can preview the render's look on another device. Ours: skip — requires a color-managed pipeline we lack. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Show Rulers",
    "shortcut": "Ctrl+R",
    "aeShortcut": "Ctrl+R",
    "behavior": "AE: toggles horizontal/vertical rulers along the viewer edges in comp pixel space; drag from a ruler to pull a guide. Ours: draw thin ruler gutters (top+left) over the monitor in canvas space; dragging from one creates a guide; persist view.showRulers.",
    "feasibility": "buildable-now",
    "mapsTo": "overlay rulers on monitor; toggle view.showRulers, redraw in drawFrame()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Panel Background Color",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: sets the viewer pasteboard/background (Default/Black/White/Checkerboard/Custom) so you can judge edges and alpha. Ours: set the monitor letterbox/pasteboard fill used when clearing the canvas before compositing; stored as view.panelBg.",
    "feasibility": "buildable-now",
    "mapsTo": "view.panelBg used when clearing monitor canvas",
    "separator_after": true,
    "submenu": [
     {
      "label": "Default",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE/Ours: theme-default dark pasteboard.",
      "feasibility": "buildable-now",
      "mapsTo": "view.panelBg='default'",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Black",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE/Ours: solid black pasteboard.",
      "feasibility": "buildable-now",
      "mapsTo": "view.panelBg='#000'",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "White",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE/Ours: solid white pasteboard.",
      "feasibility": "buildable-now",
      "mapsTo": "view.panelBg='#fff'",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Checkerboard",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE/Ours: transparency checker grid behind the comp to judge alpha.",
      "feasibility": "buildable-now",
      "mapsTo": "draw alpha checker behind composite",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Custom...",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE/Ours: color picker for an arbitrary pasteboard fill.",
      "feasibility": "buildable-now",
      "mapsTo": "color picker -> view.panelBg",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Show Guides",
    "shortcut": "Ctrl+;",
    "aeShortcut": "Ctrl+;",
    "behavior": "AE: toggles visibility of all non-rendering guide lines in the comp. Ours: toggle view.showGuides; guides stored as view.guides=[{axis,pos}] in comp space and drawn over the monitor in drawFrame(); persisted with the project.",
    "feasibility": "buildable-now",
    "mapsTo": "overlay guides; toggle view.showGuides",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Snap to Guides",
    "shortcut": "Ctrl+Shift+;",
    "aeShortcut": "Ctrl+Shift+;",
    "behavior": "AE: dragged layer/mask edges snap to guide lines within tolerance. Ours: when dragging clip posX/posY on the monitor, snap the moved edge/center to the nearest guide; toggle view.snapGuides. Depends on monitor transform handles existing.",
    "feasibility": "buildable-now",
    "mapsTo": "snap monitor-drag posX/posY to guides; toggle view.snapGuides",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Lock Guides",
    "shortcut": "Ctrl+Alt+Shift+;",
    "aeShortcut": "Ctrl+Alt+Shift+;",
    "behavior": "AE: locks all guides so they can't be moved or deleted by dragging. Ours: toggle view.guidesLocked; when set, ignore guide drag/delete hit-tests.",
    "feasibility": "buildable-now",
    "mapsTo": "toggle view.guidesLocked",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Clear Guides",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: deletes all guides from the comp at once. Ours: view.guides=[] then redraw; respect locked state.",
    "feasibility": "buildable-now",
    "mapsTo": "view.guides=[]; redraw",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Add Guide",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: adds guide(s) programmatically (center/selection-framing in newer builds; classically dragged from rulers). Ours: add a guide at the monitor cursor or comp center, optionally a tiny axis+position prompt; pushes into view.guides.",
    "feasibility": "buildable-now",
    "mapsTo": "push guide(s) into view.guides (center or prompt)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Import Guides...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: loads guides from a .guides file into the comp to reuse a layout/title-safe template. Ours: file input that JSON-parses guides back into view.guides.",
    "feasibility": "buildable-now",
    "mapsTo": "file input -> JSON.parse into view.guides",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Export Guides...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: saves the comp's current guides to a .guides file. Ours: download a JSON serialization of view.guides.",
    "feasibility": "buildable-now",
    "mapsTo": "download JSON of view.guides",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Show Grid",
    "shortcut": "Ctrl+'",
    "aeShortcut": "Ctrl+'",
    "behavior": "AE: toggles a non-rendering grid over the comp; spacing/subdivisions/color from Preferences. Ours: toggle view.showGrid; draw grid lines over the monitor with spacing from view.gridStep in drawFrame().",
    "feasibility": "buildable-now",
    "mapsTo": "overlay grid; toggle view.showGrid, spacing view.gridStep",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Snap to Grid",
    "shortcut": "Ctrl+Shift+'",
    "aeShortcut": "Ctrl+Shift+'",
    "behavior": "AE: snaps dragged layer/mask edges to grid intersections within tolerance. Ours: when dragging clip posX/posY on the monitor, snap to the nearest grid line; toggle view.snapGrid. Depends on monitor transform handles.",
    "feasibility": "buildable-now",
    "mapsTo": "snap monitor-drag to grid; toggle view.snapGrid",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "View Options...",
    "shortcut": "Ctrl+Alt+U",
    "aeShortcut": "Ctrl+Alt+U",
    "behavior": "AE: dialog to choose which layer overlays render in the viewer (handles, anchor, masks, motion paths, keyframes). Ours: small dialog with checkboxes for the overlays we actually have (bounding box/handles, anchor marker, motion path from keyed posX/posY, keyframe dots); stored in view.options.",
    "feasibility": "buildable-now",
    "mapsTo": "new viewOptions() dialog -> view.options{handles,anchor,motionPath,keys}",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Show Layer Controls",
    "shortcut": "Ctrl+Shift+H",
    "aeShortcut": "Ctrl+Shift+H",
    "behavior": "AE: master toggle to show/hide ALL layer overlays at once (distinct from View Options which picks which). Ours: single boolean view.showLayerControls gating all monitor overlays for a quick declutter.",
    "feasibility": "buildable-now",
    "mapsTo": "toggle view.showLayerControls (master overlay gate)",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Reset 3D View",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: resets the current custom 3D view's camera (orbit/pan/dolly) to default. Ours: skip — no 3D camera or perspective views. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Create Camera from 3D View",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: bakes the current custom 3D viewpoint into a real Camera layer. Ours: skip — no cameras, no 3D. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Switch View Layout",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: splits the viewer into 1/2/4 simultaneous views for 3D blocking. Ours: skip — single monitor, no multi-view. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "1 View",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: single view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "2 Views - Horizontal",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: two side-by-side views. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "2 Views - Vertical",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: two stacked views. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "4 Views",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: four-up view grid. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Switch 3D View",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: picks which 3D view fills the viewer (Active Camera, ortho faces, custom views). Ours: skip — no 3D views. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": [
     {
      "label": "Active Camera",
      "shortcut": null,
      "aeShortcut": "F12",
      "behavior": "AE: view through the active camera. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Front",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic front view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Left",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic left view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Top",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic top view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Back",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic back view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Right",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic right view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Bottom",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: orthographic bottom view. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Custom View 1",
      "shortcut": null,
      "aeShortcut": "F11",
      "behavior": "AE: user-orbitable custom view 1. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Custom View 2",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: user-orbitable custom view 2. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Custom View 3",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE: user-orbitable custom view 3. Ours: skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Assign 3D View Shortcut",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: rebinds the F10/F11/F12 keys to a chosen 3D view. Ours: skip — no 3D views to bind. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Switch to Last 3D View",
    "shortcut": null,
    "aeShortcut": "Esc",
    "behavior": "AE: toggles back to the previously active 3D view for fast A/B between angles. Ours: skip — no 3D views. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Look at Selected Layers",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: orbits/frames the active 3D camera so selected layer(s) fill the view. Ours: skip — no 3D camera (do not fake-map to fitScreen). Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Look at All Layers",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "AE: frames the 3D camera so all layers are visible. Ours: skip — no 3D camera. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Go to Time...",
    "shortcut": "Alt+Shift+J",
    "aeShortcut": "Alt+Shift+J",
    "behavior": "AE: dialog to jump the playhead to an exact typed timecode/frame. Ours: prompt for a timecode/frame, parse with the timeline's tc() format, then call setPlayhead(f). Borderline 'exists' since setPlayhead is the whole engine; only the input dialog is new.",
    "feasibility": "buildable-now",
    "mapsTo": "gotoTime() dialog -> parse tc/frame -> setPlayhead(f)",
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
    "label": "Workspace",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, a submenu listing all workspace presets (active one checkmarked) plus commands to save/edit/reset layouts; selecting a preset re-docks all panels into that arrangement. In our editor, a submenu of named density/visibility presets that wrap setMode() and panel show/hide; no docking, just which panes are visible and at what density.",
    "feasibility": "buildable-now",
    "mapsTo": "applyWorkspace(name) + setMode()",
    "separator_after": false,
    "submenu": [
     {
      "label": "Editing (Default)",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE's Default/Standard workspace arranges Project, Composition, Timeline, and side panels. Ours shows all 4 panes (Project/Program/Properties/Timeline) at Director density.",
      "feasibility": "buildable-now",
      "mapsTo": "applyWorkspace('editing')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Simple",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "Analogue of AE's Minimal/Small Screen workspaces. Ours calls setMode('simple') — one big video lane, simplified UI.",
      "feasibility": "exists",
      "mapsTo": "setMode('simple')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Animation",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE's Animation workspace emphasizes keyframing surfaces. Ours emphasizes Properties + Timeline for keyframe work (opacity/posX/posY/scale/rotation/fx*).",
      "feasibility": "buildable-now",
      "mapsTo": "applyWorkspace('animation')",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Minimal",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE's Minimal hides most panels. Ours shows only Program monitor + Timeline (hide Project bin + Properties).",
      "feasibility": "buildable-now",
      "mapsTo": "applyWorkspace('minimal')",
      "separator_after": true,
      "submenu": null
     },
     {
      "label": "Save as New Workspace…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE captures the current panel layout under a new name and adds it to the preset list. Ours snapshots current pane-visibility + density flags to a named localStorage entry.",
      "feasibility": "buildable-now",
      "mapsTo": "saveWorkspace() — prompt for name, store layout",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Edit Workspaces…",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE opens a dialog to reorder, rename, and delete workspaces (also includes Save Changes to / Delete Workspace). Ours is a small modal to rename/delete/reorder saved presets in localStorage.",
      "feasibility": "buildable-now",
      "mapsTo": "editWorkspaces() dialog",
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reset to Saved Layout",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "AE reverts the current workspace to its last saved arrangement (label reads Reset '<name>'). Ours re-applies the stored definition of the active preset, discarding live show/hide tweaks.",
      "feasibility": "buildable-now",
      "mapsTo": "resetWorkspace()",
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "Assign Shortcut to \"Editing\" Workspace",
    "shortcut": "Shift+1",
    "aeShortcut": "Shift+F10/F11/F12",
    "behavior": "In AE, a submenu binding the current workspace to a reserved Shift+F10/F11/F12 slot for instant switching; the label is dynamic to the active workspace. In ours, bind the active preset to Shift+1/2/3 in the existing keydown handler to switch presets instantly.",
    "feasibility": "buildable-now",
    "mapsTo": "extend keydown -> applyWorkspace()",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Find Extensions on Exchange…",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens Adobe Exchange to browse/install CEP/UXP extensions. Not meaningful in a single-file static page with no plugin runtime; render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Extensions",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, a submenu of installed CEP/UXP panels (e.g. Frame.io V4, third-party tools). No extension host in our editor; render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Align",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, the Align panel aligns/distributes selected layers. We have no multi-layer align UI; aligning canvas transforms (posX/posY) is a real but larger add.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Audio",
    "shortcut": null,
    "aeShortcut": "Ctrl+4",
    "behavior": "In AE, the Audio panel shows per-layer level meters/faders. We have per-clip volume + audioFadeIn/Out but no mixer panel; a meter/mixer is buildable later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Brushes",
    "shortcut": null,
    "aeShortcut": "Ctrl+9",
    "behavior": "In AE, the Brushes panel manages brush-tip presets for Paint/Roto. We have no paint engine; not meaningful. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Character",
    "shortcut": null,
    "aeShortcut": "Ctrl+6",
    "behavior": "In AE, the Character panel controls font/size/color/tracking/leading for text. We expose text size/color/x/y in the Inspector; a dedicated Character panel (font family, tracking) is buildable later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Content-Aware Fill",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, AI-removes objects across frames. Far beyond a 5-filter canvas NLE. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Effects & Presets",
    "shortcut": null,
    "aeShortcut": "Ctrl+5",
    "behavior": "In AE, a searchable browser of all effects/animation presets to drag onto layers. Our effects are a fixed set of 5 filters + blend modes, not an addable stack, so a browser has nothing to list yet.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Essential Graphics",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, builds/edits Motion Graphics templates (.mogrt) with responsive design. No MOGRT system here. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Essential Sound",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, guided audio mixing (dialogue/music/SFX, loudness). No audio-classification pipeline here. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Info",
    "shortcut": null,
    "aeShortcut": "Ctrl+2",
    "behavior": "In AE, the Info panel shows a live cursor color sample plus position/timing readout. In ours, a small readout strip: playhead frame/time, cursor x/y over the Program monitor, and a sampled pixel color. Cheap, authentic win.",
    "feasibility": "buildable-now",
    "mapsTo": "togglePanel('info') + monitor mousemove sampler",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Learn",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, in-app tutorials/onboarding. Out of scope for our editor. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Libraries",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, Creative Cloud Libraries (shared assets). No CC backend here. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Lumetri Scopes",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, waveform/vectorscope/histogram of the comp. Computable from our canvas but a real build; not now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Mask Interpolation",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, smooths keyframed mask-shape changes. We have no masks. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Media Browser",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, browse/import media from disk without a dialog. We import via openPicker()/doImport(); a persistent browser panel is a real add.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Metadata",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, shows XMP metadata of footage/comp. We have no metadata model. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Motion Sketch",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, records a motion path by dragging in real time. Feasible against our posX/posY keyframe model but a real feature; later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paint",
    "shortcut": null,
    "aeShortcut": "Ctrl+8",
    "behavior": "In AE, paint-stroke parameters (works with Brushes). We have no paint engine. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Paragraph",
    "shortcut": null,
    "aeShortcut": "Ctrl+7",
    "behavior": "In AE, text alignment/justification/indents. Pairs with a Character panel; multi-line/justify is larger than our single-line text clips. Later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Preview",
    "shortcut": "Space",
    "aeShortcut": "Ctrl+3",
    "behavior": "In AE, the Preview panel (formerly Time Controls) hosts playback/RAM-preview controls. In ours, transport already exists as an always-on bar (play/stop/step), so there is no separate panel to toggle.",
    "feasibility": "exists",
    "mapsTo": "togglePlay()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Progress",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, shows background-render/task progress. We have no background render queue. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Properties",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE (recent versions), a context-sensitive panel of the selected layer's properties. This IS our Inspector; toggling shows/hides the Properties pane and refreshes it.",
    "feasibility": "exists",
    "mapsTo": "refreshInspector()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Review with Frame.io",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, the Frame.io review/comments panel (legacy; Frame.io V4 is the modern path under Extensions). No collaboration backend here. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Smoother",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, smooths keyframe value/spatial curves. Operates on our keyframe arrays; real but not now.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Tools",
    "shortcut": null,
    "aeShortcut": "Ctrl+1",
    "behavior": "In AE, the toolbar (Selection, Pen, Text, Shape, etc.). We have a Tools strip with Select/Razor; toggle shows/hides it, tools set via setTool().",
    "feasibility": "exists",
    "mapsTo": "setTool('select')",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Tracker",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, motion/face/planar tracking controls. We have no tracker. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Wiggler",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, adds random variation to selected keyframes. Could perturb our keyframe arrays; later.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Composition",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens/focuses the Composition viewer (the render preview). This is our Program monitor — always present; show = focus and fit the comp to the viewer.",
    "feasibility": "exists",
    "mapsTo": "fitScreen()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Effect Controls",
    "shortcut": null,
    "aeShortcut": "F3",
    "behavior": "In AE, opens the Effect Controls panel for the selected layer (every applied effect's params). We surface only the fixed 5 filters inside the Inspector, not a per-effect controls panel; a true panel implies an effect stack we lack.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Flowchart",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, the Flowchart node graph of comp/layer/precomp relationships. Single flat composition with no nesting to graph. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Footage",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, the Footage viewer inspects a raw source clip in isolation. We could open a source in the Program monitor in a source mode, but no isolated viewer exists today.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Layer",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, the Layer viewer edits a single layer's source/in-out, masks, paint. No per-layer viewer here; layer editing happens inline on the timeline + Inspector. Render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Project",
    "shortcut": null,
    "aeShortcut": "Ctrl+0",
    "behavior": "In AE, opens/focuses the Project panel (asset bin + comps). This is our Media/Project bin; toggle show/hide, open/import via openPicker().",
    "feasibility": "exists",
    "mapsTo": "openPicker()",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Render Queue",
    "shortcut": null,
    "aeShortcut": "Ctrl+Alt+0",
    "behavior": "In AE, opens the Render Queue panel for batch export. We have a single-shot exporter (no multi-item queue); the menu item opens our export flow. A real queue is buildable later.",
    "feasibility": "exists",
    "mapsTo": "btnExport",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Timeline",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens/focuses the Timeline panel for the active comp. Our Timeline is always present; show/focus = scroll/refresh to the playhead.",
    "feasibility": "exists",
    "mapsTo": "setPlayhead(f)",
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
    "label": "After Effects Help",
    "shortcut": "F1",
    "aeShortcut": "F1",
    "behavior": "In AE, opens the online Adobe After Effects User Guide in the default browser. In our editor, rename to 'LePrince Help' and open a short in-app help page (or hosted README) describing the four panels and basic workflow.",
    "feasibility": "buildable-now",
    "mapsTo": "new helpDialog() modal or window.open(HELP_URL)",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Onboarding",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, replays the first-run onboarding tour / interactive explainers that point at panels and core workflows. In our editor, a coachmark tour over the Media bin, Program monitor, Inspector and Timeline panes is feasible but low priority; ship after the higher-value items.",
    "feasibility": "buildable-now",
    "mapsTo": "new startTour() coachmark walkthrough over the 4 panes",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "What's New",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens the 'What's New in this release' page describing current-version features. In our editor, build a static changelog modal fed by a hardcoded [{version,date,notes[]}] array. No implementation exists yet in editor.html, so this is a clean buildable-now win.",
    "feasibility": "buildable-now",
    "mapsTo": "new whatsNew() static changelog modal",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Effect Reference",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens the online Effect Reference documenting every built-in effect and its parameters. Our editor has only 5 fixed canvas filters plus 9 blend modes, not an addable effect stack, so repurpose as a small 'Effects & Blend Reference' modal documenting fxBlur/fxBright/fxContrast/fxSat/fxHue and the blend list with their AE equivalents.",
    "feasibility": "buildable-now",
    "mapsTo": "new effectRef() static cheat-sheet modal (5 filters + 9 blends)",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Keyboard Shortcuts (web)",
    "shortcut": "?",
    "aeShortcut": null,
    "behavior": "In AE, opens the online keyboard-shortcuts reference in a browser (distinct from Edit > Keyboard Shortcuts, the in-app editor). In our editor, build an in-app OVERLAY listing our real bindings (tools, split, transport, keyframes), ideally read from the same key map the handler at ~line 1038 uses so it cannot drift. Trigger with '?'.",
    "feasibility": "buildable-now",
    "mapsTo": "new shortcutsOverlay() modal driven by the live key map",
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Provide Feedback",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens the Adobe feedback/community portal in a browser. Not meaningful for our editor (no feedback backend); could be a one-line external link to a repo issues page if ever desired, but skip for scope.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Manage Extensions...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, launches the UXP/CEP extension manager to enable, disable, and install third-party panels. Our single-file vanilla-JS app has no extension or plugin architecture, so this is not meaningful; render greyed in the silhouette.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "Animation Presets",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens Adobe Bridge browsing the Presets folder to preview and apply animation presets. Our editor has no Bridge or preset library; a future 'canned keyframe recipes' feature using our keyframe engine (toggleKeyHere/gotoKey) would be buildable-later, but skip for the Help spec now.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Enable Logging",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, toggles diagnostic logging and reveals the log file location for crash/render triage. Browser apps cannot write native log files; the analogue is the dev console (F12), which needs no menu item. Skip the whole submenu.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": [
     {
      "label": "Standard",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "In AE, enables standard-verbosity diagnostic logging. No native log file in a browser app; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Detailed",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "In AE, enables verbose diagnostic logging. No native log file in a browser app; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     },
     {
      "label": "Reveal Logging File...",
      "shortcut": null,
      "aeShortcut": null,
      "behavior": "In AE, opens the log file location in Explorer/Finder. Browser sandbox has no file location to reveal; skip.",
      "feasibility": "skip",
      "mapsTo": null,
      "separator_after": false,
      "submenu": null
     }
    ]
   },
   {
    "label": "GPU Information...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, shows a dialog with GPU vendor/model, texture memory, and Mercury/CUDA/Metal acceleration status driving GPU rendering. Canvas2D exposes no user-actionable GPU dialog; optionally fold a WebGL renderer string into the About dialog instead. Skip as its own item.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Restore Default Preferences",
    "shortcut": null,
    "aeShortcut": "Ctrl+Alt+Shift at launch (Win) / Cmd+Opt+Shift (Mac)",
    "behavior": "In AE, resets all preferences, workspaces, and the shortcut/debug DB to factory defaults (restart required); the launch-time chord does the same. In our editor, this would localStorage.clear() only the editor's prefs (theme, density mode, last layout) WITHOUT touching the user's project, behind a confirm dialog. Needs careful prefs-vs-project scoping, so defer.",
    "feasibility": "buildable-later",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "System Compatibility Report",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, shows a hardware/driver/OS compatibility report with recommended fixes. In our editor, repurpose as a 'Browser Compatibility Report' modal that feature-detects what the NLE relies on (Canvas2D, requestVideoFrameCallback, WebAudio, WebCodecs/MediaRecorder for export, OffscreenCanvas, storage quota) and lists PASS/WARN per feature with advice. Genuinely useful for an export-capable browser tool.",
    "feasibility": "buildable-now",
    "mapsTo": "new compatReport() feature-detection modal",
    "separator_after": true,
    "submenu": null
   },
   {
    "label": "Updates...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, opens Creative Cloud Desktop to check for and install app updates via the native installer (on macOS this lives under the After Effects app menu). A single static HTML file has no update channel; 'update' means reload the page or pull the repo. Not meaningful; render greyed.",
    "feasibility": "skip",
    "mapsTo": null,
    "separator_after": false,
    "submenu": null
   },
   {
    "label": "About After Effects...",
    "shortcut": null,
    "aeShortcut": null,
    "behavior": "In AE, a modal showing version, build, credits, and licensing (on macOS this lives under the After Effects app menu). In our editor, build 'About LePrince Visual Labs': a static modal with app name, version/build, a one-line description, tech credits, and optionally the live canvas size / fps defaults (1920x1080 @ 30) plus a folded-in WebGL renderer string. Cheap, high polish.",
    "feasibility": "buildable-now",
    "mapsTo": "new aboutDialog() static modal (About LePrince Visual Labs)",
    "separator_after": false,
    "submenu": null
   }
  ]
 }
];

window.AE_TOOLS = [
 {
  "name": "Selection",
  "glyph": "▲",
  "shortcut": "V",
  "aeShortcut": "V",
  "behavior": "The default arrow. Click to select layers/clips, drag to move them, drag corner/edge handles to scale, drag a marquee to band-select. In AE it also moves anchor-less transforms in the Comp panel. In LePrince this is the primary tool: it selects clips in the timeline and (in the monitor) selects/moves a clip's bounding box, driving posX/posY/scale.",
  "feasibility": "exists",
  "mapsTo": "setTool('select')",
  "flyout": null
 },
 {
  "name": "Hand",
  "glyph": "✋",
  "shortcut": "H",
  "aeShortcut": "H (or hold Space to temporarily activate)",
  "behavior": "Pans the view inside a panel (Comp/Layer) without moving any layer — grab-and-drag the canvas. Holding Space invokes it momentarily from any other tool, then snaps back. In LePrince it pans the Program monitor once a view-offset transform is added (and can double as horizontal timeline scrub-pan). No layer data changes; it's purely a viewport nudge.",
  "feasibility": "buildable-now",
  "mapsTo": "new monitor view transform (viewX/viewY offset on the #screen draw); hold-Space + drag handler",
  "flyout": null
 },
 {
  "name": "Zoom",
  "glyph": "🔍",
  "shortcut": "Z",
  "aeShortcut": "Z (Alt/Opt-click to zoom out)",
  "behavior": "Click to zoom the view in around the cursor; Alt/Opt-click to zoom out; drag a marquee to zoom to a region. Changes magnification only, never the render resolution. In LePrince it maps two ways: in the timeline it reuses the existing ppf/#zoom magnification (already wired), and in the monitor it scales the view transform around the cursor (Alt to reverse). It is a view zoom, distinct from a clip's scale property.",
  "feasibility": "buildable-now",
  "mapsTo": "timeline: existing ppf + #zoom slider; monitor: new viewScale on #screen draw (Alt = zoom out)",
  "flyout": null
 },
 {
  "name": "Orbit / Pan / Dolly (Camera) tools",
  "glyph": "🎥",
  "shortcut": null,
  "aeShortcut": "C (cycles Orbit Around Cursor → Pan Under Cursor → Dolly Towards Cursor); 1 / 2 / 3 jump directly",
  "behavior": "The 3D camera-navigation cluster (the modern replacement for the old Unified Camera Tool). Orbit rotates the active camera around a point, Pan slides it laterally, Dolly pushes it in/out along the view axis. They only do anything when the comp has a 3D layer or camera. LePrince is a flat 2D compositor with no camera, Z-axis, or 3D renderer, so these have no target. Shown for AE fidelity but inert.",
  "feasibility": "skip",
  "mapsTo": null,
  "flyout": [
   "Orbit Around Cursor (1)",
   "Pan Under Cursor (2)",
   "Dolly Towards Cursor (3)"
  ]
 },
 {
  "name": "Rotation",
  "glyph": "↻",
  "shortcut": "W",
  "aeShortcut": "W",
  "behavior": "Drag inside the Comp panel to rotate the selected layer around its anchor point, writing the layer's Rotation property. Shift constrains to 45° steps. LePrince clips already have a keyable rotation property and the monitor shows a bounding box, so a rotate-handle drag that writes clip.rotation is a small, self-contained add.",
  "feasibility": "buildable-now",
  "mapsTo": "monitor rotate-handle drag writing sel clip.rotation (keyable); refreshInspector()",
  "flyout": null
 },
 {
  "name": "Anchor Point (Pan Behind)",
  "glyph": "⊕",
  "shortcut": "Y",
  "aeShortcut": "Y",
  "behavior": "Repositions a layer's anchor point WITHOUT visually moving the layer — AE compensates Position so the pixels stay put, only the pivot for rotation/scale shifts. Dragging the layer itself with this tool slides content behind a mask. LePrince clips have no separate anchor-point property today (transforms pivot around clip center), so honoring this means adding anchorX/anchorY to the data model and compensating posX/posY. Real but a model change.",
  "feasibility": "buildable-later",
  "mapsTo": null,
  "flyout": null
 },
 {
  "name": "Shape tools",
  "glyph": "▭",
  "shortcut": null,
  "aeShortcut": "Q (cycles Rectangle → Rounded Rectangle → Ellipse → Polygon → Star)",
  "behavior": "Drag on the canvas to create a vector Shape layer (or, with a layer selected, a mask). Holds Rectangle, Rounded Rectangle, Ellipse, Polygon, and Star. Each produces editable vector paths with fill/stroke. LePrince has no Shape layer kind, no vector path model, and no mask system, so this is a large feature (new layer type + path renderer). Catalogued for AE fidelity; not trivially buildable.",
  "feasibility": "buildable-later",
  "mapsTo": null,
  "flyout": [
   "Rectangle",
   "Rounded Rectangle",
   "Ellipse",
   "Polygon",
   "Star"
  ]
 },
 {
  "name": "Pen tools",
  "glyph": "✒",
  "shortcut": null,
  "aeShortcut": "G (cycles Pen → Add Vertex → Delete Vertex → Convert Vertex; Mask Feather is in the same flyout)",
  "behavior": "Click to lay down Bézier vertices, building an open/closed path used as a mask or a Shape-layer path. The flyout adds/removes/converts vertices and the Mask Feather tool sets variable-width feather points. LePrince has no path/mask engine at all, so the Pen is meaningless until masks or shapes exist. Shown for fidelity; depends on the masking subsystem.",
  "feasibility": "buildable-later",
  "mapsTo": null,
  "flyout": [
   "Pen",
   "Add Vertex",
   "Delete Vertex",
   "Convert Vertex",
   "Mask Feather"
  ]
 },
 {
  "name": "Type tools",
  "glyph": "T",
  "shortcut": "T",
  "aeShortcut": "Ctrl/Cmd+T (toggles between Horizontal and Vertical Type)",
  "behavior": "Click in the Comp to set a point-text insertion, or drag to make a paragraph text box, then type — creates a Text layer. The flyout swaps between Horizontal and Vertical orientation. LePrince already has a real text-clip type with editable text/size/color/x/y plus keyable transforms, so AE's Type tool maps cleanly onto the existing add-title flow. Vertical orientation would be a later nicety.",
  "feasibility": "buildable-now",
  "mapsTo": "addText()",
  "flyout": [
   "Horizontal Type",
   "Vertical Type"
  ]
 },
 {
  "name": "Brush",
  "glyph": "🖌",
  "shortcut": null,
  "aeShortcut": "Ctrl/Cmd+B",
  "behavior": "Freehand paint strokes onto a layer in the Layer panel using the Paint engine (color, brush size, opacity, blending). Strokes are vector and animatable. LePrince has no per-layer paint/raster surface — effects are a fixed set of canvas filters — so painting onto media is out of scope without a whole paint subsystem. Shown for fidelity; skipped functionally.",
  "feasibility": "skip",
  "mapsTo": null,
  "flyout": null
 },
 {
  "name": "Clone Stamp",
  "glyph": "🩹",
  "shortcut": null,
  "aeShortcut": "Ctrl/Cmd+B then cycle, or click in Tools panel (shares the paint cluster)",
  "behavior": "Samples pixels from one point (Alt-click to set source) and paints them elsewhere in the Layer panel — part of the same Paint engine as Brush/Eraser. Requires sampling and writing into a layer's raster, which LePrince's canvas-filter-only pipeline doesn't support. Shown for AE fidelity; skipped.",
  "feasibility": "skip",
  "mapsTo": null,
  "flyout": null
 },
 {
  "name": "Eraser",
  "glyph": "🧹",
  "shortcut": null,
  "aeShortcut": "Ctrl/Cmd+B then cycle (shares the paint cluster)",
  "behavior": "Erases paint strokes, or (in Erase-Layer mode) removes pixels from the layer itself, in the Layer panel. Same Paint-engine dependency as Brush and Clone Stamp. No raster paint surface in LePrince, so it has no target. Shown for fidelity; skipped.",
  "feasibility": "skip",
  "mapsTo": null,
  "flyout": null
 },
 {
  "name": "Roto Brush & Refine Edge",
  "glyph": "🪮",
  "shortcut": null,
  "aeShortcut": "Alt+W (Refine Edge shares the flyout)",
  "behavior": "AI-assisted rotoscoping: paint a stroke over a foreground subject in the Layer panel and AE propagates a matte across frames, isolating the subject from the background. Refine Edge cleans hair/soft edges. This is a heavyweight, per-pixel temporal matte engine (now Roto Brush 3.0). Far beyond LePrince's compositor — would require a full segmentation/matte pipeline. Shown for fidelity; not realistic.",
  "feasibility": "buildable-later",
  "mapsTo": null,
  "flyout": [
   "Roto Brush",
   "Refine Edge"
  ]
 },
 {
  "name": "Puppet tools",
  "glyph": "📌",
  "shortcut": null,
  "aeShortcut": "Ctrl/Cmd+P (cycles the pin types)",
  "behavior": "Lays deformation pins on a layer to warp it like a puppet — the mesh bends between pins so you can animate organic motion. The flyout holds Position, Starch, Bend, Advanced, and Overlap pins. Needs a mesh-warp deformation engine LePrince doesn't have. Shown for AE fidelity; not realistic for a 2D filter compositor.",
  "feasibility": "buildable-later",
  "mapsTo": null,
  "flyout": [
   "Position Pin",
   "Starch Pin",
   "Bend Pin",
   "Advanced Pin",
   "Overlap Pin"
  ]
 }
];

window.AE_WORKSPACES = [
 {
  "name": "Editing",
  "description": "The default everyday layout — all four panels visible (Media bin, Program monitor, Inspector, Timeline) at full Director density. This is AE's Default/All Panels: the balanced 'do everything' arrangement for assembling and refining a cut. Bin on the left to drag in media, monitor center, full inspector right with every group (Transform, Effects, Transitions, Animate) available, timeline below. Feasibility: exists today as the standard Director view; promoting it to a named, restorable workspace is buildable-now (one body-class preset).",
  "density": "director",
  "showBin": true,
  "showInspector": true,
  "showTimeline": true,
  "notes": "mapsTo: setMode('director') + new workspace('editing') (all .col visible). AE analog: Default / All Panels / Standard. The home base — set the first time the app opens. No panels hidden."
 },
 {
  "name": "Effects",
  "description": "Inspector-forward layout for browsing and dialing the look. Hides the Media bin to widen the monitor, keeps the full Inspector docked right, and auto-expands/scrolls to the Effects group (fxBlur, fxBright, fxContrast, fxSat, fxHue) plus blend mode. AE's Effects workspace puts Effect Controls front-and-center while keeping the viewer large to judge the result — same intent, mapped to our fixed 5-filter set. Feasibility: buildable-now; reuses the existing inspector Effects group and the setMode mechanism.",
  "density": "director",
  "showBin": false,
  "showInspector": true,
  "showTimeline": true,
  "notes": "mapsTo: new workspace('effects') — hide .col.bin, scroll inspector to the Effects .grp and expand it. AE analog: Effects. Honest limit: our effects are a FIXED 5-filter canvas set + blend modes, not an addable AE effect stack — so this surfaces the existing group rather than an effect browser."
 },
 {
  "name": "Color",
  "description": "Grading-focused inspector layout: bin hidden, big monitor to read the image, full Inspector pointed at Hue/Saturation (fxSat, fxHue) and the Transform/opacity props for color-and-light work. Our LePrince stand-in for AE's color/Lumetri space. Feasibility: buildable-now via the same hide-bin + inspector-scroll mechanism. Natural future home for a scopes / safe-margins / title-safe overlay on the monitor canvas once Composition Settings lands (both buildable-now overlays).",
  "density": "director",
  "showBin": false,
  "showInspector": true,
  "showTimeline": true,
  "notes": "mapsTo: new workspace('color') — hide .col.bin, scroll inspector to Hue/Sat + Transform. AE analog: a Color/Lumetri-style grading workspace (no AE default by this exact name, but the intent is standard). Future: attach a scopes/safe-margin overlay here (buildable-later for true scopes; safe margins buildable-now)."
 },
 {
  "name": "Audio",
  "description": "Audio-mixing layout: monitor shrinks (we listen more than watch), bin stays on to pull in audio, Inspector docked for per-clip volume / audioFadeIn / audioFadeOut, and the Timeline gets emphasis since audio work is timeline-and-levels-driven. AE's Audio workspace surfaces the Audio panel and levels; we map to our per-clip volume + fade props and the audio-track timeline lanes. Feasibility: buildable-now; all props already exist on audio and video/text clips.",
  "density": "director",
  "showBin": true,
  "showInspector": true,
  "showTimeline": true,
  "notes": "mapsTo: new workspace('audio') — shrink monitor row, scroll inspector to the audio volume/fade group. AE analog: Audio. Uses existing volume, audioFadeIn, audioFadeOut. A per-track level meter / mixer strip is buildable-later (no audio-graph metering in editor.html today, unlike studio.html's bussing work)."
 },
 {
  "name": "Minimal",
  "description": "Maximum canvas, minimum chrome — the Small Screen / Minimal merge. Hides BOTH the Media bin and the Inspector, switches to Simple density (one video lane, big and easy, .director-only controls hidden), leaving a large monitor over a clean timeline. For focused single-lane editing on small screens or when you just want to see the frame. Feasibility: exists in spirit (Simple mode already collapses to one lane); the bin+inspector hide is buildable-now.",
  "density": "simple",
  "showBin": false,
  "showInspector": false,
  "showTimeline": true,
  "notes": "mapsTo: setMode('simple') + new workspace('minimal') (hide .col.bin and .col.insp; .mid collapses to a single 1fr monitor column). AE analog: Small Screen + Minimal merged. The only Simple-density workspace — our two density modes anchor Editing (Director) and Minimal (Simple)."
 },
 {
  "name": "Review",
  "description": "Playback-and-notes layout: bin and inspector hidden, monitor maximized, timeline kept only as a scrub bar/playhead. Stays in Director density so the full cut (all tracks) renders, unlike Minimal's single-lane Simple view. AE's Review workspace is a clean presentation surface for watching and giving feedback rather than building — same here: no editing chrome, just play/stop/scrub and watch. Feasibility: buildable-now (hide bin+inspector, reuse play()/stop()/setPlayhead()).",
  "density": "director",
  "showBin": false,
  "showInspector": false,
  "showTimeline": true,
  "notes": "mapsTo: new workspace('review') — hide .col.bin and .col.insp, keep Director so all tracks composite. AE analog: Review. Uses existing play(), stop(), togglePlay(), setPlayhead(f), tHome/tEnd. Differs from Minimal: Director density (full multi-track render) vs Minimal's Simple single-lane. A true comments panel is buildable-later."
 }
];

window.AE_DIALOGS = [
 {
  "name": "Composition Settings",
  "opensFrom": "Composition > Composition Settings… (Ctrl/Cmd+K); also a gear on the Program panel header and double-click the project-name field. AE menu path: Composition > Composition Settings.",
  "behavior": "Modal dialog (reuse existing .scrim/.modal scaffold) configuring the single comp == project. Tabs Basic / Advanced / 3D Renderer. Basic tab holds the demoed fields. On OK: write width/height/fps to project, set new project.bg, set new project.duration (clamps/extends timeline working area), then call fitScreen() + renderTimeline() + save(true). Cancel reverts. Preset dropdown auto-fills width/height/PAR/fps; choosing any numeric field flips Preset to 'Custom'. Lock Aspect Ratio constrains the other dimension while typing W or H. Resolution is preview-only downsample (Full/Half/Third/Quarter) and does NOT change project.width/height. 3D Renderer tab is informational/disabled (we are 2D canvas).",
  "feasibility": "buildable-now",
  "fields": [
   {
    "label": "Composition Name",
    "control": "text input",
    "default": "current project.title (\"Untitled\")",
    "mapsTo": "project.title (and #projName input value)",
    "notes": "Two-way bind with the existing top-bar #projName field. On change call save(true)."
   },
   {
    "label": "Preset",
    "control": "select dropdown",
    "default": "\"HD · 1920×1080 · 30\" (matches newProject defaults)",
    "mapsTo": "new compSettings() dialog — local preset table, writes W/H/PAR/fps",
    "notes": "Options: HD 1080 24/25/30/60, UHD 4K 3840×2160, 1280×720, 1080×1080 Square (IG), 1080×1920 Vertical (Reels/TikTok), Custom. Selecting a preset fills the numeric fields; editing any numeric field switches this to Custom. Reuse the WxH option style already in #expRes."
   },
   {
    "label": "Width",
    "control": "number input (px)",
    "default": "1920 (project.width)",
    "mapsTo": "project.width",
    "notes": "Existing inspector #pw already writes project.width then fitScreen()+renderTimeline(). Even integers preferred for export (export already does w-=w%2)."
   },
   {
    "label": "Height",
    "control": "number input (px)",
    "default": "1080 (project.height)",
    "mapsTo": "project.height",
    "notes": "Existing inspector #ph already writes project.height. Pair with Width under Lock Aspect Ratio."
   },
   {
    "label": "Lock Aspect Ratio",
    "control": "checkbox / link toggle",
    "default": "off",
    "mapsTo": "new compSettings() dialog — UI-only constraint",
    "notes": "When on, store W:H ratio; typing W recomputes H (and vice-versa). No data-model field; purely dialog behavior. AE shows a chain-link icon."
   },
   {
    "label": "Pixel Aspect Ratio",
    "control": "select dropdown",
    "default": "Square Pixels (1.0)",
    "mapsTo": "buildable-later — would add project.par",
    "notes": "Our whole pipeline assumes square pixels (stageFit letterboxes, no anamorphic). Offer the dropdown for AE familiarity but lock to Square; non-1.0 values are buildable-later (export would need a setsar/scale step). Honest: list D1/DV NTSC etc. as disabled or omit."
   },
   {
    "label": "Frame Rate",
    "control": "select dropdown + editable number (fps)",
    "default": "30 (project.fps)",
    "mapsTo": "project.fps",
    "notes": "Existing inspector #pf writes project.fps then renderTimeline(). Offer 23.976/24/25/29.97/30/50/59.94/60. Note: our tc() and frame math use integer fps cleanly; drop-frame (29.97/59.94) is approximate — flag buildable-later for true NDF/DF timecode."
   },
   {
    "label": "Resolution",
    "control": "select dropdown",
    "default": "Full",
    "mapsTo": "new compSettings() dialog — preview downsample only",
    "notes": "Full/Half/Third/Quarter. Implement as a preview scale on the #screen canvas / fitScreen() (e.g. divide screen.width by factor) WITHOUT touching project.width/height — exactly like AE. Does not affect export. buildable-now."
   },
   {
    "label": "Start Timecode",
    "control": "timecode input (HH:MM:SS:FF)",
    "default": "00:00:00:00",
    "mapsTo": "buildable-later — would add project.startTC (frame offset)",
    "notes": "We have a tc() formatter but the timeline is hard-anchored at frame 0 everywhere (playhead, ruler, export loop f=0..total). A non-zero start offset touches many call sites — buildable-later. Show the field defaulting to 00:00:00:00, read-only for now."
   },
   {
    "label": "Duration",
    "control": "timecode/number input (frames or HH:MM:SS:FF)",
    "default": "current timelineFrames() (computed)",
    "mapsTo": "new compSettings() dialog — new project.duration (frames)",
    "notes": "Today duration is implicit = timelineFrames() (max clip end). Adding an explicit project.duration sets the comp work-area / export length (export already reads tl.duration). buildable-now: store project.duration, fall back to timelineFrames() when unset. Use the same scrub-number pattern as numRow()."
   },
   {
    "label": "Background Color",
    "control": "color swatch (input type=color)",
    "default": "#000000 (black — current hardcoded canvas fill)",
    "mapsTo": "new compSettings() dialog — new project.bg",
    "notes": "drawFrameInto() currently does ctx.fillStyle='#000'. Replace with project.bg||'#000'. buildable-now, one-line render change + export uses the same drawFrameInto. Reuse the inspector's input[type=color] styling."
   },
   {
    "label": "Tab: Advanced",
    "control": "tab (anchor point, motion blur, shutter, preserve resolution)",
    "default": "n/a",
    "mapsTo": "buildable-later / skip",
    "notes": "AE's Advanced tab (composition anchor, shutter angle/phase, motion blur samples, preserve frame rate when nested) has no analog — no motion blur, no nesting. Show tab with most controls disabled; only 'Preserve frame rate' is moot. buildable-later at best."
   },
   {
    "label": "Tab: 3D Renderer",
    "control": "tab (Classic 3D / Cinema 4D / Advanced 3D)",
    "default": "n/a",
    "mapsTo": "skip",
    "notes": "We are a 2D canvas compositor. Show an informational disabled tab ('2D canvas renderer — 3D not supported') for fidelity, or omit. skip."
   }
  ]
 },
 {
  "name": "New Project",
  "opensFrom": "File > New > New Project (Ctrl/Cmd+Alt+N); top-bar 'New' button (#btnNew). AE menu path: File > New Project.",
  "behavior": "Confirm-and-reset. Currently uses a native confirm(); spec upgrades it to a real modal: warns unsaved work, then on confirm tears down media/video/audio elements and calls newProject(), resets #projName, playhead, deselect(), fitScreen(), renderTimeline(), save(). Optionally let the user pick starting comp size/fps here (a lightweight pre-fill that becomes the first Composition Settings).",
  "feasibility": "exists",
  "fields": [
   {
    "label": "Confirmation",
    "control": "button (Discard & Start New / Cancel)",
    "default": "Cancel",
    "mapsTo": "btnNew",
    "notes": "Already wired to #btnNew which runs confirm() then resets to newProject(). 'exists' via the btnNew handler; upgrading the native confirm() to the .modal scaffold is a buildable-now polish (no new data)."
   },
   {
    "label": "Starting Preset (optional)",
    "control": "select dropdown",
    "default": "HD 1920×1080 30",
    "mapsTo": "newProject()",
    "notes": "Optional nicety: pre-seed width/height/fps before reset by setting fields on the object newProject() returns. Pure convenience; default path needs no fields."
   }
  ]
 },
 {
  "name": "New Solid / Solid Settings",
  "opensFrom": "Layer > New > Solid… (Ctrl/Cmd+Y); for an existing solid Layer > Solid Settings. AE menu path: Layer > New > Solid.",
  "behavior": "Creates a flat color layer. We have no Solid layer type today — closest is a full-frame color. Buildable-later as a real layer: add a clip kind on a video track like {id, solid:true, color, width, height, start, dur, + transform props} that drawFrameInto() fills as a colored rect (it already letterboxes via stageFit/drawClip). 'Make Comp Size' fills width/height from project.width/height. For now this is the cleanest path to AE's Solid/Adjustment/Null family.",
  "feasibility": "buildable-later",
  "fields": [
   {
    "label": "Name",
    "control": "text input",
    "default": "\"Black Solid 1\"",
    "mapsTo": "solid clip .name (new)",
    "notes": "Auto-name from color like AE ('Red Solid 1'). New field on a new solid clip type."
   },
   {
    "label": "Width",
    "control": "number input (px)",
    "default": "project.width (1920)",
    "mapsTo": "solid clip .width (new)",
    "notes": "Defaults to comp size. Used as the solid's source rect before transform."
   },
   {
    "label": "Height",
    "control": "number input (px)",
    "default": "project.height (1080)",
    "mapsTo": "solid clip .height (new)",
    "notes": "Pair with Width; Make Comp Size resets both."
   },
   {
    "label": "Make Comp Size",
    "control": "button",
    "default": "n/a",
    "mapsTo": "new solidSettings() dialog — sets width/height = project.width/height",
    "notes": "One-click fill from project.width/height. buildable-now logic, but depends on the buildable-later solid clip type existing."
   },
   {
    "label": "Units / Pixel Aspect",
    "control": "select dropdowns",
    "default": "pixels / Square",
    "mapsTo": "skip",
    "notes": "AE lets you size in % of comp and pick PAR. We are px + square pixels only — show px, omit the rest. skip."
   },
   {
    "label": "Color",
    "control": "color swatch (input type=color)",
    "default": "#000000",
    "mapsTo": "solid clip .color (new)",
    "notes": "Reuse input[type=color] styling. The same field would back a future Adjustment/Null too."
   }
  ]
 },
 {
  "name": "Preferences",
  "opensFrom": "Edit > Preferences > General… (Ctrl/Cmd+, ) — submenus General/Import/Media&Disk Cache/Appearance. AE menu path: Edit > Preferences.",
  "behavior": "Modal with a left nav of categories; we ship only a tiny meaningful subset. Snap toggle and density/theme already have live state in the app (snap, body.mode-*); the dialog just surfaces and persists them (localStorage). Default still-image / transition durations seed addText()/addClipFromMedia(). Most AE prefs (Media Cache, Memory&Performance, Auto-Save, Sync Settings, Scripting) are skip.",
  "feasibility": "buildable-later",
  "fields": [
   {
    "label": "Snapping",
    "control": "checkbox",
    "default": "on (snap=true)",
    "mapsTo": "snapBtn",
    "notes": "Already a live global (snap) toggled by #snapBtn. 'exists' for the toggle; the Preferences surface is buildable-now (persist snap to localStorage on boot)."
   },
   {
    "label": "Default Still/Image Duration",
    "control": "number input (seconds) or timecode",
    "default": "5 (matches addClipFromMedia image dur = 5*fps)",
    "mapsTo": "new prefs() dialog — replace literal 5 in addClipFromMedia",
    "notes": "addClipFromMedia hardcodes Math.round(5*fps) for images. Expose as a pref. buildable-now."
   },
   {
    "label": "Default Title Duration",
    "control": "number input (seconds)",
    "default": "3 (matches addText dur = 3*FPS())",
    "mapsTo": "new prefs() dialog — replace literal 3 in addText",
    "notes": "addText hardcodes Math.round(3*FPS()). buildable-now."
   },
   {
    "label": "Default Transition Duration",
    "control": "number input (frames)",
    "default": "0",
    "mapsTo": "new prefs() dialog — seeds transIn/transOut",
    "notes": "Clips currently start with transIn/transOut = 0. A pref could seed default fades. buildable-now."
   },
   {
    "label": "Theme / UI Brightness",
    "control": "select or slider (Simple / Director density; dark only)",
    "default": "Director (body.mode-director)",
    "mapsTo": "setMode('director')",
    "notes": "We have a Simple/Director density toggle and a single dark theme. Map 'Appearance' to the existing setMode(); a true light theme is buildable-later. 'exists' for the density part via setMode."
   },
   {
    "label": "Auto-Save",
    "control": "checkbox + interval",
    "default": "on (debounced save already runs ~800ms after edits)",
    "mapsTo": "save()",
    "notes": "We already auto-save (debounced) on every edit via save(true). Surface as read-only 'Auto-save: on'. Interval control is buildable-now."
   },
   {
    "label": "Media & Disk Cache / Memory",
    "control": "buttons / fields",
    "default": "n/a",
    "mapsTo": "skip",
    "notes": "Server-side ffmpeg cache + proxies are not user-tunable from the browser. skip."
   }
  ]
 },
 {
  "name": "Output Module + Render Settings",
  "opensFrom": "Render Queue: Composition > Add to Render Queue (Ctrl/Cmd+M), then click the underlined 'Render Settings' and 'Output Module' rows. Our analog: top-bar 'Export' button (#btnExport). AE menu path: Composition > Add to Render Queue.",
  "behavior": "Our existing Export modal (#expScrim) already IS the merged Render-Settings + Output-Module dialog. AE splits them: Render Settings = quality/resolution/frame rate/time span sourced from the comp; Output Module = format/container + codec + audio + crop/resize + output path. We collapse both into one modal. This entry documents AE's fields vs ours and which gaps to close.",
  "feasibility": "exists",
  "fields": [
   {
    "label": "Format / Resolution (Output Module 'Resize to')",
    "control": "select dropdown",
    "default": "1920×1080",
    "mapsTo": "btnExport",
    "notes": "Our #expRes (1920×1080 / 1080×1920 / 1280×720 / 1080×1080). expGo parses 'WxH' and forces even dims. AE separates comp resolution (Render Settings) from output resize (Output Module); we merge. Could default this from project.width/height (currently it doesn't). buildable-now improvement: pre-select the option matching project dims."
   },
   {
    "label": "Quality / Codec (Output Module 'Format Options')",
    "control": "select dropdown",
    "default": "Fast — GPU/NVENC (balanced)",
    "mapsTo": "btnExport",
    "notes": "Our #expQual maps to {encoder:'nvenc',cq} or {encoder:'x264',crf} in expGo. This is our stand-in for AE's codec picker (H.264/ProRes/etc.). Honest gap: only H.264-class output (nvenc/x264), no ProRes/lossless/image-sequence. Container is mp4 only. ProRes/MOV = buildable-later (server ffmpeg can, UI doesn't expose)."
   },
   {
    "label": "Frame Rate (Render Settings)",
    "control": "select dropdown",
    "default": "project.fps (30)",
    "mapsTo": "btnExport",
    "notes": "#expFps; btnExport pre-fills it from project.fps. AE's Render Settings frame rate. Works today ('exists')."
   },
   {
    "label": "Time Span / Work Area (Render Settings)",
    "control": "range / start-end",
    "default": "whole comp (duration = timelineFrames())",
    "mapsTo": "buildable-later — needs project.duration + in/out work area",
    "notes": "AE renders the work area or full comp. We always render 0..timelineFrames(). Pairs with Composition Settings' Duration field; buildable-later to honor a work-area in/out."
   },
   {
    "label": "Audio Output (Output Module)",
    "control": "checkbox + bitrate/sample-rate",
    "default": "on, automatic",
    "mapsTo": "buildable-later",
    "notes": "AE lets you toggle audio and set 48kHz/bitrate. Our export muxes audio automatically from clip volume/fades with no UI control. Surfacing a mute-audio checkbox is buildable-now; bitrate/sample-rate buildable-later."
   },
   {
    "label": "Output To (Output Module)",
    "control": "path / file-name field",
    "default": "server-generated; user clicks Download after render",
    "mapsTo": "btnExport",
    "notes": "AE writes to a chosen disk path. We render server-side then offer #expDownload (download attribute). No path picker by design (browser). 'exists' via the Download button; a filename field is buildable-now."
   },
   {
    "label": "Channels / Depth / Color Mgmt (Output Module)",
    "control": "select dropdowns",
    "default": "RGB / 8-bit / sRGB",
    "mapsTo": "skip",
    "notes": "RGB+Alpha, 16/32-bit, color profiles, embed-ICC. We are 8-bit RGB sRGB canvas, mp4 has no alpha. skip."
   },
   {
    "label": "Post-Render Action (Render Settings)",
    "control": "select dropdown",
    "default": "none",
    "mapsTo": "skip",
    "notes": "AE's 'Import' / 'Set proxy' post actions. Not meaningful for a single-comp browser tool. skip."
   }
  ]
 }
];
