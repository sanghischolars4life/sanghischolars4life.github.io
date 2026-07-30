# Anjali & Vivek — LDR Hub

A private-feeling static site for **Anjali & Vivek** / **Pandu & Pando**: home hub, memory timeline, and a few games. Hosted on GitHub Pages — no backend yet.

## Shared passphrase

Default passphrase: `pandupando`

It is checked client-side (session only). This is not real security — the repo is public — but it keeps casual visitors out. To change it, edit the string inside `hashPassphrase("...")` in [`js/site.js`](js/site.js).

## Edit content

- **Memories timeline:** [`data/memories.json`](data/memories.json) — `date`, `title`, `caption`, `image`, optional `link` / `linkLabel`
- **Love quiz:** [`data/quiz.json`](data/quiz.json) — `question`, `options[]`, `answer` (0-based index)
- **Photos:** root [`images/`](images/) (`img0.jpg` … `img104.jpg`)
- **Music (archive):** [`music/Inkem-Inkem.mp3`](music/Inkem-Inkem.mp3)

## Pages

| Path | What |
|------|------|
| `/` | Home hub |
| `/memories.html` | Timeline + photo shuffle |
| `/play.html` | Games lobby |
| `/games/memory-match.html` | Photo pair matching |
| `/games/photo-puzzle.html` | Sliding photo puzzle |
| `/games/love-quiz.html` | Story quiz |
| `/archive/2025-birthday/` | Archived birthday site |

## Local preview

Serve the folder over HTTP (fetch needs it), for example:

```bash
npx --yes serve .
```

Then open the URL shown and enter the passphrase.

## Naming

Copy uses **Anjali & Vivek** and **Pandu & Pando** interchangeably on purpose.
