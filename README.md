# sefonic.github.io

Portfolio site for Sefonic: Minecraft plugins and Tebex stores.
Live at https://sefonic.github.io

Plain HTML, CSS and JavaScript. No build step, no npm.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All text and content. Each section is marked with a comment. |
| `styles.css` | All styling. Colors are at the top: `:root` for light, `[data-theme="dark"]` for dark. |
| `script.js` | Light/dark toggle, online hours in the visitor's time, and the Discord copy button. |
| `assets/` | Images. |
| `favicon.svg` | Browser tab icon. |

## Editing

- Change text in `index.html`. Anything in `[brackets]` is still a placeholder.
- Change colors in the two blocks at the top of `styles.css`.
- To add the Aurum Border screenshot, follow the comment in the hero section of `index.html`.
- Online hours (10:00–00:00 Dutch time) are set at the top of the hours part of `script.js`. Visitors see them in their own time.
- To preview, open `index.html` in a browser.

## Publishing

Push to the `main` branch. GitHub Pages serves the repo root, and the live site updates a minute or two later.

```
git add .
git commit -m "Update site"
git push
```
