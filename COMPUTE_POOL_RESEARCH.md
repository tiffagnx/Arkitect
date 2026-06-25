# Compute-Pool Research — powering heavy image/video gen in DeMartinville

*Deep-research run, 2026-06-23. 21 sources fetched, 25 claims adversarially verified (25 confirmed, 0 killed). Prices are mid-2026 snapshots and drift — re-verify model slugs/prices at integration time.*

---

## THE ANSWER (what to wire first)

**Serverless pay-per-generation API (fal.ai or Replicate) — wire this one first.**

Why it wins for a free, local-first app:
- **One authenticated REST call. No box to provision, monitor, or tear down.** Zero surprise-meter risk.
- **Pure pay-per-output billing** = fits the à-la-carte / no-subscription money model exactly. You pass cost through per generation.
- **It already mirrors the Atlas Cloud path you shipped in v1.9.1** — same shape, you're extending a proven door, not building a new kind of thing.
- Hosts the exact open models you want: **FLUX, Qwen-Image, Wan, LTX video.**

**Then:** keep the swappable ComfyUI base-URL door open so a power user can point at their *own* rented RunPod/Salad box. Treat Salad's cheap consumer pool as a **later cost-optimization**, not a v1 dependency.

---

## COST-PER-GENERATION TABLE (mid-2026)

| Route | Image cost | Short video cost | Integration shape | Billing risk |
|---|---|---|---|---|
| **Serverless — fal.ai / Replicate** ⭐ | FLUX Schnell **$0.003**, FLUX Dev **$0.025**, FLUX 1.1 Pro **$0.04**/img · Qwen-Image **~$0.02/megapixel** | 5-sec 1080p LTX-2 Fast **≈$0.20** · Wan **$0.05/sec** (480p) → **$0.15/sec** (1080p) · Replicate Wan **$0.09/sec** (480p) | **Single REST call**, no box. Bearer key. | **None** — pure per-output, nothing to leave running |
| **Rented box — RunPod** | pennies/img at volume | pennies/sec at volume | Your own ComfyUI via base URL + `Bearer` token. Full lifecycle REST API (create/start/stop/teardown pods). Also a serverless `worker-comfyui` (/runsync, /run). | **Hourly meter** — an un-torn-down pod bleeds money. App must auto-stop aggressively. |
| **Community pool — Salad** | cheapest/hr | cheapest/hr | ComfyUI as a stateless API behind one base URL + optional `Salad-Api-Key` header — **matches your existing integration shape**. Body expects a full ComfyUI workflow-graph JSON. | **Hourly meter.** Cheap numbers are *batched-throughput* economics, NOT single-user interactive latency. |
| **Vast.ai** | per-second, host-set (variable) | per-second, host-set | Your own ComfyUI box | **Per-second + auto-stop at $0 balance** = the billing-safest rented box, but variable host pricing |

**GPU rental rates (for the box routes):**
- RunPod RTX 4090 **$0.34–0.69/hr**, RTX 5090 **$0.69–0.99/hr**, L40S **$0.86/hr**, A100 SXM **$1.49/hr**, H100 SXM **$3.29/hr**
- Salad RTX 4090 **~$0.16–0.30/hr** (cheapest per-hour of the three — Batch tier $0.16, High $0.30)
- Vast.ai H100 **~$1.50–1.87/hr** (marketplace, fluctuates)

---

## THE GOTCHAS (these would've bitten us)

1. **Video can NEVER be a simple blocking request.** Synchronous calls have hard timeouts (Salad's gateway = 100s). Video gen (1–30 min) MUST go async/job-queue/webhook + poll, on *every* route. Plan the app's video flow as async from day one.
2. **Headline video $/sec is a low-res FLOOR.** Wan "$0.05/sec" is the 480p price; usable 1080p is **2–3x**. Any cost table shown to users must use resolution-appropriate rates.
3. **The "one free model on YOUR key" abuse-prevention is NOT a vendor feature — it's on us.** No platform hands you drain-proofing. It's a DeMartinville-side architecture job: server-side proxy + **hard daily spend cap** + per-IP/per-session rate limit + whitelist exactly the one free model. Build it locked-down or not at all.
4. **All of this is NVIDIA-only in practice.** FLUX/Qwen/Wan/LTX/Hunyuan — no viable AMD/Intel path surfaced.

---

## OPEN QUESTIONS (cheap to answer next, no big research needed)

1. **Does Atlas Cloud (already wired) host FLUX/Qwen/Wan/LTX at competitive per-output prices?** If yes → "wire serverless first" = literally just extend the Atlas path you already built. **Check Atlas's model list first — this could make the next build nearly free.** ⬅ do this before adding any new provider.
2. Real single-user *interactive* cold-start/latency per route (pricing is known; felt wall-clock time isn't).
3. Break-even volume: at what monthly generation count does standing up a RunPod/Salad box beat paying fal/Replicate per call?
4. The proxy abuse-prevention design (see gotcha #3).

---

## HOW IT PLUGS INTO WHAT'S ALREADY BUILT

- `/api/capability` (live) detects the rig → decides *who even needs the pool*.
- `cloud_generate` + Atlas (v1.9.1) = the serverless door already open → **extend it** (open question #1).
- The single swappable `COMFY` base URL = the exact slot a rented RunPod/Salad box drops into for power users.
- Monetization: serverless per-output cost passes straight through the **pay-per-use meter** (`monetization-arsenal-model`); BYO-key users pay the provider directly (free to you).

*Full cited findings + source list: see the workflow output. Sources include runpod.io/pricing, fal.ai/pricing, replicate.com/pricing, ltx.io, docs.salad.com, docs.vast.ai.*
