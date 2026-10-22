/* =========================================================
   Aurelo · scripts
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


/* ---------- Hero video: no autoplay for visitors who ask for less motion ---------- */
(function () {
  const video = document.querySelector('.hero-shot__video');
  if (!video) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply() {
    if (reduceMotion.matches) {
      video.pause();
      video.controls = true;
    } else {
      video.controls = false;
      video.play().catch(function () {}); // the browser may still block it; the poster stays then
    }
  }

  apply();
  reduceMotion.addEventListener('change', apply);
})();


/* ---------- Contact: online hours in the visitor's own time ---------- */
(function () {
  // Your hours, in your own time zone. Also change the text in index.html if you change these.
  const MY_TIME_ZONE = 'Europe/Amsterdam';
  const START_HOUR = 10; // online from 10:00
  const END_HOUR = 24;   // until 00:00 (midnight)

  const box = document.querySelector('.availability');
  if (!box || !window.Intl) return;

  const statusLine = box.querySelector('.availability__status');
  const statusText = box.querySelector('[data-status]');
  const hoursText = box.querySelector('[data-hours]');

  const myClock = new Intl.DateTimeFormat('en-GB', {
    timeZone: MY_TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  });
  const theirClock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

  // Date and time on my clock at a given moment
  function myParts(date) {
    const parts = {};
    myClock.formatToParts(date).forEach(function (p) { parts[p.type] = Number(p.value); });
    return parts;
  }

  // How far my clock is ahead of UTC at a given moment, in ms
  function myOffset(date) {
    const p = myParts(date);
    const minute = Math.floor(date.getTime() / 60000) * 60000;
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - minute;
  }

  // The moment my clock shows `hour`:00 on the given day (handles summer/winter time)
  function myMoment(year, month, day, hour) {
    const wall = Date.UTC(year, month - 1, day, hour);
    const guess = wall - myOffset(new Date(wall));
    return new Date(wall - myOffset(new Date(guess)));
  }

  function hourLabel(hour) {
    return String(hour % 24).padStart(2, '0') + ':00';
  }

  function update() {
    const now = new Date();
    const me = myParts(now);
    const online = me.hour >= START_HOUR && me.hour < END_HOUR;
    const sameZone = myOffset(now) === -now.getTimezoneOffset() * 60000;
    const myTimeNow = String(me.hour).padStart(2, '0') + ':' + String(me.minute).padStart(2, '0');

    if (online) {
      statusText.textContent = "Available now · it's " + myTimeNow + ' for me';
      if (sameZone) {
        hoursText.textContent = "I'm online " + hourLabel(START_HOUR) + '–' + hourLabel(END_HOUR) + '.';
      } else {
        const start = myMoment(me.year, me.month, me.day, START_HOUR);
        const end = myMoment(me.year, me.month, me.day, END_HOUR);
        hoursText.textContent = "I'm online " + hourLabel(START_HOUR) + '–' + hourLabel(END_HOUR) +
          " my time, that's " + theirClock.format(start) + '–' + theirClock.format(end) + ' for you.';
      }
    } else {
      const nextDay = me.hour >= END_HOUR ? me.day + 1 : me.day;
      const back = myMoment(me.year, me.month, nextDay, START_HOUR);
      statusText.textContent = "Offline now · it's " + myTimeNow + ' for me';
      if (sameZone) {
        hoursText.textContent = "I'm back at " + hourLabel(START_HOUR) + '.';
      } else {
        const tomorrow = back.toDateString() !== now.toDateString() ? ' tomorrow' : '';
        hoursText.textContent = "I'm back at " + hourLabel(START_HOUR) + " my time, that's " +
          theirClock.format(back) + tomorrow + ' for you.';
      }
    }

    box.classList.toggle('is-online', online);
    statusLine.hidden = false;
  }

  update();
  setInterval(update, 30000);
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
