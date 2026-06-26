export const meta = {
  name: 'character-page-icy-redesign',
  description: 'Redesign character.html premium/icy: 3 design directions, lock the best, build it, adversarially verify no-emoji no-fakes honesty brand',
  phases: [
    { title: 'Directions' },
    { title: 'Lock' },
    { title: 'Build' },
    { title: 'Verify' },
  ],
}

// What the owner REJECTED (so agents never repeat it) + what he wants now.
const CONTEXT = [
  'CONTEXT — the owner ("B") just rejected the first version of static/character.html HARD:',
  '- It looked "cheesy / like 1998." This page is THE SELLING POINT — where real artists land to build their',
  '  character. It MUST feel premium, icy, decked-out, expensive — "damn, this is fire, I wanna build one."',
  '- He HATES emoji/cartoon ICONS. ZERO emoji glyphs anywhere. No emoji craft grid, no emoji avatar faces.',
  '- He does NOT want us shipping invented characters. The only built-ins are Tiff + Kit (his two real helpers).',
  '  This page is purely the TOOL a real human uses to build THEIR OWN character from THEIR OWN face.',
  'Owner is raw, money-tight, brilliant taste, zero tolerance for cheese or fakery. Match premium, not corporate.',
].join('\n');

// FROZEN build contract — the new page must honor this exactly (keeps kit-helper.js wiring working).
const CONTRACT = [
  'FROZEN BUILD CONTRACT (the redesigned static/character.html must honor all of this):',
  '',
  'PURPOSE: a premium tool for a REAL HUMAN to build THEIR OWN character. No pre-made/invented characters,',
  'no roster of fake people to pick from. Tiff + Kit are the only built-ins and they live in kit-helper.js,',
  'NOT on this page. This page = create + your-own-roster (only characters the user themselves built).',
  '',
  'AVATAR (the face) — EXACTLY 3 ways, NO emoji glyphs, ever:',
  '  1) PIXEL ME (recommended/default) — upload your real face, then turn it into a 16-bit PIXEL character.',
  '     The pixel art is made for FREE in Google Gemini (Nano Banana): show the user a copy-paste prompt +',
  '     an "open Gemini" link, they make it + bring the pixel image back (upload it). Recommended because it',
  '     is the owner aesthetic. Include a small client-side CHROMA-KEY (green-screen remover): if the uploaded',
  '     image has a solid green (#00B140-ish) background, a "remove green" toggle keys it transparent via canvas.',
  '  2) UPLOAD YOUR OWN — drop any image you already have (a photo, an avatar, anything). Same chroma-key option.',
  '  3) COLOR CIRCLE — no image; pick a circle color (brand palette). The zero-effort fallback.',
  '  Store the chosen image as a data URL. NO emoji glyph field at all.',
  '',
  'CRAFT — a clean DROPDOWN (NOT an icon grid). Options (keys frozen): producer, mix, beatmaker, writer,',
  '  editor, builder. Labels: Producer, Mix Engineer, Beatmaker, Writer / Songwriter, Video Editor, App Builder.',
  '  (Visual Artist is KILLED — do not include it.)',
  '',
  'ROOM — shown as a REAL ROOM SCREENSHOT (NOT an icon). The craft sets the home room; show that room as its',
  '  screenshot. Craft to room map (frozen): producer/mix/beatmaker -> studio; writer -> chat; editor -> editor;',
  '  builder -> build. Room screenshots already on disk, reference by these exact paths:',
  '    studio  = "DeMartin Audio Labs"   -> /static/studio.html  -> img /static/shots/daw.png',
  '    chat    = "Chat (with Tiff)"      -> /                     -> img /static/shots/chat.png',
  '    editor  = "LePrince Visual Labs"  -> /static/editor.html  -> img /static/shots/editor.png',
  '    build   = "Berner Builder"      -> /static/build.html   -> img /static/shots/build.png',
  '',
  'VOICE (keep it, restyle premium, NO emoji): 4 voice options as clean cards/segments — keys frozen:',
  '  chill-mentor, precise-tech, hype, zen-teacher. Each a one-line sample of how they talk.',
  '',
  'NOTES / "teach them how you work" (keep, optional): a textarea; honest copy that it is their own notes,',
  '  bounded ~1500 chars used by the brain.',
  '',
  'READINESS bar (keep, HONEST): same formula, HARD-CAPS at 80 today; the final 20 is shown LOCKED with honest',
  '  copy ("they level up as you actually work with them — training-by-watching is the road, not built yet").',
  '  Owner has zero tolerance for a faked-to-100 bar.',
  '',
  'STORAGE — localStorage key "dmv_characters" = JSON array of objects with these fields (keeps kit-helper.js',
  '  compatible). Fields: id ("c"+Date.now()+rand, stable), name, craft, craftLabel, tagline, color (hex,',
  '  the circle color / accent), avatar (image data URL or ""), avatarType ("pixel"|"upload"|"color"),',
  '  voice, persona (assembled system-prompt fragment from name+craft+voice+tagline), knowledge, rooms (array',
  '  e.g. ["studio"], from the craft->room map), readiness (0-80), createdAt (Date.now()), mine:true.',
  '  NOTE: the old "glyph" field is GONE (no emojis). On save, dispatch window CustomEvent "dmv-characters-changed".',
  '',
  'DEEP-LINK: "take into room" buttons link to the room URL from the map above (studio/editor/build = ',
  '  /static/ROOMKEY.html?char=ID ; writer/chat = "/"). YOUR ROSTER section shows ONLY the user-built',
  '  characters (mine), each a premium card with its avatar image (or color circle), edit, delete, take-into-room.',
  '',
  'BRAND (locked): use the canonical .dmv coded logo lockup (Oswald "DeMartin" + Allura "ville" metallic gradient),',
  '  NEVER a plain font-rendered wordmark. NO trademark names (no Pro Tools / After Effects / FabFilter / Premiere /',
  '  Avid / Photoshop). Top-left "back to chat" pill linking to "/". Self-contained single HTML file, inline',
  '  style+script, Google Fonts allowed (Oxanium/Inter/Oswald/Allura/Space Mono), no other external deps, no build step.',
].join('\n');

const BRAND_TOKENS = [
  'BRAND TOKENS to build from (you may EXTEND the palette for the icy look, but keep these as the base):',
  '  --bg:#0A0B0E; --bg1:#101116; --panel:#15161B; --line:rgba(255,255,255,.08);',
  '  --text:#E7E9EE; --dim:#9AA0AC; --teal:#7BB6CD; --teal2:#3E9CB8; --gold:#E6C16A; --gold2:#D9A441; --purp:#C98BD0;',
  'Fonts: headings Oxanium 800; body Inter; mono labels "Space Mono"; the .dmv logo uses Oswald 700 + Allura.',
  'The .dmv logo HTML: <span class="dmv"><span class="w"><span class="b">DeMartin</span><span class="s">ville</span></span></span>',
  '.dmv CSS: .dmv{display:inline-flex;align-items:center;gap:.42em;line-height:1} .dmv .b{font-family:Oswald;font-weight:700}',
  '  .dmv .s{font-family:Allura;font-size:1.35em} .dmv .b,.dmv .s{background:linear-gradient(180deg,#f7f9fc,#cfd6df 46%,#9aa3af 55%,#eef1f5);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
  'The look bar: at least as premium as static/join.html, ideally more — this is the flagship page.',
].join('\n');

const DIR_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    directionName: { type: 'string' },
    vibe: { type: 'string' },
    palette: { type: 'string' },
    materials: { type: 'string' },
    typography: { type: 'string' },
    heroTreatment: { type: 'string' },
    avatarSection: { type: 'string' },
    craftRoomSection: { type: 'string' },
    rosterSection: { type: 'string' },
    motion: { type: 'string' },
    whyItsFire: { type: 'string' },
  },
  required: ['directionName', 'vibe', 'palette', 'materials', 'typography', 'heroTreatment', 'avatarSection', 'craftRoomSection', 'rosterSection', 'motion', 'whyItsFire'],
};

const SPEC_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    directionName: { type: 'string' },
    vibe: { type: 'string' },
    palette: { type: 'string' },
    materials: { type: 'string' },
    typography: { type: 'string' },
    heroTreatment: { type: 'string' },
    avatarSection: { type: 'string' },
    craftRoomSection: { type: 'string' },
    rosterSection: { type: 'string' },
    motion: { type: 'string' },
    sectionOrder: { type: 'array', items: { type: 'string' } },
    copyDeck: { type: 'string' },
    buildNotes: { type: 'string' },
  },
  required: ['directionName', 'vibe', 'palette', 'materials', 'typography', 'heroTreatment', 'avatarSection', 'craftRoomSection', 'rosterSection', 'motion', 'sectionOrder', 'copyDeck', 'buildNotes'],
};

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    area: { type: 'string' },
    pass: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { severity: { type: 'string' }, detail: { type: 'string' }, fix: { type: 'string' } },
      required: ['severity', 'detail', 'fix'] } },
    notes: { type: 'string' },
  },
  required: ['area', 'pass', 'issues', 'notes'],
};

// Phase 1 — three premium directions
phase('Directions');
const LENSES = [
  { k: 'liquid-chrome', brief: 'Direction: LIQUID CHROME / BRUSHED-STEEL LUXURY. Lean into the metallic gradient already in the .dmv logo — brushed steel, chrome edges, cold specular highlights, glass panels with thin bright rims, subtle moving sheen. Expensive hardware vibe (think a high-end audio interface / a luxury car dash). Icy = cold metal + light.' },
  { k: 'frosted-noir', brief: 'Direction: FROSTED OBSIDIAN / NEON-NOIR GLASS. Deep near-black glassmorphism, frosted translucent cards over a soft moving aura, a single restrained neon-teal/gold glow as the accent, heavy contrast, cinematic. Icy = frosted glass + glow in the dark. Premium and moody.' },
  { k: 'gallery-min', brief: 'Direction: GALLERY MINIMAL / EDITORIAL LUXE. Restraint = luxury. Lots of negative space, a huge confident Oxanium headline, hairline rules, one accent, the room screenshots treated like framed gallery pieces, the live character card as the hero object on a pedestal. Icy = clean, cold, expensive, nothing wasted.' },
];
const dirs = (await parallel(LENSES.map(l => () => agent(
  'You are an elite product/visual designer. Design a PREMIUM, ICY direction for static/character.html — the flagship "build your character" page for DeMartinville. ' + l.brief + '\n\n' + CONTEXT + '\n\n' + CONTRACT + '\n\n' + BRAND_TOKENS + '\n\nReturn the schema with CONCRETE treatments (exact hex values, specific materials/shadows/blurs, type sizes, the hero composition, how the 3-option avatar picker looks, how the craft dropdown + room-screenshot picker looks, how the your-roster cards look, the motion/hover language). Make it genuinely fire — an artist should feel "I want to build one here." NO emojis, NO invented characters. Be specific enough that an engineer could build it.',
  { label: 'dir:' + l.k, phase: 'Directions', schema: DIR_SCHEMA, effort: 'high' }
)))).filter(Boolean);
log('Directions returned: ' + dirs.length + '/3');

// Phase 2 — lock the best (synthesize)
phase('Lock');
const spec = await agent(
  'You are the design director. From these ' + dirs.length + ' premium directions, LOCK ONE coherent winning design for static/character.html — keep the strongest, most "fire" ideas; it can borrow the best detail from a runner-up but must be ONE consistent look, not a mashup.\n\n' + CONTEXT + '\n\n' + CONTRACT + '\n\n' + BRAND_TOKENS + '\n\nThe three directions (JSON):\n' + JSON.stringify(dirs, null, 2) + '\n\nReturn the SPEC schema: the locked look (name/vibe/palette/materials/typography/hero/avatarSection/craftRoomSection/rosterSection/motion), the sectionOrder (top to bottom), a copyDeck (the actual premium copy/microcopy in the owner warm-but-not-corporate voice — hero headline+sub, the 3 avatar option labels+helper lines incl. the Gemini "pixel me" instructions, the readiness locked copy, the honest framing, the saved-celebration), and buildNotes (exact implementation guidance so the build agent nails it, including the chroma-key green-remove and the dmv_characters schema). Everything must honor the FROZEN contract exactly.',
  { label: 'lock-spec', phase: 'Lock', schema: SPEC_SCHEMA, effort: 'high' }
);
log('Locked direction: ' + spec.directionName);

// Phase 3 — build it
phase('Build');
const built = await agent(
  'BUILD the redesigned static/character.html — OVERWRITE the existing file with a premium, icy, self-contained rebuild. Implement the locked design + the frozen contract EXACTLY. This is the flagship selling-point page; quality bar is "an artist says damn this is fire."\n\n' + CONTEXT + '\n\n' + CONTRACT + '\n\n' + BRAND_TOKENS + '\n\nLOCKED DESIGN SPEC (JSON):\n' + JSON.stringify(spec, null, 2) + '\n\nHARD REQUIREMENTS:\n- Self-contained single HTML file (inline <style>+<script>, Google Fonts link ok, NO other external deps, NO build step). Read the current static/character.html first to reuse the working readiness math + dmv_characters save logic, then REPLACE the whole file with the new premium build.\n- ZERO emojis anywhere (no emoji craft icons, no emoji avatar glyphs). The craft picker is a real <select> dropdown styled premium. The room is shown as the real screenshot from /static/shots/. The avatar is the 3-way picker (Pixel Me / Upload / Color circle) with the client-side green-screen chroma-key.\n- The dmv_characters object MUST match the contract field list exactly (incl. avatar data URL + avatarType, NO glyph), so kit-helper.js stays compatible. Readiness HARD-caps at 80 with the locked-20 honest copy.\n- Live character CARD preview that updates as they build (avatar image OR color circle + name + craftLabel + room + voice + readiness). Premium card, the hero object.\n- YOUR ROSTER shows only mine characters as premium cards (avatar, edit, delete, take-into-room deep-links per the map).\n- Graceful: try/catch the localStorage parse; no console errors; works with an empty roster (warm premium empty state).\n- Brand: canonical .dmv lockup, no trademark names, back-to-chat pill to "/".\n\nWrite the file. Then report in 5-8 lines: the sections in order, how the 3 avatar options + green-key work, the exact dmv_characters shape you write, and confirm zero emojis + zero invented characters.',
  { label: 'build:character.html', phase: 'Build', effort: 'high' }
);
log('Build done.');

// Phase 4 — adversarial verify
phase('Verify');
const CHECKS = [
  { area: 'no-cheese', prompt: 'Read static/character.html. Adversarially verify the owner constraints that got the last version REJECTED: (1) ZERO emojis anywhere in the rendered UI — grep the file for emoji characters in any visible label/button/option (craft picker, avatar, rooms, voices, headings). The craft picker MUST be a real dropdown, NOT an emoji icon grid. (2) NO invented/pre-made characters offered — the page only lets the USER build their own; no fake roster, no "Boogie/Vex/Quill", no default faces. (3) The room picker shows REAL room SCREENSHOTS from /static/shots/ (daw/chat/editor/build), not icons. (4) Avatar = exactly 3 (Pixel Me / Upload / Color circle), no emoji glyph option. List every violation with exact text + fix, or pass.' },
  { area: 'honesty-brand', prompt: 'Read static/character.html. Verify: (1) readiness HARD-caps at 80 in the MATH (not just copy) and the final 20 is shown LOCKED with honest training-by-watching copy — no path reaches 100. (2) No faked mechanics / no "trained on real sessions" as if done / no fake marketplace or payment claims. (3) The "Pixel Me" flow is honest — it tells the user to make the pixel art free in Gemini and bring it back (not pretending we generate it for them on our dime). (4) Brand: canonical .dmv coded lockup used (NOT a plain font-rendered "DeMartinville"); zero trademark names (Pro Tools/After Effects/FabFilter/Premiere/Avid/Photoshop). List violations + fixes, or pass.' },
  { area: 'wiring-correctness', prompt: 'Read static/character.html AND static/kit-helper.js. Verify: (1) the dmv_characters object written by character.html matches what kit-helper.js loadMine() reads — every field kit-helper uses exists; flag if character.html still writes "glyph" or omits "avatar"/"color" that kit-helper needs (note: kit-helper may still expect glyph — if so, flag that kit-helper needs an avatar-image update as a follow-up, with the exact change). (2) JS correctness: no syntax errors, localStorage JSON.parse is try/caught, empty roster does not white-screen, the client-side chroma-key canvas logic is sound, the craft->room map + deep-links are correct (studio/editor/build -> /static/X.html?char=ID ; writer/chat -> "/"). (3) The readiness math is computed and capped. Report concrete bugs with exact fixes, or pass.' },
];
const verdicts = (await parallel(CHECKS.map(c => () => agent(
  c.prompt + '\n\nFROZEN contract for reference:\n' + CONTRACT,
  { label: 'verify:' + c.area, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'high' }
)))).filter(Boolean);

return { spec, built, verdicts };
