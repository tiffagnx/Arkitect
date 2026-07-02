"""kit_kb — Kit's brain (the knowledge layer).

This is the RETRIEVAL layer for the in-room assistant "Kit". The whole idea
(owner B's instinct, confirmed): Kit doesn't MEMORIZE the program — that's what
"cracks" a small 4B model. Instead the program knowledge lives on disk as plain
markdown (static/kit_kb/**/*.md, shipped with the app), and for each question we pull ONLY the few most
relevant slices into the prompt. Context stays small, startup stays instant, it
costs $0, and Kit answers from CURATED FACTS instead of guessing.

Same proven pattern as `relevant_memories()` in app.py ("no database, no
embeddings, no drama") — pointed at a room knowledge base and scoped by room.

Foundation note (this is a BUILD, not a finished toy): the retrieval seam here
is where the future "control layer" (tool-use over each room's JS) and richer
brains plug in. Keep it clean.

Public API:
    retrieve(room, query, k=4, budget=2800) -> list[dict]   # the chunks to inject
    all_chunks() -> list[dict]                              # for debugging/tests
    rooms() -> list[str]                                    # which KBs exist
"""
from __future__ import annotations

import re
from pathlib import Path

_ROOT = Path(__file__).resolve().parent
# Public craft knowledge SHIPS with the app, so it must live OUTSIDE data/ — data/ is
# gitignored and excluded from the distributable zip because it holds the owner's API
# keys + personal memory. The binder now lives in static/kit_kb/ (committed + shipped =
# the brain every user gets). A SECOND, optional dir at data/kit_kb/ is loaded as a
# LOCAL/PRIVATE overlay if it exists: the owner can drop personal craft notes there and
# they load on his machine but NEVER ship. Both contribute chunks; empty/missing dirs
# are simply skipped. (The public files live ONLY in static/, so there's no duplication.)
KB_DIRS = [_ROOT / "static" / "kit_kb", _ROOT / "data" / "kit_kb"]

# architect.md is the program-wide doc (what ARKITECT is, every room, Tiff vs Kit,
# settings, privacy). It's CROSS-ROOM, so its chunks are candidates for EVERY room —
# that's how "Kit anywhere knows about the whole program / the other labs".
GENERAL_ROOM = "architect"
# The static/kit_kb/craft/ binder is the shared CRAFT knowledge bank (image/video prompting,
# treatment craft, music & lyric technique, director references) imported from the HeyTiff KB.
# Like architect, it's cross-room — every room can pull the relevant slice — but the keyword
# relevance floor keeps a suno-prompting card out of an EQ question. Ships to every user.
GENERAL_ROOMS = ("architect", "craft")

# Same tokenizer shape as app.py:261 (kept independent so this module has no import
# cycle with app.py, which imports US).
_WORD = re.compile(r"[a-zA-Z0-9']{3,}")
_STOP = set(
    "the and for you your with that this have from they what when where will would could "
    "should about just like dont don't can't wont won't its it's was were been being are "
    "how can does did get got use using want need make does into out off the a an of to in "
    "on it is do my me i'm i've she he her his".split()
)

# Keyword retrieval is literal — a user types "get rid of the hiss" but the doc says
# "de-noise". This tiny synonym map bridges the common gaps (mostly audio/DAW + UI
# words). Free, 0 deps, and far cheaper than jumping to embeddings. Each query word
# gets its synonyms ADDED to the match set before scoring.
_SYNONYMS = {
    "hiss": ["noise", "denoise", "cleanup", "clean"],
    "noise": ["denoise", "cleanup", "clean", "hiss"],
    "air": ["noise", "cleanup", "denoise"],
    "lane": ["track"],
    "track": ["lane", "channel"],
    "channel": ["track", "strip"],
    "strip": ["channel", "track"],
    "knob": ["parameter", "control", "dial"],
    "dial": ["knob", "control"],
    "bus": ["send", "aux", "routing", "route"],
    "buss": ["bus", "send", "aux", "routing"],
    "send": ["bus", "aux", "routing"],
    "aux": ["bus", "send", "return"],
    "route": ["routing", "bus", "output", "input"],
    "loud": ["volume", "gain", "normalize", "level"],
    "quiet": ["volume", "gain", "level"],
    "volume": ["gain", "level", "fader"],
    "fader": ["volume", "gain", "level"],
    "render": ["export", "bounce", "output"],
    "export": ["render", "bounce", "save"],
    "bounce": ["export", "render"],
    "save": ["export", "session", "project"],
    "delete": ["remove", "trash"],
    "remove": ["delete"],
    "record": ["arm", "take", "recording"],
    "mic": ["record", "input", "arm"],
    "plugin": ["insert", "effect", "fx"],
    "effect": ["plugin", "fx", "insert"],
    "fx": ["effect", "plugin", "insert"],
    "reverb": ["verb", "space"],
    "verb": ["reverb"],
    "pitch": ["tune", "melodyne", "autotune"],
    "tune": ["pitch", "melodyne"],
    "master": ["mastering", "mix", "bus"],
    "mix": ["mixing", "master", "balance"],
    "zoom": ["resize", "fit", "scale"],
    "cut": ["trim", "split", "chop", "edit"],
    "trim": ["cut", "edit", "crop"],
    "split": ["cut", "separate", "chop"],
    "loop": ["repeat", "cycle"],
    "image": ["picture", "photo", "render", "generate"],
    "picture": ["image", "photo"],
    "photo": ["image", "picture", "realistic"],
    "prompt": ["describe", "description"],
    "video": ["clip", "footage", "movie"],
    "clip": ["video", "footage", "layer"],
    "layer": ["clip", "track"],
    "keyframe": ["animate", "animation", "keyframes"],
    "animate": ["keyframe", "animation"],
    "game": ["bit16", "side-scroller", "play"],
    "settings": ["gear", "config", "options", "preferences"],
    "gear": ["settings", "config"],
    "key": ["api", "cloud", "swarm"],
    "free": ["local", "offline", "cost"],
    "slow": ["speed", "fast", "performance", "lag"],
    "stem": ["track", "audio", "file"],
    # ── mixing craft & creative-FX vocabulary (the deep "how to mix" binder) ──
    "compress": ["compression", "dynamics", "compressor"],
    "compression": ["compressor", "dynamics", "compress"],
    "punch": ["transient", "attack", "snap", "compression"],
    "punchy": ["punch", "transient", "attack"],
    "transient": ["attack", "punch", "shaper", "snap"],
    "glue": ["bus", "cohesion", "compression", "master"],
    "sidechain": ["duck", "ducking", "pump", "pumping"],
    "duck": ["sidechain", "ducking", "pump"],
    "pump": ["sidechain", "duck", "pumping"],
    "parallel": ["newyork", "blend", "compression"],
    "saturation": ["tape", "tube", "warmth", "drive", "distortion", "color", "harmonics"],
    "saturate": ["saturation", "tape", "warmth", "drive"],
    "warmth": ["saturation", "tape", "tube", "analog", "warm"],
    "warm": ["warmth", "saturation", "tape"],
    "distortion": ["saturation", "drive", "overdrive", "fuzz", "crunch"],
    "lofi": ["bitcrush", "vintage", "telephone", "degrade", "tape"],
    "bitcrush": ["lofi", "crush", "degrade"],
    "exciter": ["air", "harmonics", "enhance", "sheen"],
    "harsh": ["harshness", "sibilance", "bright", "deess", "fatiguing"],
    "harshness": ["harsh", "sibilance", "bright"],
    "sibilance": ["deess", "harsh", "ess", "sss"],
    "deess": ["sibilance", "ess", "harsh"],
    "mud": ["muddy", "boomy", "boxy", "cleanup"],
    "muddy": ["mud", "boomy", "boxy"],
    "boomy": ["mud", "muddy", "boom", "low"],
    "boxy": ["mud", "boxy", "honky"],
    "thin": ["weak", "small", "body"],
    "dull": ["dark", "muffled", "bright", "air"],
    "width": ["stereo", "wide", "widen", "image", "spread"],
    "wide": ["width", "stereo", "spread"],
    "stereo": ["width", "wide", "image", "midside"],
    "midside": ["stereo", "width"],
    "pan": ["panning", "balance", "lcr", "stereo"],
    "panning": ["pan", "balance", "lcr"],
    "depth": ["space", "distance", "3d", "front", "back"],
    "reverse": ["backwards", "reversed", "swell"],
    "stutter": ["glitch", "repeat", "chop", "beatrepeat", "gate"],
    "glitch": ["stutter", "repeat", "beatrepeat"],
    "riser": ["sweep", "uplifter", "buildup", "transition", "whoosh", "rise"],
    "sweep": ["riser", "filter", "automation", "whoosh"],
    "build": ["buildup", "riser", "tension", "breakdown"],
    "transition": ["riser", "sweep", "fill", "whoosh"],
    "throw": ["delay", "reverb", "send", "tail"],
    "slapback": ["slap", "delay"],
    "slap": ["slapback", "delay"],
    "haas": ["width", "delay", "stereo"],
    "chorus": ["modulation", "thicken", "double", "width", "ensemble"],
    "flanger": ["modulation", "jet", "sweep"],
    "phaser": ["modulation", "phase", "sweep"],
    "modulation": ["chorus", "flanger", "phaser", "tremolo", "vibrato"],
    "double": ["doubling", "stack", "thicken", "chorus"],
    "stack": ["double", "layers", "thicken", "harmony"],
    "harmony": ["harmonies", "stack", "double"],
    "automation": ["ride", "rides", "automate", "envelope", "move"],
    "ride": ["automation", "rides", "fader"],
    "loudness": ["lufs", "loud", "master", "limiter", "level"],
    "lufs": ["loudness", "loud", "level", "meter"],
    "limiter": ["maximizer", "loudness", "ceiling", "master", "brickwall"],
    "maximizer": ["limiter", "loudness", "ceiling"],
    "headroom": ["gain", "staging", "level", "clipping"],
    "clipping": ["overload", "distort", "hot", "red", "peak"],
    "808": ["bass", "sub", "kick", "low"],
    "sub": ["bass", "808", "low", "subbass"],
    "kick": ["drum", "808", "low"],
    "snare": ["drum", "clap"],
    "drum": ["drums", "kick", "snare", "percussion", "beat"],
    "telephone": ["radio", "lofi", "phone", "bandpass", "megaphone"],
    "formant": ["pitch", "gender", "tune", "octave"],
    "octave": ["pitch", "formant", "tune"],
    "reference": ["referencing", "compare", "commercial"],
    "masking": ["mask", "clash", "fighting", "space", "carve"],
    "carve": ["masking", "space", "slot"],
    "vocal": ["vocals", "voice", "lead", "singer"],
    "vocals": ["vocal", "voice", "lead"],
}

# ── cache (rebuild only when a .md changes; startup/reads stay instant) ──
_cache: list[dict] = []
_cache_sig: float = -1.0


def _signature() -> float:
    """Max mtime across every KB dir — changes whenever a doc is edited, so edits go
    live with NO restart and NO build step."""
    sig = 0.0
    for base in KB_DIRS:
        if not base.is_dir():
            continue
        for p in base.rglob("*.md"):
            try:
                sig = max(sig, p.stat().st_mtime)
            except OSError:
                pass
    return sig


def _split_chunks(text: str, room: str, fname: str) -> list[dict]:
    """One chunk per `## heading` section. Text before the first `##` becomes an
    'overview' chunk (titled from a leading `# Title` if present)."""
    chunks: list[dict] = []
    lines = text.splitlines()
    title = "Overview"
    buf: list[str] = []

    def flush(t: str, body: list[str]):
        body_txt = "\n".join(body).strip()
        if body_txt:
            chunks.append({"room": room, "title": t.strip(), "text": body_txt, "file": fname})

    for ln in lines:
        if ln.startswith("## "):
            flush(title, buf)
            title = ln[3:].strip()
            buf = []
        elif ln.startswith("# ") and not chunks and not "".join(buf).strip():
            # leading H1 = the doc title; use it to name the overview chunk
            title = ln[2:].strip()
        else:
            buf.append(ln)
    flush(title, buf)
    return chunks


def _load() -> list[dict]:
    global _cache, _cache_sig
    sig = _signature()
    if sig == _cache_sig and _cache:
        return _cache
    chunks: list[dict] = []
    for base in KB_DIRS:
        if not base.is_dir():
            continue
        for p in sorted(base.rglob("*.md")):
            # Room = the file stem at top level (studio.md -> "studio"), OR the
            # containing subfolder when nested (studio/eq.md -> "studio"). This lets
            # ONE room's binder span many files under <kb_dir>/<room>/, so the
            # knowledge base can grow huge (the deep "how to mix" binder) without one
            # unwieldy file — each topic is its own .md and still scopes to its room.
            rel = p.relative_to(base)
            room = (rel.parts[0] if len(rel.parts) > 1 else p.stem).lower()
            try:
                chunks.extend(_split_chunks(p.read_text(encoding="utf-8"), room, rel.as_posix()))
            except OSError:
                pass
    _cache, _cache_sig = chunks, sig
    return chunks


def _words(s: str) -> set[str]:
    return {w.lower() for w in _WORD.findall(s)} - _STOP


def _expand(qwords: set[str]) -> set[str]:
    out = set(qwords)
    for w in qwords:
        out.update(_SYNONYMS.get(w, ()))
    return out


def rooms() -> list[str]:
    return sorted({c["room"] for c in _load()})


def all_chunks() -> list[dict]:
    return list(_load())


def retrieve(room: str, query: str, k: int = 4, budget: int = 2800, min_terms: int = 1) -> list[dict]:
    """Top-k knowledge chunks for `query`, scoped to `room` + the cross-room
    `architect` doc. Score = body-word overlap + 2x title overlap (a title hit is
    a strong signal). Capped at `budget` characters so the prompt never balloons —
    no matter how big the binder grows, only ~k pages ride along.

    `min_terms` is the relevance FLOOR: a chunk must share at least this many distinct
    query words (after synonym expansion) to qualify. Default 1 = the original
    behaviour (Kit, in-room, where every question IS about the room). The main chat
    (Tiff) passes 2 so a single coincidental word — e.g. a card that happens to quote
    "In the Air Tonight" — can't pull craft knowledge into a casual conversation."""
    room = (room or "").strip().lower()
    chunks = _load()
    if not chunks:
        return []

    qx = _expand(_words(query))
    if not qx:
        return []

    # scope: this room + the always-on program-wide doc. Unknown room → search all
    # (so Kit still helps in a room with no dedicated KB yet, and so the cross-room
    # main chat can reach the whole binder).
    known = {c["room"] for c in chunks}
    if room in known:
        pool = [c for c in chunks if c["room"] == room or c["room"] in GENERAL_ROOMS]
    else:
        pool = chunks

    scored = []
    for c in pool:
        cw_body = _words(c["text"])
        cw_title = _words(c["title"])
        if len(qx & (cw_body | cw_title)) < min_terms:
            continue
        body_hit = len(qx & cw_body)
        title_hit = len(qx & cw_title)
        score = body_hit + 2 * title_hit
        if score:
            # prefer the room's own doc slightly over the general doc on ties
            room_bonus = 0.5 if c["room"] == room else 0.0
            scored.append((score + room_bonus, -len(c["text"]), c))

    scored.sort(key=lambda t: (-t[0], t[1]))

    out, used = [], 0
    for _, _, c in scored:
        if used + len(c["text"]) > budget and out:
            break
        out.append(c)
        used += len(c["text"])
        if len(out) >= k:
            break
    return out


def as_prompt_block(chunks: list[dict]) -> str:
    """Render retrieved chunks into the system-prompt block Kit reads from."""
    if not chunks:
        return ""
    body = "\n\n".join(f"### {c['title']}\n{c['text']}" for c in chunks)
    return (
        "\n\nROOM KNOWLEDGE (the facts for this question — answer from THIS and the "
        "room note above; if the answer isn't here, say you're not sure and offer to "
        "get Tiff in the main chat — NEVER guess, NEVER give 'maybe' info):\n" + body
    )


if __name__ == "__main__":  # quick self-test: python kit_kb.py
    for d in KB_DIRS:
        print(f"KB dir: {d}  (exists={d.is_dir()})")
    print(f"rooms: {rooms()}  total chunks: {len(all_chunks())}")
    for room, q in [
        ("studio", "how do I add a plugin to a track"),
        ("studio", "what is a bus and how do sends work"),
        ("studio", "get rid of the hiss on this stem"),
        ("studio", "how do I export the final mix"),
        ("studio", "what is this whole program"),
        ("editor", "how do I add a keyframe"),
        ("images", "make a realistic photo"),
        ("build", "make me an app"),
    ]:
        hits = retrieve(room, q)
        print(f"\n[{room}] {q!r}")
        for h in hits:
            print(f"   - ({h['room']}) {h['title']}")
