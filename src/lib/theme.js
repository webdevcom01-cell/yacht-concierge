// Timezone-aware theme (light by day, dark by evening/night), with a
// per-visit manual override via the Nav toggle.
//
// Detection uses the VISITOR's own device clock (new Date().getHours()) —
// browsers already report local time in the visitor's own timezone, so no
// IANA timezone lookup is needed. Boundaries: dark from 19:00–06:59, light
// from 07:00–18:59.
//
// A manual toggle click is remembered in sessionStorage (not localStorage):
// it wins for the rest of that browser tab's visit (survives reloads/nav),
// but is forgotten once the tab/browser closes, so the next visit goes back
// to auto-detection. This mirrors the same synchronous logic duplicated as
// an inline script in index.html, which sets data-theme before first paint
// to avoid a light-theme flash when the auto-detected theme is dark.

export const THEME_OVERRIDE_KEY = 'yc-theme-override';

const DARK_START_HOUR = 19; // 7pm
const DARK_END_HOUR = 7;    // 7am

export function getAutoTheme() {
  const h = new Date().getHours();
  return (h >= DARK_START_HOUR || h < DARK_END_HOUR) ? 'dark' : 'light';
}

export function getInitialTheme() {
  try {
    const override = sessionStorage.getItem(THEME_OVERRIDE_KEY);
    if (override === 'light' || override === 'dark') return override;
  } catch {}
  return getAutoTheme();
}

export function persistThemeOverride(theme) {
  try { sessionStorage.setItem(THEME_OVERRIDE_KEY, theme); } catch {}
}
