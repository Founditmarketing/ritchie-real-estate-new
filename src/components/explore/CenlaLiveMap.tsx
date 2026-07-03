"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapListing {
  id: string;
  title: string;
  price: string;
  lat: number;
  lng: number;
  /** Accessible pin name with context, e.g. "$615k — Bayou Robert Estate, 4 bed". */
  srLabel?: string;
}

function buildIcon(label: string, active: boolean) {
  // Width estimated from label length so the pill is centered on the point.
  const w = Math.max(46, label.length * 8 + 22);
  const h = 28;
  return L.divIcon({
    html: label,
    // Leaflet makes markers keyboard-focusable (tabindex=0) but the global
    // focus ring only targets a/button/form elements, so the pin needs its
    // own :focus-visible outline. Paper, not crimson — the pill is itself
    // crimson on the navy-ink map, mirroring the .is-active inversion.
    className: `rre-pin focus-visible:[outline:2px_solid_var(--color-paper)] focus-visible:outline-offset-[3px]${active ? " is-active" : ""}`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
  });
}

/**
 * Vanilla Leaflet map (driven imperatively) with free dark CARTO tiles —
 * no API key. Renders a Zillow-style price pin per listing and stays in sync
 * with the active selection from the list. Loaded client-only via
 * next/dynamic({ ssr: false }) since Leaflet needs the DOM.
 */
export default function CenlaLiveMap({
  listings,
  activeId,
  onActivate,
}: {
  listings: MapListing[];
  activeId: string | null;
  onActivate: (id: string) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const dataRef = useRef<Map<string, MapListing>>(new Map());
  const pointsRef = useRef<L.LatLngExpression[]>([]);
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  const fitToPoints = (map: L.Map) => {
    const pts = pointsRef.current;
    if (pts.length === 1) map.setView(pts[0], 13, { animate: true });
    else if (pts.length > 1)
      map.fitBounds(L.latLngBounds(pts), { padding: [70, 70], maxZoom: 13 });
  };

  // Init once.
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
      center: [31.31, -92.45],
      zoom: 11,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);
    mapRef.current = map;
    // Container may mount at 0 height inside flex/grid; nudge Leaflet.
    setTimeout(() => map.invalidateSize(), 100);

    // Re-measure + re-fit whenever the container resizes — critical for the
    // mobile list/map toggle, where the map mounts hidden (zero-size).
    const el = elRef.current;
    let wasZero = !el || el.clientHeight === 0;
    const ro = new ResizeObserver(() => {
      const m = mapRef.current;
      if (!m || !el) return;
      if (el.clientHeight > 0 && el.clientWidth > 0) {
        m.invalidateSize();
        if (wasZero) {
          fitToPoints(m);
          wasZero = false;
        }
      } else {
        wasZero = true;
      }
    });
    if (el) ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Rebuild markers when the listing set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    dataRef.current.clear();

    const pts: L.LatLngExpression[] = [];
    listings.forEach((l) => {
      if (typeof l.lat !== "number" || typeof l.lng !== "number") return;
      dataRef.current.set(l.id, l);
      const marker = L.marker([l.lat, l.lng], {
        icon: buildIcon(l.price, l.id === activeId),
        riseOnHover: true,
        // Leaflet sets this as the title attribute on the divIcon element —
        // hover tooltip + accessible name beyond the bare price.
        title: l.srLabel ?? `${l.title} — ${l.price}`,
      }).addTo(map);
      marker.on("click", () => onActivateRef.current(l.id));
      markersRef.current.set(l.id, marker);
      pts.push([l.lat, l.lng]);
    });

    pointsRef.current = pts;
    fitToPoints(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  // Reflect the active selection: restyle pins and fly to the active one.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker, id) => {
      const l = dataRef.current.get(id);
      if (l) marker.setIcon(buildIcon(l.price, id === activeId));
    });
    if (activeId) {
      const marker = markersRef.current.get(activeId);
      if (marker) {
        map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 13), {
          duration: 0.6,
        });
      }
    }
  }, [activeId]);

  return <div ref={elRef} className="h-full w-full" aria-label="Map of Central Louisiana listings" role="application" />;
}
