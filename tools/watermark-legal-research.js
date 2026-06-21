export const meta = {
  name: 'gemini-watermark-legal-research',
  description: 'Research: can we use a free-tier Gemini image pipeline + remove watermarks for personal + resale avatars, legally? Sweep sources, adversarially verify legal claims, synthesize an honest practical answer.',
  phases: [
    { title: 'Sweep' },
    { title: 'Verify' },
    { title: 'Answer' },
  ],
}

const SITUATION = [
  'SITUATION we are researching for a solo founder ("B"):',
  '- His app (DeMartinville, local/private creative studio) lets a user build an AI "character." The character needs an avatar.',
  '- Planned FREE pipeline (no API cost to the founder): user uploads a photo -> a local vision model writes a text prompt ->',
  '  a button sends the user to Google Gemini ("Nano Banana" = Gemini 2.5 Flash Image) -> the USER generates a 16-bit pixel',
  '  character of themselves on a green-screen background on THEIR OWN Google account (free tier) -> the user brings the image',
  '  back into the app -> the app removes the GREEN background via chroma-key, and the founder also floated REMOVING the',
  '  Gemini WATERMARK.',
  '- Two tiers matter: (a) a FREE personal avatar the user makes for themselves; (b) a future MARKETPLACE where OTHER people',
  '  SELL characters/services on the platform — so some avatars may be used commercially by third parties.',
  'The founder explicitly asked: is removing the watermark legal? is the whole approach okay? how do we keep it FREE + safe?',
  'He has no money for paid APIs. Be HONEST and PRACTICAL, cite real current sources, never invent law or terms.',
].join('\n');

const RES_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    subQuestion: { type: 'string' },
    findings: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { claim: { type: 'string' }, source: { type: 'string' }, url: { type: 'string' }, confidence: { type: 'string' }, asOf: { type: 'string' } },
      required: ['claim', 'source', 'confidence'] } },
    bottomLine: { type: 'string' },
    uncertainties: { type: 'array', items: { type: 'string' } },
  },
  required: ['subQuestion', 'findings', 'bottomLine', 'uncertainties'],
};

const VERIFY_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    checks: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { claim: { type: 'string' }, verdict: { type: 'string' }, corrected: { type: 'string' }, source: { type: 'string' } },
      required: ['claim', 'verdict', 'corrected'] } },
    overallReliability: { type: 'string' },
    mustNotOverstate: { type: 'array', items: { type: 'string' } },
  },
  required: ['checks', 'overallReliability', 'mustNotOverstate'],
};

// Phase 1 — multi-angle web sweep
phase('Sweep');
const ANGLES = [
  { k: 'gemini-rights', q: 'Google Gemini / Gemini 2.5 Flash Image ("Nano Banana") image-generation USAGE & OWNERSHIP RIGHTS as of 2025-2026: Does a user own / may they commercially use images they generate? How do the free Gemini app + Google AI Studio free tier differ from the paid API / Google Workspace on commercial use and ownership? Quote Google\'s actual terms (Gemini Apps Additional Terms, Generative AI Prohibited Use Policy, AI Studio/Cloud terms). Find the real current language.' },
  { k: 'watermarks', q: 'Watermarks on Google Gemini-generated images as of 2025-2026: the VISIBLE watermark (which tiers/products add a visible mark to generated images) AND SynthID, Google\'s INVISIBLE provenance watermark embedded in all Gemini/Imagen images. Does Google permit or PROHIBIT removing, altering, or obscuring these watermarks in its terms/policies? What does Google say SynthID is for?' },
  { k: 'removal-legality', q: 'Is it ILLEGAL to remove a watermark from an AI-generated image (2025-2026)? Cover: any laws on AI-content provenance/labeling (EU AI Act Article 50 transparency/marking obligations; US state laws e.g. California AI Transparency Act SB 942 and others; any law making it illegal to remove AI provenance marks); US copyright DMCA 17 USC 1202 (removing copyright management information); and how RESELLING / commercial use by a third party changes the legal exposure. Distinguish breach-of-terms (civil) vs actual illegality.' },
  { k: 'safe-alternatives', q: 'SAFE, FREE/low-cost ways to give app users an AI avatar without legal/watermark risk (2025-2026): (1) local open-source image generation with NO watermark and permissive commercial license (e.g. FLUX schnell license terms, SDXL, pixel-art LoRAs); (2) "user owns their own upload made on their own account" framing and platform liability for user-generated content; (3) provenance-preserving approaches (keep SynthID, crop a generated mark legitimately, or generate where a visible mark is avoidable); (4) what comparable apps/avatar makers actually do. Give concrete, buildable options.' },
];
const res = (await parallel(ANGLES.map(a => () => agent(
  'You are a careful research analyst with web access. Use WebSearch and WebFetch (load them via ToolSearch first: query "select:WebSearch,WebFetch") to research this, reading PRIMARY/authoritative sources (Google\'s own terms pages, official EU/state-law text or reputable legal analyses, official model licenses). ' + SITUATION + '\n\nYOUR SUB-QUESTION:\n' + a.q + '\n\nReturn the schema: each finding = a specific claim + its source name + url + confidence (high/medium/low) + asOf date. Prefer current (2025-2026) sources; note publish dates. Do NOT invent terms or laws — if you cannot confirm something, put it in uncertainties. bottomLine = the practical takeaway in plain English.',
  { label: 'sweep:' + a.k, phase: 'Sweep', schema: RES_SCHEMA, effort: 'high' }
)))).filter(Boolean);
log('Sweep done: ' + res.length + '/4 angles');

// Phase 2 — adversarial verification of the legal claims (accuracy matters here)
phase('Verify');
const verify = await agent(
  'You are an adversarial fact-checker. Below are research findings about Google Gemini image rights, watermarks, and the legality of removing AI watermarks. Independently sanity-check the load-bearing LEGAL/TERMS claims — use WebSearch/WebFetch (load via ToolSearch "select:WebSearch,WebFetch") to confirm or dispute each. Flag anything stated too confidently, anything that conflates "against Google\'s terms" with "illegal," and anything that might be outdated. This guides a real founder\'s product decision, so err toward caution and clearly mark what is uncertain.\n\nFINDINGS (JSON):\n' + JSON.stringify(res, null, 2) + '\n\nReturn the schema: checks (each load-bearing claim -> verdict supported/disputed/uncertain + corrected wording + source), overallReliability, and mustNotOverstate (claims the final answer must NOT present as settled fact).',
  { label: 'verify-legal', phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'high' }
);
log('Verification done.');

// Phase 3 — synthesize the honest, practical answer for the founder
phase('Answer');
const answer = await agent(
  'Write the HONEST, PRACTICAL answer for the solo founder ("B") — plain, warm, no legalese, no hedging-to-death, but accurate. He is NOT a lawyer and has NO money for paid APIs; he wants a FREE avatar pipeline that will not get him or his future sellers in trouble.\n\n' + SITUATION + '\n\nVERIFIED RESEARCH (JSON):\n' + JSON.stringify({ findings: res, verification: verify }, null, 2) + '\n\nCover, concisely:\n1) Can users make + use Gemini images at all (free tier), and do THEY own them? Personal vs commercial/resale difference.\n2) The watermark question STRAIGHT: visible mark vs invisible SynthID; is REMOVING it against Google\'s terms, and is it actually ILLEGAL (separate the two), and how RESELLING raises the stakes. State clearly what is settled vs uncertain (respect the verifier\'s mustNotOverstate list). Include the explicit caveat that this is general info, not legal advice.\n3) A clear RECOMMENDATION: the safest design that STILL keeps it free and easy — e.g. green-background chroma-key is fine (that is NOT watermark removal); do not build watermark-stripping as a feature / keep provenance; lean on "the user generates on their own account and owns their upload"; and for the future PAID marketplace use a clean-rights generation path (name the best free/owned option, e.g. local FLUX/pixel-LoRA with its license). Give him 2-3 concrete options ranked.\n4) One-paragraph "here is what I would actually build" so he has a path.\nKeep it real and skimmable.',
  { label: 'synthesize-answer', phase: 'Answer', effort: 'high' }
);

return { answer, findings: res, verification: verify };
