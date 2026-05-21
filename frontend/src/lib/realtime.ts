"use client";

export type RealtimeTopic =
  | "alerts"
  | "lost-person-reports"
  | "crowd-feed"
  | "volunteers";

const CHANNEL_NAME = "trinetra-realtime";
const INTERNAL_EVENT = "trinetra:realtime";

let channel: BroadcastChannel | null = null;

const getChannel = () => {
  if (
    typeof window === "undefined" ||
    typeof BroadcastChannel === "undefined"
  ) {
    return null;
  }

  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }

  return channel;
};

export const publishRealtimeUpdate = (topic: RealtimeTopic) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(INTERNAL_EVENT, { detail: topic }));
  getChannel()?.postMessage(topic);
};

export const subscribeRealtimeUpdate = (
  topic: RealtimeTopic,
  callback: () => void,
) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const localHandler = (event: Event) => {
    const customEvent = event as CustomEvent<RealtimeTopic>;
    if (customEvent.detail === topic) {
      callback();
    }
  };

  const channelHandler = (event: MessageEvent<RealtimeTopic>) => {
    if (event.data === topic) {
      callback();
    }
  };

  window.addEventListener(INTERNAL_EVENT, localHandler as EventListener);
  const realtimeChannel = getChannel();
  realtimeChannel?.addEventListener("message", channelHandler);

  return () => {
    window.removeEventListener(INTERNAL_EVENT, localHandler as EventListener);
    realtimeChannel?.removeEventListener("message", channelHandler);
  };
};
