import React, { useState, useEffect } from 'react';
import { Map } from 'react-arcgis';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

const MapWithClickablePoints: React.FC = () => {
  const [view, setView] = useState<__esri.MapView | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleMapLoad = (map: __esri.Map, mapView: __esri.MapView) => {
    setView(mapView); // Save the MapView instance

    // Add example data points
    const dataPoints = [
      { id: 1, longitude: -118.2437, latitude: 34.0522, info: 'Point 1: Los Angeles' },
      { id: 2, longitude: -122.4194, latitude: 37.7749, info: 'Point 2: San Francisco' },
    ];

    dataPoints.forEach((data) => {
      const point = new Point({ longitude: data.longitude, latitude: data.latitude });
      const symbol = new SimpleMarkerSymbol({
        color: 'red',
        size: 10,
        style: 'circle',
      });

      const graphic = new Graphic({
        geometry: point,
        symbol: symbol,
        attributes: data, // Attach data to the graphic
      });

      mapView.graphics.add(graphic);
    });

    // Add click event listener
    mapView.on('click', (event) => {
      mapView.hitTest(event).then((response) => {
        const result = response.results.find((r) => r.graphic && r.graphic.layer === mapView.graphics);
        if (result) {
          const attributes = result.graphic.attributes;
          setSelectedData(attributes);
        } else {
          setSelectedData(null);
        }
      });
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <Map
        className="map-container"
        mapProperties={{ basemap: 'streets-vector' }}
        viewProperties={{
          center: [-118.2437, 34.0522],
          zoom: 6,
        }}
        onLoad={handleMapLoad}
      />
      {selectedData && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <h4>Data Point Info</h4>
          <p>{selectedData.info}</p>
        </div>
      )}
    </div>
  );
};

export default MapWithClickablePoints;
