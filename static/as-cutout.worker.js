/* Animation Station — foreground-cutout worker.
   Ported verbatim from heytiff mv-cutout.worker.ts: opencv.js GrabCut, off the main
   thread so the 11MB WASM decode never trips Chrome's "Page Unresponsive" watchdog.
   Classic worker — importScripts loads the UMD opencv.js which assigns the global `cv`. */

importScripts('/static/vendor/opencv.js');
// UMD assigns to the worker global; grab whichever slot it landed in.
var cv = (typeof self !== 'undefined' && self.cv) ? self.cv : (typeof globalThis !== 'undefined' ? globalThis.cv : null);

var cvReadyResolved = false, cvReadyPromise = null;
var sessions = new Map();

function ensureCV() {
  if (cvReadyResolved) return Promise.resolve();
  if (cvReadyPromise) return cvReadyPromise;
  cvReadyPromise = new Promise(function (resolve, reject) {
    if (!cv) { reject(new Error('opencv.js did not load')); return; }
    function finish() {
      if (typeof cv.GC_FGD !== 'number') {
        cv.GC_BGD = 0; cv.GC_FGD = 1; cv.GC_PR_BGD = 2; cv.GC_PR_FGD = 3;
        cv.GC_INIT_WITH_RECT = 0; cv.GC_INIT_WITH_MASK = 1; cv.GC_EVAL = 2;
      }
      cvReadyResolved = true; resolve();
    }
    if (cv.Mat) { finish(); return; }
    try { var prev = cv.onRuntimeInitialized; cv.onRuntimeInitialized = function () { try { prev && prev(); } finally { if (cv.Mat) finish(); } }; } catch (e) {}
    var start = Date.now();
    (function poll() {
      if (cvReadyResolved) return;
      if (cv && cv.Mat) finish();
      else if (Date.now() - start > 60000) reject(new Error('opencv.js timeout after 60s'));
      else setTimeout(poll, 150);
    })();
  });
  cvReadyPromise.catch(function () { cvReadyPromise = null; });
  return cvReadyPromise;
}

function createSession(sessionId, imageData) {
  disposeSession(sessionId);
  var W = imageData.width, H = imageData.height;
  var rgba = cv.matFromImageData(imageData);
  var src = new cv.Mat();
  cv.cvtColor(rgba, src, cv.COLOR_RGBA2RGB);
  rgba.delete();
  var mask = new Uint8Array(W * H);
  for (var i = 0; i < mask.length; i++) mask[i] = cv.GC_PR_BGD;
  var fgdModel = new cv.Mat();
  var bgdModel = new cv.Mat();
  sessions.set(sessionId, { width: W, height: H, mask: mask, src: src, fgdModel: fgdModel, bgdModel: bgdModel });
}

function disposeSession(sessionId) {
  var s = sessions.get(sessionId);
  if (!s) return;
  try { s.fgdModel.delete(); } catch (e) {}
  try { s.bgdModel.delete(); } catch (e) {}
  try { s.src.delete(); } catch (e) {}
  sessions.delete(sessionId);
}

function extract(sessionId, fgScribble, bgScribble, iters) {
  var s = sessions.get(sessionId);
  if (!s) throw new Error('unknown session ' + sessionId);
  var W = s.width, H = s.height, mask = s.mask, src = s.src, fgdModel = s.fgdModel, bgdModel = s.bgdModel;
  if (fgScribble.length !== W * H || bgScribble.length !== W * H) throw new Error('scribble buffers must be W*H = ' + (W * H));

  // 1. FG scribble bbox
  var minX = W, minY = H, maxX = -1, maxY = -1;
  for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
    if (fgScribble[y * W + x]) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) return { alpha: new Uint8Array(W * H), elapsedMs: 0 };
  var padX = Math.round(W * 0.08), padY = Math.round(H * 0.08);
  var bx0 = Math.max(0, minX - padX), by0 = Math.max(0, minY - padY);
  var bx1 = Math.min(W, maxX + padX), by1 = Math.min(H, maxY + padY);

  // 2. Promote bbox to PR_FGD (preserve prior refinement)
  for (var yy = by0; yy < by1; yy++) for (var xx = bx0; xx < bx1; xx++) {
    var bi = yy * W + xx; if (mask[bi] === cv.GC_PR_BGD) mask[bi] = cv.GC_PR_FGD;
  }
  // 3. Stamp definite labels
  for (var i = 0; i < mask.length; i++) {
    if (fgScribble[i]) mask[i] = cv.GC_FGD;
    else if (bgScribble[i]) mask[i] = cv.GC_BGD;
  }

  // 4. grabCut
  var maskMat = cv.matFromArray(H, W, cv.CV_8UC1, mask);
  var dummyRect = new cv.Rect(0, 0, 1, 1);
  var t0 = (self.performance && self.performance.now) ? self.performance.now() : Date.now();
  cv.grabCut(src, maskMat, dummyRect, bgdModel, fgdModel, iters, cv.GC_INIT_WITH_MASK);
  var elapsedMs = ((self.performance && self.performance.now) ? self.performance.now() : Date.now()) - t0;

  // 5. copy out
  var alpha = new Uint8Array(W * H);
  var data = maskMat.data;
  for (var j = 0; j < alpha.length; j++) {
    var v = data[j]; mask[j] = v;
    alpha[j] = (v === cv.GC_FGD || v === cv.GC_PR_FGD) ? 255 : 0;
  }
  maskMat.delete();
  return { alpha: alpha, elapsedMs: elapsedMs };
}

self.onmessage = async function (e) {
  var msg = e.data || {};
  function reply(out, transfer) { self.postMessage(Object.assign({}, out, { id: msg.id }), transfer || []); }
  try {
    if (msg.type === 'init') { await ensureCV(); reply({ type: 'ready' }); return; }
    if (msg.type === 'session') { await ensureCV(); createSession(msg.sessionId, msg.imageData); reply({ type: 'session-ok' }); return; }
    if (msg.type === 'extract') { await ensureCV(); var r = extract(msg.sessionId, msg.fgScribble, msg.bgScribble, msg.iters == null ? 3 : msg.iters); reply({ type: 'result', alpha: r.alpha, elapsedMs: r.elapsedMs }, [r.alpha.buffer]); return; }
    if (msg.type === 'dispose') { disposeSession(msg.sessionId); reply({ type: 'dispose-ok' }); return; }
    reply({ type: 'error', error: 'unknown msg type: ' + msg.type });
  } catch (err) { reply({ type: 'error', error: (err && err.message) || 'worker error' }); }
};
