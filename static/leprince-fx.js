/* ════════════════════════════════════════════════════════════════════════════════════════
   LePrince Visual Labs — effect plugin registry (the real, zero-fake effect library).
   Loaded BEFORE editor.html's main script. Each module is self-contained:
     LP_FX.register({ field, name, cat, color, def, applyVal, paramLabel, range, extra, match, render })
   editor.html folds these into FX_DEFS / FX_CAT / FX_RANGE / FX_EXTRA / KDEF (declarative tables)
   and calls render(api, val) inside withLayerFX after the built-in passes, before masks.

   render(api, val):
     api = { lg, sg, L, M, S, W, H, c, fr, f, k, pval, clamp, hex2rgb, morphMatte, blurMatte,
             reset, project, fbm, vnoise }
       lg/sg  = layer / scratch 2D contexts;  L/M/S = layer/matte/scratch canvases
       W/H    = frame size;  c = clip;  fr = frame-in-clip;  k = stage scale
       pval(c,'fxSub',fr,def) reads a (keyframeable) sub-param;  reset(ctx) normalises a ctx
       fbm(x,y)/vnoise(x,y) = value/fractal noise in [0,1]
     val = the main param's current value (already != def, else render isn't called)
   Effects mutate lg (getImageData→manipulate→putImageData, or drawImage compositing).
   match[] = regexes matched against the RAW (pre-scrub) AE menu label to un-grey that menu item.
   ════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  if (!window.LP_FX) { console.warn('[LP_FX] registry missing'); return; }
  const R = window.LP_FX.register.bind(window.LP_FX);

  // helper: nearest-clamp sampler over a copied buffer
  function mkSamp(s, W, H) {
    return (sx, sy, o) => {
      const xi = sx < 0 ? 0 : sx > W - 1 ? W - 1 : sx | 0;
      const yi = sy < 0 ? 0 : sy > H - 1 ? H - 1 : sy | 0;
      return s[(yi * W + xi) * 4 + o];
    };
  }

  // ── Distort ▸ Turbulent Displace — fbm vector field warps the image (classic AE turbulence) ──
  R({
    field: 'fxTurbDisp', name: 'Turbulent Displace', cat: 'Distort', color: '#8B7FD0',
    def: 0, applyVal: 0.5, paramLabel: 'Amount', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxTurbScale', label: 'Scale', min: 5, max: 200, step: 1, def: 60 },
      { kind: 'slider', sub: 'fxTurbEvolve', label: 'Evolve', min: 0, max: 8, step: 0.05, def: 0 },
    ],
    match: [/^Turbulent Displace$/i],
    render(api, val) {
      const { lg, W, H, c, fr, fbm, pval } = api;
      const scl = Math.max(5, pval(c, 'fxTurbScale', fr, 60)), ev = pval(c, 'fxTurbEvolve', fr, 0);
      const amp = val * Math.min(W, H) * 0.14;
      const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const dx = (fbm(x / scl + ev, y / scl) - 0.5) * 2 * amp;
        const dy = (fbm(x / scl + 100, y / scl + ev + 50) - 0.5) * 2 * amp;
        const sx = x + dx, sy = y + dy;
        d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
      }
      lg.putImageData(im, 0, 0);
    },
  });

  // ── Distort ▸ Polar Coordinates — rectangular↔polar coordinate remap ──
  R({
    field: 'fxPolarCoord', name: 'Polar Coordinates', cat: 'Distort', color: '#8B7FD0',
    def: 0, applyVal: 1, paramLabel: 'Interpolation', range: [0, 1, 0.01],
    extra: [{ kind: 'seg', sub: 'fxPolarType', label: 'Type', opts: ['Rect→Polar', 'Polar→Rect'], def: 'Rect→Polar' }],
    match: [/^Polar Coordinates$/i],
    render(api, val) {
      const { lg, W, H, c } = api;
      const type = c.fxPolarType || 'Rect→Polar';
      const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
      const cx = W / 2, cy = H / 2, maxR = Math.sqrt(cx * cx + cy * cy);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4; let sx, sy;
        if (type === 'Rect→Polar') {
          const dx = x - cx, dy = y - cy, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
          sx = ((a + Math.PI) / (2 * Math.PI)) * W; sy = (r / maxR) * H;
        } else {
          const a = (x / W) * 2 * Math.PI - Math.PI, r = (y / H) * maxR;
          sx = cx + r * Math.cos(a); sy = cy + r * Math.sin(a);
        }
        const fx2 = x + (sx - x) * val, fy2 = y + (sy - y) * val;
        d[i] = samp(fx2, fy2, 0); d[i + 1] = samp(fx2, fy2, 1); d[i + 2] = samp(fx2, fy2, 2); d[i + 3] = samp(fx2, fy2, 3);
      }
      lg.putImageData(im, 0, 0);
    },
  });

  // ── Generate ▸ Circle — procedural disc with feathered edge, composited over the layer ──
  R({
    field: 'fxGenCircle', name: 'Circle', cat: 'Generate', color: '#6FB79A',
    def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxCircRadius', label: 'Radius', min: 0.02, max: 0.7, step: 0.01, def: 0.25 },
      { kind: 'slider', sub: 'fxCircFeather', label: 'Feather', min: 0, max: 0.4, step: 0.01, def: 0.04 },
    ],
    match: [/^Circle$/i],
    render(api, val) {
      const { lg, sg, S, W, H, c, fr, pval, reset } = api;
      const mn = Math.min(W, H);
      const rad = pval(c, 'fxCircRadius', fr, 0.25) * mn, feat = pval(c, 'fxCircFeather', fr, 0.04) * mn;
      const col = c.fxCircColor || '#ffffff', cx = W / 2, cy = H / 2;
      reset(sg); sg.clearRect(0, 0, W, H);
      if (feat > 0.6) {
        const g = sg.createRadialGradient(cx, cy, Math.max(0, rad - feat), cx, cy, rad + feat);
        g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = g;
      } else sg.fillStyle = col;
      sg.beginPath(); sg.arc(cx, cy, rad + feat, 0, Math.PI * 2); sg.fill();
      reset(lg); lg.globalAlpha = val; lg.drawImage(S, 0, 0); reset(lg);
    },
  });


  // ════════════════ WAVE 1 (Distort/Generate/Stylize/Transition) ════════════════

// ═══ Distort ═══
// ── Distort ▸ LePrince Bend It — two-pin bend: curve each scanline about a hinge via angular interpolation ──
R({
  field: 'fxLPBendIt', name: 'LePrince Bend It', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Bend', range: [-1, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPBendStart', label: 'Start', min: 0, max: 1, step: 0.01, def: 0.0 },
    { kind: 'slider', sub: 'fxLPBendEnd', label: 'End', min: 0, max: 1, step: 0.01, def: 1.0 },
  ],
  match: [/^LePrince Bend It$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const y0 = pval(c, 'fxLPBendStart', fr, 0.0) * H;
    const y1 = pval(c, 'fxLPBendEnd', fr, 1.0) * H;
    const span = (y1 - y0) || 1e-6;
    // hinge x = mid of frame; bend warps each scanline horizontally about it by an angle that
    // ramps across the start→end band, peaking in the middle (sin), so the band arcs like a hinge.
    const hinge = W / 2;
    const maxAng = val * 0.9; // radians of max tilt
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) {
      // t = normalised position inside the bend band [0,1], clamped outside
      let t = (y - y0) / span; if (t < 0) t = 0; else if (t > 1) t = 1;
      // angular interp: 0 at the two pins, peak in the middle → a smooth arc
      const ang = Math.sin(t * Math.PI) * maxAng;
      const ca = Math.cos(ang), sa = Math.sin(ang);
      // shift each scanline along x by the horizontal component of rotating its offset about the hinge
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const dx = x - hinge;
        const sx = hinge + dx * ca - (y - (y0 + y1) * 0.5) * sa;
        d[i] = samp(sx, y, 0); d[i + 1] = samp(sx, y, 1); d[i + 2] = samp(sx, y, 2); d[i + 3] = samp(sx, y, 3);
      }
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Bender — sinusoidal column displacement ──
R({
  field: 'fxLPBender', name: 'LePrince Bender', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPBenderCycles', label: 'Cycles', min: 0.25, max: 12, step: 0.25, def: 3 },
    { kind: 'slider', sub: 'fxLPBenderPhase', label: 'Phase', min: 0, max: 6.2832, step: 0.01, def: 0 },
  ],
  match: [/^LePrince Bender$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const cyc = pval(c, 'fxLPBenderCycles', fr, 3), ph = pval(c, 'fxLPBenderPhase', fr, 0);
    const amp = val * H * 0.18;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    // precompute per-column vertical offset (depends only on x)
    const off = new Float32Array(W);
    for (let x = 0; x < W; x++) off[x] = amp * Math.sin((x / W) * 2 * Math.PI * cyc + ph);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const sy = y + off[x];
      d[i] = samp(x, sy, 0); d[i + 1] = samp(x, sy, 1); d[i + 2] = samp(x, sy, 2); d[i + 3] = samp(x, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Blobbylize — displace pixels along the gradient of a blurred luma field ──
R({
  field: 'fxLPBlobbylize', name: 'LePrince Blobbylize', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Distortion', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPBlobSize', label: 'Blob Size', min: 2, max: 40, step: 1, def: 12 },
  ],
  match: [/^LePrince Blobbylize$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const r = Math.max(1, Math.round(pval(c, 'fxLPBlobSize', fr, 12)));
    const amp = val * Math.min(W, H) * 0.12;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    // 1) build a luminance field
    const N = W * H, lum = new Float32Array(N);
    for (let p = 0; p < N; p++) { const j = p * 4; lum[p] = (0.299 * s[j] + 0.587 * s[j + 1] + 0.114 * s[j + 2]) * (s[j + 3] / 255); }
    // 2) separable box-blur the luma field (radius r) → smooth blobs
    const tmp = new Float32Array(N), blur = new Float32Array(N), inv = 1 / (2 * r + 1);
    for (let y = 0; y < H; y++) { let acc = 0; const row = y * W;
      for (let x = -r; x <= r; x++) acc += lum[row + (x < 0 ? 0 : x > W - 1 ? W - 1 : x)];
      for (let x = 0; x < W; x++) { tmp[row + x] = acc * inv; const a = x - r, b = x + r + 1;
        acc += lum[row + (b > W - 1 ? W - 1 : b)] - lum[row + (a < 0 ? 0 : a)]; } }
    for (let x = 0; x < W; x++) { let acc = 0;
      for (let y = -r; y <= r; y++) acc += tmp[(y < 0 ? 0 : y > H - 1 ? H - 1 : y) * W + x];
      for (let y = 0; y < H; y++) { blur[y * W + x] = acc * inv; const a = y - r, b = y + r + 1;
        acc += tmp[(b > H - 1 ? H - 1 : b) * W + x] - tmp[(a < 0 ? 0 : a) * W + x]; } }
    // 3) push each pixel UP the luma gradient (toward brighter) → bright blobs swell
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, p = y * W + x;
      const xl = x > 0 ? p - 1 : p, xr = x < W - 1 ? p + 1 : p;
      const yt = y > 0 ? p - W : p, yb = y < H - 1 ? p + W : p;
      const gx = (blur[xr] - blur[xl]) / 255, gy = (blur[yb] - blur[yt]) / 255;
      const sx = x - gx * amp, sy = y - gy * amp; // sample from where the brightness came from → swell
      d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Flo Motion — two attractor knots, offset pixels by amount/(1+dist*falloff) ──
R({
  field: 'fxLPFloMotion', name: 'LePrince Flo Motion', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Amount 1', range: [-1, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPFloAmt2', label: 'Amount 2', min: -1, max: 1, step: 0.01, def: -0.5 },
    { kind: 'slider', sub: 'fxLPFloX1', label: 'Knot1 X', min: 0, max: 1, step: 0.01, def: 0.33 },
    { kind: 'slider', sub: 'fxLPFloY1', label: 'Knot1 Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPFloX2', label: 'Knot2 X', min: 0, max: 1, step: 0.01, def: 0.67 },
    { kind: 'slider', sub: 'fxLPFloY2', label: 'Knot2 Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPFloFall', label: 'Falloff', min: 0.002, max: 0.1, step: 0.001, def: 0.02 },
  ],
  match: [/^LePrince Flo Motion$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const a1 = val, a2 = pval(c, 'fxLPFloAmt2', fr, -0.5);
    const p1x = pval(c, 'fxLPFloX1', fr, 0.33) * W, p1y = pval(c, 'fxLPFloY1', fr, 0.5) * H;
    const p2x = pval(c, 'fxLPFloX2', fr, 0.67) * W, p2y = pval(c, 'fxLPFloY2', fr, 0.5) * H;
    const fall = pval(c, 'fxLPFloFall', fr, 0.02);
    const k = Math.min(W, H) * 0.5; // amount scaled to frame
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let ddx = x - p1x, ddy = y - p1y; let dist = Math.sqrt(ddx * ddx + ddy * ddy) + 1e-6;
      let w1 = (a1 * k) / (1 + dist * fall) / dist; // pull/push along the radial direction
      let sx = x + ddx * w1, sy = y + ddy * w1;
      ddx = x - p2x; ddy = y - p2y; dist = Math.sqrt(ddx * ddx + ddy * ddy) + 1e-6;
      const w2 = (a2 * k) / (1 + dist * fall) / dist;
      sx += ddx * w2; sy += ddy * w2;
      d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Griddler — offset pixels by a tiled triangle wave on x and y ──
R({
  field: 'fxLPGriddler', name: 'LePrince Griddler', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPGridH', label: 'Horizontal Scale', min: 4, max: 120, step: 1, def: 30 },
    { kind: 'slider', sub: 'fxLPGridV', label: 'Vertical Scale', min: 4, max: 120, step: 1, def: 30 },
  ],
  match: [/^LePrince Griddler$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const hs = Math.max(2, pval(c, 'fxLPGridH', fr, 30)), vs = Math.max(2, pval(c, 'fxLPGridV', fr, 30));
    const amp = val * Math.min(hs, vs) * 0.5;
    // triangle wave in [-1,1] with period p
    const tri = (v, p) => { const t = ((v % p) + p) % p / p; return 1 - 4 * Math.abs(t - 0.5); };
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      // x displaced by a triangle wave running down y (and vice-versa) → grid ripple
      const sx = x + tri(y, vs) * amp;
      const sy = y + tri(x, hs) * amp;
      d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Lens — spherical lens magnify inside a radius ──
R({
  field: 'fxLPLens', name: 'LePrince Lens', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Convergence', range: [-1, 2, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPLensSize', label: 'Size', min: 0.05, max: 0.9, step: 0.01, def: 0.4 },
    { kind: 'slider', sub: 'fxLPLensX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPLensY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
  ],
  match: [/^LePrince Lens$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const rad = pval(c, 'fxLPLensSize', fr, 0.4) * Math.min(W, H);
    const cx = pval(c, 'fxLPLensX', fr, 0.5) * W, cy = pval(c, 'fxLPLensY', fr, 0.5) * H;
    const kk = val * 1.5; // convergence strength
    const r2 = rad * rad;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const dx = x - cx, dy = y - cy, dd = dx * dx + dy * dy;
      let sx = x, sy = y;
      if (dd < r2) {
        // smooth radial falloff (1 at center → 0 at rim) drives a magnifying radial scale
        const fall = 1 - dd / r2;
        const scale = 1 / (1 + kk * fall);
        sx = cx + dx * scale; sy = cy + dy * scale;
      }
      d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Slant — shear: sx = x + slope*(y - pivot) (axis-selectable) ──
R({
  field: 'fxLPSlant', name: 'LePrince Slant', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.4, paramLabel: 'Slant', range: [-1, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPSlantAxis', label: 'Axis', opts: ['Horizontal', 'Vertical'], def: 'Horizontal' },
    { kind: 'slider', sub: 'fxLPSlantFloor', label: 'Floor', min: 0, max: 1, step: 0.01, def: 1.0 },
  ],
  match: [/^LePrince Slant$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const axis = c.fxLPSlantAxis || 'Horizontal';
    const slope = val * 1.5;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    if (axis === 'Horizontal') {
      const pivot = pval(c, 'fxLPSlantFloor', fr, 1.0) * H; // rows below pivot stay put
      for (let y = 0; y < H; y++) { const sh = slope * (y - pivot);
        for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; const sx = x - sh;
          d[i] = samp(sx, y, 0); d[i + 1] = samp(sx, y, 1); d[i + 2] = samp(sx, y, 2); d[i + 3] = samp(sx, y, 3); } }
    } else {
      const pivot = pval(c, 'fxLPSlantFloor', fr, 1.0) * W;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4;
        const sy = y - slope * (x - pivot);
        d[i] = samp(x, sy, 0); d[i + 1] = samp(x, sy, 1); d[i + 2] = samp(x, sy, 2); d[i + 3] = samp(x, sy, 3); } }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Ripple Pulse — animated concentric ripple from a center ──
R({
  field: 'fxLPRipplePulse', name: 'LePrince Ripple Pulse', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPRipWave', label: 'Wavelength', min: 6, max: 120, step: 1, def: 36 },
    { kind: 'slider', sub: 'fxLPRipPhase', label: 'Phase', min: 0, max: 12.566, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPRipX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPRipY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
  ],
  match: [/^LePrince Ripple Pulse$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const wl = Math.max(2, pval(c, 'fxLPRipWave', fr, 36)), ph = pval(c, 'fxLPRipPhase', fr, 0);
    const cx = pval(c, 'fxLPRipX', fr, 0.5) * W, cy = pval(c, 'fxLPRipY', fr, 0.5) * H;
    const amp = val * wl * 0.5;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const dx = x - cx, dy = y - cy, r = Math.sqrt(dx * dx + dy * dy) + 1e-6;
      // displace the sample radius by a sine of the radius → concentric rings
      const nr = r + amp * Math.sin(r / wl * 2 * Math.PI - ph);
      const f = nr / r;
      const sx = cx + dx * f, sy = cy + dy * f;
      d[i] = samp(sx, sy, 0); d[i + 1] = samp(sx, sy, 1); d[i + 2] = samp(sx, sy, 2); d[i + 3] = samp(sx, sy, 3);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ LePrince Page Turn — curl the frame onto a cylinder past a fold line ──
R({
  field: 'fxLPPageTurn', name: 'LePrince Page Turn', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 0.5, paramLabel: 'Fold Position', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPCurlRadius', label: 'Curl Radius', min: 8, max: 160, step: 1, def: 50 },
  ],
  match: [/^LePrince Page Turn$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval, clamp } = api;
    const fold = (1 - val) * W; // Fold Position 0→fold at right edge (flat); 1→fold at left (more curled)
    const radius = Math.max(2, pval(c, 'fxLPCurlRadius', fr, 50));
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (x < fold) { continue; } // flat region untouched
      const dpast = x - fold; // distance past the fold along the page
      // wrap the page onto a cylinder of the given radius: arc length dpast → angle theta
      const theta = dpast / radius;
      if (theta > Math.PI) {
        // fully curled behind the fold → reveal nothing (transparent back of page)
        d[i + 3] = 0; continue;
      }
      // x where this curled column projects back onto the flat plane: fold + radius*sin(theta)
      const projX = fold + radius * Math.sin(theta);
      // sample the original content from the projected position
      const sx = projX;
      let R8 = samp(sx, y, 0), G8 = samp(sx, y, 1), B8 = samp(sx, y, 2), A8 = samp(sx, y, 3);
      // shade by the cosine of the curl angle (Lambert-style falloff) so the curled-back region darkens
      const shade = clamp(0.35 + 0.65 * Math.cos(theta), 0, 1);
      d[i] = R8 * shade; d[i + 1] = G8 * shade; d[i + 2] = B8 * shade; d[i + 3] = A8;
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Distort ▸ Transform — affine: Anchor/Position/Scale/Rotation/Skew/Opacity via setTransform ──
R({
  field: 'fxTransform', name: 'Transform', cat: 'Distort', color: '#8B7FD0',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxXfPosX', label: 'Position X', min: -1, max: 1, step: 0.005, def: 0 },
    { kind: 'slider', sub: 'fxXfPosY', label: 'Position Y', min: -1, max: 1, step: 0.005, def: 0 },
    { kind: 'slider', sub: 'fxXfAncX', label: 'Anchor X', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxXfAncY', label: 'Anchor Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxXfScale', label: 'Scale', min: 0.05, max: 4, step: 0.01, def: 1 },
    { kind: 'slider', sub: 'fxXfRot', label: 'Rotation', min: -180, max: 180, step: 1, def: 0 },
    { kind: 'slider', sub: 'fxXfSkew', label: 'Skew', min: -1, max: 1, step: 0.01, def: 0 },
  ],
  match: [/^Transform$/i],
  render(api, val) {
    const { lg, sg, L, S, W, H, c, fr, pval, reset } = api;
    const ancX = pval(c, 'fxXfAncX', fr, 0.5) * W, ancY = pval(c, 'fxXfAncY', fr, 0.5) * H;
    const posX = pval(c, 'fxXfPosX', fr, 0) * W, posY = pval(c, 'fxXfPosY', fr, 0) * H;
    const scl = pval(c, 'fxXfScale', fr, 1);
    const rot = pval(c, 'fxXfRot', fr, 0) * Math.PI / 180;
    const skew = pval(c, 'fxXfSkew', fr, 0);
    // render the affine into the scratch canvas: translate to anchor+position, rotate, skew, scale, draw L back-shifted by anchor
    reset(sg); sg.clearRect(0, 0, W, H);
    sg.save();
    sg.translate(ancX + posX, ancY + posY);
    sg.rotate(rot);
    sg.transform(1, 0, skew, 1, 0, 0); // horizontal skew
    sg.scale(scl, scl);
    sg.drawImage(L, -ancX, -ancY);
    sg.restore();
    // composite scratch back over a cleared layer at the chosen opacity
    reset(lg); lg.clearRect(0, 0, W, H);
    lg.globalAlpha = val;
    lg.drawImage(S, 0, 0);
    reset(lg);
  },
});


// ═══ Generate ═══
// ── Generate ▸ 4-Color Gradient — bilinear blend of 4 corner colors, composited over the layer ──
R({
  field: 'fxLP4color', name: '4-Color Gradient', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLP4cBlend', label: 'Blend', opts: ['Normal', 'Screen', 'Multiply', 'Overlay', 'Add'], def: 'Normal' },
  ],
  match: [/^4-Color Gradient$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, hex2rgb, reset, clamp } = api;
    const TL = hex2rgb(c.fxLP4cTL || '#ff2d55'), TR = hex2rgb(c.fxLP4cTR || '#ffd60a');
    const BL = hex2rgb(c.fxLP4cBL || '#0a84ff'), BR = hex2rgb(c.fxLP4cBR || '#30d158');
    // build the bilinear field directly into the scratch canvas pixels
    reset(sg); sg.clearRect(0, 0, W, H);
    const im = sg.getImageData(0, 0, W, H), d = im.data;
    const dW = W > 1 ? W - 1 : 1, dH = H > 1 ? H - 1 : 1;
    for (let y = 0; y < H; y++) {
      const v = y / dH, top0 = TL[0] + (TR[0] - TL[0]) * 0, _ = top0; // (placeholder, unused)
      for (let x = 0; x < W; x++) {
        const u = x / dW;
        // top edge interp (TL→TR), bottom edge interp (BL→BR), then vertical
        const tr = TL[0] + (TR[0] - TL[0]) * u, tg = TL[1] + (TR[1] - TL[1]) * u, tb = TL[2] + (TR[2] - TL[2]) * u;
        const br = BL[0] + (BR[0] - BL[0]) * u, bg = BL[1] + (BR[1] - BL[1]) * u, bb = BL[2] + (BR[2] - BL[2]) * u;
        const i = (y * W + x) * 4;
        d[i]     = clamp(tr + (br - tr) * v, 0, 255);
        d[i + 1] = clamp(tg + (bg - tg) * v, 0, 255);
        d[i + 2] = clamp(tb + (bb - tb) * v, 0, 255);
        d[i + 3] = 255;
      }
    }
    sg.putImageData(im, 0, 0);
    const bl = c.fxLP4cBlend || 'Normal';
    const op = bl === 'Screen' ? 'screen' : bl === 'Multiply' ? 'multiply' : bl === 'Overlay' ? 'overlay' : bl === 'Add' ? 'lighter' : 'source-over';
    reset(lg); lg.globalAlpha = val; lg.globalCompositeOperation = op; lg.drawImage(S, 0, 0); reset(lg);
  },
});

// ── Generate ▸ Gradient Ramp — linear/radial gradient between two color stops, composited over ──
R({
  field: 'fxLPramp', name: 'Gradient Ramp', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPrampShape', label: 'Shape', opts: ['Linear', 'Radial'], def: 'Linear' },
    { kind: 'slider', sub: 'fxLPrampSX', label: 'Start X', min: 0, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPrampSY', label: 'Start Y', min: 0, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPrampEX', label: 'End X', min: 0, max: 1, step: 0.01, def: 1 },
    { kind: 'slider', sub: 'fxLPrampEY', label: 'End Y', min: 0, max: 1, step: 0.01, def: 1 },
  ],
  match: [/^Gradient Ramp$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, fr, pval, reset } = api;
    const shape = c.fxLPrampShape || 'Linear';
    const sx = pval(c, 'fxLPrampSX', fr, 0) * W, sy = pval(c, 'fxLPrampSY', fr, 0) * H;
    const ex = pval(c, 'fxLPrampEX', fr, 1) * W, ey = pval(c, 'fxLPrampEY', fr, 1) * H;
    const cA = c.fxLPrampStartColor || '#000000', cB = c.fxLPrampEndColor || '#ffffff';
    reset(sg); sg.clearRect(0, 0, W, H);
    let g;
    if (shape === 'Radial') {
      const dx = ex - sx, dy = ey - sy, r = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      g = sg.createRadialGradient(sx, sy, 0, sx, sy, r);
    } else {
      g = sg.createLinearGradient(sx, sy, ex, ey);
    }
    g.addColorStop(0, cA); g.addColorStop(1, cB);
    sg.fillStyle = g; sg.fillRect(0, 0, W, H);
    reset(lg); lg.globalAlpha = val; lg.drawImage(S, 0, 0); reset(lg);
  },
});

// ── Generate ▸ Grid — line grid (cell W/H, border width, color) composited over the layer ──
R({
  field: 'fxLPgridGen', name: 'Grid', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPgridCW', label: 'Cell W', min: 4, max: 256, step: 1, def: 48 },
    { kind: 'slider', sub: 'fxLPgridCH', label: 'Cell H', min: 4, max: 256, step: 1, def: 48 },
    { kind: 'slider', sub: 'fxLPgridBW', label: 'Border', min: 1, max: 20, step: 1, def: 2 },
  ],
  match: [/^Grid$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, fr, pval, k, reset } = api;
    const cw = Math.max(4, pval(c, 'fxLPgridCW', fr, 48) * k), ch = Math.max(4, pval(c, 'fxLPgridCH', fr, 48) * k);
    const bw = Math.max(1, Math.round(pval(c, 'fxLPgridBW', fr, 2) * k));
    const col = c.fxLPgridColor || '#ffffff';
    reset(sg); sg.clearRect(0, 0, W, H);
    sg.strokeStyle = col; sg.lineWidth = bw;
    sg.beginPath();
    for (let x = 0; x <= W + 0.5; x += cw) { const px = Math.round(x) + (bw % 2 ? 0.5 : 0); sg.moveTo(px, 0); sg.lineTo(px, H); }
    for (let y = 0; y <= H + 0.5; y += ch) { const py = Math.round(y) + (bw % 2 ? 0.5 : 0); sg.moveTo(0, py); sg.lineTo(W, py); }
    sg.stroke();
    reset(lg); lg.globalAlpha = val; lg.drawImage(S, 0, 0); reset(lg);
  },
});

// ── Generate ▸ Checkerboard — two-color checker (cell size) composited over the layer ──
R({
  field: 'fxLPcheck', name: 'Checkerboard', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPcheckSize', label: 'Cell', min: 2, max: 256, step: 1, def: 32 },
    { kind: 'seg', sub: 'fxLPcheckBlend', label: 'Blend', opts: ['Normal', 'Screen', 'Multiply', 'Overlay', 'Add'], def: 'Normal' },
  ],
  match: [/^Checkerboard$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, fr, pval, k, reset } = api;
    const cell = Math.max(2, Math.round(pval(c, 'fxLPcheckSize', fr, 32) * k));
    const c1 = c.fxLPcheckColorA || '#ffffff', c2 = c.fxLPcheckColorB || '#000000';
    reset(sg); sg.clearRect(0, 0, W, H);
    sg.fillStyle = c1; sg.fillRect(0, 0, W, H);
    sg.fillStyle = c2;
    const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
    for (let r = 0; r < rows; r++) for (let cI = 0; cI < cols; cI++) {
      if (((r + cI) & 1) === 0) continue;
      sg.fillRect(cI * cell, r * cell, cell, cell);
    }
    const bl = c.fxLPcheckBlend || 'Normal';
    const op = bl === 'Screen' ? 'screen' : bl === 'Multiply' ? 'multiply' : bl === 'Overlay' ? 'overlay' : bl === 'Add' ? 'lighter' : 'source-over';
    reset(lg); lg.globalAlpha = val; lg.globalCompositeOperation = op; lg.drawImage(S, 0, 0); reset(lg);
  },
});

// ── Generate ▸ Ellipse — filled/stroked ellipse with soft (radial-gradient) edge, composited over ──
R({
  field: 'fxLPellipse', name: 'Ellipse', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Opacity', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPelW', label: 'Width', min: 0.02, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPelH', label: 'Height', min: 0.02, max: 1, step: 0.01, def: 0.35 },
    { kind: 'slider', sub: 'fxLPelThick', label: 'Thickness', min: 0, max: 0.2, step: 0.005, def: 0 },
    { kind: 'slider', sub: 'fxLPelSoft', label: 'Softness', min: 0, max: 0.4, step: 0.01, def: 0.05 },
    { kind: 'slider', sub: 'fxLPelCX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPelCY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
  ],
  match: [/^Ellipse$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, fr, pval, reset } = api;
    const mn = Math.min(W, H);
    const rx = Math.max(1, pval(c, 'fxLPelW', fr, 0.5) * W * 0.5);
    const ry = Math.max(1, pval(c, 'fxLPelH', fr, 0.35) * H * 0.5);
    const thick = pval(c, 'fxLPelThick', fr, 0) * mn;     // 0 = filled
    const soft = pval(c, 'fxLPelSoft', fr, 0.05) * mn;
    const cx = pval(c, 'fxLPelCX', fr, 0.5) * W, cy = pval(c, 'fxLPelCY', fr, 0.5) * H;
    const col = c.fxLPelColor || '#ffffff';
    reset(sg); sg.clearRect(0, 0, W, H);
    if (thick > 0.5) {
      // ring: stroke the ellipse path, blur the edge via shadow-soft fallback (soft handled by lineWidth feather)
      sg.strokeStyle = col; sg.lineWidth = thick;
      if (soft > 0.5) { sg.shadowColor = col; sg.shadowBlur = soft; }
      sg.beginPath(); sg.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); sg.stroke();
      sg.shadowBlur = 0;
    } else if (soft > 0.5) {
      // soft-filled disc via a radial gradient scaled into an ellipse
      const maxR = Math.max(rx, ry);
      const inner = Math.max(0, 1 - soft / maxR);
      sg.save();
      sg.translate(cx, cy); sg.scale(rx / maxR, ry / maxR);
      const g = sg.createRadialGradient(0, 0, maxR * inner, 0, 0, maxR);
      g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      sg.fillStyle = g; sg.beginPath(); sg.arc(0, 0, maxR, 0, Math.PI * 2); sg.fill();
      sg.restore();
    } else {
      sg.fillStyle = col; sg.beginPath(); sg.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); sg.fill();
    }
    reset(lg); lg.globalAlpha = val; lg.drawImage(S, 0, 0); reset(lg);
  },
});

// ── Generate ▸ Beam — tapered light beam start→end (Length sweeps), soft falloff, screen-composited ──
R({
  field: 'fxLPbeam', name: 'Beam', cat: 'Generate', color: '#6FB79A',
  def: 0, applyVal: 1, paramLabel: 'Length', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPbeamSX', label: 'Start X', min: 0, max: 1, step: 0.01, def: 0.1 },
    { kind: 'slider', sub: 'fxLPbeamSY', label: 'Start Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPbeamEX', label: 'End X', min: 0, max: 1, step: 0.01, def: 0.9 },
    { kind: 'slider', sub: 'fxLPbeamEY', label: 'End Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    { kind: 'slider', sub: 'fxLPbeamW', label: 'Width', min: 0.005, max: 0.3, step: 0.005, def: 0.04 },
    { kind: 'slider', sub: 'fxLPbeamSoft', label: 'Softness', min: 0, max: 1, step: 0.01, def: 0.6 },
  ],
  match: [/^Beam$/i],
  render(api, val) {
    const { lg, sg, S, W, H, c, fr, pval, hex2rgb, reset } = api;
    const mn = Math.min(W, H);
    const sx = pval(c, 'fxLPbeamSX', fr, 0.1) * W, sy = pval(c, 'fxLPbeamSY', fr, 0.5) * H;
    const ex0 = pval(c, 'fxLPbeamEX', fr, 0.9) * W, ey0 = pval(c, 'fxLPbeamEY', fr, 0.5) * H;
    // Length (val) sweeps the beam from its start toward the full end point
    const ex = sx + (ex0 - sx) * val, ey = sy + (ey0 - sy) * val;
    const halfW = Math.max(0.5, pval(c, 'fxLPbeamW', fr, 0.04) * mn * 0.5);
    const soft = pval(c, 'fxLPbeamSoft', fr, 0.6);
    const col = hex2rgb(c.fxLPbeamColor || '#ffffff');
    const rgb = col[0] + ',' + col[1] + ',' + col[2];
    const dx = ex - sx, dy = ey - sy, len = Math.sqrt(dx * dx + dy * dy);
    reset(sg); sg.clearRect(0, 0, W, H);
    if (len > 0.5) {
      const ux = dx / len, uy = dy / len;       // along-beam unit
      const px = -uy, py = ux;                   // perpendicular unit
      sg.save();
      // cross-beam gradient: bright core → transparent edges (soft = how feathered)
      const core = Math.max(0, 1 - soft);        // fraction of width at full brightness
      const grad = sg.createLinearGradient(
        sx + px * halfW, sy + py * halfW,
        sx - px * halfW, sy - py * halfW
      );
      grad.addColorStop(0, 'rgba(' + rgb + ',0)');
      grad.addColorStop(Math.max(0.001, 0.5 - core * 0.5), 'rgba(' + rgb + ',1)');
      grad.addColorStop(Math.min(0.999, 0.5 + core * 0.5), 'rgba(' + rgb + ',1)');
      grad.addColorStop(1, 'rgba(' + rgb + ',0)');
      sg.fillStyle = grad;
      // beam quad (tapers slightly: full width at start, 35% at the swept tip)
      const tipW = halfW * 0.35;
      sg.beginPath();
      sg.moveTo(sx + px * halfW, sy + py * halfW);
      sg.lineTo(ex + px * tipW, ey + py * tipW);
      sg.lineTo(ex - px * tipW, ey - py * tipW);
      sg.lineTo(sx - px * halfW, sy - py * halfW);
      sg.closePath(); sg.fill();
      sg.restore();
    }
    // screen-composite the beam onto the layer (light adds)
    reset(lg); lg.globalAlpha = val; lg.globalCompositeOperation = 'screen'; lg.drawImage(S, 0, 0); reset(lg);
  },
});


// ═══ Stylize ═══
LP_FX.register({
  field:'fxLPglass', name:'LePrince Glass', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:0.5, paramLabel:'Distortion', range:[0,1,0.01],
  extra:[{kind:'slider',sub:'fxLPglassScale',label:'Scale',min:8,max:160,step:1,def:48}],
  match:[/^LePrince Glass$/i],
  render(api,val){
    const {lg,W,H,c,fr,fbm,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const scl=Math.max(8,pval(c,'fxLPglassScale',fr,48));
    const amp=val*Math.min(W,H)*0.12, e=1.0;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // gradient of the fbm field (central difference) → refraction normal, offset the sample coord by it
      const gx=fbm((x+e)/scl,y/scl)-fbm((x-e)/scl,y/scl);
      const gy=fbm(x/scl,(y+e)/scl)-fbm(x/scl,(y-e)/scl);
      const sx=x+gx*amp*scl, sy=y+gy*amp*scl;
      d[i]=samp_(s,sx,sy,0);d[i+1]=samp_(s,sx,sy,1);d[i+2]=samp_(s,sx,sy,2);d[i+3]=samp_(s,sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

LP_FX.register({
  field:'fxLPhexTile', name:'LePrince HexTile', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[{kind:'slider',sub:'fxLPhexSize',label:'Hex Size',min:4,max:80,step:1,def:18}],
  match:[/^LePrince HexTile$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const size=Math.max(3,pval(c,'fxLPhexSize',fr,18)); // hex "radius"
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const sq3=Math.sqrt(3);
    // pixel → nearest hex centre via axial→cube rounding
    const cellOf=(px,py)=>{
      const q=((sq3/3)*px-(1/3)*py)/size, r=((2/3)*py)/size;
      let cx=q, cz=r, cy=-cx-cz;
      let rx=Math.round(cx), ry=Math.round(cy), rz=Math.round(cz);
      const xd=Math.abs(rx-cx), yd=Math.abs(ry-cy), zd=Math.abs(rz-cz);
      if(xd>yd&&xd>zd)rx=-ry-rz; else if(yd>zd)ry=-rx-rz; else rz=-rx-ry;
      return rx*16384+rz; // packed cell key
    };
    // pass 1: alpha-weighted accumulate per hex
    const sumR={},sumG={},sumB={},sumA={},cnt={};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4, key=cellOf(x+0.5,y+0.5), a=s[i+3];
      if(cnt[key]===undefined){sumR[key]=0;sumG[key]=0;sumB[key]=0;sumA[key]=0;cnt[key]=0;}
      sumR[key]+=s[i]*a;sumG[key]+=s[i+1]*a;sumB[key]+=s[i+2]*a;sumA[key]+=a;cnt[key]++;
    }
    // pass 2: write the cell average, blended by Amount
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4, key=cellOf(x+0.5,y+0.5), wa=sumA[key], aAvg=wa/cnt[key];
      const r=wa>0?sumR[key]/wa:0, g=wa>0?sumG[key]/wa:0, b=wa>0?sumB[key]/wa:0;
      d[i]+=(r-d[i])*val;d[i+1]+=(g-d[i+1])*val;d[i+2]+=(b-d[i+2])*val;d[i+3]+=(aAvg-d[i+3])*val;
    }
    lg.putImageData(im,0,0);
  }
});

LP_FX.register({
  field:'fxLPmotionTile', name:'Motion Tile', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPmtTW',label:'Tile Width %',min:10,max:100,step:1,def:50},
    {kind:'slider',sub:'fxLPmtTH',label:'Tile Height %',min:10,max:100,step:1,def:50},
    {kind:'slider',sub:'fxLPmtCX',label:'Center X',min:-0.5,max:0.5,step:0.01,def:0},
    {kind:'slider',sub:'fxLPmtCY',label:'Center Y',min:-0.5,max:0.5,step:0.01,def:0},
    {kind:'slider',sub:'fxLPmtPhase',label:'Phase',min:0,max:1,step:0.01,def:0},
    {kind:'seg',sub:'fxLPmtMirror',label:'Edges',opts:['Wrap','Mirror'],def:'Wrap'}
  ],
  match:[/^Motion Tile$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const tw=Math.max(1,(pval(c,'fxLPmtTW',fr,50)/100)*W);
    const th=Math.max(1,(pval(c,'fxLPmtTH',fr,50)/100)*H);
    const cx=pval(c,'fxLPmtCX',fr,0)*W, cy=pval(c,'fxLPmtCY',fr,0)*H;
    const phase=pval(c,'fxLPmtPhase',fr,0), mirror=(c.fxLPmtMirror||'Wrap')==='Mirror';
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      let u=(x-cx), v=(y-cy);
      const row=Math.floor(v/th);
      u+=phase*tw*row; // per-row horizontal phase shift
      let tu=((u%tw)+tw)%tw, tv=((v%th)+th)%th;
      const parityX=Math.floor(u/tw), parityY=Math.floor(v/th);
      if(mirror){ // reflect on odd tiles
        if(((parityX%2)+2)%2===1) tu=tw-1-tu;
        if(((parityY%2)+2)%2===1) tv=th-1-tv;
      }
      const su=(tu/tw)*W, sv=(tv/th)*H; // tile-local → full source range
      d[i]+=(samp_(s,su,sv,0)-d[i])*val;d[i+1]+=(samp_(s,su,sv,1)-d[i+1])*val;
      d[i+2]+=(samp_(s,su,sv,2)-d[i+2])*val;d[i+3]+=(samp_(s,su,sv,3)-d[i+3])*val;
    }
    lg.putImageData(im,0,0);
  }
});

LP_FX.register({
  field:'fxLProughen', name:'Roughen Edges', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:0.6, paramLabel:'Roughness', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLProughBorder',label:'Border',min:1,max:30,step:1,def:8},
    {kind:'slider',sub:'fxLProughScale',label:'Scale',min:4,max:120,step:1,def:24},
    {kind:'seg',sub:'fxLProughEdge',label:'Edge',opts:['Roughen','Encrust'],def:'Roughen'}
  ],
  colorSubs:['fxLProughColor'],
  match:[/^Roughen Edges$/i],
  render(api,val){
    const {lg,W,H,c,fr,fbm,pval,hex2rgb}=api;
    const border=Math.max(1,pval(c,'fxLProughBorder',fr,8));
    const scl=Math.max(4,pval(c,'fxLProughScale',fr,24));
    const encrust=(c.fxLProughEdge||'Roughen')==='Encrust';
    const edgeCol=hex2rgb(c.fxLProughColor||'#000000');
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const R2=Math.ceil(border);
    const sampA=(x,y)=>{const xi=x<0?0:x>W-1?W-1:x|0,yi=y<0?0:y>H-1?H-1:y|0;return s[(yi*W+xi)*4+3];};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4, a0=s[i+3]/255;
      // signed distance to the alpha edge: nearest opposite-side pixel in a small ring
      let dist=R2+1; const inside=a0>0.5;
      for(let ry=-R2;ry<=R2&&dist>0.5;ry++)for(let rx=-R2;rx<=R2;rx++){
        const dd=Math.sqrt(rx*rx+ry*ry); if(dd>R2||dd>=dist)continue;
        if((sampA(x+rx,y+ry)/255>0.5)!==inside)dist=dd;
      }
      const signed=inside?dist:-dist; // + inside, − outside (px)
      const n=(fbm(x/scl,y/scl)-0.5)*2; // −1..1 noisy boundary offset
      const thr=n*border*val;
      let aOut=d[i+3];
      if(signed<thr){ aOut=0; } // removed side of the ragged edge
      else if(signed<thr+border*0.5){
        const t=(signed-thr)/(border*0.5);
        if(!encrust){ aOut=Math.round(d[i+3]*t); } // soft eroded rim
        else { // encrust: keep alpha, tint the rim toward the edge colour
          const blend=(1-t)*val;
          d[i]+=(edgeCol[0]-d[i])*blend;d[i+1]+=(edgeCol[1]-d[i+1])*blend;d[i+2]+=(edgeCol[2]-d[i+2])*blend;
        }
      }
      d[i+3]=aOut;
    }
    lg.putImageData(im,0,0);
  }
});

LP_FX.register({
  field:'fxLPblockLoad', name:'LePrince Block Load', cat:'Stylize', color:'#D9A441',
  def:1, applyVal:1, paramLabel:'Progress', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPblockSize',label:'Block Size',min:4,max:80,step:1,def:16},
    {kind:'seg',sub:'fxLPblockFill',label:'Unloaded',opts:['Transparent','Black'],def:'Transparent'}
  ],
  match:[/^LePrince Block Load$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    if(val>=1)return; // Progress 1 = fully loaded
    const bs=Math.max(2,pval(c,'fxLPblockSize',fr,16));
    const black=(c.fxLPblockFill||'Transparent')==='Black';
    const im=lg.getImageData(0,0,W,H),d=im.data;
    // deterministic per-block hash in [0,1) → reveal order
    const hashB=(bx,by)=>{const h=Math.sin(bx*12.9898+by*78.233)*43758.5453;return h-Math.floor(h);};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(d[i+3]===0)continue;
      const h=hashB((x/bs)|0,(y/bs)|0);
      if(h>=val){ if(black){d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=255;} else d[i+3]=0; } // not yet loaded
    }
    lg.putImageData(im,0,0);
  }
});

LP_FX.register({
  field:'fxLPbrush', name:'Brush Strokes', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPbrushSize',label:'Brush Size',min:1,max:20,step:1,def:6},
    {kind:'slider',sub:'fxLPbrushDir',label:'Direction',min:0,max:360,step:1,def:45},
    {kind:'slider',sub:'fxLPbrushJit',label:'Jitter',min:0,max:90,step:1,def:25}
  ],
  match:[/^Brush Strokes$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const len=Math.max(1,Math.round(pval(c,'fxLPbrushSize',fr,6)));   // half run length
    const dir=pval(c,'fxLPbrushDir',fr,45)*Math.PI/180;
    const jit=pval(c,'fxLPbrushJit',fr,25)*Math.PI/180;
    const tile=Math.max(2,len);
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const hash=(a,b)=>{const h=Math.sin(a*127.1+b*311.7)*43758.5453;return h-Math.floor(h);};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(s[i+3]===0)continue;
      // per-tile hashed angle jitter so strokes vary across the canvas
      const ang=dir+(hash((x/tile)|0,(y/tile)|0)-0.5)*2*jit;
      const ca=Math.cos(ang), sa=Math.sin(ang);
      let r=0,g=0,b=0,al=0,wsum=0;
      for(let t=-len;t<=len;t++){ // average a short oriented run of neighbour samples
        const sx=x+ca*t, sy=y+sa*t;
        if(samp_(s,sx,sy,3)===0)continue;
        r+=samp_(s,sx,sy,0);g+=samp_(s,sx,sy,1);b+=samp_(s,sx,sy,2);al+=samp_(s,sx,sy,3);wsum++;
      }
      if(wsum===0)continue;
      r/=wsum;g/=wsum;b/=wsum;al/=wsum;
      d[i]+=(r-d[i])*val;d[i+1]+=(g-d[i+1])*val;d[i+2]+=(b-d[i+2])*val;d[i+3]+=(al-d[i+3])*val;
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Transition ═══
// ══ Transition ▸ LePrince Line Sweep ══════════════════════════════════════════════════
  // A bright glowing line sweeps across at Angle. Everything BEHIND the line (the already-passed
  // region) is erased to alpha via destination-out as Completion drops from 1. The leading edge
  // glows. Completion 1 = nothing erased (line off-frame on the not-yet-started side).
  R({
    field: 'fxLPLineSweep', name: 'LePrince Line Sweep', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxLPLSAngle', label: 'Angle', min: 0, max: 360, step: 1, def: 0 },
      { kind: 'slider', sub: 'fxLPLSGlow', label: 'Glow Width', min: 1, max: 40, step: 0.5, def: 12 },
    ],
    match: [/^LePrince Line Sweep$/i],
    render(api, val) {
      const { lg, W, H, c, fr, pval, reset } = api;
      if (val >= 1) return;
      const a = pval(c, 'fxLPLSAngle', fr, 0) * Math.PI / 180;
      const glow = Math.max(1, pval(c, 'fxLPLSGlow', fr, 12));
      const col = c.fxLPLSColor || '#fff6e0';
      const cx = W / 2, cy = H / 2, diag = Math.hypot(W, H);
      // Sweep axis: project pixel onto the angle's normal. Edge advances from -diag/2 .. +diag/2.
      // Erased region = everything the line has already crossed (the "behind" side).
      const erased = (1 - val);                       // 0 = none erased, 1 = all erased
      const edge = -diag / 2 + erased * diag;         // position of the line along the axis
      reset(lg);
      lg.save();
      lg.translate(cx, cy);
      lg.rotate(a);
      // Erase the band behind the line (y < edge in rotated space)
      lg.globalCompositeOperation = 'destination-out';
      lg.globalAlpha = 1;
      lg.fillStyle = '#000';
      lg.fillRect(-diag, -diag, 2 * diag, diag + edge);   // from far-behind up to the edge
      lg.restore();
      reset(lg);
      // Draw the glowing leading line ON TOP of what remains (additive screen).
      lg.save();
      lg.translate(cx, cy);
      lg.rotate(a);
      lg.globalCompositeOperation = 'lighter';
      const g = lg.createLinearGradient(0, edge - glow, 0, edge + glow);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.5, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      lg.fillStyle = g;
      lg.fillRect(-diag, edge - glow, 2 * diag, glow * 2);
      // bright hairline core
      lg.globalAlpha = 0.9;
      lg.fillStyle = col;
      lg.fillRect(-diag, edge - 1, 2 * diag, 2);
      lg.restore();
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince Jaws ════════════════════════════════════════════════════════
  // Zig-zag "teeth" wipe: erase across a triangle-wave (sawtooth) boundary that advances with
  // Completion. The interlocking teeth bite inward. Height = tooth depth, Width = tooth count,
  // Direction = which side the teeth advance from.
  R({
    field: 'fxLPJaws', name: 'LePrince Jaws', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxLPJawsHeight', label: 'Height', min: 0.01, max: 0.4, step: 0.005, def: 0.12 },
      { kind: 'slider', sub: 'fxLPJawsWidth', label: 'Width', min: 2, max: 60, step: 1, def: 14 },
      { kind: 'seg', sub: 'fxLPJawsDir', label: 'Direction', opts: ['Left', 'Right', 'Top', 'Bottom'], def: 'Left' },
    ],
    match: [/^LePrince Jaws$/i],
    render(api, val) {
      const { lg, W, H, c, fr, pval, reset } = api;
      if (val >= 1) return;
      const dir = c.fxLPJawsDir || 'Left';
      const teeth = Math.max(2, Math.round(pval(c, 'fxLPJawsWidth', fr, 14)));
      const erased = (1 - val);
      const vert = (dir === 'Top' || dir === 'Bottom');
      const span = vert ? W : H;                          // axis the teeth run along
      const depth = pval(c, 'fxLPJawsHeight', fr, 0.12) * (vert ? H : W);
      // base advance line + a triangle wave of amplitude=depth along the cross axis
      const advExtent = (vert ? H : W) + depth;           // ensure full erase at val→0
      const tri = (t) => { const p = t * teeth % 1; return p < 0.5 ? p * 2 : (1 - p) * 2; }; // 0..1..0
      reset(lg);
      lg.globalCompositeOperation = 'destination-out';
      lg.globalAlpha = 1;
      lg.fillStyle = '#000';
      lg.beginPath();
      const N = (vert ? W : H);
      if (dir === 'Left' || dir === 'Right') {
        const baseAdv = erased * advExtent;               // distance the wave-front has travelled
        const sgn = (dir === 'Left') ? 1 : -1;
        const xAt = (t) => {
          const wob = (tri(t) - 0.5) * 2 * depth;         // -depth..+depth
          const x = baseAdv + wob;
          return (dir === 'Left') ? x : (W - x);
        };
        lg.moveTo(dir === 'Left' ? 0 : W, 0);
        for (let yy = 0; yy <= N; yy++) lg.lineTo(xAt(yy / N), yy);
        lg.lineTo(dir === 'Left' ? 0 : W, H);
        lg.closePath();
        void sgn;
      } else {
        const baseAdv = erased * advExtent;
        const yAt = (t) => {
          const wob = (tri(t) - 0.5) * 2 * depth;
          const y = baseAdv + wob;
          return (dir === 'Top') ? y : (H - y);
        };
        lg.moveTo(0, dir === 'Top' ? 0 : H);
        for (let xx = 0; xx <= N; xx++) lg.lineTo(xx, yAt(xx / N));
        lg.lineTo(W, dir === 'Top' ? 0 : H);
        lg.closePath();
      }
      lg.fill();
      reset(lg);
    },
  });

  // ══ Transition ▸ Iris Wipe ════════════════════════════════════════════════════════════
  // Expanding/contracting N-sided polygon (or circle) aperture from a Center. As Completion
  // drops below 1 the aperture shrinks, erasing (destination-out) everything OUTSIDE it.
  // Points 3..12 → triangle..dodecagon; Points >= ~24 reads as a circle.
  R({
    field: 'fxIrisWipe', name: 'Iris Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxIrisPts', label: 'Points', min: 3, max: 24, step: 1, def: 24 },
      { kind: 'slider', sub: 'fxIrisCX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'slider', sub: 'fxIrisCY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'slider', sub: 'fxIrisRot', label: 'Rotation', min: 0, max: 360, step: 1, def: 0 },
    ],
    match: [/^Iris Wipe$/i],
    render(api, val) {
      const { lg, W, H, c, fr, pval, reset } = api;
      if (val >= 1) return;
      const pts = Math.max(3, Math.round(pval(c, 'fxIrisPts', fr, 24)));
      const cx = pval(c, 'fxIrisCX', fr, 0.5) * W, cy = pval(c, 'fxIrisCY', fr, 0.5) * H;
      const rot = pval(c, 'fxIrisRot', fr, 0) * Math.PI / 180;
      // furthest corner distance so val=1 covers the whole frame
      const maxR = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy),
                            Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
      const rad = val * maxR;
      reset(lg);
      lg.globalCompositeOperation = 'destination-out';
      lg.globalAlpha = 1;
      lg.fillStyle = '#000';
      // even-odd: outer full-frame rect MINUS the aperture polygon ⇒ erase the outside
      lg.beginPath();
      lg.rect(0, 0, W, H);
      const circleLike = pts >= 24;
      if (circleLike) {
        lg.moveTo(cx + rad, cy);
        lg.arc(cx, cy, rad, 0, Math.PI * 2);
      } else {
        for (let i = 0; i <= pts; i++) {
          const ang = rot - Math.PI / 2 + i / pts * Math.PI * 2;
          const px = cx + rad * Math.cos(ang), py = cy + rad * Math.sin(ang);
          if (i === 0) lg.moveTo(px, py); else lg.lineTo(px, py);
        }
      }
      lg.closePath();
      lg.fill('evenodd');
      reset(lg);
    },
  });

  // ══ Transition ▸ Gradient Wipe ════════════════════════════════════════════════════════
  // Erase pixels where a procedural fbm luminance map < (1 - Completion), with a Softness
  // feather band for a smooth dissolving edge. Per-pixel alpha pass (true gradient dissolve).
  // Map Scale = noise feature size; Invert flips the dissolve order.
  R({
    field: 'fxGradWipe', name: 'Gradient Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxGWSoft', label: 'Softness', min: 0.001, max: 0.5, step: 0.005, def: 0.12 },
      { kind: 'slider', sub: 'fxGWScale', label: 'Map Scale', min: 8, max: 240, step: 1, def: 70 },
      { kind: 'seg', sub: 'fxGWInvert', label: 'Invert', opts: ['Normal', 'Invert'], def: 'Normal' },
    ],
    match: [/^Gradient Wipe$/i],
    render(api, val) {
      const { lg, W, H, c, fr, fbm, pval, clamp, reset } = api;
      if (val >= 1) return;
      const soft = Math.max(0.001, pval(c, 'fxGWSoft', fr, 0.12));
      const scl = Math.max(8, pval(c, 'fxGWScale', fr, 70));
      const inv = (c.fxGWInvert === 'Invert');
      const thr = (1 - val);                              // pixels with map < thr are erased
      reset(lg);
      const im = lg.getImageData(0, 0, W, H), d = im.data;
      // sample the fbm map on a coarse grid then bilinear-interp for speed + smoothness
      const gx = 96, gy = Math.max(2, Math.round(gx * H / W));
      const map = new Float32Array((gx + 1) * (gy + 1));
      for (let j = 0; j <= gy; j++) for (let i = 0; i <= gx; i++) {
        let m = fbm((i / gx * W) / scl, (j / gy * H) / scl);
        if (inv) m = 1 - m;
        map[j * (gx + 1) + i] = m;
      }
      const sampMap = (x, y) => {
        const fxp = x / W * gx, fyp = y / H * gy;
        const x0 = fxp | 0, y0 = fyp | 0, tx = fxp - x0, ty = fyp - y0;
        const x1 = x0 + 1 > gx ? gx : x0 + 1, y1 = y0 + 1 > gy ? gy : y0 + 1;
        const a = map[y0 * (gx + 1) + x0], b = map[y0 * (gx + 1) + x1];
        const cc = map[y1 * (gx + 1) + x0], dd = map[y1 * (gx + 1) + x1];
        const top = a + (b - a) * tx, bot = cc + (dd - cc) * tx;
        return top + (bot - top) * ty;
      };
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (d[i + 3] === 0) continue;
        const m = sampMap(x, y);
        // alpha multiplier ramps 0 (m below thr) → 1 (m above thr+soft)
        const a = clamp((m - thr) / soft, 0, 1);
        d[i + 3] = Math.round(d[i + 3] * a);
      }
      lg.putImageData(im, 0, 0);
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince Glass Wipe ══════════════════════════════════════════════════
  // Along a moving wipe edge (driven by Completion) the source is displaced by an fbm gradient
  // (coordinate-resample) and its alpha ramps to 0 — the image melts/distorts through wavy glass
  // as it leaves. Displacement = max warp px; Softness = width of the melt band.
  R({
    field: 'fxLPGlassWipe', name: 'LePrince Glass Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxLPGWDisp', label: 'Displacement', min: 0, max: 80, step: 1, def: 28 },
      { kind: 'slider', sub: 'fxLPGWSoft', label: 'Softness', min: 0.02, max: 0.6, step: 0.01, def: 0.22 },
      { kind: 'slider', sub: 'fxLPGWScale', label: 'Scale', min: 10, max: 200, step: 1, def: 55 },
    ],
    match: [/^LePrince Glass Wipe$/i],
    render(api, val) {
      const { lg, W, H, c, fr, fbm, pval, clamp, reset } = api;
      if (val >= 1) return;
      const disp = pval(c, 'fxLPGWDisp', fr, 28);
      const soft = Math.max(0.02, pval(c, 'fxLPGWSoft', fr, 0.22));
      const scl = Math.max(10, pval(c, 'fxLPGWScale', fr, 55));
      // wipe travels top→bottom; edge position in [−soft .. 1]. erased above the edge.
      const edge = (1 - val) * (1 + soft) - soft;          // y-fraction of the leading edge
      reset(lg);
      const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
      for (let y = 0; y < H; y++) {
        const yf = y / H;
        // melt factor: 1 well above edge (gone), 0 well below (untouched), ramp across soft band
        const t = clamp((edge - yf) / soft + 1, 0, 1);     // 0 below band → 1 at/above edge
        if (t <= 0) continue;                              // untouched rows: leave as-is
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4;
          if (d[i + 3] === 0) continue;
          // fbm gradient → displacement vector, scaled by the melt factor
          const gxv = (fbm(x / scl + 3.1, y / scl) - 0.5) * 2;
          const gyv = (fbm(x / scl, y / scl + 7.7) - 0.5) * 2;
          const k2 = t * disp;
          const sx = x + gxv * k2, sy = y + gyv * k2 + t * disp * 0.6;
          d[i]     = samp(sx, sy, 0);
          d[i + 1] = samp(sx, sy, 1);
          d[i + 2] = samp(sx, sy, 2);
          // alpha ramps to 0 as melt completes (t→1)
          d[i + 3] = Math.round(samp(sx, sy, 3) * (1 - t));
        }
      }
      lg.putImageData(im, 0, 0);
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince WarpoMatic ══════════════════════════════════════════════════
  // Dissolve by warping the image with a reaction map derived from its OWN content. Reactor:
  // Brightness (luma), Contrast (distance from mid-grey), or Edges (Sobel magnitude). As
  // Completion drops, high-reaction pixels are displaced harder (coordinate-resample) AND their
  // alpha ramps out first — the image warps apart along its own structure. Smoothness blurs the
  // reaction map; Displacement = warp strength.
  R({
    field: 'fxLPWarpoMatic', name: 'LePrince WarpoMatic', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'seg', sub: 'fxLPWMReactor', label: 'Reactor', opts: ['Brightness', 'Contrast', 'Edges'], def: 'Brightness' },
      { kind: 'slider', sub: 'fxLPWMSmooth', label: 'Smoothness', min: 0, max: 6, step: 1, def: 2 },
      { kind: 'slider', sub: 'fxLPWMDisp', label: 'Displacement', min: 0, max: 120, step: 1, def: 50 },
    ],
    match: [/^LePrince WarpoMatic$/i],
    render(api, val) {
      const { lg, W, H, c, fr, pval, clamp, reset } = api;
      if (val >= 1) return;
      const reactor = c.fxLPWMReactor || 'Brightness';
      const smooth = Math.max(0, Math.round(pval(c, 'fxLPWMSmooth', fr, 2)));
      const disp = pval(c, 'fxLPWMDisp', fr, 50);
      reset(lg);
      const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d), samp = mkSamp(s, W, H);
      const N = W * H;
      const luma = new Float32Array(N);
      for (let p = 0; p < N; p++) {
        const i = p * 4;
        luma[p] = (0.299 * s[i] + 0.587 * s[i + 1] + 0.114 * s[i + 2]) / 255;
      }
      // build the reaction map R in [0,1]
      const Rm = new Float32Array(N);
      if (reactor === 'Edges') {
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const xm = x > 0 ? x - 1 : 0, xp = x < W - 1 ? x + 1 : W - 1;
          const ym = y > 0 ? y - 1 : 0, yp = y < H - 1 ? y + 1 : H - 1;
          const tl = luma[ym * W + xm], tc = luma[ym * W + x], tr = luma[ym * W + xp];
          const ml = luma[y * W + xm], mr = luma[y * W + xp];
          const bl = luma[yp * W + xm], bc = luma[yp * W + x], br = luma[yp * W + xp];
          const gx2 = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
          const gy2 = (bl + 2 * bc + br) - (tl + 2 * tc + tr);
          Rm[y * W + x] = clamp(Math.hypot(gx2, gy2) / 4, 0, 1);
        }
      } else if (reactor === 'Contrast') {
        for (let p = 0; p < N; p++) Rm[p] = clamp(Math.abs(luma[p] - 0.5) * 2, 0, 1);
      } else {
        for (let p = 0; p < N; p++) Rm[p] = luma[p];
      }
      // box-blur the reaction map for smoother warping (separable, 'smooth' passes)
      if (smooth > 0) {
        const tmp = new Float32Array(N);
        const r = smooth;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          let acc = 0, cnt = 0;
          for (let o = -r; o <= r; o++) { const xx = x + o; if (xx >= 0 && xx < W) { acc += Rm[y * W + xx]; cnt++; } }
          tmp[y * W + x] = acc / cnt;
        }
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          let acc = 0, cnt = 0;
          for (let o = -r; o <= r; o++) { const yy = y + o; if (yy >= 0 && yy < H) { acc += tmp[yy * W + x]; cnt++; } }
          Rm[y * W + x] = acc / cnt;
        }
      }
      // dissolve threshold: pixels whose reaction exceeds (val) warp+fade. As val→0 all qualify.
      const thr = val;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const p = y * W + x, i = p * 4;
        if (d[i + 3] === 0) continue;
        const Rv = Rm[p];
        // how far past the threshold (0 = just safe, 1 = fully reacting)
        const t = clamp((Rv - thr) / 0.35 + (1 - val), 0, 1);
        if (t <= 0) continue;
        // gradient of the reaction map → warp direction (push along structure)
        const xm = x > 0 ? p - 1 : p, xp = x < W - 1 ? p + 1 : p;
        const ym = y > 0 ? p - W : p, yp = y < H - 1 ? p + W : p;
        const gxv = Rm[xp] - Rm[xm], gyv = Rm[yp] - Rm[ym];
        const k2 = t * disp;
        const sx = x + gxv * k2, sy = y + gyv * k2;
        d[i]     = samp(sx, sy, 0);
        d[i + 1] = samp(sx, sy, 1);
        d[i + 2] = samp(sx, sy, 2);
        d[i + 3] = Math.round(samp(sx, sy, 3) * (1 - t));
      }
      lg.putImageData(im, 0, 0);
      reset(lg);
    },
  });


  // ════════════════ WAVE 2 (Color/Channel/Matte/Perspective/Generate/Stylize/Noise/Sim) ════════════════

// ═══ Color Correction — auto/histogram ═══
// ═══════════════ Color Correction — auto / histogram (#5BA3C7) ═══════════════

// ── Color ▸ Auto Color — per-channel black/white-point stretch + midtone gray-balance, 3 LUTs ──
R({
  field: 'fxLPautoColor', name: 'Auto Color', cat: 'Color', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPautoColClip', label: 'Clip %', min: 0, max: 5, step: 0.1, def: 0.5 },
    { kind: 'slider', sub: 'fxLPautoColNeutral', label: 'Neutralize', min: 0, max: 1, step: 0.01, def: 0.6 },
  ],
  match: [/^Auto Color$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval, clamp } = api;
    const clipPct = pval(c, 'fxLPautoColClip', fr, 0.5) / 100;
    const neutral = pval(c, 'fxLPautoColNeutral', fr, 0.6);
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    // pre-pass: per-channel histograms (opaque pixels only) + midtone channel averages
    const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    let total = 0, sR = 0, sG = 0, sB = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      hist[0][d[i]]++; hist[1][d[i + 1]]++; hist[2][d[i + 2]]++;
      sR += d[i]; sG += d[i + 1]; sB += d[i + 2]; total++;
    }
    if (total === 0) return;
    // per-channel clip points from the cumulative histogram
    const clipN = Math.max(0, Math.floor(total * clipPct));
    const lo = [0, 0, 0], hi = [255, 255, 255];
    for (let ch = 0; ch < 3; ch++) {
      let acc = 0; const h = hist[ch];
      for (let v = 0; v < 256; v++) { acc += h[v]; if (acc > clipN) { lo[ch] = v; break; } }
      acc = 0;
      for (let v = 255; v >= 0; v--) { acc += h[v]; if (acc > clipN) { hi[ch] = v; break; } }
      if (hi[ch] <= lo[ch]) { lo[ch] = 0; hi[ch] = 255; }
    }
    // midtone gray-world target: shift each channel's mean toward the overall mean
    const meanR = sR / total, meanG = sG / total, meanB = sB / total;
    const grayMean = (meanR + meanG + meanB) / 3;
    // build 3 LUTs: stretch [lo,hi]→[0,255] then a midtone gamma that pulls the channel mean to grayMean
    const luts = [new Uint8ClampedArray(256), new Uint8ClampedArray(256), new Uint8ClampedArray(256)];
    const chMean = [meanR, meanG, meanB];
    for (let ch = 0; ch < 3; ch++) {
      const span = (hi[ch] - lo[ch]) || 1;
      // gamma that maps the (stretched) channel mean onto the (stretched) gray mean
      const sm = clamp((chMean[ch] - lo[ch]) / span, 1e-3, 1 - 1e-3);
      const gm = clamp((grayMean - lo[ch]) / span, 1e-3, 1 - 1e-3);
      let gamma = Math.log(gm) / Math.log(sm);
      if (!isFinite(gamma) || gamma <= 0) gamma = 1;
      gamma = 1 + (gamma - 1) * neutral; // dial the neutralisation
      const L = luts[ch];
      for (let v = 0; v < 256; v++) {
        let t = (v - lo[ch]) / span; t = t < 0 ? 0 : t > 1 ? 1 : t;
        L[v] = Math.round(Math.pow(t, gamma) * 255);
      }
    }
    // apply, blended by Amount
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      d[i]     += (luts[0][d[i]]     - d[i])     * val;
      d[i + 1] += (luts[1][d[i + 1]] - d[i + 1]) * val;
      d[i + 2] += (luts[2][d[i + 2]] - d[i + 2]) * val;
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Color ▸ Auto Contrast — luma-histogram percentile clip, ONE shared LUT (hue-preserving) ──
R({
  field: 'fxLPautoContrast', name: 'Auto Contrast', cat: 'Color', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPautoConLow', label: 'Low Clip %', min: 0, max: 5, step: 0.1, def: 0.5 },
    { kind: 'slider', sub: 'fxLPautoConHigh', label: 'High Clip %', min: 0, max: 5, step: 0.1, def: 0.5 },
  ],
  match: [/^Auto Contrast$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const lowPct = pval(c, 'fxLPautoConLow', fr, 0.5) / 100;
    const highPct = pval(c, 'fxLPautoConHigh', fr, 0.5) / 100;
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    // pre-pass: combined-luminance histogram (opaque pixels only)
    const hist = new Uint32Array(256); let total = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const y = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) | 0;
      hist[y]++; total++;
    }
    if (total === 0) return;
    // low/high clip points
    const loN = Math.max(0, Math.floor(total * lowPct)), hiN = Math.max(0, Math.floor(total * highPct));
    let lo = 0, hi = 255, acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > loN) { lo = v; break; } }
    acc = 0;
    for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > hiN) { hi = v; break; } }
    if (hi <= lo) { lo = 0; hi = 255; }
    // ONE LUT, applied identically to R/G/B → contrast stretch without hue shift
    const span = (hi - lo) || 1, lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) {
      let t = (v - lo) / span; t = t < 0 ? 0 : t > 1 ? 1 : t;
      lut[v] = Math.round(t * 255);
    }
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      d[i]     += (lut[d[i]]     - d[i])     * val;
      d[i + 1] += (lut[d[i + 1]] - d[i + 1]) * val;
      d[i + 2] += (lut[d[i + 2]] - d[i + 2]) * val;
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Color ▸ Auto Levels — per-channel min/max histogram stretch, independent LUT per R/G/B ──
R({
  field: 'fxLPautoLevels', name: 'Auto Levels', cat: 'Color', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPautoLvlClip', label: 'Clip %', min: 0, max: 5, step: 0.1, def: 0.5 },
  ],
  match: [/^Auto Levels$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const clipPct = pval(c, 'fxLPautoLvlClip', fr, 0.5) / 100;
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    // pre-pass: per-channel histograms (opaque pixels only)
    const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    let total = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      hist[0][d[i]]++; hist[1][d[i + 1]]++; hist[2][d[i + 2]]++; total++;
    }
    if (total === 0) return;
    const clipN = Math.max(0, Math.floor(total * clipPct));
    // independent LUT per channel: stretch each channel's [lo,hi] → [0,255]
    const luts = [new Uint8ClampedArray(256), new Uint8ClampedArray(256), new Uint8ClampedArray(256)];
    for (let ch = 0; ch < 3; ch++) {
      const h = hist[ch]; let lo = 0, hi = 255, acc = 0;
      for (let v = 0; v < 256; v++) { acc += h[v]; if (acc > clipN) { lo = v; break; } }
      acc = 0;
      for (let v = 255; v >= 0; v--) { acc += h[v]; if (acc > clipN) { hi = v; break; } }
      if (hi <= lo) { lo = 0; hi = 255; }
      const span = (hi - lo) || 1, L = luts[ch];
      for (let v = 0; v < 256; v++) {
        let t = (v - lo) / span; t = t < 0 ? 0 : t > 1 ? 1 : t;
        L[v] = Math.round(t * 255);
      }
    }
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      d[i]     += (luts[0][d[i]]     - d[i])     * val;
      d[i + 1] += (luts[1][d[i + 1]] - d[i + 1]) * val;
      d[i + 2] += (luts[2][d[i + 2]] - d[i + 2]) * val;
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Color ▸ Equalize — luminance CDF → normalised 256-LUT (histogram equalisation) ──
R({
  field: 'fxLPequalize', name: 'Equalize', cat: 'Color', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPeqMode', label: 'Mode', opts: ['Luminance', 'RGB'], def: 'Luminance' },
  ],
  match: [/^Equalize$/i],
  render(api, val) {
    const { lg, W, H, c } = api;
    const mode = c.fxLPeqMode || 'Luminance';
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    if (mode === 'RGB') {
      // equalise each channel by its own CDF
      const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
      let total = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        hist[0][d[i]]++; hist[1][d[i + 1]]++; hist[2][d[i + 2]]++; total++;
      }
      if (total === 0) return;
      const luts = [new Uint8ClampedArray(256), new Uint8ClampedArray(256), new Uint8ClampedArray(256)];
      for (let ch = 0; ch < 3; ch++) {
        const h = hist[ch], L = luts[ch];
        // first non-zero bin → cdfMin, for the standard equalisation normalisation
        let cdf = 0, cdfMin = -1;
        for (let v = 0; v < 256; v++) { if (h[v] && cdfMin < 0) cdfMin = cdf + h[v]; cdf += 0; }
        cdf = 0; cdfMin = -1;
        const cdfArr = new Float64Array(256);
        for (let v = 0; v < 256; v++) { cdf += h[v]; cdfArr[v] = cdf; if (cdfMin < 0 && cdf > 0) cdfMin = cdf; }
        const denom = (total - cdfMin) || 1;
        for (let v = 0; v < 256; v++) L[v] = Math.round(((cdfArr[v] - cdfMin) / denom) * 255);
      }
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        d[i]     += (luts[0][d[i]]     - d[i])     * val;
        d[i + 1] += (luts[1][d[i + 1]] - d[i + 1]) * val;
        d[i + 2] += (luts[2][d[i + 2]] - d[i + 2]) * val;
      }
      lg.putImageData(im, 0, 0);
      return;
    }
    // Luminance mode: build the CDF of luma, remap each pixel's luma, scale RGB to preserve hue
    const hist = new Uint32Array(256); let total = 0;
    const luma = new Uint8Array((d.length / 4) | 0);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      if (d[i + 3] === 0) { luma[p] = 0; continue; }
      const y = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) | 0;
      luma[p] = y; hist[y]++; total++;
    }
    if (total === 0) return;
    const cdfArr = new Float64Array(256); let cdf = 0, cdfMin = -1;
    for (let v = 0; v < 256; v++) { cdf += hist[v]; cdfArr[v] = cdf; if (cdfMin < 0 && cdf > 0) cdfMin = cdf; }
    const denom = (total - cdfMin) || 1;
    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) lut[v] = Math.round(((cdfArr[v] - cdfMin) / denom) * 255);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      if (d[i + 3] === 0) continue;
      const y0 = luma[p], y1 = lut[y0];
      // scale each channel by the luma ratio so colour/hue is preserved, then blend by Amount
      const ratio = y0 > 0 ? y1 / y0 : 0;
      const nr = y0 > 0 ? d[i] * ratio : y1, ng = y0 > 0 ? d[i + 1] * ratio : y1, nb = y0 > 0 ? d[i + 2] * ratio : y1;
      d[i]     += (nr - d[i])     * val;
      d[i + 1] += (ng - d[i + 1]) * val;
      d[i + 2] += (nb - d[i + 2]) * val;
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Color ▸ Broadcast Colors — clamp luma and/or saturation to a legal ceiling (per-pixel) ──
R({
  field: 'fxLPbroadcast', name: 'Broadcast Colors', cat: 'Color', color: '#5BA3C7',
  def: 1, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPbcMode', label: 'Mode', opts: ['Reduce Luminance', 'Reduce Saturation'], def: 'Reduce Luminance' },
    { kind: 'slider', sub: 'fxLPbcMax', label: 'Max Level %', min: 50, max: 100, step: 1, def: 90 },
  ],
  match: [/^Broadcast Colors$/i],
  render(api, val) {
    const { lg, W, H, c, fr, pval } = api;
    const mode = c.fxLPbcMode || 'Reduce Luminance';
    const maxLvl = pval(c, 'fxLPbcMax', fr, 90) / 100;        // legal ceiling (0..1)
    const ceil = maxLvl * 255;
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    if (mode === 'Reduce Luminance') {
      // any pixel whose luma exceeds the ceiling is scaled down toward black to fit
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (y > ceil) {
          const s = ceil / y;                                 // uniform scale preserves hue
          const nr = d[i] * s, ng = d[i + 1] * s, nb = d[i + 2] * s;
          d[i]     += (nr - d[i])     * val;
          d[i + 1] += (ng - d[i + 1]) * val;
          d[i + 2] += (nb - d[i + 2]) * val;
        }
      }
    } else {
      // pull each pixel toward its own luma (grey) until saturation/amplitude is within the ceiling
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        // amplitude = max chroma excursion from grey, normalised 0..1
        const amp = Math.max(Math.abs(r - y), Math.abs(g - y), Math.abs(b - y)) / 255;
        if (amp > maxLvl && amp > 0) {
          const s = maxLvl / amp;                             // desaturate toward grey
          const nr = y + (r - y) * s, ng = y + (g - y) * s, nb = y + (b - y) * s;
          d[i]     += (nr - r) * val;
          d[i + 1] += (ng - g) * val;
          d[i + 2] += (nb - b) * val;
        }
      }
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── Color ▸ LePrince Color Neutralizer — frame-average cast pre-pass, gray-world white balance ──
R({
  field: 'fxLPneutralizer', name: 'LePrince Color Neutralizer', cat: 'Color', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Amount', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPnzPreserve', label: 'Preserve', opts: ['Luminance', 'Off'], def: 'Luminance' },
  ],
  match: [/^(?:CC |LePrince )Color Neutralizer$/i],
  render(api, val) {
    const { lg, W, H, c } = api;
    const preserve = (c.fxLPnzPreserve || 'Luminance') !== 'Off';
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    // pre-pass: frame-average colour cast (gray-world assumption: scene should average to grey)
    let sR = 0, sG = 0, sB = 0, total = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      sR += d[i]; sG += d[i + 1]; sB += d[i + 2]; total++;
    }
    if (total === 0) return;
    const meanR = sR / total, meanG = sG / total, meanB = sB / total;
    const grayMean = (meanR + meanG + meanB) / 3;
    if (grayMean <= 0) return;
    // per-channel gain that drives each channel's mean toward the overall grey
    const gR = meanR > 0 ? grayMean / meanR : 1;
    const gG = meanG > 0 ? grayMean / meanG : 1;
    const gB = meanB > 0 ? grayMean / meanB : 1;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      let nr = r * gR, ng = g * gG, nb = b * gB;
      if (preserve) {
        // rescale the balanced pixel back to the original luma so only the cast (not exposure) moves
        const y0 = 0.299 * r + 0.587 * g + 0.114 * b;
        const y1 = 0.299 * nr + 0.587 * ng + 0.114 * nb;
        if (y1 > 0) { const k = y0 / y1; nr *= k; ng *= k; nb *= k; }
      }
      d[i]     += (nr - r) * val;
      d[i + 1] += (ng - g) * val;
      d[i + 2] += (nb - b) * val;
    }
    lg.putImageData(im, 0, 0);
  },
});


// ═══ Color Correction — per-pixel ═══
// ════════════════ Color Correction — per-pixel (LePrince Visual Labs) ════════════════
// Shared HSL helpers (local to this group; no globals leaked beyond the IIFE).
function _cc_rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0; const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l]; // h:0-360, s:0-1, l:0-1
}
function _cc_hue2rgb(p, q, t) {
  if (t < 0) t += 1; if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function _cc_hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s <= 0) { const v = l * 255; return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [_cc_hue2rgb(p, q, h + 1 / 3) * 255, _cc_hue2rgb(p, q, h) * 255, _cc_hue2rgb(p, q, h - 1 / 3) * 255];
}
function _cc_hueDist(a, b) { let d = Math.abs(a - b) % 360; if (d > 180) d = 360 - d; return d; }

// ── 1) Change Color — per-pixel HSL: pixels within tolerance+softness of a target color get hue/sat/lum deltas ──
R({
  field: 'fxLPchgColor', name: 'Change Color', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Strength', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPccTol', label: 'Tolerance', min: 0, max: 180, step: 1, def: 30 },
    { kind: 'slider', sub: 'fxLPccSoft', label: 'Softness', min: 0, max: 90, step: 1, def: 20 },
    { kind: 'slider', sub: 'fxLPccHue', label: 'Hue Δ', min: -180, max: 180, step: 1, def: 60 },
    { kind: 'slider', sub: 'fxLPccSat', label: 'Sat Δ', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPccLit', label: 'Light Δ', min: -1, max: 1, step: 0.01, def: 0 },
  ],
  match: [/^Change Color$/i],
  render(api, val) {
    const { lg, W, H, c, hex2rgb, clamp } = api;
    const tgt = hex2rgb(c.fxLPccColor || '#ff0000');
    const tH = _cc_rgb2hsl(tgt[0], tgt[1], tgt[2])[0];
    const tol = (c.fxLPccTol == null ? 30 : +c.fxLPccTol);
    const soft = (c.fxLPccSoft == null ? 20 : +c.fxLPccSoft);
    const dH = (c.fxLPccHue == null ? 60 : +c.fxLPccHue);
    const dS = (c.fxLPccSat == null ? 0 : +c.fxLPccSat);
    const dL = (c.fxLPccLit == null ? 0 : +c.fxLPccLit);
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const hsl = _cc_rgb2hsl(d[i], d[i + 1], d[i + 2]);
      const dist = _cc_hueDist(hsl[0], tH);
      let w;
      if (dist <= tol) w = 1;
      else if (dist >= tol + soft) w = 0;
      else w = 1 - (dist - tol) / soft;
      if (w <= 0) continue;
      w *= val;
      const nh = hsl[0] + dH * w;
      const ns = clamp(hsl[1] + dS * w, 0, 1);
      const nl = clamp(hsl[2] + dL * w, 0, 1);
      const rgb = _cc_hsl2rgb(nh, ns, nl);
      d[i] = clamp(rgb[0], 0, 255); d[i + 1] = clamp(rgb[1], 0, 255); d[i + 2] = clamp(rgb[2], 0, 255);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── 2) Change to Color — pixels near a From color blend toward an absolute To color ──
R({
  field: 'fxLPchTo', name: 'Change to Color', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Blend', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPctTol', label: 'Tolerance', min: 0, max: 1, step: 0.01, def: 0.2 },
    { kind: 'slider', sub: 'fxLPctSoft', label: 'Softness', min: 0, max: 1, step: 0.01, def: 0.15 },
  ],
  match: [/^Change to Color$/i],
  render(api, val) {
    const { lg, W, H, c, hex2rgb, clamp } = api;
    const from = hex2rgb(c.fxLPctFrom || '#ff0000');
    const to = hex2rgb(c.fxLPctTo || '#00aaff');
    const tol = (c.fxLPctTol == null ? 0.2 : +c.fxLPctTol);
    const soft = (c.fxLPctSoft == null ? 0.15 : +c.fxLPctSoft);
    // distance normalised to the RGB diagonal (0-1)
    const NORM = 1 / (255 * Math.sqrt(3));
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const dr = d[i] - from[0], dg = d[i + 1] - from[1], db = d[i + 2] - from[2];
      const dist = Math.sqrt(dr * dr + dg * dg + db * db) * NORM;
      let w;
      if (dist <= tol) w = 1;
      else if (dist >= tol + soft) w = 0;
      else w = 1 - (dist - tol) / soft;
      if (w <= 0) continue;
      w *= val;
      d[i] = clamp(d[i] + (to[0] - d[i]) * w, 0, 255);
      d[i + 1] = clamp(d[i + 1] + (to[1] - d[i + 1]) * w, 0, 255);
      d[i + 2] = clamp(d[i + 2] + (to[2] - d[i + 2]) * w, 0, 255);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── 3) Channel Mixer — outR=a*r+b*g+c*b+const (per output channel) + Monochrome toggle ──
R({
  field: 'fxLPchanMix', name: 'Channel Mixer', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Mix', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPcmMono', label: 'Mono', opts: ['Off', 'On'], def: 'Off' },
    { kind: 'slider', sub: 'fxLPcmRR', label: 'R: from R', min: -2, max: 2, step: 0.01, def: 1 },
    { kind: 'slider', sub: 'fxLPcmRG', label: 'R: from G', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmRB', label: 'R: from B', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmRC', label: 'R: const', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmGR', label: 'G: from R', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmGG', label: 'G: from G', min: -2, max: 2, step: 0.01, def: 1 },
    { kind: 'slider', sub: 'fxLPcmGB', label: 'G: from B', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmGC', label: 'G: const', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmBR', label: 'B: from R', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmBG', label: 'B: from G', min: -2, max: 2, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPcmBB', label: 'B: from B', min: -2, max: 2, step: 0.01, def: 1 },
    { kind: 'slider', sub: 'fxLPcmBC', label: 'B: const', min: -1, max: 1, step: 0.01, def: 0 },
  ],
  match: [/^Channel Mixer$/i],
  render(api, val) {
    const { lg, W, H, c, clamp } = api;
    const g = (s, dv) => (c[s] == null ? dv : +c[s]);
    const mono = (c.fxLPcmMono || 'Off') === 'On';
    let rr = g('fxLPcmRR', 1), rg = g('fxLPcmRG', 0), rb = g('fxLPcmRB', 0), rc = g('fxLPcmRC', 0) * 255;
    let gr = g('fxLPcmGR', 0), gg = g('fxLPcmGG', 1), gb = g('fxLPcmGB', 0), gc = g('fxLPcmGC', 0) * 255;
    let br = g('fxLPcmBR', 0), bg = g('fxLPcmBG', 0), bb = g('fxLPcmBB', 1), bc = g('fxLPcmBC', 0) * 255;
    if (mono) { gr = rr; gg = rg; gb = rb; gc = rc; br = rr; bg = rg; bb = rb; bc = rc; } // all outs = R-mix
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      const r = d[i], gv = d[i + 1], b = d[i + 2];
      const nr = rr * r + rg * gv + rb * b + rc;
      const ng = gr * r + gg * gv + gb * b + gc;
      const nb = br * r + bg * gv + bb * b + bc;
      d[i] = clamp(r + (nr - r) * val, 0, 255);
      d[i + 1] = clamp(gv + (ng - gv) * val, 0, 255);
      d[i + 2] = clamp(b + (nb - b) * val, 0, 255);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── 4) Selective Color — classify pixel family (R/Y/G/C/B/M/white/neutral/black) then adjust C/M/Y/K ──
R({
  field: 'fxLPselColor', name: 'Selective Color', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Strength', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPscFam', label: 'Colors', opts: ['Reds', 'Yellows', 'Greens', 'Cyans', 'Blues', 'Magentas', 'Whites', 'Neutrals', 'Blacks'], def: 'Reds' },
    { kind: 'seg', sub: 'fxLPscMode', label: 'Method', opts: ['Relative', 'Absolute'], def: 'Relative' },
    { kind: 'slider', sub: 'fxLPscC', label: 'Cyan', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPscM', label: 'Magenta', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPscY', label: 'Yellow', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPscK', label: 'Black', min: -1, max: 1, step: 0.01, def: 0 },
  ],
  render(api, val) {
    const { lg, W, H, c, clamp } = api;
    const fam = c.fxLPscFam || 'Reds';
    const abs = (c.fxLPscMode || 'Relative') === 'Absolute';
    const aC = (c.fxLPscC == null ? 0 : +c.fxLPscC) * val;
    const aM = (c.fxLPscM == null ? 0 : +c.fxLPscM) * val;
    const aY = (c.fxLPscY == null ? 0 : +c.fxLPscY) * val;
    const aK = (c.fxLPscK == null ? 0 : +c.fxLPscK) * val;
    // family of a pixel given its HSL (matches the requested family?)
    const inFam = (h, s, l) => {
      if (s < 0.12) { // achromatic → white / neutral / black by lightness
        if (l > 0.8) return fam === 'Whites';
        if (l < 0.2) return fam === 'Blacks';
        return fam === 'Neutrals';
      }
      // chromatic → hue sextant
      if (fam === 'Reds') return (h >= 330 || h < 30);
      if (fam === 'Yellows') return (h >= 30 && h < 90);
      if (fam === 'Greens') return (h >= 90 && h < 150);
      if (fam === 'Cyans') return (h >= 150 && h < 210);
      if (fam === 'Blues') return (h >= 210 && h < 270);
      if (fam === 'Magentas') return (h >= 270 && h < 330);
      return false;
    };
    const im = lg.getImageData(0, 0, W, H), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      let r = d[i] / 255, gch = d[i + 1] / 255, b = d[i + 2] / 255;
      const hsl = _cc_rgb2hsl(d[i], d[i + 1], d[i + 2]);
      if (!inFam(hsl[0], hsl[1], hsl[2])) continue;
      // RGB→CMYK
      const k = 1 - Math.max(r, gch, b);
      let cC, cM, cY;
      if (k >= 1) { cC = 0; cM = 0; cY = 0; } else {
        cC = (1 - r - k) / (1 - k); cM = (1 - gch - k) / (1 - k); cY = (1 - b - k) / (1 - k);
      }
      let nC = cC, nM = cM, nY = cY, nK = k;
      if (abs) { nC = cC + aC; nM = cM + aM; nY = cY + aY; nK = k + aK; }
      else { nC = cC + cC * aC; nM = cM + cM * aM; nY = cY + cY * aY; nK = k + k * aK; }
      nC = clamp(nC, 0, 1); nM = clamp(nM, 0, 1); nY = clamp(nY, 0, 1); nK = clamp(nK, 0, 1);
      // CMYK→RGB
      r = (1 - nC) * (1 - nK); gch = (1 - nM) * (1 - nK); b = (1 - nY) * (1 - nK);
      d[i] = clamp(r * 255, 0, 255); d[i + 1] = clamp(gch * 255, 0, 255); d[i + 2] = clamp(b * 255, 0, 255);
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── 5) Shadow/Highlight — blurred-luminance mask lifts shadows / pulls highlights, with midtone contrast ──
R({
  field: 'fxLPshHigh', name: 'Shadow/Highlight', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 0.5, paramLabel: 'Shadow Amt', range: [0, 1, 0.01],
  extra: [
    { kind: 'slider', sub: 'fxLPshHi', label: 'Highlight Amt', min: 0, max: 1, step: 0.01, def: 0.3 },
    { kind: 'slider', sub: 'fxLPshRad', label: 'Radius', min: 0, max: 60, step: 1, def: 20 },
    { kind: 'slider', sub: 'fxLPshMid', label: 'Midtone Contrast', min: -1, max: 1, step: 0.01, def: 0 },
  ],
  render(api, val) {
    const { lg, W, H, c, clamp, blurMatte } = api;
    const shAmt = val;
    const hiAmt = (c.fxLPshHi == null ? 0.3 : +c.fxLPshHi);
    const rad = (c.fxLPshRad == null ? 20 : +c.fxLPshRad);
    const mid = (c.fxLPshMid == null ? 0 : +c.fxLPshMid);
    const im = lg.getImageData(0, 0, W, H), d = im.data, n = W * H;
    // luminance field → blur to build the local tonal mask
    const lum = new Float32Array(n);
    for (let p = 0; p < n; p++) {
      const i = p * 4;
      lum[p] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    }
    if (rad > 0.5) blurMatte(lum, W, H, rad);
    for (let p = 0; p < n; p++) {
      const i = p * 4;
      if (d[i + 3] === 0) continue;
      const m = lum[p]; // local (blurred) luminance 0-1
      // shadow weight peaks at black, highlight weight peaks at white (smooth ramps)
      const sw = (1 - m) * (1 - m);
      const hw = m * m;
      // gain in stops-ish: lift shadows up, pull highlights down
      let mul = 1 + shAmt * 1.2 * sw - hiAmt * 0.9 * hw;
      if (mul < 0) mul = 0;
      // midtone contrast about 0.5 weighted by midtone proximity (1 - |m-0.5|*2)
      const midW = 1 - Math.abs(m - 0.5) * 2;
      for (let ch = 0; ch < 3; ch++) {
        let v = d[i + ch] * mul;
        if (mid !== 0) {
          const t = v / 255 - 0.5;
          v = (0.5 + t * (1 + mid * midW)) * 255;
        }
        d[i + ch] = clamp(v, 0, 255);
      }
    }
    lg.putImageData(im, 0, 0);
  },
});

// ── 6) LePrince Kernel — user 3x3 / 5x5 convolution over a copied source buffer, Normalize + bias ──
R({
  field: 'fxLPkernel', name: 'LePrince Kernel', cat: 'Color Correction', color: '#5BA3C7',
  def: 0, applyVal: 1, paramLabel: 'Mix', range: [0, 1, 0.01],
  extra: [
    { kind: 'seg', sub: 'fxLPkSize', label: 'Size', opts: ['3x3', '5x5'], def: '3x3' },
    { kind: 'seg', sub: 'fxLPkNorm', label: 'Normalize', opts: ['Off', 'On'], def: 'On' },
    { kind: 'slider', sub: 'fxLPkBias', label: 'Bias', min: -1, max: 1, step: 0.01, def: 0 },
    { kind: 'slider', sub: 'fxLPkScale', label: 'Scale', min: 0.05, max: 4, step: 0.05, def: 1 },
    // 3x3 core cells (identity default = centre 1)
    { kind: 'slider', sub: 'fxLPk00', label: 'M[0,0]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk01', label: 'M[0,1]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk02', label: 'M[0,2]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk10', label: 'M[1,0]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk11', label: 'M[1,1]', min: -8, max: 8, step: 0.1, def: 1 },
    { kind: 'slider', sub: 'fxLPk12', label: 'M[1,2]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk20', label: 'M[2,0]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk21', label: 'M[2,1]', min: -8, max: 8, step: 0.1, def: 0 },
    { kind: 'slider', sub: 'fxLPk22', label: 'M[2,2]', min: -8, max: 8, step: 0.1, def: 0 },
    // 5x5 extra ring: outer-ring weight + radius falloff (used only when Size=5x5)
    { kind: 'slider', sub: 'fxLPkRing', label: '5x5 Ring Wt', min: -2, max: 2, step: 0.05, def: 0 },
  ],
  match: [/^(?:CC |LePrince )Kernel$/i],
  render(api, val) {
    const { lg, W, H, c, clamp } = api;
    const g = (s, dv) => (c[s] == null ? dv : +c[s]);
    const size5 = (c.fxLPkSize || '3x3') === '5x5';
    const norm = (c.fxLPkNorm || 'On') === 'On';
    const bias = g('fxLPkBias', 0) * 255;
    const scale = g('fxLPkScale', 1);
    const ring = g('fxLPkRing', 0);
    // build the kernel
    const k3 = [
      g('fxLPk00', 0), g('fxLPk01', 0), g('fxLPk02', 0),
      g('fxLPk10', 0), g('fxLPk11', 1), g('fxLPk12', 0),
      g('fxLPk20', 0), g('fxLPk21', 0), g('fxLPk22', 0),
    ];
    let kern, R0;
    if (size5) {
      R0 = 2; kern = new Float32Array(25);
      // map the 3x3 cells into the centre, ring weight fills the outer 16 cells
      for (let ky = 0; ky < 5; ky++) for (let kx = 0; kx < 5; kx++) {
        const oy = Math.abs(ky - 2), ox = Math.abs(kx - 2);
        if (oy <= 1 && ox <= 1) kern[ky * 5 + kx] = k3[(ky - 1) * 3 + (kx - 1)];
        else kern[ky * 5 + kx] = ring;
      }
    } else { R0 = 1; kern = Float32Array.from(k3); }
    const span = R0 * 2 + 1;
    let ksum = 0; for (let q = 0; q < kern.length; q++) ksum += kern[q];
    const div = (norm && Math.abs(ksum) > 1e-6) ? ksum : 1;
    const im = lg.getImageData(0, 0, W, H), d = im.data, s = new Uint8ClampedArray(d);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (s[i + 3] === 0) { continue; }
        let ar = 0, ag = 0, ab = 0;
        for (let ky = 0; ky < span; ky++) {
          let sy = y + ky - R0; if (sy < 0) sy = 0; else if (sy > H - 1) sy = H - 1;
          for (let kx = 0; kx < span; kx++) {
            const kw = kern[ky * span + kx]; if (kw === 0) continue;
            let sx = x + kx - R0; if (sx < 0) sx = 0; else if (sx > W - 1) sx = W - 1;
            const si = (sy * W + sx) * 4;
            ar += s[si] * kw; ag += s[si + 1] * kw; ab += s[si + 2] * kw;
          }
        }
        const nr = (ar / div) * scale + bias;
        const ng = (ag / div) * scale + bias;
        const nb = (ab / div) * scale + bias;
        d[i] = clamp(s[i] + (nr - s[i]) * val, 0, 255);
        d[i + 1] = clamp(s[i + 1] + (ng - s[i + 1]) * val, 0, 255);
        d[i + 2] = clamp(s[i + 2] + (nb - s[i + 2]) * val, 0, 255);
      }
    }
    lg.putImageData(im, 0, 0);
  },
});


// ═══ Channel + Matte ═══
// ════════════════ Channel + Matte group (self-contained) ════════════════

// ── Channel ▸ Arithmetic — per-channel R/G/B math against a constant operand colour ──
R({
  field:'fxLPArith', name:'Arithmetic', cat:'Channel', color:'#7C8CA6',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPArithOp',label:'Operator',opts:['Add','Subtract','Multiply','Difference','Min','Max','Screen'],def:'Add'},
    {kind:'seg',sub:'fxLPArithClip',label:'Clip',opts:['On','Off'],def:'On'}
  ],
  colorSubs:['fxLPArithColor'],
  match:[/^Arithmetic$/i],
  render(api,val){
    const {lg,W,H,c,hex2rgb,clamp}=api;
    const op=c.fxLPArithOp||'Add';
    const clip=(c.fxLPArithClip||'On')==='On';
    const K=hex2rgb(c.fxLPArithColor||'#404040'); // operand R,G,B (0-255)
    const im=lg.getImageData(0,0,W,H),d=im.data;
    const apply=(s,k)=>{
      let r;
      if(op==='Add')r=s+k;
      else if(op==='Subtract')r=s-k;
      else if(op==='Multiply')r=s*k/255;
      else if(op==='Difference')r=Math.abs(s-k);
      else if(op==='Min')r=s<k?s:k;
      else if(op==='Max')r=s>k?s:k;
      else /* Screen */ r=255-(255-s)*(255-k)/255;
      if(clip)r=r<0?0:r>255?255:r;
      else { r=r%256; if(r<0)r+=256; }
      return r;
    };
    for(let i=0;i<d.length;i+=4){
      if(d[i+3]===0)continue;
      const nr=apply(d[i],K[0]),ng=apply(d[i+1],K[1]),nb=apply(d[i+2],K[2]);
      d[i]  =clamp(d[i]  +(nr-d[i]  )*val,0,255);
      d[i+1]=clamp(d[i+1]+(ng-d[i+1])*val,0,255);
      d[i+2]=clamp(d[i+2]+(nb-d[i+2])*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Channel ▸ Channel Combiner — route one extracted input channel into a chosen output channel ──
R({
  field:'fxLPChanComb', name:'Channel Combiner', cat:'Channel', color:'#7C8CA6',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPCCFrom',label:'From',opts:['Hue','Lightness','Saturation','Red','Green','Blue','Alpha','Luma','Max','Min'],def:'Luma'},
    {kind:'seg',sub:'fxLPCCTo',label:'To',opts:['Red','Green','Blue','Alpha','Hue','Lightness','Saturation','RGB','Set'],def:'RGB'}
  ],
  match:[/^Channel Combiner$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const from=c.fxLPCCFrom||'Luma', to=c.fxLPCCTo||'RGB';
    // rgb(0-255)->hsl(h 0-360, s/l 0-1)
    const toHSL=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;const dlt=mx-mn;
      if(dlt>1e-6){s=l>0.5?dlt/(2-mx-mn):dlt/(mx+mn);
        if(mx===r)h=(g-b)/dlt+(g<b?6:0);else if(mx===g)h=(b-r)/dlt+2;else h=(r-g)/dlt+4;h*=60;}
      return [h,s,l];};
    const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    const fromHSL=(h,s,l)=>{h=((h%360)+360)%360/360;let r,g,b;if(s<1e-6){r=g=b=l;}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}return [r*255,g*255,b*255];};
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let i=0;i<d.length;i+=4){
      if(d[i+3]===0&&to!=='Alpha')continue;
      const r=d[i],g=d[i+1],b=d[i+2],a=d[i+3];
      // extract the source scalar (normalised to its natural 0-255 range where it makes sense)
      let src; // 0-255 for channel writes
      if(from==='Red')src=r;else if(from==='Green')src=g;else if(from==='Blue')src=b;else if(from==='Alpha')src=a;
      else if(from==='Max')src=Math.max(r,g,b);else if(from==='Min')src=Math.min(r,g,b);
      else if(from==='Luma')src=0.2126*r+0.7152*g+0.0722*b;
      else { const hsl=toHSL(r,g,b); if(from==='Hue')src=hsl[0]/360*255;else if(from==='Saturation')src=hsl[1]*255;else /* Lightness */ src=hsl[2]*255; }
      src=clamp(src,0,255);
      // write into the destination
      let nr=r,ng=g,nb=b,na=a;
      if(to==='Red')nr=src;
      else if(to==='Green')ng=src;
      else if(to==='Blue')nb=src;
      else if(to==='Alpha')na=src;
      else if(to==='RGB'||to==='Set'){nr=ng=nb=src;}
      else { // route into an HSL component, keep the others
        const hsl=toHSL(r,g,b); let h=hsl[0],s=hsl[1],l=hsl[2];
        if(to==='Hue')h=src/255*360;else if(to==='Saturation')s=src/255;else /* Lightness */ l=src/255;
        const rgb=fromHSL(h,s,l);nr=rgb[0];ng=rgb[1];nb=rgb[2];
      }
      d[i]  =clamp(r+(nr-r)*val,0,255);
      d[i+1]=clamp(g+(ng-g)*val,0,255);
      d[i+2]=clamp(b+(nb-b)*val,0,255);
      d[i+3]=clamp(a+(na-a)*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Channel ▸ Minimax — morphological min/max (erode/dilate) over a square neighbourhood on a channel ──
R({
  field:'fxLPMinimax', name:'Minimax', cat:'Channel', color:'#7C8CA6',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPMMOp',label:'Operation',opts:['Minimum','Maximum'],def:'Maximum'},
    {kind:'slider',sub:'fxLPMMRadius',label:'Radius',min:1,max:6,step:1,def:2},
    {kind:'seg',sub:'fxLPMMChan',label:'Channel',opts:['Color','Alpha','Red','Green','Blue'],def:'Color'}
  ],
  match:[/^Minimax$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const isMax=(c.fxLPMMOp||'Maximum')==='Maximum';
    const r=Math.max(1,Math.min(6,Math.round(pval(c,'fxLPMMRadius',fr,2))));
    const chan=c.fxLPMMChan||'Color';
    // channel offsets to process
    let offs;
    if(chan==='Alpha')offs=[3];else if(chan==='Red')offs=[0];else if(chan==='Green')offs=[1];else if(chan==='Blue')offs=[2];else offs=[0,1,2];
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const samp=(x,y,o)=>{const xi=x<0?0:x>W-1?W-1:x,yi=y<0?0:y>H-1?H-1:y;return s[(yi*W+xi)*4+o];};
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      for(const o of offs){
        let v=isMax?0:255;
        for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
          const sv=samp(x+dx,y+dy,o); v=isMax?(sv>v?sv:v):(sv<v?sv:v);
        }
        d[i+o]=clamp(s[i+o]+(v-s[i+o])*val,0,255);
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Channel ▸ Shift Channels — remap each output channel to any input channel of the same layer ──
R({
  field:'fxLPShiftCh', name:'Shift Channels', cat:'Channel', color:'#7C8CA6',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPSCRed',label:'Red →',  opts:['Red','Green','Blue','Alpha','Luminance','Full On','Off'],def:'Red'},
    {kind:'seg',sub:'fxLPSCGreen',label:'Green →',opts:['Red','Green','Blue','Alpha','Luminance','Full On','Off'],def:'Green'},
    {kind:'seg',sub:'fxLPSCBlue',label:'Blue →', opts:['Red','Green','Blue','Alpha','Luminance','Full On','Off'],def:'Blue'},
    {kind:'seg',sub:'fxLPSCAlpha',label:'Alpha →',opts:['Red','Green','Blue','Alpha','Luminance','Full On','Off'],def:'Alpha'}
  ],
  match:[/^Shift Channels$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const sR=c.fxLPSCRed||'Red',sG=c.fxLPSCGreen||'Green',sB=c.fxLPSCBlue||'Blue',sA=c.fxLPSCAlpha||'Alpha';
    const pick=(src,r,g,b,a)=>{
      if(src==='Red')return r;if(src==='Green')return g;if(src==='Blue')return b;if(src==='Alpha')return a;
      if(src==='Luminance')return 0.2126*r+0.7152*g+0.0722*b;
      if(src==='Full On')return 255;return 0; // Off
    };
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let i=0;i<d.length;i+=4){
      const r=s[i],g=s[i+1],b=s[i+2],a=s[i+3];
      const nr=pick(sR,r,g,b,a),ng=pick(sG,r,g,b,a),nb=pick(sB,r,g,b,a),na=pick(sA,r,g,b,a);
      d[i]  =clamp(r+(nr-r)*val,0,255);
      d[i+1]=clamp(g+(ng-g)*val,0,255);
      d[i+2]=clamp(b+(nb-b)*val,0,255);
      d[i+3]=clamp(a+(na-a)*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Matte ▸ Alpha Levels — Levels (in B/W, gamma, out B/W) applied to the ALPHA channel via a 256-LUT ──
R({
  field:'fxLPAlphaLvl', name:'Alpha Levels', cat:'Matte', color:'#62C5C9',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPALInB',label:'Input Black',min:0,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPALInW',label:'Input White',min:0,max:1,step:0.01,def:1},
    {kind:'slider',sub:'fxLPALGamma',label:'Gamma',min:0.1,max:5,step:0.01,def:1},
    {kind:'slider',sub:'fxLPALOutB',label:'Output Black',min:0,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPALOutW',label:'Output White',min:0,max:1,step:0.01,def:1}
  ],
  match:[/^Alpha Levels$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const inB=pval(c,'fxLPALInB',fr,0),inW=pval(c,'fxLPALInW',fr,1);
    const gm=Math.max(0.01,pval(c,'fxLPALGamma',fr,1));
    const outB=pval(c,'fxLPALOutB',fr,0),outW=pval(c,'fxLPALOutW',fr,1);
    const rng=Math.max(1e-3,inW-inB);
    const LUT=new Uint8ClampedArray(256);
    for(let v=0;v<256;v++){
      let t=(v/255-inB)/rng; t=t<0?0:t>1?1:t;
      t=Math.pow(t,1/gm);
      t=outB+(outW-outB)*t;
      LUT[v]=Math.round((t<0?0:t>1?1:t)*255);
    }
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let i=0;i<d.length;i+=4){ d[i+3]+=(LUT[d[i+3]]-d[i+3])*val; }
    lg.putImageData(im,0,0);
  }
});

// ── Matte ▸ Matte Choker — close holes (dilate→erode) with a separate gray-level softness pass ──
R({
  field:'fxLPMatteChoke', name:'Matte Choker', cat:'Matte', color:'#62C5C9',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPMCGeo',label:'Geometric Softness',min:0,max:12,step:1,def:4},
    {kind:'slider',sub:'fxLPMCChoke',label:'Choke',min:-100,max:100,step:1,def:50},
    {kind:'slider',sub:'fxLPMCGray',label:'Gray Level Softness',min:0,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPMCIter',label:'Iterations',min:1,max:4,step:1,def:1}
  ],
  match:[/^Matte Choker$/i],
  render(api,val){
    const {lg,W,H,c,fr,k,pval,morphMatte,blurMatte,clamp}=api;
    const geo=Math.max(0,pval(c,'fxLPMCGeo',fr,4));
    const choke=pval(c,'fxLPMCChoke',fr,50)/100; // -1..1, + closes holes
    const gray=clamp(pval(c,'fxLPMCGray',fr,0),0,1);
    const iter=Math.max(1,Math.round(pval(c,'fxLPMCIter',fr,1)));
    const gr=Math.max(0,Math.round(geo*(k||1)*0.5));
    const im=lg.getImageData(0,0,W,H),d=im.data,N=W*H;
    let M=new Float32Array(N);
    for(let j=0,i=0;j<N;j++,i+=4)M[j]=d[i+3]/255;
    for(let it=0;it<iter;it++){
      if(gr>=1){
        // geometric: close holes (dilate then erode) when choke>=0, open specks when choke<0
        const spread=Math.round(gr*Math.abs(choke))||(Math.abs(choke)>0?1:0);
        if(spread>=1){
          if(choke>=0){ M=morphMatte(M,W,H,spread); M=morphMatte(M,W,H,-spread); }
          else { M=morphMatte(M,W,H,-spread); M=morphMatte(M,W,H,spread); }
        }
      }
      if(gray>0){
        const br=Math.max(1,Math.round(gr*gray+1));
        const B=blurMatte(M,W,H,br);
        // re-threshold around 0.5 by the gray softness amount (firms the soft edge back up)
        for(let j=0;j<N;j++){const t=(B[j]-0.5)*(1+gray*3)+0.5;M[j]=t<0?0:t>1?1:t;}
      }
    }
    for(let j=0,i=0;j<N;j++,i+=4){
      const na=Math.round(M[j]*255);
      d[i+3]=clamp(d[i+3]+(na-d[i+3])*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Matte ▸ Refine Hard Matte — blur the alpha then re-harden with a contrast/shift around 0.5 ──
R({
  field:'fxLPRefineHard', name:'Refine Hard Matte', cat:'Matte', color:'#62C5C9',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPRHSmooth',label:'Smooth',min:0,max:12,step:1,def:3},
    {kind:'slider',sub:'fxLPRHContrast',label:'Contrast',min:0,max:8,step:0.1,def:3},
    {kind:'slider',sub:'fxLPRHShift',label:'Shift',min:-0.4,max:0.4,step:0.01,def:0}
  ],
  match:[/^Refine Hard Matte$/i],
  render(api,val){
    const {lg,W,H,c,fr,k,pval,blurMatte,clamp}=api;
    const sm=Math.max(0,Math.round(pval(c,'fxLPRHSmooth',fr,3)*(k||1)*0.5));
    const con=Math.max(0,pval(c,'fxLPRHContrast',fr,3));
    const shift=pval(c,'fxLPRHShift',fr,0);
    const im=lg.getImageData(0,0,W,H),d=im.data,N=W*H;
    const M=new Float32Array(N);
    for(let j=0,i=0;j<N;j++,i+=4)M[j]=d[i+3]/255;
    const B=sm>=1?blurMatte(M,W,H,sm):M;
    for(let j=0,i=0;j<N;j++,i+=4){
      let t=(B[j]-0.5)*(1+con)+0.5+shift; t=t<0?0:t>1?1:t;
      const na=Math.round(t*255);
      d[i+3]=clamp(d[i+3]+(na-d[i+3])*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Matte ▸ Simple Choker — single-knob alpha spread/shrink: dilate for +choke, erode for −choke ──
R({
  field:'fxLPSimpleChoke', name:'Simple Choker', cat:'Matte', color:'#62C5C9',
  def:0, applyVal:0.3, paramLabel:'Choke', range:[-1,1,0.01],
  match:[/^Simple Choker$/i],
  render(api,val){
    const {lg,W,H,c,fr,k,pval,morphMatte}=api;
    // negative val = choke (erode/shrink), positive = spread (dilate/grow)
    const r=Math.round(val*8*(k||1));
    if(Math.abs(r)<1)return;
    const im=lg.getImageData(0,0,W,H),d=im.data,N=W*H;
    const M=new Float32Array(N);
    for(let j=0,i=0;j<N;j++,i+=4)M[j]=d[i+3]/255;
    const R2=morphMatte(M,W,H,r);
    for(let j=0,i=0;j<N;j++,i+=4)d[i+3]=Math.round(R2[j]*255);
    lg.putImageData(im,0,0);
  }
});


// ═══ Generate + Perspective ═══
// ═══════════════ WAVE — Generate + Perspective (Advanced Lightning, Eyedropper Fill, Fractal, Paint Bucket, Radio Waves, LePrince Glue Gun/Threads/Cylinder/Sphere) ═══════════════

// ═══ Generate ═══

// ── Generate ▸ Advanced Lightning — recursive midpoint-displacement bolt + decaying branches, additive glow ──
R({
  field:'fxLPlightning', name:'Advanced Lightning', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPlOX',label:'Origin X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPlOY',label:'Origin Y',min:0,max:1,step:0.01,def:0.0},
    {kind:'slider',sub:'fxLPlDir',label:'Direction',min:0,max:360,step:1,def:180},
    {kind:'slider',sub:'fxLPlCond',label:'Conductivity',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPlBranch',label:'Branching',min:0,max:1,step:0.01,def:0.45},
    {kind:'slider',sub:'fxLPlGlow',label:'Glow',min:0,max:1,step:0.01,def:0.6},
    {kind:'slider',sub:'fxLPlSeed',label:'Seed',min:0,max:200,step:1,def:0}
  ],
  colorSubs:['fxLPlColor'],
  match:[/^Advanced Lightning$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,reset}=api;
    const mn=Math.min(W,H);
    const ox=pval(c,'fxLPlOX',fr,0.5)*W, oy=pval(c,'fxLPlOY',fr,0.0)*H;
    const dir=pval(c,'fxLPlDir',fr,180)*Math.PI/180;
    const cond=pval(c,'fxLPlCond',fr,0.5);
    const branch=pval(c,'fxLPlBranch',fr,0.45);
    const glow=pval(c,'fxLPlGlow',fr,0.6);
    const seed=Math.round(pval(c,'fxLPlSeed',fr,0));
    const col=c.fxLPlColor||'#9fd0ff';
    // deterministic PRNG (mulberry32) — Seed reseeds per frame (seed + fr drive the jitter)
    let st=(seed*2654435761 + (fr+1)*40503)>>>0;
    const rnd=()=>{st|=0;st=(st+0x6D2B79F5)|0;let t=Math.imul(st^(st>>>15),1|st);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};
    // bolt length scales with conductivity (longer, straighter reach)
    const len=mn*(0.45+0.5*cond);
    const ex=ox+Math.cos(dir)*len, ey=oy+Math.sin(dir)*len;
    // collect polylines via recursive midpoint displacement
    const segs=[]; // {pts:[[x,y]...], w:lineWidth}
    function bolt(x1,y1,x2,y2,disp,depth,width){
      if(depth<=0||disp<1.2){segs.push({pts:[[x1,y1],[x2,y2]],w:width});return;}
      const mx=(x1+x2)/2, my=(y1+y2)/2;
      // perpendicular jitter of the midpoint
      const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1;
      const nx=-dy/L, ny=dx/L;
      const off=(rnd()-0.5)*2*disp;
      const jx=mx+nx*off, jy=my+ny*off;
      bolt(x1,y1,jx,jy,disp*0.55,depth-1,width);
      bolt(jx,jy,x2,y2,disp*0.55,depth-1,width);
      // spawn a decaying branch off the displaced midpoint
      if(rnd()<branch && depth>1){
        const ba=Math.atan2(jy-y1,jx-x1)+(rnd()-0.5)*0.9;
        const blen=L*(0.4+rnd()*0.5);
        const bx=jx+Math.cos(ba)*blen, by=jy+Math.sin(ba)*blen;
        bolt(jx,jy,bx,by,disp*0.6,depth-1,width*0.55);
      }
    }
    const disp0=mn*0.16*(1.1-0.6*cond); // straighter when conductive
    bolt(ox,oy,ex,ey,disp0,7,Math.max(1.2,mn*0.006));
    // render to scratch: soft outer glow ('lighter') + bright core
    reset(sg); sg.clearRect(0,0,W,H);
    sg.lineCap='round'; sg.lineJoin='round'; sg.globalCompositeOperation='lighter';
    // outer glow pass
    if(glow>0.001){
      sg.strokeStyle=col; sg.shadowColor=col;
      for(const s of segs){
        sg.shadowBlur=Math.max(2,glow*mn*0.05);
        sg.lineWidth=s.w*(2.2+glow*4); sg.globalAlpha=0.18+0.25*glow;
        sg.beginPath(); const p=s.pts; sg.moveTo(p[0][0],p[0][1]); for(let i=1;i<p.length;i++)sg.lineTo(p[i][0],p[i][1]); sg.stroke();
      }
    }
    // bright white-hot core pass
    sg.shadowBlur=0; sg.globalAlpha=1; sg.strokeStyle='#ffffff';
    for(const s of segs){
      sg.lineWidth=s.w; sg.beginPath(); const p=s.pts;
      sg.moveTo(p[0][0],p[0][1]); for(let i=1;i<p.length;i++)sg.lineTo(p[i][0],p[i][1]); sg.stroke();
    }
    reset(sg);
    // additive composite onto the layer (lightning adds light)
    reset(lg); lg.globalAlpha=val; lg.globalCompositeOperation='lighter'; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Generate ▸ Eyedropper Fill — sample one source pixel and flood the whole layer with that color ──
R({
  field:'fxLPeyedrop', name:'Eyedropper Fill', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Blend', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPedX',label:'Sample X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPedY',label:'Sample Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPedOpac',label:'Opacity',min:0,max:1,step:0.01,def:1},
    {kind:'seg',sub:'fxLPedKeep',label:'Keep Alpha',opts:['Layer','Fill'],def:'Layer'}
  ],
  match:[/^Eyedropper Fill$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const sx=clamp(Math.round(pval(c,'fxLPedX',fr,0.5)*(W-1)),0,W-1);
    const sy=clamp(Math.round(pval(c,'fxLPedY',fr,0.5)*(H-1)),0,H-1);
    const opac=pval(c,'fxLPedOpac',fr,1);
    const keepFillAlpha=(c.fxLPedKeep||'Layer')==='Fill';
    // sample the single source pixel
    const sp=lg.getImageData(sx,sy,1,1).data;
    const sr=sp[0],sg2=sp[1],sb=sp[2],sa=sp[3];
    const amt=val*opac;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let i=0;i<d.length;i+=4){
      if(!keepFillAlpha && d[i+3]===0)continue; // by default only paint existing pixels
      d[i]+=(sr-d[i])*amt; d[i+1]+=(sg2-d[i+1])*amt; d[i+2]+=(sb-d[i+2])*amt;
      if(keepFillAlpha) d[i+3]+=(sa-d[i+3])*amt;
    }
    lg.putImageData(im,0,0);
  }
});

// ── Generate ▸ Fractal — Mandelbrot/Julia escape-time, iteration→gradient-LUT color (heavy: capped iters) ──
R({
  field:'fxLPfractal', name:'Fractal', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPfrMode',label:'Mode',opts:['Mandelbrot','Julia'],def:'Mandelbrot'},
    {kind:'slider',sub:'fxLPfrCX',label:'Center X',min:-2.5,max:1.5,step:0.001,def:-0.5},
    {kind:'slider',sub:'fxLPfrCY',label:'Center Y',min:-1.5,max:1.5,step:0.001,def:0},
    {kind:'slider',sub:'fxLPfrZoom',label:'Zoom',min:0.2,max:50,step:0.1,def:1},
    {kind:'slider',sub:'fxLPfrIter',label:'Iterations',min:10,max:80,step:1,def:48},
    {kind:'slider',sub:'fxLPfrJX',label:'Julia X',min:-1,max:1,step:0.001,def:-0.7},
    {kind:'slider',sub:'fxLPfrJY',label:'Julia Y',min:-1,max:1,step:0.001,def:0.27}
  ],
  colorSubs:['fxLPfrColA','fxLPfrColB'],
  match:[/^Fractal$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,hex2rgb,reset}=api;
    const mode=c.fxLPfrMode||'Mandelbrot';
    const cx=pval(c,'fxLPfrCX',fr,-0.5), cy=pval(c,'fxLPfrCY',fr,0);
    const zoom=Math.max(0.2,pval(c,'fxLPfrZoom',fr,1));
    const maxIt=Math.max(10,Math.min(80,Math.round(pval(c,'fxLPfrIter',fr,48))));
    const jx=pval(c,'fxLPfrJX',fr,-0.7), jy=pval(c,'fxLPfrJY',fr,0.27);
    const A=hex2rgb(c.fxLPfrColA||'#0a0030'), B=hex2rgb(c.fxLPfrColB||'#ffd060');
    // 256-entry gradient LUT (interior=black, escaped=A→B by smooth iteration)
    const lut=new Uint8ClampedArray(256*3);
    for(let t=0;t<256;t++){const u=t/255;lut[t*3]=A[0]+(B[0]-A[0])*u;lut[t*3+1]=A[1]+(B[1]-A[1])*u;lut[t*3+2]=A[2]+(B[2]-A[2])*u;}
    const scale=3.0/zoom; // complex-plane span across min(W,H)
    const mn=Math.min(W,H), aspX=W/mn, aspY=H/mn;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let y=0;y<H;y++){
      const cyv=cy+((y/H-0.5)*scale*aspY);
      for(let x=0;x<W;x++){
        const cxv=cx+((x/W-0.5)*scale*aspX);
        let zr,zi,pr,pi;
        if(mode==='Julia'){zr=cxv;zi=cyv;pr=jx;pi=jy;}
        else{zr=0;zi=0;pr=cxv;pi=cyv;}
        let it=0,zr2=zr*zr,zi2=zi*zi;
        while(zr2+zi2<=4 && it<maxIt){zi=2*zr*zi+pi;zr=zr2-zi2+pr;zr2=zr*zr;zi2=zi*zi;it++;}
        const i=(y*W+x)*4;
        if(it>=maxIt){d[i]=0;d[i+1]=0;d[i+2]=0;}
        else{
          // smooth (continuous) iteration count → LUT index
          const log_zn=Math.log(zr2+zi2)/2, nu=Math.log(log_zn/Math.log(2))/Math.log(2);
          let si=(it+1-nu); if(!isFinite(si)||si<0)si=it;
          const li=Math.max(0,Math.min(255,Math.round((si/maxIt)*255)));
          d[i]=lut[li*3];d[i+1]=lut[li*3+1];d[i+2]=lut[li*3+2];
        }
        d[i+3]=255;
      }
    }
    lg.putImageData(im,0,0);
    // honour Opacity (val): if <1, blend the fractal back over the original via a copy
    if(val<0.999){
      // already wrote full fractal into lg; nothing more to blend against (original lost),
      // so model Opacity as a fade-to-transparent of the generated plate
      const im2=lg.getImageData(0,0,W,H),d2=im2.data;
      for(let i=3;i<d2.length;i+=4)d2[i]=Math.round(d2[i]*val);
      lg.putImageData(im2,0,0);
    }
    reset(lg);
  }
});

// ── Generate ▸ Paint Bucket — scanline flood-fill from a seed within a color tolerance ──
R({
  field:'fxLPbucket', name:'Paint Bucket', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPpbX',label:'Seed X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPpbY',label:'Seed Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPpbTol',label:'Tolerance',min:0,max:1,step:0.01,def:0.15},
    {kind:'slider',sub:'fxLPpbStroke',label:'Stroke',min:0,max:8,step:1,def:0},
    {kind:'seg',sub:'fxLPpbMode',label:'Mode',opts:['Fill','Stroke'],def:'Fill'}
  ],
  colorSubs:['fxLPpbColor'],
  match:[/^Paint Bucket$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,hex2rgb,clamp}=api;
    const seedX=clamp(Math.round(pval(c,'fxLPpbX',fr,0.5)*(W-1)),0,W-1);
    const seedY=clamp(Math.round(pval(c,'fxLPpbY',fr,0.5)*(H-1)),0,H-1);
    const tol=pval(c,'fxLPpbTol',fr,0.15)*255*1.7321; // tolerance in RGB-distance units
    const strokeOnly=(c.fxLPpbMode||'Fill')==='Stroke';
    const sw=Math.max(0,Math.round(pval(c,'fxLPpbStroke',fr,0)));
    const fill=hex2rgb(c.fxLPpbColor||'#ff2d55');
    const im=lg.getImageData(0,0,W,H),d=im.data;
    const si=(seedY*W+seedX)*4;
    const tr=d[si],tg=d[si+1],tb=d[si+2];
    const tolSq=tol*tol;
    const match=(i)=>{const dr=d[i]-tr,dg=d[i+1]-tg,db=d[i+2]-tb;return (dr*dr+dg*dg+db*db)<=tolSq;};
    // scanline flood fill (4-connected), mark a visited mask
    const mask=new Uint8Array(W*H);
    const stack=[[seedX,seedY]];
    while(stack.length){
      const pt=stack.pop(); let x=pt[0]; const y=pt[1];
      let i=(y*W+x)*4;
      if(mask[y*W+x]||!match(i))continue;
      // walk left
      let xl=x; while(xl>0 && !mask[y*W+(xl-1)] && match(((y*W+(xl-1))*4))) xl--;
      // walk right
      let xr=x; while(xr<W-1 && !mask[y*W+(xr+1)] && match(((y*W+(xr+1))*4))) xr++;
      for(let xx=xl;xx<=xr;xx++){
        mask[y*W+xx]=1;
        if(y>0){const ai=(y-1)*W+xx; if(!mask[ai] && match(ai*4))stack.push([xx,y-1]);}
        if(y<H-1){const bi=(y+1)*W+xx; if(!mask[bi] && match(bi*4))stack.push([xx,y+1]);}
      }
    }
    if(strokeOnly){
      // edge = filled pixel adjacent to a non-filled pixel; widen by sw
      const edge=new Uint8Array(W*H);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        if(!mask[y*W+x])continue;
        let isEdge=(x===0||x===W-1||y===0||y===H-1)||!mask[y*W+x-1]||!mask[y*W+x+1]||!mask[(y-1)*W+x]||!mask[(y+1)*W+x];
        if(isEdge)edge[y*W+x]=1;
      }
      const r=sw;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        if(!edge[y*W+x])continue;
        for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
          const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H)continue; if(dx*dx+dy*dy>r*r)continue;
          const i=(ny*W+nx)*4; d[i]+=(fill[0]-d[i])*val;d[i+1]+=(fill[1]-d[i+1])*val;d[i+2]+=(fill[2]-d[i+2])*val;
          if(d[i+3]===0)d[i+3]=Math.round(255*val);
        }
      }
    } else {
      for(let p=0;p<W*H;p++){
        if(!mask[p])continue; const i=p*4;
        d[i]+=(fill[0]-d[i])*val;d[i+1]+=(fill[1]-d[i+1])*val;d[i+2]+=(fill[2]-d[i+2])*val;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Generate ▸ Radio Waves — expanding rings from a producer point, age driven purely by frame (stateless) ──
R({
  field:'fxLPradio', name:'Radio Waves', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPrwX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPrwY',label:'Center Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPrwFreq',label:'Frequency',min:2,max:60,step:1,def:14},
    {kind:'slider',sub:'fxLPrwExp',label:'Expansion',min:0.5,max:12,step:0.1,def:4},
    {kind:'slider',sub:'fxLPrwWidth',label:'Width',min:1,max:24,step:1,def:3},
    {kind:'slider',sub:'fxLPrwLife',label:'Lifespan',min:10,max:240,step:1,def:90}
  ],
  colorSubs:['fxLPrwColor'],
  match:[/^Radio Waves$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,reset}=api;
    const cx=pval(c,'fxLPrwX',fr,0.5)*W, cy=pval(c,'fxLPrwY',fr,0.5)*H;
    const interval=Math.max(2,Math.round(pval(c,'fxLPrwFreq',fr,14))); // frames between spawns
    const exp=pval(c,'fxLPrwExp',fr,4);   // px of growth per frame
    const baseW=Math.max(1,pval(c,'fxLPrwWidth',fr,3));
    const life=Math.max(10,Math.round(pval(c,'fxLPrwLife',fr,90))); // frames a ring lives
    const col=c.fxLPrwColor||'#7fe0ff';
    reset(sg); sg.clearRect(0,0,W,H);
    sg.strokeStyle=col; sg.globalCompositeOperation='lighter';
    // each ring's birth frame = k*interval; age = fr - birth. Pure function of fr → stateless.
    const newest=Math.floor(fr/interval);
    for(let k=newest; k>=0; k--){
      const birth=k*interval, age=fr-birth;
      if(age<0||age>life)continue;
      const r=age*exp; if(r<0.5)continue;
      const t=age/life;                 // 0=new, 1=dead
      const a=(1-t)*(1-t);              // opacity fades quadratically
      const lw=Math.max(0.5,baseW*(1-t*0.7));
      sg.globalAlpha=a; sg.lineWidth=lw;
      sg.beginPath(); sg.arc(cx,cy,r,0,Math.PI*2); sg.stroke();
    }
    reset(sg);
    reset(lg); lg.globalAlpha=val; lg.globalCompositeOperation='lighter'; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Generate ▸ LePrince Glue Gun — bead of soft metaball glue blobs along a path, threshold for gooey edge ──
R({
  field:'fxLPglueGun', name:'LePrince Glue Gun', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPggX',label:'Position X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPggY',label:'Position Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPggLen',label:'Length',min:0,max:1,step:0.01,def:0.6},
    {kind:'slider',sub:'fxLPggAng',label:'Angle',min:0,max:360,step:1,def:0},
    {kind:'slider',sub:'fxLPggSize',label:'Size',min:0.01,max:0.2,step:0.005,def:0.06},
    {kind:'slider',sub:'fxLPggGloss',label:'Glossiness',min:0,max:1,step:0.01,def:0.6}
  ],
  colorSubs:['fxLPggColor'],
  match:[/^(?:CC |LePrince )Glue Gun$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,hex2rgb,reset,clamp}=api;
    const mn=Math.min(W,H);
    const px=pval(c,'fxLPggX',fr,0.5)*W, py=pval(c,'fxLPggY',fr,0.5)*H;
    const len=pval(c,'fxLPggLen',fr,0.6)*mn;
    const ang=pval(c,'fxLPggAng',fr,0)*Math.PI/180;
    const sz=Math.max(2,pval(c,'fxLPggSize',fr,0.06)*mn);
    const gloss=pval(c,'fxLPggGloss',fr,0.6);
    const col=hex2rgb(c.fxLPggColor||'#e8f0ff');
    // lay overlapping radial-gradient blobs along the bead path into the scratch alpha field
    reset(sg); sg.clearRect(0,0,W,H);
    const dx=Math.cos(ang), dy=Math.sin(ang);
    const step=Math.max(2,sz*0.45), n=Math.max(1,Math.round(len/step));
    sg.globalCompositeOperation='lighter';
    for(let i=0;i<=n;i++){
      const t=i/Math.max(1,n);
      const bx=px+dx*len*t, by=py+dy*len*t;
      // slight bead-radius wobble so the trail looks hand-laid
      const rr=sz*(0.78+0.22*Math.sin(i*1.7));
      const g=sg.createRadialGradient(bx,by,0,bx,by,rr);
      g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.7,'rgba(255,255,255,0.55)'); g.addColorStop(1,'rgba(255,255,255,0)');
      sg.fillStyle=g; sg.beginPath(); sg.arc(bx,by,rr,0,Math.PI*2); sg.fill();
    }
    reset(sg);
    // threshold the accumulated alpha → gooey metaball edge, recolor + glossy highlight
    const im=sg.getImageData(0,0,W,H),sd=im.data;
    const thr=0.42*255; // metaball iso-threshold
    for(let i=0;i<sd.length;i+=4){
      const field=sd[i]; // accumulated white field in R (all channels equal pre-threshold via lighter on white)
      let a; if(field<thr*0.6)a=0; else if(field>thr)a=255; else a=((field-thr*0.6)/(thr*0.4))*255;
      // gloss: brighten where the field is highest (blob cores) → specular sheen
      const core=clamp((field-thr)/ (255-thr+0.001),0,1);
      const sheen=core*gloss;
      sd[i]=clamp(col[0]+(255-col[0])*sheen,0,255);
      sd[i+1]=clamp(col[1]+(255-col[1])*sheen,0,255);
      sd[i+2]=clamp(col[2]+(255-col[2])*sheen,0,255);
      sd[i+3]=clamp(a,0,255);
    }
    sg.putImageData(im,0,0);
    reset(lg); lg.globalAlpha=val; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Generate ▸ LePrince Threads — strands integrated through an fbm flow field, stroked polylines ──
R({
  field:'fxLPthreads', name:'LePrince Threads', cat:'Generate', color:'#6FB79A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPthCount',label:'Count',min:8,max:400,step:1,def:120},
    {kind:'slider',sub:'fxLPthLen',label:'Length',min:8,max:300,step:1,def:90},
    {kind:'slider',sub:'fxLPthScale',label:'Scale',min:20,max:400,step:1,def:140},
    {kind:'slider',sub:'fxLPthWidth',label:'Width',min:0.3,max:4,step:0.1,def:0.9},
    {kind:'slider',sub:'fxLPthSeed',label:'Seed',min:0,max:200,step:1,def:0}
  ],
  colorSubs:['fxLPthColor'],
  match:[/^(?:CC |LePrince )Threads$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,fbm,pval,reset}=api;
    const count=Math.max(8,Math.round(pval(c,'fxLPthCount',fr,120)));
    const steps=Math.max(8,Math.round(pval(c,'fxLPthLen',fr,90)));
    const scl=Math.max(20,pval(c,'fxLPthScale',fr,140));
    const lw=Math.max(0.3,pval(c,'fxLPthWidth',fr,0.9));
    const seed=Math.round(pval(c,'fxLPthSeed',fr,0));
    const col=c.fxLPthColor||'#ffffff';
    let st=(seed*2246822519 + 1013904223)>>>0;
    const rnd=()=>{st|=0;st=(st+0x6D2B79F5)|0;let t=Math.imul(st^(st>>>15),1|st);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};
    const stepLen=Math.max(0.6,Math.min(W,H)/240); // integration step length in px
    reset(sg); sg.clearRect(0,0,W,H);
    sg.strokeStyle=col; sg.lineWidth=lw; sg.lineCap='round'; sg.globalCompositeOperation='lighter';
    for(let s=0;s<count;s++){
      let x=rnd()*W, y=rnd()*H;
      const a=0.35+rnd()*0.5; // per-thread opacity
      sg.globalAlpha=a*0.8;
      sg.beginPath(); sg.moveTo(x,y);
      for(let i=0;i<steps;i++){
        // flow-field angle from fbm; advect the point
        const ang=fbm(x/scl,y/scl)*Math.PI*4;
        x+=Math.cos(ang)*stepLen; y+=Math.sin(ang)*stepLen;
        if(x<-2||y<-2||x>W+2||y>H+2)break;
        sg.lineTo(x,y);
      }
      sg.stroke();
    }
    reset(sg);
    reset(lg); lg.globalAlpha=val; lg.globalCompositeOperation='lighter'; lg.drawImage(S,0,0); reset(lg);
  }
});

// ═══ Perspective ═══

// ── Perspective ▸ LePrince Cylinder — wrap the frame on a cylinder via arc-angle resample + cos shading ──
R({
  field:'fxLPcylinder', name:'LePrince Cylinder', cat:'Perspective', color:'#B05B8B',
  def:0, applyVal:1, paramLabel:'Curvature', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPcyRot',label:'Rotation',min:-1,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPcyLight',label:'Light',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPcyRad',label:'Radius',min:0.3,max:1,step:0.01,def:0.85}
  ],
  match:[/^(?:CC |LePrince )Cylinder$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const curv=clamp(val,0,1);                 // 0=flat, 1=half-cylinder (±90°)
    const rot=pval(c,'fxLPcyRot',fr,0);        // horizontal spin, fraction of the wrap
    const light=pval(c,'fxLPcyLight',fr,0.5);  // shading strength
    const rad=pval(c,'fxLPcyRad',fr,0.85);     // visible radius (how much of the arc fills the width)
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const half=(Math.PI/2)*curv;               // max arc angle off-axis
    const cw=W/2;
    for(let x=0;x<W;x++){
      // output x → normalized [-1,1] across the visible cylinder face
      const nx=(x-cw)/(cw*rad);
      let theta, shade, srcU;
      if(Math.abs(nx)>1){ // beyond the cylinder's silhouette → leave column transparent-ish (sample edge, fade)
        theta=Math.sign(nx)*half; srcU=nx>0?W-1:0; shade=0;
      } else {
        theta=Math.asin(nx)*(half/(Math.PI/2 || 1)); // map face position to arc angle (sin projection)
        // sin-projection: a point at angle θ on the cylinder samples source u = (θ/arc + 0.5 + rot)
        const wrap=half>1e-4?(theta/half):0;       // -1..1 across the face
        srcU=(wrap*0.5+0.5+rot); srcU=((srcU%1)+1)%1; srcU*=W;
        shade=Math.cos(theta); // Lambert-ish: edges darker
      }
      const shadeF=1-(1-shade)*light;
      for(let y=0;y<H;y++){
        const i=(y*W+x)*4;
        const r=samp(srcU,y,0),g=samp(srcU,y,1),b=samp(srcU,y,2),a=samp(srcU,y,3);
        d[i]=clamp(r*shadeF,0,255); d[i+1]=clamp(g*shadeF,0,255); d[i+2]=clamp(b*shadeF,0,255);
        d[i+3]=(Math.abs(nx)>1)?0:a;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Perspective ▸ LePrince Sphere — raycast each pixel onto a sphere → lat/long UV sample + Lambert shading ──
R({
  field:'fxLPsphere', name:'LePrince Sphere', cat:'Perspective', color:'#B05B8B',
  def:0, applyVal:1, paramLabel:'Radius', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPspRotX',label:'Rotation X',min:-1,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPspRotY',label:'Rotation Y',min:-1,max:1,step:0.01,def:0},
    {kind:'slider',sub:'fxLPspLight',label:'Light',min:0,max:1,step:0.01,def:0.6},
    {kind:'slider',sub:'fxLPspLX',label:'Light X',min:-1,max:1,step:0.01,def:-0.5},
    {kind:'slider',sub:'fxLPspLY',label:'Light Y',min:-1,max:1,step:0.01,def:-0.5}
  ],
  match:[/^(?:CC |LePrince )Sphere$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const mn=Math.min(W,H);
    const R0=Math.max(0.05,val)*mn*0.48;       // sphere radius in px
    const rotY=pval(c,'fxLPspRotX',fr,0)*Math.PI;   // RotationX param → tilt about X (latitude offset)
    const rotX=pval(c,'fxLPspRotY',fr,0)*Math.PI;   // RotationY param → spin about Y (longitude offset)
    const lightAmt=pval(c,'fxLPspLight',fr,0.6);
    let lx=pval(c,'fxLPspLX',fr,-0.5), ly=pval(c,'fxLPspLY',fr,-0.5), lz=0.8;
    {const ll=Math.hypot(lx,ly,lz)||1; lx/=ll; ly/=ll; lz/=ll;}
    const cx=W/2, cy=H/2;
    const ca=Math.cos(rotX), sa=Math.sin(rotX); // longitude spin (about Y axis)
    const cb=Math.cos(rotY), sb=Math.sin(rotY); // latitude tilt (about X axis)
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const R2=R0*R0;
    for(let y=0;y<H;y++){
      const py=y-cy;
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        const px=x-cx;
        const r2=px*px+py*py;
        if(r2>R2){d[i+3]=0;continue;}            // outside the sphere silhouette → transparent
        // orthographic raycast: surface normal of the front hemisphere
        let nx=px/R0, ny=py/R0, nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
        // rotate the surface point: tilt about X (latitude), then spin about Y (longitude)
        // about X
        let ry1=ny*cb - nz*sb, rz1=ny*sb + nz*cb, rx1=nx;
        // about Y
        let rx2=rx1*ca + rz1*sa, rz2=-rx1*sa + rz1*ca, ry2=ry1;
        // hit point → lat/long → equirectangular UV of the flat source
        const lat=Math.asin(clamp(ry2,-1,1));        // -PI/2..PI/2
        const lon=Math.atan2(rx2,rz2);               // -PI..PI
        const u=((lon/(2*Math.PI))+0.5);             // 0..1
        const v=((lat/Math.PI)+0.5);                 // 0..1
        const su=clamp(u,0,1)*(W-1), sv=clamp(v,0,1)*(H-1);
        // Lambert shading from the (unrotated) view-space normal
        const diff=Math.max(0, nx*lx + ny*ly + nz*lz);
        const shade=1-(1-(0.35+0.65*diff))*lightAmt;
        const rr=samp(su,sv,0),gg=samp(su,sv,1),bb=samp(su,sv,2),aa=samp(su,sv,3);
        d[i]=clamp(rr*shade,0,255); d[i+1]=clamp(gg*shade,0,255); d[i+2]=clamp(bb*shade,0,255);
        d[i+3]=aa;
      }
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Stylize + Noise + Simulation ═══
// ═══ Stylize ═══
// ── Stylize ▸ LePrince Plastic — plastic relief: luma-gradient normal → Lambert + specular through a glossy colour ──
R({
  field:'fxLPplastic', name:'LePrince Plastic', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:0.7, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPplastLight',label:'Light Direction',min:0,max:360,step:1,def:135},
    {kind:'slider',sub:'fxLPplastShine',label:'Shininess',min:1,max:80,step:1,def:24},
    {kind:'slider',sub:'fxLPplastHeight',label:'Relief',min:1,max:12,step:0.5,def:4}
  ],
  colorSubs:['fxLPplastColor'],
  match:[/^(?:CC |LePrince )Plastic$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,hex2rgb}=api;
    const ang=pval(c,'fxLPplastLight',fr,135)*Math.PI/180;
    const shin=Math.max(1,pval(c,'fxLPplastShine',fr,24));
    const relief=pval(c,'fxLPplastHeight',fr,4);
    const gloss=hex2rgb(c.fxLPplastColor||'#ffffff');
    // light vector (pointing toward the surface from the light), with a fixed upward z
    const lx=Math.cos(ang), ly=Math.sin(ang), lz=0.85;
    const ll=Math.hypot(lx,ly,lz), Lx=lx/ll, Ly=ly/ll, Lz=lz/ll;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    // luma at a clamped pixel (alpha-aware: transparent reads as 0 height)
    const lum=(x,y)=>{
      const xi=x<0?0:x>W-1?W-1:x|0, yi=y<0?0:y>H-1?H-1:y|0, j=(yi*W+xi)*4;
      if(s[j+3]===0)return 0;
      return (0.299*s[j]+0.587*s[j+1]+0.114*s[j+2])/255;
    };
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(d[i+3]===0)continue;
      // surface normal from the luma height field (Sobel-style central difference)
      const gx=(lum(x+1,y)-lum(x-1,y))*relief;
      const gy=(lum(x,y+1)-lum(x,y-1))*relief;
      const nl=Math.hypot(gx,gy,1), Nx=-gx/nl, Ny=-gy/nl, Nz=1/nl;
      // Lambert diffuse
      const diff=Math.max(0,Nx*Lx+Ny*Ly+Nz*Lz);
      // Blinn-style specular: reflect light about normal, raise to shininess
      const dotNL=Nx*Lx+Ny*Ly+Nz*Lz;
      const Rz=2*dotNL*Nz-Lz; // view = +z, so highlight ∝ reflected z component
      const spec=Math.pow(Math.max(0,Rz),shin);
      // base tone (a mid-grey plastic body lit by diffuse) blended with the glossy colour at highlights
      const body=0.35+0.6*diff;
      for(let ch=0;ch<3;ch++){
        const plastic=body*255*0.55 + 0.45*255*body*0.5; // tonal ramp through the relief
        const litCol=plastic + gloss[ch]*spec*1.1;
        d[i+ch]+=(Math.min(255,litCol)-d[i+ch])*val;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Stylize ▸ LePrince RepeTile — edge-tiling coordinate fold (Tile/Reflect/Hold/Continue per axis) ──
R({
  field:'fxLPrepeTile', name:'LePrince RepeTile', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPrtTiles',label:'Tiles',min:1,max:8,step:1,def:2},
    {kind:'slider',sub:'fxLPrtExpand',label:'Expand',min:1,max:4,step:0.05,def:1},
    {kind:'seg',sub:'fxLPrtH',label:'Horizontal',opts:['Tile','Reflect','Hold','Continue'],def:'Reflect'},
    {kind:'seg',sub:'fxLPrtV',label:'Vertical',opts:['Tile','Reflect','Hold','Continue'],def:'Reflect'}
  ],
  match:[/^(?:CC |LePrince )RepeTile$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const tiles=Math.max(1,Math.round(pval(c,'fxLPrtTiles',fr,2)));
    const expand=Math.max(0.01,pval(c,'fxLPrtExpand',fr,1));
    const modeH=c.fxLPrtH||'Reflect', modeV=c.fxLPrtV||'Reflect';
    // fold a coordinate into [0,size) by the chosen edge mode. tw/th = source tile span.
    const fold=(p,size,mode)=>{
      if(mode==='Tile')   return ((p%size)+size)%size;
      if(mode==='Hold')   return p<0?0:p>size-1?size-1:p;          // clamp (edge pixel repeats)
      if(mode==='Continue')return p<0?0:p>size-1?size-1:p;          // clamp like Hold (edge extension)
      // Reflect (mirror): triangle fold over 2*size
      let q=((p%(2*size))+(2*size))%(2*size);
      return q<size? q : (2*size-1-q);
    };
    const tw=W/tiles, th=H/tiles; // source tile size; output covers full frame
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // map output px → repeated source coordinate (expand zooms the source span)
      const u=(x/expand), v=(y/expand);
      const sx=fold(u,tw,modeH)*(W/tw)/ (W/tw); // keep within source tile then scale to source res
      // sample within one tile mapped back to full-source range
      const su=fold(u, tw, modeH) * (W/tw);
      const sv=fold(v, th, modeV) * (H/th);
      d[i]+=(samp_(s,su,sv,0)-d[i])*val;
      d[i+1]+=(samp_(s,su,sv,1)-d[i+1])*val;
      d[i+2]+=(samp_(s,su,sv,2)-d[i+2])*val;
      d[i+3]+=(samp_(s,su,sv,3)-d[i+3])*val;
      void sx;
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Noise ═══
// ── Noise ▸ Scatter — per-pixel positional jitter via a hashed offset within an Amount radius ──
R({
  field:'fxLPscatter', name:'Scatter', cat:'Noise', color:'#8FA98F',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPscatGrain',label:'Grain',min:1,max:16,step:1,def:1},
    {kind:'slider',sub:'fxLPscatRand',label:'Randomness',min:0,max:1,step:0.01,def:1},
    {kind:'seg',sub:'fxLPscatDir',label:'Scatter',opts:['Both','Horizontal','Vertical'],def:'Both'}
  ],
  match:[/^Scatter$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const rad=val*Math.min(W,H)*0.12;
    const grain=Math.max(1,Math.round(pval(c,'fxLPscatGrain',fr,1)));
    const rnd=pval(c,'fxLPscatRand',fr,1);
    const dir=c.fxLPscatDir||'Both';
    const hH=(dir!=='Vertical'), hV=(dir!=='Horizontal');
    // deterministic 2-output hash in [-1,1] per chunk
    const hash=(a,b,sd)=>{const h=Math.sin(a*127.1+b*311.7+sd*74.7)*43758.5453;return (h-Math.floor(h))*2-1;};
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      const bx=(x/grain)|0, by=(y/grain)|0; // chunk index (Grain = chunk size)
      const ox=hH? hash(bx,by,1.3)*rad*rnd : 0;
      const oy=hV? hash(bx,by,9.1)*rad*rnd : 0;
      const sx=x+ox, sy=y+oy;
      d[i]=samp_(s,sx,sy,0);d[i+1]=samp_(s,sx,sy,1);d[i+2]=samp_(s,sx,sy,2);d[i+3]=samp_(s,sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Noise ▸ Strobe Light — frame-index gated flash/invert/opacity at Intensity (STATELESS) ──
R({
  field:'fxLPstrobe', name:'Strobe Light', cat:'Noise', color:'#8FA98F',
  def:0, applyVal:1, paramLabel:'Intensity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPstrPeriod',label:'Period',min:1,max:60,step:1,def:6},
    {kind:'slider',sub:'fxLPstrDuration',label:'Duration',min:1,max:30,step:1,def:1},
    {kind:'seg',sub:'fxLPstrOp',label:'Operator',opts:['Color','Invert','Opacity'],def:'Color'}
  ],
  colorSubs:['fxLPstrColor'],
  match:[/^Strobe Light$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,hex2rgb}=api;
    const period=Math.max(1,Math.round(pval(c,'fxLPstrPeriod',fr,6)));
    const dur=Math.max(1,Math.round(pval(c,'fxLPstrDuration',fr,1)));
    const op=c.fxLPstrOp||'Color';
    // is the CURRENT frame inside the "on" window of its strobe cycle?
    const phase=((fr%period)+period)%period;
    const on=phase<Math.min(dur,period);
    if(!on)return;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    if(op==='Color'){
      const col=hex2rgb(c.fxLPstrColor||'#ffffff');
      for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;
        d[i]+=(col[0]-d[i])*val;d[i+1]+=(col[1]-d[i+1])*val;d[i+2]+=(col[2]-d[i+2])*val;}
    }else if(op==='Invert'){
      for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;
        d[i]+=((255-d[i])-d[i])*val;d[i+1]+=((255-d[i+1])-d[i+1])*val;d[i+2]+=((255-d[i+2])-d[i+2])*val;}
    }else{ // Opacity: dim the layer on strobe frames
      for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue; d[i+3]=Math.round(d[i+3]*(1-val));}
    }
    lg.putImageData(im,0,0);
  }
});

// ── Noise ▸ Dust & Scratches — median-style despeckle (replace only > Threshold from local median) + optional scratch lines ──
R({
  field:'fxLPdustScratch', name:'Dust & Scratches', cat:'Noise', color:'#8FA98F',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPdsRadius',label:'Radius',min:1,max:4,step:1,def:1},
    {kind:'slider',sub:'fxLPdsThresh',label:'Threshold',min:0,max:128,step:1,def:24},
    {kind:'seg',sub:'fxLPdsScratch',label:'Scratches',opts:['Off','On'],def:'Off'}
  ],
  match:[/^Dust & Scratches$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const R2=Math.max(1,Math.round(pval(c,'fxLPdsRadius',fr,1)));
    const thr=pval(c,'fxLPdsThresh',fr,24);
    const scratch=(c.fxLPdsScratch||'Off')==='On';
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const win=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(s[i+3]===0)continue;
      // per-channel median over the radius window; replace channel only if it deviates > Threshold
      for(let ch=0;ch<3;ch++){
        win.length=0;
        for(let ry=-R2;ry<=R2;ry++)for(let rx=-R2;rx<=R2;rx++){
          const xi=x+rx<0?0:x+rx>W-1?W-1:x+rx, yi=y+ry<0?0:y+ry>H-1?H-1:y+ry, j=(yi*W+xi)*4;
          if(s[j+3]===0)continue;
          win.push(s[j+ch]);
        }
        if(!win.length)continue;
        win.sort((a,b)=>a-b);
        const med=win[win.length>>1];
        if(Math.abs(s[i+ch]-med)>thr){ d[i+ch]+=(med-s[i+ch])*val; } // despeckle this channel
      }
    }
    // procedural vertical scratch lines (hash-seeded columns, faint bright/dark streaks)
    if(scratch){
      const hash=(a,b)=>{const h=Math.sin(a*91.7+b*47.3)*43758.5453;return h-Math.floor(h);};
      const nScr=Math.max(1,Math.round(W*0.02));
      for(let k=0;k<nScr;k++){
        const cx=Math.floor(hash(k+1,fr*0.0)*W); // static seed per column index (deterministic)
        const bright=hash(k+1,2.0)>0.5? 60:-60;
        const top=Math.floor(hash(k+1,3.0)*H), len=Math.floor((0.3+hash(k+1,4.0)*0.7)*H);
        for(let y=top;y<Math.min(H,top+len);y++){
          const i=(y*W+cx)*4; if(d[i+3]===0)continue;
          for(let ch=0;ch<3;ch++) d[i+ch]=Math.max(0,Math.min(255,d[i+ch]+bright*val));
        }
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Noise ▸ Noise Alpha — hash noise written into the ALPHA channel only (RGB untouched) ──
R({
  field:'fxLPnoiseAlpha', name:'Noise Alpha', cat:'Noise', color:'#8FA98F',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxLPnaDist',label:'Distribution',opts:['Uniform','Squared'],def:'Uniform'},
    {kind:'seg',sub:'fxLPnaAnim',label:'Animate',opts:['Off','On'],def:'Off'}
  ],
  match:[/^Noise Alpha$/i],
  render(api,val){
    const {lg,W,H,c,fr}=api;
    const dist=c.fxLPnaDist||'Uniform';
    const anim=(c.fxLPnaAnim||'Off')==='On';
    const seed=anim? fr*0.131 : 0;
    const hash=(x,y)=>{const h=Math.sin((x*12.9898+y*78.233+seed*53.71))*43758.5453;return h-Math.floor(h);};
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(d[i+3]===0)continue; // only modulate existing pixels
      let n=hash(x,y);                 // [0,1)
      if(dist==='Squared')n=n*n;        // bias toward low values (more transparent dropouts)
      const a0=d[i+3];
      // mix original alpha toward the noise-scaled alpha by Amount
      d[i+3]=Math.round(a0*(1 - val*(1-n)));
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Simulation ═══
// ── Sim ▸ LePrince Bubbles — N rising bubbles, deterministic per-frame positions, radial-ring + rim + specular (STATELESS) ──
R({
  field:'fxLPbubbles', name:'LePrince Bubbles', cat:'Simulation', color:'#C77B9B',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPbubCount',label:'Count',min:4,max:120,step:1,def:36},
    {kind:'slider',sub:'fxLPbubSize',label:'Size',min:4,max:60,step:1,def:18},
    {kind:'slider',sub:'fxLPbubSpeed',label:'Speed',min:0.1,max:4,step:0.05,def:1}
  ],
  match:[/^(?:CC |LePrince )Bubbles$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,vnoise,reset}=api;
    const count=Math.max(1,Math.round(pval(c,'fxLPbubCount',fr,36)));
    const baseSize=pval(c,'fxLPbubSize',fr,18);
    const speed=pval(c,'fxLPbubSpeed',fr,1);
    const hash=(n)=>{const h=Math.sin(n*127.1+3.71)*43758.5453;return h-Math.floor(h);};
    reset(sg); sg.clearRect(0,0,W,H);
    for(let k=0;k<count;k++){
      const seed=k+1;
      const hx=hash(seed*1.7), hsz=hash(seed*4.3), hsp=hash(seed*7.9);
      const r=(0.4+hsz*0.9)*baseSize;                 // per-bubble radius
      const vel=(0.4+hsp*0.9)*speed;                  // rise speed (frames→pixels)
      // y position rises and wraps over the frame height (pure function of fr)
      const travel=(fr*vel*2 + hash(seed)*H);
      const y=H - (((travel%(H+2*r))+(H+2*r))%(H+2*r)) + r;
      // horizontal: base column + value-noise sway (deterministic in fr)
      const swayBase=hx*W;
      const sway=(vnoise(fr*0.03+seed*5, seed*3)-0.5)*2*baseSize*1.4;
      const x=swayBase+sway;
      if(y< -r || y>H+r) continue;
      // body: faint radial fill (glassy)
      const g=sg.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba(255,255,255,0.04)');
      g.addColorStop(0.78,'rgba(200,225,255,0.02)');
      g.addColorStop(1,'rgba(255,255,255,0.0)');
      sg.fillStyle=g; sg.beginPath(); sg.arc(x,y,r,0,Math.PI*2); sg.fill();
      // rim ring
      sg.strokeStyle='rgba(255,255,255,0.5)'; sg.lineWidth=Math.max(1,r*0.08);
      sg.beginPath(); sg.arc(x,y,r*0.95,0,Math.PI*2); sg.stroke();
      // specular dot (upper-left)
      sg.fillStyle='rgba(255,255,255,0.9)';
      sg.beginPath(); sg.arc(x-r*0.35,y-r*0.35,r*0.16,0,Math.PI*2); sg.fill();
    }
    reset(lg); lg.globalAlpha=val; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Sim ▸ LePrince Rainfall — seeded angled raindrop streaks with motion-blur length (STATELESS) ──
R({
  field:'fxLPrainfall', name:'LePrince Rainfall', cat:'Simulation', color:'#C77B9B',
  def:0, applyVal:0.7, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPrainAmt',label:'Amount',min:20,max:600,step:5,def:200},
    {kind:'slider',sub:'fxLPrainSpeed',label:'Speed',min:0.2,max:6,step:0.1,def:2},
    {kind:'slider',sub:'fxLPrainAngle',label:'Angle',min:-45,max:45,step:1,def:12},
    {kind:'slider',sub:'fxLPrainLen',label:'Length',min:4,max:80,step:1,def:24}
  ],
  match:[/^(?:CC |LePrince )Rainfall$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,reset}=api;
    const amt=Math.max(1,Math.round(pval(c,'fxLPrainAmt',fr,200)));
    const speed=pval(c,'fxLPrainSpeed',fr,2);
    const ang=pval(c,'fxLPrainAngle',fr,12)*Math.PI/180;
    const len=pval(c,'fxLPrainLen',fr,24);
    const dx=Math.sin(ang), dy=Math.cos(ang);       // fall direction (mostly down)
    const hash=(n)=>{const h=Math.sin(n*127.1+9.2)*43758.5453;return h-Math.floor(h);};
    reset(sg); sg.clearRect(0,0,W,H);
    sg.lineCap='round';
    const span=H+len*2;
    for(let k=0;k<amt;k++){
      const seed=k+1;
      const colX=hash(seed*1.3)*(W+ Math.abs(dx)*span); // start column (extra width for slant)
      const vel=(0.6+hash(seed*2.1)*0.8)*speed*6;
      const phase=hash(seed*3.7)*span;
      const t=((fr*vel+phase)%span+span)%span;          // distance fallen, wrapped
      const hx=colX - dx*t;                             // back-track along the slant
      const hy=-len + dy*t;
      if(hy<-len||hy>H+len)continue;
      const ll=(0.6+hash(seed*5.5)*0.8)*len;            // per-drop streak length
      sg.strokeStyle='rgba(200,220,255,'+(0.25+hash(seed*6.6)*0.45).toFixed(3)+')';
      sg.lineWidth=0.6+hash(seed*8.3)*1.1;
      sg.beginPath();
      sg.moveTo(hx,hy);
      sg.lineTo(hx+dx*ll,hy+dy*ll);
      sg.stroke();
    }
    reset(lg); lg.globalAlpha=val; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Sim ▸ LePrince Snowfall — seeded flakes drifting down + value-noise sway, depth layers (STATELESS) ──
R({
  field:'fxLPsnowfall', name:'LePrince Snowfall', cat:'Simulation', color:'#C77B9B',
  def:0, applyVal:0.85, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPsnowAmt',label:'Amount',min:20,max:500,step:5,def:160},
    {kind:'slider',sub:'fxLPsnowSpeed',label:'Speed',min:0.1,max:4,step:0.05,def:1},
    {kind:'slider',sub:'fxLPsnowWind',label:'Wind',min:-3,max:3,step:0.05,def:0.4},
    {kind:'slider',sub:'fxLPsnowSize',label:'Size',min:1,max:8,step:0.5,def:3}
  ],
  match:[/^(?:CC |LePrince )Snowfall$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,vnoise,reset}=api;
    const amt=Math.max(1,Math.round(pval(c,'fxLPsnowAmt',fr,160)));
    const speed=pval(c,'fxLPsnowSpeed',fr,1);
    const wind=pval(c,'fxLPsnowWind',fr,0.4);
    const baseSize=pval(c,'fxLPsnowSize',fr,3);
    const hash=(n)=>{const h=Math.sin(n*127.1+17.3)*43758.5453;return h-Math.floor(h);};
    reset(sg); sg.clearRect(0,0,W,H);
    const span=H+baseSize*4;
    for(let k=0;k<amt;k++){
      const seed=k+1;
      const depth=hash(seed*2.9);                       // 0=far(small/slow/faint) .. 1=near
      const sz=(0.4+depth*1.0)*baseSize;
      const vel=(0.3+depth*1.0)*speed*2;
      const opa=(0.3+depth*0.6);
      const colX=hash(seed*1.3)*W;
      const phase=hash(seed*3.7)*span;
      const t=((fr*vel+phase)%span+span)%span;
      const y=-baseSize*2 + t;
      if(y<-sz||y>H+sz)continue;
      // horizontal: wind drift + value-noise sway (deterministic in fr)
      const sway=(vnoise(fr*0.02+seed*7, seed*4)-0.5)*2*baseSize*3;
      const x=colX + wind*t + sway;
      sg.fillStyle='rgba(255,255,255,'+opa.toFixed(3)+')';
      sg.beginPath(); sg.arc(((x%W)+W)%W, y, sz, 0, Math.PI*2); sg.fill();
    }
    reset(lg); lg.globalAlpha=val; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Sim ▸ LePrince Star Burst — starfield flying past camera, seeded radial trajectories, warp-streaks (STATELESS) ──
R({
  field:'fxLPstarBurst', name:'LePrince Star Burst', cat:'Simulation', color:'#C77B9B',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPsbCount',label:'Count',min:20,max:600,step:5,def:200},
    {kind:'slider',sub:'fxLPsbSpeed',label:'Speed',min:0.2,max:6,step:0.1,def:1.5},
    {kind:'slider',sub:'fxLPsbCX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLPsbCY',label:'Center Y',min:0,max:1,step:0.01,def:0.5}
  ],
  match:[/^(?:CC |LePrince )Star Burst$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,reset}=api;
    const count=Math.max(1,Math.round(pval(c,'fxLPsbCount',fr,200)));
    const speed=pval(c,'fxLPsbSpeed',fr,1.5);
    const cx=pval(c,'fxLPsbCX',fr,0.5)*W, cy=pval(c,'fxLPsbCY',fr,0.5)*H;
    const maxR=Math.hypot(Math.max(cx,W-cx),Math.max(cy,H-cy));
    const hash=(n)=>{const h=Math.sin(n*127.1+5.4)*43758.5453;return h-Math.floor(h);};
    reset(sg); sg.clearRect(0,0,W,H);
    sg.lineCap='round';
    for(let k=0;k<count;k++){
      const seed=k+1;
      const ang=hash(seed*1.7)*Math.PI*2;               // fixed radial direction
      const ca=Math.cos(ang), sa=Math.sin(ang);
      const phase=hash(seed*3.1);
      // radius grows then wraps (star flies outward from center, recycles at edge)
      const cycle=((fr*speed*0.012+phase)%1+1)%1;
      const r=cycle*cycle*maxR;                          // accelerate as it nears the camera
      if(r<2)continue;
      const x=cx+ca*r, y=cy+sa*r;
      if(x<-10||x>W+10||y<-10||y>H+10)continue;
      const bright=Math.min(1,r/maxR);                   // brighter/longer near the edge
      const streak=bright*bright*22*speed;               // warp-streak length
      const a=(0.25+bright*0.75).toFixed(3);
      sg.strokeStyle='rgba(255,255,255,'+a+')';
      sg.lineWidth=0.6+bright*1.6;
      sg.beginPath();
      sg.moveTo(x,y);
      sg.lineTo(x-ca*streak, y-sa*streak);               // tail points back toward center
      sg.stroke();
    }
    reset(lg); lg.globalAlpha=val; lg.globalCompositeOperation='screen'; lg.drawImage(S,0,0); reset(lg);
  }
});

// ── Sim ▸ LePrince Drizzle — water ripples: seeded expanding rings + thin radial displacement of footage at each ring edge (STATELESS) ──
R({
  field:'fxLPdrizzle', name:'LePrince Drizzle', cat:'Simulation', color:'#C77B9B',
  def:0, applyVal:0.6, paramLabel:'Displacement', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLPdrzAmt',label:'Amount',min:1,max:24,step:1,def:8},
    {kind:'slider',sub:'fxLPdrzSpeed',label:'Ring Speed',min:0.2,max:5,step:0.1,def:1.5},
    {kind:'slider',sub:'fxLPdrzWidth',label:'Ring Width',min:2,max:40,step:1,def:12}
  ],
  match:[/^(?:CC |LePrince )Drizzle$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const samp_=(s,sx,sy,o)=>{const xi=sx<0?0:sx>W-1?W-1:sx|0,yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    const amt=Math.max(1,Math.round(pval(c,'fxLPdrzAmt',fr,8)));
    const ringSpeed=pval(c,'fxLPdrzSpeed',fr,1.5);
    const ringW=Math.max(2,pval(c,'fxLPdrzWidth',fr,12));
    const maxR=Math.hypot(W,H)*0.6;
    const amp=val*ringW*0.9;                            // peak radial push at a ring edge
    const hash=(n,o)=>{const h=Math.sin(n*127.1+o*311.7+2.3)*43758.5453;return h-Math.floor(h);};
    // precompute the active ripple centres (seeded points, staggered birth times)
    const drops=[];
    const life=maxR/ (ringSpeed*3);                      // frames for a ring to reach maxR
    for(let k=0;k<amt;k++){
      const seed=k+1;
      const ox=hash(seed,1)*W, oy=hash(seed,2)*H;
      const birth=hash(seed,3)*life;
      const age=((fr-birth)%life+life)%life;             // 0..life, loops
      const radius=age*ringSpeed*3;                      // current ring radius
      drops.push({ox,oy,radius});
    }
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      let dispX=0, dispY=0;
      for(let k=0;k<drops.length;k++){
        const dp=drops[k];
        const ddx=x-dp.ox, ddy=y-dp.oy, dist=Math.sqrt(ddx*ddx+ddy*ddy);
        const off=dist-dp.radius;                        // signed distance from the ring edge
        if(Math.abs(off)>ringW||dist<0.5)continue;
        // a single ripple oscillation across the ring band, faded as the ring expands
        const wave=Math.sin((off/ringW)*Math.PI)*Math.cos((off/ringW)*Math.PI*0.5);
        const fade=1-Math.min(1,dp.radius/maxR);
        const push=wave*fade*amp;
        dispX+=(ddx/dist)*push;
        dispY+=(ddy/dist)*push;
      }
      const sx=x+dispX, sy=y+dispY;
      d[i]=samp_(s,sx,sy,0);d[i+1]=samp_(s,sx,sy,1);d[i+2]=samp_(s,sx,sy,2);d[i+3]=samp_(s,sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});


  // ════════════════ WAVE 3 (Distort/Transition/Obsolete/Text/Keying/Channel/VR) ════════════════

// ═══ Distort warps (#8B7FD0) ═══
// ════════════════ WAVE 3 — Distort warps (#8B7FD0) ════════════════

// ── Distort ▸ LePrince Smear — push pixels in a from→to region along the drag vector with radial falloff ──
// Forward warp inverted: for each output pixel inside the radius, pull the sample coordinate BACK toward 'from'
// by the smear vector scaled by a smooth radial falloff (so the region drags as if grabbed and dragged).
R({
  field:'fxW3smear', name:'LePrince Smear', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:0.6, paramLabel:'Strength', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3smearFromX',label:'From X',min:0,max:1,step:0.01,def:0.35},
    {kind:'slider',sub:'fxW3smearFromY',label:'From Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3smearToX',label:'To X',min:0,max:1,step:0.01,def:0.65},
    {kind:'slider',sub:'fxW3smearToY',label:'To Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3smearRadius',label:'Radius',min:0.02,max:0.8,step:0.01,def:0.25}
  ],
  match:[/^(?:CC |LePrince )Smear$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const fx=pval(c,'fxW3smearFromX',fr,0.35)*W, fy=pval(c,'fxW3smearFromY',fr,0.5)*H;
    const tx=pval(c,'fxW3smearToX',fr,0.65)*W,   ty=pval(c,'fxW3smearToY',fr,0.5)*H;
    const rad=Math.max(1,pval(c,'fxW3smearRadius',fr,0.25)*Math.min(W,H));
    const vx=(tx-fx)*val, vy=(ty-fy)*val;            // total drag vector (scaled by strength)
    const r2=rad*rad;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // distance of this output pixel from the 'to' point (region centre after drag)
      const dx=x-tx, dy=y-ty, dd=dx*dx+dy*dy;
      let sx=x, sy=y;
      if(dd<r2){
        const dist=Math.sqrt(dd);
        const t=1-dist/rad;                           // 1 at centre → 0 at edge
        const fall=t*t*(3-2*t);                       // smoothstep falloff
        sx=x-vx*fall; sy=y-vy*fall;                   // pull sample back toward 'from'
      }
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ LePrince Split — slice at a seam and slide the two halves apart, gap left transparent ──
R({
  field:'fxW3split', name:'LePrince Split', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:0.3, paramLabel:'Split', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3splitSeam',label:'Seam',min:0,max:1,step:0.01,def:0.5},
    {kind:'seg',sub:'fxW3splitDir',label:'Direction',opts:['Horizontal','Vertical'],def:'Horizontal'}
  ],
  match:[/^(?:CC |LePrince )Split$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const dir=c.fxW3splitDir||'Horizontal';
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    if(dir==='Horizontal'){
      const seam=Math.round(pval(c,'fxW3splitSeam',fr,0.5)*W);
      const off=Math.round(val*0.5*W);                // each half slides half the total
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        // output x maps back to a source x by undoing the slide for whichever half it belongs to
        const sx = x<seam ? x+off : x-off;
        if(sx<0||sx>=W){ d[i+3]=0; continue; }
        const si=(y*W+sx)*4;
        d[i]=s[si];d[i+1]=s[si+1];d[i+2]=s[si+2];d[i+3]=s[si+3];
      }
    }else{
      const seam=Math.round(pval(c,'fxW3splitSeam',fr,0.5)*H);
      const off=Math.round(val*0.5*H);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        const sy = y<seam ? y+off : y-off;
        if(sy<0||sy>=H){ d[i+3]=0; continue; }
        const si=(sy*W+x)*4;
        d[i]=s[si];d[i+1]=s[si+1];d[i+2]=s[si+2];d[i+3]=s[si+3];
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ LePrince Split 2 — two independent seams → three bands, each translated by its own offset ──
R({
  field:'fxW3split2', name:'LePrince Split 2', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:0.3, paramLabel:'Split A', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3split2B',label:'Split B',min:0,max:1,step:0.01,def:0.3},
    {kind:'slider',sub:'fxW3split2SeamA',label:'Seam A',min:0,max:1,step:0.01,def:0.33},
    {kind:'slider',sub:'fxW3split2SeamB',label:'Seam B',min:0,max:1,step:0.01,def:0.66},
    {kind:'seg',sub:'fxW3split2Dir',label:'Direction',opts:['Horizontal','Vertical'],def:'Horizontal'}
  ],
  match:[/^(?:CC |LePrince )Split 2$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const dir=c.fxW3split2Dir||'Horizontal';
    const splB=pval(c,'fxW3split2B',fr,0.3);
    let sA=pval(c,'fxW3split2SeamA',fr,0.33), sB=pval(c,'fxW3split2SeamB',fr,0.66);
    if(sA>sB){ const t=sA; sA=sB; sB=t; }             // keep seams ordered
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    if(dir==='Horizontal'){
      const seamA=Math.round(sA*W), seamB=Math.round(sB*W);
      const offL=Math.round(-val*0.5*W);              // left band slides left
      const offR=Math.round(splB*0.5*W);              // right band slides right
      // middle band stays put; output→source = subtract that band's slide
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        let band; if(x<seamA)band=offL; else if(x>=seamB)band=offR; else band=0;
        const sx=x-band;
        if(sx<0||sx>=W){ d[i+3]=0; continue; }
        const si=(y*W+sx)*4;
        d[i]=s[si];d[i+1]=s[si+1];d[i+2]=s[si+2];d[i+3]=s[si+3];
      }
    }else{
      const seamA=Math.round(sA*H), seamB=Math.round(sB*H);
      const offT=Math.round(-val*0.5*H);
      const offB=Math.round(splB*0.5*H);
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        let band; if(y<seamA)band=offT; else if(y>=seamB)band=offB; else band=0;
        const sy=y-band;
        if(sy<0||sy>=H){ d[i+3]=0; continue; }
        const si=(sy*W+x)*4;
        d[i]=s[si];d[i+1]=s[si+1];d[i+2]=s[si+2];d[i+3]=s[si+3];
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ LePrince Tiler — repeat the frame as N×N tiles via modulo coords + optional phase row-shift & mirror ──
R({
  field:'fxW3tiler', name:'LePrince Tiler', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:1, paramLabel:'Tiles', range:[1,8,1],
  extra:[
    {kind:'slider',sub:'fxW3tilerCenterX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3tilerCenterY',label:'Center Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3tilerPhase',label:'Phase',min:0,max:1,step:0.01,def:0},
    {kind:'seg',sub:'fxW3tilerMirror',label:'Mirror',opts:['Off','On'],def:'Off'}
  ],
  match:[/^(?:CC |LePrince )Tiler$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const n=Math.max(1,Math.round(val));               // tiles per axis
    const tw=W/n, th=H/n;
    const cx=pval(c,'fxW3tilerCenterX',fr,0.5), cy=pval(c,'fxW3tilerCenterY',fr,0.5);
    const phase=pval(c,'fxW3tilerPhase',fr,0)*tw;       // per-row horizontal shift
    const mirror=(c.fxW3tilerMirror||'Off')==='On';
    // centre offset so the tiling re-centres on the chosen point
    const ox=cx*W - tw/2, oy=cy*H - th/2;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      let row=Math.floor((y-oy)/th);
      let lx=(((x-ox)+phase*row)%tw+tw)%tw;             // local x within tile (phase-shifted by row)
      let ly=(((y-oy))%th+th)%th;
      if(mirror){
        const col=Math.floor((x-ox)/tw);
        if(((col%2)+2)%2===1) lx=tw-1-lx;              // mirror odd columns
        if(((row%2)+2)%2===1) ly=th-1-ly;              // mirror odd rows
      }
      // map tile-local coord back into the full source frame
      const sx=(lx/tw)*W, sy=(ly/th)*H;
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ Corner Pin — 4-corner projective (homography) warp; back-project each output pixel ──
// Solve H mapping unit square → 4 dest corners, invert, sample source at H^-1·(x,y).
// helper (file-scope-safe via closure): build the 3x3 homography from unit square to 4 points.
R({
  field:'fxW3cpin', name:'Corner Pin', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3cpinTLx',label:'TL X',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3cpinTLy',label:'TL Y',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3cpinTRx',label:'TR X',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3cpinTRy',label:'TR Y',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3cpinBRx',label:'BR X',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3cpinBRy',label:'BR Y',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3cpinBLx',label:'BL X',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3cpinBLy',label:'BL Y',min:-0.5,max:1.5,step:0.01,def:1}
  ],
  match:[/^Corner Pin$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    // destination corners (TL,TR,BR,BL) interpolated from identity by 'Amount'
    const lerp=(a,b)=>a+(b-a)*val;
    const dx=[lerp(0,pval(c,'fxW3cpinTLx',fr,0)),lerp(1,pval(c,'fxW3cpinTRx',fr,1)),lerp(1,pval(c,'fxW3cpinBRx',fr,1)),lerp(0,pval(c,'fxW3cpinBLx',fr,0))];
    const dy=[lerp(0,pval(c,'fxW3cpinTLy',fr,0)),lerp(0,pval(c,'fxW3cpinTRy',fr,0)),lerp(1,pval(c,'fxW3cpinBRy',fr,1)),lerp(1,pval(c,'fxW3cpinBLy',fr,1))];
    // build forward homography unit-square→dest, then invert; map output px (in unit space) back to source unit space.
    // unitSquare points: (0,0)(1,0)(1,1)(0,1). Standard projective solve.
    const sq=W3homography(0,0,1,0,1,1,0,1, dx[0]*W,dy[0]*H, dx[1]*W,dy[1]*H, dx[2]*W,dy[2]*H, dx[3]*W,dy[3]*H);
    const inv=W3invert3(sq);
    if(!inv){ return; }                                 // degenerate (collinear corners) → no-op
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // back-project pixel → unit-square (u,v), then scale to source pixels
      const wgt=inv[6]*x+inv[7]*y+inv[8];
      const u=(inv[0]*x+inv[1]*y+inv[2])/wgt;
      const v=(inv[3]*x+inv[4]*y+inv[5])/wgt;
      if(u<0||u>1||v<0||v>1){ d[i+3]=0; continue; }
      const sx=u*W, sy=v*H;
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ LePrince Power Pin — same projective 4-corner warp, own params ──
R({
  field:'fxW3ppin', name:'LePrince Power Pin', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3ppinTLx',label:'TL X',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3ppinTLy',label:'TL Y',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3ppinTRx',label:'TR X',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3ppinTRy',label:'TR Y',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3ppinBRx',label:'BR X',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3ppinBRy',label:'BR Y',min:-0.5,max:1.5,step:0.01,def:1},
    {kind:'slider',sub:'fxW3ppinBLx',label:'BL X',min:-0.5,max:1.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3ppinBLy',label:'BL Y',min:-0.5,max:1.5,step:0.01,def:1}
  ],
  match:[/^(?:CC |LePrince )Power Pin$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const lerp=(a,b)=>a+(b-a)*val;
    const dx=[lerp(0,pval(c,'fxW3ppinTLx',fr,0)),lerp(1,pval(c,'fxW3ppinTRx',fr,1)),lerp(1,pval(c,'fxW3ppinBRx',fr,1)),lerp(0,pval(c,'fxW3ppinBLx',fr,0))];
    const dy=[lerp(0,pval(c,'fxW3ppinTLy',fr,0)),lerp(0,pval(c,'fxW3ppinTRy',fr,0)),lerp(1,pval(c,'fxW3ppinBRy',fr,1)),lerp(1,pval(c,'fxW3ppinBLy',fr,1))];
    const sq=W3homography(0,0,1,0,1,1,0,1, dx[0]*W,dy[0]*H, dx[1]*W,dy[1]*H, dx[2]*W,dy[2]*H, dx[3]*W,dy[3]*H);
    const inv=W3invert3(sq);
    if(!inv){ return; }
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      const wgt=inv[6]*x+inv[7]*y+inv[8];
      const u=(inv[0]*x+inv[1]*y+inv[2])/wgt;
      const v=(inv[3]*x+inv[4]*y+inv[5])/wgt;
      if(u<0||u>1||v<0||v>1){ d[i+3]=0; continue; }
      const sx=u*W, sy=v*H;
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// shared math used by Corner Pin / Power Pin (defined once, after first use — hoisted function declarations).
// 3x3 inverse (row-major 9-vec); returns null if near-singular.
function W3invert3(m){
  const a=m[0],b=m[1],cc=m[2],d=m[3],e=m[4],f=m[5],g=m[6],h=m[7],i=m[8];
  const A=e*i-f*h, B=-(d*i-f*g), C=d*h-e*g;
  const det=a*A+b*B+cc*C;
  if(Math.abs(det)<1e-9) return null;
  const id=1/det;
  return [
    A*id, (cc*h-b*i)*id, (b*f-cc*e)*id,
    B*id, (a*i-cc*g)*id, (cc*d-a*f)*id,
    C*id, (b*g-a*h)*id,  (a*e-b*d)*id
  ];
}
// homography mapping (sx0,sy0..sx3,sy3) → (dx0,dy0..dx3,dy3); returns row-major 9-vec (forward: src→dst).
// Built as Hdst·Hsrc^-1, where each H* maps the canonical basis to its quad (classic projective basis method).
function W3basisToQuad(x0,y0,x1,y1,x2,y2,x3,y3){
  // solve for the projective basis: columns scaled so that (1,1,1) maps to p3.
  const dx1=x0-x2, dx2=x1-x2, sx=x0+x1-x2-x3;          // here ordering: p0,p1,p2,p3 = the four quad corners
  const dy1=y0-y2, dy2=y1-y2, sy=y0+y1-y2-y3;
  let g,h;
  if(Math.abs(dx1)<1e-12 && Math.abs(dx2)<1e-12){
    g=0; h=0;
  }else{
    const den=dx1*dy2-dx2*dy1;
    g=(sx*dy2-dx2*sy)/den;
    h=(dx1*sy-sx*dy1)/den;
  }
  const a=x1-x0+g*x1, b=x3-x0+h*x3, cc=x0;
  const d2=y1-y0+g*y1, e=y3-y0+h*y3, f=y0;
  // NOTE: the canonical unit-square mapping uses corner order p0=(0,0)→ this matrix's basis.
  return [a,b,cc, d2,e,f, g,h,1];
}
// full unit-square→dest homography. We map unit square corners in order (0,0)(1,0)(1,1)(0,1) to dest.
function W3homography(sx0,sy0,sx1,sy1,sx2,sy2,sx3,sy3, dx0,dy0,dx1,dy1,dx2,dy2,dx3,dy3){
  // src is always the unit square here → its basis is the canonical square map; just build dest basis.
  // canonical square→dest (corner order TL,TR,BR,BL == (0,0)(1,0)(1,1)(0,1))
  return W3squareToQuad(dx0,dy0,dx1,dy1,dx2,dy2,dx3,dy3);
}
// map the unit square (0,0)(1,0)(1,1)(0,1) → quad (qx0..). Standard Heckbert projective solution.
function W3squareToQuad(qx0,qy0,qx1,qy1,qx2,qy2,qx3,qy3){
  const dx1=qx1-qx2, dx2=qx3-qx2, sx=qx0-qx1+qx2-qx3;
  const dy1=qy1-qy2, dy2=qy3-qy2, sy=qy0-qy1+qy2-qy3;
  let g,h;
  if(Math.abs(sx)<1e-12 && Math.abs(sy)<1e-12){
    g=0; h=0;                                           // affine case
  }else{
    const den=dx1*dy2-dy1*dx2;
    if(Math.abs(den)<1e-12){ g=0; h=0; }
    else{ g=(sx*dy2-sy*dx2)/den; h=(dx1*sy-dy1*sx)/den; }
  }
  const a=qx1-qx0+g*qx1, b=qx3-qx0+h*qx3, c0=qx0;
  const d=qy1-qy0+g*qy1, e=qy3-qy0+h*qy3, f=qy0;
  // row-major: maps (u,v,1) [unit square] → (X,Y,W) [dest]
  return [a,b,c0, d,e,f, g,h,1];
}

// ── Distort ▸ Bezier Warp — 4 cubic-bezier edges (12 control pts) → Coons-patch boundary deformation ──
// Each edge is a cubic bezier (corner, +2 controls, corner). The interior is a Coons patch over the 4 edges;
// for each output (u,v) we evaluate the patch position in the SOURCE frame and sample there.
R({
  field:'fxW3bezier', name:'Bezier Warp', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3bezTopBow',label:'Top Bow',min:-0.5,max:0.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3bezBotBow',label:'Bottom Bow',min:-0.5,max:0.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3bezLeftBow',label:'Left Bow',min:-0.5,max:0.5,step:0.01,def:0},
    {kind:'slider',sub:'fxW3bezRightBow',label:'Right Bow',min:-0.5,max:0.5,step:0.01,def:0}
  ],
  match:[/^Bezier Warp$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    // four corners in source space (normalized 0..1)
    const c00=[0,0],c10=[1,0],c11=[1,1],c01=[0,1];
    // bow amounts push the two mid controls of each edge outward (perpendicular to the edge)
    const tb=pval(c,'fxW3bezTopBow',fr,0)*val, bb=pval(c,'fxW3bezBotBow',fr,0)*val;
    const lb=pval(c,'fxW3bezLeftBow',fr,0)*val, rb=pval(c,'fxW3bezRightBow',fr,0)*val;
    // cubic bezier point on edge defined by P0,P1,P2,P3 at param t
    const bez=(P0,P1,P2,P3,t)=>{
      const mt=1-t, a=mt*mt*mt, b=3*mt*mt*t, d=3*mt*t*t, e=t*t*t;
      return [a*P0[0]+b*P1[0]+d*P2[0]+e*P3[0], a*P0[1]+b*P1[1]+d*P2[1]+e*P3[1]];
    };
    // edge control points: top (c00→c10, bowed in +y), bottom (c01→c11, +y), left (c00→c01, +x), right (c10→c11, +x)
    const topC1=[1/3, tb],   topC2=[2/3, tb];
    const botC1=[1/3, 1+bb], botC2=[2/3, 1+bb];
    const lefC1=[lb,1/3],    lefC2=[lb,2/3];
    const rigC1=[1+rb,1/3],  rigC2=[1+rb,2/3];
    const top=(t)=>bez(c00,topC1,topC2,c10,t);
    const bot=(t)=>bez(c01,botC1,botC2,c11,t);
    const lef=(t)=>bez(c00,lefC1,lefC2,c01,t);
    const rig=(t)=>bez(c10,rigC1,rigC2,c11,t);
    // Coons patch: S(u,v) = (1-v)·top(u)+v·bot(u) + (1-u)·lef(v)+u·rig(v) - bilinear(corners)
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++){
      const v=y/(H-1||1);
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        const u=x/(W-1||1);
        const T=top(u),B=bot(u),Le=lef(v),Ri=rig(v);
        // bilinear of corners
        const bx=(1-u)*(1-v)*c00[0]+u*(1-v)*c10[0]+u*v*c11[0]+(1-u)*v*c01[0];
        const by=(1-u)*(1-v)*c00[1]+u*(1-v)*c10[1]+u*v*c11[1]+(1-u)*v*c01[1];
        const sxN=(1-v)*T[0]+v*B[0]+(1-u)*Le[0]+u*Ri[0]-bx;
        const syN=(1-v)*T[1]+v*B[1]+(1-u)*Le[1]+u*Ri[1]-by;
        const sx=sxN*W, sy=syN*H;
        d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Distort ▸ Mesh Warp — coarse R×C control grid; bilinear per-cell displacement from low-freq fbm × Distortion ──
R({
  field:'fxW3mesh', name:'Mesh Warp', cat:'Distort', color:'#8B7FD0',
  def:0, applyVal:0.4, paramLabel:'Distortion', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3meshRows',label:'Rows',min:2,max:8,step:1,def:4},
    {kind:'slider',sub:'fxW3meshCols',label:'Cols',min:2,max:8,step:1,def:4}
  ],
  match:[/^Mesh Warp$/i],
  render(api,val){
    const {lg,W,H,c,fr,fbm,pval}=api;
    const rows=Math.max(2,Math.round(pval(c,'fxW3meshRows',fr,4)));
    const cols=Math.max(2,Math.round(pval(c,'fxW3meshCols',fr,4)));
    const amp=val*Math.min(W,H)*0.18;                   // max vertex push in px
    // build (rows+1)×(cols+1) vertex displacement grid from low-freq fbm (so the field is smooth & coherent)
    const gw=cols+1, gh=rows+1;
    const ox=new Float32Array(gw*gh), oy=new Float32Array(gw*gh);
    for(let r=0;r<gh;r++)for(let col=0;col<gw;col++){
      const gi=r*gw+col;
      // sample two decorrelated fbm fields for x & y offsets (grid coords mapped into noise space)
      ox[gi]=(fbm(col*0.9+1.3, r*0.9+5.7)-0.5)*2*amp;
      oy[gi]=(fbm(col*0.9+40.2, r*0.9+11.1)-0.5)*2*amp;
      // pin the border vertices so the frame edge doesn't slide off-canvas
      if(r===0||r===gh-1||col===0||col===gw-1){ ox[gi]*=0.25; oy[gi]*=0.25; }
    }
    const cellW=W/cols, cellH=H/rows;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // which cell + local fractional position
      let gx=x/cellW, gy=y/cellH;
      let c0=gx|0, r0=gy|0;
      if(c0>=cols)c0=cols-1; if(r0>=rows)r0=rows-1;
      const fxL=gx-c0, fyL=gy-r0;
      // bilinear-interpolate the 4 surrounding vertex offsets
      const i00=r0*gw+c0, i10=r0*gw+c0+1, i01=(r0+1)*gw+c0, i11=(r0+1)*gw+c0+1;
      const dox=(ox[i00]*(1-fxL)+ox[i10]*fxL)*(1-fyL)+(ox[i01]*(1-fxL)+ox[i11]*fxL)*fyL;
      const doy=(oy[i00]*(1-fxL)+oy[i10]*fxL)*(1-fyL)+(oy[i01]*(1-fxL)+oy[i11]*fxL)*fyL;
      const sx=x-dox, sy=y-doy;                          // sample pulled back by the interpolated offset
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Transition ═══
// ══ Transition ▸ LePrince Grid Wipe ═══════════════════════════════════════════════════
  // Tile/checkerboard reveal: the frame is divided into a Rows×Cols grid; each cell fades to
  // alpha (destination-out) as Completion drops, but staggered by the cell's ORDER in the
  // chosen sequence (Sequential row-major / Center-out by ring distance / Random hash). Each
  // cell gets its own [start..start+window] slice of the wipe; Softness feathers the per-cell
  // alpha ramp. Completion 1 = nothing erased, 0 = every cell gone.
  R({
    field: 'fxW3grid', name: 'LePrince Grid Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxW3gridRows', label: 'Rows', min: 1, max: 40, step: 1, def: 8 },
      { kind: 'slider', sub: 'fxW3gridCols', label: 'Cols', min: 1, max: 40, step: 1, def: 12 },
      { kind: 'slider', sub: 'fxW3gridSoft', label: 'Softness', min: 0, max: 1, step: 0.01, def: 0.25 },
      { kind: 'seg', sub: 'fxW3gridOrder', label: 'Order', opts: ['Sequential', 'Center-out', 'Random'], def: 'Sequential' },
    ],
    match: [/^(?:CC |LePrince )Grid Wipe$/i],
    render(api, val) {
      const { lg, W, H, c, fr, pval, clamp, reset } = api;
      if (val >= 1) return;
      const rows = Math.max(1, Math.round(pval(c, 'fxW3gridRows', fr, 8)));
      const cols = Math.max(1, Math.round(pval(c, 'fxW3gridCols', fr, 12)));
      const soft = clamp(pval(c, 'fxW3gridSoft', fr, 0.25), 0, 1);
      const order = c.fxW3gridOrder || 'Sequential';
      const total = rows * cols;
      // per-cell normalised order rank in [0,1) → its wipe start time
      const rank = (col, row) => {
        if (order === 'Sequential') {
          return (row * cols + col) / total;
        } else if (order === 'Center-out') {
          // distance from grid centre, normalised by the max possible distance
          const cxg = (cols - 1) / 2, cyg = (rows - 1) / 2;
          const dx = (col - cxg), dy = (row - cyg);
          const dmax = Math.hypot(cxg, cyg) || 1;
          return Math.hypot(dx, dy) / dmax;        // 0 centre → 1 corners
        } else {
          // deterministic hash → stable pseudo-random rank per cell
          let h = (col * 73856093) ^ (row * 19349663);
          h = (h ^ (h >>> 13)) >>> 0;
          return (h % 100000) / 100000;
        }
      };
      // erased = how far the wipe has progressed (0..1). Each cell occupies a window so that
      // the LAST-ordered cell only fully clears at erased=1. window width = soft fraction of run.
      const erased = (1 - val);
      const win = Math.max(0.0001, soft);          // per-cell ramp length in progress units
      const cw = W / cols, ch = H / rows;
      reset(lg);
      lg.globalCompositeOperation = 'destination-out';
      lg.fillStyle = '#000';
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const start = rank(col, row) * (1 - win);   // cell's wipe-start in [0..1-win]
          // alpha removed = ramp from start..start+win
          const a = clamp((erased - start) / win, 0, 1);
          if (a <= 0) continue;
          lg.globalAlpha = a;
          // tiny overlap (+1px) avoids seams between cells
          lg.fillRect(Math.floor(col * cw), Math.floor(row * ch),
                      Math.ceil(cw) + 1, Math.ceil(ch) + 1);
        }
      }
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince Image Wipe ══════════════════════════════════════════════════
  // Gradient wipe driven by a procedural fbm luminance map (no second layer available, so the
  // "image" is generated). Erase pixels where map luminance < (1 - Completion) with a Softness
  // feather band → a true per-pixel gradient dissolve whose pattern follows the noise map.
  // Map Scale = noise feature size; Invert flips the dissolve order (bright-first vs dark-first).
  R({
    field: 'fxW3imgwipe', name: 'LePrince Image Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxW3imgwipeScale', label: 'Map Scale', min: 8, max: 240, step: 1, def: 80 },
      { kind: 'slider', sub: 'fxW3imgwipeSoft', label: 'Softness', min: 0.001, max: 0.6, step: 0.005, def: 0.14 },
      { kind: 'seg', sub: 'fxW3imgwipeInvert', label: 'Invert', opts: ['Normal', 'Invert'], def: 'Normal' },
    ],
    match: [/^(?:CC |LePrince )Image Wipe$/i],
    render(api, val) {
      const { lg, W, H, c, fr, fbm, pval, clamp, reset } = api;
      if (val >= 1) return;
      const scl = Math.max(8, pval(c, 'fxW3imgwipeScale', fr, 80));
      const soft = Math.max(0.001, pval(c, 'fxW3imgwipeSoft', fr, 0.14));
      const inv = (c.fxW3imgwipeInvert === 'Invert');
      const thr = (1 - val);                          // pixels with map < thr are erased
      reset(lg);
      const im = lg.getImageData(0, 0, W, H), d = im.data;
      // coarse fbm grid + bilinear interpolation (fast + smooth gradient)
      const gx = 100, gy = Math.max(2, Math.round(gx * H / W));
      const map = new Float32Array((gx + 1) * (gy + 1));
      for (let j = 0; j <= gy; j++) for (let i = 0; i <= gx; i++) {
        let m = fbm((i / gx * W) / scl, (j / gy * H) / scl);
        if (inv) m = 1 - m;
        map[j * (gx + 1) + i] = m;
      }
      const sampMap = (x, y) => {
        const fxp = x / W * gx, fyp = y / H * gy;
        const x0 = fxp | 0, y0 = fyp | 0, tx = fxp - x0, ty = fyp - y0;
        const x1 = x0 + 1 > gx ? gx : x0 + 1, y1 = y0 + 1 > gy ? gy : y0 + 1;
        const a = map[y0 * (gx + 1) + x0], b = map[y0 * (gx + 1) + x1];
        const cc = map[y1 * (gx + 1) + x0], dd = map[y1 * (gx + 1) + x1];
        const top = a + (b - a) * tx, bot = cc + (dd - cc) * tx;
        return top + (bot - top) * ty;
      };
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (d[i + 3] === 0) continue;
        const m = sampMap(x, y);
        // keep where map >= thr+soft, fully erase where map <= thr, feather between
        const a = clamp((m - thr) / soft, 0, 1);
        d[i + 3] = Math.round(d[i + 3] * a);
      }
      lg.putImageData(im, 0, 0);
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince Radial ScaleWipe ════════════════════════════════════════════
  // As Completion drops, the layer scales UP from a focus point (the image rushes toward the
  // viewer) while a circular clock/iris edge erases everything outside a shrinking aperture
  // about that point — the frame zooms out of existence radially. Center X/Y = focus point;
  // Softness = feather of the iris edge.
  R({
    field: 'fxW3radscale', name: 'LePrince Radial ScaleWipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'slider', sub: 'fxW3radscaleCX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'slider', sub: 'fxW3radscaleCY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'slider', sub: 'fxW3radscaleSoft', label: 'Softness', min: 0, max: 0.4, step: 0.005, def: 0.06 },
    ],
    match: [/^(?:CC |LePrince )Radial ScaleWipe$/i],
    render(api, val) {
      const { lg, sg, L, S, W, H, c, fr, pval, clamp, reset } = api;
      if (val >= 1) return;
      const fx = pval(c, 'fxW3radscaleCX', fr, 0.5) * W;
      const fy = pval(c, 'fxW3radscaleCY', fr, 0.5) * H;
      const soft = clamp(pval(c, 'fxW3radscaleSoft', fr, 0.06), 0, 0.4);
      // 1) snapshot the current layer into scratch S, then rebuild the layer scaled-up about the focus
      reset(sg); sg.clearRect(0, 0, W, H);
      sg.drawImage(L, 0, 0);                          // L = layer canvas snapshot
      const scale = 1 + (1 - val) * 1.6;              // up to 2.6× as it leaves
      reset(lg); lg.clearRect(0, 0, W, H);
      lg.save();
      lg.translate(fx, fy);
      lg.scale(scale, scale);
      lg.translate(-fx, -fy);
      lg.drawImage(S, 0, 0);
      lg.restore();
      reset(lg);
      // 2) radial iris erase about the focus: aperture radius shrinks with Completion.
      // furthest corner so val=1 would cover everything (no erase at val=1, handled by early-out)
      const maxR = Math.max(Math.hypot(fx, fy), Math.hypot(W - fx, fy),
                            Math.hypot(fx, H - fy), Math.hypot(W - fx, H - fy));
      const rad = val * maxR;
      const featPx = soft * maxR;
      reset(lg);
      lg.globalCompositeOperation = 'destination-out';
      if (featPx > 0.6) {
        // feathered ring: opaque (erase) outside rad, transparent (keep) inside rad-feat
        const g = lg.createRadialGradient(fx, fy, Math.max(0, rad - featPx), fx, fy, rad + featPx);
        g.addColorStop(0, 'rgba(0,0,0,0)');           // keep centre
        g.addColorStop(1, 'rgba(0,0,0,1)');           // erase outside
        lg.fillStyle = g;
        lg.fillRect(0, 0, W, H);
      } else {
        // hard iris: full-frame rect MINUS the aperture disc (even-odd) → erase the outside
        lg.fillStyle = '#000';
        lg.beginPath();
        lg.rect(0, 0, W, H);
        lg.moveTo(fx + rad, fy);
        lg.arc(fx, fy, rad, 0, Math.PI * 2);
        lg.closePath();
        lg.fill('evenodd');
      }
      reset(lg);
    },
  });

  // ══ Transition ▸ LePrince Scale Wipe ══════════════════════════════════════════════════
  // The layer scales / stretches off-frame as it transitions out: drawImage with a growing scale
  // (plus an optional directional skew in the chosen Direction) anchored at Center, while the whole
  // layer's alpha ramps to 0 with Completion. Direction biases the stretch + drift; Center is the
  // anchor the scale grows from. Completion 1 = untouched, 0 = scaled away to nothing.
  R({
    field: 'fxW3scale', name: 'LePrince Scale Wipe', cat: 'Transition', color: '#C7905B',
    def: 1, applyVal: 1, paramLabel: 'Completion', range: [0, 1, 0.01],
    extra: [
      { kind: 'seg', sub: 'fxW3scaleDir', label: 'Direction', opts: ['Both', 'Horizontal', 'Vertical', 'Left', 'Right', 'Up', 'Down'], def: 'Both' },
      { kind: 'slider', sub: 'fxW3scaleCX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'slider', sub: 'fxW3scaleCY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
    ],
    match: [/^(?:CC |LePrince )Scale Wipe$/i],
    render(api, val) {
      const { lg, sg, S, L, W, H, c, fr, pval, reset } = api;
      if (val >= 1) return;
      const dir = c.fxW3scaleDir || 'Both';
      const ax = pval(c, 'fxW3scaleCX', fr, 0.5) * W;
      const ay = pval(c, 'fxW3scaleCY', fr, 0.5) * H;
      const t = (1 - val);                            // 0..1 progress out
      const grow = 1 + t * 2.2;                       // common growth factor (up to 3.2×)
      // per-direction scale on each axis
      let sxk = 1, syk = 1, dx = 0, dy = 0;
      const drift = t * Math.max(W, H) * 0.5;
      switch (dir) {
        case 'Horizontal': sxk = grow; break;
        case 'Vertical':   syk = grow; break;
        case 'Left':       sxk = grow; dx = -drift; break;
        case 'Right':      sxk = grow; dx =  drift; break;
        case 'Up':         syk = grow; dy = -drift; break;
        case 'Down':       syk = grow; dy =  drift; break;
        default:           sxk = grow; syk = grow;   // Both
      }
      // 1) snapshot layer → scratch S
      reset(sg); sg.clearRect(0, 0, W, H);
      sg.drawImage(L, 0, 0);
      // 2) redraw layer scaled about the anchor + directional drift, alpha-ramped by Completion
      reset(lg); lg.clearRect(0, 0, W, H);
      lg.save();
      lg.globalAlpha = val;                           // whole layer fades out as it scales away
      lg.translate(ax + dx, ay + dy);
      lg.scale(sxk, syk);
      lg.translate(-ax, -ay);
      lg.drawImage(S, 0, 0);
      lg.restore();
      reset(lg);
    },
  });


// ═══ Obsolete + Text + Stylize ═══
// ════════════════ Obsolete ▸ Basic 3D — pseudo-3D swivel/tilt of the flat layer ════════════════
// Rotate the plane about Y (swivel) and X (tilt) at a viewing Distance, then INVERSE-resample:
// for each output pixel, ray-cast back through the perspective camera onto the rotated plane to
// find its source uv. A moving specular hot-spot is added with a radial 'lighter' gradient.
R({
  field:'fxW33d', name:'Basic 3D', cat:'Obsolete', color:'#8A8F9A',
  def:0, applyVal:30, paramLabel:'Swivel', range:[-180,180,1],
  extra:[
    {kind:'slider',sub:'fxW33dTilt',label:'Tilt',min:-90,max:90,step:1,def:0},
    {kind:'slider',sub:'fxW33dDist',label:'Distance',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW33dSpec',label:'Specular',min:0,max:1,step:0.01,def:0},
    {kind:'swatch',sub:'fxW33dSpecColor',def:'#ffffff',label:'Specular Color'}
  ],
  match:[/^Basic 3D$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,f,pval,hex2rgb,reset,clamp}=api;
    const sw=val*Math.PI/180, ti=pval(c,'fxW33dTilt',fr,0)*Math.PI/180;
    const dist=clamp(pval(c,'fxW33dDist',fr,0.5),0,1);
    const spec=clamp(pval(c,'fxW33dSpec',fr,0),0,1);
    // camera focal length: more Distance pushes the plane back (less perspective foreshortening)
    const foc=Math.min(W,H)*(0.9+dist*2.4);
    const cy=Math.cos(sw),sy_=Math.sin(sw), cx=Math.cos(ti),sx_=Math.sin(ti);
    // plane basis after rotating the XY plane about Y then X (column vectors of R applied to unit axes)
    const ux=cy,            uy=0,    uz=-sy_;                 // R*(1,0,0)
    const vx=sy_*sx_,       vy=cx,   vz=cy*sx_;               // R*(0,1,0)
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const hw=W/2,hh=H/2;
    // plane sits at camera-space z = foc (so a flat plane maps 1:1 when un-rotated)
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // ray dir through pixel (pinhole): (px,py,foc)
      const px=x-hw, py=y-hh, pz=foc;
      // plane: point P0 = (0,0,foc) along normal n = u × v.  Solve t for ray·n = P0·n.
      // normal n = u × v
      const Nx=uy*vz-uz*vy, Ny=uz*vx-ux*vz, Nz=ux*vy-uy*vx;
      const denom=px*Nx+py*Ny+pz*Nz;
      let sxs,sys;
      if(Math.abs(denom)<1e-6){ sxs=x; sys=y; }
      else{
        const t=(foc*Nz)/denom;          // P0·N = foc*Nz (P0=(0,0,foc))
        const Px=px*t, Py=py*t, Pz=pz*t; // hit point in camera space
        // local plane coords: project (P - P0) onto u,v  (u,v are orthonormal)
        const dxh=Px-0, dyh=Py-0, dzh=Pz-foc;
        const uu=dxh*ux+dyh*uy+dzh*uz;
        const vv=dxh*vx+dyh*vy+dzh*vz;
        sxs=hw+uu; sys=hh+vv;
        if(t<=0||sxs<-2||sxs>W+1||sys<-2||sys>H+1){ d[i+3]=0; continue; }
      }
      d[i]=samp(sxs,sys,0);d[i+1]=samp(sxs,sys,1);d[i+2]=samp(sxs,sys,2);d[i+3]=samp(sxs,sys,3);
    }
    lg.putImageData(im,0,0);
    // moving specular highlight (drifts with swivel + slowly over time), additive
    if(spec>0.001){
      const col=hex2rgb(c.fxW33dSpecColor||'#ffffff');
      const hx=hw + Math.sin(sw)*W*0.35 + Math.sin(f*0.05)*W*0.04;
      const hy=hh - Math.sin(ti)*H*0.30;
      const rad=Math.min(W,H)*(0.18+0.22*spec);
      reset(sg);sg.clearRect(0,0,W,H);
      const g=sg.createRadialGradient(hx,hy,0,hx,hy,rad);
      g.addColorStop(0,`rgba(${col[0]},${col[1]},${col[2]},${0.85*spec})`);
      g.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
      sg.fillStyle=g; sg.beginPath(); sg.arc(hx,hy,rad,0,Math.PI*2); sg.fill();
      reset(sg);
      reset(lg); lg.globalCompositeOperation='lighter'; lg.globalAlpha=1; lg.drawImage(S,0,0); reset(lg);
    }
  }
});

// ════════════════ Obsolete ▸ Lightning — procedural midpoint-displacement bolt ════════════════
// Recursive midpoint displacement between Origin and Direction endpoint, random forks, additive
// 'lighter' outer glow + a bright white-hot core.  Seed (+ absolute frame f) reseeds per frame.
R({
  field:'fxW3ltg', name:'Lightning', cat:'Obsolete', color:'#8A8F9A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3ltgOX',label:'Origin X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3ltgOY',label:'Origin Y',min:0,max:1,step:0.01,def:0.0},
    {kind:'slider',sub:'fxW3ltgDir',label:'Direction',min:0,max:360,step:1,def:90},
    {kind:'slider',sub:'fxW3ltgSeg',label:'Segments',min:3,max:9,step:1,def:7},
    {kind:'slider',sub:'fxW3ltgAmp',label:'Amplitude',min:0,max:1,step:0.01,def:0.4},
    {kind:'slider',sub:'fxW3ltgGlow',label:'Glow',min:0,max:1,step:0.01,def:0.6},
    {kind:'slider',sub:'fxW3ltgSeed',label:'Seed',min:0,max:200,step:1,def:0},
    {kind:'swatch',sub:'fxW3ltgColor',def:'#bcd8ff',label:'Color'}
  ],
  match:[/^Lightning$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,f,pval,reset,clamp}=api;
    const mn=Math.min(W,H);
    const ox=pval(c,'fxW3ltgOX',fr,0.5)*W, oy=pval(c,'fxW3ltgOY',fr,0.0)*H;
    const dir=pval(c,'fxW3ltgDir',fr,90)*Math.PI/180;
    const depth=Math.max(3,Math.round(pval(c,'fxW3ltgSeg',fr,7)));
    const amp=clamp(pval(c,'fxW3ltgAmp',fr,0.4),0,1);
    const glow=clamp(pval(c,'fxW3ltgGlow',fr,0.6),0,1);
    const seed=Math.round(pval(c,'fxW3ltgSeed',fr,0));
    const col=c.fxW3ltgColor||'#bcd8ff';
    // mulberry32 PRNG — Seed + absolute frame f reseed the jitter each frame (animated crackle)
    let st=(seed*2654435761 + (f+1)*40503)>>>0;
    const rnd=()=>{st|=0;st=(st+0x6D2B79F5)|0;let t=Math.imul(st^(st>>>15),1|st);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};
    const len=mn*0.9;
    const ex=ox+Math.cos(dir)*len, ey=oy+Math.sin(dir)*len;
    const segs=[];
    function bolt(x1,y1,x2,y2,disp,dp,width){
      if(dp<=0||disp<1.0){segs.push({pts:[[x1,y1],[x2,y2]],w:width});return;}
      const mx=(x1+x2)/2,my=(y1+y2)/2;
      const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1;
      const nx=-dy/L, ny=dx/L;
      const off=(rnd()-0.5)*2*disp;
      const jx=mx+nx*off, jy=my+ny*off;
      bolt(x1,y1,jx,jy,disp*0.55,dp-1,width);
      bolt(jx,jy,x2,y2,disp*0.55,dp-1,width);
      // decaying fork
      if(rnd()<0.35 && dp>1){
        const ba=Math.atan2(jy-y1,jx-x1)+(rnd()-0.5)*1.0;
        const blen=L*(0.4+rnd()*0.5);
        bolt(jx,jy, jx+Math.cos(ba)*blen, jy+Math.sin(ba)*blen, disp*0.6, dp-1, width*0.5);
      }
    }
    const disp0=mn*0.22*amp;
    bolt(ox,oy,ex,ey,disp0,depth,Math.max(1.2,mn*0.006));
    reset(sg);sg.clearRect(0,0,W,H);
    sg.lineCap='round';sg.lineJoin='round';sg.globalCompositeOperation='lighter';
    if(glow>0.001){
      sg.strokeStyle=col;sg.shadowColor=col;
      for(const s of segs){
        sg.shadowBlur=Math.max(2,glow*mn*0.05);
        sg.lineWidth=s.w*(2.2+glow*4);sg.globalAlpha=0.16+0.26*glow;
        sg.beginPath();const p=s.pts;sg.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)sg.lineTo(p[i][0],p[i][1]);sg.stroke();
      }
    }
    sg.shadowBlur=0;sg.globalAlpha=1;sg.strokeStyle='#ffffff';
    for(const s of segs){
      sg.lineWidth=s.w;sg.beginPath();const p=s.pts;
      sg.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)sg.lineTo(p[i][0],p[i][1]);sg.stroke();
    }
    reset(sg);
    reset(lg);lg.globalAlpha=val;lg.globalCompositeOperation='lighter';lg.drawImage(S,0,0);reset(lg);
  }
});

// ════════════════ Text ▸ Path Text — lay glyphs along a sine path ════════════════
// No mask-path input exists, so the baseline is a procedural sine wave across the frame. Each glyph
// is advanced by its OWN measured width, then translated to the path point and rotated to the local
// tangent before fillText.  String = the clip's Title text (c.text); falls back to a sample.
R({
  field:'fxW3ptext', name:'Path Text', cat:'Text', color:'#C9C24A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3ptextSize',label:'Size',min:8,max:240,step:1,def:64},
    {kind:'slider',sub:'fxW3ptextAmp',label:'Path Amplitude',min:0,max:1,step:0.01,def:0.25},
    {kind:'slider',sub:'fxW3ptextWave',label:'Waves',min:0.25,max:6,step:0.25,def:1},
    {kind:'slider',sub:'fxW3ptextMargin',label:'Margin',min:0,max:1,step:0.01,def:0.05},
    {kind:'swatch',sub:'fxW3ptextColor',def:'#ffffff',label:'Color'}
  ],
  match:[/^Path Text$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,pval,reset,clamp}=api;
    const str=(c.text!=null && String(c.text).length)?String(c.text):'LePrince Path Text';
    const size=Math.max(8,pval(c,'fxW3ptextSize',fr,64));
    const amp=clamp(pval(c,'fxW3ptextAmp',fr,0.25),0,1)*H*0.5;
    const waves=Math.max(0.25,pval(c,'fxW3ptextWave',fr,1));
    const margin=clamp(pval(c,'fxW3ptextMargin',fr,0.05),0,0.45);
    const col=c.fxW3ptextColor||'#ffffff';
    reset(sg);sg.clearRect(0,0,W,H);
    sg.font=`600 ${size}px system-ui, Arial, sans-serif`;
    sg.fillStyle=col;sg.textBaseline='middle';sg.textAlign='left';
    const x0=W*margin, x1=W*(1-margin), baseY=H*0.5;
    // path point + tangent for a given pixel-x along a sine baseline
    const k=(waves*2*Math.PI)/(x1-x0||1);
    const py=(px)=> baseY + amp*Math.sin((px-x0)*k);
    const slope=(px)=> amp*k*Math.cos((px-x0)*k); // dy/dx
    let cur=x0;
    for(const ch of str){
      const w=sg.measureText(ch).width;
      if(cur>x1) break;
      const cx=cur+w/2;             // glyph centre along the path
      const gy=py(cx);
      const ang=Math.atan(slope(cx)); // tangent angle of the path
      sg.save();
      sg.translate(cx,gy);
      sg.rotate(ang);
      sg.fillText(ch,-w/2,0);
      sg.restore();
      cur+=w;
    }
    reset(sg);
    reset(lg);lg.globalAlpha=val;lg.drawImage(S,0,0);reset(lg);
  }
});

// ════════════════ Obsolete ▸ Reduce Interlace Flicker — vertical-only averaging blur ════════════
// Averages each pixel with its vertical neighbours (a 1px-wide vertical box kernel), smoothing the
// scanline-to-scanline flicker of interlaced footage. Softness = kernel radius in lines.
R({
  field:'fxW3rif', name:'Reduce Interlace Flicker', cat:'Obsolete', color:'#8A8F9A',
  def:0, applyVal:1, paramLabel:'Softness', range:[0,8,0.1],
  extra:[],
  match:[/^Reduce Interlace Flicker$/i],
  render(api,val){
    const {lg,W,H}=api;
    const rad=Math.max(1,Math.round(val));
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const n=rad*2+1;
    for(let x=0;x<W;x++)for(let y=0;y<H;y++){
      let r=0,g=0,b=0,a=0;
      for(let dy=-rad;dy<=rad;dy++){
        let yy=y+dy; if(yy<0)yy=0; else if(yy>H-1)yy=H-1; // clamp at top/bottom
        const j=(yy*W+x)*4;
        r+=s[j];g+=s[j+1];b+=s[j+2];a+=s[j+3];
      }
      const i=(y*W+x)*4;
      d[i]=r/n;d[i+1]=g/n;d[i+2]=b/n;d[i+3]=a/n;
    }
    lg.putImageData(im,0,0);
  }
});

// ════════════════ Text ▸ Numbers — procedurally formatted number via fillText ════════════════
// The animatable main value drives the number. Type seg picks Number/Hex/Date/Timecode formatting;
// Decimals + Commas control Number formatting. Position/Size/Color via sub-params.
R({
  field:'fxW3num', name:'Numbers', cat:'Text', color:'#C9C24A',
  def:0, applyVal:1000, paramLabel:'Value', range:[-1e6,1e6,1],
  extra:[
    {kind:'seg',sub:'fxW3numType',label:'Type',opts:['Number','Timecode','Hex','Date'],def:'Number'},
    {kind:'slider',sub:'fxW3numDec',label:'Decimals',min:0,max:6,step:1,def:0},
    {kind:'seg',sub:'fxW3numCommas',label:'Commas',opts:['off','on'],def:'on'},
    {kind:'slider',sub:'fxW3numSize',label:'Size',min:8,max:240,step:1,def:72},
    {kind:'slider',sub:'fxW3numX',label:'Pos X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3numY',label:'Pos Y',min:0,max:1,step:0.01,def:0.5},
    {kind:'seg',sub:'fxW3numAlign',label:'Align',opts:['left','center','right'],def:'center'},
    {kind:'swatch',sub:'fxW3numColor',def:'#ffffff',label:'Fill'}
  ],
  match:[/^Numbers$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,project,pval,reset,clamp}=api;
    const type=c.fxW3numType||'Number';
    const dec=Math.max(0,Math.round(pval(c,'fxW3numDec',fr,0)));
    const commas=(c.fxW3numCommas||'on')==='on';
    const size=Math.max(8,pval(c,'fxW3numSize',fr,72));
    const px=clamp(pval(c,'fxW3numX',fr,0.5),0,1)*W, py=clamp(pval(c,'fxW3numY',fr,0.5),0,1)*H;
    const align=c.fxW3numAlign||'center';
    const col=c.fxW3numColor||'#ffffff';
    let txt;
    if(type==='Hex'){
      txt='0x'+Math.round(val).toString(16).toUpperCase();
    }else if(type==='Timecode'){
      const fps=(project&&project.fps)||24;
      const total=Math.max(0,Math.round(val));
      const ff=total%fps, ss=Math.floor(total/fps)%60, mm=Math.floor(total/(fps*60))%60, hh=Math.floor(total/(fps*3600));
      const p2=(x)=>String(x).padStart(2,'0');
      txt=`${p2(hh)}:${p2(mm)}:${p2(ss)}:${p2(ff)}`;
    }else if(type==='Date'){
      // value = days since the Unix epoch → calendar date
      const dt=new Date(Math.round(val)*86400000);
      const p2=(x)=>String(x).padStart(2,'0');
      txt=`${dt.getUTCFullYear()}-${p2(dt.getUTCMonth()+1)}-${p2(dt.getUTCDate())}`;
    }else{
      let n=val.toFixed(dec);
      if(commas){
        const neg=n[0]==='-'; if(neg)n=n.slice(1);
        const parts=n.split('.');
        parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
        n=(neg?'-':'')+parts.join('.');
      }
      txt=n;
    }
    reset(sg);sg.clearRect(0,0,W,H);
    sg.font=`600 ${size}px system-ui, Arial, sans-serif`;
    sg.fillStyle=col;sg.textBaseline='middle';sg.textAlign=align;
    sg.fillText(txt,px,py);
    reset(sg);
    reset(lg);lg.globalAlpha=1;lg.drawImage(S,0,0);reset(lg); // Numbers always draws fully opaque (val is the number, not opacity)
  }
});

// ════════════════ Text ▸ Timecode — HH:MM:SS:FF from the current frame ════════════════
// Reads the absolute frame f and project fps, formats SMPTE-style timecode (with an optional Time
// offset in frames) and draws it, optionally over a filled box background.
R({
  field:'fxW3tc', name:'Timecode', cat:'Text', color:'#C9C24A',
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxW3tcFormat',label:'Format',opts:['HH:MM:SS:FF','MM:SS:FF','Frames'],def:'HH:MM:SS:FF'},
    {kind:'slider',sub:'fxW3tcOffset',label:'Offset (f)',min:-100000,max:100000,step:1,def:0},
    {kind:'seg',sub:'fxW3tcBox',label:'Box',opts:['off','on'],def:'on'},
    {kind:'slider',sub:'fxW3tcSize',label:'Size',min:8,max:200,step:1,def:48},
    {kind:'slider',sub:'fxW3tcX',label:'Pos X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3tcY',label:'Pos Y',min:0,max:1,step:0.01,def:0.92},
    {kind:'swatch',sub:'fxW3tcColor',def:'#ffffff',label:'Color'}
  ],
  match:[/^Timecode$/i],
  render(api,val){
    const {lg,sg,S,W,H,c,fr,f,project,pval,reset,clamp}=api;
    const fps=Math.max(1,Math.round((project&&project.fps)||24));
    const off=Math.round(pval(c,'fxW3tcOffset',fr,0));
    let total=f+off; if(total<0)total=0;
    const fmt=c.fxW3tcFormat||'HH:MM:SS:FF';
    const box=(c.fxW3tcBox||'on')==='on';
    const size=Math.max(8,pval(c,'fxW3tcSize',fr,48));
    const px=clamp(pval(c,'fxW3tcX',fr,0.5),0,1)*W, py=clamp(pval(c,'fxW3tcY',fr,0.92),0,1)*H;
    const col=c.fxW3tcColor||'#ffffff';
    const p2=(x)=>String(x).padStart(2,'0');
    const ff=total%fps, ss=Math.floor(total/fps)%60, mm=Math.floor(total/(fps*60))%60, hh=Math.floor(total/(fps*3600));
    let txt;
    if(fmt==='Frames') txt=String(total);
    else if(fmt==='MM:SS:FF') txt=`${p2(Math.floor(total/(fps*60)))}:${p2(ss)}:${p2(ff)}`;
    else txt=`${p2(hh)}:${p2(mm)}:${p2(ss)}:${p2(ff)}`;
    reset(sg);sg.clearRect(0,0,W,H);
    sg.font=`700 ${size}px ui-monospace, "Courier New", monospace`;
    sg.textBaseline='middle';sg.textAlign='center';
    const m=sg.measureText(txt), tw=m.width, padX=size*0.4, padY=size*0.28;
    if(box){
      sg.fillStyle='rgba(0,0,0,0.6)';
      sg.fillRect(px-tw/2-padX, py-size/2-padY, tw+padX*2, size+padY*2);
    }
    sg.fillStyle=col;
    sg.fillText(txt,px,py);
    reset(sg);
    reset(lg);lg.globalAlpha=val;lg.drawImage(S,0,0);reset(lg);
  }
});

// ════════════════ Stylize ▸ LePrince Kaleida — radial wedge-mirror kaleidoscope ════════════════
// Fold each output pixel's atan2 angle into N mirrored wedges (triangle-wave fold) + a Spin offset,
// then inverse-sample the source at the folded angle / same radius. Center is adjustable.
R({
  field:'fxW3kal', name:'LePrince Kaleida', cat:'Stylize', color:'#D9A441',
  def:0, applyVal:6, paramLabel:'Sides', range:[1,24,1],
  extra:[
    {kind:'slider',sub:'fxW3kalSpin',label:'Spin',min:0,max:360,step:1,def:0},
    {kind:'slider',sub:'fxW3kalCX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3kalCY',label:'Center Y',min:0,max:1,step:0.01,def:0.5}
  ],
  match:[/^(?:CC |LePrince )Kaleida$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const sides=Math.max(1,Math.round(val));
    const spin=pval(c,'fxW3kalSpin',fr,0)*Math.PI/180;
    const cx=pval(c,'fxW3kalCX',fr,0.5)*W, cy=pval(c,'fxW3kalCY',fr,0.5)*H;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const seg=Math.PI/sides;          // half-wedge: mirror every `seg` radians
    const TWO=Math.PI*2;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      const dx=x-cx, dy=y-cy;
      const r=Math.hypot(dx,dy);
      let a=Math.atan2(dy,dx)-spin;
      // wrap to [0, 2*seg) then triangle-fold to [0, seg] → mirrored wedge
      a=((a%TWO)+TWO)%TWO;
      let m=a%(2*seg);
      if(m>seg) m=2*seg-m;           // mirror the second half of each wedge
      m+=spin;
      const sx=cx+Math.cos(m)*r, sy=cy+Math.sin(m)*r;
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Keying + Channel ═══
// ════════════════ WAVE 3 — Keying + Channel group ════════════════

// ── Keying ▸ Simple Wire Removal — two endpoints + thickness define a band; replace band pixels by interpolating the perpendicular neighbours across the wire ──
R({
  field:'fxW3wire', name:'Simple Wire Removal', cat:'Keying', color:'#C56B6B',
  def:0, applyVal:1, paramLabel:'Blend', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3wireAX',label:'Point A X',min:0,max:1,step:0.005,def:0.2},
    {kind:'slider',sub:'fxW3wireAY',label:'Point A Y',min:0,max:1,step:0.005,def:0.5},
    {kind:'slider',sub:'fxW3wireBX',label:'Point B X',min:0,max:1,step:0.005,def:0.8},
    {kind:'slider',sub:'fxW3wireBY',label:'Point B Y',min:0,max:1,step:0.005,def:0.5},
    {kind:'slider',sub:'fxW3wireThick',label:'Thickness',min:1,max:40,step:1,def:6}
  ],
  match:[/^(?:CC |LePrince )Simple Wire Removal$/i],
  render(api,val){
    const {lg,W,H,c,fr,k,pval,clamp}=api;
    const ax=pval(c,'fxW3wireAX',fr,0.2)*(W-1), ay=pval(c,'fxW3wireAY',fr,0.5)*(H-1);
    const bx=pval(c,'fxW3wireBX',fr,0.8)*(W-1), by=pval(c,'fxW3wireBY',fr,0.5)*(H-1);
    const thick=Math.max(1,pval(c,'fxW3wireThick',fr,6)*(k||1)); // half-band in px
    let vx=bx-ax, vy=by-ay; const len=Math.hypot(vx,vy)||1; vx/=len; vy/=len; // unit along wire
    const px=-vy, py=vx; // unit perpendicular to wire
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const samp=mkSamp(s,W,H);
    const bilin=(fx,fy,o)=>{ // bilinear sample of the ORIGINAL buffer
      const x0=fx<0?0:fx>W-1?W-1:fx|0, y0=fy<0?0:fy>H-1?H-1:fy|0;
      const x1=x0+1>W-1?W-1:x0+1, y1=y0+1>H-1?H-1:y0+1;
      const tx=fx-(fx|0), ty=fy-(fy|0);
      const a=samp(x0,y0,o),b2=samp(x1,y0,o),cc=samp(x0,y1,o),dd=samp(x1,y1,o);
      return a+(b2-a)*tx+(cc-a)*ty+(a-b2-cc+dd)*tx*ty;
    };
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      // signed perpendicular distance to the (infinite) wire line, and projection along it
      const wx=x-ax, wy=y-ay;
      const along=wx*vx+wy*vy;               // 0..len within the segment
      if(along< -thick || along> len+thick) continue; // outside the segment span
      const perp=wx*px+wy*py;                // signed distance off the wire axis
      if(Math.abs(perp)>thick) continue;     // outside the wire band → leave pixel
      const i=(y*W+x)*4;
      // sample healthy pixels just OUTSIDE the band on each perpendicular side, then
      // linearly interpolate between them across the wire (the real wire-removal fill)
      const off=thick+1.5;
      const upX=x+px*(off-perp), upY=y+py*(off-perp);   // outside on +perp side
      const dnX=x-px*(off+perp), dnY=y-py*(off+perp);   // outside on -perp side
      const t=(perp+thick)/(2*thick);                   // 0 at -side edge, 1 at +side edge
      for(let o=0;o<4;o++){
        const a=bilin(dnX,dnY,o), b2=bilin(upX,upY,o);
        const fill=a+(b2-a)*t;
        d[i+o]=clamp(s[i+o]+(fill-s[i+o])*val,0,255);
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Keying ▸ Key Cleaner — post-key alpha cleanup: close holes (dilate→erode), edge-choke blur on the matte, plus edge despill on RGB ──
R({
  field:'fxW3keyclean', name:'Key Cleaner', cat:'Keying', color:'#C56B6B',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3kcChoke',label:'Edge Choke',min:-8,max:8,step:1,def:1},
    {kind:'slider',sub:'fxW3kcSoften',label:'Soften',min:0,max:10,step:1,def:2},
    {kind:'slider',sub:'fxW3kcDespill',label:'Despill',min:0,max:1,step:0.01,def:0.5}
  ],
  match:[/^Key Cleaner$/i],
  render(api,val){
    const {lg,W,H,c,fr,k,pval,morphMatte,blurMatte,clamp}=api;
    const choke=Math.round(pval(c,'fxW3kcChoke',fr,1)*(k||1));
    const soft=Math.max(0,Math.round(pval(c,'fxW3kcSoften',fr,2)*(k||1)));
    const despill=clamp(pval(c,'fxW3kcDespill',fr,0.5),0,1);
    const im=lg.getImageData(0,0,W,H),d=im.data,N=W*H;
    // ── matte cleanup on the existing alpha ──
    let M=new Float32Array(N);
    for(let j=0,i=0;j<N;j++,i+=4)M[j]=d[i+3]/255;
    // close interior holes: dilate then erode by 1 (morphological close)
    M=morphMatte(M,W,H,1); M=morphMatte(M,W,H,-1);
    // edge choke: + erodes (shrinks the matte to bite into fringe), − spreads
    if(choke!==0) M=morphMatte(M,W,H,-choke);
    // soften the matte edge
    if(soft>=1) M=blurMatte(M,W,H,soft);
    // ── edge despill: at semi-transparent edge pixels, pull the dominant chroma toward luma ──
    if(despill>0){
      for(let j=0,i=0;j<N;j++,i+=4){
        const a=M[j];
        if(a<=0.02||a>=0.98) continue; // only the soft edge band
        const r=d[i],g=d[i+1],b=d[i+2];
        const lum=0.2126*r+0.7152*g+0.0722*b;
        // identify the dominant (likely-screen) channel and bleed it back to luma
        const w=despill*(1-Math.abs(a-0.5)*2); // strongest mid-edge, fades to 0 at a→0/1
        let nr=r,ng=g,nb=b;
        if(g>=r&&g>=b){ ng=g+(Math.min(lum,(r+b)*0.5)-g)*w; }       // green screen
        else if(b>=r&&b>=g){ nb=b+(Math.min(lum,(r+g)*0.5)-b)*w; }  // blue screen
        else { nr=r+(Math.min(lum,(g+b)*0.5)-r)*w; }                // red screen
        d[i]  =clamp(r+(nr-r)*val,0,255);
        d[i+1]=clamp(g+(ng-g)*val,0,255);
        d[i+2]=clamp(b+(nb-b)*val,0,255);
      }
    }
    // write the cleaned alpha back, blended by Amount
    for(let j=0,i=0;j<N;j++,i+=4){
      const na=Math.round(M[j]*255);
      d[i+3]=clamp(d[i+3]+(na-d[i+3])*val,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Channel ▸ Remove Color Matting — unmultiply premultiplied edges against a background colour: newRGB=(RGB − bg·(1−α))/α ──
R({
  field:'fxW3unmult', name:'Remove Color Matting', cat:'Channel', color:'#7C8CA6',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  colorSubs:['fxW3unmultBg'],
  match:[/^Remove Color Matting$/i],
  render(api,val){
    const {lg,W,H,c,hex2rgb,clamp}=api;
    const bg=hex2rgb(c.fxW3unmultBg||'#000000'); // the matte/background colour edges were premultiplied against
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let i=0;i<d.length;i+=4){
      const a=d[i+3]/255;
      if(a<=0||a>=1) continue;           // only partially-transparent (premultiplied) edge pixels
      const inv=1-a;
      for(let o=0;o<3;o++){
        const v=(d[i+o]-bg[o]*inv)/a;     // unmultiply: recover the straight (un-premultiplied) colour
        const nv=clamp(v,0,255);
        d[i+o]=clamp(d[i+o]+(nv-d[i+o])*val,0,255);
      }
    }
    lg.putImageData(im,0,0);
  }
});


// ═══ Immersive VR ═══
// ════════════════ WAVE 3 (Immersive VR — equirectangular seam-wrapped) ════════════════
// All effects WRAP the horizontal (longitude) seam: x samples are taken modulo W so blocks/
// blur/noise/offsets never tear at the 360° equirect edge; latitude (y) clamps at the poles.

// ── Immersive VR ▸ VR Digital Glitch — RGB channel-shift + block displace + scanline corruption, longitude-wrapped ──
R({
  field:'fxW3vrglitch', name:'VR Digital Glitch', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrglitchBlock',label:'Block Size',min:2,max:128,step:1,def:32},
    {kind:'slider',sub:'fxW3vrglitchSeed',label:'Seed',min:0,max:200,step:1,def:0}
  ],
  match:[/^VR Digital Glitch$/],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const block=Math.max(2,Math.round(pval(c,'fxW3vrglitchBlock',fr,32)));
    const seed=Math.round(pval(c,'fxW3vrglitchSeed',fr,0));
    const amt=val;
    // deterministic PRNG (mulberry32), reseeded per frame so the glitch animates
    let st=(seed*2654435761 + (fr+1)*40503)>>>0;
    const rnd=()=>{st|=0;st=(st+0x6D2B79F5)|0;let t=Math.imul(st^(st>>>15),1|st);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    // seam-wrapped sampler: x wraps modulo W (longitude), y clamps (latitude/poles)
    const wrap=(sx,sy,o)=>{let xi=sx|0;xi=((xi%W)+W)%W;let yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    // per-block-row horizontal displacement (wrapped), plus a channel-shift magnitude
    const rows=Math.ceil(H/block);
    const rowShift=new Int32Array(rows), rowChan=new Float32Array(rows);
    for(let r=0;r<rows;r++){
      // only some block-rows are corrupted
      if(rnd()<0.55*amt){ rowShift[r]=Math.round((rnd()-0.5)*2*amt*W*0.25); rowChan[r]=rnd(); }
      else { rowShift[r]=0; rowChan[r]=0; }
    }
    const maxChan=amt*W*0.04; // RGB channel separation in px (wrapped)
    for(let y=0;y<H;y++){
      const r=(y/block)|0;
      const sh=rowShift[r];
      const chan=rowChan[r]*maxChan;
      // scanline corruption: every few lines on a corrupted row drop to a hard offset / darken
      const scan=(rowShift[r]!==0 && (y&3)===0)?1:0;
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        const bx=x+sh;
        // RGB channel-shift: R pulled left, B pushed right (all wrapped at the seam)
        const rR=wrap(bx-chan,y,0);
        const gG=wrap(bx,y,1);
        const bB=wrap(bx+chan,y,2);
        const aA=wrap(bx,y,3);
        if(scan){ d[i]=clamp(rR*0.4,0,255); d[i+1]=clamp(gG*0.4,0,255); d[i+2]=clamp(bB*1.3,0,255); }
        else { d[i]=rR; d[i+1]=gG; d[i+2]=bB; }
        d[i+3]=aA;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Blur — separable box blur, longitude-wrapped + latitude-scaled radius ──
R({
  field:'fxW3vrblur', name:'VR Blur', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.4, paramLabel:'Radius', range:[0,1,0.01],
  extra:[],
  match:[/^VR Blur$/],
  render(api,val){
    const {lg,W,H}=api;
    const baseR=Math.max(0,Math.round(val*Math.min(W,H)*0.06));
    if(baseR<1)return;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    const src=new Float32Array(W*H*4);
    for(let i=0;i<d.length;i++)src[i]=d[i];
    const tmp=new Float32Array(W*H*4);
    // latitude radius scale: poles (|cos lat| small) get a wider blur to mimic equirect oversampling
    const latScale=new Float32Array(H);
    for(let y=0;y<H;y++){
      const lat=((y+0.5)/H-0.5)*Math.PI;           // -PI/2..PI/2
      const cl=Math.max(0.12,Math.abs(Math.cos(lat)));
      latScale[y]=1/cl;                            // 1 at equator → larger toward poles
    }
    // horizontal pass — WRAPPED at the longitude seam, radius scaled by latitude
    for(let y=0;y<H;y++){
      let rad=Math.round(baseR*latScale[y]); if(rad<1)rad=1; if(rad>W>>1)rad=W>>1;
      const inv=1/(2*rad+1);
      for(let x=0;x<W;x++){
        let ar=0,ag=0,ab=0,aa=0;
        for(let k=-rad;k<=rad;k++){
          let xi=x+k; xi=((xi%W)+W)%W;
          const j=(y*W+xi)*4;
          ar+=src[j];ag+=src[j+1];ab+=src[j+2];aa+=src[j+3];
        }
        const o=(y*W+x)*4;
        tmp[o]=ar*inv;tmp[o+1]=ag*inv;tmp[o+2]=ab*inv;tmp[o+3]=aa*inv;
      }
    }
    // vertical pass — CLAMPED at the poles
    for(let x=0;x<W;x++){
      for(let y=0;y<H;y++){
        let rad=Math.round(baseR*latScale[y]); if(rad<1)rad=1; if(rad>H>>1)rad=H>>1;
        const inv=1/(2*rad+1);
        let ar=0,ag=0,ab=0,aa=0;
        for(let k=-rad;k<=rad;k++){
          let yi=y+k; if(yi<0)yi=0; else if(yi>H-1)yi=H-1;
          const j=(yi*W+x)*4;
          ar+=tmp[j];ag+=tmp[j+1];ab+=tmp[j+2];aa+=tmp[j+3];
        }
        const o=(y*W+x)*4;
        d[o]=ar*inv;d[o+1]=ag*inv;d[o+2]=ab*inv;d[o+3]=aa*inv;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR De-Noise — edge-preserving bilateral-ish denoise, longitude-wrapped, pole-aware ──
R({
  field:'fxW3vrdenoise', name:'VR De-Noise', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Strength', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrdenoiseRadius',label:'Radius',min:1,max:4,step:1,def:2}
  ],
  match:[/^VR De-Noise$/],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const rad=Math.max(1,Math.round(pval(c,'fxW3vrdenoiseRadius',fr,2)));
    const strength=val;
    if(strength<=0)return;
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    // bilateral range sigma: stronger Strength → larger sigma → more aggressive smoothing
    const sigR=12+strength*60;
    const inv2sr2=1/(2*sigR*sigR);
    // spatial gaussian weights (radius window)
    const sig=rad*0.8, inv2ss2=1/(2*sig*sig);
    const wrap=(sx,sy,o)=>{let xi=((sx%W)+W)%W;let yi=sy<0?0:sy>H-1?H-1:sy|0;return s[(yi*W+xi)*4+o];};
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        const a0=s[i+3];
        if(a0===0)continue;
        const cr=s[i],cg=s[i+1],cb=s[i+2];
        let ar=0,ag=0,ab=0,wsum=0;
        for(let ry=-rad;ry<=rad;ry++)for(let rx=-rad;rx<=rad;rx++){
          const nr=wrap(x+rx,y+ry,0),ng=wrap(x+rx,y+ry,1),nb=wrap(x+rx,y+ry,2);
          const dr=nr-cr,dg=ng-cg,db=nb-cb;
          const rangeD=(dr*dr+dg*dg+db*db);
          const ws=Math.exp(-(rx*rx+ry*ry)*inv2ss2 - rangeD*inv2sr2);
          ar+=nr*ws;ag+=ng*ws;ab+=nb*ws;wsum+=ws;
        }
        if(wsum>0){
          const fr2=ar/wsum,fg2=ag/wsum,fb2=ab/wsum;
          // blend the denoised result by Strength (preserve original at low strength)
          d[i]=clamp(cr+(fr2-cr)*strength,0,255);
          d[i+1]=clamp(cg+(fg2-cg)*strength,0,255);
          d[i+2]=clamp(cb+(fb2-cb)*strength,0,255);
        }
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Color Gradients — procedural gradient in spherical (lat/long) coords, seamless 360 ──
R({
  field:'fxW3vrgrad', name:'VR Color Gradients', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Blend', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fxW3vrgradDir',label:'Direction',opts:['Lat','Long'],def:'Lat'}
  ],
  colorSubs:['fxW3vrgradColA','fxW3vrgradColB'],
  match:[/^VR Color Gradients$/],
  render(api,val){
    const {lg,W,H,c,hex2rgb}=api;
    const dir=c.fxW3vrgradDir||'Lat';
    const A=hex2rgb(c.fxW3vrgradColA||'#ff2d8e');
    const B=hex2rgb(c.fxW3vrgradColB||'#2d8eff');
    const blend=val; // overlay opacity
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let y=0;y<H;y++){
      // latitude 0..1 (pole→pole) — already seamless top/bottom-clamped
      const tLat=(y+0.5)/H;
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        if(d[i+3]===0)continue;
        let t;
        if(dir==='Lat'){ t=tLat; }
        else {
          // longitude as an angle → cos() so x=0 and x=W meet seamlessly at the seam
          const lon=((x+0.5)/W)*2*Math.PI;
          t=0.5+0.5*Math.cos(lon);   // 1 at seam, 0 at the antimeridian — wraps with no tear
        }
        const gr=A[0]+(B[0]-A[0])*t, gg=A[1]+(B[1]-A[1])*t, gb=A[2]+(B[2]-A[2])*t;
        d[i]=d[i]+(gr-d[i])*blend;
        d[i+1]=d[i+1]+(gg-d[i+1])*blend;
        d[i+2]=d[i+2]+(gb-d[i+2])*blend;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Chromatic Aberrations — radial R/G/B sample offset, longitude-wrapped fringing ──
R({
  field:'fxW3vrchroma', name:'VR Chromatic Aberrations', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrchromaCX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxW3vrchromaCY',label:'Center Y',min:0,max:1,step:0.01,def:0.5}
  ],
  match:[/^VR Chromatic Aberrations$/],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const cx=pval(c,'fxW3vrchromaCX',fr,0.5)*W, cy=pval(c,'fxW3vrchromaCY',fr,0.5)*H;
    const amt=val*0.06; // fractional radial displacement at the frame edge
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    // seam-wrapped sampler: x wraps modulo W (longitude), y clamps (poles)
    const wrap=(sx,sy,o)=>{let xi=Math.round(sx);xi=((xi%W)+W)%W;let yi=sy<0?0:sy>H-1?H-1:Math.round(sy);return s[(yi*W+xi)*4+o];};
    for(let y=0;y<H;y++){
      const dy=y-cy;
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        if(s[i+3]===0)continue;
        const dx=x-cx;
        // R sampled pulled inward, B pushed outward → classic lateral chromatic fringing
        const rx=cx+dx*(1-amt), ry=cy+dy*(1-amt);
        const bx=cx+dx*(1+amt), by=cy+dy*(1+amt);
        d[i]=wrap(rx,ry,0);          // red from contracted coords
        d[i+1]=wrap(x,y,1);          // green unshifted
        d[i+2]=wrap(bx,by,2);        // blue from expanded coords
        // alpha unchanged (keep original)
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Fractal Noise — value/fractal noise in spherical coords, seamless 360 tiling ──
R({
  field:'fxW3vrfractal', name:'VR Fractal Noise', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Blend', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrfractalScale',label:'Scale',min:1,max:16,step:0.5,def:5},
    {kind:'slider',sub:'fxW3vrfractalContrast',label:'Contrast',min:0.2,max:4,step:0.05,def:1.4},
    {kind:'slider',sub:'fxW3vrfractalEvolve',label:'Evolve',min:0,max:8,step:0.05,def:0}
  ],
  match:[/^VR Fractal Noise$/],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp,vnoise}=api;
    const scale=Math.max(1,pval(c,'fxW3vrfractalScale',fr,5));
    const contrast=pval(c,'fxW3vrfractalContrast',fr,1.4);
    const evolve=pval(c,'fxW3vrfractalEvolve',fr,0)+fr*0.0; // Evolve is the explicit time axis
    const blend=val;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    // 3D-on-a-cylinder trick: map longitude to a circle (cos/sin) so the noise tiles across the
    // seam with NO discontinuity; latitude → the vertical axis; Evolve → a slowly drifting offset.
    // We feed 2D vnoise two seam-safe coords: (cos*scale, lat) and (sin*scale, lat+evolve) octaves.
    const TWO_PI=Math.PI*2;
    for(let y=0;y<H;y++){
      const lat=(y+0.5)/H;            // 0..1
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4;
        if(d[i+3]===0)continue;
        const lon=((x+0.5)/W)*TWO_PI; // 0..2PI
        const cxr=(Math.cos(lon)*0.5+0.5)*scale;  // seam-continuous x driver
        const syr=(Math.sin(lon)*0.5+0.5)*scale;  // second seam-continuous driver
        // fractal sum: 3 octaves, each combining the two circular drivers + latitude + evolve
        let amp=0.5, sum=0, norm=0, f=1;
        for(let o=0;o<3;o++){
          const n1=vnoise(cxr*f+evolve, lat*scale*f+o*13.7);
          const n2=vnoise(syr*f+o*7.3, lat*scale*f+evolve);
          sum+=amp*0.5*(n1+n2);
          norm+=amp; amp*=0.5; f*=2;
        }
        let nv=sum/norm;                       // 0..1
        nv=clamp((nv-0.5)*contrast+0.5,0,1);   // contrast about mid-grey
        const g=nv*255;
        d[i]=d[i]+(g-d[i])*blend;
        d[i+1]=d[i+1]+(g-d[i+1])*blend;
        d[i+2]=d[i+2]+(g-d[i+2])*blend;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Glow — threshold bright pixels, seam-wrapped blur, screen back ──
R({
  field:'fxW3vrglow', name:'VR Glow', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.6, paramLabel:'Intensity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrglowThresh',label:'Threshold',min:0,max:1,step:0.01,def:0.6},
    {kind:'slider',sub:'fxW3vrglowRadius',label:'Radius',min:0,max:1,step:0.01,def:0.4}
  ],
  match:[/^VR Glow$/],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const thr=pval(c,'fxW3vrglowThresh',fr,0.6)*255;
    const radius=Math.max(1,Math.round(pval(c,'fxW3vrglowRadius',fr,0.4)*Math.min(W,H)*0.08));
    const intensity=val;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    const N=W*H;
    // 1) threshold bright pixels into a glow buffer (premultiplied by luma over the threshold)
    const bright=new Float32Array(N*3);
    for(let p=0;p<N;p++){
      const i=p*4;
      if(d[i+3]===0)continue;
      const r=d[i],g=d[i+1],b=d[i+2];
      const luma=0.2126*r+0.7152*g+0.0722*b;
      if(luma>thr){ const k=(luma-thr)/(255-thr+1e-3); bright[p*3]=r*k; bright[p*3+1]=g*k; bright[p*3+2]=b*k; }
    }
    // 2) separable box blur of the glow buffer — horizontal WRAPPED (longitude), vertical CLAMPED (poles)
    const tmp=new Float32Array(N*3);
    let rad=radius; if(rad>W>>1)rad=W>>1;
    let inv=1/(2*rad+1);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let ar=0,ag=0,ab=0;
      for(let k=-rad;k<=rad;k++){let xi=x+k;xi=((xi%W)+W)%W;const j=(y*W+xi)*3;ar+=bright[j];ag+=bright[j+1];ab+=bright[j+2];}
      const o=(y*W+x)*3; tmp[o]=ar*inv;tmp[o+1]=ag*inv;tmp[o+2]=ab*inv;
    }
    let radV=radius; if(radV>H>>1)radV=H>>1;
    inv=1/(2*radV+1);
    for(let x=0;x<W;x++)for(let y=0;y<H;y++){
      let ar=0,ag=0,ab=0;
      for(let k=-radV;k<=radV;k++){let yi=y+k;if(yi<0)yi=0;else if(yi>H-1)yi=H-1;const j=(yi*W+x)*3;ar+=tmp[j];ag+=tmp[j+1];ab+=tmp[j+2];}
      const o=(y*W+x)*3; bright[o]=ar*inv;bright[o+1]=ag*inv;bright[o+2]=ab*inv;
    }
    // 3) screen the blurred glow back over the frame, scaled by Intensity
    for(let p=0;p<N;p++){
      const i=p*4;
      if(d[i+3]===0)continue;
      const gr=bright[p*3]*intensity, gg=bright[p*3+1]*intensity, gb=bright[p*3+2]*intensity;
      // screen: 255 - (255-base)*(255-glow)/255
      d[i]=clamp(255-(255-d[i])*(255-gr)/255,0,255);
      d[i+1]=clamp(255-(255-d[i+1])*(255-gg)/255,0,255);
      d[i+2]=clamp(255-(255-d[i+2])*(255-gb)/255,0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Immersive VR ▸ VR Sharpen — unsharp mask vs a seam-wrapped blur, longitude-wrapped, pole-aware ──
R({
  field:'fxW3vrsharpen', name:'VR Sharpen', cat:'Immersive VR', color:'#62C5C9',
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxW3vrsharpenRadius',label:'Radius',min:1,max:8,step:1,def:2}
  ],
  match:[/^VR Sharpen$/],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const rad=Math.max(1,Math.round(pval(c,'fxW3vrsharpenRadius',fr,2)));
    const amount=val*2.5; // unsharp strength
    if(amount<=0)return;
    const im=lg.getImageData(0,0,W,H),d=im.data;
    const N=W*H;
    const src=new Float32Array(N*3);
    for(let p=0;p<N;p++){const i=p*4;src[p*3]=d[i];src[p*3+1]=d[i+1];src[p*3+2]=d[i+2];}
    // separable box blur → the "low-pass" we subtract. Horizontal WRAPPED, vertical CLAMPED.
    const tmp=new Float32Array(N*3), blur=new Float32Array(N*3);
    let rh=rad; if(rh>W>>1)rh=W>>1;
    let inv=1/(2*rh+1);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let ar=0,ag=0,ab=0;
      for(let k=-rh;k<=rh;k++){let xi=x+k;xi=((xi%W)+W)%W;const j=(y*W+xi)*3;ar+=src[j];ag+=src[j+1];ab+=src[j+2];}
      const o=(y*W+x)*3; tmp[o]=ar*inv;tmp[o+1]=ag*inv;tmp[o+2]=ab*inv;
    }
    let rv=rad; if(rv>H>>1)rv=H>>1;
    inv=1/(2*rv+1);
    for(let x=0;x<W;x++)for(let y=0;y<H;y++){
      let ar=0,ag=0,ab=0;
      for(let k=-rv;k<=rv;k++){let yi=y+k;if(yi<0)yi=0;else if(yi>H-1)yi=H-1;const j=(yi*W+x)*3;ar+=tmp[j];ag+=tmp[j+1];ab+=tmp[j+2];}
      const o=(y*W+x)*3; blur[o]=ar*inv;blur[o+1]=ag*inv;blur[o+2]=ab*inv;
    }
    // unsharp mask: out = src + amount*(src - blur)
    for(let p=0;p<N;p++){
      const i=p*4;
      if(d[i+3]===0)continue;
      const o=p*3;
      d[i]=clamp(src[o]+amount*(src[o]-blur[o]),0,255);
      d[i+1]=clamp(src[o+1]+amount*(src[o+1]-blur[o+1]),0,255);
      d[i+2]=clamp(src[o+2]+amount*(src[o+2]-blur[o+2]),0,255);
    }
    lg.putImageData(im,0,0);
  }
});

// ════════════════ LIVE-LIE FIXES (real replacements for fake aliases) ════════════════

// ── Noise & Grain ▸ Median — REAL per-channel sort-window median (was falsely aliased to add-grain) ──
R({
  field:'fxLFmedian', name:'Median', cat:'Noise & Grain', color:'#8FA98F',
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[{kind:'slider',sub:'fxLFmedRad',label:'Radius',min:1,max:4,step:1,def:2}],
  match:[/^Median(?: \(Legacy\))?$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const r=Math.max(1,Math.min(4,Math.round(pval(c,'fxLFmedRad',fr,2))));
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    const win=new Uint8Array((2*r+1)*(2*r+1));
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(s[i+3]===0)continue;
      for(let ch=0;ch<3;ch++){
        let n=0;
        for(let dy=-r;dy<=r;dy++){const yy=y+dy; if(yy<0||yy>=H)continue;
          for(let dx=-r;dx<=r;dx++){const xx=x+dx; if(xx<0||xx>=W)continue; const j=(yy*W+xx)*4; if(s[j+3]===0)continue; win[n++]=s[j+ch];}}
        // partial insertion sort to the median position is plenty fast for n<=81
        const a=win.subarray(0,n); Array.prototype.sort.call(a,(p,q)=>p-q);
        const m=a[n>>1];
        d[i+ch]=d[i+ch]+(m-d[i+ch])*val;
      }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Noise & Grain ▸ Remove Grain — REAL edge-preserving (bilateral-lite) denoise (was the ADD-grain code — backwards) ──
R({
  field:'fxLFdenoise', name:'Remove Grain', cat:'Noise & Grain', color:'#8FA98F',
  def:0, applyVal:1, paramLabel:'Noise Reduction', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLFdnRad',label:'Radius',min:1,max:3,step:1,def:2},
    {kind:'slider',sub:'fxLFdnThr',label:'Detail Preserve',min:0.02,max:0.5,step:0.01,def:0.14},
  ],
  match:[/^Remove Grain$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const r=Math.max(1,Math.min(3,Math.round(pval(c,'fxLFdnRad',fr,2))));
    const thr=pval(c,'fxLFdnThr',fr,0.14)*255*3;   // total RGB-distance gate (edge preserve)
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(s[i+3]===0)continue;
      const cr=s[i],cg=s[i+1],cb=s[i+2];
      let sr=0,sg2=0,sb=0,wsum=0;
      for(let dy=-r;dy<=r;dy++){const yy=y+dy; if(yy<0||yy>=H)continue;
        for(let dx=-r;dx<=r;dx++){const xx=x+dx; if(xx<0||xx>=W)continue; const j=(yy*W+xx)*4; if(s[j+3]===0)continue;
          const diff=Math.abs(s[j]-cr)+Math.abs(s[j+1]-cg)+Math.abs(s[j+2]-cb);
          if(diff<thr){ sr+=s[j];sg2+=s[j+1];sb+=s[j+2];wsum++; }}}   // only average similar neighbours → keeps edges
      if(wsum>0){ d[i]+=((sr/wsum)-d[i])*val; d[i+1]+=((sg2/wsum)-d[i+1])*val; d[i+2]+=((sb/wsum)-d[i+2])*val; }
    }
    lg.putImageData(im,0,0);
  }
});

// ── Perspective ▸ Spotlight — REAL aimable light cone (was a non-aimable vignette) ──
R({
  field:'fxLFspotlight', name:'Spotlight', cat:'Perspective', color:'#B05B8B',
  def:0, applyVal:1, paramLabel:'Intensity', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fxLFspX',label:'Center X',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLFspY',label:'Center Y',min:0,max:1,step:0.01,def:0.4},
    {kind:'slider',sub:'fxLFspRad',label:'Radius',min:0.05,max:1.2,step:0.01,def:0.4},
    {kind:'slider',sub:'fxLFspFall',label:'Falloff',min:0,max:1,step:0.01,def:0.5},
    {kind:'slider',sub:'fxLFspAmb',label:'Surround Dim',min:0,max:1,step:0.01,def:0.45},
  ],
  match:[/^(?:CC |LePrince )?Spotlight$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp,hex2rgb}=api;
    const cx=pval(c,'fxLFspX',fr,0.5)*W, cy=pval(c,'fxLFspY',fr,0.4)*H;
    const rad=Math.max(1,pval(c,'fxLFspRad',fr,0.4)*Math.max(W,H));
    const fall=pval(c,'fxLFspFall',fr,0.5), amb=pval(c,'fxLFspAmb',fr,0.45)*val;
    const lc=hex2rgb(c.fxLFspColor||'#fff7d6');
    const inner=rad*(1-fall);
    const im=lg.getImageData(0,0,W,H),d=im.data;
    for(let i=0,p=0;i<d.length;i+=4,p++){
      if(d[i+3]===0)continue;
      const x=p%W, y=(p/W)|0, dx=x-cx, dy=y-cy, dist=Math.sqrt(dx*dx+dy*dy);
      // light = 1 inside the inner cone → 0 at the radius edge (smooth)
      let lit; if(dist<=inner)lit=1; else if(dist>=rad)lit=0; else { const t=1-(dist-inner)/(rad-inner); lit=t*t*(3-2*t); }
      // dim the surround by ambient where unlit, and tint+lift toward the light colour where lit
      const dim=1-amb*(1-lit);
      const lift=lit*val;
      d[i]  =clamp((d[i]  *dim)+(lc[0]-d[i]  *dim)*lift*0.35,0,255);
      d[i+1]=clamp((d[i+1]*dim)+(lc[1]-d[i+1]*dim)*lift*0.35,0,255);
      d[i+2]=clamp((d[i+2]*dim)+(lc[2]-d[i+2]*dim)*lift*0.35,0,255);
    }
    lg.putImageData(im,0,0);
  }
});



// ════════════════ SECOND-LAYER PROOF — Blend (samples the layer above via getLayer2) ════════════════
R({
  field:'fx2blend', name:'Blend', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:0.5, paramLabel:'Blend With Above', range:[0,1,0.01],
  extra:[{kind:'seg',sub:'fx2blendMode',label:'Mode',opts:['Crossfade','Add','Multiply','Difference','Lighten','Darken'],def:'Crossfade'}],
  match:[/^Blend$/i],
  render(api,val){
    const {lg,W,H,c}=api;
    const l2=api.getLayer2(); if(!l2)return;                       // no layer above → nothing to blend with
    const mode=c.fx2blendMode||'Crossfade';
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const b=l2.getContext('2d').getImageData(0,0,W,H).data;
    for(let i=0;i<da.length;i+=4){
      const ba=b[i+3]/255; if(ba===0)continue;
      const r=da[i],g=da[i+1],bl=da[i+2], br=b[i],bg=b[i+1],bb=b[i+2];
      let nr,ng,nb;
      if(mode==='Add'){nr=Math.min(255,r+br);ng=Math.min(255,g+bg);nb=Math.min(255,bl+bb);}
      else if(mode==='Multiply'){nr=r*br/255;ng=g*bg/255;nb=bl*bb/255;}
      else if(mode==='Difference'){nr=Math.abs(r-br);ng=Math.abs(g-bg);nb=Math.abs(bl-bb);}
      else if(mode==='Lighten'){nr=Math.max(r,br);ng=Math.max(g,bg);nb=Math.max(bl,bb);}
      else if(mode==='Darken'){nr=Math.min(r,br);ng=Math.min(g,bg);nb=Math.min(bl,bb);}
      else {nr=br;ng=bg;nb=bb;}                                    // Crossfade → toward the above layer
      const w=val*ba;
      da[i]=r+(nr-r)*w; da[i+1]=g+(ng-g)*w; da[i+2]=bl+(nb-bl)*w;
    }
    lg.putImageData(A,0,0);
  }
});


// ════════════════ SECOND-LAYER — Color / Stylize / Noise (sample the layer ABOVE) ════════════════

// ── Color ▸ Color Link — measure a stat colour of the layer ABOVE, tint THIS layer toward it ──
R({
  field:'fx2colorlink', name:'Color Link', cat:'Color', color:'#5BA3C7', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2clStat',label:'Sample',opts:['Average','Brightest','Darkest'],def:'Average'},
    {kind:'seg',sub:'fx2clMode',label:'Blend',opts:['Tint','Multiply','Color'],def:'Tint'}
  ],
  match:[/^Color Link$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;                         // no layer above → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const stat=c.fx2clStat||'Average', mode=c.fx2clMode||'Tint';
    // ── pre-pass: measure the chosen statistic colour from the REAL above-layer pixels ──
    let tr=0,tg=0,tb=0;
    if(stat==='Average'){
      let wsum=0;
      for(let i=0;i<above.length;i+=4){const a=above[i+3]; if(a===0)continue; tr+=above[i]*a; tg+=above[i+1]*a; tb+=above[i+2]*a; wsum+=a;}
      if(wsum>0){tr/=wsum; tg/=wsum; tb/=wsum;} else {tr=tg=tb=0;}
    } else {
      // Brightest / Darkest → the pixel whose luma is the extreme (alpha-gated)
      let best=stat==='Brightest'?-1:1e9, found=false;
      for(let i=0;i<above.length;i+=4){const a=above[i+3]; if(a===0)continue;
        const lum=0.299*above[i]+0.587*above[i+1]+0.114*above[i+2];
        if((stat==='Brightest'&&lum>best)||(stat==='Darkest'&&lum<best)){best=lum; tr=above[i]; tg=above[i+1]; tb=above[i+2]; found=true;}}
      if(!found){tr=tg=tb=0;}
    }
    // ── tint THIS layer toward (tr,tg,tb) by Opacity, via the chosen blend mode ──
    const A=lg.getImageData(0,0,W,H),d=A.data;
    // luma of the target (used by the 'Color' mode to preserve THIS layer's lightness)
    for(let i=0;i<d.length;i+=4){
      const a=d[i+3]; if(a===0)continue;
      const r=d[i],g=d[i+1],b=d[i+2];
      let nr,ng,nb;
      if(mode==='Multiply'){ nr=r*tr/255; ng=g*tg/255; nb=b*tb/255; }
      else if(mode==='Color'){
        // keep THIS pixel's luminance, take the target's chroma (classic Color blend)
        const tl=0.299*tr+0.587*tg+0.114*tb || 1e-6;
        const pl=0.299*r+0.587*g+0.114*b;
        const f=pl/tl;
        nr=tr*f; ng=tg*f; nb=tb*f;
      }
      else { nr=tr; ng=tg; nb=tb; }                                  // Tint → straight toward the target colour
      d[i]  =clamp(r+(nr-r)*val,0,255);
      d[i+1]=clamp(g+(ng-g)*val,0,255);
      d[i+2]=clamp(b+(nb-b)*val,0,255);
    }
    lg.putImageData(A,0,0);
  }
});

// ── Stylize ▸ Texturize — emboss the ABOVE layer's luminance as relief onto THIS layer ──
R({
  field:'fx2texturize', name:'Texturize', cat:'Stylize', color:'#D9A441', needs2nd:true,
  def:0, applyVal:0.5, paramLabel:'Texture Contrast', range:[0,2,0.01],
  extra:[
    {kind:'slider',sub:'fx2txLight',label:'Light Direction',min:0,max:360,step:1,def:135},
    {kind:'seg',sub:'fx2txPlace',label:'Placement',opts:['Stretch','Tile','Center'],def:'Stretch'}
  ],
  match:[/^Texturize$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;                         // no layer above → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const ang=pval(c,'fx2txLight',fr,135)*Math.PI/180;
    const lx=Math.cos(ang), ly=Math.sin(ang);                        // light direction (xy)
    const place=c.fx2txPlace||'Stretch';
    const contrast=val;                                              // Texture Contrast (main param)
    // map THIS pixel (x,y) → a coord in the above layer per Placement
    const mapCoord=(x,y)=>{
      if(place==='Tile'){ return [((x%W)+W)%W, ((y%H)+H)%H]; }       // 1:1 wrap (same size → identity wrap)
      if(place==='Center'){ return [x,y]; }                          // centred 1:1 (same size → identity)
      return [x,y];                                                  // Stretch: layers are co-sized → identity
    };
    // alpha-gated luma read from the above buffer at integer coord
    const lumAt=(ix,iy)=>{
      ix=ix<0?0:ix>W-1?W-1:ix; iy=iy<0?0:iy>H-1?H-1:iy;
      const j=(iy*W+ix)*4; const a=above[j+3]/255;
      return (0.299*above[j]+0.587*above[j+1]+0.114*above[j+2])*a;
    };
    const A=lg.getImageData(0,0,W,H),d=A.data;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(d[i+3]===0)continue;
      const mc=mapCoord(x,y), mx=mc[0]|0, my=mc[1]|0;
      // luminance gradient of the above layer (central difference) → surface slope
      const gx=(lumAt(mx+1,my)-lumAt(mx-1,my))/255;
      const gy=(lumAt(mx,my+1)-lumAt(mx,my-1))/255;
      // relief = how much the slope faces the light → signed shade in [-1,1]
      const shade=(gx*lx+gy*ly)*contrast;
      const add=shade*128;                                           // map to ±128 of brightness
      d[i]  =clamp(d[i]  +add,0,255);
      d[i+1]=clamp(d[i+1]+add,0,255);
      d[i+2]=clamp(d[i+2]+add,0,255);
    }
    lg.putImageData(A,0,0);
  }
});

// ── Distort ▸ LePrince Mr. Smoothie — warp THIS layer along the ABOVE layer's luma gradient ──
R({
  field:'fx2smoothie', name:'LePrince Mr. Smoothie', cat:'Distort', color:'#8B7FD0', needs2nd:true,
  def:0, applyVal:0.5, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fx2smPhase',label:'Phase',min:0,max:6.2832,step:0.01,def:0},
    {kind:'seg',sub:'fx2smSrc',label:'Property',opts:['Luma','Hue'],def:'Luma'}
  ],
  match:[/^(?:CC |LePrince )Mr\. Smoothie$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval}=api;
    const l2=api.getLayer2(); if(!l2)return;                         // no layer above → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const ph=pval(c,'fx2smPhase',fr,0);
    const useHue=(c.fx2smSrc||'Luma')==='Hue';
    const amp=val*Math.min(W,H)*0.14;
    // ── build the scalar field from the above layer (luma or hue), alpha-gated ──
    const N=W*H, field=new Float32Array(N);
    for(let p=0;p<N;p++){
      const j=p*4, a=above[j+3]/255;
      if(useHue){
        const r=above[j]/255,g=above[j+1]/255,b=above[j+2]/255;
        const mx=Math.max(r,g,b),mn=Math.min(r,g,b),dl=mx-mn;
        let h=0;
        if(dl>1e-6){
          if(mx===r)h=((g-b)/dl)%6; else if(mx===g)h=(b-r)/dl+2; else h=(r-g)/dl+4;
          h/=6; if(h<0)h+=1;
        }
        field[p]=h*a;
      } else {
        field[p]=(0.299*above[j]+0.587*above[j+1]+0.114*above[j+2])/255*a;
      }
    }
    // ── displace this layer's sample coords along the field gradient (rotated by Phase) ──
    const im=lg.getImageData(0,0,W,H),d=im.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const cph=Math.cos(ph), sph=Math.sin(ph);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4, p=y*W+x;
      const xl=x>0?p-1:p, xr=x<W-1?p+1:p;
      const yt=y>0?p-W:p, yb=y<H-1?p+W:p;
      let gx=field[xr]-field[xl], gy=field[yb]-field[yt];            // gradient of the above field
      // rotate the displacement vector by Phase → swirl the warp direction
      const rx=gx*cph-gy*sph, ry=gx*sph+gy*cph;
      const sx=x+rx*amp, sy=y+ry*amp;
      d[i]=samp(sx,sy,0); d[i+1]=samp(sx,sy,1); d[i+2]=samp(sx,sy,2); d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(im,0,0);
  }
});

// ── Noise ▸ Match Grain — measure the ABOVE layer's grain amplitude, add matching grain to THIS layer ──
R({
  field:'fx2matchgrain', name:'Match Grain', cat:'Noise', color:'#8FA98F', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Intensity', range:[0,2,0.01],
  extra:[
    {kind:'slider',sub:'fx2mgSize',label:'Size',min:1,max:6,step:0.5,def:1}
  ],
  match:[/^Match Grain$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;                         // no source above → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const size=Math.max(1,pval(c,'fx2mgSize',fr,1));                 // grain cell size (px)
    // ── analyse the source grain: per-channel mean |pixel − 3×3 blur(pixel)| over valid pixels ──
    // sample a stride so analysis stays well under O(W*H) even on big frames
    const stride=Math.max(1,Math.floor(Math.sqrt(W*H)/256));
    let aR=0,aG=0,aB=0,n=0;
    const at=(ix,iy,o)=>{ ix=ix<0?0:ix>W-1?W-1:ix; iy=iy<0?0:iy>H-1?H-1:iy; return above[(iy*W+ix)*4+o]; };
    for(let y=0;y<H;y+=stride)for(let x=0;x<W;x+=stride){
      const j=(y*W+x)*4; if(above[j+3]===0)continue;
      for(let o=0;o<3;o++){
        // 3×3 box mean around (x,y)
        let acc=0;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)acc+=at(x+dx,y+dy,o);
        const mean=acc/9;
        const hf=Math.abs(above[j+o]-mean);                         // high-frequency residual = local grain
        if(o===0)aR+=hf; else if(o===1)aG+=hf; else aB+=hf;
      }
      n++;
    }
    if(n>0){aR/=n; aG/=n; aB/=n;} else {aR=aG=aB=0;}
    if(aR<0.01&&aG<0.01&&aB<0.01)return;                            // source is grainless → nothing to match
    // ── add hash-seeded grain of the MEASURED per-channel amplitude to THIS layer ──
    // integer hash → repeatable, frame-stable noise; Size quantises the cell so larger = chunkier grain
    const hash=(ix,iy,o)=>{
      let h=(ix*374761393+iy*668265263+o*2147483647)|0;
      h=(h^(h>>>13))*1274126177; h^=h>>>16;
      return ((h>>>0)/4294967295)*2-1;                              // → [-1,1]
    };
    const inv=1/size;
    const A=lg.getImageData(0,0,W,H),d=A.data;
    for(let y=0;y<H;y++){
      const cy=(y*inv)|0;
      for(let x=0;x<W;x++){
        const i=(y*W+x)*4; if(d[i+3]===0)continue;
        const cx=(x*inv)|0;
        d[i]  =clamp(d[i]  +hash(cx,cy,0)*aR*val,0,255);
        d[i+1]=clamp(d[i+1]+hash(cx,cy,1)*aG*val,0,255);
        d[i+2]=clamp(d[i+2]+hash(cx,cy,2)*aB*val,0,255);
      }
    }
    lg.putImageData(A,0,0);
  }
});



  // ════════════════ WAVE 4 (second-layer: Channel composites + Displacement/Matte/Stereo) ════════════════

// ═══ Channel composites ═══
// ════════════════ Channel composites (second-layer; sample the layer ABOVE via getLayer2) ════════════════

// ── Channel ▸ Calculations — combine THIS layer's input channel with the ABOVE layer's channel via a blend op + opacity ──
R({
  field:'fx2calc', name:'Calculations', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2calcInput',label:'Input',opts:['RGBA','Red','Green','Blue','Alpha','Luma'],def:'RGBA'},
    {kind:'seg',sub:'fx2calcSrc',label:'2nd Source',opts:['RGBA','Red','Green','Blue','Alpha','Luma'],def:'RGBA'},
    {kind:'seg',sub:'fx2calcOp',label:'Operator',opts:['Normal','Add','Multiply','Difference','Lighten','Darken','Screen'],def:'Normal'}
  ],
  match:[/^Calculations$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const b=l2.getContext('2d').getImageData(0,0,W,H).data;
    const inSel=c.fx2calcInput||'RGBA', srcSel=c.fx2calcSrc||'RGBA', op=c.fx2calcOp||'Normal';
    // pull a per-channel triple from a buffer given a channel selector
    const pick=(buf,i,sel)=>{
      const r=buf[i],g=buf[i+1],bl=buf[i+2],al=buf[i+3];
      if(sel==='Red')   return [r,r,r];
      if(sel==='Green') return [g,g,g];
      if(sel==='Blue')  return [bl,bl,bl];
      if(sel==='Alpha') return [al,al,al];
      if(sel==='Luma'){ const lu=0.299*r+0.587*g+0.114*bl; return [lu,lu,lu]; }
      return [r,g,bl];                                            // RGBA → straight colour
    };
    for(let i=0;i<da.length;i+=4){
      const aa=da[i+3]/255; if(aa===0)continue;
      const ba=b[i+3]/255;
      const I=pick(da,i,inSel), Sc=pick(b,i,srcSel);
      let nr,ng,nb;
      for(let k=0;k<3;k++){
        const x=I[k], y=Sc[k]; let o;
        if(op==='Add')             o=x+y;
        else if(op==='Multiply')   o=x*y/255;
        else if(op==='Difference') o=Math.abs(x-y);
        else if(op==='Lighten')    o=Math.max(x,y);
        else if(op==='Darken')     o=Math.min(x,y);
        else if(op==='Screen')     o=255-(255-x)*(255-y)/255;
        else                       o=y;                          // Normal → the 2nd source channel
        if(k===0)nr=o; else if(k===1)ng=o; else nb=o;
      }
      // opacity weighted by the above layer's coverage (transparent above → no contribution)
      const w=val*ba;
      da[i]=clamp(I[0]+(nr-I[0])*w,0,255);
      da[i+1]=clamp(I[1]+(ng-I[1])*w,0,255);
      da[i+2]=clamp(I[2]+(nb-I[2])*w,0,255);
    }
    lg.putImageData(A,0,0);
  }
});

// ── Channel ▸ LePrince Composite (CC Composite) — composite THIS layer with the ABOVE layer via blend mode + opacity, RGB-only / Alpha-only ──
R({
  field:'fx2comp', name:'LePrince Composite', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Opacity', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2compMode',label:'Mode',opts:['Normal','Add','Multiply','Difference','Lighten','Darken','Screen','Overlay'],def:'Normal'},
    {kind:'seg',sub:'fx2compChan',label:'Affect',opts:['RGB + Alpha','RGB Only','Alpha Only'],def:'RGB + Alpha'}
  ],
  match:[/^(?:CC |LePrince )Composite$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const b=l2.getContext('2d').getImageData(0,0,W,H).data;
    const mode=c.fx2compMode||'Normal', chan=c.fx2compChan||'RGB + Alpha';
    const doRGB=chan!=='Alpha Only', doA=chan!=='RGB Only';
    const blend=(x,y)=>{
      if(mode==='Add')             return x+y;
      if(mode==='Multiply')        return x*y/255;
      if(mode==='Difference')      return Math.abs(x-y);
      if(mode==='Lighten')         return Math.max(x,y);
      if(mode==='Darken')          return Math.min(x,y);
      if(mode==='Screen')          return 255-(255-x)*(255-y)/255;
      if(mode==='Overlay')         return x<128 ? (2*x*y/255) : (255-2*(255-x)*(255-y)/255);
      return y;                                                   // Normal → above-layer value
    };
    for(let i=0;i<da.length;i+=4){
      const ba=b[i+3]/255;
      if(doRGB){
        // per-channel blend, then alpha-over by the above layer's coverage × opacity
        const w=val*ba;
        const nr=blend(da[i],b[i]), ng=blend(da[i+1],b[i+1]), nb=blend(da[i+2],b[i+2]);
        da[i]=clamp(da[i]+(nr-da[i])*w,0,255);
        da[i+1]=clamp(da[i+1]+(ng-da[i+1])*w,0,255);
        da[i+2]=clamp(da[i+2]+(nb-da[i+2])*w,0,255);
      }
      if(doA){
        // composite alpha: standard over A_out = Aa + Ab*(1-Aa), eased toward it by opacity
        const aa=da[i+3]/255, out=(aa+ba*(1-aa))*255;
        da[i+3]=clamp(da[i+3]+(out-da[i+3])*val,0,255);
      }
    }
    lg.putImageData(A,0,0);
  }
});

// ── Channel ▸ Compound Arithmetic — per-channel R/G/B math between THIS layer and the ABOVE layer, clamped 0-255 ──
R({
  field:'fx2arith', name:'Compound Arithmetic', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2arithOp',label:'Operator',opts:['Add','Subtract','Multiply','Difference','Min','Max','And','Or','Xor','Screen'],def:'Add'}
  ],
  match:[/^Compound Arithmetic$/i],
  render(api,val){
    const {lg,W,H,c,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const b=l2.getContext('2d').getImageData(0,0,W,H).data;
    const op=c.fx2arithOp||'Add';
    const calc=(x,y)=>{
      if(op==='Subtract')   return x-y;
      if(op==='Multiply')   return x*y/255;
      if(op==='Difference') return Math.abs(x-y);
      if(op==='Min')        return Math.min(x,y);
      if(op==='Max')        return Math.max(x,y);
      if(op==='And')        return (x&y);
      if(op==='Or')         return (x|y);
      if(op==='Xor')        return (x^y);
      if(op==='Screen')     return 255-(255-x)*(255-y)/255;
      return x+y;                                                 // Add
    };
    for(let i=0;i<da.length;i+=4){
      const aa=da[i+3]/255; if(aa===0)continue;
      const nr=clamp(calc(da[i],b[i]),0,255);
      const ng=clamp(calc(da[i+1],b[i+1]),0,255);
      const nb=clamp(calc(da[i+2],b[i+2]),0,255);
      da[i]=da[i]+(nr-da[i])*val;
      da[i+1]=da[i+1]+(ng-da[i+1])*val;
      da[i+2]=da[i+2]+(nb-da[i+2])*val;
    }
    lg.putImageData(A,0,0);
  }
});

// ── Channel ▸ Set Channels — set each output channel (R/G/B/A) of THIS layer to a chosen source channel of the ABOVE layer (or self) ──
R({
  field:'fx2setch', name:'Set Channels', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2setR',label:'Out Red',  opts:['Self','Red','Green','Blue','Alpha','Luma','Off'],def:'Red'},
    {kind:'seg',sub:'fx2setG',label:'Out Green',opts:['Self','Red','Green','Blue','Alpha','Luma','Off'],def:'Green'},
    {kind:'seg',sub:'fx2setB',label:'Out Blue', opts:['Self','Red','Green','Blue','Alpha','Luma','Off'],def:'Blue'},
    {kind:'seg',sub:'fx2setA',label:'Out Alpha',opts:['Self','Red','Green','Blue','Alpha','Luma','Off'],def:'Self'}
  ],
  match:[/^Set Channels$/i],
  render(api,val){
    const {lg,W,H,c}=api;
    const l2=api.getLayer2(); if(!l2)return;
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const b=l2.getContext('2d').getImageData(0,0,W,H).data;
    const selR=c.fx2setR||'Red', selG=c.fx2setG||'Green', selB=c.fx2setB||'Blue', selA=c.fx2setA||'Self';
    // resolve a selector to a value, given this layer's pixel (self/self-Off) and the above-layer source
    const val4=(sel,i,outIdx)=>{
      if(sel==='Off')   return 0;
      if(sel==='Self')  return da[i+outIdx];                      // keep this layer's own channel
      const r=b[i],g=b[i+1],bl=b[i+2],al=b[i+3];
      if(sel==='Red')   return r;
      if(sel==='Green') return g;
      if(sel==='Blue')  return bl;
      if(sel==='Alpha') return al;
      if(sel==='Luma')  return 0.299*r+0.587*g+0.114*bl;
      return da[i+outIdx];
    };
    for(let i=0;i<da.length;i+=4){
      const nr=val4(selR,i,0), ng=val4(selG,i,1), nb=val4(selB,i,2), na=val4(selA,i,3);
      // ease from the current pixel to the re-channeled result by Amount
      da[i]=da[i]+(nr-da[i])*val;
      da[i+1]=da[i+1]+(ng-da[i+1])*val;
      da[i+2]=da[i+2]+(nb-da[i+2])*val;
      da[i+3]=da[i+3]+(na-da[i+3])*val;
    }
    lg.putImageData(A,0,0);
  }
});

// ── Channel ▸ Set Matte — replace THIS layer's ALPHA with a channel from the ABOVE layer, with Invert + Stretch-to-fit ──
R({
  field:'fx2matte', name:'Set Matte', cat:'Channel', color:'#7C8CA6', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2matteChan',label:'Use Channel',opts:['Alpha','Red','Green','Blue','Luma'],def:'Alpha'},
    {kind:'seg',sub:'fx2matteInv',label:'Invert',opts:['Off','On'],def:'Off'},
    {kind:'seg',sub:'fx2matteStretch',label:'Stretch',opts:['Off','On'],def:'On'}
  ],
  match:[/^Set Matte$/i],
  render(api,val){
    const {lg,L,W,H,c,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;
    const A=lg.getImageData(0,0,W,H),da=A.data;
    const chan=c.fx2matteChan||'Alpha', inv=(c.fx2matteInv||'Off')==='On', stretch=(c.fx2matteStretch||'On')==='On';
    const lw=l2.width||W, lh=l2.height||H;
    // Stretch On → fit the above layer over THIS frame (resample to W×H); Off → 1:1 pixel align
    let src, sW, sH;
    if(stretch && (lw!==W || lh!==H)){
      const sc=document.createElement('canvas'); sc.width=W; sc.height=H;
      const sx=sc.getContext('2d'); sx.drawImage(l2,0,0,lw,lh,0,0,W,H);
      src=sx.getImageData(0,0,W,H).data; sW=W; sH=H;
    } else {
      src=l2.getContext('2d').getImageData(0,0,lw,lh).data; sW=lw; sH=lh;
    }
    const chanVal=(j)=>{
      const r=src[j],g=src[j+1],bl=src[j+2],al=src[j+3];
      if(chan==='Red')   return r;
      if(chan==='Green') return g;
      if(chan==='Blue')  return bl;
      if(chan==='Luma')  return 0.299*r+0.587*g+0.114*bl;
      return al;                                                  // Alpha
    };
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // sample the matte source at the aligned location (nearest when not stretched)
      const mx = sW===W ? x : (x<sW?x:sW-1);
      const my = sH===H ? y : (y<sH?y:sH-1);
      const j=(my*sW+mx)*4;
      let m=chanVal(j); if(inv)m=255-m;
      da[i+3]=clamp(da[i+3]+(m-da[i+3])*val,0,255);
    }
    lg.putImageData(A,0,0);
  }
});


// ═══ Displacement / Matte / Stereo ═══
// ════════════════ SECOND-LAYER ▸ Displacement / Matte / Stereo ════════════════

// ── Distort ▸ Displacement Map — warp THIS layer by the ABOVE layer's channels ──
R({
  field:'fx2dispmap', name:'Displacement Map', cat:'Distort', color:'#8B7FD0', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fx2dispH',label:'Max Horizontal',min:0,max:200,step:1,def:40},
    {kind:'slider',sub:'fx2dispV',label:'Max Vertical',min:0,max:200,step:1,def:40},
    {kind:'seg',sub:'fx2dispHCh',label:'H Channel',opts:['Red','Green','Blue','Luma','Alpha'],def:'Red'},
    {kind:'seg',sub:'fx2dispVCh',label:'V Channel',opts:['Red','Green','Blue','Luma','Alpha'],def:'Green'}
  ],
  match:[/^Displacement Map$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,k}=api;
    const l2=api.getLayer2(); if(!l2)return;                       // nothing above → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const maxH=pval(c,'fx2dispH',fr,40)*k*val, maxV=pval(c,'fx2dispV',fr,40)*k*val;
    const hCh=c.fx2dispHCh||'Red', vCh=c.fx2dispVCh||'Green';
    // pull the chosen channel's signed displacement (-1..1) from the map at index i
    const chVal=(p,ch)=>{
      if(ch==='Red')   return p[0];
      if(ch==='Green') return p[1];
      if(ch==='Blue')  return p[2];
      if(ch==='Alpha') return p[3];
      return 0.299*p[0]+0.587*p[1]+0.114*p[2];                     // Luma
    };
    const A=lg.getImageData(0,0,W,H),d=A.data,s=new Uint8ClampedArray(d),samp=mkSamp(s,W,H);
    const px=[0,0,0,0];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      const ma=above[i+3]; if(ma===0){ continue; }                 // transparent map pixel → no push
      px[0]=above[i];px[1]=above[i+1];px[2]=above[i+2];px[3]=above[i+3];
      const dh=(chVal(px,hCh)-128)/128;                            // -1..1
      const dv=(chVal(px,vCh)-128)/128;
      const sx=x+dh*maxH, sy=y+dv*maxV;
      d[i]=samp(sx,sy,0);d[i+1]=samp(sx,sy,1);d[i+2]=samp(sx,sy,2);d[i+3]=samp(sx,sy,3);
    }
    lg.putImageData(A,0,0);
  }
});

// ── Keying ▸ Difference Matte — key out where THIS matches the ABOVE (clean plate) ──
R({
  field:'fx2diffmatte', name:'Difference Matte', cat:'Keying', color:'#C56B6B', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'slider',sub:'fx2diffTol',label:'Tolerance',min:0,max:1,step:0.005,def:0.1},
    {kind:'slider',sub:'fx2diffSoft',label:'Softness',min:0,max:1,step:0.005,def:0.1},
    {kind:'seg',sub:'fx2diffView',label:'View',opts:['Final','Matte'],def:'Final'}
  ],
  match:[/^Difference Matte$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;                       // no clean plate → no-op
    const above=l2.getContext('2d').getImageData(0,0,W,H).data;
    const tol=pval(c,'fx2diffTol',fr,0.1)*255;                     // tolerance in 0..255 channel units
    const soft=pval(c,'fx2diffSoft',fr,0.1)*255;                   // softness band above tolerance
    const view=c.fx2diffView||'Final';
    const A=lg.getImageData(0,0,W,H),d=A.data;
    for(let i=0;i<d.length;i+=4){
      const a0=d[i+3]; if(a0===0)continue;
      const ba=above[i+3];
      // max per-channel absolute difference (alpha-weighted by the plate's coverage)
      let diff;
      if(ba===0){ diff=255; }                                      // no plate here → keep (fully different)
      else {
        const dr=Math.abs(d[i]-above[i]), dg=Math.abs(d[i+1]-above[i+1]), db=Math.abs(d[i+2]-above[i+2]);
        diff=Math.max(dr,dg,db)*(ba/255);
      }
      // matte: 0 where it matches the plate (diff<=tol), ramps to 1 across the softness band
      let m;
      if(diff<=tol) m=0;
      else if(soft<=0) m=1;
      else m=clamp((diff-tol)/soft,0,1);
      if(view==='Matte'){
        const g=m*255; d[i]=g;d[i+1]=g;d[i+2]=g;d[i+3]=255;        // show the matte as greyscale
      } else {
        // key out the background: scale this layer's alpha by the matte (blended by Amount)
        d[i+3]=a0*(1-(1-m)*val);
      }
    }
    lg.putImageData(A,0,0);
  }
});

// ── Perspective ▸ 3D Glasses — fuse THIS (left eye) + ABOVE (right eye) into a 3D view ──
R({
  field:'fx2glasses3d', name:'3D Glasses', cat:'Perspective', color:'#B05B8B', needs2nd:true,
  def:0, applyVal:1, paramLabel:'Amount', range:[0,1,0.01],
  extra:[
    {kind:'seg',sub:'fx2g3Mode',label:'Mode',opts:['Anaglyph','Balanced','Stereo Pair'],def:'Anaglyph'},
    {kind:'slider',sub:'fx2g3Conv',label:'Convergence',min:-100,max:100,step:1,def:0}
  ],
  match:[/^3D Glasses$/i],
  render(api,val){
    const {lg,W,H,c,fr,pval,k,clamp}=api;
    const l2=api.getLayer2(); if(!l2)return;                       // no right-eye layer → no-op
    const right=l2.getContext('2d').getImageData(0,0,W,H).data;    // ABOVE = right eye
    const mode=c.fx2g3Mode||'Anaglyph';
    const conv=Math.round(pval(c,'fx2g3Conv',fr,0)*k);             // horizontal shift of the right eye (px)
    const A=lg.getImageData(0,0,W,H),d=A.data,left=new Uint8ClampedArray(d),sampL=mkSamp(left,W,H),sampR=mkSamp(right,W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=(y*W+x)*4;
      // left eye = THIS layer at (x,y); right eye = ABOVE shifted by convergence
      const lr=sampL(x,y,0), lg2=sampL(x,y,1), lb=sampL(x,y,2), la=sampL(x,y,3);
      const rx=x-conv;
      const rr=sampR(rx,y,0), rg=sampR(rx,y,1), rb=sampR(rx,y,2), ra=sampR(rx,y,3);
      let nr,ng,nb,na;
      if(mode==='Stereo Pair'){
        // side-by-side: left half = left eye, right half = right eye (each squeezed to half width)
        if(x<W*0.5){ const sx=x*2; nr=sampL(sx,y,0);ng=sampL(sx,y,1);nb=sampL(sx,y,2);na=sampL(sx,y,3); }
        else { const sx=(x-W*0.5)*2-conv; nr=sampR(sx,y,0);ng=sampR(sx,y,1);nb=sampR(sx,y,2);na=sampR(sx,y,3); }
      } else if(mode==='Balanced'){
        // balanced anaglyph: dim red on left, equal cyan from right → less retinal rivalry
        nr=0.299*lr+0.587*lg2+0.114*lb;                            // luma of left into the red channel
        ng=rg; nb=rb;
        na=Math.max(la,ra);
      } else {
        // standard red-cyan anaglyph: R from left eye, G+B from right eye
        nr=lr; ng=rg; nb=rb;
        na=Math.max(la,ra);
      }
      // blend the fused 3D result over the original left eye by Amount
      d[i]  =clamp(lr +(nr -lr )*val,0,255);
      d[i+1]=clamp(lg2+(ng -lg2)*val,0,255);
      d[i+2]=clamp(lb +(nb -lb )*val,0,255);
      d[i+3]=clamp(la +(na -la )*val,0,255);
    }
    lg.putImageData(A,0,0);
  }
});

  console.log('[LP_FX] registered', window.LP_FX.list.length, 'effect modules');
})();
