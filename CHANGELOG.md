# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1] - 2026-09-06

### Fixed

- Theme toggle button showed no icon at all in light mode. `css/app.css` unconditionally hid `.icon-moon` (`.icon-moon { display: none; }`) with no rule to reveal it in light theme, and `index.html` never actually included a moon icon `<svg>` in the theme toggle button in the first place — only the sun icon existed. Since the sun icon is hidden via `[data-theme="light"] .icon-sun { display: none; }`, the button was left completely blank whenever the site was in light mode. Added the missing moon icon markup to `index.html` and a `[data-theme="light"] .icon-moon { display: inline; }` rule to `css/app.css` so the intended sun/moon swap (documented in the CSS's own comment) actually works.
