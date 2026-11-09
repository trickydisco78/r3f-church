/**
 * Light/dark theme plumbing shared by the layout (pre-paint script) and the toggle.
 * The theme lives on <html> as data-theme="light|dark" (plus the "dark" class the shadcn
 * tokens in globals.css use), is remembered in localStorage, and otherwise follows the system.
 */
export type Theme = "light" | "dark";
export const THEME_KEY = "theme";

/**
 * Runs synchronously in <head> before first paint (see layout.tsx) so there is no flash of the
 * wrong theme. Kept as a string because it is inlined into the HTML.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme, persist: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* private mode etc.: the choice just won't be remembered */
    }
  }
}

export function hasStoredTheme(): boolean {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark";
  } catch {
    return false;
  }
}
