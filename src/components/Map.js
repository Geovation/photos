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

    mapboxgl.accessToken = ''; // you can add a Mapbox access token here
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: location.updated ? [location.longitude, location.latitude] : CENTER, // starting position [lng, lat]
      zoom: ZOOM, // starting zoom
      customAttribution: 'Contains OS data &copy; Crown copyright and database rights 2018'
    });

    this.map.on('load', async () => {
      const geojson = await photos;
      this.addFeaturesToMap(geojson.features);
    });

    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'Map'
    });
  }

  addFeaturesToMap = features => {
    features.forEach( feature => {
        // create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${feature.properties.thumbnail}), url(${placeholderImage})`;

        el.addEventListener('click',()=> {
            this.setState({
              openDialog:true,
              feature
            })
        });

        // add marker to map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(this.map);
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
