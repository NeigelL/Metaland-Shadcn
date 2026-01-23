"use client";

import { GoogleMap, Marker, OverlayView, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { Label } from "recharts";

type LatLng = google.maps.LatLngLiteral;

type LotMapProps = {
  apiKey?: string;                     // BROWSER KEY (locked to referrers + API restriction)
  height?: string;
  projectPath: any;
  lot_id: string;
  similarLots?: any[];
};


const blankMapStyle = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

const mapOptions = {
  styles: blankMapStyle,
  zoomControl: true,
}

export default function LotMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  projectPath,
  height = "60vh",
  lot_id,
  similarLots,
}: LotMapProps) {

  const [project, setProject] = useState<any>([]);
  const [blocks, setBlocks] = useState<any>([]);
  const [lots, setLots] = useState<any>([]);
  const [others, setOthers] = useState<any>([]);
  const [misc, setMisc] = useState<any>([]);
  const [center, setCenter] = useState<LatLng>({ lat: 0, lng: 0 });
  const [myLots, setMyLots] = useState<any>();
  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();
  const [mapZoom, setMapZoom] = useState(18)

  const baseFontPx = 9
  const baseZoom = 18
  const stepPx = 1.1
  const minPx = 9
  const maxPx = 18

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "lot-map",
  });

  const isMapLoaded = () => {
    const b = new google.maps.LatLngBounds();
    project.forEach((p: any) => b.extend(p));
    const c = b.getCenter().toJSON();
    setCenter(c);
    setBounds(b);
  }

  const getCenterCoordinates = (coordinates: any): { lat: number, lng: number } => {
    const lat = coordinates.reduce((sum: number, coord: any) => sum + coord.lat, 0) / coordinates.length
    const lng = coordinates.reduce((sum: number, coord: any) => sum + coord.lng, 0) / coordinates.length
    return { lat, lng }
  }

  const isDefaultCenter = (coordinates: any, centerCoordinates: any) => {
    return coordinates.length > 0 && (centerCoordinates.lat == coordinates[0].lat && centerCoordinates.lng == coordinates[0].lng)
  }

  function clamp(n: number, min: number, max: number) {
    return Math.min(min, Math.min(max, n));
  }

  const fontPx = useMemo(() => {
    const raw = baseFontPx + (mapZoom - baseZoom) * stepPx;
    return clamp(raw, minPx, maxPx);
  }, [mapZoom, baseZoom, baseFontPx, stepPx, minPx, maxPx]);

  useEffect(() => {
    const ml = projectPath.lots.filter(
      (lot: any) => lot.lot_id?._id === lot_id
    )
    if (!isLoaded || !projectPath) return;
    setProject(projectPath.projects[0].coordinates || []);
    setBlocks(projectPath.blocks || []);
    setLots(projectPath.lots || []);
    setOthers(projectPath.others || []);
    setMisc(projectPath.misc || []);
    setMyLots(ml[0] || null);
    setCenter(ml[0]?.centerCoordinates || { lat: 0, lng: 0 });
  }, [isLoaded, projectPath]);




  if (!isLoaded) {
    return (
      <div className="grid h-[60vh] w-full place-items-center rounded-2xl border border-slate-700/60 bg-[#0b0f16] text-slate-300">
        Loading map…
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-700/60">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={center}
        zoom={19}
        onLoad={(map) => {
          isMapLoaded();
          if (bounds && !bounds.isEmpty()) {
            map.fitBounds(bounds, 40);
          }
        }}
        options={{
          ...mapOptions,
          //   mapId,                   // optional vector style
          // clickableIcons: false,
          // disableDefaultUI: true,  // remove unused UI
          zoomControl: true,
          // gestureHandling: "greedy",
          // performance niceties
          // keyboardShortcuts: false,
          draggableCursor: "default",
        }}
      >
        {
          project.map((polygon: any, key: any) => (
            <Polygon
              key={key}
              paths={polygon.coordinates}
              options={{
                fillColor: "transparent",
                strokeColor: "black",
                fillOpacity: 0.5,
                strokeOpacity: 0.8,
                strokeWeight: 0.5,
                clickable: false,
              }}
            />
          )
          )
        }
        {myLots && (
          <Marker
            position={getCenterCoordinates(myLots.coordinates)}
            animation={google.maps.Animation.BOUNCE}
          />
        )}

        {[...blocks, ...others, ...blocks, ...lots, ...misc].map(
          (polygon: any, key: any) => {

            let block_name = polygon?.block_id?.name?.toUpperCase()?.replace("BLOCK ", "") || ""
            if (/^\d$/.test(block_name)) {
              block_name = block_name.padStart(2, "0")
            }

            let lot_name = polygon?.lot_id?.name?.toUpperCase()?.replace("LOT ", "") || ""
            if (/^\d$/.test(lot_name)) {
              lot_name = lot_name.padStart(2, "0")
            }

            // const showOnZoom = polygon.options?.showZoom == mapZoom
            const showOnZoom = myLots && myLots._id === polygon?._id || similarLots?.some(lot => lot.lot_id === polygon?.lot_id?._id)
            return showOnZoom && <OverlayView
              position={
                isDefaultCenter(polygon.coordinates, polygon.centerCoordinates) ? getCenterCoordinates(polygon.coordinates) : polygon.centerCoordinates
              }
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              key={key + "_label"}
            >
              <div
                style={{
                  border: "none",
                  transformOrigin: "center bottom",
                  textAlign: "center",
                  width: polygon.type !== "lot" ? "15em" : (fontPx + 20) + "px",
                  color: polygon?.lot_id?.status == "available" ? "black" : "white",
                  ...(polygon.type !== "lot"
                    ? { transform: `rotate(-45deg) scale(${Math.pow(stepPx, mapZoom - baseZoom)})` }
                    : { transform: `translateZ(0) scale(${Math.pow(stepPx, mapZoom - baseZoom)})` }),
                }}
              >
                {polygon.type == "lot" && showOnZoom && <>
                  <div>
                    <span style={{ fontSize: (fontPx + 1) + "px" }}>{[block_name, lot_name].join("-")}</span>
                  </div>

                  <div>
                    <span style={{
                      fontSize: (fontPx + 2) + "px",
                    }}>
                      {polygon.lot_id && [polygon.lot_id?.area, 'sqm'].join(" ")}
                    </span>
                  </div></>}
                {
                  polygon.type == "block" && <div>
                    <span style={{
                      color: "black",
                      fontWeight: "bold",
                      letterSpacing: "0.5em",
                      backgroundColor: "white",
                      // border: "dashed 0.5px black",
                    }}>
                      {polygon.label}</span>
                  </div>
                }
              </div>
            </OverlayView>
          }
        )}

        {
          [...blocks, ...others, ...blocks, ...lots, ...misc].map(
            (polygon: any, key: any) => {
              const isSimilarLot = similarLots?.some(lot => lot.lot_id === polygon?.lot_id?._id);
              const isOverdue = polygon?.lot_id?.amortization_id?.lookup_summary?.status == "OVERDUE"
              const fillColor = myLots && myLots._id === polygon?._id || isSimilarLot ? (isOverdue ? "#000" : "#cf1627") : "transparent";
              return <Polygon
                key={key}
                paths={polygon.coordinates}
                options={{
                  fillColor: fillColor,
                  strokeColor: "black",
                  fillOpacity: 1,
                  strokeOpacity: 0.8,
                  strokeWeight: 0.5,
                  clickable: false,
                }}
              />
            }
          )
        }
        {/* <Polygon
          path={lotPath}
          options={{
            strokeColor: "#22c55e",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: "#22c55e",
            fillOpacity: 0.15,
            clickable: false,
            zIndex: 2,
          }}
        /> */}
      </GoogleMap>
    </div>
  );
}
