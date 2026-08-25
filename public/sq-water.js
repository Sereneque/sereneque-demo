/* Sereneque — the water surface.
   The wave maths here is the routine already written for the home page
   (three wave trains, radial decay, specular banding) which was never wired
   to a canvas. This is that routine, standalone, so any page can use it.

   Original per-pixel version recomputed three cosines for every pixel every
   frame. The field only ever depends on radius, so the slope is computed once
   per radius into a lookup and the pixels just read from it — same picture,
   a fraction of the work. */
(function () {
  var N = 300;                 // internal resolution; her constants are tuned to this
  var C = N / 2;
  var WAVES = [
    { k: 2 * Math.PI / 34, w: 1.05, a: 1.00, p: 0   },
    { k: 2 * Math.PI / 52, w: 0.72, a: 0.75, p: 2.1 },
    { k: 2 * Math.PI / 23, w: 1.50, a: 0.42, p: 4.4 }
  ];

  function mount(host) {
    var cv = document.createElement("canvas");
    cv.className = "sq-water";
    cv.width = N; cv.height = N;
    host.insertBefore(cv, host.firstChild);

    var ctx = cv.getContext("2d");
    var img = ctx.createImageData(N, N);
    var d = img.data;

    // radius per pixel, once
    var radIdx = new Uint16Array(N * N);
    var inside = new Uint8Array(N * N);
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var i = y * N + x, dx = x - C + 0.5, dy = y - C + 0.5;
        var r = Math.sqrt(dx * dx + dy * dy);
        radIdx[i] = r | 0;
        inside[i] = r <= C ? 1 : 0;
      }
    }

    // per-radius constants, once
    var RMAX = (C | 0) + 2;
    var decay = new Float32Array(RMAX), edge = new Float32Array(RMAX);
    for (var r2 = 0; r2 < RMAX; r2++) {
      decay[r2] = Math.exp(-r2 / 150) * Math.min(1, r2 / 26);
      var e = 1 - Math.min(1, Math.max(0, (r2 - C * 0.55) / (C * 0.45)));
      edge[r2] = 0.35 + 0.65 * e;
    }

    var alpha = new Float32Array(RMAX);
    var t0 = performance.now();
    var raf = 0;

    function frame(now) {
      if (!cv.isConnected) { cancelAnimationFrame(raf); return; }
      var t = (now - t0) / 1000;

      // slope -> lit -> alpha, once per radius
      for (var r = 0; r < RMAX; r++) {
        var slope = 0;
        for (var j = 0; j < 3; j++) {
          var wv = WAVES[j];
          slope += wv.a * wv.k * decay[r] * Math.cos(wv.k * r - wv.w * t * 6.28 + wv.p);
        }
        var lit = (slope > 0 ? slope * 0.5 : -slope * 0.16);
        alpha[r] = Math.min(1, lit * 1.35) * edge[r] * 190;
      }

      for (var i = 0, p = 0; i < N * N; i++, p += 4) {
        if (!inside[i]) { d[p + 3] = 0; continue; }
        d[p] = 255; d[p + 1] = 255; d[p + 2] = 252;
        d[p + 3] = alpha[radIdx[i]];
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(frame);
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame(t0 + 900);           // one still frame, no animation
    } else {
      raf = requestAnimationFrame(frame);
    }
  }

  function ensure() {
    var host = document.querySelector(".sq-wm") || document.querySelector(".sq-backdrop");
    if (host && !host.querySelector("canvas.sq-water")) mount(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensure);
  } else {
    ensure();
  }
  // the template re-renders and can drop the canvas, so keep an eye on it
  setInterval(ensure, 900);
})();
