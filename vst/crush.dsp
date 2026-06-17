declare name "Crush";
declare author "LOONEY VISION";
declare description "Soft-clip / drive — the ARKITECT 'Crush', as a real plugin.";
import("stdfaust.lib");

// AMT 0..1 drives a tanh saturation curve (same shape as the browser version:
// k = amt*60 + 1, curve = tanh(x*k)/tanh(k))
amt = hslider("AMT[style:knob]", 0.4, 0, 1, 0.01);
k   = amt * 60 + 1;
crush(x) = tanh(x * k) / tanh(k);

process = crush, crush;   // stereo
