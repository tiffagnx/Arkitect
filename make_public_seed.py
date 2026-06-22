"""Build static/seed/public_seed.json — the PUBLIC craft knowledge a GUEST install seeds
its cloud memory from. Owner-only personal data NEVER ships (his data/ is excluded from the
zip; this seed is the only knowledge a stranger receives).

Three privacy gates (defense in depth):
  1. ALLOWLIST (opt-in) — only entries whose name matches a craft topic are even considered,
     so a NEW personal entry can never accidentally ship.
  2. SCRUB — genericize the owner ("B"/"B's" -> "the artist"), drop owner-identifying lines.
  3. DENYLIST fail-safe — if a scrubbed entry STILL contains any personal token (a name,
     email, brand, pet), DROP the whole entry rather than risk a leak.

Dev-only: run `python make_public_seed.py`, eyeball the report, commit the seed.
Excluded from the guest zip via build_zip.py EXCLUDE_GLOBS.
"""
import json
import re
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "data", "kb_export.json")
OUT_DIR = os.path.join(ROOT, "static", "seed")
OUT = os.path.join(OUT_DIR, "public_seed.json")

# 1) ALLOWLIST — distinctive lowercase substrings of craft-entry names (opt-in).
ALLOW = [
    "audio-to-visual translation",
    "co-writing standards",
    "creative direction psychology",
    "flow types",
    "wordplay & lyrical technique",
    "writing cold bars",
    "making music feel distant and lonely",
    "goosebumps engineering",
    "suno v5 music prompting",
    "neuroscience of musical emotion",
    "producer technique reference",
    "song structure intelligence",
]

# 3) DENYLIST — if any of these survive into a scrubbed entry, DROP it (fail-safe).
DENY = [
    "bryan", "brian", "koonce", "makhi", "chris lopez", "swig", "banx", "joe anthony",
    "lacey", "moo ", "looney vision", "heytiff", "newfame", "koonce47", "@gmail",
    "detox", "colornote", "fountain lake", "good life", "found money",
]

# Generic identity for STRANGERS — no owner, no heytiff. Always-on like the owner's core.
GUEST_CORE = {
    "title": "Who you are (Tiff) and where you live (ARKITECT)",
    "always": True,
    "text": (
        "ARKITECT is the user's private, LOCAL creative studio — it runs on their own machine, "
        "localhost only, nothing phones home. You are Tiff, their creative partner and collaborator; "
        "Kit is the build-bot who helps make what they dream up. You help them make music, video, "
        "images, and apps across the rooms — Blueprint Builds, DeMartin Audio Labs (the DAW), "
        "LePrince Visual Labs (video), Imagination Station (images). You don't know personal "
        "details about this user yet — let who they are come from them, not from assumptions; as they "
        "tell you things, you remember them."
    ),
}


def scrub(text: str) -> str:
    # Genericize the owner so a craft lesson framed around "B" reads cleanly for anyone.
    text = re.sub(r"\bB['’]s\b", "the artist's", text)
    text = re.sub(r"\bB\b", "the artist", text)
    # Drop any line that still names a person/brand/pet/email after the above.
    keep = []
    for line in text.splitlines():
        low = line.lower()
        if any(tok in low for tok in DENY):
            continue
        keep.append(line)
    return "\n".join(keep).strip()


def main():
    rows = json.loads(open(SRC, encoding="utf-8").read())
    seed = [GUEST_CORE]
    included, dropped, skipped = [], [], 0
    for r in rows:
        name = r.get("name", "")
        low = name.lower()
        if not any(a in low for a in ALLOW):
            skipped += 1
            continue
        cleaned = scrub(r.get("content") or "")
        # fail-safe: if anything personal survived, drop the WHOLE entry
        hit = next((tok for tok in DENY if tok in cleaned.lower()), None)
        if hit or not cleaned:
            dropped.append((name, hit or "empty after scrub"))
            continue
        seed.append({
            "title": name,
            "text": cleaned[:6000],
            "source": "tiff knowledge",
            "visibility": "public",
        })
        included.append(name)

    os.makedirs(OUT_DIR, exist_ok=True)
    json.dump(seed, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

    print(f"PUBLIC SEED -> {OUT}")
    print(f"  included : {len(included)} craft entries (+ 1 generic identity)")
    for n in included:
        print("     +", n)
    if dropped:
        print(f"  DROPPED by fail-safe denylist: {len(dropped)}")
        for n, why in dropped:
            print(f"     - {n}  ({why})")
    print(f"  skipped (not allowlisted / personal): {skipped}")


if __name__ == "__main__":
    main()
