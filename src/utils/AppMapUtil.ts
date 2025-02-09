import { Coordinates } from "../@types/coordinate";
import Graphic from '@arcgis/core/Graphic';
import { default as APoint } from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

export function calculateCenterCoordinates(data: any[] | [number, number]) {
    let centerCoordinate: Coordinates = [-75, 80];
    let longitudeSum: number = 0;
    let latitudeSum: number = 0;
    if (data && data[0]?.properties !== undefined) {
        data.forEach((featureObj) => {
            let geometry = featureObj.geometry;
            let tempCoordinate = geometry.coordinates;
            longitudeSum = longitudeSum + tempCoordinate[0];
            latitudeSum = latitudeSum + tempCoordinate[1];
        })
        let longitude = longitudeSum / data.length
        let latitude = latitudeSum / data.length
        // console.log(`longitudeSum : ${longitudeSum} | latitudeSum : ${latitudeSum}`);
        // console.log(`longitude : ${longitude} | latitude : ${latitude}`);
        centerCoordinate = [longitude, latitude]
    }
    return centerCoordinate;
}

function sortPolutionDataArray(polutionData: any[]) {
    polutionData.sort((a, b) => {
        let a_PM25_UG_M3 = a?.properties?.PM25_UG_M3;
        let b_PM25_UG_M3 = b?.properties?.PM25_UG_M3;
        let a_OZONE_PPM = a?.properties?.OZONE_PPM;
        let b_OZONE_PPM = b?.properties?.OZONE_PPM;

        if (a_PM25_UG_M3 && a_PM25_UG_M3) {
            return a_PM25_UG_M3 - a_PM25_UG_M3
        }
        else if (!a_PM25_UG_M3 && b_PM25_UG_M3) {
            return (a_OZONE_PPM / 2.5) - b_PM25_UG_M3
        }
        else if (a_PM25_UG_M3 && !b_PM25_UG_M3) {
            return (a_PM25_UG_M3) - (b_OZONE_PPM / 2.5)
        }
        else {
            return (a_OZONE_PPM / 2.5) - (b_OZONE_PPM / 2.5)
        }
    })
}
export const addLocationPointer = (view: __esri.MapView, dataArray: any[]) => {
    // console.log("addLocationPointer view: ", view)
    // console.log("addLocationPointer : dataArray ", dataArray)
    // let cityIntensity: any[] = getPolutionIntensity(data.features);

    sortPolutionDataArray(dataArray)
    // console.log("dataArray > ",dataArray)
    dataArray.forEach((data: any) => {
        let polutionObj = data.properties;
        let PM25_UG_M3 = polutionObj["PM25_UG_M3"]
        let OZONE_PPM = polutionObj["OZONE_PPM"]

        const point = new APoint({
            longitude: data.geometry.coordinates[0],
            latitude: data.geometry.coordinates[1],
        });

        const markerSymbol = new SimpleMarkerSymbol({
            color: "#5bd7d7", //  color with slight transparency
            size: 15 * (!PM25_UG_M3 ? (!OZONE_PPM ? 0 : OZONE_PPM / 8) : PM25_UG_M3 * 0.1),
            style: 'circle',
            outline: {
                color: [255, 255, 255], // White outline
                width: 2,
            },
        });
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: data
        });

        // view.graphics.removeAll(); // Remove any existing graphics
        view.graphics.add(pointGraphic); // Add the new graphic

    })
};
