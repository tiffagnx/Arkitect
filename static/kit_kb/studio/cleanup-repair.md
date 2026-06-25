# Cleaning & Repairing Audio

## How do I get rid of background hiss or noise

Broadband hiss (air conditioning, preamp hum, room rumble) is a constant carpet of noise. Use the **Cleanup** (denoise) plugin as the FIRST insert on the track. Most denoisers learn a noise profile from a quiet section, so leave a half-second of "silence" (room tone, no talking) at the head of the take for it to sample. Start gentle: pull only 6-10 dB of reduction. Too much and the voice turns into underwater "warbling" or robot artifacts. The honest test: solo the track, bypass and re-enable Cleanup, and listen to the *removed* noise residue for any vowels or consonants bleeding through. If you hear words in the noise, you went too far. A little hiss left under a busy mix is invisible; over-processed voice is not.

## How do I remove 50/60Hz hum and electrical buzz

Mains hum sits at the power-line frequency (60Hz in the US, 50Hz in EU) PLUS its harmonics stacking upward: 60/120/180/240... or 50/100/150/200... Don't just cut one wide band; you need narrow surgical notches. Open **DeMartin EQ** (8-band, live spectrum) and watch the analyzer — the hum shows as sharp spikes at those exact frequencies. Drop a very narrow notch (high Q, ~10-20+) of -12 to -24 dB on the fundamental, then add notches on the loudest 2-3 harmonics you still hear. A 60Hz fundamental is often quieter than its 120Hz/180Hz harmonics, so notch by what the spectrum shows, not by assumption. The **Cleanup** plugin can also help if the buzz is broadband/fizzy rather than tonal. EQ first for tonal hum, denoise for the rest.

## How do I fix clicks, pops, and mouth/lip noise

Clicks and lip smacks are short transient spikes. The DAW has no one-click de-click tool yet, so do it manually with the **Smart Tool** edit. Zoom WAY in until you see the offending spike on the waveform — a mouth click looks like a tiny sharp transient between words, a pop is a low-frequency thump. Make a separation around just that spike (a few ms) in a gap, then delete it and **Heal Separation** across the gap, or apply a tiny **Fades** dip over it so it doesn't pop. (Don't use **Insert Silence** for this — that pushes everything after it later in time; it's for adding blank space, not patching a spike.) For mouth clicks DURING a word, you can't cut them out — instead ride a quick volume dip. Mouth-noise cleanup is easiest *before* you EQ-brighten, because boosting highs amplifies every smack. (No dedicated de-click plugin — see gaps.)

## Should I cut out breaths or leave them

Breaths are natural and usually belong — cutting every breath makes a vocal sound robotic and gasping-free in an uncanny way. The goal is to TAME loud breaths, not delete them. Easy way: select the breath region and apply a **Fades** volume dip, or just lower it. Cleaner way: chop the breath into its own clip (Smart Tool separation) and use **Mute (Ctrl+M)** on the worst ones or pull the clip gain down 6-12 dB so it sits under the words. For a hands-off approach, set the **Gate** with a partial range (not full -inf) so it gently ducks the quiet breaths instead of slamming them off (see the gate section). Pro taste call: tight rap/pop often wants breaths nearly gone; intimate singer-songwriter wants them kept and even featured. There's no universal right answer — it's the vibe.

## Gate vs Strip Silence — what's the difference

Both reduce sound in the gaps between phrases, but in different ways. A **Gate** is a real-time plugin: below the threshold it pulls the signal down. With its **range/depth** set to full it's a hard on/off (great for tom mics or removing bleed, but it can "chatter" and sound abrupt on vocals). Set the range PARTIAL — only -10 to -20 dB of reduction — and it behaves like a gentle downward expander: breaths and tails fade down naturally instead of snapping shut, which is far kinder on vocals. **Strip Silence** is a clip-level editor: it scans for silent regions and physically chops them out of the timeline, leaving real silence (no plugin, no CPU). Use the Gate for live/automatic ducking, and **Strip Silence** when you want to permanently clean up dead space and tighten the edit.

## How do I set up a gate on vocals

Insert the **Gate** plugin early in the chain. Set the **threshold** just below the quietest word you want to keep and just above the noise floor — watch the meter so words pass and silence gets caught. Use a moderate **range/depth** of -10 to -20 dB rather than full -inf; partial reduction sounds far more natural and forgives mistakes. Set **attack** fast (1-5 ms) so word onsets aren't clipped, **hold** ~50-100 ms so it doesn't flutter between syllables, and **release** 100-300 ms so tails breathe out smoothly. If it chatters (opening and closing rapidly on one word), raise hold and release or lower the threshold. For breaths specifically, keep the range shallow (around -10 dB) so they duck under the words instead of cutting out hard.

## How do I reduce bleed from other instruments or headphones

Bleed is unwanted sound captured on the wrong mic — drums in the vocal mic, the click track leaking from headphones, guitar in the room. First fix it at the source if you can re-record; cleanup is damage control. For bleed in the gaps, the **Gate** removes it when the main source is silent (set threshold above the bleed level). Bleed UNDER the main source is much harder — you can't separate it once mixed. **Strip Silence** physically removes bleed in the dead sections. For tonal bleed (e.g. low rumble from a kick in another mic) a **DeMartin EQ** high-pass at 80-120 Hz or a targeted cut helps. The honest truth: heavy bleed often can't be fully removed, so decide whether to embrace it or recut.

## When should I clean audio vs just leave it

Clean only what the listener will actually notice in the FINAL mix, not in solo. A hiss that's obvious soloed can be completely masked by a full band — process it and you've spent quality for nothing and risked artifacts. Always A/B with the rest of the mix playing. Rule of thumb: fix anything distracting (a loud click, a buzz, a honking breath) but resist "perfecting" silence nobody hears. Every denoise/notch trades a tiny bit of fidelity for cleanliness, so spend that budget where it counts. Also weigh the genre — a lo-fi or live record can keep grit that a polished pop vocal can't. If in doubt, do less; you can always clean more later, but you can't un-warble a voice.

## Why should cleanup go EARLY in the chain

Order matters: put **Cleanup** (denoise), the **Gate**, and corrective EQ notches at the TOP of the insert chain, before Compressor, Saturator, and reverb. Here's why — a compressor turns quiet noise UP (it raises the noise floor during gaps), and saturation/reverb smear and tail-out whatever noise is present, making hiss and hum much harder to remove afterward. Clean the signal first, THEN shape and color it. The **Vocal Doctor** chain follows this logic (it front-loads EQ before the dynamics and FX). Think of it as: repair → tone → dynamics → color → space. If your gate is chattering or your denoiser sounds weird, check that nothing dynamic or time-based is sitting in front of it.

## How do I rescue a rough or bad recording

Work in order, gently, and check against the mix. 1) **Cleanup** (denoise) first for hiss/room — 6-10 dB, no more. 2) **DeMartin EQ** narrow notches for any 50/60Hz hum + harmonics, and a high-pass around 80-100 Hz to kill rumble. 3) **Gate** (partial range) to tame bleed and dead-space noise. 4) Hunt loud clicks/pops with the **Smart Tool** + **Heal Separation**. 5) Then mix normally — Compressor, De-Ess, Saturator. The fastest path for a rough vocal is the **Vocal Doctor** (🩺): it auto-builds a sensible chain and gives you 6 safe macro sliders (Smooth, De-Ess, etc.). Manage expectations though — denoise and notches can repair a *flawed* recording, not a *destroyed* one. If it's distorted at the source or buried in noise, a recut beats any plugin.

## How do I remove sibilance, harsh S sounds

Harsh "ess" and "shh" sounds (sibilance) live around 5-9 kHz. The clean fix is the **De-Ess** plugin, placed after your corrective EQ but it's still part of repair. Set the detection frequency to where the harshness peaks (sweep 5-8 kHz to find it) and pull only 2-6 dB of reduction on the loud esses — over-doing it gives a lispy "th" sound. The **Vocal Doctor** includes a De-Ess slider clamped to a safe range if you want it automatic. For one nasty word you can also dip just that clip with a quick **Fades**/volume move or a narrow dynamic EQ cut. Sibilance is partly a mic/source issue too — if every word is harsh, also try a gentle shelf down above 8 kHz on the **DeMartin EQ**.

## What cleanup tools is Studio missing (gaps)

A few standard repair tools aren't one-click here yet — use these honest workarounds. No de-click / de-crackle plugin: zoom in with the **Smart Tool**, separate the spike in a gap, delete it and **Heal Separation**, or dip it with a tiny **Fades** move; clicks inside a word get a quick volume dip instead. No dedicated expander: set the **Gate** range partial (-10 to -20 dB) for the same gentle downward-expansion feel. No spectral/repair editor to lift a sound out from UNDER another (bleed or noise sitting beneath the main source) — that can't be unmixed, so recut if it's bad. No reverse-reverb one-click either: **Reverse** the clip, **Print VERB**, then **Reverse** back. None of these block a clean repair; they just take a couple of manual steps.
