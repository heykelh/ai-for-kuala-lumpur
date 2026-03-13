"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

type MapPoint = {
  name: string;
  lat: number;
  lng: number;
  trafficIndex: number;
  aqi: number;
  temperature: number;
  humidity: number;
};

function getTrafficColor(trafficIndex: number) {
  if (trafficIndex >= 80) return "#ff6b6b";
  if (trafficIndex >= 60) return "#f5b942";
  return "#22c7a9";
}

function getTrafficLabel(trafficIndex: number) {
  if (trafficIndex >= 80) return "Heavy";
  if (trafficIndex >= 60) return "Moderate";
  return "Fluid";
}

export default function KLLiveMap({
  points,
}: {
  points: MapPoint[];
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/8">
      <MapContainer
        center={[3.139, 101.6869]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "460px", width: "100%", background: "#0b1623" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((point) => {
          const color = getTrafficColor(point.trafficIndex);

          return (
            <CircleMarker
              key={point.name}
              center={[point.lat, point.lng]}
              radius={16}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.45,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontWeight: 700 }}>
                    {point.name}
                  </h3>
                  <p style={{ margin: "4px 0" }}>
                    🚗 Traffic: <strong>{point.trafficIndex}</strong> ({getTrafficLabel(point.trafficIndex)})
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    🌿 AQI: <strong>{point.aqi}</strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    🌡️ Temp: <strong>{point.temperature}°C</strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    💧 Humidity: <strong>{point.humidity}%</strong>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}