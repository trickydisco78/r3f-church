"use client";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CAMERA_PRESETS, useCameraStore } from "@/store/camera-store";
import { useChurchStore } from "@/store/church-store";

export function Inspector() {
  const church = useChurchStore();
  const currentCamera = useCameraStore((s) => s.current);
  const flyTo = useCameraStore((s) => s.flyTo);

  return (
    <Card className="absolute left-4 top-4 w-64">
      <CardHeader>
        <CardTitle>Scene</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={church.roof} onChange={(e) => church.setRoof(e.target.checked)} />
          Roof
        </label>
        <div className="space-y-1 border-t pt-2">
          <p className="text-xs uppercase text-muted-foreground">Cameras</p>
          <div className="flex flex-wrap gap-1">
            {CAMERA_PRESETS.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={currentCamera === c.id ? "default" : "outline"}
                onClick={() => flyTo(c.id)}
              >
                <Camera /> {c.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1 border-t pt-2">
          <p className="text-xs uppercase text-muted-foreground">Controls</p>
          {/* Mouse instructions; hidden on touch devices, which get the list below instead. */}
          <ul className="space-y-1 text-xs text-muted-foreground [@media(pointer:coarse)]:hidden">
            <li>
              <strong className="font-medium text-foreground">Left-click + drag</strong> to rotate the model
            </li>
            <li>
              <strong className="font-medium text-foreground">Scroll</strong> to zoom in and out
            </li>
            <li>
              <strong className="font-medium text-foreground">Right-click + drag</strong> to move it sideways
            </li>
            <li>
              <strong className="font-medium text-foreground">Click the door</strong> to open or close it
            </li>
          </ul>
          <ul className="hidden space-y-1 text-xs text-muted-foreground [@media(pointer:coarse)]:block">
            <li>
              <strong className="font-medium text-foreground">Drag</strong> with one finger to rotate the model
            </li>
            <li>
              <strong className="font-medium text-foreground">Pinch</strong> to zoom in and out
            </li>
            <li>
              <strong className="font-medium text-foreground">Drag with two fingers</strong> to move it sideways
            </li>
            <li>
              <strong className="font-medium text-foreground">Tap the door</strong> to open or close it
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
