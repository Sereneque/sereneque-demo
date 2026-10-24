// Sereneque — site-wide cart button behaviour, empty-cart drawer, and the flat phone menu.
(function () {
  var css = document.createElement("style");
  css.textContent =
    "#sqCartScrim{position:fixed;inset:0;z-index:200;background:rgba(20,48,53,.28);opacity:0;pointer-events:none;transition:opacity .25s ease}" +
    "#sqCartScrim.on{opacity:1;pointer-events:auto}" +
    "#sqCart{position:fixed;top:0;right:0;bottom:0;z-index:201;width:min(380px,92vw);padding:28px 26px;" +
    "background:rgba(226,240,237,.94);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);" +
    "border-left:1px solid rgba(178,134,40,.35);box-shadow:-18px 0 44px rgba(20,48,53,.18);" +
    "transform:translateX(105%);transition:transform .3s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;" +
    "font-family:'Jost','Helvetica Neue',Helvetica,sans-serif;color:#143035}" +
    "#sqCart.on{transform:translateX(0)}" +
    "#sqCart .h{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid rgba(178,134,40,.3)}" +
    "#sqCart .h span{font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;color:#143035}" +
    "#sqCart .x{background:none;border:0;cursor:pointer;font-size:22px;line-height:1;color:#2f626a;padding:4px 6px}" +
    "#sqCart .b{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px}" +
    "@keyframes sqCartFloat{0%,100%{transform:translateY(-6px)}50%{transform:translateY(8px)}}" +
    "#sqCart .b img{width:150px;height:auto;opacity:.5;animation:sqCartFloat 9s ease-in-out infinite}" +
    "#sqCart .b h3{margin:10px 0 0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:24px}" +
    "#sqCart .b p{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:17px;color:#2f626a;max-width:260px;line-height:1.45}" +
    "#sqCart .k{margin-top:22px;display:inline-block;padding:10px 26px;border-radius:999px;border:1px solid rgba(178,134,40,.5);" +
    "background:rgba(255,255,255,.45);color:#8a6520;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;letter-spacing:.04em;cursor:pointer}" +
    "#sqCart .f{padding-top:14px;border-top:1px solid rgba(178,134,40,.3);display:flex;justify-content:space-between;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;color:#2f626a}" +
    "@media (prefers-reduced-motion:reduce){#sqCart .b img{animation:none}}" +
    /* phone: the same menu as the desktop, on a second row, no drop-down */
    "@media (max-width:760px){" +
    "body nav:not(#sqMenu){flex-wrap:wrap !important;height:auto !important;padding:8px 14px 9px !important;row-gap:4px !important;gap:10px !important}" +
    "body nav:not(#sqMenu) [data-sq-links]{display:flex !important;order:3;width:100%;justify-content:center;flex-wrap:nowrap !important;" +
    "max-height:none !important;overflow:visible !important;gap:15px !important;font-size:11px !important;letter-spacing:.08em !important}" +
    "body nav:not(#sqMenu) button[data-sq-cart]{position:static !important;order:2;margin-left:auto;width:auto !important;height:32px !important;" +
    "padding:0 12px !important;gap:7px !important;border-radius:999px !important;background:rgba(255,255,255,.35) !important;border:1px solid rgba(178,134,40,.45) !important}" +
    "body nav:not(#sqMenu) button[data-sq-cart] span:first-child{display:inline !important}" +
    "body nav:not(#sqMenu) button[data-sq-cart]::before{display:none !important}" +
    "body nav:not(#sqMenu) button[data-sq-cart] span:last-child{position:static !important}" +
    "#sqBurger{display:none !important}#sqMenu{display:none !important}" +
    "body{padding-top:12px}}";
  document.head.appendChild(css);

  var scrim = document.createElement("div"); scrim.id = "sqCartScrim";
  var cart = document.createElement("aside"); cart.id = "sqCart"; cart.setAttribute("aria-label", "Cart");
  cart.innerHTML =
    '<div class="h"><span>Your cart</span><button class="x" type="button" aria-label="Close">&times;</button></div>' +
    '<div class="b"><img src="./sereneque-lotus-mark.png" alt="">' +
    '<h3>Nothing here yet</h3><p>Our first collection is on its way. The shop opens soon.</p>' +
    '<button class="k" type="button">Keep browsing</button></div>' +
    '<div class="f"><span>Subtotal</span><span>$0.00</span></div>';
  document.body.appendChild(scrim); document.body.appendChild(cart);

  function open(){ scrim.classList.add("on"); cart.classList.add("on"); }
  function close(){ scrim.classList.remove("on"); cart.classList.remove("on"); }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest && t.closest("[data-sq-cart]")) { e.preventDefault(); open(); return; }
    if (t === scrim || (t.closest && (t.closest("#sqCart .x") || t.closest("#sqCart .k")))) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
