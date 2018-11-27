import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import GpsFixed from '@material-ui/icons/GpsFixed';
import GpsOff from '@material-ui/icons/GpsOff';

import backButton from '../images/left-arrow.svg';
import './Map.scss';
import config from "../custom/config";
import placeholderImage from '../images/logo.svg';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const CENTER = [-0.07, 51.58];
const ZOOM = 10;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state={
      openDialog:false,
      feature: {
        properties: {
          updated:{}
        },
        geometry: {
          coordinates:{}
        }
      }
    }
    this.map = {};
  }

  async componentDidMount(){
    const location = this.props.location;
    const photos = config.dbModule.fetchPhotos();

    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: location.updated ? [location.longitude, location.latitude] : CENTER, // starting position [lng, lat]
      zoom: ZOOM, // starting zoom
      customAttribution: 'Contains OS data &copy; Crown copyright and database rights 2018'
    });

    this.map.on('load', async () => {
      const geojson = await photos;
      this.addFeaturesToMap(geojson);
    });

    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'Map'
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
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });

    this.map.on('render', 'unclustered-point',()=> {
      this.getMarkers();
    });

    this.map.on('mouseenter', 'unclustered-point',()=> {
        this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'unclustered-point',()=> {
        this.map.getCanvas().style.cursor = '';
    });
  }

  flyToGpsLocation = () =>{
    this.map.flyTo({
      center: [this.props.location.longitude, this.props.location.latitude]
    });
  }

  handleDialogClose = () => {
    this.setState({openDialog:false});
  }

  getMarkers = () =>{
    const features = this.map.queryRenderedFeatures(null,{ layers: ['unclustered-point'] });
    let sections = document.getElementsByClassName('marker');

    //clear markers
    const length = sections.length
    for (let i = 0; i < length; i++){
        sections[0].remove()
    }

    //add new markers
    features.forEach(feature=>{
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${feature.properties.thumbnail}), url(${placeholderImage})`;
      el.addEventListener('click',()=>this.setState({openDialog:true,feature}));

      new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .addTo(this.map);
    })
  }

  render() {
    const feature = this.state.feature;
    const gpsOffline = !(this.props.location.online);
    const gpsDisabled = !this.props.location.updated;
    return (
      <div className="geovation-map">
        <div className="headline">
          <div className="buttonwrapper">
            <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Button>
                <img className='buttonback' src={backButton} alt=''/>
              </Button>
            </Link>
          </div>
          <div className="headtext">Map</div>
          <div className="headspace"/>
        </div>
        <div id='map' className="map"></div>
        <Button variant="fab" className="location" onClick={this.flyToGpsLocation} disabled={gpsDisabled}>
          {gpsOffline ? <GpsOff/> : <GpsFixed/>}
        </Button>

        <Dialog open={this.state.openDialog} onClose={this.handleDialogClose}>
          <DialogContent>
            <img onError={(e) => { e.target.src=placeholderImage}} className={"main-image"} alt={''} src={feature.properties.main}/>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.properties.description}
                  </Typography>
                  <Typography component="p">
                    Coordinates: {feature.geometry.coordinates[0]}, {feature.geometry.coordinates[1]}
                  </Typography>
                  <Typography component="p">
                    Time: {Date(feature.properties.updated.seconds)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

          </DialogContent>

        </Dialog>
      </div>
    );
  }
}

export default Map;
