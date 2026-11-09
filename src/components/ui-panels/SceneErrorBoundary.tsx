"use client";
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Catches anything that stops the 3D scene starting (a model that fails to load, a browser without
 * WebGL) and shows a message with a retry, instead of leaving a blank page. React Three Fiber
 * rethrows errors from inside the Canvas to the nearest boundary outside it, so this works for
 * loader failures too.
 */
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("The 3D scene failed to start:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="absolute inset-0 z-20 grid place-items-center bg-background p-6 text-center">
        <div className="flex max-w-sm flex-col items-center gap-3">
          <p className="text-base font-medium">The 3D church couldn&apos;t load</p>
          <p className="text-sm text-muted-foreground">
            Check your internet connection and try again. If it keeps happening, your browser may not support 3D
            graphics (WebGL).
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }
}
