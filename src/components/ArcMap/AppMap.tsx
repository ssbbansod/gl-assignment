import { useState, useEffect } from "react";

import { Map } from 'react-arcgis';
import styles from './AppMap.module.css'
import { Coordinates } from "../../@types/coordinate";
import { default as APoint } from '@arcgis/core/geometry/Point';
import Search from '@arcgis/core/widgets/Search';
import Home from '@arcgis/core/widgets/Home';
import useFetch from "../../hooks/useFetch";
import { POLUTION_URL } from "../../consts/MapConstants";
import { addLocationPointer, calculateCenterCoordinates, getPolutionObject } from "../../utils/AppMapUtil";
import PolutionDataModel from "../Polution/PolutionDataModel";


const AppMap = () => {
   const [baseMap, setBaseMap] = useState<string>("gray-vector");
   const { data } = useFetch(POLUTION_URL)
   const [location, setLocation] = useState<Coordinates>(calculateCenterCoordinates(data.features)); // (latitude, longitude)
   const [selectedData, setSelectedData] = useState<null | object>(null)
   const [modelOpen, setModelOpen] = useState<boolean>(false)
   const [zoom, setZoom] = useState<number>(10);
   const [view, setView] = useState<__esri.MapView | null>(null);
   // const userLocation = useUserLocation();

   useEffect(() => {
      if (view) {
         // console.log("view : ", view)
         view.center = new APoint({ longitude: location[0], latitude: location[1] });
         view.zoom = zoom;
      }
   }, [location, zoom]); // Update the map when center or zoom changes

   useEffect(() => {
      // console.log("data > ", data)
      if (data) {
         setLocation(calculateCenterCoordinates(data.features));
         if (view) {
            // console.log("data effect : ", view)
            addLocationPointer(view, data.features);
         }
      }

   }, [data, view])

   const handleMapLoad = (_: any, mapView: any): any => {
      setView(mapView);

      // Create a new Search widget and add it to the top-right corner of the map view
      const searchWidget = new Search({
         view: mapView,
         container: document.createElement('search'), // Create a separate div for the widget
      });
      mapView.ui.add(searchWidget, {
         position: 'top-right',
      });

      const homeWidget = new Home({
         view: mapView,
         goToOverride: function (view:any, goToParams:any) {
            goToParams.target = {
               duration: 2000,
               easing: "ease-in-out"     // Smooth easing effect
            };
            goToParams.target = calculateCenterCoordinates(data.features)
            return view.goTo(goToParams.target, goToParams.options);
         }
      });
      // Add the Home widget to the UI
      mapView.ui.add(homeWidget, {
         position: 'bottom-left',
      });

      mapView.on('click', (event: any) => {
         // console.log("clicked > ")
         mapView.hitTest(event).then((response: any) => {
            // console.log("response > ", response.results)
            const result = response.results.find((r: any) => r?.graphic?.attributes?.geometry !== undefined);
            // const locationResult = response.results.find((r: any) => r?.graphic?.attributes?.layerId !== undefined);
            // console.log("locationResult > ", locationResult)
            if (result) {
               const attributes = result?.graphic?.attributes;
               let polutionData = getPolutionObject(attributes);
               setSelectedData(polutionData);
               setModelOpen(true)
            } else {
               setSelectedData(null);
               setModelOpen(false)
            }

         });
      });
   }

   const handleMapTypeChange = (event: any) => {
      // console.log("map-type > ", event?.target.value)
      setBaseMap(event?.target.value);
      if (view) {
         view.map.basemap = event?.target.value;
      }
   }
   const handleZoomChange = (event: any) => {
      // console.log("zoom-level > ", event?.target.value)
      setZoom(event?.target.value)
      if (view) {
         view.zoom = event?.target.value;
      }
   }

   const handleModelClose = () => { setModelOpen(false); };


   return (

      <div className={styles.appContainer}>
         <div className={styles.appHeader}> <strong>Polution Data Points of PHILADELPHIA, USA </strong></div>
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
         <PolutionDataModel open={modelOpen} onHandleClose={handleModelClose} data={selectedData} />
         {/* <input type="text" name="search" value={search} onChange={handleSearchChange}></input> */}
         <Map
            className={styles.mapContainer}
            // style={{styles["mapContainer"]}}
            mapProperties={{ basemap: baseMap }}
            viewProperties={{ center: location, zoom: zoom }}
            onLoad={handleMapLoad} // Called when the map loads
         />
         <div id="viewDiv"></div>
      </div>

   )

}

export default AppMap;