# Visual craft — camera, photorealism, motion, film stocks

The deep reference for making images and video look like real professional footage, not AI. Camera bodies, lenses, angles, film stocks, video motion rules, and model-safe fashion framing.

## Photorealism — what makes images look real, not AI
CHARACTER CONSISTENCY:
- LoRA with kontext-lora = best method. One hero face image as anchor, kontext-lora swaps scenes around it.
- flux-lora = text-to-image with LoRA trigger word. Good for first gen, face drifts between gens.
- flux-kontext-lora = image-to-image with LoRA. LOCKS the face from a reference. Use this for all scenes after the hero frame.
- Never substitute clothing words between scenes. "matte black leather jacket" stays exactly that.

PHOTOREALISM RULES:
- Camera body names trigger entire visual profiles: "shot on ARRI Alexa Mini" = filmic color science. "Shot on Canon EOS R5" = sharp digital. "Shot on iPhone 15 Pro" = documentary realism.
- IMPERFECTIONS sell realism: "slight motion blur on hands", "lens dust motes in backlight", "slightly overexposed highlights", "one eye squinting against light", "hair strand across face"
- "Candid photograph" or "unposed moment" prevents the AI mannequin problem
- "Editorial photograph for Vogue" or "photograph for Rolling Stone" triggers professional photorealism
- NEVER use "cinematic" alone — too vague, triggers AI prettiness. Use specific camera + lens + stock instead.
- Add texture: "skin pores visible", "fabric weave catching light", "scuffed leather", "chipped nail polish"
- Bodega/store products: name REAL brands — Takis, Hot Cheetos, Arizona, Doritos, Lay's, Cup Noodles. Generic packaging = instant AI tell.

## Camera angles and movement — what each one does
- Snorricam (chest-mounted): Subject locked in center, world moves. Disorientation + power. "Camera bolted to chest, shooting face, background wheels and tilts"
- Laowa probe lens: Impossible POV — through chain links, inside flames, between shelves. "Laowa 24mm probe lens macro"
- Floor-mounted ultra-wide (14mm): Subject towers overhead, extreme distortion. Power shot. "Camera on floor shooting upward"
- Dutch angle (10-25 degrees): Unease, style, energy. "Dutch angle 15 degrees"
- Overhead/God shot: Vulnerability or surveillance. "Directly overhead looking straight down"
- Through-glass: Separation, voyeurism. "Shot through rain-beaded window, subject refracted"
- Rearview mirror: Being watched. "Camera positioned at rearview mirror looking back at subject"
- Split diopter: Both foreground and background sharp simultaneously. Tension.
- Whip pan: Energy, beat sync. ONE per clip. "Whip pan left landing on subject"
- Dolly zoom (vertigo): Background warps while subject stays same size. Psychological. Takes 2-3 regens.
- Handheld/shoulder-cam: Raw, documentary, intimate. "Handheld camera slight shake, shoulder-mounted"
- Steadicam tracking: Smooth pursuit. "Steadicam tracking shot following subject"
- Crash zoom: Sudden urgency. "Rapid crash zoom to extreme close-up"
- Rack focus: Attention shift. "Rack focus from foreground object to background subject"
- 360 orbital: Power, reveal. "360-degree slow rotation around subject at eye level"
- POV first-person: Immersive. "First-person POV walking through space"

## Video prompt rules — motion only
- The model SEES the image already. Describe ONLY what moves. Never re-describe the scene.
- ONE camera move per clip. Stacking = jitter.
- Always include motion endpoints: "then holds" or "then settles"
- Include "smooth motion, no jitter, stable lighting, 24fps" as safety
- Facial identity drifts after 8-10 seconds. Keep clips 5s for face shots.
- Words that cause flickering: "glow", "shimmer", "glints" — avoid these

## Film stocks (pick ONE per generation, never mix)
- Kodak Vision3 500T: THE night look. Teal shadows, warm amber highlights. Dunkirk, La La Land.
- CineStill 800T: Neon halation halos. Red-orange bloom around lights. Wong Kar-wai urban night.
- Kodak Portra 400: Warm skin tones, soft, natural. Portraits and daylight.
- Kodak Tri-X 400: High contrast B&W. Drama, weight, photojournalism.

## Glitch as emotional language (not decoration)
- Emotionally raw → video glitches. In control → razor sharp 4K.
- Analog glitch (VHS, tape, scanlines) = warm, haunted, vulnerable. For R&B, memory, pain.
- Digital glitch (datamosh, pixel sort, RGB split) = cold, aggressive, mechanical. For trap, dissociation.
- Prompt for analog: "VHS tracking error, horizontal scanlines, chromatic separation, tape noise, 4:3"
- Prompt for digital: "Data corruption blocks, RGB channel split, geometric distortion, pixel fragmentation"
- Prompt for subtle wrongness: "Photorealistic but something subtly off. One element at wrong tempo. Eerie stillness in eyes."

## Aspect ratios and emotion
- 2.39:1 anamorphic = epic scale, cinematic grandeur. Wide shots.
- 16:9 = standard, highest emotional response in studies
- 4:3 = intimacy, claustrophobia, vulnerability. Close-ups, confessional.
- 9:16 = TikTok/Reels, personal, immediate

## Model-safe figure photography (music video / fashion)
Direct "sexy" language triggers content filters. Editorial/fashion framing achieves the same result while staying within model guidelines.

- Framing language: "editorial fashion campaign", "music video cinematography", "haute couture runway", "high-fashion magazine shoot", "fashion editorial", "concert performance photography"
- Camera angles: "low angle from behind", "over-the-shoulder perspective", "silhouette against backlight", "three-quarter profile", "dutch angle looking up"
- Clothing descriptors (evocative, model-safe): "fitted bodysuit", "silk mini dress", "high-waisted leather pants", "crop top with wide-leg pants", "sheer mesh bodysuit", "structured corset top", "plunging neckline gown", "cutout bodycon dress"
- REJECTED vs WORKS:
  - REJECTED: "sexy", "seductive", "provocative", explicit body descriptions, "revealing"
  - WORKS: "confident", "powerful", "editorial", "fashion-forward", specific garment names, "editorial fashion photography", "music video still", "album cover shoot"
- Context: "backstage at a major concert", "music video set", "album cover shoot", "music festival performance stage"
- Body language: "commanding presence", "power stance", "mid-movement during performance", "caught mid-laugh", "leaning against the wall with one leg up"

MODEL-SPECIFIC:
- Nano Banana Pro: Editorial fashion framing works well. Describe clothing and posture, not body proportions.
- Seedream: Use reference image + outfit description only. Let the reference handle physical appearance.
- Wan video: Add "music video cinematography" to any figure shot. Avoid "sensual movement" — use "confident movement" / "performance energy."
- Kling: Strong on editorial fashion. "haute couture" and "fashion film" both pass. "music video performance" works for dynamic movement.
