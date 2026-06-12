# The Mitzvah Calendar — launch site

Pre-launch landing site for **The Mitzvah Calendar**: a 24″×36″ year-at-a-glance
wall calendar of the Jewish year 5787 (Sept 2026 – Sept 2027).
Static HTML/CSS/JS — no build step, no framework — hosted free on **GitHub Pages**.

**Live:** https://dbassin12.github.io/mitzvah-calendar/

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: hero, why, product, how-it-works, schools, sponsor, FAQ, pre-order |
| `styles.css` | Design system — parchment/ink/gold "print-shop" aesthetic |
| `script.js` | Renders the 13-month poster mockup from verified 5787 data + interactions |
| `favicon.svg` | Calendar-dots mark |

## The poster mockup is real data

`script.js` contains month-by-month data for 5787 (a leap year — 13 months,
385 days, Cheshvan & Kislev both 30 days). Day dots are weekday-aligned
(1 Tishrei = Shabbos) and every Yom Tov / fast / Rosh Chodesh is marked at its
true Hebrew date. If you change the year, re-verify: Rosh Hashanah weekday,
Pesach weekday, and that no fast lands on Shabbos.

## Pre-order capture (current: mailto)

The form composes an email to `davidbassin12@gmail.com` — zero backend, works
on GitHub Pages. When ready to upgrade:

1. **Formspree** (free tier): create a form, then in `script.js` replace the
   mailto in `setupForm()` with a `fetch` POST to the Formspree endpoint.
2. **Shopify** (the real store, per the launch plan): point the CTA buttons
   at the product page and retire the form.

## Deploying changes

Pushes to `main` auto-publish via GitHub Pages (branch: `main`, root):

```sh
git add -A && git commit -m "update" && git push
```

Changes go live in ~1 minute. No build step.

## Still owned by David & Jo (not this site)

- Payments / Shopify store setup
- Print-on-demand partner selection (must print 24×36 wall calendars)
- Final pricing
- The actual calendar artwork (this site's poster is a CSS mockup)
