"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Always show the bar this close to the top of the page. */
const REVEAL_AT_TOP = 80;
/** Ignore scroll movements smaller than this so tiny jitters don't flicker the bar. */
const MIN_MOVE = 6;

/**
 * A sticky site header that slides away when you scroll down and returns when you scroll up.
 *
 * - Always visible near the top of the page, and while it contains keyboard focus.
 * - Stays visible during the smooth scroll that a nav-link click triggers; hiding resumes on the
 *   next real wheel, touch or key scroll.
 * - Publishes its height as --header-h so anchored sections can offset for it (scroll-margin-top).
 * State lives in data attributes (data-hidden, data-scrolled) and CSS does the animating.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const root = document.documentElement;

    const publishHeight = () => root.style.setProperty("--header-h", `${header.getBoundingClientRect().height}px`);
    publishHeight();
    const resize = new ResizeObserver(publishHeight);
    resize.observe(header);

    let lastY = Math.max(0, window.scrollY);
    let ticking = false;
    let suppressHide = false;

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY); // iOS rubber-banding can report negative values
      header.toggleAttribute("data-scrolled", y > 4);
      if (y < REVEAL_AT_TOP) {
        header.removeAttribute("data-hidden");
      } else if (Math.abs(y - lastY) >= MIN_MOVE) {
        if (y < lastY) header.removeAttribute("data-hidden");
        else if (!suppressHide) header.setAttribute("data-hidden", "");
      } else {
        return; // too small a move to count; keep lastY
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const resumeHiding = () => {
      suppressHide = false;
    };
    const onHeaderClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a[href*='#']")) {
        suppressHide = true;
        header.removeAttribute("data-hidden");
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", resumeHiding, { passive: true });
    window.addEventListener("touchmove", resumeHiding, { passive: true });
    window.addEventListener("keydown", resumeHiding);
    header.addEventListener("click", onHeaderClick);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", resumeHiding);
      window.removeEventListener("touchmove", resumeHiding);
      window.removeEventListener("keydown", resumeHiding);
      header.removeEventListener("click", onHeaderClick);
      root.style.removeProperty("--header-h");
    };
  }, []);

  return (
    <header ref={ref} className="site-header">
      {children}
    </header>
  );
}
