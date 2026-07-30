# Anjali & Vivek — LDR Hub

A private-feeling static site for **Anjali & Vivek** / **Pandu & Pando**: home hub, memory timeline, and games. Hosted on GitHub Pages — no backend yet.

## Shared passphrase

Default passphrase: `pandupando`

It is checked client-side (session only). This is not real security — the repo is public — but it keeps casual visitors out. To change it, edit the string inside `hashPassphrase("...")` in [`js/site.js`](js/site.js).

## Edit content

- **Memories:** [`data/memories.json`](data/memories.json)
- **Love quiz:** [`data/quiz.json`](data/quiz.json)
- **Hangman words:** [`data/hangman.json`](data/hangman.json)
- **Would you rather:** [`data/wyr.json`](data/wyr.json)
- **Spot the difference:** [`data/spot-difference.json`](data/spot-difference.json)
- **Photos:** [`images/`](images/) (`img0.jpg` … `img104.jpg`)

## Pages & games

| Path | What |
|------|------|
| `/` | Home hub |
| `/memories.html` | Timeline + photo shuffle |
| `/play.html` | Games lobby |
| `/games/memory-match.html` | Photo pair matching |
| `/games/photo-puzzle.html` | Sliding photo puzzle |
| `/games/love-quiz.html` | Story quiz |
| `/games/monopoly.html` | Monopoly Lite (hot-seat) |
| `/games/connect-four.html` | Connect Four |
| `/games/tic-tac-toe.html` | Tic-tac-toe |
| `/games/dots-boxes.html` | Dots & Boxes |
| `/games/checkers.html` | Checkers |
| `/games/jigsaw.html` | Drag-and-drop jigsaw |
| `/games/spot-difference.html` | Spot the difference |
| `/games/hangman.html` | Hangman |
| `/games/would-you-rather.html` | Would you rather deck |
| `/games/snake.html` | Snake |
| `/archive/2025-birthday/` | Archived birthday site |

## Local preview

```bash
npx --yes serve .
```

Then open the URL shown and enter the passphrase.

## Naming

Copy uses **Anjali & Vivek** and **Pandu & Pando** interchangeably on purpose.
