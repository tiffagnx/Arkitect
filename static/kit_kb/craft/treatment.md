# Treatment & creative direction craft

How to build a music-video treatment: translate the song into visuals, structure the scenes, write the image/video prompts, and direct the artist.

## Treatment pipeline format
Every scene has both an [IMAGE] and a [VIDEO] block. Scene headers: **SCENE {NUMBER} [{TIMESTAMP}] — {TITLE}** followed by **CAST: {LETTERS}** where letters match cast reference slots (A, B, C…). Multiple cast members use commas (CAST: A, C). No cast reference needed → CAST: NONE.

SCENE NUMBERING: use the real scene number, not sequential. If redoing scenes 3, 7, 13 from a 25-scene treatment, write SCENE 3, SCENE 7, SCENE 13 — the parser reads the actual number.

[IMAGE] PROMPTS: 50-150 words. Camera angle, lens specs, lighting direction, color science, physical environment. A strong color signature (e.g. teal shadows / amber midtones / a violet accent, never true black) keeps the whole treatment cohesive.

[VIDEO] PROMPTS: start with camera movement as the FIRST words. Include subject motion, environment motion (wind, water, particles), speed modifiers, and ambient audio direction at the end. Add "no dialogue, mouth closed" for scenes with visible faces unless dialogue is intended. End every motion with a defined endpoint.

CAST SYSTEM: letters A-Z map to uploaded reference photos. CAST: A → use reference photo A. CAST: A, B, C → all three appear. The parser assigns the correct reference photos during generation.

## Treatment & storyboard — 7-step process
1. CONCEPT — one-sentence thesis. What feeling/story/message?
2. VISUAL WORLD — color palette, lighting style, texture. Consistent across all clips.
3. SHOT LIST — 5-15 clips with specific framing per shot.
4. TIMING — map clips to music beats/sections (verse, chorus, bridge).
5. TRANSITIONS — how clips connect (cut, dissolve, match-cut on motion).
6. GENERATE — one clip at a time, reference the visual world each time.
7. ASSEMBLE — timeline, grade consistently with one LUT.

VISUAL CONTINUITY RULES: same color palette keywords in every prompt; same lighting setup each time; same "shot on [camera]" reference; character descriptions verbatim across clips; spatial consistency (if the subject is on the left, keep them there).

MUSIC VIDEO TIMING: Verse 16 bars ≈ 30-45s (narrative/storytelling) · Chorus 8 bars ≈ 15-25s (visual peak, most dynamic) · Bridge 4-8 bars (change of scenery, emotional shift) · Intro/Outro (establishing or resolving).

MULTI-CLIP: generate 2-3 options per shot, pick the best; save working prompts for reuse; grade all clips with the same LUT; align cuts to the beat.

## Audio-to-visual translation
BPM → editing pace:
- 60-80 BPM (ballad/pain): slow cuts, 4-8s per shot, long holds, breathing room
- 80-100 BPM (mid-tempo/vibe): 2-4s cuts, smooth transitions, gentle movement
- 100-130 BPM (energy/dark pop): 1.5-3s cuts, dynamic movement, push-ins
- 130-160 BPM (hype/trap): 1-2s cuts, rapid-fire, hard cuts on the snare
- 160+ BPM (punk/rage): sub-1s cuts, flash frames, whip pans, handheld chaos

Key/mode → color temperature: major = warm (amber, gold, warm whites); minor = cool (teal, blue, desaturated); dorian/mixolydian = earth tones, natural light; diminished/chromatic = high contrast, neon, unnatural color.

Dynamics → shot scale: quiet/sparse = wide, environmental; building = medium, closing in; peak/loud = close-ups, macro; drop/silence = snap to wide or black.

Vocal style → camera: whispered/intimate = shallow DOF, handheld micro-movements, close; belting/powerful = steadicam, wide, let the performance fill the frame; rapid-fire/aggressive = tracking, push-ins, unstable handheld; melodic/dreamy = slow motion, dolly, smooth glides.

Mapping shorthand: kick drums → camera shake · snares → cuts · bass → color saturation shift · vocals → lip sync or text overlays · hi-hats → particle effects or light flickers.

## Creative direction — how to guide an artist
- Subtraction over addition: when something isn't working, ask "what would you remove?" before adding more (Rick Rubin's core principle).
- Cross-domain references: pull from outside music. "This verse has the pacing of a Tarantino monologue." "Your cover art should feel like an A24 poster, not an album cover." Artists respond to unexpected references.
- Strategic praise: when something genuinely hits, say WHY. "That third bar works because the internal rhyme creates density without sacrificing clarity" — not just "that's fire." Specific praise builds trust so criticism lands harder.
- Energy calibration: match the artist's energy before redirecting it. Hype → match first, then steer. Hurting → be present first, then create.
- AI honesty: be straight about what AI can and can't do. Vulnerability and lived experience can't be generated — that's the artist's job.
- The specificity paradox: push toward specific imagery over generic emotion. "You left your hoodie on the back of my chair" connects harder than "I miss you every day." The more detailed the lyric, the more universally relatable.
