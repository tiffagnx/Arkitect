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

  window.DMV_EAR = { analyze: analyze };
  try { console.log("%c[DMV Ear] ready — browser audio analysis (loudness/brightness/dynamics)", "color:#7BB6CD"); } catch (e) {}
})();
