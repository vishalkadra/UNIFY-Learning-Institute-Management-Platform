# Unify frontend redesign notes

Design tokens (colours, fonts, spacing, shadows) live at the top of `src/theme.css`.
Change a value there and the whole site updates. Dark mode = `[data-bs-theme="dark"]` block.

- Fonts: Plus Jakarta Sans (headings) + Inter (body), loaded in `index.html`
- Bootstrap CSS is now imported once, first, in `src/main.jsx` (CDN link removed)
- `src/Logo.jsx` picks the dark-text / light-text logo for light / dark mode
- Backend, API calls, routes, validation and state logic are unchanged
