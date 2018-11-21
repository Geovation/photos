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

const CENTER = [-0.07, 51.58];
const ZOOM = 10;

class Map extends Component {

  constructor(props) {
    super(props);
    this.map = {};
  }

  async componentDidMount(){
    const location = this.props.location;
    const photos = config.dbModule.fetchPhotos();

    mapboxgl.accessToken = ''; // you can add a Mapbox access token here
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: location ? [location.longitude,location.latitude] : CENTER, // starting position [lng, lat]
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
        el.style.backgroundImage = `url(${feature.properties.thumbnail})`;

        el.addEventListener('click', function() {
            window.alert(`${feature.properties.id} => ${feature.properties.description}`);
        });

        // add marker to map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(this.map);
    });
  }

  flyToGpsLocation = () =>{
    this.map.flyTo({
      center: [this.props.location.longitude,this.props.location.latitude]
    });
  }

  render() {
    const gpsOffline = !(this.props.location && this.props.location.online);
    const gpsDisabled = !this.props.location;
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
      </div>
    );
  }
}

export default Map;
