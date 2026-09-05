# ASCII Art Generator Pro

[![CI](https://github.com/kasapdev/ascii-art-generator-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/kasapdev/ascii-art-generator-pro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?logo=javascript&logoColor=black)

Turn text into large ASCII-art banners with 3 hand-built bitmap fonts — fast, private, and fully offline.

> A zero-dependency banner generator for terminals, READMEs, commit messages, and CLI splash screens. Type text, pick a font, and get an instantly copyable (or downloadable) block of monospace art — with nothing ever leaving your machine.

## Overview

ASCII Art Generator Pro is part of the **Web Utility Suite**. It runs entirely in the browser with no build step, no frameworks, and no network calls — open `index.html` from disk and it works. Every font is a static, hand-authored bitmap glyph map (no runtime font-rendering trickery), so output is deterministic and identical every time.

**Uppercase only:** these bitmap fonts define capital letters only, following the convention of classic block-letter banner fonts (FIGlet "block"/"slant" and friends). Lowercase input is automatically uppercased before rendering.

## Features

- **3 distinct hand-authored fonts**, each internally consistent in weight and style:
  - **Block** — bold, filled block letters (7 rows tall), classic banner style.
  - **Slant** — a forward-leaning, italic-style font built from `/`, `_`, and `|` strokes (6 rows tall).
  - **Small** — a compact, small-caps style (5 rows tall) for short banners or fitting more text on screen.
- **Full character coverage** — A–Z, 0–9, and common punctuation (space, `! ? . , - : '` plus `# @ + / ( )`), consistent across all three fonts.
- **Graceful fallback** — any unsupported character renders as a correctly-sized blank glyph (never crashes, never breaks alignment) and a toast lists exactly which characters were skipped, the first time each one is seen.
- **Live preview** in a monospace, horizontally-scrollable panel — wide banners never break the page layout.
- **Copy** to clipboard and **Download** as `.txt`.
- **Character counter** with a sane max length, since large banners get wide fast.
- **Auto-persist** — your last input and chosen font are saved to `localStorage` and restored on return.
- **Dark & light themes**, fully responsive, accessible, and keyboard-driven.

## Installation

No dependencies, no build step.

```bash
git clone https://github.com/kasapdev/ascii-art-generator-pro.git
cd ascii-art-generator-pro
```

Then simply open `index.html` in any modern browser (double-click it, or `file://` it). That's it.

## Usage

1. Type your text into the input field (up to 40 characters — watch the counter).
2. Pick a font style: **Block**, **Slant**, or **Small**.
3. The banner renders live in the preview panel below, scrollable horizontally if it's wide.
4. **Copy** the banner to your clipboard, or **Download** it as a `.txt` file.
5. Unsupported characters (anything outside A–Z, 0–9, and the supported punctuation) render as blank space — a toast tells you which ones were skipped.

## Keyboard Shortcuts

| Action                | Shortcut          |
| ---------------------- | ----------------- |
| Copy banner            | <kbd>Ctrl/⌘</kbd> + <kbd>C</kbd> |
| Download as `.txt`     | <kbd>Ctrl/⌘</kbd> + <kbd>S</kbd> |
| Show shortcuts help    | <kbd>?</kbd>       |
| Close dialog            | <kbd>Esc</kbd>     |

## Screenshots

> _Screenshots coming soon._

## Roadmap

- [ ] Additional fonts (outline/hollow, shadow/3D style)
- [ ] Adjustable inter-letter spacing and alignment (left/center/right)
- [ ] ANSI color export for terminal banners
- [ ] Multi-line input support (render each line as its own banner block)
- [ ] Import a custom glyph map (JSON) for user-defined fonts

## License

MIT Licensed. Part of the [Web Utility Suite](https://github.com/kasapdev/web-utility-suite).

---

## Part of the kasapdev Tools Suite

One of 45+ zero-dependency vanilla JS tools, all free and open source — [see the full list](https://github.com/kasapdev/kasapdev).
