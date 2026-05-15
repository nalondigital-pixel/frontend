"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LatLng = [number, number];

type MapPickerProps = {
  onSelect: (pos: LatLng) => void;
};

function ClickHandler({
  setPosition,
  onSelect,
}: {
  setPosition: (pos: LatLng) => void;
  onSelect: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      const pos: LatLng = [e.latlng.lat, e.latlng.lng];
      setPosition(pos);
      onSelect(pos);
    },
  });

  return null;
}

export default function MapPicker({ onSelect }: MapPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(null);

  return (
    <div className="relative z-0 w-full">
      <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200">
        <MapContainer
          center={[-17.8252, 31.0335]}
          zoom={6}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <ClickHandler
            setPosition={setPosition}
            onSelect={onSelect}
          />

          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {position && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}
    </div>
  );
}