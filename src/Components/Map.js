import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import backButton from '../Images/left-arrow.svg';
import styles from '../Style/MapStyle.js';

class Map extends Component {

  closePage =() => {
    this.props.closePage();
  }

  componentDidMount(){
    const attribution = 'Contains OS data &copy; Crown copyright and database rights 2018';
    mapboxgl.accessToken = ''; // you can add a Mapbox access token here
    new mapboxgl.Map({
      container: 'map', // container id
      style: 'https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/style.json', //stylesheet location
      center: [-0.1019313, 51.524311], // starting position [lng, lat]
      zoom: 17, // starting zoom
      customAttribution:attribution
    });
  }

  render() {
    return (
      <div style={styles.wrapper}>
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
