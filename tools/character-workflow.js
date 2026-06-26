export const meta = {
  name: 'character-creator-slice',
  description: 'Build the build-a-character creator: design 3 lenses, lock spec, build one agent per file, adversarially verify wiring honesty brand',
  phases: [
    { title: 'Design' },
    { title: 'Lock Spec' },
    { title: 'Build' },
    { title: 'Verify' },
  ],
}

// LOCKED TECHNICAL CONTRACT — every build piece MUST agree on this exactly. FROZEN.
const CONTRACT = [
  'LOCKED CONTRACT (frozen — all files must agree exactly on these):',
  '',
  'STORAGE — localStorage key "dmv_characters" = JSON array of character objects:',
  '{ id, name, craft, craftLabel, tagline, color, glyph, voice, persona, knowledge, rooms, readiness, createdAt, mine:true }',
  '  id: browser-generated unique ("c"+Date.now()+rand), STABLE once made.',
  '  craft: one of producer|mix|beatmaker|songwriter|editor|visual|builder.',
  '  craftLabel: human label e.g. "Mix Engineer".  tagline: short, under 40 chars.',
  '  color: hex avatar color.  glyph: ONE emoji or "" (then fall back to name initial).',
  '  voice: one of chill-mentor|precise-tech|hype|zen-teacher.',
  '  persona: assembled system-prompt fragment (how they talk + their craft).',
  '  knowledge: optional fed text (their notes/approach), may be "".',
  '  rooms: array of home room keys from craft (e.g. ["studio"]).  readiness: 0-100.',
  '  createdAt: Date.now() at save.  mine: true.',
  '',
  'CRAFT to ROOM map (use exactly): producer=studio, mix=studio, beatmaker=studio,',
  '  songwriter=studio, editor=editor, visual=images, builder=build.',
  'Room keys to labels: studio="DeMartin Audio Labs", editor="LePrince Visual Labs",',
  '  images="Imagination Station", build="Berner Builder", bit16="Bit1Six".',
  '',
  'READINESS formula (HONEST — must cap at 80 today; final 20 is a LOCKED tier NOT built yet,',
  'shown locked, never auto-granted):',
  '  base 10 + name 6 + craft 14 + voice 8 + tagline 8 + (glyph or color chosen) 8 = up to ~54 identity',
  '  + knowledge fed: up to 26, scaled by length (~1 per 60 chars, capped 26) = up to 80 total.',
  '  final 20 reserved + shown LOCKED with honest copy ("they level up as you actually work with them in',
  '  the rooms — training-by-watching is on the road, not built yet"). A fully filled+fed character reaches',
  '  ~80, NEVER 100 today. This honesty is non-negotiable (owner has zero tolerance for faked mechanics).',
  '',
  '/api/kit REQUEST BODY (kit-helper.js to backend) — existing fields room, message, character PLUS',
  '  OPTIONAL fields sent ONLY for user-created (mine) characters: persona, knowledge, charName, charCraft.',
  '  For Kit + preview cast (Boogie/Vex/Quill) these are omitted/empty (unchanged behavior).',
  '',
  '/api/kit BACKEND: if persona present+non-empty, build the system prompt so the brain IS charName, a',
  '  charCraft in DeMartinville room, talking per persona, STILL grounded in real ROOM_HELP + KB (never',
  '  invent features), fed knowledge appended as the character notes bounded ~1500 chars. If persona',
  '  absent/empty, behavior must be byte-for-byte identical to today (no regression). Purely additive.',
  '',
  'DEEP-LINK: character.html "take into a room" buttons link to /static/ROOMKEY.html?char=ID',
  '  kit-helper.js on load reads ?char=ID; if it matches a stored entry, opens the helper + activates it.',
  '',
  'ROSTER MERGE (kit-helper.js): read dmv_characters on load, map each to a chip AFTER the built-in cast.',
  '  A user character chip shows its readiness % (e.g. "62%") instead of "PREVIEW", uses its color +',
  '  glyph/initial avatar. Add a trailing "+ Build" chip linking to /static/character.html. Activating a',
  '  mine character sends persona+knowledge+charName+charCraft. Listen for window "storage" and a',
  '  "dmv-characters-changed" CustomEvent so a new character can appear without full reload (best-effort).',
  '',
  'FILE OWNERSHIP — no agent touches another agent file:',
  '  character.html = NEW. kit-helper.js, app.py (kit_help only), index.html (rail link only) = surgical.',
].join('\n');

const BRAND = [
  'BRAND (locked — DeMartinville. ONE canonical coded logo; NEVER font-render the wordmark casually;',
  'NO trademark names user-facing — no Pro Tools / After Effects / FabFilter / Premiere / Avid):',
  '',
  'Google Fonts (in <head>):',
  '<link rel="preconnect" href="https://fonts.googleapis.com" />',
  '<link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Oswald:wght@700&family=Allura&family=Space+Mono&display=swap" rel="stylesheet" />',
  '',
  'Color tokens (:root):',
  '  --bg:#0A0B0E; --bg1:#101116; --panel:#15161B; --line:rgba(255,255,255,.08);',
  '  --text:#E7E9EE; --dim:#9AA0AC; --faint:rgba(154,160,172,.6);',
  '  --teal:#7BB6CD; --teal2:#3E9CB8; --gold:#E6C16A; --gold2:#D9A441; --purp:#C98BD0;',
  '',
  'The canonical .dmv logo lockup — paste this HTML where the brand mark goes:',
  '<span class="dmv" role="img" aria-label="DeMartinville"><span class="w"><span class="b">DeMartin</span><span class="s">ville</span></span></span>',
  'with this CSS:',
  '.dmv{display:inline-flex;align-items:center;justify-content:center;gap:.42em;line-height:1}',
  '.dmv .w{white-space:nowrap;line-height:1}',
  '.dmv .b{font-family:Oswald,sans-serif;font-weight:700;font-size:1em;letter-spacing:.005em}',
  '.dmv .s{font-family:Allura,cursive;font-size:1.35em;margin-left:-.02em}',
  '.dmv .b,.dmv .s{background:linear-gradient(180deg,#f7f9fc,#cfd6df 46%,#9aa3af 55%,#eef1f5);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}',
  '',
  'Headings use Oxanium 800; body uses Inter; mono labels use Space Mono with wide letter-spacing.',
  'The readiness bar, gold CTAs, and graphite panels echo static/join.html. A "← back to chat" pill',
  '(links to "/") belongs top-left, matching the app rooms.',
].join('\n');

const OWNER = [
  'WHO IT IS FOR (owner "B"): solo founder, raw, exhausted-but-flying off his first traction. ZERO',
  'tolerance for faked mechanics or hype — be HONEST about what is real today vs on the road. The app',
  'identity is "local · private · yours" — characters you build are private, local, free, yours. The hook',
  'is a VIDEO-GAME CHARACTER CREATOR: building a character that is THEIRS should feel fun, fast, personal.',
  'Do not oversell instant perfection; the real "trains by watching you work" is a road, not a today.',
  'Copy is warm and plain, never corporate.',
].join('\n');

const DESIGN_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    headline: { type: 'string' },
    subhead: { type: 'string' },
    flowSteps: { type: 'array', items: { type: 'string' } },
    livecardSpec: { type: 'string' },
    craftOptions: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { key: { type: 'string' }, label: { type: 'string' }, glyph: { type: 'string' }, room: { type: 'string' } },
      required: ['key', 'label', 'glyph', 'room'] } },
    voiceOptions: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { key: { type: 'string' }, label: { type: 'string' }, desc: { type: 'string' } },
      required: ['key', 'label', 'desc'] } },
    readinessLockedCopy: { type: 'string' },
    honestyCopy: { type: 'string' },
    savedCelebration: { type: 'string' },
    rosterUX: { type: 'string' },
    risks: { type: 'array', items: { type: 'string' } },
  },
  required: ['headline', 'subhead', 'flowSteps', 'livecardSpec', 'craftOptions', 'voiceOptions', 'readinessLockedCopy', 'honestyCopy', 'savedCelebration', 'rosterUX', 'risks'],
};

const SPEC_SCHEMA = DESIGN_SCHEMA;

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    area: { type: 'string' },
    pass: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { severity: { type: 'string' }, file: { type: 'string' }, detail: { type: 'string' }, fix: { type: 'string' } },
      required: ['severity', 'detail', 'fix'] } },
    notes: { type: 'string' },
  },
  required: ['area', 'pass', 'issues', 'notes'],
};

// Phase 1: Design, three lenses
phase('Design');
const LENSES = [
  { k: 'game-creator', brief: 'Lens: VIDEO-GAME CHARACTER CREATOR. The validated mental model (a big producer said he would get on it after playing GTA — people want to BUILD a character and PLAY, not join a marketplace). Make the create flow feel like an RPG character builder: a live character CARD that updates as you choose, satisfying step-by-step choices, a readiness bar that visibly climbs, a celebratory "they are ready" moment, then "take them into a room." Maximize the dopamine of making something that is YOURS.' },
  { k: 'white-label', brief: 'Lens: WHITE-LABEL / it becomes YOUR DeMartinville. Research verdict (decisive) = go white-label first: a creator builds a character of their own craft and brings it to THEIR audience; the AI must ALWAYS POINT UP (route to the real human/studio). Make building a character feel like minting your own branded helper that does real work and funnels to the real you. Make craft + persona + "what you know" capture feel like it is learning YOUR way of working. Keep always-point-up honesty in the copy.' },
  { k: 'honest-mvp', brief: 'Lens: HONEST MVP / scope discipline. What is ACTUALLY buildable today on existing infra (Kit = one brain + a knowledge pack + a persona; no per-character trained model)? Keep the other lenses honest: flag anything that fakes the marketplace, fakes per-character training, or implies it learns by watching when that is not built. Define the readiness formula + WIP framing so the page is exciting but 100% true. Nail the smallest flow that still feels alive.' },
];
const designs = (await parallel(LENSES.map(l => () => agent(
  'You are designing the UX + copy for a NEW page static/character.html — the build-a-character-and-play creator for DeMartinville (a local, private, free creative studio).\n\n' + l.brief + '\n\n' + OWNER + '\n\n' + CONTRACT + '\n\n' + BRAND + '\n\nThe TECHNICAL CONTRACT above is FROZEN — design WITHIN it (you may shape UX, flow, copy, and the craft/voice option lists, but never change the storage schema, the readiness cap-at-80 honesty, the /api/kit fields, or the file boundaries).\n\nReturn your design as the schema: a hero headline + subhead in the owner warm/honest voice; the ordered create flow steps; how the live character CARD preview looks and updates; the craftOptions list (key/label/glyph/room — keys MUST be from the contract craft set and rooms MUST match the map); the voiceOptions list (keys MUST be chill-mentor/precise-tech/hype/zen-teacher); the readinessLockedCopy (honest copy for the locked final 20); the honestyCopy (no-smoke WIP framing); the savedCelebration microcopy; the rosterUX (your roster + edit/delete + take-into-room); and risks.',
  { label: 'design:' + l.k, phase: 'Design', schema: DESIGN_SCHEMA, effort: 'high' }
)))).filter(Boolean);
log('Design lenses returned: ' + designs.length + '/3');

// Phase 2: Lock the spec
phase('Lock Spec');
const spec = await agent(
  'Synthesize ONE locked design spec for static/character.html from these ' + designs.length + ' independent design takes. Keep the BEST of each: the game-creator dopamine, the white-label always-point-up honesty, and the honest-MVP scope discipline.\n\nTHE TECHNICAL CONTRACT IS FROZEN — your spec must conform exactly:\n' + CONTRACT + '\n\n' + BRAND + '\n' + OWNER + '\n\nThe design takes (JSON):\n' + JSON.stringify(designs, null, 2) + '\n\nProduce a single coherent spec in the schema. Requirements: craftOptions keys exactly from {producer,mix,beatmaker,songwriter,editor,visual,builder} with the correct room per the map; voiceOptions keys exactly {chill-mentor,precise-tech,hype,zen-teacher} with a one-line desc each that doubles as the seed of that voice persona; readinessLockedCopy + honestyCopy must be HONEST (cap 80 today, the rest is the road); flow feels like a game character creator with a live card; rosterUX covers created-character cards, edit, delete, and take-into-room deep-links. Copy warm, plain, his voice.',
  { label: 'synthesize-spec', phase: 'Lock Spec', schema: SPEC_SCHEMA, effort: 'high' }
);
log('Spec locked: ' + spec.headline);

// Phase 3: Build — one agent per file (distinct files, no conflicts)
phase('Build');
const SPEC_JSON = JSON.stringify(spec, null, 2);

const BUILDS = [
  { file: 'static/character.html', task:
    'BUILD the NEW file static/character.html — the build-a-character-and-play creator + your-roster page. It does not exist yet; Write it from scratch, self-contained (inline <style> + <script>, no build step, no external JS deps; Google Fonts link is fine).\n\nImplement the locked spec exactly. It MUST:\n- Match BRAND tokens + use the canonical .dmv logo lockup. Top-left "← back to chat" pill linking to "/".\n- A live character CARD preview (avatar = chosen color radial with glyph or name initial; name; craftLabel; tagline; voice; a readiness bar) that updates LIVE as the form changes.\n- Create flow: name, then craft (icon grid from spec.craftOptions), then look (color swatches + a small glyph/emoji picker), then voice (cards from spec.voiceOptions), then feed-what-you-know (a textarea; honest note it is optional, their notes/approach, not magic).\n- Compute readiness with the contract EXACT formula (cap 80; show locked final 20 with spec.readinessLockedCopy). Assemble the persona string from craft + voice + tagline + name (a compact system-prompt fragment). Derive rooms from craft via the contract map. Set craftLabel from the chosen craft option label.\n- SAVE: append/replace into localStorage "dmv_characters" with the EXACT object shape from the contract (id "c"+Date.now()+short random, createdAt Date.now(), mine:true). On save dispatch window.dispatchEvent(new CustomEvent("dmv-characters-changed")). Show spec.savedCelebration, then take-them-into-a-room buttons linking to /static/ROOMKEY.html?char=ID for each home room.\n- YOUR ROSTER section: cards for every stored character (load + re-render on load and on the change event) with Edit (re-loads into the form) and Delete (confirm). Each card has take-into-room deep-links. Warm empty state.\n- Honest WIP framing per spec.honestyCopy somewhere visible (no faked marketplace/training claims).\n- Clean, no console errors, graceful if localStorage is empty/corrupt (try/catch JSON.parse).\n\n' + CONTRACT + '\n' + BRAND + '\n' + OWNER + '\n\nLOCKED SPEC (JSON):\n' + SPEC_JSON + '\n\nWrite the file, then report what you built in 4-6 lines (sections, the exact localStorage shape, the deep-link format).' },
  { file: 'static/kit-helper.js', task:
    'SURGICAL EDIT of static/kit-helper.js — wire user-created characters into the in-room roster. Read the file first; it already has a CHARACTERS array (Kit + preview Boogie/Vex/Quill), a roster strip, drag-to-activate, and an ask() that POSTs to /api/kit with {room, message, character}. Make ADDITIVE changes only — do NOT break the existing cast, drag, or window behavior.\n\nAdd:\n1) On init, load localStorage "dmv_characters" (try/catch). Map each stored character to a roster entry appended AFTER the built-in cast. A user character uses its color + glyph (or name initial) avatar; carries persona, knowledge, name, craftLabel; mine:true; its chip shows readiness % (e.g. "62%") instead of "PREVIEW". Extend the existing avatar()/chip code paths, do not rewrite them.\n2) In ask(): when the active character is mine, include persona, knowledge, charName, charCraft in the POST body alongside the existing room/message/character. For Kit + preview cast, send exactly what it sends today. A mine character must NOT get the "preview character" prefix.\n3) Add a trailing roster chip "+ Build" that navigates to /static/character.html.\n4) Deep-link: on load read ?char=ID from location.search; if it matches a loaded stored character, open the helper window and setActive() it.\n5) Refresh: listen for window "storage" and "dmv-characters-changed"; reload the stored characters into the roster (best-effort, do not disrupt an in-progress chat).\n\n' + CONTRACT + '\n' + OWNER + '\n\nLOCKED SPEC (JSON):\n' + SPEC_JSON + '\n\nOnly edit static/kit-helper.js. Report the changes in 4-6 lines, including the exact POST body fields you now send for a mine character.' },
  { file: 'app.py', task:
    'SURGICAL EDIT of app.py — edit ONLY the kit_help() function (the @app.post("/api/kit") handler, ~line 3937). A parallel session may be editing OTHER regions of app.py, so DO NOT touch anything outside kit_help(). Read the function first.\n\nAdd an additive branch: read optional body fields persona (str), knowledge (str), charName (str), charCraft (str). When persona is present + non-empty, build the system prompt so the brain IS that character:\n- Lead with an identity override: "You are CHARNAME, a CHARCRAFT working inside DeMartinville ROOMLABEL. PERSONA" — then KEEP the existing room grounding (ROOM_HELP + the kb.as_prompt_block retrieval + the user-memory block) so the character still gives accurate room-true help and never invents features.\n- Append fed knowledge (bounded ~1500 chars) as the character own notes (e.g. "YOUR OWN NOTES / HOW YOU WORK (use when relevant): KNOWLEDGE").\n- Keep it honest + grounded; the character must not claim features that do not exist.\nWhen persona is absent/empty, behavior MUST be byte-for-byte identical to current (Kit + preview cast unchanged — purely additive). Preserve all existing try/except best-effort grounding.\n\n' + CONTRACT + '\n\nOnly edit the kit_help() function in app.py. Report the diff shape in 4-6 lines and confirm the no-persona path is unchanged.' },
  { file: 'static/index.html', task:
    'SURGICAL EDIT of static/index.html — add ONE link to the Rooms rail and nothing else. Read the rail (around line 289-298; it lists Blueprint Builds, DeMartin Audio Labs, LePrince Visual Labs, Imagination Station, Bit1Six, The Wall, For Creators).\n\nAdd a new rail link to static/character.html for the character creator, placed in the Rooms rail. Use a DISTINCT glyph from the existing For Creators 🎭 entry (suggest 🧬 or 👤) and a short label like "Characters" or "Build a Character". Match the existing markup pattern exactly: <a class="roomlink" href="/static/character.html"><span class="ri">GLYPH</span><span>LABEL</span></a>. Leave the existing For Creators link as-is. Change NOTHING else.\n\nReport the one line you added.' },
];
const builds = await parallel(BUILDS.map(b => () => agent(b.task, { label: 'build:' + b.file, phase: 'Build', effort: 'high' })));
log('Build phase complete; verifying.');

// Phase 4: Verify — adversarial, three independent checks
phase('Verify');
const CHECKS = [
  { area: 'wiring', prompt: 'Adversarially verify the END-TO-END WIRING across the four files (static/character.html, static/kit-helper.js, app.py kit_help(), static/index.html). Read all four. Check the CONTRACT is honored exactly: (1) the localStorage "dmv_characters" object shape WRITTEN by character.html exactly matches what kit-helper.js READS (every downstream field exists: id, name, color, glyph, persona, knowledge, craftLabel, rooms, readiness, mine). (2) The /api/kit body fields kit-helper.js SENDS for a mine character (persona, knowledge, charName, charCraft) are exactly the names app.py READS. (3) The deep-link /static/ROOMKEY.html?char=ID produced by character.html is exactly what kit-helper.js parses, with valid room keys. (4) The "+ Build" chip + index.html rail link both point to /static/character.html. Report any MISMATCH with file + exact fix. Be skeptical — assume field-name or room-key drift until proven otherwise.' },
  { area: 'honesty', prompt: 'Adversarially verify HONESTY + BRAND. Read static/character.html and the readiness logic. The owner has ZERO tolerance for faked mechanics. Confirm: (1) readiness CANNOT reach 100 today — it caps at ~80 and the final 20 is shown LOCKED with honest copy; verify the math actually caps. (2) No copy claims the character learns by watching you work as a built feature, no fake marketplace/payment claims, no "trained on real sessions" as if done. (3) Brand: the canonical .dmv logo lockup is used (NOT a font-rendered DeMartinville); no trademark names (Pro Tools/After Effects/FabFilter/Premiere/Avid). (4) The white-label points-up-to-the-real-you framing, if present, is honest. List every violation with the exact text + fix, or pass.' },
  { area: 'correctness', prompt: 'Adversarially verify CODE CORRECTNESS. Read static/character.html, static/kit-helper.js, and app.py kit_help(). Hunt real bugs: (1) JS syntax errors, unclosed tags, undefined vars, broken template literals in character.html and kit-helper.js. (2) localStorage JSON.parse without try/catch (corrupt/empty must not white-screen). (3) kit-helper.js: does the roster merge break if dmv_characters is absent? Does the no-persona path (Kit/preview) still send the OLD body unchanged? Does ?char deep-link handle a missing/invalid id gracefully? (4) app.py: is the no-persona branch byte-for-byte equivalent to before (no regression for Kit)? Any Python error if the new fields are missing? (5) Edit/Delete in the roster: does delete persist, does edit reload correctly? Report concrete bugs with file + context + exact fix, or pass.' },
];
const verdicts = (await parallel(CHECKS.map(c => () => agent(
  c.prompt + '\n\nFor reference, the FROZEN contract the code must honor:\n' + CONTRACT,
  { label: 'verify:' + c.area, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'high' }
)))).filter(Boolean);

return { spec, builds, verdicts, buildFiles: BUILDS.map(b => b.file) };
