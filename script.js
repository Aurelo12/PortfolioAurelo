/* =========================================================
   Sefonic · scripts
   Plain JavaScript, no libraries. The theme is first set by
   the small script in the <head> of index.html.
   ========================================================= */


/* ---------- Light/dark toggle ---------- */
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null; // storage blocked, e.g. some private windows
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  if (!toggle) return;

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', function () {
    const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // not saved, the toggle still works for this visit
    }
  });

  // Follow the system setting until the visitor picks a theme themselves
  systemDark.addEventListener('change', function (event) {
    if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  });
})();


/* ---------- Contact: copy Discord username ---------- */
// Discord has no profile links by username, so the button copies the name instead.
(function () {
  const button = document.querySelector('[data-copy-discord]');
  if (!button || !navigator.clipboard) return;

  const name = button.querySelector('.discord-name').textContent.trim();
  const originalText = button.textContent;

  button.addEventListener('click', function (event) {
    event.preventDefault();
    navigator.clipboard.writeText(name).then(function () {
      button.textContent = 'Copied: ' + name;
      setTimeout(function () {
        button.textContent = originalText;
      }, 2000);
    });
  });
})();
