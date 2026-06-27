/* mcp-bridge.js — Layer 2 client bridge for MCP-driven live room control.

   Lets the backend command relay (room_relay.py) drive THIS room's control surface
   so an external MCP client (Claude Desktop) can operate the room. Self-contained,
   room-agnostic, opt-in: just include this <script> in a room and it joins the relay.

   Flow: announce → long-poll /api/room/poll → run the command against the room's
   window.* controls → POST the result. Reuses the SAME window.RoomAPI / window.studio*
   surface the in-app docked agents already use, so nothing else in the room changes.

   The room name is derived from the page filename (studio.html -> "studio"); override
   with window.DMV_ROOM before this script loads if needed. */
(function () {
  "use strict";
  if (window.DMV_BRIDGE) return; // don't double-attach

  var ROOM = (window.DMV_ROOM ||
    (location.pathname.split("/").pop() || "room").replace(/\.html?$/i, "") || "room").toLowerCase();
  var CID = "c_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var stopped = false;

  function post(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body || {}),
    }).then(function (r) { return r.json(); });
  }

  // What can an external caller drive in this room?
  function describe() {
    if (window.RoomAPI && typeof window.RoomAPI.describe === "function") {
      try { return { room: ROOM, roomapi: window.RoomAPI.describe() }; } catch (e) {}
    }
    var methods = [];
    if (window.RoomAPI) {
      for (var k in window.RoomAPI) {
        try { if (typeof window.RoomAPI[k] === "function") methods.push(k); } catch (e) {}
      }
    }
    var globals = [];
    try {
      for (var g in window) {
        if (/^studio[A-Z]/.test(g) && typeof window[g] === "function") globals.push(g);
      }
    } catch (e) {}
    return { room: ROOM, has_roomapi: !!window.RoomAPI, roomapi_methods: methods, window_functions: globals };
  }

  // Run one command against the room's controls. Returns a value or a Promise.
  function execute(cmd) {
    var action = cmd.action || "";
    var args = cmd.args;
    if (action === "__ping") return { pong: true, room: ROOM, url: location.href };
    if (action === "__describe") return describe();
    // 1) a RoomAPI method by name
    if (window.RoomAPI && typeof window.RoomAPI[action] === "function") {
      return window.RoomAPI[action](args);
    }
    // 2) RoomAPI.run(actionObject) — the kit-helper convention
    if (window.RoomAPI && action === "run" && typeof window.RoomAPI.run === "function") {
      return window.RoomAPI.run(args);
    }
    // 3) a global window function by name (covers window.studio* etc.)
    if (typeof window[action] === "function") {
      return window[action](args);
    }
    throw new Error("unknown action '" + action + "' for room '" + ROOM + "'");
  }

  function runCommand(cmd) {
    Promise.resolve()
      .then(function () { return execute(cmd); })
      .then(function (result) {
        var safe;
        try { JSON.stringify(result); safe = (result === undefined ? null : result); }
        catch (e) { safe = String(result); }
        return post("/api/room/result", { id: cmd.id, ok: true, result: safe });
      })
      .catch(function (err) {
        return post("/api/room/result", { id: cmd.id, ok: false, error: (err && err.message) || String(err) });
      });
  }

  function loop() {
    if (stopped) return;
    fetch("/api/room/poll?client_id=" + encodeURIComponent(CID) + "&room=" + encodeURIComponent(ROOM))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.commands || []).forEach(runCommand); })
      .catch(function () { return new Promise(function (res) { setTimeout(res, 1500); }); })
      .then(function () { setTimeout(loop, 50); });
  }

  post("/api/room/hello", { client_id: CID, room: ROOM }).catch(function () {});
  loop();
  window.addEventListener("beforeunload", function () { stopped = true; });
  window.DMV_BRIDGE = { room: ROOM, client_id: CID, describe: describe };
})();
