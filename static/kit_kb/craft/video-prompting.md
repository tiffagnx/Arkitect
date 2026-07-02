# Video generation — prompting craft

How to prompt the AI video models (Kling, Seedance, Wan) for clean, professional motion. Which model to use when, camera rules, and the first-last-frame method.

## The core video prompt rules (all models)
RULE 1: Camera direction MUST be the FIRST words of every video prompt. The first motion keyword gets the strongest weight. Never bury camera direction in the middle or end.

RULE 2: Maximum TWO simultaneous camera movements (ONE is safest). Three or more breaks the output. Connectors: "while" / "as" for simultaneous (dolly forward while tilting up), "then" for sequential (static shot, then slowly dollies forward).

RULE 3: Every motion prompt MUST have a defined endpoint. Add "then settles into position" or "then holds." Open-ended motion causes generation to hang at 99%.

RULE 4: For image-to-video, describe MOTION ONLY — never describe what's in the image. The image already has the visuals. The prompt controls what MOVES and HOW.

RULE 5: Use ++double plus++ emphasis around the focal element to force priority: "++Las Vegas Bully++ steps forward, camera tracks alongside."

HIGH-RELIABILITY CAMERA KEYWORDS: slow dolly push-in, dolly forward, dolly back, pan left/right, tilt up/down, crane shot rising, orbital shot around, tracking shot following, crash zoom, FPV drone shot, whip pan, Dutch angle, rack focus, Steadicam follow, handheld shoulder-cam, POV, static shot, bullet time.

SPEED CONTROL: "slow motion transitioning to normal speed" for ramps. Beat timestamps for temporal control: "Beat 0-3s: slow motion, Beat 3-5s: SNAP to full speed." Generate at 60fps for post-production speed ramps.

STYLE ANCHORS (2-3 max): Roger Deakins, Denis Villeneuve, Christopher Nolan, David Fincher. Film stock: "shot on 35mm with warm grain", "anamorphic lens flare", "digital cinema shallow DOF."

IMPOSSIBLE MOVES THAT WORK: Dolly zoom/vertigo (subject stays same size, background warps), corridor push, inward spiral orbit, corner swing reveal, cosmic hyper zoom (space to street level).

PROMPT STRUCTURE: Camera Movement → Subject Action → Environment Details → Speed/Style → Audio Direction → Motion Endpoint. Keep under 150 words. Shorter prompts give each word more weight.

## Prompt-only vs generate (costs real money)
When the user says "make me a prompt", "write the prompt", "prompt only", "just the prompt", "give me the prompt", "draft a prompt", "suggest a prompt" or ANY variation asking for a prompt — DO NOT generate. Write the prompt as plain text in the chat only; the user pastes it in themselves. Only generate when they explicitly say "generate", "create it", "make the image/video", "make it", "go ahead", or "do it". If the word "prompt" appears in their request, that means TEXT ONLY. Every accidental generation costs real dollars.

## Kling 3.0 — camera craft
NATIVE 4K @ 60FPS — keywords: "4K resolution, 60fps, ultra-sharp"
- Motion endpoints are CRITICAL — describe start AND end positions: "Camera starts low angle, rises to eye level as subject approaches"
- Multi-shot timestamp format: [0s] opening wide, [2s] medium close-up, [4s] detail insert
- Tiers: kling-v2 (standard, 720p-1080p) · kling-pro (native 4K, best motion coherence, use for finals)
- STRENGTHS vs Wan: better face consistency across longer clips, handles multiple subjects, superior "talking head" content, more predictable camera moves
- WEAKNESSES: less dreamlike than Wan for abstract; motion can feel "smooth but generic" (add specifics); struggles with very fast action
- PRO: use explicit composition ("rule of thirds, subject left of frame"), specify lens ("35mm wide angle" vs "85mm telephoto compression")

## Seedance 2.0 — when and how
Premium model (~$1.51/5s std, ~3x Kling). Only recommend when the user needs what it does better.

USE SEEDANCE WHEN: beat-synced music video (upload audio, video syncs to beats — NO other model does this) · reference images/videos for style match (ref2v: up to 9 images + 3 videos + 3 audio) · multi-shot narrative in one gen (timeline [0s][3s][6s] beats) · lip-synced dialogue in multiple languages (spoken words in "double quotes") · 15-second clips (Kling maxes at 10s) · native stereo audio generated WITH the video.

USE KLING INSTEAD WHEN: 4K output (Seedance maxes at 720p on FAL) · budget-conscious (Kling ~3x cheaper) · fastest turnaround · realistic physics/fluid (water, fire) · the shot has a weapon / aggressive posture / violence (Kling is more permissive) · simple quick result.

SEEDANCE CONTENT FILTER — check the INPUT before telling a customer something is blocked. Seedance does NOT have a blanket face filter — face-forward portraits of real people in normal poses pass fine (walking, dancing, singing, sitting on a rooftop, etc). It DOES block: weapons in aggressive posture; implied violence (blood, gore, attack stances); photorealistic NSFW; recognizable public figures (celebrity-likeness detector); drug paraphernalia in use; and violent verbs in the prompt text ("stab", "slash", "attack", "shoot", "kill") — these trigger the filter even if the image is clean. If only the face flags, it's probably hitting the celebrity detector by accident — regenerate a face that looks less like anyone famous.

THE PAIR: for ~60% of a music video (B-roll, environments, cutaways, hands, objects, weather, cityscapes, textures) Seedance is best. For face-forward artist shots, Kling Pro is best. Not competitors — a pair. Cut together in post.

SEEDANCE PARAMS: prompt (required), resolution (480p/720p), duration ("auto" or "4"-"15" as strings), aspect_ratio (16:9, 9:16, 1:1, 4:3, 3:4, 21:9, auto), generate_audio (default true), seed. NO negative_prompt, NO cfg_scale, NO emphasis syntax. FAL endpoints: bytedance/seedance-2.0/text-to-video · /image-to-video · /reference-to-video (fast variants ~20% cheaper). ref2v references: @Image1 (identity/environment), @Video1 (camera/choreography), @Audio1 (rhythm/beat). Priority when slots limited: Audio → Video → Image. Max 12 files.

## Seedance 2.0 — prompt rules
STRUCTURE: Subject + Action + Scene + Camera + Style + Constraints. First 2-3 instructions get strongest weight. 60-100 words. Over 200 = model ignores details.
CAMERA: ONE movement per shot. Pair with speed modifier (slow, gentle, swift) + distance (1-2 feet). Compound moves via timed beats: "Start: slow dolly-in. Then: gentle pan right for final 2 seconds."
AVOID: "fast" (jitter), "lots of movement" (instability), "dynamic" alone (vague), "multiple angles" (uncontrollable), f-stop/ISO numbers (don't work), "beautiful"/"epic" as standalone.
QUALITY SUFFIX (append every Seedance prompt): "4K, Ultra HD, rich details, sharp clarity, cinematic texture, natural colors, soft lighting, no blur, no ghosting, no flickering, stable picture."
DIALOGUE: spoken words in "double quotes" → auto lip-synced audio in 8+ languages.
TIMELINE BEATS: [0s] Wide establishing. [3s] Medium action. [6s] Close-up detail. [8s] Pull back reveal.
IMAGE-TO-VIDEO: describe MOTION only. AUDIO: describe like a sound designer with mix priority and timing ("Dialogue prominent, music low, ambient subtle"; "SFX: thunder at 3s").

## Wan 2.1 — prompt guide
CAMERA MOVES THAT WORK: "slow dolly forward", "camera orbits subject clockwise", "tracking shot following subject left to right", "tilt up revealing skyline", "static shot, locked camera", "snap zoom" (use instead of "crash zoom" which breaks), "pull focus from foreground to background".
WHAT BREAKS: "crash zoom" (glitches — use "snap zoom, lightning fast"); multiple camera moves in one prompt (pick ONE); "handheld" (excessive shake — use "subtle handheld movement").
BEST PRACTICES: 40-70 words for coherence; specify motion ("wind blowing through hair", "leaves falling", "smoke rising"); describe where the action ENDS not just begins; guidance scale 7-9 natural, 10-12 dramatic.
FLICKERING FIXES: add "consistent lighting" for complex scenes; avoid rapid color changes; specify "smooth continuous motion" for long movements.

## Cinematography vocabulary (camera + purpose)
CAMERA MOVEMENTS & EMOTIONAL PURPOSE:
- Dolly in: intimacy/tension ("slow dolly toward subject face") · Dolly out: revealing context/isolation
- Truck/tracking: following action · Pan: surveying environment · Tilt up: scale/power · Tilt down: diminishing/discovering
- Orbit: examining/showcasing · Crane up: ascending/transcendence · Crane down: descending/grounding
- Snap zoom: emphasis/surprise (Kling not Wan) · Rack focus: shifting attention · Dutch angle: unease/tension
- Bird's eye: overview/vulnerability · Worm's eye: power/grandeur · Steadicam: smooth following · Aerial/drone: establishing scope
LIGHTING KEYWORDS: golden hour, blue hour, harsh midday, overcast diffused · Rembrandt, butterfly, rim light, practical lights · volumetric haze, god rays, neon glow, candlelight · high key (bright/airy), low key (dark/moody), chiaroscuro (extreme contrast).

## Video audio direction
Always include ambient audio direction at the END of every video prompt. Default to ambient scene noise only — water, wind, jungle, crowd, engine hum, footsteps — whatever matches the scene. NEVER add lip sync or dialogue unless explicitly requested. NEVER add music to scene audio (music is added in post). Write audio cues like a sound designer: "ambient ocean waves crashing against hull, deep metallic hum of engines, distant seabird calls." For scenes with visible faces, add "no dialogue, mouth closed, ambient sound only" to prevent unwanted lip sync.

## First-last frame prompting (Kling interpolation between two images)
The user uploaded TWO images — a FIRST FRAME and a LAST FRAME. Kling interpolates the motion between them. Use this guide only when in that mode ("first and last frame" / "start and end").

GOLDEN RULE — BE A DIRECTOR, NOT A DESCRIBER. The frames already show the subjects, outfits, setting, style. The prompt is the CAMERA PLAN, the TEMPORAL FLOW, and the LIGHT/TEXTURE evolution from frame A to frame B. Length: 50-120 words.

3-BEAT STRUCTURE:
1. OPENING BEAT (0-1s): how the first frame breathes alive — camera position, initial motion, what moves first, ambient detail.
2. TRANSITION BEAT (1-4s): the actual shift — the single named camera verb + light evolution + texture change. This is 60% of the prompt.
3. LANDING BEAT (4-5s+): how it resolves into the end frame — final composition, light, mood. Name the register (cinematic / luxury / editorial / documentary).
Close with a negative prompt line.

ONE CAMERA VERB: push/pull (dolly push, slow zoom, crash zoom, pull-back) · pan (slow pan, whip-pan, pan-to-reveal) · tilt · track · orbit · crane · float (steadicam, handheld drift, locked-off) · rack focus.

NAME REAL LIGHT SOURCES (never "dramatic lighting"): golden/blue hour, neon signs, LED panels, Edison bulbs, candle/fire/lantern, window/skylight/softbox/rim, street lamps, headlights, stage light, phone-screen glow. State how it EVOLVES ("sunset dims into blue hour", "neon spills as candles flicker out").

TEXTURE = CREDIBILITY: 16/35/65mm grain, anamorphic bokeh, lens flare, chromatic aberration, shallow DOF, skin sheen, fabric drape, hair movement, breath fog, smoke curl, dust, rain streaks, embers, color grade.

NEGATIVE LINE: "morphing, warping, distorted hands, face deformation, jittery camera, cartoon, flickering, doubled limbs."

If the user typed nothing or something vague ("smooth morph"), LOOK AT THE TWO FRAMES and direct from what you see — pick the camera move that serves that specific transition. Never default to a lazy "locked camera, smooth."
