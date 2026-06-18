"""kit_kb — Kit's brain (the knowledge layer).

This is the RETRIEVAL layer for the in-room assistant "Kit". The whole idea
(owner B's instinct, confirmed): Kit doesn't MEMORIZE the program — that's what
"cracks" a small 4B model. Instead the program knowledge lives on disk as plain
markdown (data/kit_kb/*.md), and for each question we pull ONLY the few most
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

KB_DIR = Path(__file__).resolve().parent / "data" / "kit_kb"

# architect.md is the program-wide doc (what ARKITECT is, every room, Tiff vs Kit,
# settings, privacy). It's CROSS-ROOM, so its chunks are candidates for EVERY room —
# that's how "Kit anywhere knows about the whole program / the other labs".
GENERAL_ROOM = "architect"

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
}

# ── cache (rebuild only when a .md changes; startup/reads stay instant) ──
_cache: list[dict] = []
_cache_sig: float = -1.0


def _signature() -> float:
    """Max mtime across the KB dir — changes whenever the owner edits a doc, so
    edits go live with NO restart and NO build step."""
    if not KB_DIR.is_dir():
        return 0.0
    sig = 0.0
    for p in KB_DIR.glob("*.md"):
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
    if KB_DIR.is_dir():
        for p in sorted(KB_DIR.glob("*.md")):
            room = p.stem.lower()
            try:
                chunks.extend(_split_chunks(p.read_text(encoding="utf-8"), room, p.name))
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


def retrieve(room: str, query: str, k: int = 4, budget: int = 2800) -> list[dict]:
    """Top-k knowledge chunks for `query`, scoped to `room` + the cross-room
    `architect` doc. Score = body-word overlap + 2x title overlap (a title hit is
    a strong signal). Capped at `budget` characters so the prompt never balloons —
    no matter how big the binder grows, only ~k pages ride along."""
    room = (room or "").strip().lower()
    chunks = _load()
    if not chunks:
        return []

    qx = _expand(_words(query))
    if not qx:
        return []

    # scope: this room + the always-on program-wide doc. Unknown room → search all
    # (so Kit still helps in a room with no dedicated KB yet).
    known = {c["room"] for c in chunks}
    if room in known:
        pool = [c for c in chunks if c["room"] in (room, GENERAL_ROOM)]
    else:
        pool = chunks

    scored = []
    for c in pool:
        body_hit = len(qx & _words(c["text"]))
        title_hit = len(qx & _words(c["title"]))
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
    print(f"KB dir: {KB_DIR}  (exists={KB_DIR.is_dir()})")
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
