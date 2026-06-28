/* ============================================================================
   audio-ear.js — the agents' EAR (the free, local half of hearing).
   Decodes ANY audio file in the browser (Web Audio handles wav/mp3/m4a/ogg/flac)
   and pulls the same hard numbers the studio measures off a stem: length,
   loudness (peak/RMS), dynamics (crest), brightness (spectral centroid), and the
   spectral balance (sub/low/mid/hi/air). No model, no key, no upload — pure math.
   The transcript (lyrics) is added server-side by Whisper; this is the "what does
   it SOUND like" half. Exposes window.DMV_EAR.analyze(file) -> Promise<metrics>.
   ============================================================================ */
(function () {
  "use strict";
  if (window.DMV_EAR) return;

  function db(x) { return 20 * Math.log10(Math.max(x, 1e-9)); }

  // iterative radix-2 FFT, in place (win must be a power of two)
  function fft(re, im) {
    var n = re.length, i, j, bit, len, k, ang, wr, wi, cr, ci, ur, ui, vr, vi, ncr, tr, ti;
    for (i = 1, j = 0; i < n; i++) {
      for (bit = n >> 1; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { tr = re[i]; re[i] = re[j]; re[j] = tr; ti = im[i]; im[i] = im[j]; im[j] = ti; }
    }
    for (len = 2; len <= n; len <<= 1) {
      ang = -2 * Math.PI / len; wr = Math.cos(ang); wi = Math.sin(ang);
      for (i = 0; i < n; i += len) {
        cr = 1; ci = 0;
        for (k = 0; k < len / 2; k++) {
          ur = re[i + k]; ui = im[i + k];
          vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
          vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k] = ur + vr; im[i + k] = ui + vi;
          re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
          ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
  }

  // averaged magnitude spectrum → centroid (brightness) + band percentages
  function spectral(mono, sr) {
    var win = 4096, half = win / 2;
    var re = new Float32Array(win), im = new Float32Array(win), acc = new Float32Array(half + 1);
    var hann = new Float32Array(win), i, k, p, cnt = 0;
    for (i = 0; i < win; i++) hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (win - 1));
    var step = Math.max(win, Math.floor((mono.length - win) / 60)) || win;
    for (p = 0; p + win <= mono.length; p += step) {
      for (i = 0; i < win; i++) { re[i] = mono[p + i] * hann[i]; im[i] = 0; }
      fft(re, im);
      for (k = 0; k <= half; k++) acc[k] += Math.sqrt(re[k] * re[k] + im[k] * im[k]);
      cnt++;
    }
    var binHz = sr / win, tot = 0, csum = 0;
    for (k = 0; k <= half; k++) { acc[k] /= Math.max(cnt, 1); tot += acc[k]; csum += acc[k] * k * binHz; }
    tot = tot || 1;
    var defs = [["sub", 0, 120], ["low", 120, 500], ["mid", 500, 2000], ["hi", 2000, 8000], ["air", 8000, sr / 2]];
    var bands = {};
    defs.forEach(function (d) {
      var s = 0; for (k = 0; k <= half; k++) { var f = k * binHz; if (f >= d[1] && f < d[2]) s += acc[k]; }
      bands[d[0]] = Math.round(100 * s / tot);
    });
    return { centroid: Math.round(csum / tot), bands: bands };
  }

  // resample mono → 16 kHz and encode a small 16-bit WAV data URL (Whisper's native rate;
  // keeps the transcription upload tiny + under the 25 MB API cap on any real song)
  function wav16k(mono, sr) {
    try {
      var target = 16000, ratio = sr / target, outLen = Math.floor(mono.length / ratio);
      if (outLen < 1) return "";
      var out = new Float32Array(outLen), i, j, s, c, st, en;
      for (i = 0; i < outLen; i++) {
        st = Math.floor(i * ratio); en = Math.min(mono.length, Math.floor((i + 1) * ratio));
        s = 0; c = 0; for (j = st; j < en; j++) { s += mono[j]; c++; }
        out[i] = c ? s / c : 0;
      }
      var n = out.length, ab = new ArrayBuffer(44 + n * 2), dv = new DataView(ab);
      function ws(o, str) { for (var k = 0; k < str.length; k++) dv.setUint8(o + k, str.charCodeAt(k)); }
      ws(0, "RIFF"); dv.setUint32(4, 36 + n * 2, true); ws(8, "WAVE"); ws(12, "fmt ");
      dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
      dv.setUint32(24, target, true); dv.setUint32(28, target * 2, true); dv.setUint16(32, 2, true);
      dv.setUint16(34, 16, true); ws(36, "data"); dv.setUint32(40, n * 2, true);
      var o = 44, v; for (i = 0; i < n; i++) { v = out[i] < -1 ? -1 : out[i] > 1 ? 1 : out[i]; dv.setInt16(o, v < 0 ? v * 32768 : v * 32767, true); o += 2; }
      var bytes = new Uint8Array(ab), bin = "", CH = 0x8000;
      for (i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
      return "data:audio/wav;base64," + btoa(bin);
    } catch (e) { return ""; }
  }

  async function analyze(file) {
    try {
      var bytes = await file.arrayBuffer();
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return { ok: false, error: "no Web Audio" };
      var ctx = new Ctx();
      var audio = await ctx.decodeAudioData(bytes.slice(0));
      try { ctx.close(); } catch (e) {}
      var sr = audio.sampleRate, ch = audio.numberOfChannels, dur = audio.duration, N = audio.length;
      var mono = new Float32Array(N), c, i, d;
      for (c = 0; c < ch; c++) { d = audio.getChannelData(c); for (i = 0; i < N; i++) mono[i] += d[i] / ch; }
      var peak = 0, sum = 0, a;
      for (i = 0; i < N; i++) { a = mono[i] < 0 ? -mono[i] : mono[i]; if (a > peak) peak = a; sum += mono[i] * mono[i]; }
      var rms = Math.sqrt(sum / N), peakDb = db(peak), rmsDb = db(rms);
      var sp = spectral(mono, sr);
      return {
        ok: true, name: file.name || "audio", durationSec: +dur.toFixed(1), sampleRate: sr, channels: ch,
        peakDb: +peakDb.toFixed(1), rmsDb: +rmsDb.toFixed(1), crestDb: +(peakDb - rmsDb).toFixed(1),
        centroidHz: sp.centroid, bands: sp.bands,
        whisperWav: wav16k(mono, sr)   // compact 16kHz-mono WAV for transcription (tiny + under the 25 MB cap)
      };
    } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
  }

  // ── LIVE LISTEN — the agent's ear on the MIC (the "rich voice" half) ─────────
  // Runs ALONGSIDE the browser's speech-to-text: while SR turns your words into
  // text, THIS turns the SOUND of your voice into numbers — pitch (note + cents),
  // range, sung-vs-spoken, and energy. Pure local DSP, no upload, no key.
  // startListen() opens the mic and polls pitch every animation frame; the handle's
  // stop() returns the take summary SYNCHRONOUSLY (so send() can read it the moment
  // you hit ➤), then tears the audio graph down in the background.
  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  function freqToNote(f) {
    var midi = 69 + 12 * Math.log2(f / 440), rounded = Math.round(midi);
    var cents = Math.round((midi - rounded) * 100), pc = ((rounded % 12) + 12) % 12;
    return { midi: midi, pc: pc, name: NOTE_NAMES[pc], octave: Math.floor(rounded / 12) - 1,
             label: NOTE_NAMES[pc] + (Math.floor(rounded / 12) - 1), cents: cents };
  }
  function midiToLabel(m) { return freqToNote(440 * Math.pow(2, (m - 69) / 12)).label; }

  // range-limited normalized autocorrelation → {f, clarity, rms}. Vocal F0 only
  // (70–1000 Hz) so the inner loop stays cheap enough to run every frame. clarity
  // (peak / zero-lag energy) is the honesty meter — low clarity = don't trust it.
  function detectPitch(buf, sr) {
    var n = buf.length, i, rms = 0;
    for (i = 0; i < n; i++) { var v = buf[i]; rms += v * v; }
    rms = Math.sqrt(rms / n);
    if (rms < 0.012) return { f: -1, clarity: 0, rms: rms };   // too quiet to trust
    var minLag = Math.floor(sr / 1000), maxLag = Math.floor(sr / 70);
    if (maxLag > n - 1) maxLag = n - 1;
    var c0 = 0; for (i = 0; i < n; i++) c0 += buf[i] * buf[i];
    var best = -1, bestLag = -1, lag, sum, j;
    for (lag = minLag; lag <= maxLag; lag++) {
      sum = 0; for (j = 0; j < n - lag; j++) sum += buf[j] * buf[j + lag];
      if (sum > best) { best = sum; bestLag = lag; }
    }
    if (bestLag < 1) return { f: -1, clarity: 0, rms: rms };
    var x1 = 0, x3 = 0, s, k;                                   // parabolic interp for sub-sample lag
    s = 0; for (k = 0; k < n - (bestLag - 1); k++) s += buf[k] * buf[k + bestLag - 1]; x1 = s;
    s = 0; for (k = 0; k < n - (bestLag + 1); k++) s += buf[k] * buf[k + bestLag + 1]; x3 = s;
    var a = (x1 + x3 - 2 * best) / 2, b = (x3 - x1) / 2, lagI = bestLag;
    if (a) lagI = bestLag - b / (2 * a);
    return { f: sr / lagI, clarity: c0 ? best / c0 : 0, rms: rms };
  }

  // fold the accumulated frames into one plain-English read of how it was performed
  function summarize(frames, sr, durSec) {
    var total = frames.length || 1, i;
    var conf = frames.filter(function (fr) { return fr.clarity > 0.9 && fr.f > 70 && fr.f < 1000; });
    var peakRms = 0, sumRms = 0;
    for (i = 0; i < frames.length; i++) { var r = frames[i].rms; if (r > peakRms) peakRms = r; sumRms += r; }
    var avgRms = frames.length ? sumRms / frames.length : 0, energyDb = db(avgRms);
    var energyWord = energyDb > -14 ? "high" : energyDb > -24 ? "medium" : "soft";
    var base = { ok: true, energyWord: energyWord, peakDb: +db(peakRms).toFixed(1),
                 rmsDb: +energyDb.toFixed(1), durationSec: +(durSec || 0).toFixed(1) };
    if (conf.length < 6) {
      return Object.assign(base, { voiced: false, kind: "quiet", confidence: conf.length / total,
        line: "soft / mostly spoken — couldn't lock a clear pitch", chip: "no clear pitch · energy " + energyWord });
    }
    var midis = conf.map(function (fr) { return fr.midi; }).sort(function (a, b) { return a - b; });
    var lo = midiToLabel(midis[0]), hi = midiToLabel(midis[midis.length - 1]);
    var range = Math.round(midis[midis.length - 1] - midis[0]);
    var med = midiToLabel(midis[Math.floor(midis.length / 2)]);
    var pcw = new Array(12).fill(0), ac = 0;
    conf.forEach(function (fr) { var nn = freqToNote(fr.f); pcw[nn.pc] += fr.clarity; ac += Math.abs(nn.cents); });
    var domPc = 0; for (i = 1; i < 12; i++) if (pcw[i] > pcw[domPc]) domPc = i;
    var center = NOTE_NAMES[domPc], avgCents = Math.round(ac / conf.length);
    var tune = avgCents < 12 ? "right on the note" : avgCents < 25 ? "a touch off (slightly flat/sharp)" : "noticeably off-pitch in spots";
    var voicedFrac = conf.length / total, sung = voicedFrac >= 0.4 && conf.length >= 12;
    if (sung) {
      return Object.assign(base, { voiced: true, kind: "sung", center: center, medNote: med,
        lowNote: lo, highNote: hi, rangeSemitones: range, avgCents: avgCents,
        confidence: Math.min(1, voicedFrac + 0.2),
        line: "sung/held · centered ~" + center + " (" + med + ") · low " + lo + " to top " + hi
            + " · ~" + range + " semitone" + (range === 1 ? "" : "s") + " range · " + tune + " · energy " + energyWord,
        chip: "sung · ~" + center + " · " + med + " · " + tune + " · energy " + energyWord });
    }
    return Object.assign(base, { voiced: true, kind: "spoken", lowNote: lo, highNote: hi,
      confidence: Math.min(1, voicedFrac + 0.2),
      line: "more spoken than sung · energy " + energyWord + " · pitch wandered " + lo + "–" + hi,
      chip: "spoken · energy " + energyWord });
  }

  // open the mic, poll pitch ~60fps, hand back a {stop()} handle
  function startListen(onLevel, onBlob) {
    var h = { frames: [], raf: 0, ctx: null, stream: null, mr: null, t0: (window.performance ? performance.now() : 0), stopped: false, started: false, sr: 44100 };
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { stop: function () { return { ok: false, error: "no mic / Web Audio" }; } };
    }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      .then(function (stream) {
        if (h.stopped) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
        var ctx = new Ctx(), src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser();
        an.fftSize = 2048; src.connect(an);
        var buf = new Float32Array(an.fftSize);
        h.ctx = ctx; h.stream = stream; h.sr = ctx.sampleRate; h.started = true;
        // Also RECORD the take (same mic stream — no extra prompt) so the words can be re-transcribed
        // by Whisper (uncensored + more accurate) when the browser's speech engine bleeps a cuss.
        try {
          if (onBlob && window.MediaRecorder) {
            var chunks = [];
            var mr = new MediaRecorder(stream);
            mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
            mr.onstop = function () { try { onBlob(new Blob(chunks, { type: mr.mimeType || "audio/webm" })); } catch (e) {} };
            h.mr = mr; mr.start();
          }
        } catch (e) {}
        var poll = function () {
          if (h.stopped) return;
          an.getFloatTimeDomainData(buf);
          var p = detectPitch(buf, h.sr);
          h.frames.push({ f: p.f, clarity: p.clarity, rms: p.rms, midi: p.f > 0 ? 69 + 12 * Math.log2(p.f / 440) : -1 });
          if (onLevel) { try { onLevel(Math.min(1, (p.rms || 0) * 4)); } catch (e) {} }   // live level → the "alive" meter
          h.raf = requestAnimationFrame(poll);
        };
        h.raf = requestAnimationFrame(poll);
      })
      .catch(function () { /* mic denied / unavailable — stop() returns ok:false */ });

    return {
      stop: function () {
        h.stopped = true;
        if (h.raf) cancelAnimationFrame(h.raf);
        var dur = (window.performance ? (performance.now() - h.t0) : 0) / 1000;
        var summary = (h.started && h.frames.length) ? summarize(h.frames, h.sr, dur) : { ok: false, error: "no audio captured" };
        try { if (h.mr && h.mr.state !== "inactive") h.mr.stop(); } catch (e) {}   // flush recording → onBlob (async)
        try { if (h.stream) h.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        try { if (h.ctx) h.ctx.close(); } catch (e) {}
        return summary;
      }
    };
  }

  // ── PITCH CHECK — play a KNOWN note + prove the detector reads it (for someone who "just sings"
  //    and doesn't know notes: the tone is the answer key). playNote() = hear it; testNote() = synth
  //    the exact tone into a buffer, run the SAME detectPitch on it, return expected-vs-detected. ──
  var NOTE_FREQS = { "C3": 130.81, "E3": 164.81, "G3": 196.00, "A3": 220.00, "C4": 261.63, "E4": 329.63, "A4": 440.00 };
  function noteFreq(name) { return NOTE_FREQS[name] || 440; }
  function playTone(freq, secs) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      var ac = new Ctx(); if (ac.state === "suspended") { try { ac.resume(); } catch (e) {} }
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = freq; g.gain.value = 0.0001;
      o.connect(g); g.connect(ac.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (secs || 1.6));
      o.stop(ac.currentTime + (secs || 1.6) + 0.05);
      o.onended = function () { try { ac.close(); } catch (e) {} };
    } catch (e) {}
  }
  function testNote(freq) {
    try {
      var sr = 44100, n = sr, buf = new Float32Array(n), i;
      for (i = 0; i < n; i++) buf[i] = Math.sin(2 * Math.PI * freq * i / sr) * 0.6;
      var p = detectPitch(buf, sr), det = p.f > 0 ? freqToNote(p.f) : null;
      return { ok: p.f > 0, expectedHz: Math.round(freq), expected: freqToNote(freq).label,
               detected: det ? det.label : "—", detectedHz: p.f > 0 ? Math.round(p.f) : 0,
               cents: det ? det.cents : 0, clarity: +(p.clarity || 0).toFixed(2) };
    } catch (e) { return { ok: false }; }
  }

  window.DMV_EAR = { analyze: analyze, startListen: startListen, noteFreq: noteFreq,
                     playNote: function (name) { playTone(noteFreq(name)); },
                     testNote: function (name) { return testNote(noteFreq(name)); } };
  try { console.log("%c[DMV Ear] ready — browser audio analysis (loudness/brightness/dynamics)", "color:#7BB6CD"); } catch (e) {}
})();
