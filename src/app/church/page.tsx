import Viewport from "@/components/scene/Viewport";
import { SiteNav } from "@/components/portfolio/SiteChrome";
import { Inspector } from "@/components/ui-panels/Inspector";
import { SceneErrorBoundary } from "@/components/ui-panels/SceneErrorBoundary";
import { SceneLoader } from "@/components/ui-panels/SceneLoader";
import "../portfolio.css";

export default function ChurchViewer() {
  return (
    <main className="flex h-dvh flex-col">
      {/* The site header, so the 3D page matches the rest of the site. */}
      <div className="portfolio portfolio-bar">
        <SiteNav base="/" />
      </div>
      {/* The scene fills whatever height is left under the header. The <canvas> is drawn inside this box;
          the panel and loader are HTML laid over it. */}
      <div className="relative min-h-0 flex-1">
        <SceneErrorBoundary>
          <Viewport />
          <SceneLoader />
        </SceneErrorBoundary>
        <Inspector />
      </div>
    </main>
  );
}
