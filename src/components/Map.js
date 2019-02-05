import React, { Component } from 'react';
import _ from "lodash";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { gtagEvent } from '../gtag.js';

import Fab from '@material-ui/core/Fab';
import GpsFixed from '@material-ui/icons/GpsFixed';
import GpsOff from '@material-ui/icons/GpsOff';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import dbFirebase from '../dbFirebase';

import './Map.scss';
import config from "../custom/config";
import { isIphoneWithNotchAndCordova } from '../utils';
import { withStyles } from '@material-ui/core/styles';

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const CENTER = [-0.07, 51.58];
const ZOOM = 10;

const styles = theme => ({
  location: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing.unit * 0.1}px)` : theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: theme.zIndex.appBar, //app bar material-ui value
  },
});


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      feature: {
        properties: {
          updated: {}
        },
        geometry: {
          coordinates:{}
        }
      },
      confirmDialogOpen: false,
      confirmDialogTitle: '',
      confirmDialogHandleOk: null,
      geojson: null,
    }
    this.prevZoom = ZOOM;
    this.prevZoomTime = new Date().getTime();
    this.map = {};
    this.renderedThumbnails = {};
  }

  async componentDidMount(){
    const location = this.props.location;

    mapboxgl.accessToken = config.MAPBOX_TOKEN;
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: config.MAP_SOURCE,
      center: location.updated ? [location.longitude, location.latitude] : CENTER, // starting position [lng, lat]
      zoom: ZOOM, // starting zoom
      attributionControl: false,
    });

    this.map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: config.MAP_ATTRIBUTION
    }), "bottom-left");

    this.map.on('load', async () => {
      const geojson = await this.props.photos;
      this.setState({geojson})
      this.addFeaturesToMap(geojson);
    });
  }

  addFeaturesToMap = geojson => {
    this.map.addSource("data", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 40 // Radius of each cluster when clustering points (defaults to 50)
    });

    this.map.addLayer({
        id: "clusters",
        type: "circle",
        source: "data",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                750,
                "#f28cb1"
            ],
            "circle-radius": [
                "step",
                ["get", "point_count"],
                20,
                100,
                30,
                750,
                40
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
            "text-font": ["Source Sans Pro Regular"],
            "text-size": 12
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

    this.map.on('zoom', e => {
      console.log(e);
      // debugger
      const zoom = Math.round(this.map.getZoom());
      const milliSeconds = 1 * 1000;
      const timeLapsed = new Date().getTime() - this.prevZoomTime;

      if (this.prevZoom !== zoom && timeLapsed > milliSeconds) {
        gtagEvent('Zoom','Map',zoom + '');
        this.prevZoom = zoom;
      }

      this.prevZoomTime = new Date().getTime();
    });

    this.map.on('moveend', e => {
      gtagEvent('Moved at zoom', 'Map', this.prevZoom + '');
      gtagEvent('Moved at location', 'Map', `${this.map.getCenter()}`);
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
        if (err)
            return;
        this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
        });
      });
    });
  }

  flyToGpsLocation = () => {
    gtagEvent('Location FAB clicked', 'Map');
    this.map.flyTo({
      center: [this.props.location.longitude, this.props.location.latitude]
    });
  }

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  }

  updateRenderedThumbails = (visibleFeatures) =>{
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
          gtagEvent('Photo Opened', 'Map', feature.properties.id);
          this.setState({ openDialog: true, feature });
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

  componentDidUpdate(prevProps,prevState){

  }

  componentWillUnmount() {
    if (this.map.remove) { this.map.remove(); }
  }

  formatField(value, fieldName) {
    // console.log('value',value,'fieldName',fieldName,'feature',this.state.feature,Object.keys(this.renderedThumbnails),'photos',this.state.photos);
    const formater = config.PHOTO_ZOOMED_FIELDS[fieldName];
    if (value) {
      return formater(value);
    }

    return "-";
  }

  handleRejectClick = () => {
    this.setState({
      confirmDialogOpen: true ,
      confirmDialogTitle: `Are you sure you want to unpublish the photo ?`,
      confirmDialogHandleOk: this.rejectPhoto
    });
  };

  rejectPhoto = () => {

    //remove layers and source
    // this.map.removeLayer('clusters');
    // this.map.removeLayer('cluster-count');
    // this.map.removeLayer('unclustered-point');
    // this.map.removeSource("data")

    // update state by removing selected element
    const id = this.state.feature.properties.id;  // selected thumbnail id
    const updatedFeatures = this.state.geojson.features.filter(feature => feature.properties.id !== id);
    const geojson = {
      "type": "FeatureCollection",
      "features": updatedFeatures
    };
    this.setState({geojson});
    this.map.getSource('data').setData(geojson);
    // rerender items in the map
    // this.addFeaturesToMap(geojson);

    // unpublish photo in firestore
    // dbFirebase.rejectPhoto(this.state.feature.properties.id,this.props.user ? this.props.user.id : null);

    // remove thumbnail from the map
    this.renderedThumbnails[id].remove();
    delete this.renderedThumbnails[id];

    // update localStorage
    localStorage.setItem("cachedGeoJson",geojson);

    // close dialogs
    this.handleConfirmDialogClose();
    this.handleDialogClose();
  }

  handleConfirmDialogClose = () => {
    this.setState({ confirmDialogOpen: false });
  }

  render() {
    const { location, welcomeShown, classes } = this.props;
    const feature = this.state.feature;
    const gpsOffline = !location.online;
    const gpsDisabled = !location.updated;

    return (
      <div className={"geovation-map"} style={{ visibility: this.props.visible ? "visible" : "hidden" }}>
          <div id='map' className="map"></div>
          { welcomeShown &&
            <Fab className={classes.location} size="small" onClick={this.flyToGpsLocation} disabled={gpsDisabled}>
              {gpsOffline ? <GpsOff/> : <GpsFixed/>}
            </Fab>
          }

          <Dialog open={this.state.confirmDialogOpen} onClose={this.handleConfirmDialogClose}>
            <DialogTitle>{this.state.confirmDialogTitle}</DialogTitle>
            <DialogActions>
              <Button onClick={this.handleConfirmDialogClose} color='secondary'>
                Cancel
              </Button>
              <Button onClick={this.state.confirmDialogHandleOk} color='secondary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.openDialog} onClose={this.handleDialogClose}>
            <DialogContent>
              <img onError={(e) => { e.target.src=placeholderImage}} className={"main-image"} alt={''} src={feature.properties.main}/>
              <Card>
                <CardActionArea>
                  <CardContent>

                    {Object.keys(config.PHOTO_ZOOMED_FIELDS).map(fieldName => (
                      <Typography gutterBottom key={fieldName}>
                        {fieldName} : {this.formatField(feature.properties[fieldName], fieldName)}
                      </Typography>
                    ))}

                  </CardContent>
                </CardActionArea>
                {this.props.user && this.props.user.isModerator &&
                  <CardActions>
                    <IconButton aria-label='Reject' onClick={this.handleRejectClick}>
                      <ThumbDownIcon />
                    </IconButton>
                  </CardActions>
                }
              </Card>

            </DialogContent>

          </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Map);
