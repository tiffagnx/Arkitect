# Notifi — artist payments (0% middleman) — handoff (2026-06-25)

Built the artist-payment layer into **The Stream / Notifi**, per the owner's locked decision:
**Notifi takes 0%, the artist gets 100%, the owner is NEVER in the money loop.** No Stripe on our
side, no fees, no payment liability. It's a **link-out**: artists drop their OWN pay handle, fans tap
**Support** → the artist's own Cash App / Venmo / PayPal / Ko-fi / link. The money never touches Notifi.

> Built + Chrome-verified, zero console errors. **UNCOMMITTED** on purpose (parallel Kitchen + Stream
> sessions live; owner batches everyone's work into one — see memory `[[parallel-session-coordination]]`).
> Extends the Stream session's room — left a note here instead of touching `STREAM_HANDOFF.md`.

## What was built
- **`app.py`** `/api/stream/publish` — stores three new per-item fields (additive, sanitized):
  `pay` (the artist's payout URL — **https only**, else nulled — blocks `javascript:` etc.),
  `payLabel` ("Cash App"…), `owns` (bool attestation) + `ownsTs`.
- **`static/stream.html`** (the room):
  - Publish modal: a **"Where fans pay you"** row (method dropdown + handle) + a **required "I own this"
    checkbox** (legal gate — blocks publish if unchecked). Method+handle remembered in `localStorage.dmv_pay`.
  - Helpers `payUrl(method,raw)` (builds the https URL), `payLabelOf`, `paySupport(it)`, `creatorPay(name)`.
  - **Support buttons** (green `.support`, link-out, `target=_blank`) on: the feature hero, the
    now-playing bar (`#nbSupport`, updates per track), the artist channel banner, and the video theater.
- **`static/stream-publish.js`** (the shared lab dialog used by Beat Lab / Studio / Visual Labs): same
  pay-method + handle + required ownership checkbox; sends `pay`/`payLabel`/`owns`.

## Verified
Publish via API with `pay` + `owns` → stored correctly (+ `ownsTs`). Non-https `pay` → nulled. Bad/no
ownership → publish blocked at the UI. Support button renders + links to `https://cash.app/$…` on the
feature hero AND the now-playing bar. Test items published then **deleted — feed is empty, no fake data.**

## Honest notes / not done
- **Link-out trade-off (by design):** the fan leaves the page to pay on the artist's own app; Notifi
  can't show "verified payout" stats (it never sees the money). That's the cost of 0%-middleman — accepted.
- Pay link is stored **per item** at publish time (needed for shared mode, where viewers don't have the
  artist's localStorage). Editing your payout updates **future** drops; re-publish to update old ones.
  A future "artist profile / edit payout" that rewrites all of an artist's items is the clean follow-up.
- **Legal checkmarks still owed at the org level** (separate from this code): register a DMCA agent
  ($6, copyright.gov), publish a `/dmca` page, a real Terms w/ ownership warranty + indemnification, and
  a takedown kill-switch (the per-item delete already exists; an admin sweep is the add). See
  `[[notifi-artist-money-model]]` for the full legal must-dos.
- To go public/shared: `STREAM_HOSTING.md` (host with `DMV_SHARED=1`).

## Files touched
`app.py` (publish item fields) · `static/stream.html` · `static/stream-publish.js`. Nothing else.
