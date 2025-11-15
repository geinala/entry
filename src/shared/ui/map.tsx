/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { decode } from "@mapbox/polyline";
import { useEffect, useState } from "react";

export const Map = () => {
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [waypoints] = useState<{ name: string; lat: number; lng: number }[]>([
    { name: "Titik A", lat: -7.2925952, lng: 112.7200837 },
    { name: "Titik B", lat: -7.3354277, lng: 112.741539 },
    { name: "Titik C", lat: -7.3207006, lng: 112.7629063 },
  ]);

  const fetchRoute = async (waypointsParam: { name: string; lat: number; lng: number }[]) => {
    setLoading(true);
    try {
      const coordinatesString = waypointsParam.map((wp) => `${wp.lng},${wp.lat}`).join(";");
      console.log("Fetching route for coordinates:", coordinatesString);
      const url = `http://localhost:5000/route/v1/driving/${coordinatesString}?steps=true&geometries=polyline6&overview=full`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRouteData(data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute(waypoints);
  }, [waypoints]);

  const getSegmentedRoutes = () => {
    if (!routeData?.routes?.[0]?.legs) return [];

    return routeData.routes[0].legs.map((leg: any, legIndex: number) => {
      // Decode setiap step.geometry secara terpisah lalu gabungkan koordinatnya.
      // Menggabungkan (join) string encoded polyline menghasilkan encoding yang
      // invalid sehingga decode bisa menghasilkan jalur aneh (mis. garis lurus panjang).
      const coordinates = leg.steps.flatMap((step: any) => {
        if (!step?.geometry) return [] as [number, number][];
        const decoded = decode(step.geometry, 6);
        // decode returns [lat, lng]
        return decoded.map((coord: number[]) => [coord[0], coord[1]] as [number, number]);
      });

      return {
        coordinates,
        legIndex,
        from: waypoints[legIndex].name,
        to: waypoints[legIndex + 1].name,
        distance: leg.distance,
        duration: leg.duration,
      };
    });
  };

  type Segment = {
    coordinates: [number, number][];
    legIndex: number;
    from: string;
    to: string;
    distance: number;
    duration: number;
  };

  const segmentedRoutes: Segment[] = getSegmentedRoutes();

  const maxProgress = waypoints.length - 1;

  // Debug: lihat segmentedRoutes dan currentProgress saat berubah
  useEffect(() => {
    console.log("segmentedRoutes count:", segmentedRoutes.length);
    console.log("currentProgress:", currentProgress, "maxProgress:", maxProgress);
  }, [segmentedRoutes, currentProgress, maxProgress]);

  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex < currentProgress) {
      return "#008000"; // Hijau - sudah dilewati (lebih gelap)
    } else if (segmentIndex === currentProgress) {
      return "#ffa500"; // Orange - sedang dilalui
    } else {
      return "#888888"; // Abu-abu - belum dilalui (lebih kontras)
    }
  };

  const getSegmentOpacity = (segmentIndex: number) => {
    if (segmentIndex <= currentProgress) {
      return 1; // Solid untuk yang sudah/sedang dilalui
    } else {
      return 0.7; // Lebih jelas untuk yang belum, agar terlihat
    }
  };

  return (
    <MapContainer
      center={[-7.2925952, 112.7200837]}
      zoom={14}
      style={{ width: "100%", height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render setiap segment dengan warna berbeda */}
      {segmentedRoutes.map((segment: Segment, index: number) => (
        // Force remount Polyline when currentProgress changes by including it in the key.
        // React-Leaflet/Leaflet sometimes won't update path style on prop change, so
        // remountting ensures the new color/opacity are applied.
        <Polyline
          key={`${index}-${currentProgress}`}
          positions={segment.coordinates}
          color={getSegmentColor(index)}
          weight={8}
          opacity={getSegmentOpacity(index)}
        />
      ))}

      {/* Render markers untuk setiap waypoint */}
      {waypoints.map((marker: { name: string; lat: number; lng: number }, index: number) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>
            <div>
              <strong>{marker.name}</strong>
              <br />
              {index + 1}. {marker.name}
              <br />
              Status:{" "}
              {index < currentProgress
                ? "✅ Sudah dilewati"
                : index === currentProgress
                  ? "🟡 Sedang dilalui"
                  : "⚪ Belum dilewati"}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Controls untuk simulate progress */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Simulasi Progress</h4>
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          <button
            onClick={() => setCurrentProgress(0)}
            style={{
              padding: "8px 12px",
              backgroundColor: currentProgress === 0 ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🚦 Start di A
          </button>
          <button
            onClick={() => setCurrentProgress(Math.min(1, maxProgress))}
            style={{
              padding: "8px 12px",
              backgroundColor: currentProgress === 1 ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✅ Sampai B
          </button>
          <button
            onClick={() => setCurrentProgress(Math.min(2, maxProgress))}
            style={{
              padding: "8px 12px",
              backgroundColor: currentProgress === 2 ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🏁 Sampai C
          </button>
        </div>

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          <div>🟢 Hijau: Sudah dilewati</div>
          <div>🟠 Orange: Sedang dilalui</div>
          <div>⚪ Abu-abu: Akan dilalui</div>
        </div>
      </div>

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          Loading route...
        </div>
      )}
    </MapContainer>
  );
};

// FitBounds helper removed (was unused) to satisfy noUnusedLocals/noUnusedParameters in tsconfig
