"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

/** How long the fade-out lasts before the overlay is removed from the page (ms). */
const FADE_MS = 500;

/**
 * Overlay shown over the 3D viewer until all of the scene's files (model, decoder, lighting) have
 * loaded, with a progress bar. Without it the visitor sees only sky and empty grass, which looks
 * broken. Fades out when ready, then removes itself.
 */
export function SceneLoader() {
  // drei's progress store tracks everything loaded through three.js's loading manager. `total` is 0
  // until the first file starts loading, so wait for it to be non-zero before calling it "ready".
  const { active, progress, total } = useProgress();
  const ready = total > 0 && !active && progress >= 100;
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setRemoved(true), FADE_MS);
    return () => clearTimeout(t);
  }, [ready]);

  if (removed) return null;

  const percent = Math.round(Math.min(100, progress));
  return (
    <div
      role="status"
      aria-label={ready ? "The church has loaded" : "Loading the church"}
      className={`absolute inset-0 z-20 grid place-items-center bg-background transition-opacity ease-out motion-reduce:transition-none ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="flex w-64 flex-col items-center gap-4 text-center">
        <svg
          className="size-8 animate-spin text-primary motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium">Loading the church…</p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
        <p className="text-xs tabular-nums text-muted-foreground" aria-hidden="true">
          {percent}%
        </p>
      </div>
    </div>
  );
}
