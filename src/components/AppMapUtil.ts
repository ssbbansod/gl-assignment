import { Coordinates } from "../@types/coordinate";
import { Polution } from "../@types/polutionIntensity";

export function calculateCenterCoordinates(data:any[]) {
    let centerCoordinate : Coordinates = [-75,80];
    let longitudeSum : number = 0;
    let latitudeSum : number = 0;
    data.forEach((featureObj)=>{
        let geometry = featureObj.geometry;
        let tempCoordinate = geometry.coordinates;
        longitudeSum = longitudeSum + tempCoordinate[0];
        latitudeSum = latitudeSum + tempCoordinate[1];
    })
    let longitude = longitudeSum/data.length
    let latitude = latitudeSum/data.length
    console.log(`longitudeSum : ${longitudeSum} | latitudeSum : ${latitudeSum}`);
    console.log(`longitude : ${longitude} | latitude : ${latitude}`);
    centerCoordinate = [longitude,latitude]
    return centerCoordinate;
}

export function getPolutionIntensity(data:any[]){
    let intensity : any[] = [];
    data.forEach((featureObj,i)=>{
        let geometry = featureObj.geometry;
        let tempCoordinate = geometry.coordinates;
        let polutionObj = featureObj.properties;
        let PM25_UG_M3 = polutionObj["PM25_UG_M3"]
        let OZONE_PPM = polutionObj["OZONE_PPM"]
        // console.log("coordinates > ",tempCoordinate);
        console.log("PM25_UG_M3 > ",PM25_UG_M3);
        
        let cityIntensityObj : Polution = {
            coordinate : tempCoordinate,
            intensityDelta : !PM25_UG_M3 ? (!OZONE_PPM ? 0 : OZONE_PPM/2.5) : PM25_UG_M3
        }
        intensity.push(cityIntensityObj);
    })
    return intensity.sort((a,b)=>a-b)
}

 