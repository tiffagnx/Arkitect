// Interactive smoke test — loads each room in macOS WebKit (the engine the app's WKWebView
// uses) and captures console errors + page errors on LOAD and while clicking through buttons.
// Surfaces JS that breaks specifically in Safari/WebKit when you actually USE a room — the
// stuff a static screenshot can't catch. Output → shots-interactive/<room>.png + summary JSON.
const { webkit } = require('playwright');
const fs = require('fs');

const BASE = 'http://127.0.0.1:7777/';
const roomFiles = fs.existsSync('static')
  ? fs.readdirSync('static').filter(f => f.endsWith('.html')).sort()
  : [];
const targets = [
  { name: '00-front-door', path: '' },
  ...roomFiles.map(f => ({ name: f.replace(/\.html$/, ''), path: 'static/' + f })),
];

(async () => {
  fs.mkdirSync('shots-interactive', { recursive: true });
  const browser = await webkit.launch();
  const results = [];
  for (const t of targets) {
    const url = BASE + t.path;
    const errors = [];
    const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
    page.on('dialog', d => d.dismiss().catch(() => {}));     // never hang on alert/confirm
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
    let buttons = 0, clicked = 0;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(2000);                       // settle on load
      const handles = await page.$$('button, [role="button"], .btn, .roomlink, [onclick]');
      buttons = handles.length;
      for (const h of handles.slice(0, 8)) {                 // click up to 8 controls per room
        try {
          if (!(await h.isVisible())) continue;
          await h.click({ timeout: 1500 });
          clicked++;
          await page.waitForTimeout(350);
          if (!page.url().startsWith(url)) {                 // a click navigated us away — come back
            await page.goto(url, { waitUntil: 'load', timeout: 15000 });
            await page.waitForTimeout(700);
          }
        } catch (_) { /* individual click failed/blocked — fine, keep probing */ }
      }
      await page.waitForTimeout(700);
      await page.screenshot({ path: `shots-interactive/${t.name}.png` });
    } catch (e) {
      errors.push('LOAD/RUN FAIL: ' + e.message);
    }
    results.push({ room: t.name, buttons, clicked, errorCount: errors.length, errors: errors.slice(0, 15) });
    console.log(`${t.name}: ${buttons} controls, clicked ${clicked}, ${errors.length} console error(s)`);
    await page.close();
  }
  fs.writeFileSync('shots-interactive/_interactive-summary.json', JSON.stringify(results, null, 2));
  await browser.close();
  const clean = results.filter(r => r.errorCount === 0).length;
  console.log(`\nInteractive test: ${clean}/${results.length} rooms had ZERO errors during click-through.`);
})();
