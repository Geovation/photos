import React, { useRef, useEffect, createRef } from "react";

import { Button, Dialog, makeStyles } from "@material-ui/core";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import config from "custom/config";
import PageWrapper from "components/PageWrapper";

export default function GeoTag({ open=false, imgLocation, handleNext, handleClose }) {
  const mapContainer = createRef();

  // See https://stackoverflow.com/questions/63498374/cant-show-mapbox-on-dialog-material-ui
  const MapboxWrapper = () => {
    const useStyles = makeStyles(() => ({
      mapContainer: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      },
      map: { height: "100%", width: "100%", position: "absolute" },
      confirmBtn: { margin: "25px" },
    }));
    const map = useRef(null);
    const marker = useRef(null);
    const styles = useStyles();

    useEffect(() => {
      if (map.current) return; // initialize map only once
      if (!imgLocation) return;

      mapboxgl.accessToken = config.MAPBOX_TOKEN;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        zoom: config.ZOOM_FLYTO,
        style: config.MAP_SOURCE,
        center: { lat: imgLocation.latitude, lon: imgLocation.longitude },
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat(map.current.getCenter())
        .addTo(map.current);
      
      map.current.on("move", () => {
        imgLocation.latitude = map.current.getCenter().lat;
        imgLocation.longitude = map.current.getCenter().lng;

        marker.current.setLngLat(map.current.getCenter());
      });
    });

    return (
      <>
        <div className={styles.mapContainer}>
          <div ref={mapContainer} className={styles.map} />
        </div>
        <Button
          className={styles.confirmBtn}
          color="secondary"
          variant="contained"
          onClick={() => {
            handleNext();
            handleClose(imgLocation);
          }}
        >
          Confirm
        </Button>
      </>
    );
  };

  return (
    <Dialog fullScreen open={open}>
      <PageWrapper
        label="Confirm the location"
        handleClose={() => handleClose(imgLocation)}
      >
        <MapboxWrapper />
      </PageWrapper>
    </Dialog>
  );
}
