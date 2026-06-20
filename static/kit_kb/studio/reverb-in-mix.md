# Using Reverb Musically

## How do I add reverb without losing the words

The fix is pre-delay: a short gap of silence before the reverb tail starts, so the dry consonants land clean and the wet wash arrives just after. Open TIFF VERB / DeMartin Reverb on a reverb Aux and set pre-delay to about 20-40 ms for a vocal. Longer pre-delay (50-80 ms) pushes the tail further back and keeps lyrics even more readable; past ~100 ms it starts detaching into an audible separate echo, so keep it under that unless that's the effect you want. The other half of clarity is keeping the reverb quiet (see the "don't drown it" rule) and EQ'ing the return. If words still smear, shorten the decay before you reach for more pre-delay.

## Should reverb go on the track or on a send

Use a send to an Aux, not an insert, whenever more than one thing shares the space. Make an Aux Input track (that creates a bus), put ONE TIFF VERB / DeMartin Reverb on it, and route tracks to it via their sends (banks A-E / F-J). Set the verb's wet/dry to 100% wet on the Aux so the send level alone controls how much each track gets. This keeps the dry signal untouched, lets the vocal, snare, and synths sit in the same room, and saves CPU versus a verb on every track. Reach for an insert verb only when you want one weird sound to live entirely in its own space.

## How should I EQ my reverb return so it doesn't sound muddy

Put a DeMartin EQ (or EQ-6) on the reverb Aux, after the verb. High-pass the return around 200-400 Hz so low-end energy from kick and bass doesn't bloom into mud. Then tame the top with a high shelf or low-pass starting around 8-10 kHz to stop sibilance and cymbal wash from getting harsh and washy. Many engineers also dip a few dB around 300-600 Hz if the tail sounds boxy. These are starting points: open the EQ's live spectrum, A/B with bypass, and move by ear until the reverb adds space without fogging the mix.

## What's the difference between short reverb and long reverb

Short reverb (decay roughly 0.3-1.0 s) creates depth and glue without obvious "tail" — it makes a dry source feel like it's in a real room and sits things together. Long reverb (decay 1.5-4 s and up) creates size and drama: big halls, ballad vocals, ambient pads. A common pro move is two verbs on two Auxes: a short plate for body on everything, plus a long hall you throw onto the vocal in sparse sections. Set decay in TIFF VERB / DeMartin Reverb and let the song's density decide — busy mixes need shorter tails so they don't pile up.

## How do I duck reverb under the vocal so it stays clear

Ducking pulls the reverb tail down while the vocal is singing, then lets it swell in the gaps — you hear space without it competing with the words. True sidechain-ducked reverb needs the dry vocal keying a compressor on the reverb Aux, and this DAW has no sidechain key input yet — a plain Compressor on the Aux only reacts to the reverb's own level, not the vocal, so it won't duck on cue. The working manual version: keep the reverb send post-fader and automate the send level — pull it down during dense lines, push it up on held notes and line-ends. The goal is the tail blooming in the spaces, never on top of the consonants.

## How do I match reverb decay to the song's tempo

Tie the tail length to the beat so the reverb breathes with the track instead of fighting it. Quarter-note time in ms = 60000 / BPM (e.g. 120 BPM = 500 ms per beat). Aim for the tail to mostly fade by the next downbeat or backbeat: at 120 BPM try a decay around 1-2 s; for faster songs go shorter. Pre-delay can also be tempo-synced — set it to a 1/16 or 1/8 note for a rhythmic push. The FX-Throw bar does tempo-synced reverb/delay throws automatically on a selection or a single word. This is a guide, not a law — slow ballads often want longer-than-tempo tails.

## How do I use reverb to make a mix sound 3D / front-to-back depth

Reverb is your depth control: more reverb (and a touch less high end) pushes a sound back; less reverb keeps it up front. Build a back-to-front gradient — backing vocals, pads, and ear-candy get more send and a darker, longer tail; the lead gets little to none. Adding a hair more pre-delay and rolling off highs on the return makes a part sit "behind the speakers." Pair reverb with level and EQ: quieter + duller + wetter = further away. Use one shared verb Aux so everything lives in the same room, then vary the send amount per track to place each element in depth.

## Why is my lead vocal getting buried in reverb

Because the lead usually wants to be the driest, closest thing in the mix. Keep the lead vocal's reverb send low and short so it stays up front and intelligible — drama comes from throws, not a constant wash. Use the FX-Throw bar to throw reverb only on line-ends or a single word, so the dry vocal punches and the tail blooms after. If you used Vocal Doctor, its reverb send is already set conservatively and the "Space" macro is clamped to a safe band — nudge it up only until you can still hear every word. When in doubt, pull the send down 2-3 dB and check the lyric is clear.

## What's the "don't drown it" rule

Set reverb so you notice the mix sounds smaller when you mute the verb — not so you hear "reverb." Bring the send up until it's obvious, then back it off until it's just under noticeable; that's usually the sweet spot. Check it quiet and on a phone/laptop speaker, where too much reverb turns to mush first. Solo'd reverb almost always sounds too loud in context, so judge it in the full mix. More elements, more genres (hip-hop, modern pop) want drier mixes; ballads and ambient can take more. Taste rules here — there's no fixed correct amount.

## How do I do a reverse reverb swell into a word

Reverse reverb is the tail that swells UP into a downbeat or a word — a classic vocal/snare intro effect. The DAW has no one-click version, so do it by hand: duplicate the clip (Ctrl+D), Reverse the copy, add a heavy verb and Print VERB to bake the tail in, then Reverse it back. Now the reverb tail rises into the start of the word. Trim and crossfade (Equal-Power) the swell into the dry clip so the transition is seamless. Use it sparingly on hooks and section starts — it's an ear-catching effect, not a full-mix treatment.

## How do I commit / print my reverb so the mix is final

Printing bakes the reverb into the audio so it's locked and CPU-free. Select a clip and use Print VERB to render the verb into that clip. For the whole mix or a stem, use Bounce to Disk (mix/stem/bus, WAV+MP3, 16/24-bit) once the reverb sounds right. Print before you commit a track if you want the exact tail preserved, but keep an un-printed copy in case you change your mind — printed reverb can't be un-reverbed. For send-based reverb on an Aux, bounce the bus or the full mix rather than printing each track.
