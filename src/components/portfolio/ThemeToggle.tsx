"use client";
import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, currentTheme, hasStoredTheme, type Theme } from "@/lib/theme";
import { playToggleClick } from "@/lib/click-sound";

/** Subscribes to <html data-theme> so the button's label stays correct however the theme changes. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  // Server snapshot is the page's default ("light"); the pre-paint script has already set the real
  // theme on <html>, which this picks up straight after hydration. The icon itself is switched by
  // CSS from data-theme, so it never flashes.
  const theme = useSyncExternalStore<Theme>(subscribe, currentTheme, () => "light");

  // Until the visitor chooses, keep following the system setting if it changes.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!hasStoredTheme()) applyTheme(e.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === "dark"}
      onClick={() => {
        applyTheme(next, true);
        playToggleClick(next === "dark");
      }}
    >
      <Sun className="icon-sun" size={16} aria-hidden="true" />
      <Moon className="icon-moon" size={16} aria-hidden="true" />
    </button>
  );
}
