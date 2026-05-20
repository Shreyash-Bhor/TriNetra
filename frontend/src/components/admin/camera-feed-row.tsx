import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CameraCrowdFeed } from "@/types/crowd";

type CameraFeedRowProps = {
  cameraFeed: CameraCrowdFeed;
};

const densityClassMap: Record<CameraCrowdFeed["density_level"], string> = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

const statusVariantMap: Record<
  CameraCrowdFeed["status"],
  "secondary" | "outline" | "destructive"
> = {
  normal: "secondary",
  warning: "outline",
  critical: "destructive",
};

export function CameraFeedRow({ cameraFeed }: CameraFeedRowProps) {
  return (
    <div className="grid gap-4 rounded-2xl border bg-card p-4 lg:grid-cols-[minmax(260px,320px)_1fr]">
      <div className="overflow-hidden rounded-xl border bg-muted/20">
        <Image
          src={cameraFeed.heatmap}
          alt={`${cameraFeed.camera_id} heatmap`}
          className="h-full w-full object-cover"
          width={640}
          height={360}
          unoptimized
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-semibold">{cameraFeed.camera_id}</p>
          <Badge variant={statusVariantMap[cameraFeed.status]}>
            {cameraFeed.status.toUpperCase()}
          </Badge>
          <Badge variant="outline">{cameraFeed.location}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-3">
            <p className="text-xs uppercase text-muted-foreground">Count</p>
            <p className="text-2xl font-semibold">{cameraFeed.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs uppercase text-muted-foreground">
              Density Level
            </p>
            <p
              className={`text-2xl font-semibold uppercase ${densityClassMap[cameraFeed.density_level]}`}
            >
              {cameraFeed.density_level}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs uppercase text-muted-foreground">
              Coordinates
            </p>
            <p className="text-sm font-medium">
              {cameraFeed.latitude.toFixed(4)},{" "}
              {cameraFeed.longitude.toFixed(4)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs uppercase text-muted-foreground">Updated</p>
            <p className="text-sm font-medium">
              {new Date(cameraFeed.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
