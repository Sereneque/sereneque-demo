# Sereneque site — working notes

Live at **sereneque.com**. Domain at GoDaddy, DNS pointed at GitHub Pages.
Repo `Sereneque/sereneque-demo`, branch `main`, served from `public/`.
Local folder: `~/Sereneque/website` (moved out of `~/Projects` on 24 Aug).
Every push triggers a GitHub Actions deploy; it goes live in roughly 45 seconds.

## Pages

| File | Tab | Notes |
|---|---|---|
| `index.html` | Home | The lotus "gate" that opens and closes on a loop |
| `method.html` | Method | The Wellness Method copy |
| `rituals.html` | Rituals | Three videos. Plain HTML, not the template |
| `journal.html` | Journal | Intro + first entry. Plain HTML |
| `catalog.html` | Products | Yoga / Wellness / Lotions. Back in the nav 24 Aug |

`index.html`, `method.html` and `catalog.html` are Claude Design `<x-dc>` templates —
React renders them, so anything injected by script can be wiped on re-render.
That is why the mobile menu re-tags itself every 500ms.
`rituals.html` and `journal.html` are plain HTML (React strips `muted`/`loop` from `<video>`).

## Artwork

| File | Used for |
|---|---|
| `sereneque-header-script.png` | Header lockup: lotus + script wordmark |
| `sereneque-wordmark-script.png` | The wordmark at the top of every page |
| `sereneque-lotus-mark.png` | The gate on Home, the watermark on the other pages |
| `sereneque-wordmark-gold.png` | The older serif wordmark — kept, not in use |
| `sereneque-header-logo.png` | The older serif lockup — kept, not in use |

All were keyed out of JPGs that had a checkerboard baked in; keying is done on
warmth (gold and ruby read warm, the checkerboard is neutral) rather than on
lightness, so pale highlights inside the letters survive.

## The gate (Home)

Two full-size copies of the lotus, clipped to left and right halves, hinged on
their outer edges so they part from the centre outward.

- Opens 1s after load, holds 8s, the button clears away, then the doors shut. Repeats.
- The swing is 2.6s and the CSS duration must match `SWING` in the script.
- `SQ_GATE_LINK` near the bottom of `index.html` points at
  `https://rx.sereneque.com`, the customer portal, and opens in a new tab.
  Change the URL between the quotes to move it.

Numbers that have been tuned by measurement, not guesswork:

- Gate width `min(600px, 82vw)`.
- `.sq-reveal { top: calc(50% - 27px) }` — the lotus sits 27px below the ring
  centre because of its 54px top margin; this backs that out so the button
  lands on the ring.
- Hero floors: `max(86vh, 1110px)` on desktop, `830px` under 760px wide.
  Sizing the hero off `86vh` alone lets the flower ride up into the paragraph
  on short or landscape screens.

## Rituals video

Three clips, ~46MB in total. They do **not** autoplay: each `<video>` carries a
`poster` still and `preload="none"`, so a visitor downloads nothing until they
tap play. The stills are `sereneque-<name>-poster.jpg`, about 146KB together,
pulled out of the clips with ffmpeg.

A small script sets volume to 0.12 on play and pauses the other two, so only one
runs at a time. Because a tap is a user gesture, the clips are no longer muted —
tapping play gives quiet sound.

`-short` versions of two clips still exist and are unused; with tap-to-play the
file sizes no longer cost anything on load.

## Search

- Every page has a `<title>`, a canonical link and `lang="en"`. Titles follow
  `<Page> — Sereneque`. Home, Method and Products had no title at all until
  24 Aug; Google had nothing to show in a result.
- Meta descriptions are lifted word for word from copy already on the page.
  Rituals has no prose to quote, so it has none — Google will compose one.
- `sitemap.xml` lists the four public pages and is referenced from `robots.txt`.
  `catalog.html` is deliberately absent.
- `catalog.html` is public as of 24 Aug: no `noindex`, in the nav, in the
  sitemap. `robots.txt` allows everything.
- Not done yet: the site is not registered in Google Search Console, so nothing
  has been submitted for crawling and there is no coverage reporting.

## Conventions

- Header 72px; logo 52px, 44px on mobile.
- Footer 41px, pinned to the bottom with `margin-top: auto` in a flex column.
  Centred blocks in that column need `width: 100%` or they shrink to fit.
- Mobile breakpoint 760px. The nav links collapse into the burger at top right.
- Gold `#b08a35` / `#f1dd9e`, deep teal `#143035`, soft teal `#3d6a71`.
- Body type Jost; anything in serif is Cormorant Garamond.

## Open items

1. **Products needs real products.** The six tiles are SAMPLE placeholders on
   a neutral `product-placeholder.svg`. Needed: names, prices, photography.
   The peptide and Rx range was removed on 24 Aug — that all routes through
   the portal now.
2. **Nothing on this site can take money yet.** The mock cart came out on
   24 Aug (commit `35d331d` has the markup). GoDaddy's store **cannot** be
   embedded here — their docs are clear, there is no buy button or API. So a
   real cart on `sereneque.com` means a third-party embed (Shopify Buy
   Button, Snipcart, Ecwid), or pointing the domain at GoDaddy and losing
   this site. Decision still open.
3. **There is a second, separate store on GoDaddy** at
   `sereneque.godaddysites.com` — Websites + Marketing Commerce, paid to
   June 2027, with four SAMPLE products loaded. Its products do not display
   on the published page; shipping is unset and that is the likeliest cause.
   GoDaddy Payments is fully set up and can take money (PNC ••••6194).
4. **Google Search Console.** Not registered. Nothing submitted for crawling.
5. **`rx.sereneque.com` renders blank in desktop Chrome.** Valid certificate,
   title loads, body paints nothing. Works on iPhone. Check before sending
   customers through the gate button.

No newsletter — decided against it on 24 Aug.

## Backups

`website/` is mirrored on GitHub, so the site, its artwork and
`brand-source/` survive this Mac. **The repo is public** — business and legal
documents must never be committed to it. Those live in
`~/Desktop/Desktop Folder/Sereneque/` and are backed up nowhere.

## Things learned the hard way

- Wide white glows (`drop-shadow(0 0 20px …)`) wash out fine gold strokes once
  they are scaled down for a phone. Small text needs a smaller glow, or none.
- White lettering on pale gold measures about 1.35:1 contrast. It needs a
  layered dark shadow underneath to be readable at all.
- `overflow-x: hidden` plus a flex column changes how centred children size
  themselves. Check widths after touching either.
- GitHub Pages deploys fail with a 503 during their outages. Re-push an empty
  commit; nothing is wrong with the site.
- The three `<x-dc>` pages need React from unpkg to render at all, so they
  cannot be previewed anywhere without network access to that CDN. To check
  them at phone and tablet widths, load the live pages into fixed-width
  iframes — media queries inside an iframe key off the iframe's width.
