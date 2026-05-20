import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CameraCrowdFeed } from "@/types/crowd";

type CameraFeedRowProps = {
  cameraFeed: CameraCrowdFeed;
};

const densityClassMap: Record<CameraCrowdFeed["density_level"], string> = {
  low: "text-emerald-300",
  medium: "text-amber-300",
  high: "text-rose-300",
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
  const normalizedCount = Math.round(cameraFeed.count);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/80 p-4 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative aspect-video max-h-44 overflow-hidden rounded-xl border border-white/15 bg-black/20">
        <Image
          src={cameraFeed.heatmap}
          alt={`${cameraFeed.camera_id} heatmap`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized
        />
      </div>

      <div className="relative mt-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-semibold">{cameraFeed.camera_id}</p>
          <Badge variant={statusVariantMap[cameraFeed.status]}>
            {cameraFeed.status.toUpperCase()}
          </Badge>
        </div>
        <Badge variant="outline" className="border-white/40 text-white">
          {cameraFeed.location}
        </Badge>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs uppercase text-white/70">Count</p>
            <p className="text-3xl font-bold tracking-wide text-cyan-300">
              {normalizedCount}
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs uppercase text-white/70">Density Level</p>
            <p
              className={`text-2xl font-semibold uppercase ${densityClassMap[cameraFeed.density_level]} drop-shadow-sm`}
            >
              {cameraFeed.density_level}
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs uppercase text-white/70">Coordinates</p>
            <p className="text-sm font-medium">
              {cameraFeed.latitude.toFixed(4)},{" "}
              {cameraFeed.longitude.toFixed(4)}
            </p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs uppercase text-white/70">Updated</p>
            <p className="text-sm font-medium">
              {new Date(cameraFeed.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
