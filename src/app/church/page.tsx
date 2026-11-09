import Viewport from "@/components/scene/Viewport";
import { Inspector } from "@/components/ui-panels/Inspector";
import { SceneErrorBoundary } from "@/components/ui-panels/SceneErrorBoundary";
import { SceneLoader } from "@/components/ui-panels/SceneLoader";

export default function ChurchViewer() {
  return (
    <main className="relative h-screen w-screen">
      <SceneErrorBoundary>
        <Viewport />
        <SceneLoader />
      </SceneErrorBoundary>
      <Inspector />
    </main>
  );
}
