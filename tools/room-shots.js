// Room screenshot tour — captures every DeMartinville room exactly as macOS's WebKit
// (the Safari engine WKWebView uses) renders it, so you can verify the look WITHOUT a Mac.
// Runs in CI against the booted .app on :7777. Output → shots/<room>.png + _tour-summary.json
const { webkit } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:7777/';
// Rooms are served by the app under /static/<file>.html (StaticFiles mount); the front
// door is the bare "/" route. So path the room files through /static/, NOT the root.
const roomFiles = fs.existsSync('static')
  ? fs.readdirSync('static').filter(f => f.endsWith('.html')).sort()
  : [];
const targets = [
  { name: '00-front-door', path: '' },                                  // "/" → index.html
  ...roomFiles.map(f => ({ name: f.replace(/\.html$/, ''), path: 'static/' + f })),
];

(async () => {
  fs.mkdirSync('shots', { recursive: true });
  const browser = await webkit.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
  const results = [];
  for (const t of targets) {
    const url = BASE + t.path;
    const name = t.name;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(2800);   // let fonts / canvas / procedural art settle
      await page.screenshot({ path: `shots/${name}.png` });
      console.log('OK  shot:', name);
      results.push({ name, url, ok: true });
    } catch (e) {
      console.log('!! FAILED:', name, '-', e.message);
      results.push({ name, url, ok: false, err: e.message });
      try { await page.screenshot({ path: `shots/${name}-ERROR.png` }); } catch (_) {}
    }
  }
  fs.writeFileSync('shots/_tour-summary.json', JSON.stringify(results, null, 2));
  await browser.close();
  const ok = results.filter(r => r.ok).length;
  console.log(`\nRoom tour: ${ok}/${results.length} rooms captured.`);
})();
