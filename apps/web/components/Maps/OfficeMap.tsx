"use client";

import { useMemo } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

interface OfficeMapProps {
  /** Latitude and longitude of your office */
  lat: number;
  lng: number;
  zoom?: number;
}

export default function OfficeMap({ lat, lng, zoom = 15 }: OfficeMapProps) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const containerStyle = { width: "100%", height: "400px" };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
