# Aishwarya & Laxmi Narayen — Engagement Invitation

An interactive, single-page engagement invitation. Tap the envelope to open it, then scroll through the date, countdown, and venue details (with a live map and QR code).

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

That URL is what you can forward to guests.

## Editing details

All event details (names, date, venue, address) live near the top of [assets/js/script.js](assets/js/script.js) in the `EVENT` object, and in the corresponding text in [index.html](index.html).

## Structure

```
index.html              Page markup
assets/css/style.css    Styling & animations
assets/js/script.js     Envelope intro, countdown, calendar/share/QR interactions
assets/img/             QR code image
```
