import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import axios from "axios";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { XYZ } from "ol/source";
import Overlay from "ol/Overlay";
import DateRangePickerSimple from "./DateRangeSelector/DateRangePickerSimple";
import Swal from "sweetalert2";

export default function MapLayer() {
  const mapRef = useRef();
  const mapObjectRef = useRef();
  const vectorLayerRef = useRef(null);
  const popupRef = useRef();
  const overlayRef = useRef();

  
  async function getLayer(start, end) {
  try {
    const res = await axios.get(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}&minmagnitude=5`
    );

    const geojsonData = res.data;

    // احذف الطبقة القديمة
    if (vectorLayerRef.current) {
      mapObjectRef.current.removeLayer(vectorLayerRef.current);
    }

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData, {
        featureProjection: "EPSG:3857",
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.7)" }),
          stroke: new Stroke({
            color: "rgba(255, 200, 200, 0.9)",
            width: 6,
          }),
        }),
      }),
    });

    vectorLayerRef.current = vectorLayer;
    mapObjectRef.current.addLayer(vectorLayer);

    //  عرض تنبيه بعد نجاح تحميل البيانات
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Earthquake data loaded successfully",
      showConfirmButton: false,
      timer: 1500,
    });

  } catch (err) {
    console.error("خطأ في جلب بيانات الزلازل:", err);

    //  لو في خطأ، اظهر تنبيه خطأ
    Swal.fire({
      icon: "error",
      title: "Failed to load ",
      text: "Failed to load earthquake data",
    });
  }
}


  useEffect(() => {
    const baseLayer = new TileLayer({
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attributions: "© Esri, HERE, Garmin, FAO, NOAA, USGS",
      }),
    });

    const view = new View({
      center: fromLonLat([30, 25]),
      zoom: 2,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer],
      view: view,
    });

    mapObjectRef.current = map;

    // popup overlay
    const overlay = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -15],
    });
    overlayRef.current = overlay;
    map.addOverlay(overlay);

  
    map.on("singleclick", function (event) {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);

      if (feature) {
        const coords = feature.getGeometry().getCoordinates();
        const props = feature.getProperties();

        popupRef.current.innerHTML = `
          <strong>Earthquake Info</strong><br/>
          <b>Place:</b> ${props.place || "Unknown"}<br/>
          <b>Magnitude:</b> ${props.mag || "N/A"}<br/>
          <b>Date:</b> ${new Date(props.time).toLocaleString()}
        `;

        popupRef.current.classList.remove("hidden");
        overlay.setPosition(coords);

        //زوم على النقطة
        map.getView().animate({
          center: coords,
          zoom: 6,
          duration: 500,
        });
      } else {
        popupRef.current.classList.add("hidden");
        overlay.setPosition(undefined);
      }
    });

    

    return () => map.setTarget(null);
  }, []);

  return (
    <div>

      <div
        style={{
          position: "absolute",
          top: "70px",
          right: "91%",
          transform: "translateX(80%)",
          zIndex: 1000,
          width: "40%",
          maxWidth: "400px",
        }}
      >
        <DateRangePickerSimple
          onRangeChange={(start, end) => getLayer(start, end)}
        />
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "90.3vh",
          margin: 0,
          padding: 0,
        }}
      ></div>

      <div ref={popupRef} id="popup" className="ol-popup hidden"></div>
    </div>
  );
}
