import React, { useState, useEffect } from "react";

import { Map } from 'react-arcgis';
import Search from '@arcgis/core/widgets/Search';
import useDebounce from "../hooks/useDebounce";
import styles from './AppMap.module.css'
import { Coordinates } from "../@types/coordinate";
import Graphic from '@arcgis/core/Graphic';
import { default as APoint } from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import useFetch from "../hooks/useFetch";
import { POLUTION_URL } from "../consts/MapConstants";
import { calculateCenterCoordinates, getPolutionIntensity } from "./AppMapUtil";
import useUserLocation from "../hooks/useUserLocation";
import { Polution } from "../@types/polutionIntensity";



const AppMap = () => {
   const [baseMap, setBaseMap] = useState<string>("gray-vector")
   const [location, setLocation] = useState<Coordinates>([-118.2437, 34.0522]); // Store the user's location (lat, lon)
   const [loading, data, error] = useFetch(POLUTION_URL)
   const [zoom, setZoom] = useState<number>(10);
   const [view, setView] = useState<__esri.MapView | null>(null); // Store the MapView instance
   // const userLocation = useUserLocation();

   const addLocationPointer = (view: __esri.MapView, dataArray: any[]) => {
      console.log("addLocationPointer view: ", view)
      console.log("addLocationPointer : dataArray ", dataArray)
      dataArray.forEach((data: Polution) => {
         const point = new APoint({
            longitude: data.coordinate[0],
            latitude: data.coordinate[1],
         });

         const markerSymbol = new SimpleMarkerSymbol({
            color: "#5bd7d7", // Blue color with slight transparency
            size: 15*(data.intensityDelta*0.1),
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

         // view.graphics.removeAll(); // Remove any existing graphics
         view.graphics.add(pointGraphic); // Add the new graphic

      })
   };


   useEffect(() => {
      if (view) {
         // console.log("view : ", view)
         view.center = new APoint({ longitude: location[0], latitude: location[1] });
         view.zoom = zoom;
      }
   }, [location, zoom, view, data]); // Update the map when center or zoom changes

   useEffect(() => {
      console.log("data > ", data)
      if (data) {
         setLocation(calculateCenterCoordinates(data.features));
         let cityIntensity: any[] = getPolutionIntensity(data.features);
         if (view) {
            console.log("data effect : ", view)
            addLocationPointer(view, cityIntensity);
         }
      }

   }, [data, view])



   const handleMapLoad = (map: __esri.Map, mapView: __esri.MapView) => {
      setView(mapView); // Save the MapView instance
   };

   const handleMapTypeChange = (event: any) => {
      console.log("map-type > ", event?.target.value)
      setBaseMap(event?.target.value); // Update state to reflect current basemap
      if (view) {
         view.map.basemap = event?.target.value; // Update the basemap
      }
   }
   const handleZoomChange = (event: any) => {
      console.log("zoom-level > ", event?.target.value)
      setZoom(event?.target.value)
      if (view) {
         view.zoom = event?.target.value; // Update the zoom
      }
   }
   return (
      <>
         <h3>Polution Data Points of PHILADELPHIA, USA</h3>
         <label htmlFor="map-tpye" > Map View </label>
         <select id="map-type" name="mapTypes" onChange={handleMapTypeChange}>
            <option value={"gray-vector"}> gray-vector </option>
            <option value={"dark-gray-vector"}> dark-gray-vector </option>
            <option value={"streets-vector"}> streets-vector </option>
            <option value={"satellite"}> satellite </option>
            <option value={"topo-vector"}> topo-vector </option>
            <option value={"streets"}> streets </option>
         </select>
         <label htmlFor="zoom-level" > Zoom </label>
         <select id="zoom-level" name="zoomLevel" onChange={handleZoomChange}>
            <option value={10}> 10 </option>
            <option value={9}> 9 </option>
            <option value={8}> 8 </option>
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