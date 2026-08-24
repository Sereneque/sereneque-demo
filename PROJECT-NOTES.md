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
| `catalog.html` | (hidden) | 12 products. Removed from the nav on request |

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
- `SQ_GATE_LINK` near the bottom of `index.html` is **empty** — the button goes nowhere.
  Paste a URL between the quotes and it opens in a new tab.

Numbers that have been tuned by measurement, not guesswork:

- Gate width `min(600px, 82vw)`.
- `.sq-reveal { top: calc(50% - 27px) }` — the lotus sits 27px below the ring
  centre because of its 54px top margin; this backs that out so the button
  lands on the ring.
- Hero floors: `max(86vh, 1110px)` on desktop, `830px` under 760px wide.
  Sizing the hero off `86vh` alone lets the flower ride up into the paragraph
  on short or landscape screens.

## Conventions

- Header 72px; logo 52px, 44px on mobile.
- Footer 41px, pinned to the bottom with `margin-top: auto` in a flex column.
  Centred blocks in that column need `width: 100%` or they shrink to fit.
- Mobile breakpoint 760px. Cart becomes a 42px icon; the count badge is hidden.
- Gold `#b08a35` / `#f1dd9e`, deep teal `#143035`, soft teal `#3d6a71`.
- Body type Jost; anything in serif is Cormorant Garamond.

## Open items

1. **Every page carries `noindex, nofollow`.** Left over from the original
   template. Google will not list the site until those five tags come out.
   `robots.txt` also disallows `catalog.html`, which is deliberate.
2. **The cart is a mock.** It opens a drawer and a fake card form that says
   "simulated payment". It should come out before anyone real visits.
3. **The gate button has no destination.**
4. **No newsletter signup.** A static site cannot store addresses; it needs a
   service (Kit is free to 10,000 subscribers) whose embed code drops into a page.
5. **Rituals carries ~44MB of autoplaying video.** Slow on mobile data.
   `-short` versions of two clips already exist if they are wanted.
6. Products has three empty categories (Sexual Health, Hair Loss, Acne).
7. Products page is hidden from the nav but still reachable at
   `sereneque.com/catalog.html`. That is obscurity, not privacy — a static
   host cannot password-protect a page.

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
