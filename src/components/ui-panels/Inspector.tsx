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
      </CardContent>
    </Card>
  );
}
