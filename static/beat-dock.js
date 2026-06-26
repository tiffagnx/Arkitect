/* Leon Production Labs — THE AGENT DRIVES PRODUCTION  (the beats.html twin of agent-dock.js)
   ───────────────────────────────────────────────────────────────────────────
   kit-helper.js calls window.DMV_DOCK_FIX(text, agentId) FIRST on every send. If the
   user gave a PRODUCTION command ("make a trap beat", "add an 808", "turn my voice into
   an instrument", "drop a riser", "make the kick knock harder", "sidechain the bass",
   "bounce it"), the docked agent DOES it — by calling the room's documented window.RoomAPI
   surface — and we return {handled:true, reply}. Anything that isn't a clear command
   (questions, chit-chat, "how do I…") returns {handled:false} so the brain answers.

   Same contract + taste model as the Studio dock, so an agent feels identical in either
   room. 100% client-side + free; works on ANY brain (even none). An MCP can call the
   same window.RoomAPI verbs directly — this file is just the natural-language front door.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  if (window.__beatDock) return; window.__beatDock = true;

  function api() { return window.RoomAPI || null; }
  function has(fn) { var A = api(); return A && typeof A[fn] === "function"; }

  // ── per-agent TASTE — same hands-vs-tools idea as the Studio. Kit = precise/technical;
  //    Tiff = loose/vibey artist. Both always do it; just a different fingerprint + voice. ──
  var STYLE = Object.assign({
    kit:  { tag: "⚙️ Locked in — clean and forward.", sfxVibe: "tight ", energy: 0.62 },
    tiff: { tag: "🫶 That's the vibe — flip it how you feel it.", sfxVibe: "", energy: 0.7 },
  }, window.DMV_BEAT_STYLE || {});
  function style(id) { return STYLE[id] || STYLE.tiff; }

  function norm(t) { return " " + (t || "").toLowerCase().replace(/[^a-z0-9#&'.\- ]+/g, " ").replace(/\s+/g, " ") + " "; }
  function looksLikeQuestion(s) {
    // explanation / comparison seeking → let the brain teach, don't hijack it
    return /\b(how do|how can|how to|why|what'?s? the|what is|what does|explain|difference|better than| vs |which (one|is)|when should|tell me about|should i use)\b/.test(s);
  }

  // ── reply helpers ──
  function fail(r) { return (r && r.msg) || "Couldn't pull that off — say it another way?"; }
  function tag(id) { return "\n_" + style(id).tag + "_"; }

  // pull the SFX / sound phrase out of a command ("drop a cinematic braam" → "cinematic braam")
  function sfxPhrase(raw) {
    return (raw || "").replace(/^\s*(hey\s+\w+[,]?\s*)?/i, "")
      .replace(/\b(can you|could you|please|now)\b/gi, "")
      .replace(/^\s*(drop|add|give me|gimme|make|generate|create|throw in|put|lay|i want|i need|need|want)\b[:\s]*/i, "")
      .replace(/^\s*(a|an|some|me a|me an)\b\s*/i, "")
      .replace(/\b(sound ?effect|sfx|sound|fx)\b/gi, "")
      .replace(/\bfor me\b/gi, "").replace(/\s+/g, " ").trim();
  }
  // pull an instrument name ("add a reese bass" → "reese bass")
  function instrPhrase(raw) {
    return (raw || "").replace(/\b(can you|could you|please|now|for me)\b/gi, "")
      .replace(/^\s*(add|give me|gimme|throw in|put|load|bring in|drop in|i want|i need|need|want|make me|design|create|build)\b[:\s]*/i, "")
      .replace(/^\s*(a|an|some|me a|me an)\b\s*/i, "")
      .replace(/\b(in here|in there|to the beat|to this|channel|instrument|track)\b/gi, "")
      .replace(/\s+/g, " ").trim();
  }

  var SHAPE_DIR = /(punch|punchy|punchier|knock|harder|bang|slap|crack|brighter|crispy|crisper|airier|sharper|darker|warmer|muffl|duller|fatter|fatten|thicker|deeper|wider|widen|huge|longer|sustain|shorter|tighter|tight|snappier|dirtier|distort|grittier|grimy|growl|cleaner|softer|smoother)/;
  var TONE_ADJ = /\b(dark|darker|bright|brighter|warm|warmer|fat|fatter|wide|wider|huge|lush|growly|gritty|dirty|hard|harder|soft|softer|clean|aggressive|mellow|airy|deep|deeper|punchy|evolving|morphing|ambient|atmospheric|distorted|sub)\b/;
  var INSTR_WORD = /\b(808|sub ?bass|reese|bass|piano|grand|rhodes|wurli|e-?piano|keys|clav|guitar|pluck|lead|supersaw|super saw|saw|pad|strings?|violin|cello|brass|trumpet|trombone|bell|marimba|vibraphone|glock|organ|choir|chorus of voices|vox|voice|vocal|flute|pan flute|sitar|shamisen|kalimba|harp|handpan|steel drum|cowbell|tom|clap|snare|kick|hat|shaker|crash)\b/;

  // ════════════════════════════════════════════════════════════════════════
  //  THE ENTRY POINT kit-helper's ask() calls. → {handled, reply}
  // ════════════════════════════════════════════════════════════════════════
  window.DMV_DOCK_FIX = async function (text, agentId) {
    try {
      var A = api(); if (!A) return { handled: false };
      var raw = (text || "").trim(); if (!raw) return { handled: false };
      var s = norm(raw);
      if (looksLikeQuestion(s)) return { handled: false };   // a real question → the brain teaches
      var st = style(agentId);

      // ── TRANSPORT / TEMPO / KEY ──────────────────────────────────────────
      if (/\b(play it|play the beat|hit play|press play|play)\b/.test(s) && !/\bplay (in|a) \w/.test(s)) { A.play(); return { handled: true, reply: "▶ Playing." }; }
      if (/\b(stop|pause|halt)\b/.test(s)) { A.stop(); return { handled: true, reply: "■ Stopped." }; }
      var bpm = s.match(/\b(\d{2,3})\s*bpm\b/) || s.match(/\b(?:bpm|tempo)\s*(?:to|=|of)?\s*(\d{2,3})\b/) || s.match(/\b(?:set (?:the )?tempo to)\s*(\d{2,3})\b/);
      if (bpm) { A.setTempo(+bpm[1]); return { handled: true, reply: "Tempo → **" + (+bpm[1]) + " BPM**." }; }
      var keym = s.match(/\b(?:key (?:of|to|=)?|in)\s+([a-g])\s*(#|sharp|b|flat)?\s*(minor|major|min|maj|m)?\b/);
      if (keym && /\b(key|minor|major|min|maj)\b/.test(s)) {
        var pc = { a: 9, b: 11, c: 0, d: 2, e: 4, f: 5, g: 7 }[keym[1]]; var acc = keym[2] || "";
        if (/#|sharp/.test(acc)) pc = (pc + 1) % 12; else if (/b|flat/.test(acc)) pc = (pc + 11) % 12;
        var sc = /maj/.test(keym[3] || "") ? "Major" : "Minor";
        A.setKey(pc, sc); return { handled: true, reply: "Key → **" + ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][pc] + (sc === "Minor" ? "m" : "") + "**. Everything melodic snaps to it now." };
      }
      if (/\b(swing|shuffle|groove feel)\b/.test(s) && /\b(more|add|increase|\d)/.test(s)) { var sw = (s.match(/\b(5\d|6\d|7\d|80)\b/) || [])[1]; var r = A.swing(sw ? +sw : 62); return { handled: true, reply: "Swing → **" + (r.swing || 62) + "%** — gives it that human bounce." }; }
      if (/\b(humanize|loosen it up|less robotic|more human)\b/.test(s)) { A.humanize(0.3); return { handled: true, reply: "Humanized the selected channel — timing + velocity loosened up." }; }
      if (/\b(randomi[sz]e|surprise me|shuffle it up|switch it up)\b/.test(s)) { A.randomize(); return { handled: true, reply: "🎲 Randomized the pattern — regenerate till one hits." }; }

      // ── RENDER / EXPORT / SEND ───────────────────────────────────────────
      if (/\b(export stems|bounce stems|stem out|split into stems)\b/.test(s)) { A.exportStems(); return { handled: true, reply: "Bouncing stems (drums / bass / melody / loops) — drop them straight into Pro Tools or the Studio. 🎚️" }; }
      if (/\b(export midi|midi out|as midi|\.mid)\b/.test(s)) { A.exportMidi(); return { handled: true, reply: "Exported the MIDI — every note + drum hit, ready for any DAW." }; }
      if (/\b(send (it )?to (the )?studio|into the studio|to demartin audio)\b/.test(s)) { var r2 = await A.sendToStudio(); return { handled: true, reply: (r2 && r2.hint) ? "It's a plugin in the Studio — hit **⤓ Send to Studio** up top and I'll drop the beat onto a track." : "Bounced — pulling it into the Studio." }; }
      if (/\b(bounce|render|export|download)( it| the beat| this)?\b/.test(s) && !/stem|midi/.test(s)) { var r3 = await A.bounce(); return { handled: true, reply: r3 && r3.exported ? "Bounced the beat to a 4-bar WAV ✓ — check your downloads." : (r3 && r3.hint ? "Hit **⤓ Send to Studio** up top to drop it on a track." : "Bounce failed — hit Play first, then try again.") }; }

      // ── VOCAL → INSTRUMENT (the headline) ───────────────────────────────
      if (/\b(chop (up )?(my |the )?(voice|vocal|sample))\b/.test(s)) { var rc = A.vocalToInstrument({ mode: "chop" }); return { handled: true, reply: rc.ok ? "🔪 Chopped “" + rc.name + "” into a Slicer — every step plays a slice; re-sequence the chops in the piano roll." : fail(rc) }; }
      if (/\b(voice|vocal|my voice|sample)\b/.test(s) && /\b(into (an? )?instrument|to (an? )?instrument|as (an? )?(instrument|synth)|playable|make.*(instrument|synth)|vocal ?synth|turn.*(instrument|synth))\b/.test(s)) {
        var rv = A.vocalToInstrument({ mode: "synth" });
        if (!rv.ok) return { handled: true, reply: fail(rv) };
        return { handled: true, reply: "🎤→🎹 Turned your voice into **" + rv.name + "** — tuned to " + (rv.note || "its own pitch") + " and laid an in-key phrase so you can hear it. Play the piano roll and it sings your sample across the keys." + tag(agentId) };
      }

      // ── RECORD ───────────────────────────────────────────────────────────
      if (/\b(record|capture|sample me|lay (down|something) (in|on the mic)|hit record)\b/.test(s) && /\b(record|capture|mic|me|voice|vocal|something)\b/.test(s)) {
        var secM = s.match(/\b(\d{1,2})\s*(?:s|sec|secs|seconds)\b/); var rr = await A.record(secM ? +secM[1] : undefined);
        if (!rr.ok) return { handled: true, reply: fail(rr) };
        if (rr.recorded) return { handled: true, reply: "🎙 Got " + rr.dur + "s — it's a sampler channel now. Want me to turn it into an instrument? Say “make it an instrument.”" };
        return { handled: true, reply: "🎙 Recording… tap ⏺ (or say “stop”) when you're done, then I'll lay it in." };
      }

      // ── SFX ──────────────────────────────────────────────────────────────
      if (/\b(riser|uplifter|downlifter|whoosh|swoosh|impact|braam|sub ?drop|reverse cymbal|vinyl|crackle|build ?up|snare rush|sweep|laser|zap|boom)\b/.test(s) ||
          /\b(sound ?effect|sfx|drop a sound|make a sound|generate a sound)\b/.test(s)) {
        var phrase = sfxPhrase(raw) || "riser";
        var rf = await A.sfx(st.sfxVibe + phrase);
        if (rf.ok) return { handled: true, reply: "🔊 Dropped **" + (rf.kind || phrase) + "** (" + rf.dur + "s, " + (rf.source === "synth" ? "synthesized free" : "ElevenLabs") + ") at the downbeat — move it wherever in the rack." + (rf.source === "synth" ? "" : "") };
        if (rf.needKey) return { handled: true, reply: "That one needs an ElevenLabs key (BYO, in the keys hub) — but I can synth a riser / impact / whoosh / sub-drop / braam / build-up / sweep / vinyl right now, free. Want one of those?" };
        return { handled: true, reply: fail(rf) };
      }

      // ── GENERATE A PART ──────────────────────────────────────────────────
      if (/\b(bass ?line|808 line|give me (a |some )?bass|write (a |the )?bass|lay (a |some )?bass|make (a |the )?bass)\b/.test(s)) { var rb = A.generate("bassline"); return { handled: true, reply: rb.ok ? "🎵 Wrote a bassline on **" + rb.channel + "** — in key, following the chords. Regenerate for another." : fail(rb) }; }
      if (/\b(chords?|progression|harmony)\b/.test(s) && /\b(add|give|write|lay|make|some|a |need|want|put)\b/.test(s)) { var rch = A.generate("chords"); return { handled: true, reply: rch.ok ? "🎶 Laid a chord progression on **" + rch.channel + "** — diatonic, can't pick a wrong chord." : fail(rch) }; }
      if (/\b(melody|topline|riff|lead line)\b/.test(s) && /\b(add|give|write|lay|make|some|a |need|want|put)\b/.test(s)) { var rm = A.generate("melody"); return { handled: true, reply: rm.ok ? "🎵 Wrote a melody on **" + rm.channel + "** — seeded in-key walk, locks to chord tones. Cook it again for a fresh take." : fail(rm) }; }
      if (/\b(hi.?hats?|hats)\b/.test(s) && /\b(add|give|write|lay|make|some|a |need|want|put|pattern|roll)\b/.test(s)) { var rh = A.generate("hats"); return { handled: true, reply: rh.ok ? "🎩 Dropped a hat pattern on **" + rh.channel + "** (Euclidean — those evenly-spread grooves)." : fail(rh) }; }
      if (/\b(arp|arpeggiate|arpeggio)\b/.test(s)) { var ra = A.generate("arp"); return { handled: true, reply: ra.ok ? "⬆ Arpeggiated **" + ra.channel + "**." : fail(ra) }; }
      if (/\b(drum (pattern|groove|beat)|new groove|program (the |some )?drums|write (the |some )?drums|lay (the |some )?drums)\b/.test(s)) { var rg = A.generate("drums"); return { handled: true, reply: rg.ok ? "🥁 Programmed a fresh drum groove — kick / snare / hats, fully editable on the rack." : fail(rg) }; }

      // ── MIX MOVES ────────────────────────────────────────────────────────
      if (/\b(side ?chain|pump( the| it)|duck the bass)\b/.test(s)) { var rp = A.mix("sidechain"); return { handled: true, reply: rp.ok ? "🫷 " + rp.move + " — the low end breathes around the kick now." : fail(rp) }; }
      if (/\b(glue|bus comp|gel|tighten the mix|cohesive)\b/.test(s)) { var rgl = A.mix("glue"); return { handled: true, reply: rgl.ok ? "🩹 " + rgl.move + " — the mix sits as one." : fail(rgl) }; }
      if (/\b(saturat|warm it up|tape|analog|drive the master)\b/.test(s)) { var rs = A.mix("saturate"); return { handled: true, reply: rs.ok ? "🔥 " + rs.move + " — adds harmonics + glue." : fail(rs) }; }
      if (/\b(widen|wider mix|stereo|more width|open it up)\b/.test(s)) { var rw = A.mix("widen"); return { handled: true, reply: rw.ok ? "↔ " + rw.move : fail(rw) }; }
      if (/\b(lo.?fi it|bitcrush|crush it|degrade|dusty)\b/.test(s)) { var rl = A.mix("lofi"); return { handled: true, reply: rl.ok ? "📼 " + rl.move : fail(rl) }; }
      if (/\b(reverb|more space|add space|verb|put it in a room)\b/.test(s)) { var rrv = A.mix("reverb"); return { handled: true, reply: rrv.ok ? "🌫 " + rrv.move : fail(rrv) }; }

      // ── SHAPE A SOUND (sculpt an existing channel) ───────────────────────
      if (SHAPE_DIR.test(s)) {
        var tgt = (s.match(INSTR_WORD) || [])[0] || null;
        var rsh = A.shape(tgt, raw);
        if (rsh.ok) return { handled: true, reply: "Shaped **" + rsh.channel + "** — " + rsh.moves.join(", ") + ". Have a listen." + tag(agentId) };
        // if shape couldn't bite, fall through to add/design/cook
      }

      // ── ADD / DESIGN AN INSTRUMENT ───────────────────────────────────────
      if (/\b(add|give me|gimme|throw in|put in|load|bring in|drop in|i want|i need|need|want|design|create|make me|build me)\b/.test(s) && INSTR_WORD.test(s)) {
        var phraseI = instrPhrase(raw);
        // descriptive adjective(s) + an instrument → DESIGN it; bare name → ADD it
        if ((TONE_ADJ.test(s) || /\b(design|create|make me|build me)\b/.test(s)) && !/^(a |an )?(808|kick|snare|hat|clap|cowbell)\b/.test(phraseI)) {
          var rd = A.designInstrument(phraseI || raw);
          return { handled: true, reply: rd.ok ? "🎛️ Designed **" + rd.name + "** — dialed the knobs to that vibe. It's selected; tweak it in its window." + tag(agentId) : fail(rd) };
        }
        var rai = A.addInstrument(phraseI);
        if (rai.ok) return { handled: true, reply: "➕ Added **" + rai.name + "**" + (rai.cat ? " (" + rai.cat + ")" : "") + " — it's on the rack, ready to sequence." };
        return { handled: true, reply: fail(rai) };
      }

      // ── COOK A WHOLE BEAT ────────────────────────────────────────────────
      if (/\b(make|cook|build|produce|create|whip up|start|give me|need|want)\b.*\b(beat|track|instrumental|trap|drill|boom.?bap|lo.?fi|house|r&b|rnb|afro|hyperpop|phonk|plugg|pop|trap soul)\b/.test(s) ||
          /^\s*(cook|make a beat|cook a beat|cook it up|surprise me)\b/.test(s) ||
          /\b(in the style of|type beat|kind of beat)\b/.test(s)) {
        var spec = { vibe: raw, energy: st.energy };
        var rco = A.cook(spec);
        return { handled: true, reply: "🍳 Cooked you a beat — drums, an 808 on the chords, a progression + a melody, all in key. Hit ▶ and flip it. Want a different vibe? Just say it." + tag(agentId) };
      }

      return { handled: false };   // not a clear command → the brain answers
    } catch (e) { try { console.warn("[beat-dock]", e); } catch (_) {} return { handled: false }; }
  };

  try { console.info("[Leon] beat-dock ready — the agent can make beats, build/design instruments, voice→instrument, drop SFX, shape & mix, by command."); } catch (e) {}
})();
