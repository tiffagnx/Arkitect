# Mix Workflow — The Order of Operations

## What order should I mix in / where do I start

There's no law, but this order keeps you out of trouble: rough balance + gain-stage, pan, subtractive EQ, compression, additive EQ, FX sends, automation, bus glue, then hand to mastering. The idea is each step builds on a stable foundation — you can't judge EQ until levels are sane, can't judge compression until tone is clean. Don't treat it as rigid; loop back when something changes. In Studio: set clip gain / fader for balance, add inserts with **+ insert** (EQ-6 or DeMartin EQ, then Compressor), build sends for FX, then automate. Start the very first move by just pulling faders to a rough balance with everything playing together — not soloed.

## Gain staging — what level should my tracks sit at before I mix

Gain staging means setting healthy input levels BEFORE plugins so nothing clips and every plugin "sees" the signal it expects. Aim for peaks landing around −12 to −6 dBFS on each track and the master peaking under about −3 dBFS with all faders up — those are starting targets, not sacred numbers. Use clip gain (not the fader) for the coarse set so your fader stays near unity (0 dB) for fine balance. The **Record-level coach** shows live dBFS and a sweet-spot band while tracking. If a track is way hot or way quiet, fix it at the source (clip gain) first — don't paper over it with the fader, because inserts are PRE-fader: the fader can't change the level your plugins already saw.

## Should I do a rough balance before adding plugins

Yes — get a static balance with faders alone before you reach for a single plugin. Play the whole song, pull every fader until the vocal/lead sits on top and nothing buries the kick and snare, then leave it. This tells you what actually needs fixing: half the "problems" people EQ away are just a fader 3 dB too loud. In Studio, drag the channel faders in MIX view or use clip gain. Get the song to where you'd be okay releasing it flat — THEN start processing. A great rough balance is 60% of a great mix; plugins are the last 40%.

## Why should I mix in mono first

Collapsing to mono exposes problems stereo hides: masking (two sounds fighting for the same space), weak elements that "disappear," and phase cancellation where layered parts partly null out. If your mix sounds clear and balanced in mono, it'll sound great in stereo and survive phone speakers, club sums, and Bluetooth pairings. Do your rough balance and your subtractive EQ carving in mono, then switch to stereo to set panning and width. Studio doesn't have a one-click mono button — pan everything to center temporarily, or check on a single speaker — so add a true mono-sum monitor toggle to the gaps list.

## When and how should I pan / set the stereo image

Pan after the rough balance, ideally while still listening in mono-or-narrow so you're placing things by importance, not just spreading them out. Keep the anchors centered: lead vocal, kick, snare, and bass usually live up the middle so the low end stays mono-solid and the focal point is dead center. Push doubles, guitars, keys, percussion, and backing vocals out to the sides — hard-panned doubles (100% L / 100% R) create width without mud. Use the pan control on each track strip in Studio. Pan is taste: a sparse song wants restraint, a dense arrangement wants bold L/R separation to keep parts from masking each other.

## Subtractive vs additive EQ — which comes first and why

Cut first (subtractive), boost later (additive), with compression usually in between. Subtractive EQ removes problems — mud around 200–500 Hz, boxiness, harsh resonances — so the track is clean before you compress (a compressor reacts to whatever's loudest, including ugly resonances, so clean it first). Additive EQ after compression is where you add character and air, because compression can dull the top end you then want back. There's no "always cut, never boost" rule — boosting is fine and pros do it constantly; the order is just practical. In Studio use **DeMartin EQ** (8-band, live spectrum, drag the bands) or **EQ-6**: narrow cuts for surgery, wide gentle boosts (±2–4 dB) for tone.

## Where do I put compression in the chain

Standard placement is after subtractive EQ and before additive EQ: clean the tone, control the dynamics, then sweeten. Starting points on the **Compressor**: ratio 2:1–4:1, attack 10–30 ms (slower lets transients through for punch), release 60–150 ms or set to breathe with the tempo, and pull threshold down for roughly 3–6 dB of gain reduction on the loudest parts. Then bring the makeup gain up so the compressed signal matches the bypassed level — this is the critical gain-match. For vocals you may chain two light compressors (3 dB each) instead of one heavy one. On Studio vocals, the **Vocal Doctor** (🩺) builds EQ-6 → De-Ess → Compressor → Saturator for you and gives safe macro sliders.

## How do I set up reverb and delay (FX sends) properly

Use sends, not inserts, so multiple tracks share one reverb/delay and sit in the same "room." In Studio: make an **Aux Input** track (that creates a bus), put **DeMartin Reverb / TIFF VERB** or **Tape Delay** on the aux, then turn up each track's **send** to that bus. Keep the reverb/delay plugin at 100% wet on the aux — the send amount controls how much. Starting reverb: plate or hall, 1.2–1.8 s decay for vocals, with a 20–40 ms pre-delay to keep the dry vocal up front. Delay: tempo-synced 1/8 or 1/4 note. The **FX-Throw bar** can throw tempo-synced reverb/delay onto a whole selection or a single word for moments instead of the whole part.

## Static mix vs automation — should I automate before or after

Lock a static mix FIRST — fixed faders, pans, and plugin settings that sound good through the whole song — THEN automate to fix what static can't. Automation handles moving targets: riding a vocal louder in the chorus, ducking a pad under the verse, opening a filter into a drop, pushing a word that got lost. If you automate before the static mix is solid, you're chasing a moving floor and you'll redo everything. In Studio, draw fader/send/plugin automation in the track lanes. Rule of thumb: if the same fader move fixes the whole song, that's static; if it changes section to section, that's automation.

## What is bus / glue compression and when do I add it

Bus glue is gentle compression across a group (drums, all vocals, or the whole mix) that makes separate tracks feel like one performance. Route the group to an **Aux Input** bus in Studio and put a **Compressor** on it: low ratio 1.5:1–2:1, slow attack (30 ms) to keep punch, auto/medium release, and only 1–3 dB of gain reduction — you want it to "breathe," not squash. Add it after the individual-track processing is settled, near the end of the mix. Gain-match it (makeup to match bypass) and A/B; if it sounds smaller or pumped, back off. This is glue, not loudness — don't push it for level.

## Why should I gain-match every plugin move

Louder almost always sounds "better" for a few seconds even when it's worse — that's loudness bias, and it ruins decisions. Every time you add EQ boost, compression makeup, or saturation, the output gets louder, so you'll keep the change for the wrong reason. After each move, trim the plugin's output (or the makeup gain) so bypassed and engaged levels match, THEN A/B. In Studio, use each plugin's output/gain control and toggle insert bypass to compare at equal loudness. This single habit separates clean mixes from over-processed ones — judge tone and dynamics, not volume.

## When is the mix done / when should I stop and hand to mastering

Stop when changes stop making it better — when you're moving things 0.5 dB back and forth with no clear winner, you're done. Leave headroom for mastering: mix-bus peaks landing around −6 to −3 dBFS, no limiter slammed on the master bus (a little **Maximizer** for monitoring is fine, but bounce a version without it or set it gently). Take ear breaks, check on phone/earbuds/car, and reference a commercial track at matched loudness. Don't master while mixing — mastering targets like roughly −14 LUFS integrated for streaming and a −1 dBTP true-peak ceiling are a separate stage. In Studio, **Bounce to Disk** a 24-bit WAV at this headroom and hand that off.
