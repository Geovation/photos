import React, { useState, useEffect, createContext, useRef } from "react";
import MapLocation from "types/MapLocation";

const GeolocationContext = createContext({
  geolocation: new MapLocation(),
  setGeolocation: () => {},
});

const GeolocationContextProvider = (props) => {
  const [geolocation, setGeolocation] = useState(new MapLocation());
  const locationWatherId = useRef(null);

  useEffect(() => {
    if (!locationWatherId.current) {
      locationWatherId.current = navigator.geolocation.watchPosition(
        (position) => {
          setGeolocation(
            new MapLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              zoom: geolocation.zoom,
              online: true,
              updted: position.timestamp,
            })
          );
        },
        (error) => {
          console.error("Error: ", error.message);
          setGeolocation(
            new MapLocation({
              latitude: geolocation.latitude,
              longitude: geolocation.longitude,
              zoom: geolocation.zoom,
              online: false,
              updated: geolocation.updated,
            })
          );
        },
        { maximumAge: 1 * 60 * 1000 }
      );
    }

    return () => navigator.geolocation.clearWatch(locationWatherId.current);
  });

  return (
    <GeolocationContext.Provider value={{ geolocation: geolocation }}>
      {props.children}
    </GeolocationContext.Provider>
  );
};

export { GeolocationContext, GeolocationContextProvider };
