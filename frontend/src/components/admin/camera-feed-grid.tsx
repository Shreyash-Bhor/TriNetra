import { CameraFeedRow } from "@/components/admin/camera-feed-row";
import { CameraCrowdFeed } from "@/types/crowd";

type CameraFeedGridProps = {
  cameraFeeds: CameraCrowdFeed[];
};

export function CameraFeedGrid({ cameraFeeds }: CameraFeedGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {cameraFeeds.map((cameraFeed) => (
        <CameraFeedRow key={cameraFeed.camera_id} cameraFeed={cameraFeed} />
      ))}
    </div>
  );
}
