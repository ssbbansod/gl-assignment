import { Coordinates } from "../@types/coordinate";

export function calculateCenterCoordinates(data:any[]) {
    let centerCoordinate : Coordinates = [-75,80];
    let longitudeSum : number = 0;
    let latitudeSum : number = 0;
    data.forEach((polutionObj)=>{
        let geometry = polutionObj.geometry;
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