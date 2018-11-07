import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import backButton from '../images/left-arrow.svg';
import styles from '../Style/MapStyle.js';
import Db from '../services/Db.js';
import './Map.css';

const CENTER = [-0.1019313, 51.524311];
const ZOOM = 10;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.map = {};
  }

  closePage =() => {
    this.props.closePage();
  }

  async componentDidMount(){
    const photos = new Db().fetchPhotos()

    mapboxgl.accessToken = ''; // you can add a Mapbox access token here
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: CENTER, // starting position [lng, lat]
      zoom: ZOOM, // starting zoom
      customAttribution: 'Contains OS data &copy; Crown copyright and database rights 2018'
    });

    this.map.on('load', () => {
        photos.then( geojson => this.addFeaturesToMap(geojson.features) ); //'load'

      window.gtag('event', 'page_view', {
        'event_category': 'view',
        'event_label': 'Map'
      });
    });
  }

  addFeaturesToMap = features => {
    features.forEach( feature => {
        // create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${feature.properties.thumbnail})`;
        el.style.width = '50px';
        el.style.height = '50px';

        el.addEventListener('click', function() {
            window.alert(`${feature.properties.id} => ${feature.properties.description}`);
        });

        // add marker to map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(this.map);
    });
  }

  render() {
    return (
      <div style={styles.wrapper} className="geovation-map">
        <div style={styles.headline}>
          <div style={styles.buttonwrapper}>
            <Button onClick={this.closePage}>
              <img style={styles.buttonback} src={backButton} alt=''/>
            </Button>
          </div>
          <div style={styles.headtext}>Map</div>
          <div style={styles.headspace}/>
        </div>
        <div id='map'style={styles.map}></div>
      </div>
    );
  }
}

export default Map;
