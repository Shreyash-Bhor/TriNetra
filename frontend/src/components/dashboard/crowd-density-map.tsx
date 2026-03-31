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
  ) => {
    addTo: (layer: LeafletMap | LeafletLayerGroup) => {
      bindPopup: (content: string) => void;
    };
  };
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

      const markerIcon = window.L?.divIcon({
        className: "crowd-density-marker",
        html: `<span style='display:block;width:16px;height:16px;background:${color};border-radius:9999px;border:2px solid #fff;box-shadow:0 0 0 1px rgba(15,23,42,0.2);'></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      if (markerLayerRef.current) {
        window.L?.marker([feed.latitude, feed.longitude], { icon: markerIcon })
          .addTo(markerLayerRef.current)
          .bindPopup(
            `<strong>${feed.camera_id}</strong><br/>${feed.location}<br/>Density: ${normalizedDensity}`,
          );
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
