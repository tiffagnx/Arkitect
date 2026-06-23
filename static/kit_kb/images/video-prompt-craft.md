# Writing great video prompts (Tiff's craft)

## Video prompts are shot directions, not photo descriptions
A video prompt describes MOTION and a CAMERA over time, not a frozen frame. Cover, roughly in this order: (1) the subject and what they DO, (2) the camera move, (3) the shot size, (4) the speed/energy, (5) the setting, (6) the light, (7) the mood. Example: "Slow dolly-in on a lone skater carving an empty parking garage at dusk, sparks off the rail, handheld camera, warm sodium light, unhurried and cinematic." If you only describe a still image, you get a frozen, lifeless clip — always say what HAPPENS.

## Camera moves + shot sizes
Use real cinematography language. MOVES: dolly in/out, pan left/right, tilt up/down, tracking (follow) shot, crane/jib up, orbit/arc around the subject, handheld, locked-off static, crash zoom, whip pan. SIZES: extreme wide, wide, full, medium, close-up, extreme close-up, over-the-shoulder. SPEED: real-time, slow motion, time-lapse, hyperlapse. Pick ONE clear camera move per shot — stacking five moves makes the model thrash and the clip jitter.

## Keep motion bounded (so the model doesn't break)
State a clear START and END for the action — "she turns from the window to face the camera" — open-ended or vague motion can stall, freeze, or loop strangely. Avoid bare intensity words like "fast", "dynamic", "chaotic", "crazy" with nothing anchoring them; give the actual movement instead. For IMAGE-TO-VIDEO, describe ONLY the motion to ADD to the still — "gentle wind in her hair, slow push-in, embers drifting up" — don't re-describe the picture, it's already the first frame. For models with audio, you can call for ambient sound or a short line of dialogue, but keep it specific and brief.

## Length, pacing, and continuation
Most models nail 5–10 second clips — ask for ONE clear beat, not a whole scene. For a longer sequence, generate shots separately and keep the SAME subject wording across them so the character and world stay consistent. If you extend or chain a clip, repeat the look verbatim and only advance the action. Front-load the key motion in the first line — the model weights the opening most. Match the aspect to the platform (9:16 for phone/Reels, 16:9 for wide/cinematic).
