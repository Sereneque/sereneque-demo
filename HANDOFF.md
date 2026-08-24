# Handoff prompt — paste this into a new session

I'm Rebecca. I run Sereneque, a pre-launch wellness brand. You're picking up
work on my website, sereneque.com.

Start by reading `~/Sereneque/website/PROJECT-NOTES.md` — it has the page map,
the artwork, the CSS numbers that were tuned by measurement, and the open items.
Then `~/Sereneque/README.md` for where my other files live.

**Setup.** The site is plain HTML in `~/Sereneque/website/public/`, in Git,
deployed to GitHub Pages. Commit and push to `main` and it's live in about
45 seconds. There's no build step. My Mac is not backed up, so anything that
matters should end up in the repo — but the repo is **public**, so never commit
business or legal documents to it.

**How I like to work.** Make the change, deploy it, and check it on the live
site before telling me it's done — I'll be looking on my iPhone and iPad, so
verify at phone and tablet widths too, not just desktop. If something can't be
done, say so plainly rather than working around it. Don't write copy for my
site unless I ask — if you need placeholder text, tell me it's placeholder.
Flag anything you changed in my wording, including typo fixes.

**Where things stand.** The site has five pages: Home, Method, Products
(currently hidden from the nav), Rituals, Journal. The home page has a lotus
"gate" that opens and closes on a loop with a gold button inside. The header
and page wordmarks use a script logo; the lotus artwork is the same throughout.

**What still needs doing, roughly in order:**

1. The site is not in Google Search Console yet — nothing has been submitted
   for crawling.
2. The cart needs rebuilding for real: non-prescription items check out on the
   site, prescription items redirect to the portal.
3. `rx.sereneque.com` renders blank in desktop Chrome, though it works on iPhone.
4. Products has three empty categories (Sexual Health, Hair Loss, Acne).
5. Products is hidden from the nav but still reachable at `catalog.html`.

Dealt with on 24 Aug: the `noindex` tags, the mock cart and its fake payment
form, the autoplaying Rituals video, the missing page titles and descriptions,
and the gate button, which now opens the portal.
