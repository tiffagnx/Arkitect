# Consistent content pipeline — same character across a whole world

How to make a character that stays the same face, same world, same look across dozens of images and video clips — the thing most creators get wrong. Consistency is locked at the ANCHOR IMAGE level, not the prompt level.

## The 4-layer stack
LAYER 1 — THE HERO FRAME (Flux Kontext)
- Generate ONE perfect hero image of your character. This is the bible.
- Every subsequent image uses flux-kontext-lora as img2img — it extracts the face/identity from the hero frame and places it in ANY new scene
- The face never drifts because the reference is always the same source image. This is the anchor. Everything flows from this.

LAYER 2 — SCENE GENERATION (Nano Banana Pro + Flux Kontext)
- Generate all scene images using the hero frame as reference — different environment, same exact face
- Stack up to 14 reference images in one Nano Banana call (multi-ref)
- Use explicit index referencing: "the person from the first image" in the new environment

LAYER 3 — VIDEO ANIMATION (Kling "Bind Subject" / Seedance ref2v)
- Kling: use "Bind Subject" (Element Reference) in image-to-video mode — locks character identity across clips
- Seedance ref2v: upload hero frame as @Image1, a reference video clip as @Video1 for camera-movement style, and the beat/audio as @Audio1 — it syncs motion to the music automatically
- Result: every video clip has the same character + synced to the same beat

LAYER 4 — WORLD BIBLE (the move nobody does)
Build a visual bible BEFORE generating anything:
- Hero frame (locked)
- Color grade bible (same shadow/midtone science across every piece)
- Location set (3-5 locked environments — same alley, same rooftop, same room)
- Prop set (same objects appearing across content = visual continuity)
- Camera movement style guide (one or two signature moves used consistently)

## Prompting rules for consistency
- Never describe the character's face in prompts when a reference image is provided — the image IS the description
- Use explicit index referencing for multi-ref: "the person from the first image" NOT "a woman with braids"
- Lock color grade language across all prompts in a series: same film stock, same color science, same lighting vocabulary
- Lock camera vocabulary: if the series uses "slow dolly push" as its signature, use it in 60%+ of scenes
- Environment descriptions should reference the SAME locations by name: "the same rain-slicked alley from scene 1" NOT "a dark alley"

## Seedance ref2v audio-sync workflow
1. Upload hero frame as @Image1
2. Upload reference video clip as @Video1 (for camera movement style)
3. Upload the audio track as @Audio1
4. Seedance syncs motion to the beat automatically
5. Result: character-consistent, beat-synced video clip in one API call

## Kling Bind Subject workflow
1. Generate hero frame (locked anchor image)
2. In image-to-video, enable "Bind Subject" / Element Reference
3. Upload hero frame as the bound element
4. Generate any number of clips — character identity locked across all of them
5. Cut together in post — seamless character continuity

## The move nobody is doing
Cross-episode narrative content — a character who LIVES across 20+ pieces with the same face, same locations, same color grade, same camera style. Not a music video. Not an album cover. A whole WORLD. Episode 1 through 8 all feel like the same cinematographer shot them, so the audience builds emotional connection to a consistent character. A short-film series with no actors, no crew, no budget — just the pipeline.

Rough cost for a full episodic series: hero frame ~$0.15, per-scene image ~$0.15 (Flux Kontext img2img), per 5s video clip ~$0.08–$1.12 by model. An 8-episode series at 10 clips/episode ≈ $67–$90 in video costs. A full professional narrative series for under $100.
