"""
DeMartinville native-plugin host worker (Track A — bring-your-own VST3/AU/Waves).

Runs as a SEPARATE SUBPROCESS, never in the uvicorn event loop: a misbehaving native
plugin can hard-segfault the interpreter with no catchable exception, so isolating each
load/render in its own process means a bad plugin kills one worker, not the app.

Commands (argv):
  scan                                  -> JSON list of installed plugins (+ Waves sub-plugins)
  params  <path> [subname]              -> JSON {name,isEffect,isInstrument,params:[...]}
  render  <path> <subname|-> <params.json> <in.wav> <out.wav>  -> processes audio, writes out.wav

Everything prints a single JSON line to stdout. Errors -> {"error": "..."}.
"""
import sys, os, json, glob, math


def _num(x):
    """A JSON-safe finite float, or None. Plugins expose -inf/nan (e.g. a -∞ dB fader),
    which strict JSON (Starlette uses allow_nan=False) rejects → 500. Drop them."""
    try:
        x = float(x)
        return x if math.isfinite(x) else None
    except Exception:
        return None


def _roots():
    home = os.path.expanduser("~")
    return [
        r"C:\Program Files\Common Files\VST3",
        os.path.join(home, "AppData", "Roaming", "VST3"),
        "/Library/Audio/Plug-Ins/VST3",
        os.path.join(home, "Library", "Audio", "Plug-Ins", "VST3"),
        "/Library/Audio/Plug-Ins/Components",  # AU (macOS)
    ]


def scan():
    import pedalboard
    out = []
    seen = set()
    for root in _roots():
        if not os.path.isdir(root):
            continue
        pat = "*.component" if root.endswith("Components") else "*.vst3"
        for path in glob.glob(os.path.join(root, "**", pat), recursive=True):
            if path in seen:
                continue
            seen.add(path)
            fmt = "AU" if path.endswith(".component") else "VST3"
            entry = {"path": path, "file": os.path.basename(path), "format": fmt, "subnames": []}
            try:
                names = pedalboard.VST3Plugin.get_plugin_names_for_file(path) if fmt == "VST3" else []
                if names and len(names) > 1:
                    entry["subnames"] = names           # e.g. the Waves shell holds hundreds
                entry["name"] = (names[0] if names else os.path.splitext(entry["file"])[0])
            except Exception:
                entry["name"] = os.path.splitext(entry["file"])[0]
            out.append(entry)
    print(json.dumps(out))


def _load(path, sub):
    from pedalboard import load_plugin
    return load_plugin(path, plugin_name=sub) if sub and sub != "-" else load_plugin(path)


def _param_list(p):
    """Every param is driven by its NORMALIZED raw value (0..1) — the one control that
    exists on every param type and sidesteps -inf ranges / categorical quirks. We also
    hand back `choices` (the discrete labels) so the UI can show a real readout/dropdown,
    and the current `text` (e.g. '-7.2 dB', 'Frank Ocean Vocal')."""
    out = []
    try:
        for key, par in p.parameters.items():
            d = {"id": key, "label": (getattr(par, "name", key) or key).strip()}
            raw = _num(getattr(par, "raw_value", None))
            d["raw"] = raw if raw is not None else 0.0
            try:
                t = par.string_value
                if t is not None: d["text"] = str(t).strip()
            except Exception: pass
            try:
                vals = getattr(par, "valid_values", None)
                if vals:
                    vals = [str(x).strip() for x in vals]
                    if 0 < len(vals) <= 2048:        # discrete: labels for dropdown / live readout
                        d["choices"] = vals
            except Exception: pass
            mn, mx = _num(getattr(par, "min_value", None)), _num(getattr(par, "max_value", None))
            if mn is not None: d["min"] = mn          # only finite ranges survive (for continuous display)
            if mx is not None: d["max"] = mx
            try:
                u = getattr(par, "units", "")
                if u: d["unit"] = str(u).strip()
            except Exception: pass
            out.append(d)
    except Exception:
        pass
    return out


def params(path, sub):
    p = _load(path, sub)
    print(json.dumps({
        "name": getattr(p, "name", ""),
        "isEffect": bool(getattr(p, "is_effect", True)),
        "isInstrument": bool(getattr(p, "is_instrument", False)),
        "params": _param_list(p),
    }))


def render(path, sub, params_arg, in_wav, out_wav):
    from pedalboard.io import AudioFile
    p = _load(path, sub)
    pr = {}
    try:
        if params_arg and params_arg not in ("-", ""):
            if os.path.exists(params_arg):                 # a file path (preferred — no argv quoting limits)
                with open(params_arg, "r", encoding="utf-8") as f:
                    pr = json.load(f)
            else:                                          # or inline JSON
                pr = json.loads(params_arg)
    except Exception:
        pr = {}
    for k, v in pr.items():
        try:
            p.parameters[k].raw_value = max(0.0, min(1.0, float(v)))   # normalized — works on every param type
        except Exception:
            try: setattr(p, k, v)                                      # fallback: a real-unit value
            except Exception: pass
    with AudioFile(in_wav) as f:
        sr = f.samplerate
        audio = f.read(f.frames)
    out = p.process(audio, sr)
    chans = out.shape[0] if out.ndim > 1 else 1
    with AudioFile(out_wav, "w", sr, chans) as f:
        f.write(out)
    print(json.dumps({"ok": True, "frames": int(out.shape[-1]), "samplerate": int(sr)}))


def main():
    try:
        cmd = sys.argv[1]
        if cmd == "scan":
            scan()
        elif cmd == "params":
            params(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
        elif cmd == "render":
            render(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
        else:
            print(json.dumps({"error": "unknown command"}))
    except Exception as e:
        print(json.dumps({"error": str(e)[:300]}))


if __name__ == "__main__":
    main()
