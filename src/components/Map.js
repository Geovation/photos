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
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardComponent from './CardComponent';

import dbFirebase from '../dbFirebase';

import './Map.scss';
import { isIphoneWithNotchAndCordova } from '../utils';
import { withStyles } from '@material-ui/core/styles';

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const styles = theme => ({
  location: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing.unit * 0.1}px)` : theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: theme.zIndex.appBar, //app bar material-ui value
  },
  expansionDetails: {
    padding:0,
    'overflow-wrap': 'break-word',
    'word-wrap': 'break-word'
  }
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
    this.prevZoom = this.props.config.ZOOM;
    this.prevZoomTime = new Date().getTime();
    this.map = {};
    this.renderedThumbnails = {};
    this.navControl = null;
  }

  async componentDidMount(){
    const location = this.props.location;

    mapboxgl.accessToken = this.props.config.MAPBOX_TOKEN;
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: this.props.config.MAP_SOURCE,
      center: location.updated ? [location.longitude, location.latitude] : this.props.config.CENTER, // starting position [lng, lat]
      zoom: this.props.config.ZOOM, // starting zoom
      attributionControl: false,
    });

    this.navControl = new mapboxgl.NavigationControl({
      showCompass:false
    })

    if (this.props.embeddable){
      this.map.addControl(this.navControl,'top-left');
    }

    this.map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: this.props.config.MAP_ATTRIBUTION
    }), "bottom-left");
  }

  componentDidUpdate(prevProps) {
    if (this.props.geojson && this.props.geojson.features && this.props.geojson.features.length
        && this.props.geojson !== prevProps.geojson) {

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
    if (!this.map.loaded()) {
      return
    }

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

    this.map.on('zoom', e => {
      console.log(e);
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

  componentWillUnmount() {
    if (this.map.remove) { this.map.remove(); }
  }

  formatField(value, fieldName) {
    const formater = this.props.config.PHOTO_ZOOMED_FIELDS[fieldName];
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

  rejectPhoto = async () => {
    const id = this.state.feature.properties.id;  // selected thumbnail id

    // close dialogs
    this.handleConfirmDialogClose();
    this.handleDialogClose();

    // unpublish photo in firestore
    try {
      await dbFirebase.rejectPhoto(this.state.feature.properties.id, this.props.user ? this.props.user.id : null);

      const updatedFeatures = this.state.geojson.features.filter(feature => feature.properties.id !== id);
      const geojson = {
        "type": "FeatureCollection",
        "features": updatedFeatures
      };
      // update localStorage
      localStorage.setItem("cachedGeoJson", JSON.stringify(geojson));

      // remove thumbnail from the map
      this.setState({ geojson }); //update state for next updatedFeatures
      this.map.getSource('data').setData(geojson); //update source data

      this.renderedThumbnails[id].remove();
      delete this.renderedThumbnails[id];

    } catch (e) {
      this.setState({
        confirmDialogOpen: true ,
        confirmDialogTitle: `The photo wasn't deleted please try again, id:${id}`,
        confirmDialogHandleOk: this.handleConfirmDialogClose
      });
    }

  }

  handleConfirmDialogClose = () => {
    this.setState({ confirmDialogOpen: false });
  }

  render() {
    if (this.props.geojson) {
      this.map.on('load', async () => {
        const geojson = this.props.geojson;
        this.setState({ geojson });
        this.addFeaturesToMap(geojson);
      });
    }
    
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
              <div style={{ textAlign: 'center' }}>
                <img onError={(e) => { e.target.src=placeholderImage}} className={'main-image'} alt={''} src={feature.properties.main}/>
              </div>
              <Card>
                <CardActionArea>
                  <CardContent>

                    {Object.keys(this.props.config.PHOTO_ZOOMED_FIELDS).map(fieldName => (
                      <Typography gutterBottom key={fieldName}>
                        {fieldName} : {this.formatField(feature.properties[fieldName], fieldName)}
                      </Typography>
                    ))}

                  </CardContent>
                </CardActionArea>
                {this.props.user && this.props.user.isModerator &&
                  <div>
                    <Divider/>
                    <div>
                      <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography className={classes.heading}>Moderator Details</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{root:classes.expansionDetails}}>
                          <CardComponent
                            photoSelected={feature.properties}
                            handleRejectClick={this.handleRejectClick}
                          />
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </div>
                  </div>
                }
              </Card>

            </DialogContent>

          </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Map);
