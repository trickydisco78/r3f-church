import Viewport from "@/components/scene/Viewport";
import { Inspector } from "@/components/ui-panels/Inspector";

export default function ChurchViewer() {
  return (
    <main className="relative h-screen w-screen">
      <Viewport />
      <Inspector />
    </main>
  );
}
