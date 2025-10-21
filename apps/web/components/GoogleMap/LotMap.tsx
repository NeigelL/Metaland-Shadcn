"use client";

import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { useEffect,  useState } from "react";

type LatLng = google.maps.LatLngLiteral;

type LotMapProps = {
  apiKey?: string;                     // BROWSER KEY (locked to referrers + API restriction)
  height?: string;
  projectPath: any;
  lot_id: string;
};

export default function LotMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  projectPath,
  height = "60vh",
  lot_id,
}: LotMapProps) {

    const [project, setProject] = useState<any>( []);
    const [blocks, setBlocks] = useState<any>([]);
    const [lots, setLots] = useState<any>([]);
    const [others, setOthers] = useState<any>([]);
    const [misc, setMisc] = useState<any>([]);
    const [center, setCenter] = useState<LatLng>({ lat: 0, lng: 0 });
    const [myLots, setMyLots] = useState<any>();
    const [bounds, setBounds] = useState<google.maps.LatLngBounds>();

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

      useEffect(() => {
        const ml = projectPath.lots.filter(
          (lot: any) => lot.lot_id === lot_id
        )
        if (!isLoaded || !projectPath) return;
        setProject(projectPath.projects[0].coordinates || []);
        setBlocks(projectPath.blocks || []);
        setLots(projectPath.lots || []);
        setOthers(projectPath.others || []);
        setMisc(projectPath.misc || []);
        setMyLots(ml[0]?._id || null);
        setCenter(ml.coordinates)
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
        //   mapId,                   // optional vector style
          clickableIcons: false,
          disableDefaultUI: true,  // remove unused UI
          zoomControl: true,
          gestureHandling: "greedy",
          // performance niceties
          keyboardShortcuts: false,
          draggableCursor: "default",
        }}
      >
        {
              project.map( (polygon:any , key:any) => (
                  <Polygon
                    key={key}
                    paths={polygon.coordinates}
                    options={{
                      fillColor:  "transparent",
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
        {
            [...blocks, ...others, ...blocks, ...lots, ...misc].map( (polygon:any , key:any) => (
                <Polygon
                    key={key}
                    paths={polygon.coordinates}
                    options={{
                      fillColor: myLots && myLots === polygon._id ? "#cf1627" : "transparent",
                      strokeColor: "black",
                      fillOpacity: myLots && myLots === polygon._id ? 1 : 0.5,
                      strokeOpacity: 0.8,
                      strokeWeight: 0.5,
                      clickable: false,
                    }}
                  />
            ))
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
