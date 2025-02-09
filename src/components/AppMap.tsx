import React, { useState, useEffect } from "react";

import { Map } from 'react-arcgis';
import Search from '@arcgis/core/widgets/Search';
import useDebounce from "../hooks/useDebounce";
import styles from './AppMap.module.css'
import { Coordinates } from "../@types/coordinate";
import Graphic from '@arcgis/core/Graphic';
import { default as Apoint } from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import useFetch from "../hooks/useFetch";
import { POLUTION_URL } from "../consts/MapConstants";
import { calculateCenterCoordinates } from "./AppMapUtil";
import useUserLocation from "../hooks/useUserLocation";



const AppMap = () => {
   const [baseMap, setBaseMap] = useState<string>("gray-vector")
   const [location, setLocation] = useState<Coordinates>([-118.2437, 34.0522]); // Store the user's location (lat, lon)
   const [loading, data, error] = useFetch(POLUTION_URL)
   const [zoom, setZoom] = useState<number>(4);
   const [view, setView] = useState<__esri.MapView | null>(null); // Store the MapView instance
   const userLocation = useUserLocation();

   useEffect(() => {
      console.log("data > ", data)
      if (data) {
         setLocation(calculateCenterCoordinates(data.features));
      }
   }, [data])

   useEffect(() => {
      console.log("userLocation > ", userLocation)
      setLocation(userLocation);

   }, [userLocation])

   useEffect(() => {
      if (view) {
        view.center = new Apoint({longitude:location[0],latitude:location[1]});
        view.zoom = zoom;
      }
    }, [location, zoom, view]); // Update the map when center or zoom changes
  
   
   const addUserLocationPointer = (view: __esri.MapView, location: Coordinates) => {
      const point = new Apoint({
         longitude: location[0],
         latitude: location[1],
      });

      const markerSymbol = new SimpleMarkerSymbol({
         color: [0, 122, 255, 0.8], // Blue color with slight transparency
         size: 15,
         style: 'circle',
         outline: {
            color: [255, 255, 255], // White outline
            width: 2,
         },
      });

      const pointGraphic = new Graphic({
         geometry: point,
         symbol: markerSymbol,
      });

      view.graphics.removeAll(); // Remove any existing graphics
      view.graphics.add(pointGraphic); // Add the new graphic
   };

   const handleMapLoad = (map: __esri.Map, mapView: __esri.MapView) => {
      setView(mapView); // Save the MapView instance
   };
   // const handleMapLoad = (map: __esri.Map, view: __esri.MapView) => {
   //    // Create a new Search widget and add it to the top-right corner of the map view
   //    const searchWidget = new Search({
   //       view: view,
   //       container: document.createElement('div'), // Create a separate div for the widget
   //    });

   //    view.ui.add(searchWidget, {
   //       position: 'top-right',
   //    });
   //    addUserLocationPointer(view, location);
   // };
   const handleMapTypeChange = (event: any) => {
      console.log("map-type > ", event?.target.value)
      setBaseMap(event?.target.value)
      if (view) {
         view.map.basemap = event?.target.value; // Update the basemap
      }
      setBaseMap(event?.target.value); // Update state to reflect current basemap
   }
   return (
      <>
         <label htmlFor="map-tpye" > Map Type </label>
         <select id="map-type" name="mapTypes" onChange={handleMapTypeChange}>
            <option value={"gray-vector"}> gray-vector </option>
            <option value={"dark-gray-vector"}> dark-gray-vector </option>
            <option value={"streets-vector"}> streets-vector </option>
            <option value={"satellite"}> satellite </option>
            <option value={"topo-vector"}> topo-vector </option>
            <option value={"streets"}> streets </option>
         </select>
         {/* <input type="text" name="search" value={search} onChange={handleSearchChange}></input> */}
         <Map
            className={styles.mapContainer}
            // style={{styles["mapContainer"]}}
            mapProperties={{ basemap: baseMap }}
            viewProperties={{ center: location, zoom: 12 }}
            onLoad={handleMapLoad} // Called when the map loads


         />

      </>
   )

}

export default AppMap;