"""
ARKITECT — RESEARCH SWARM (bring-your-own-key). New, self-contained.

Her local brain (Gemma on an 8GB card) is capped. The open web is full of
stronger LLMs with FREE API tiers. This module lets ANYONE running the ARKITECT
add their OWN free keys (Groq, OpenRouter, Gemini, Mistral, Cerebras...) and fan a
research question out across them: each external brain writes its own searches,
reads pages WE fetch (most free models can't browse — so the ARKITECT does the
surfing, exactly like the existing /api/research), and hands back a short cited
digest. Her LOCAL model then merges the digests into one answer in her voice — so
she can answer things her little brain never could alone.

DESIGN — why this is safe to drop in next to the live Studio/Builder work:
  • Brand-new file. The only change to app.py is ONE include line at its end:
        from swarm_routes import router as swarm_router
        app.include_router(swarm_router)
  • The existing /api/research is NOT touched — swarm is a separate endpoint you
    opt into. If no providers are configured it says so plainly and does nothing.
  • It REUSES app.py's web + synthesis helpers (imported lazily at call time, so
    there is no circular import) — no duplicated search/fetch logic.

A "provider slot" is the universal contract every modern API speaks:
    { name, base_url (.../v1), api_key, model }
Adding a provider is DATA, never code — same pattern Open WebUI / LibreChat / Jan use.

KEYS: stored in data/swarm_keys.json (gitignore it). On a single-user machine this
is acceptable, but it IS plaintext — say so to the user, don't pretend otherwise.
(Optional hardening later: the `keyring` package → Windows Credential Manager.)
"""
import asyncio
import json
import os
import re
import time
import uuid
from pathlib import Path

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse

router = APIRouter()

ROOT = Path(__file__).parent
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)
PROV_FILE = DATA / "swarm_providers.json"   # slot metadata (no secrets) — safe to back up
KEYS_FILE = DATA / "swarm_keys.json"        # { slot_id: api_key } — gitignore this
_KEYS_LOCK = asyncio.Lock()                 # serialize key writes so concurrent saves can't clobber

# Preset endpoints so "add a provider" is a dropdown, not homework. base_url is the
# provider's OpenAI-compatible root; the user only pastes a free key + picks a model.
# native_web flags whether the MODELS themselves can browse (almost none can — the
# swarm feeds them pages either way; this is just guidance shown in the UI).
PRESETS = [
    {"name": "Groq",        "base_url": "https://api.groq.com/openai/v1",                  "models_hint": "meta-llama/llama-4-scout-17b-16e-instruct, openai/gpt-oss-120b, llama-3.3-70b-versatile", "free": "free ~1K/day, fastest · Llama 4 Scout = vision + tool use", "native_web": "no", "key_url": "https://console.groq.com/keys", "privacy": "🔒 Doesn't train on your inputs (inference-only provider)"},
    {"name": "Google Gemini","base_url": "https://generativelanguage.googleapis.com/v1beta/openai", "models_hint": "gemini-3.5-flash, gemini-3-flash, gemini-2.5-pro, gemini-2.5-flash", "free": "big free budget · 3.5 Flash = vision + tools + 1M context", "native_web": "grounding (native API only)", "key_url": "https://aistudio.google.com/apikey", "privacy": "⚠️ Free tier may use your data to improve Google's products — a paid key doesn't"},
    {"name": "Claude (Anthropic)","base_url": "https://api.anthropic.com/v1", "models_hint": "claude-sonnet-4-6, claude-opus-4-8, claude-haiku-4-5", "free": "Pay-per-use, no free tier · Opus & Sonnet = top-tier reasoning + writing", "native_web": "no", "key_url": "https://console.anthropic.com/settings/keys", "privacy": "🔒 Doesn't train on your inputs (Anthropic doesn't use API data to train models)"},
    {"name": "Featherless", "base_url": "https://api.featherless.ai/v1",                   "models_hint": "moonshotai/Kimi-K2.6, deepseek-ai/DeepSeek-V4, zai-org/GLM-5.1, Qwen/Qwen3-235B-A22B", "free": "FLAT MONTHLY — unlimited tokens ($10 ≤15B / $25 all sizes)", "native_web": "no", "key_url": "https://featherless.ai/account/api-keys", "privacy": "☁ Your inputs go to this provider — check its data-use policy before sending sensitive work"},
    {"name": "Z.ai GLM",    "base_url": "https://api.z.ai/api/coding/paas/v4",             "models_hint": "glm-5.2, glm-4.6, glm-4.5-air",              "free": "FLAT MONTHLY coding plan (quota, not per-token) · GLM-5.2 is Claude-class", "native_web": "no", "key_url": "https://z.ai/manage-apikey/apikey-list", "privacy": "☁ Your inputs go to this provider — check its data-use policy before sending sensitive work"},
    {"name": "xAI Grok",    "base_url": "https://api.x.ai/v1",                             "models_hint": "grok-4, grok-4-fast, grok-2-vision-1212",    "free": "pay-per-use (vision + tools + reasoning)",   "native_web": "live X search (native)", "key_url": "https://console.x.ai", "privacy": "☁ Your inputs go to this provider — check its data-use policy before sending sensitive work"},
    {"name": "OpenRouter",  "base_url": "https://openrouter.ai/api/v1",                    "models_hint": "pick any model id ending in :free",          "free": "50/day free, 1000/day after one-time $10",   "native_web": "no", "key_url": "https://openrouter.ai/keys", "privacy": "☁ Routes to other providers — check OpenRouter's (and the model's) data policy"},
    {"name": "Mistral",     "base_url": "https://api.mistral.ai/v1",                       "models_hint": "mistral-large-latest, mistral-small-latest", "free": "~1B tokens/MONTH, 1 req/sec",                "native_web": "no", "key_url": "https://console.mistral.ai/api-keys", "privacy": "☁ Paid tier doesn't train on your data; the free tier may — check before sensitive work"},
    {"name": "Cerebras",    "base_url": "https://api.cerebras.ai/v1",                      "models_hint": "llama-3.3-70b, qwen-3-32b",                  "free": "2600 tok/s, but ~8K context cap",            "native_web": "no", "key_url": "https://cloud.cerebras.ai", "privacy": "☁ Your inputs go to this provider — check its data-use policy before sending sensitive work"},
    {"name": "Custom",      "base_url": "",                                                "models_hint": "any OpenAI-compatible /v1 endpoint",         "free": "—",                                          "native_web": "?",  "key_url": "", "privacy": "☁ Your inputs go wherever you point this — make sure you trust that endpoint"},
]

# ── slot + key storage ───────────────────────────────────────────────────────

def _load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default
    except Exception:
        return default


def _save_json(path: Path, data) -> None:
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(data, indent=1), encoding="utf-8")
    os.replace(tmp, path)   # atomic — a crash mid-write can't corrupt the slot list


def _load_providers() -> list[dict]:
    return _load_json(PROV_FILE, [])


# ── secrets vault — encrypt API keys AT REST so a copied/stolen disk can't read them ──
# Windows DPAPI ties the ciphertext to THIS Windows user account: no password to store,
# nothing decryptable off-machine or by another user. Non-Windows / DPAPI failure falls
# back to plaintext (best effort) so a key is never lost. Encrypted values are tagged
# "dpapi:" so legacy plaintext keys still load and get encrypted on the next save.
import base64 as _b64

_VAULT_TAG = "dpapi:"


def _dpapi(protect: bool, data: bytes):
    """CryptProtectData (protect=True) / CryptUnprotectData (False) via ctypes. None on failure."""
    import sys
    if sys.platform != "win32":
        return None
    import ctypes
    from ctypes import wintypes

    class _BLOB(ctypes.Structure):
        _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

    buf = ctypes.create_string_buffer(data, len(data))   # keep alive across the call
    blob_in = _BLOB(len(data), ctypes.cast(buf, ctypes.POINTER(ctypes.c_char)))
    blob_out = _BLOB()
    fn = ctypes.windll.crypt32.CryptProtectData if protect else ctypes.windll.crypt32.CryptUnprotectData
    # flags = CRYPTPROTECT_UI_FORBIDDEN (1): never pops a UI prompt
    if not fn(ctypes.byref(blob_in), None, None, None, None, 1, ctypes.byref(blob_out)):
        return None
    try:
        return ctypes.string_at(blob_out.pbData, blob_out.cbData)
    finally:
        ctypes.windll.kernel32.LocalFree(blob_out.pbData)


def _enc_secret(v: str) -> str:
    if not v:
        return v
    out = _dpapi(True, v.encode("utf-8"))
    return (_VAULT_TAG + _b64.b64encode(out).decode("ascii")) if out is not None else v


def _dec_secret(v: str) -> str:
    if not isinstance(v, str) or not v.startswith(_VAULT_TAG):
        return v or ""                                   # legacy plaintext (or empty)
    out = _dpapi(False, _b64.b64decode(v[len(_VAULT_TAG):]))
    return out.decode("utf-8") if out is not None else ""


def _load_keys() -> dict:
    """All slot keys, DECRYPTED and ready to use. Legacy plaintext entries pass through."""
    return {k: _dec_secret(val) for k, val in _load_json(KEYS_FILE, {}).items()}


def _save_keys(keys: dict) -> None:
    """Persist slot keys ENCRYPTED at rest (DPAPI, bound to this Windows user)."""
    _save_json(KEYS_FILE, {k: _enc_secret(val) for k, val in keys.items()})


def _mask(key: str) -> str:
    key = key or ""
    return (key[:3] + "…" + key[-4:]) if len(key) > 8 else ("set" if key else "")


def _enabled_slots() -> list[dict]:
    """Enabled provider slots WITH their key attached, ready to call."""
    keys = _load_keys()
    out = []
    for p in _load_providers():
        if not p.get("enabled", True):
            continue
        key = keys.get(p["id"], "")
        if p.get("base_url") and p.get("model") and key:
            out.append({**p, "api_key": key})
    return out


# ── one external-provider call (the generalized lm_once) ─────────────────────

class RateLimited(Exception):
    pass


class ProviderError(Exception):
    pass


async def provider_once(slot: dict, system: str, user: str, max_tokens: int = 700,
                        temperature: float = 0.3) -> str:
    """One non-streaming chat call to any OpenAI-compatible provider. This is the
    ONLY new primitive — everything else reuses the ARKITECT's existing helpers.
    Raises RateLimited on 429 (caller rotates to the next slot) and ProviderError
    otherwise."""
    base = (slot["base_url"] or "").rstrip("/")
    url = f"{base}/chat/completions"
    headers = {"Authorization": f"Bearer {slot['api_key']}", "Content-Type": "application/json",
               # OpenRouter likes these for attribution; every other provider ignores them.
               "HTTP-Referer": "http://localhost", "X-Title": "Tiff ARKITECT"}
    body = {
        "model": slot["model"],
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=90) as cx:
        r = await cx.post(url, headers=headers, json=body)
    if r.status_code == 429:
        raise RateLimited(slot["name"])
    if r.status_code != 200:
        raise ProviderError(f"{slot['name']} {r.status_code}: {r.text[:160]}")
    try:
        msg = r.json()["choices"][0]["message"]
        return (msg.get("content") or msg.get("reasoning_content") or "").strip()
    except (KeyError, IndexError, ValueError, TypeError):
        raise ProviderError(f"{slot['name']} returned an unreadable reply")


async def provider_stream(slot: dict, payload: dict):
    """STREAM chat deltas from any OpenAI-compatible provider as ARKITECT SSE lines —
    the streaming sibling of provider_once. Emits the SAME shape as app.lm_stream
    ({'type':'delta','text':...}) so the chat frontend needs zero changes. Points at the
    slot's base_url + Bearer key instead of local LM Studio."""
    base = (slot.get("base_url") or "").rstrip("/")
    url = f"{base}/chat/completions"
    headers = {"Authorization": f"Bearer {slot.get('api_key','')}", "Content-Type": "application/json",
               "HTTP-Referer": "http://localhost", "X-Title": "Tiff ARKITECT"}
    try:
        async with httpx.AsyncClient(timeout=None) as cx:
            async with cx.stream("POST", url, headers=headers, json=payload) as r:
                if r.status_code != 200:
                    body = (await r.aread()).decode(errors="replace")[:300]
                    emsg = f"{slot.get('name','cloud')} error {r.status_code}: {body}"
                    yield f"data: {json.dumps({'type':'error','text':emsg})}\n\n"
                    return
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    chunk = line[6:]
                    if chunk.strip() == "[DONE]":
                        break
                    try:
                        d = json.loads(chunk)["choices"][0]["delta"]
                        delta = d.get("content") or d.get("reasoning_content") or ""
                    except Exception:
                        continue
                    if delta:
                        yield f"data: {json.dumps({'type':'delta','text':delta})}\n\n"
    except Exception as e:
        emsg = f"{slot.get('name','cloud')} couldn't be reached: {e}"
        yield f"data: {json.dumps({'type':'error','text':emsg})}\n\n"


async def _call_with_fallback(slots: list[dict], system: str, user: str,
                              max_tokens: int, temperature: float) -> tuple[str, str]:
    """Try each slot in order; on a 429/error advance to the next so a single
    rate-limited free tier never sinks the whole agent. Returns (text, provider_name).
    Agents start the list rotated so they don't all hammer the same provider first."""
    last_err = None
    for slot in slots:
        try:
            txt = await provider_once(slot, system, user, max_tokens, temperature)
            if txt:
                return txt, slot["name"]
        except (RateLimited, ProviderError) as e:
            last_err = e
            continue
    raise (last_err or ProviderError("no provider answered"))


async def gemini_grounded_once(slot: dict, prompt: str, max_tokens: int = 800):
    """Gemini's free tier can search Google ITSELF. The OpenAI-compat path does NOT expose
    grounding, so this hits the NATIVE generateContent endpoint with the google_search tool —
    this one agent self-researches and returns its OWN cited sources, fresh from Google, instead
    of being fed our pages. base_url is the same compat root stored on the slot
    (…/v1beta/openai); we derive the native root from it. Returns (answer_text, [{title,url}])."""
    base = re.sub(r"/v1beta/openai/?$", "", (slot["base_url"] or "https://generativelanguage.googleapis.com").rstrip("/"))
    url = f"{base}/v1beta/models/{slot['model']}:generateContent"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "tools": [{"google_search": {}}],
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": 0.3}}
    async with httpx.AsyncClient(timeout=90) as cx:
        r = await cx.post(url, headers={"x-goog-api-key": slot["api_key"], "Content-Type": "application/json"}, json=body)
    if r.status_code == 429:
        raise RateLimited(slot["name"])
    if r.status_code != 200:
        raise ProviderError(f"{slot['name']} {r.status_code}: {r.text[:160]}")
    cand = (r.json().get("candidates") or [{}])[0]
    text = " ".join(p.get("text", "") for p in ((cand.get("content") or {}).get("parts") or []) if p.get("text")).strip()
    srcs = []
    for ch in ((cand.get("groundingMetadata") or {}).get("groundingChunks") or []):
        w = ch.get("web") or {}
        if w.get("uri"):
            srcs.append({"title": w.get("title") or w["uri"], "url": w["uri"]})
    return text, srcs


# ── page-fetch cache — DuckDuckGo's HTML scrape is flaky and two agents can land on
# the same URL; cache stripped page text briefly so we never re-crawl within a run. ──
_PAGE_CACHE: dict = {}
_PAGE_TTL = 600.0   # seconds


async def _cached_fetch(A, url: str) -> str:
    now = time.time()
    for k in [k for k, v in list(_PAGE_CACHE.items()) if now - v[0] >= _PAGE_TTL]:
        _PAGE_CACHE.pop(k, None)                          # TTL evict: drop stale entries every call
    hit = _PAGE_CACHE.get(url)
    if hit and now - hit[0] < _PAGE_TTL:
        return hit[1]
    text = await A.fetch_page(url)
    if text:
        if len(_PAGE_CACHE) > 200:                       # bound memory: drop the oldest chunk
            for k in sorted(_PAGE_CACHE, key=lambda k: _PAGE_CACHE[k][0])[:70]:
                _PAGE_CACHE.pop(k, None)
        _PAGE_CACHE[url] = (now, text)
    return text


# ── prompts the external agents run ──────────────────────────────────────────

_QUERY_SYS = (
    "You turn a research task into clean web-search queries. Output ONLY a JSON array of "
    "1-2 query strings — nothing else. Each query must stand alone (a stranger could paste it "
    "into Google), no chat-speak, no pronouns — name the real subject. If something is "
    "current/latest, include the year."
)


def _digest_sys(today: str) -> str:
    return (
        f"You are a research agent. Today is {today}. You are given web SOURCES already fetched for you. "
        "Write a TIGHT digest (~150 words max) of ONLY what the sources actually say that answers the task. "
        "Cite inline like [1] [2] using the source numbers. Be factual and specific — numbers, dates, names. "
        "If the sources don't answer it, say so in one line. No preamble, no 'as an AI', just the digest."
    )


async def _split_question(A, model: str, question: str, convo: str, n: int) -> list:
    """Local model splits a task into n distinct sub-questions, one per researcher.
    Falls back to the whole question n times if it can't."""
    try:
        raw = await A.lm_once(model,
            "Break the research request into distinct, non-overlapping sub-questions — one per "
            f"researcher, exactly {n} of them. Each must be self-contained (name the real subject, no pronouns). "
            "Output ONLY a JSON array of strings.",
            (f"Conversation so far:\n{convo}\n" if convo else "") + f"Request: {question}\n\nOutput {n} sub-questions as a JSON array.",
            350)
        m = re.search(r"\[.*\]", raw, re.S)
        if m:
            subqs = [str(s).strip() for s in json.loads(m.group(0)) if str(s).strip()][:n]
            if subqs:
                return subqs
    except Exception:
        pass
    return [question] * n


async def _research_agent(A, slots: list, idx: int, subq: str, today: str) -> dict:
    """One research agent (shared by the chat swarm AND the Builder's research path). A
    GROUNDED provider (Gemini) self-searches; otherwise the external model writes queries,
    WE fetch the pages, and it digests them. Never raises — errors come back in the dict."""
    rotated = slots[idx % len(slots):] + slots[:idx % len(slots)]   # spread load
    try:
        primary = rotated[0]
        feed = rotated
        if primary.get("grounded"):
            feed = rotated[1:] or rotated
            try:
                ans, gsrcs = await gemini_grounded_once(
                    primary, f"Research this and answer with citations — ~150 words, factual and current: {subq}")
                if ans:
                    return {"subq": subq, "provider": primary["name"] + " 🌐", "digest": ans, "sources": gsrcs}
            except (RateLimited, ProviderError):
                pass
        qraw, prov = await _call_with_fallback(feed, _QUERY_SYS, subq, 250, 0.2)
        queries = A._parse_queries(qraw, A._clean_filler(subq))[:2] or [subq]
        sources, seen = [], set()
        for q in queries:
            if A.TAVILY_KEY:
                for res in await A.tavily_search(q, 3):
                    if res["url"] in seen or A._is_junk(res["text"]):
                        continue
                    seen.add(res["url"]); sources.append(res)
                    if len(sources) >= 3:
                        break
            else:
                for res in (await A.ddg_search(q, 4))[:3]:
                    if res["url"] in seen:
                        continue
                    seen.add(res["url"])
                    text = await _cached_fetch(A, res["url"])
                    if not A._is_junk(text):
                        sources.append({**res, "text": text})
                    if len(sources) >= 3:
                        break
            if len(sources) >= 3:
                break
        if not sources:
            return {"subq": subq, "provider": prov, "digest": "", "sources": []}
        per = max(600, 4000 // len(sources))
        src_block = "\n\n".join(f"SOURCE {i+1} — {s['title']} ({s['url']}):\n{s['text'][:per]}"
                                for i, s in enumerate(sources))
        digest, prov2 = await _call_with_fallback(
            feed, _digest_sys(today),
            f"RESEARCH TASK: {subq}\n\n{src_block}\n\nWrite the cited digest now.", 500, 0.3)
        return {"subq": subq, "provider": prov2, "digest": digest, "sources": sources}
    except (RateLimited, ProviderError) as e:
        return {"subq": subq, "provider": "—", "digest": "", "sources": [], "error": str(e)}


# ── the swarm endpoint ───────────────────────────────────────────────────────

@router.post("/api/research-swarm")
async def research_swarm(req: Request):
    """Fan a question out across the user's configured free providers, then merge
    their digests with the LOCAL model. Same SSE event shape as /api/research
    (step / delta / sources / error / done) so the existing front-end renders it."""
    import app as A   # lazy — app is fully loaded by request time (no circular import)

    body = await req.json()
    question = (body.get("question") or "").strip()
    history = body.get("messages", [])
    effort = body.get("effort", "low")
    local_model = body.get("local_model") or body.get("model") or getattr(A, "DEFAULT_MODEL", "")
    today = A._today()

    convo = ""
    for m in history[-8:]:
        role = "B" if m.get("role") == "user" else "Tiff"
        c = A._content_text(m.get("content")).strip()
        if c:
            convo += f"{role}: {c[:500]}\n"

    def ev(type_, **kw):
        return f"data: {json.dumps({'type': type_, **kw})}\n\n"

    async def gen():
        slots = _enabled_slots()
        if not slots:
            yield ev("error", text="No research providers yet — open Swarm Settings and add a free API key (Groq, OpenRouter, Gemini…). It's free; you just paste your own key.")
            yield ev("done")
            return
        if not question:
            yield ev("error", text="Give me something to research.")
            yield ev("done")
            return

        # the LOCAL model does the final merge — make sure she's awake
        if not await A.brain_up():
            yield ev("step", icon="🧠", text="waking her up for the final merge…")
            if not await A.ensure_brain():
                yield ev("error", text="Her brain (LM Studio) won't start — open it once, then retry.")
                yield ev("done")
                return

        # 1) split the question into one sub-angle per agent (local model, cheap).
        n = min(len(slots), 5)
        yield ev("step", icon="🧠", text=f"Splitting the question for {n} researchers…")
        subqs = await _split_question(A, local_model, question, convo, n)

        # 2) one research agent per sub-question (shared _research_agent — same engine the
        #    Builder uses). Each: external model writes queries → WE search+fetch → it digests.
        tasks = [asyncio.create_task(_research_agent(A, slots, i, sq, today)) for i, sq in enumerate(subqs)]
        yield ev("step", icon="🛰", text=f"Sent {len(tasks)} researchers out…")
        results = []
        try:
            for fut in asyncio.as_completed(tasks):
                r = await fut
                results.append(r)
                if r.get("digest"):
                    yield ev("step", icon="📄", text=f"{r['provider']} reported back ({len(r['sources'])} sources)")
                elif r.get("error"):
                    yield ev("step", icon="⚠️", text=f"a researcher hit a wall: {r['error'][:80]}")
        finally:
            # client disconnect (GeneratorExit) or any early exit → don't leave researchers
            # running and burning free-tier quota: cancel + await every still-pending task.
            for t in tasks:
                if not t.done():
                    t.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)

        briefs = [r for r in results if r.get("digest")]
        if not briefs:
            yield ev("error", text="The swarm came back empty — keys may be rate-limited, or every page was a wall. Try fewer providers or reword.")
            yield ev("done")
            return

        # 3) LOCAL model merges the digests. Dedup sources across agents by normalized
        #    URL so citations are global and the link list isn't repeated.
        yield ev("step", icon="✍️", text=f"Merging {len(briefs)} reports…")

        def _norm(u: str) -> str:
            u = (u or "").split("#")[0].rstrip("/")
            return re.sub(r"[?&](utm_[^=]+|fbclid|gclid|ref)=[^&]*", "", u)

        global_sources, url_to_n = [], {}
        for b in briefs:
            for s in b["sources"]:
                k = _norm(s["url"])
                if k not in url_to_n:
                    global_sources.append({"title": s["title"], "url": s["url"]})
                    url_to_n[k] = len(global_sources)
        brief_blocks = []
        for b in briefs:
            cites = sorted({url_to_n[_norm(s["url"])] for s in b["sources"]})
            tag = " ".join(f"[{n}]" for n in cites) or "(no usable sources)"
            brief_blocks.append(f'RESEARCHER ({b["provider"]}) on "{b["subq"]}":\n{b["digest"]}\n(drew on {tag})')
        merged = "\n\n".join(brief_blocks)
        src_list = "\n".join(f"[{i+1}] {s['title']} — {s['url']}" for i, s in enumerate(global_sources))
        syn_system = (
            getattr(A, "PERSONA", "You are Tiff.") +
            f"\n\nYour research swarm just came back. Today is {today}. Several researchers each dug into a "
            "piece of B's question and sent the cited digests below. Merge them into ONE clear, honest answer "
            "in your voice — combine what agrees, flag where they disagree. Cite like [1][2] using the SOURCES "
            "list at the end. Trust the digests for anything recent over your own memory. If they don't "
            "actually answer him, say so plainly."
        )
        payload = {
            "model": local_model,
            "messages": [{"role": "system", "content": syn_system},
                         {"role": "user", "content": f"B'S QUESTION: {question}\n\nRESEARCHER REPORTS:\n{merged}\n\nSOURCES:\n{src_list}"}],
            "temperature": 0.5,
            "reasoning_effort": effort,
            "max_tokens": 1600 if effort == "high" else 1200,
            "stream": True,
        }
        async for chunk in A.lm_stream(payload):
            yield chunk
        yield ev("sources", items=global_sources)
        yield ev("done")

    return StreamingResponse(gen(), media_type="text/event-stream")


# ── provider-slot CRUD (what the Swarm Settings page talks to) ────────────────

@router.get("/api/swarm/presets")
async def swarm_presets():
    return {"presets": PRESETS}


@router.get("/api/swarm/providers")
async def swarm_list():
    keys = _load_keys()
    return {"providers": [
        {"id": p["id"], "name": p.get("name", ""), "base_url": p.get("base_url", ""),
         "model": p.get("model", ""), "enabled": p.get("enabled", True),
         "grounded": p.get("grounded", False), "key_masked": _mask(keys.get(p["id"], ""))}
        for p in _load_providers()
    ]}


@router.post("/api/swarm/providers")
async def swarm_save(req: Request):
    d = await req.json()
    name = (d.get("name") or "").strip()
    base_url = (d.get("base_url") or "").strip()
    model = (d.get("model") or "").strip()
    if not (name and base_url and model):
        return JSONResponse({"error": "need name, base_url and model"}, status_code=400)
    provs = _load_providers()
    pid = re.sub(r"[^a-zA-Z0-9-]", "", d.get("id") or str(uuid.uuid4()))
    row = {"id": pid, "name": name, "base_url": base_url, "model": model,
           "enabled": bool(d.get("enabled", True)), "grounded": bool(d.get("grounded", False)),
           "ts": int(time.time())}
    provs = [p for p in provs if p["id"] != pid] + [row]
    _save_json(PROV_FILE, provs)
    # secret rides separately; only overwrite when a new key is actually provided
    key = (d.get("api_key") or "").strip()
    if key:
        async with _KEYS_LOCK:                            # re-read under lock so a concurrent save isn't clobbered
            keys = _load_keys(); keys[pid] = key; _save_keys(keys)
    return {"ok": True, "id": pid}


@router.delete("/api/swarm/providers/{pid}")
async def swarm_delete(pid: str):
    pid = re.sub(r"[^a-zA-Z0-9-]", "", pid)
    _save_json(PROV_FILE, [p for p in _load_providers() if p["id"] != pid])
    async with _KEYS_LOCK:                                # re-read under lock so a concurrent save isn't clobbered
        keys = _load_keys()
        if keys.pop(pid, None) is not None:
            _save_keys(keys)
    return {"ok": True}


@router.post("/api/swarm/test")
async def swarm_test(req: Request):
    """Validate a slot before saving — a cheap 1-token call so a bad base_url or a
    revoked/rate-limited key fails loudly at add-time, not mid-swarm."""
    d = await req.json()
    base_url = (d.get("base_url") or "").strip()
    model = (d.get("model") or "").strip()
    key = (d.get("api_key") or "").strip()
    if not (base_url and model and key):
        # allow testing a saved slot by id (key already on disk)
        pid = re.sub(r"[^a-zA-Z0-9-]", "", d.get("id") or "")
        slot = next((p for p in _load_providers() if p["id"] == pid), None)
        if slot:
            base_url, model = slot["base_url"], slot["model"]
            key = _load_keys().get(pid, "")
    if not (base_url and model and key):
        return JSONResponse({"ok": False, "error": "need base_url, model and api_key"}, status_code=400)
    slot = {"name": "test", "base_url": base_url, "model": model, "api_key": key}
    try:
        out = await provider_once(slot, "Reply with the single word: ok", "ping", 5, 0.0)
        return {"ok": True, "reply": out[:60]}
    except RateLimited:
        return {"ok": False, "error": "rate-limited (429) — the key works but the free tier is busy; try again shortly"}
    except ProviderError as e:
        return {"ok": False, "error": str(e)}
    except Exception as e:
        return {"ok": False, "error": f"couldn't reach it: {e}"}


@router.post("/api/swarm/models")
async def swarm_models(req: Request):
    """List the models a provider actually serves RIGHT NOW — GET {base_url}/models with the
    user's key. Lets the Add-provider form show the LIVE catalog instead of stale hardcoded ids,
    so "there's a newer model" is just a click away. Capped + sorted."""
    d = await req.json()
    base_url = (d.get("base_url") or "").strip().rstrip("/")
    key = (d.get("api_key") or "").strip()
    if not base_url:
        return JSONResponse({"ok": False, "error": "need a base URL"}, status_code=400)
    if not key:                                            # allow a saved slot's key (by id)
        pid = re.sub(r"[^a-zA-Z0-9-]", "", d.get("id") or "")
        key = _load_keys().get(pid, "")
    headers = {"Authorization": f"Bearer {key}"} if key else {}
    try:
        async with httpx.AsyncClient(timeout=20) as cx:
            r = await cx.get(f"{base_url}/models", headers=headers)
        if r.status_code != 200:
            return JSONResponse({"ok": False, "error": f"{r.status_code}: {(r.text or '')[:160]}"}, status_code=200)
        j = r.json()
        data = j.get("data") or j.get("models") or (j if isinstance(j, list) else [])
        ids = sorted({ (m.get("id") if isinstance(m, dict) else str(m)) for m in data
                       if (isinstance(m, dict) and m.get("id")) or isinstance(m, str) })
        return {"ok": True, "models": ids[:400], "total": len(ids)}
    except Exception as e:
        return JSONResponse({"ok": False, "error": f"couldn't list models: {e}"}, status_code=200)


@router.post("/api/research-for-build")
async def research_for_build(req: Request):
    """Research the CORRECT, current way to build something so the Builder's small local model
    codes from real reference instead of guessing — the whole reason the swarm exists. Returns a
    compact brief the Builder injects into its build prompt. Non-streaming JSON; degrades to an
    empty brief (build proceeds normally) if no providers are configured."""
    import app as A
    body = await req.json()
    instruction = (body.get("question") or body.get("prompt") or "").strip()
    history = body.get("messages", [])
    model = body.get("model") or getattr(A, "DEFAULT_MODEL", "")
    kind = (body.get("kind") or "app")           # 'app' | 'plugin' — flavors the research question
    slots = _enabled_slots()
    if not slots or not instruction:
        return {"brief": "", "sources": [], "providers": len(slots)}
    today = A._today()
    convo = ""
    for m in history[-6:]:
        c = A._content_text(m.get("content")).strip()
        if c:
            convo += f"{'B' if m.get('role') == 'user' else 'Tiff'}: {c[:400]}\n"
    focus = ("a single-file HTML/CSS/JS web app"
             if kind != "plugin" else
             "a Web-Audio TIFF_PLUGINS.register({name,params,create(ctx)}) plugin using only native AudioNodes")
    question = (f"The correct, current, working way to build {focus} for this request: {instruction}. "
                "Exact APIs / methods / attributes, correct syntax, working code patterns, and common mistakes to avoid.")
    n = min(len(slots), 4)
    subqs = await _split_question(A, model, question, convo, n)
    briefs = await asyncio.gather(*[_research_agent(A, slots, i, sq, today) for i, sq in enumerate(subqs)],
                                  return_exceptions=True)
    briefs = [b for b in briefs if isinstance(b, dict) and b.get("digest")]
    if not briefs:
        return {"brief": "", "sources": [], "providers": len(slots), "researchers": 0}
    seen, sources, parts = set(), [], []
    for b in briefs:
        parts.append(f"• ({b['provider']}) {b['digest']}")
        for s in b["sources"]:
            if s["url"] not in seen:
                seen.add(s["url"]); sources.append({"title": s["title"], "url": s["url"]})
    brief = "\n".join(parts)[:4000]   # cap so it never blows the small local model's context window
    return {"brief": brief, "sources": sources, "providers": len(slots), "researchers": len(briefs)}
