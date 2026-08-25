/* Sereneque — the water surface behind the lotus.

   Grown out of the wave routine already written into the home page component
   (three wave trains, radial decay, specular banding) which had never been
   wired to a canvas and so had never run.

   Two things make it read as water rather than as rings:
     - the field is sampled on a squashed vertical axis, so the wavefronts are
       ellipses — a surface seen at an angle, not circles seen head on;
     - crests take light and troughs take shadow. Highlights alone look like haze.

   The field only depends on radius, so each frame resolves the wave once per
   radius into a lookup and the pixels just read from it. ~900 cosines a frame
   instead of one per pixel. */
(function () {
  var N = 460;                    // internal resolution, upscaled by CSS
  var C = N / 2;
  var RM = 900;                   // radius table covers the stretched axis
  var SQUASH = 0.42;              // vertical compression = viewing angle
  var ORIGIN_Y = 0.86;            // ripple origin sits a little above centre

  var WAVES = [
    { k: 2 * Math.PI / 82,  w: 1.05, a: 1.00, p: 0   },
    { k: 2 * Math.PI / 132, w: 0.72, a: 0.80, p: 2.1 },
    { k: 2 * Math.PI / 56,  w: 1.50, a: 0.50, p: 4.4 }
  ];

  function mount(host) {
    var cv = document.createElement("canvas");
    cv.className = "sq-water";
    cv.setAttribute("aria-hidden", "true");
    cv.width = N; cv.height = N;
    host.insertBefore(cv, host.firstChild);

    var ctx = cv.getContext("2d");
    var img = ctx.createImageData(N, N);
    var d = img.data;

    var radIdx = new Uint16Array(N * N);
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var dx = x - C + 0.5;
        var dy = (y - C * ORIGIN_Y + 0.5) / SQUASH;
        var r = Math.sqrt(dx * dx + dy * dy);
        radIdx[y * N + x] = r < RM ? (r | 0) : RM - 1;
      }
    }

    var decay = new Float32Array(RM), edge = new Float32Array(RM);
    for (var q = 0; q < RM; q++) {
      decay[q] = Math.exp(-q / 380) * Math.min(1, q / 40);
      edge[q] = Math.max(0, 1 - Math.min(1, Math.max(0, (q - 70) / 470)));
    }

    var lightA = new Float32Array(RM), darkA = new Float32Array(RM);
    var t0 = performance.now(), raf = 0;

    function frame(now) {
      if (!cv.isConnected) { cancelAnimationFrame(raf); return; }
      var t = (now - t0) / 1000;

      for (var r = 0; r < RM; r++) {
        var slope = 0;
        for (var j = 0; j < 3; j++) {
          var wv = WAVES[j];
          slope += wv.a * wv.k * decay[r] * Math.cos(wv.k * r - wv.w * t * 6.28 + wv.p);
        }
        if (slope > 0) {
          lightA[r] = Math.min(1, slope * 3.4) * edge[r] * 132;
          darkA[r] = 0;
        } else {
          lightA[r] = 0;
          darkA[r] = Math.min(1, -slope * 2.8) * edge[r] * 62;
        }
      }

      for (var i = 0, p = 0; i < N * N; i++, p += 4) {
        var ri = radIdx[i], la = lightA[ri];
        if (la > 0) { d[p] = 255; d[p + 1] = 255; d[p + 2] = 252; d[p + 3] = la; }
        else        { d[p] = 26;  d[p + 1] = 74;  d[p + 2] = 80;  d[p + 3] = darkA[ri]; }
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(frame);
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame(t0 + 900);            // one still frame, no animation
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
  setInterval(ensure, 900);       // the template re-renders; keep the canvas alive
})();
