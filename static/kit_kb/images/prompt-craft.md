# Writing great image prompts (Tiff's craft)

## Image prompt structure
Build every image prompt in this order: SUBJECT → ACTION/POSE → ENVIRONMENT → LIGHTING → STYLE/CAMERA. Front-load the most important words in the first 5–10 — image models weight the start of the prompt the heaviest. Write in natural phrases/sentences (about 30–80 words), not a long pile of comma-separated tags. One clear subject beats five fighting for attention. Example: "A weathered fisherman mending a net on a fog-soaked dock at dawn, cold blue light breaking into warm gold on the horizon, shot on a 50mm lens, shallow depth of field, muted film tones." Say what you actually want to SEE, concretely.

## Photoreal: name real gear + real light
For photo-real results, talk like a photographer, not a render engine. Name a real camera/lens vibe (35mm, 50mm, 85mm; f/1.8 for shallow background blur vs f/8 for everything sharp), a film stock or era ("Kodak Portra 400", "1970s film", "shot on a phone at night"), and describe the LIGHT precisely — direction beats adjectives: side-lit, backlit, golden hour, overcast soft light, a single hard key. Add ONE imperfection cue (film grain, slight motion blur, real skin texture, a touch of lens flare) — flawless reads as fake. AVOID the AI-tell words that make every image look generic: "cinematic, hyperrealistic, 8K, masterpiece, ultra-detailed, award-winning, stunning, epic." They add the AI look, not detail.

## Color, mood, and style
Describe color with intent: a concrete palette or even a HEX value ("teal-and-orange grade", "desaturated cold steel and rust", "#1a2b4c deep navy") beats vague "beautiful colors". Anchor a real aesthetic by naming a craft or reference, not a feeling — "shot like a 90s music video", "Saul Leiter street photography", "Kodachrome travel slide", "Wes Anderson symmetry and pastels". Keep the mood IN the light and the color, not in empty hype adjectives.

## Multiple subjects + getting details right
With two or more subjects, ENUMERATE them and bind each attribute with its own short clause so they don't blend together: "a tall man in a red leather jacket on the LEFT, and a woman with silver braids in a green dress on the RIGHT, facing each other." Use explicit spatial words — left, right, foreground, background, behind. Hands, readable text, and big crowds are where image models break: keep hands simple or partly hidden, keep any on-image text down to a few words, and don't over-stuff a single frame.

## Image-to-image / edit prompts
When editing FROM a reference image, describe ONLY what to change — "give him a denim jacket and move him to a neon-lit street at night, keep his face and pose." The model already has the rest; re-describing the whole scene fights the source. For a consistent character across many images, lock the look once (a clear reference, or a tight description of face, hair, build, wardrobe) and reuse that EXACT wording every time so the character doesn't drift.

## Aspect ratio + what each is for
Match the shape to the use: 1:1 for avatars/album art, 16:9 for wide/cinematic/landscape, 9:16 for phone/Reels/TikTok/stories, 4:5 for an Instagram feed portrait, 3:2 or 2:3 for classic photo framing. Composition follows the frame — for 9:16 think vertical subject and headroom; for 16:9 think horizon, depth, and negative space. Pick the ratio before writing the scene so the composition fits it.
