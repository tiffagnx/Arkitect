declare name "Telephone";
declare author "LOONEY VISION";
declare description "Lo-fi bandpass (600Hz–3.2kHz), wet/dry. The ARKITECT 'Telephone'.";
import("stdfaust.lib");

amt  = hslider("AMT[style:knob]", 1, 0, 1, 0.01);
band = fi.highpass(2, 600) : fi.lowpass(2, 3200);
chan(x) = x * (1 - amt) + band(x) * amt;

process = chan, chan;   // stereo
