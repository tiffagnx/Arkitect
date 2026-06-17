declare name "Saturator";
declare author "LOONEY VISION";
declare description "Tube-ish warmth — Drive + Mix. The Pink Room 'Saturator'.";
import("stdfaust.lib");

drive = hslider("DRIVE[style:knob]", 6, 1, 25, 0.1);
mix   = hslider("MIX[style:knob]", 0.4, 0, 1, 0.01);

sat(x) = tanh(x * drive) / tanh(drive);           // normalized soft clip
wetdry(x) = x * (1 - mix) + sat(x) * mix;

process = wetdry, wetdry;   // stereo
