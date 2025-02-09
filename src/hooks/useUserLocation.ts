import { useState,useEffect } from "react";
import { Coordinates } from "../@types/coordinate";

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<Coordinates>([-118.2437, 34.0522]); // Store the user's location (lat, lon)

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('latitude, longitude', latitude,longitude);
              setUserLocation([longitude, latitude]); // Set location as [longitude, latitude]
            },
            (error) => {
              console.error('Error getting user location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      }, []);
  
      
    return userLocation;
}

export default useUserLocation;
