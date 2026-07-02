# Image generation — prompting craft

Real, tested prompting knowledge for the image models (Flux, Hunyuan, Nano Banana / Seedream). How to get professional, photoreal, consistent images out of them.

## Flux image prompt syntax
FLUX PROMPT ENGINEERING (flux-dev, flux-schnell, flux-pro)

CORE PRINCIPLES:
- Front-weight important elements — Flux prioritizes tokens at the start of the prompt
- No native negative prompts — use affirmative language ("clear skin" not "no acne")
- Be specific with camera gear for photorealism: "shot on Canon EOS R5, 85mm f/1.4, natural light"
- Aspect ratio matters: 1:1 for portraits, 16:9 for cinematic, 9:16 for mobile/social

WHAT WORKS:
- Detailed scene descriptions with lighting: "golden hour backlight, volumetric haze"
- Style references: "in the style of editorial Vogue photography"
- Texture keywords: "film grain, shallow depth of field, bokeh"
- Color grading terms: "teal and orange color grade, desaturated shadows"

MODEL DIFFERENCES:
- flux-schnell: Fast, good for iteration. Less detail adherence. Keep prompts shorter (50-80 words)
- flux-dev: Best quality/control balance. Handles complex prompts (100-150 words). Use for final outputs
- flux-pro: Highest quality but expensive. Use for hero shots

WHAT BREAKS:
- Overly long prompts on schnell (gets confused past 80 words)
- Contradictory instructions ("bright and dark simultaneously")
- Too many subjects without clear spatial relationships

## Hunyuan image generation
CORE APPROACH — ENUMERATE, DON'T DESCRIBE:
- Instead of "a beautiful woman in a garden" → "1 woman, black hair, white dress, rose garden, stone path, golden hour, soft focus background"
- Hunyuan responds better to lists of attributes than flowing prose

ATTRIBUTE BINDING:
- Explicitly assign attributes to subjects: "woman wearing [red dress], man wearing [blue suit]"
- Use spatial language: "foreground: flowers, midground: subject, background: mountains"

WHEN TO USE vs FLUX:
- Hunyuan: Better for anime/illustration styles, multi-character scenes, text rendering in images
- Flux: Better for photorealism, single-subject portraits, editorial/fashion

STRENGTHS:
- Text-in-image (signs, logos, titles) — far superior to Flux
- Consistent style across multiple generations
- Handles complex multi-element scenes without confusion
- Good at specific art styles when named explicitly

WEAKNESSES:
- Photorealism not as convincing as Flux-pro
- Can over-saturate colors — add "natural colors, subtle palette" if needed

## Image generation behavior rules
AFTER GENERATING AN IMAGE:
- Say "Here ya go — it's also in your gallery if you need it later."
- Do NOT say "check your gallery", "check the gallery", "go to gallery", or "it's generating now"
- The image appears RIGHT IN THE CHAT — the user can already see it
- Comment on the image naturally, don't send them somewhere else

SELF-PORTRAIT WORKFLOW ("make image of me"):
- "ME" means THE USER talking to you, NOT the assistant
- When they say "make image of me" — that is THEIR face
- If they did NOT describe what they want (outfit, setting, style), ASK FIRST: "What's the vibe? Streetwear? Suited up? Casual? Tell me how you wanna look."
- Only generate immediately if they already described what they want
- Say "here's you" — you are making THEIR portrait

STYLING RULES — NON-NEGOTIABLE:
- MATCH THE PERSON in the reference photo
- If the reference shows a masculine person: masculine clothing ONLY (hoodie, jacket, jeans, sneakers, chain). NO painted nails, NO makeup, NO feminine jewelry, NO feminine accessories, NO long nails
- If the reference shows a feminine person: feminine or neutral clothing. Match their energy
- NEVER cross-style unless the user SPECIFICALLY asks for it
- When in doubt, look at the reference photo and match what they are already wearing

HAIR — ABSOLUTE RULE:
- If the reference photo shows someone BALD, they stay BALD. Do NOT add hair. Do NOT add locs. Do NOT add braids. Do NOT imagine hair. BALD IS BALD.
- If they have short hair, it stays short. If they have long hair, it stays long.
- NEVER change, add, or modify hair unless the user specifically requests it
- The reference photo is the TRUTH about how they look

PROMPT QUALITY:
- Every image should look like professional photography
- Use specific camera + lens (Sony A7IV 85mm f/1.4, Kodak Portra 400)
- Dramatic lighting setups, shallow depth of field, film grain
- Never flat lighting, never white backgrounds, never generic

## Fashion & wardrobe vocabulary for AI generation
COMPREHENSIVE FASHION VOCABULARY FOR AI IMAGE GENERATION

STREETWEAR: oversized hoodie, baggy cargo pants, chunky sneakers (Jordan 4s, Dunks), bucket hat, crossbody bag, graphic tee, distressed denim, layered chains
Prompt: "streetwear aesthetic, oversized silhouette, Nike Dunks, graphic hoodie, urban backdrop"

HIP-HOP/TRAP: designer chains, oversized fur coat, Gucci/LV belt, fitted cap, grillz, diamond studs, baggy jeans, Jordans, mink coat
Prompt: "trap aesthetic, heavy gold chains, designer labels, luxury streetwear, dark moody lighting"

HAUTE COUTURE: architectural silhouettes, avant-garde shapes, structured shoulders, floor-length gowns, metallic fabrics, dramatic trains
Prompt: "haute couture runway, architectural fashion, avant-garde silhouette, editorial lighting"

EDITORIAL/GLAM: silk slip dress, lace bodysuit, sheer fabrics, strappy heels, smoky makeup, body chains
Prompt: "editorial fashion photography, silk and lace, soft studio lighting, beauty campaign aesthetic"

DARK ACADEMIA: tweed blazer, turtleneck, pleated skirt, oxford shoes, wire-rim glasses, leather satchel, earth tones
Prompt: "dark academia aesthetic, tweed and leather, warm library lighting, autumnal palette"

CYBERPUNK/TECHWEAR: tactical vest, cargo joggers, face mask, LED accents, matte black fabrics, utility straps, combat boots
Prompt: "techwear cyberpunk, tactical utility vest, neon accent lighting, matte black, futuristic urban"

K-FASHION: oversized blazer, wide-leg pants, minimal jewelry, clean lines, neutral palette, platform shoes
Prompt: "Korean street fashion, clean minimalist, oversized silhouette, soft natural lighting"

CONSISTENCY RULE: When generating multiple images of the same character, copy-paste the EXACT wardrobe description. Never paraphrase clothing — use identical words every time.

## Sprite sheet protocol (Nano Banana / Gemini Flash Image)
TRIGGER: "make a sprite sheet" / "spritesheet" / "sprite this." That is the whole warrant. NEVER ask about layout, background, or style — locked defaults below. The user supplies only the ACTION + EXPRESSION (+ optional frame count or wardrobe pin).

TOOL REALITY: generated in Nano Banana (Gemini Flash Image). It builds the whole sheet as ONE image. These are its quirks — apply ALL of them silently, every gen:

1. SQUARE GRIDS ONLY. Banana thinks in squares: 4 frames = 2x2, 9 = 3x3, 16 = 4x4. DEFAULT 9 (3x3). Never 4x3 or other non-square layouts — #1 cause of drift and merged frames. Never more than 16; 2-3 rows max.
2. FEWER FRAMES = BETTER CONSISTENCY. Drift climbs with frame count. If 9 reads stiff or the character morphs, go DOWN to 4 (2x2) and crank the motion harder per cell — never up. Low frame counts hold identity.
3. PURE GREEN, STATED VERBATIM, EVERY TIME: background is EXACT hex #00FF00 (RGB 0,255,0), declared as a CRITICAL block — no gradients, no shadows, no noise, no texture, no lighting variation. Banana CANNOT do transparency — asking gives checkerboard garbage. Restate the full green block on every gen; it does not remember the last one.
4. WHITE OUTLINE: a clean white border 2-3 pixels wide around every sprite in every frame, fully separating sprite from green with no gaps — it makes the downstream chroma key cut clean.
5. CAPTION EVERY CELL, ROW BY ROW — the whole game for idle/subtle motion. Vibe words ("breathing, blinking") produce identical frames. Spell each frame's exact pose: "Row 1, left to right: ..." through the last row. For subtle motion, EXAGGERATE the delta per frame — Banana flattens motion, so over-describe it.
6. IDENTITY IN THE FIRST 10 WORDS. Lead with the character's locking traits (skin, hair, key features) before anything else — Banana locks identity early; bury it and the face drifts.
7. SAME VIEWPOINT EVERY CELL (straight-on or 3/4 — pick one and say it). Camera changes are hidden drift fuel.
8. ATTACH THE REFERENCE AND COMMAND IT: upload the identity image + "Follow the structure and character of the attached reference image exactly." Restate the wardrobe pin in text too — never trust the image alone.
9. ONE VARIABLE AT A TIME when iterating: pose OR expression OR background. Multiple changes at once = drift.
10. MANDATORY NEGATIVE LINE every gen: "no blurriness, no grid lines between cells, no character inconsistency, no cropped limbs, no single large character, no transparent background."
11. CLOSING HAMMER, ALWAYS THE LAST LINE: "Output the assembled [N]x[N] grid as ONE image, NOT a single character render." Recency makes it stick — this stops Banana handing back one big figure.
12. 80% THERE? EDIT, DON'T RESTART. Banana does conversational editing — "fix the arm length in row 2, frame 3" beats regenerating the sheet.

Full-body head-to-boots in every cell, same outfit/colors/scale/vertical centering across all frames. Body stays LOCKED unless the action is travel (walk/run) — only the limbs/face named in the action change. Action → build the frame breakdown (neutral → peak → return → settle). Expression → payoff beat in the back frames.

## Animate a character or scene into a loop, or chain a new action (sprite frame-by-frame editing, Nano Banana Pro Edit)

TRIGGER: "animate this character," "animate this scene," "make it loop," "make it move," "keep it going," "have him now [do X]," "continue the animation," "extend this scene," "chain the next action." This is DIFFERENT from the sprite sheet protocol above — that builds many poses as ONE grid image; this animates ONE existing image forward, frame by frame, each edit seeded from the last, to make it loop or to chain a new action onto where the last one ended (jump lands → now walking → now smoking), or to extend a background scene (walk further down the street, new stuff appears).

1. NEVER CHAIN OFF THE LATEST FRAME ALONE. This is the #1 documented cause of drift (Google's own multi-turn-consistency guidance, academic anti-drift work). Every edit call after the first attaches TWO reference images: the ORIGINAL frame (the identity anchor) AND the current/latest frame (where it is right now). Say so explicitly: "image 1 is the original [character/scene] — the true identity anchor. Image 2 is the current frame." Nano Banana Pro Edit supports up to 5 character references / 14 images total per call, so two is well within range.
2. QUOTE THE LOCKED DESCRIPTION VERBATIM, EVERY CALL. Never re-summarize or paraphrase a trait differently between edits ("emerald eyes" one call, "green eyes" the next = drift). Reuse the character/scene's original description word-for-word each time.
3. "PIXEL-IDENTICAL," NOT "SIMILAR." State plainly what must not change: "keep the camera angle, framing, crop, and background pixel-identical to the references. Do not crop, zoom, recompose, or change the aspect ratio." Nano Banana Pro CAN recompose a shot as a "creative improvement" if you don't explicitly forbid it — this line is load-bearing, not filler.
4. ONE CHANGE PER STEP. A single explicit motion instruction per edit, never stacked changes ("now he waves AND the lighting shifts AND he turns" = pick one, do the rest next call).
5. NO DENOISE/STRENGTH KNOB EXISTS FOR THIS MODEL. That's a Stable-Diffusion-family parameter — Nano Banana has nothing like it. The prompt text is the ONLY lever for how much an edit preserves vs. changes. Lean on rules 1-4, not a numeric setting that isn't there.
6. DRIFT BUDGET (Nano-Banana-specific, sourced): roughly 10 chained frames = strong consistency, 25 = minor drift starts showing, 50+ = re-anchoring becomes necessary. Past ~10-15 chained edits in one sitting, prefer a FRESH restart (regenerate from the original + a full written description) over pushing the chain further — this is Google's own stated fallback for visible drift, not a workaround we invented.
7. CLOSING A LOOP (playback wraps last frame → first frame): on the FINAL edit of a loop, ease the pose back toward the original frame's exact pose — "close the gap, don't fully snap to it yet." Flag honestly: this exact move isn't a documented Nano Banana pattern (it's real for diffusion-video tools like AnimateDiff's "closed loop," adapted here) — it's a reasoned technique, not a guaranteed one. Skip this step entirely when chaining separate actions (jump→walk→smoke) — those aren't meant to loop back to the start.
8. CHAINING A NEW ACTION FROM A HANDOFF FRAME (jump lands → now walking): treat the handoff frame as a HARD anchor, not loose inspiration — "the attached image is exactly where the character is right now; begin the new action from this precise pose, position, outfit and lighting, with no reset." A visible seam ("sludge") at the handoff point is a known, industry-wide limitation with no full fix at the generation step — set that expectation rather than promising a perfect cut; a short crossfade at the edit/timeline level is the honest mitigation, not another regeneration attempt.
9. SPRITE-GRID vs. CHAINING — pick the right tool: need 8 distinct POSES of a new character (idle/walk/run/jump/dance/point/pose/crouch) as a reference sheet? Use the sprite-sheet grid protocol above. Need to take ONE pose and turn it into smooth MOTION, or continue an existing sequence into a new action? Use this chaining protocol. Don't force one into the other's job.
