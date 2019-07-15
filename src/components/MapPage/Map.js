import React, { Component } from 'react';
import _ from "lodash";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Fab from '@material-ui/core/Fab';
import GpsFixed from '@material-ui/icons/GpsFixed';
import GpsOff from '@material-ui/icons/GpsOff';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Dehaze from '@material-ui/icons/Dehaze';

import { withStyles } from '@material-ui/core/styles';

import { gtagEvent } from '../../gtag.js';
import { isIphoneWithNotchAndCordova } from '../../utils';
import './Map.scss';
import MapLocation from "../../types/MapLocation";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const styles = theme => ({
  location: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing(0.1)}px)` : theme.spacing(2),
    right: theme.spacing(2)
  },
  expansionDetails: {
    padding:0,
    'overflow-wrap': 'break-word',
    'word-wrap': 'break-word'
  },
  camera: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  burger: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing(1)}px)` : theme.spacing(3),
    left: theme.spacing(2),
    margin: -theme.spacing(2),
    padding: theme.spacing(2),
  }
});

const UPDATE_URL_COORDS_DELAY = 1000;

class Map extends Component {

  constructor(props) {
    super(props);
    this.map = {
      getCenter: () => ({ lat:0, lng: 0}),
      getZoom: () => 0,
      loaded: () => false
    };
    this.renderedThumbnails = {};
    this.navControl = null;
    this.updatingCoordinates = {};
    this.numberOfFlying = 0;
  }

  async componentDidMount(){

    mapboxgl.accessToken = this.props.config.MAPBOX_TOKEN;

    const mapLocation = this.props.mapLocation;
    const zoom = mapLocation.zoom;
    const center = mapLocation.getCenter();

    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: this.props.config.MAP_SOURCE,
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
      attributionControl: false,
    });

    this.navControl = new mapboxgl.NavigationControl({
      showCompass:false
    });

    if (this.props.embeddable) {
      this.map.addControl(this.navControl,'top-left');
    }

    this.map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: this.props.config.MAP_ATTRIBUTION
    }), "bottom-left");

    this.map.on('load', () => {
      this.addFeaturesToMap(this.props.geojson);
    });

    this.callHandlerCoordinates();

    this.map.on('moveend', e => {
      // identify end of fly event. if originalEvent is not present it means the the event was originated by a mapbox map.*to function
      if (!e.originalEvent) {
        this.numberOfFlying--;
      }

      if (this.numberOfFlying <= 0) {
        this.numberOfFlying = 0;
        gtagEvent('Moved at zoom', 'Map', this.calcMapLocation().zoom + '');
        gtagEvent('Moved at location', 'Map', `${this.calcMapLocation()}`);

        this.callHandlerCoordinates();
      }
    });

    this.map.on('render', 'unclustered-point', e => {
      this.updateRenderedThumbails(e.features);
    });

    this.map.on('mouseenter', 'clusters', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'clusters', () => {
      this.map.getCanvas().style.cursor = '';
    });

    this.map.on('click', 'clusters', (e) => {
      gtagEvent('Cluster Clicked', 'Map');
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      this.map.getSource('data').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        } else {
          this.flyTo({
            longitude: features[0].geometry.coordinates[0],
            latitude: features[0].geometry.coordinates[1],
            zoom: zoom
          });
        }
      });
    });
  }

  // Mapbox will trigger an moveend event every time a flyto/easetoo/*to ends even if called in sequence. So we need to
  // count them to determine when they are actually completed.
  flyTo = ({latitude, longitude, zoom}) => {
    this.map.flyTo({
      center: [ longitude, latitude ],
      zoom: zoom
    });
    this.numberOfFlying++;
  };

  calcMapLocation = () => (new MapLocation(this.map.getCenter().lat, this.map.getCenter().lng, this.map.getZoom()));

  componentDidUpdate(prevProps) {

    // ignore it if it is not visible
    if (!this.props.visible) {
      return;
    }

    const mapLocation = this.props.mapLocation;

    if (mapLocation && !mapLocation.isEqual(this.calcMapLocation()) && !this.updatingCoordinates) {
      this.flyTo({...mapLocation});
    }

    // if the geofeatures have changed
    if (this.map.loaded() && !_.isEqual(this.props.geojson, prevProps.geojson)) {
      this.addFeaturesToMap(this.props.geojson);
    }

    if(this.props.embeddable!==prevProps.embeddable){
      if (this.props.embeddable){
        this.map.addControl(this.navControl,'top-left');
      }
      else{
        this.map.removeControl(this.navControl);
      }
    }
  }

  addFeaturesToMap = geojson => {
    if (this.map.getLayer("clusters")) this.map.removeLayer("clusters")
    if (this.map.getLayer("cluster-count")) this.map.removeLayer("cluster-count")
    if (this.map.getLayer("unclustered-point")) this.map.removeLayer("unclustered-point")
    if (this.map.getSource("data")) this.map.removeSource("data")

    this.map.addSource("data", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 48 // Radius of each cluster when clustering points (defaults to 50)
    });

    this.map.addLayer({
      id: "clusters",
      type: "circle",
      source: "data",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with six steps to implement six types of circles:
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#89b685",
          50,
          "#E8DB52",
          100,
          "#FEB460",
          300,
          "#FF928B",
          1000,
          "#E084B4",
          5000,
          "#8097BF"
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          17,
          50,
          18,
          100,
          19,
          300,
          20,
          1000,
          21,
          5000,
          22
        ]
      }
    });

    this.map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "data",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Source Sans Pro Bold"],
        "text-size": 15
      }
    });

    this.map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "data",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 0,
      }
    });
  }

  callLocationChangeHandler = () => {
    clearTimeout(this.updatingCoordinates);
    delete this.updatingCoordinates;

    this.props.handleMapLocationChange(this.calcMapLocation());
  }

  callHandlerCoordinates = () => {
    clearTimeout(this.updatingCoordinates);

    this.updatingCoordinates = setTimeout(() => {
      this.callLocationChangeHandler();
    }, UPDATE_URL_COORDS_DELAY);
  }

  updateRenderedThumbails = (visibleFeatures) => {
    _.forEach(this.renderedThumbnails, (thumbnailUrl, id) => {
      const exists = !!_.find(visibleFeatures, (feature) => feature.properties.id === id);
      // if it !exist => remove marker object - delete key from dictionary
      if (!exists) {
        this.renderedThumbnails[id].remove();
        delete this.renderedThumbnails[id];
      }
    })

    visibleFeatures.forEach(feature => {
      if (!this.renderedThumbnails[feature.properties.id]) {
        //create a div element - give attributes
        const el = document.createElement('div');
        el.className = 'marker';
        el.id = feature.properties.id;
        el.style.backgroundImage = `url(${feature.properties.thumbnail}), url(${placeholderImage}) `;
        el.addEventListener('click', () => {
          gtagEvent('Photo Clicked', 'Map', feature.properties.id);
          this.callLocationChangeHandler();
          this.props.handlePhotoClick(feature);
        });
        //create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .addTo(this.map);
        //save the marker object to the renderedThumbnails dictionary
        this.renderedThumbnails[feature.properties.id] = marker;
      }
    });
  }

  componentWillUnmount() {
    if (this.map.remove) { this.map.remove(); }
  }

  handlerLocation() {
    clearTimeout(this.updatingCoordinates);
    delete this.updatingCoordinates;
    this.props.handleLocationClick();
  }

  render() {

    const { gpsOffline, gpsDisabled, classes } = this.props;

    return (
      <div className={"geovation-map"} style={{ visibility: this.props.visible ? "visible" : "hidden" }}>
        <div id='map' className="map"></div>

        <Fab className={classes.location} size="small" onClick={() => this.handlerLocation()} disabled={gpsDisabled}>
          {gpsOffline ? <GpsOff/> : <GpsFixed/>}
        </Fab>

        {!this.props.embeddable &&
        <div>
          <Fab className={classes.camera} color="secondary" onClick={this.props.handleCameraClick}>
            <AddAPhotoIcon />
          </Fab>
          <Dehaze className={classes.burger} onClick={this.props.toggleLeftDrawer(true)} />
        </div>
        }

      </div>
    );
  }
}

export default withStyles(styles)(Map);
