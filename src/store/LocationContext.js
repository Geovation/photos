import React, { useState, useEffect, createContext, useRef } from 'react';
import MapLocation from "types/MapLocation";

const LocationContext = createContext({
  location: new MapLocation(),
  setLocation: () => {}
});

const LocationContextProvider = (props) => {
  const [location, setLocation] = useState(new MapLocation());
  const locationWatherId = useRef(null);
  
  useEffect(() => {
    if (!locationWatherId.current) {
      locationWatherId.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocation(new MapLocation(
            position.coords.latitude,
            position.coords.longitude,
            location.zoom,
            true,
            new Date(position.timestamp)
          ));
        },
        (error) => {
          console.error("Error: ", error.message);
          setLocation(new MapLocation(
            location.latitude,
            location.longitude,
            location.zoom,
            false,
            location.updated
          ));
        },
        { maximumAge: 1 * 60 * 1000 }
      );
    }
  
    return () => navigator.geolocation.clearWatch(locationWatherId.current);
  });

  return (
    <LocationContext.Provider value={{location}}>
      {props.children}
    </LocationContext.Provider>
  );
}

export { LocationContext,  LocationContextProvider};