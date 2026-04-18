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

type LeafletCircle = {
  addTo: (layer: LeafletMap | LeafletLayerGroup) => LeafletCircle;
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
  circle: (
    point: [number, number],
    options: {
      radius: number;
      color: string;
      weight: number;
      fillColor: string;
      fillOpacity: number;
    },
  ) => LeafletCircle;
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
const MARKER_GEO_RADIUS_IN_METERS = 80;

const getDensityMeta = (normalizedDensity: string) => {
  const color = densityColorMap[normalizedDensity] ?? "#64748b";
  if (normalizedDensity === "HIGH") {
    return {
      color,
      label: "Critical",
      tone: "rgba(239,68,68,0.18)",
    };
  }

  if (normalizedDensity === "MEDIUM") {
    return {
      color,
      label: "Elevated",
      tone: "rgba(234,179,8,0.18)",
    };
  }

  return {
    color,
    label: "Stable",
    tone: "rgba(34,197,94,0.18)",
  };
};

const formatCard = (
  feed: CameraCrowdFeed,
  normalizedDensity: string,
  color: string,
  densityLabel: string,
) => `
  <div style='min-width:220px;padding:12px;border-radius:14px;border:1px solid rgba(148,163,184,0.24);background:linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94));backdrop-filter:blur(5px);color:#e2e8f0;box-shadow:0 10px 30px rgba(2,6,23,0.5);'>
    <div style='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;'>
      <div style='font-size:11px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.75;'>${feed.camera_id}</div>
      <span style='display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(148,163,184,0.35);border-radius:9999px;padding:3px 8px;font-size:10px;font-weight:600;background:rgba(15,23,42,0.45);'>
        <span style='width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;'></span>
        ${densityLabel}
      </span>
    </div>
    <div style='font-size:15px;font-weight:700;line-height:1.3;margin-bottom:10px;'>${feed.location}</div>
    <div style='display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:8px;border-radius:10px;background:rgba(15,23,42,0.5);border:1px solid rgba(148,163,184,0.2);'>
      <span style='opacity:0.85;'>Density</span>
      <strong style='color:${color};'>${normalizedDensity}</strong>
    </div>
    <div style='display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;padding:8px;border-radius:10px;background:rgba(15,23,42,0.5);border:1px solid rgba(148,163,184,0.2);'>
      <span style='opacity:0.85;'>Status</span>
      <strong style='text-transform:uppercase;'>${feed.status}</strong>
    </div>
  </div>
`;
const buildMarkerIcon = (
  color: string,
  accentTone: string,
  normalizedDensity: string,
) =>
  window.L?.divIcon({
    className: "crowd-density-marker",
    html: `
      <span style='position:relative;display:grid;place-items:center;width:${MARKER_SIZE}px;height:${MARKER_SIZE}px;border-radius:9999px;background:${accentTone};border:2px solid ${color};box-shadow:0 8px 22px rgba(15,23,42,0.36);'>
        <span style='display:block;width:14px;height:14px;border-radius:9999px;background:${color};box-shadow:0 0 0 6px ${color}33;'></span>
        <span style='position:absolute;bottom:16px;font-size:10px;font-weight:700;color:#f8fafc;letter-spacing:0.06em;'>${normalizedDensity}</span>
      </span>
    `,
    iconSize: [MARKER_SIZE, MARKER_SIZE],
    iconAnchor: [MARKER_RADIUS, MARKER_RADIUS],
  });

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
      const { color, label, tone } = getDensityMeta(normalizedDensity);
      const cardHtml = formatCard(feed, normalizedDensity, color, label);
      const markerIcon = buildMarkerIcon(color, tone, normalizedDensity);

      if (markerLayerRef.current) {
        window.L?.circle([feed.latitude, feed.longitude], {
          radius: MARKER_GEO_RADIUS_IN_METERS,
          color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.1,
        }).addTo(markerLayerRef.current);

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
