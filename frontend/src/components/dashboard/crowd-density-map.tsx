"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CameraCrowdFeed } from "@/types/crowd";

const LEAFLET_SCRIPT = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_STYLE = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

type LeafletLatLngBounds = {
  isValid: () => boolean;
};

type LeafletMap = {
  remove: () => void;
  fitBounds: (
    bounds: LeafletLatLngBounds,
    options?: { padding?: [number, number] },
  ) => void;
};

type LeafletLayerGroup = {
  addTo: (map: LeafletMap) => LeafletLayerGroup;
  clearLayers: () => void;
};

type LeafletMarker = {
  addTo: (layer: LeafletMap | LeafletLayerGroup) => LeafletMarker;
  bindPopup: (
    content: string,
    options?: { className?: string },
  ) => LeafletMarker;
  bindTooltip: (
    content: string,
    options?: {
      direction?: "top" | "right" | "bottom" | "left" | "center";
      offset?: [number, number];
      className?: string;
      opacity?: number;
      sticky?: boolean;
    },
  ) => LeafletMarker;
};

type LeafletNamespace = {
  map: (
    element: HTMLElement,
    options?: { zoomControl?: boolean },
  ) => LeafletMap;
  tileLayer: (
    urlTemplate: string,
    options?: { attribution?: string },
  ) => { addTo: (map: LeafletMap) => void };
  marker: (
    point: [number, number],
    options?: { icon?: unknown },
  ) => LeafletMarker;
  divIcon: (options: {
    className: string;
    html: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }) => unknown;
  latLngBounds: (points: [number, number][]) => LeafletLatLngBounds;
  layerGroup: () => LeafletLayerGroup;
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

type CrowdDensityMapProps = {
  cameraFeeds: CameraCrowdFeed[];
};

const densityColorMap: Record<string, string> = {
  HIGH: "#dc2626",
  MEDIUM: "#eab308",
  LOW: "#16a34a",
};

const MARKER_SIZE = 90;
const MARKER_RADIUS = MARKER_SIZE / 2;

const formatCard = (feed: CameraCrowdFeed, normalizedDensity: string) => `
  <div style='min-width:170px;padding:10px 12px;border-radius:10px;border:1px solid rgba(148,163,184,0.5);background:#0f172a;color:#e2e8f0;'>
    <div style='font-size:12px;opacity:0.75;margin-bottom:4px;'>${feed.camera_id}</div>
    <div style='font-size:14px;font-weight:600;margin-bottom:8px;'>${feed.location}</div>
    <div style='display:flex;justify-content:space-between;gap:12px;font-size:12px;'>
      <span style='opacity:0.8;'>Density Level</span>
      <strong>${normalizedDensity}</strong>
    </div>
    <div style='display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:4px;'>
      <span style='opacity:0.8;'>Status</span>
      <strong>${feed.status.toUpperCase()}</strong>
    </div>
  </div>
`;

const loadLeafletAssets = async () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!document.querySelector("link[data-leaflet='true']")) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = LEAFLET_STYLE;
    stylesheet.dataset.leaflet = "true";
    document.head.appendChild(stylesheet);
  }

  if (window.L) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-leaflet='true']",
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Leaflet script failed to load.")),
        {
          once: true,
        },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_SCRIPT;
    script.async = true;
    script.dataset.leaflet = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Leaflet script failed to load."));
    document.body.appendChild(script);
  });
};

export function CrowdDensityMap({ cameraFeeds }: CrowdDensityMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerLayerRef = useRef<LeafletLayerGroup | null>(null);
  const [mapError, setMapError] = useState("");

  const markerPoints = useMemo(
    () =>
      cameraFeeds.map(
        (feed) => [feed.latitude, feed.longitude] as [number, number],
      ),
    [cameraFeeds],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!mapElementRef.current) {
        return;
      }

      try {
        await loadLeafletAssets();

        if (
          !isMounted ||
          !window.L ||
          !mapElementRef.current ||
          mapRef.current
        ) {
          return;
        }

        const map = window.L.map(mapElementRef.current, { zoomControl: true });
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "&copy; OpenStreetMap contributors",
          },
        ).addTo(map);

        mapRef.current = map;
        markerLayerRef.current = window.L.layerGroup().addTo(map);
        setMapError("");
      } catch {
        if (isMounted) {
          setMapError("Unable to load map service right now.");
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!window.L || !mapRef.current || !markerLayerRef.current) {
      return;
    }

    markerLayerRef.current.clearLayers();

    cameraFeeds.forEach((feed) => {
      const normalizedDensity = feed.density_level.toUpperCase();
      const color = densityColorMap[normalizedDensity] ?? "#64748b";
      const cardHtml = formatCard(feed, normalizedDensity);

      const markerIcon = window.L?.divIcon({
        className: "crowd-density-marker",
        html: `<span style='display:block;width:${MARKER_SIZE}px;height:${MARKER_SIZE}px;background:${color}66;border-radius:9999px;border:2px solid ${color};box-shadow:0 4px 18px rgba(15,23,42,0.28);'></span>`,
        iconSize: [MARKER_SIZE, MARKER_SIZE],
        iconAnchor: [MARKER_RADIUS, MARKER_RADIUS],
      });

      if (markerLayerRef.current) {
        window.L?.marker([feed.latitude, feed.longitude], { icon: markerIcon })
          .addTo(markerLayerRef.current)
          .bindTooltip(cardHtml, {
            direction: "top",
            offset: [0, -18],
            sticky: true,
            opacity: 1,
            className: "crowd-density-hover-card",
          })
          .bindPopup(cardHtml, {
            className: "crowd-density-popup-card",
          });
      }
    });

    if (markerPoints.length === 0) {
      return;
    }

    const bounds = window.L.latLngBounds(markerPoints);
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [cameraFeeds, markerPoints]);

  if (mapError) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
        {mapError}
      </div>
    );
  }

  return (
    <div ref={mapElementRef} className="h-[340px] w-full rounded-xl border" />
  );
}
