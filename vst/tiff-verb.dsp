declare name "TIFF VERB";
declare author "LOONEY VISION";
declare description "Stereo reverb — SIZE / TONE / PRE-DLY / RETURN. The ARKITECT verb, as a plugin.";
import("stdfaust.lib");

// Your 4 knobs. (The browser version is a convolution reverb on a generated IR;
// this VST uses a high-quality algorithmic reverb tuned to the same controls.
// Sounds pro — if you want the EXACT convolution character later, that's a
// separate convolution build.)
size   = hslider("SIZE[style:knob]",    2.2,  0.4,   6.0,   0.1);   // decay (seconds)
tone   = hslider("TONE[style:knob]",   6000,  800, 14000,   100);   // HF damping (Hz)
predly = hslider("PRE-DLY[style:knob]",  20,    0,   120,     1);   // pre-delay (ms)
ret    = hslider("RETURN[style:knob]",  0.8,    0,   1.5,  0.01);   // wet level

// zita_rev1_stereo(rdel, f1, f2, t60dc, t60m, fsmax):
//   rdel = pre-delay ms, f1 = low crossover, f2 = HF damping, t60* = decay times
verb = re.zita_rev1_stereo(predly, 200, tone, size, size, 48000);

// dry pair + wet pair (wet scaled by RETURN), summed back to stereo
process = _,_ <: ( _,_ , (verb : *(ret), *(ret)) ) :> _,_;
