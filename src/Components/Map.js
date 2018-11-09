import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import backButton from '../images/left-arrow.svg';
import './Map.scss';
import config from "../services/config";

const CENTER = [-0.1019313, 51.524311];
const ZOOM = 10;

class Map extends Component {

  constructor(props) {
    super(props);
    this.map = {};
  }

  closePage =() => {
    this.props.closePage();
  };

  async componentDidMount(){
    const photos = config.dbModule.fetchPhotos();

    mapboxgl.accessToken = ''; // you can add a Mapbox access token here
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: CENTER, // starting position [lng, lat]
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

  render() {
    return (
      <div className="geovation-map">
        <div className="headline">
          <div className="buttonwrapper">
            <Button onClick={this.closePage}>
              <img className="buttonback" src={backButton} alt=''/>
            </Button>
          </div>
          <div className="headtext">Map</div>
          <div className="headspace"/>
        </div>
        <div id='map' className="map"></div>
      </div>
    );
  }
}

export default Map;
