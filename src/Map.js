import "./Weather.css";
import { useEffect, useRef } from "react";

import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";


function Map() {
  const mapElement = useRef();

  useEffect(() => {
    let map = tt.map({
      key: "WbaubosS92TZI3BI0FqO4uAy44mk1zAS",
      container: mapElement.current,
    });
    return () => map.remove();
  }, []);

  return (
      <div ref={mapElement} className="mapDiv" />
  );
}

export default Map;

