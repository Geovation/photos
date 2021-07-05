import React, { useRef, useEffect, createRef, Fragment } from "react";

import { Button, Dialog, makeStyles } from "@material-ui/core";

import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import config from "custom/config";
import PageWrapper from "components/PageWrapper";

  // See https://stackoverflow.com/questions/63498374/cant-show-mapbox-on-dialog-material-ui
const MapboxWrapper = ({
  mapContainer,
  imgLocation,
  handleNext,
  handleClose,
}) => {
  const useStyles = makeStyles((theme) => ({
    map: {
      top: 0,
      bottom: 0,
      height: "100%",
      width: "100%",
      position: "absolute",
    },
    space: { height: "100%" },
    button: {
      margin: theme.spacing(1.5),
      marginBottom: theme.spacing(4),
    },
  }));
  const map = useRef();
  const marker = useRef();
  const styles = useStyles();

  useEffect(() => {
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
      const center = map.current.getCenter();
      imgLocation.latitude = center.lat;
      imgLocation.longitude = center.lng;

      marker.current.setLngLat(center);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div ref={mapContainer} className={styles.map} />

      <div className={styles.space} />
      <div className={styles.button}>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={() => {
            handleNext();
            handleClose(imgLocation);
          }}
        >
          Confirm
        </Button>
      </div>
    </Fragment>
  );
};

export default function GeoTag({ open=false, imgLocation, handleNext, handleClose }) {
  const mapContainer = createRef();

  return (
    <Dialog fullScreen open={open}>
      <PageWrapper
        label="Confirm the location"
        handleClose={() => handleClose(imgLocation)}
      >
        <MapboxWrapper
          mapContainer={mapContainer}
          imgLocation={imgLocation}
          handleNext={handleNext}
          handleClose={handleClose}
        />
      </PageWrapper>
    </Dialog>
  );
}
