# Mastering fundamentals

## What is mastering and do I even need it

Mastering is the final polish on a finished stereo mix: small, broad moves that make the song sound balanced, loud enough, and consistent across speakers, earbuds, cars, and phones. It is NOT a rescue for a bad mix — it works in tenths of a dB and a couple dB of gain reduction, not in the big fixes you do per-track. For a bedroom release you absolutely can master your own mix; just do it on a different day with fresh ears, or at least bypass everything and listen raw first. In Studio you master on a created Master Fader: add inserts to its strip in the order corrective EQ, glue compressor, tonal EQ, then the Maximizer/limiter LAST (stereo width is its own topic — see below). If your mix already sounds great, a gentle tonal nudge plus the limiter is a complete master.

## What order should my master chain go in

Order matters because each stage feeds the next. A clean starting point on the Master Fader: (1) corrective EQ to remove problems — a high-pass around 20-30 Hz and any narrow ugly resonance; (2) a glue compressor doing only 1-2 dB of gain reduction to gently bind the mix; (3) tonal EQ for broad taste moves — a gentle high-shelf for air, a small low-shelf for weight; (4) the Maximizer/limiter LAST to set final loudness and catch peaks. The limiter goes last so everything upstream is controlled before you raise level — limiting first would just amplify problems. Use EQ-6 or DeMartin EQ for the EQ stages, Compressor for glue, and the Maximizer for the final stage. Bypass each stage to confirm it actually helps.

## How loud should my master be — LUFS targets

Loudness is measured in LUFS (Loudness Units Full Scale), integrated over the whole song. Streaming platforms normalize playback, so chasing extreme loudness gains you nothing and costs you dynamics. Good starting targets: Spotify and YouTube around -14 LUFS integrated, Apple Music around -16 LUFS, Amazon similar to Spotify. Hit these by ear and meter, not by smashing the limiter — if your mix only reaches -14 LUFS with light limiting, that is healthy. Genre is taste: aggressive rap, EDM, and pop often master louder (-9 to -8 LUFS) and accept that platforms will turn them down. In Studio, set the Maximizer's gain to lift toward your target, then Bounce to Disk and check the level. Master for how the song should FEEL, then verify the number.

## What is true-peak and why -1 dBTP

True-peak is the real level of the analog waveform reconstructed BETWEEN your digital samples — those inter-sample peaks can ride higher than any single sample reads. A file can show -0.1 dBFS on a normal meter yet have true peaks over 0 dBTP, which then distort when MP3/AAC encoders, streaming players, and cheap converters rebuild the waveform. The fix is simple: set the Maximizer/limiter's output ceiling to -1.0 dBTP rather than 0. That -1 dB of headroom survives lossy encoding cleanly. For loud genres going to lossy streaming you can even drop to -1.5 dBTP for extra safety. This is one of the few hard numbers in mastering — leave the ceiling under 0, always.

## How much limiting is too much

The honest test: bypass the Maximizer and A/B. If turning it on makes the song punchier and louder with no obvious squashing, good. If the drums lose their snap, the bass starts pumping with the kick, or the whole thing sounds flat and lifeless, you have gone too far. A reasonable starting point is 2-4 dB of gain reduction on the loudest sections; pushing past 6 dB of reduction on most material starts killing transients. Watch the limiter's gain-reduction meter — brief dips on peaks are fine, constant pinning is not. Loudness war thinking ("louder always wins") is dead because platforms normalize; a dynamic master at -14 LUFS often sounds BIGGER than a crushed one once both are turned to the same level. Back off until the punch returns.

## Why shouldn't I master into an already-smashed mix

If your mix bus already has a limiter or heavy compressor flattening everything, the master stage has nothing to work with — the dynamics are already gone, and any more limiting just adds distortion. Leave headroom in the mix so the master can breathe: aim for your full mix to peak around -6 dBFS with no limiter on the mix bus, then do final loudness only at the master. Check your Master Fader strip and remove any leftover limiter from the mixing stage before you start mastering. A glue compressor doing 1-2 dB during the mix is fine and even helpful; a limiter slammed for loudness during mixing is not. Keep the loud-making in ONE place — the final Maximizer — so you control it deliberately instead of stacking crushers.

## What does the glue compressor on the master do

The glue compressor binds a mix together so the instruments feel like one cohesive thing rather than separate layers. It is gentle by design: a low ratio around 1.5:1 to 2:1, a slow attack near 30 ms so transients punch through, an auto or medium release that breathes with the song, and only 1-2 dB of gain reduction on the loudest parts. You are after cohesion and a slight forward push, not audible squeeze — if you can hear it working as compression, ease off. Place the Compressor after the corrective EQ and before the tonal EQ on the Master Fader. Match makeup gain so bypassed and active are the same loudness, then judge by feel alone. Some great masters skip this entirely; it is a tool, not a requirement.

## What is mid-side mastering and when do I use it

Mid-side splits the stereo signal into the MID (what's identical in both speakers — usually vocals, kick, bass, snare) and the SIDE (what differs — width, room, stereo reverb, panned guitars). Mastering in M/S lets you treat them separately: brighten the sides for air without making the lead vocal harsh, or tighten the mid low end without collapsing the stereo image. A classic move is to high-pass the SIDE channel below about 100-150 Hz so bass stays mono and centered while the highs keep their width. Use it surgically, not everywhere — most of the work is still plain stereo EQ and compression. Heads up: Studio's plugins don't currently expose a mid-side mode, so true M/S processing on the Master Fader is a gap (see the gaps list below) — most home masters are fine with plain stereo EQ and a careful mono check anyway. Always bypass and check in mono so width tricks don't vanish on a phone speaker.

## How wide should I make the master and the mono check

Stereo width adds space and size, but it is the easiest thing to overdo — too wide and the center hollows out, the vocal and kick lose power, and the whole thing falls apart in mono. Widen subtly: a little goes a long way, and you should never widen the low end (keep everything below ~120 Hz mono and centered so the bass stays solid on club and phone systems). The non-negotiable step is the MONO check — collapse to mono and confirm nothing important disappears or gets weak. If the vocal drops in level or a part vanishes in mono, your widening (or a phase problem upstream) is hurting you. Note: Studio has no dedicated stereo-widener plugin (gap below), so real width on the master comes from how you pan and how you treat reverb/sides during the MIX — at the master your job is mostly to NOT break the width you already have, and to mono-check before you commit.

## How do I do final tonal EQ on the master

Tonal EQ at the master is broad and gentle — wide shelves and low-Q bells measured in tenths and single dB, never surgical notches (those belong in the mix). Common starting moves: a high-shelf above 10 kHz boosted 1-2 dB for "air" and openness; a low-shelf around 60-100 Hz nudged ±1 dB for weight; a small dip near 200-400 Hz if the mix feels muddy or boxy. Reference a commercial song you love in the same genre, match its broad balance by ear, and resist big moves — if you need more than 2-3 dB anywhere, fix it back in the mix. Use the DeMartin EQ with its live spectrum so you can SEE the tilt, but trust your ears over the curve. Boost or cut freely; there is no "always cut" rule — do whatever serves the song.

## How do I check and finish my master

Mastering is mostly listening, not plugins. Reference: load a professional track in the same genre, level-match it to your master, and A/B — they should sit in the same loudness and tonal ballpark. Check on multiple systems: monitors, earbuds, your phone speaker, and the car if you can. Listen in mono to catch phase and width problems. Take breaks — ears fatigue fast and tired ears push everything too loud and too bright. When it sounds right everywhere, Bounce to Disk: WAV at 24-bit for archival and distribution, and verify the integrated LUFS and that true-peak stayed at or below -1 dBTP. If you are uncertain, the conservative master (a bit quieter, more dynamic) almost always travels better than the crushed one.

## What mastering tools is Studio missing (gaps)

A few standard mastering tools aren't one-click here yet, so use these honest workarounds. No dedicated LUFS/true-peak METER: set the Maximizer ceiling to -1.0 dBTP, then Bounce to Disk and check the integrated LUFS in an external meter or by ear against a reference — don't trust a guess. No mid-side processor: do M/S-style moves by keeping bass mono in the MIX (pan low instruments center, high-pass stereo reverb sides) rather than splitting M/S at the master. No stereo-widener plugin: build width during mixing (panning, stereo reverb) instead of widening the master. No automatic reference-track loudness match: import the reference as a muted track and A/B by hand, level-matched. None of these block a solid master — they just mean you verify with your ears and a meter instead of a single button.
