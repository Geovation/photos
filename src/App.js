import React, { Component } from 'react';

import PhotoPage from './components/PhotoPage';
import LandingPage from './components/LandingPage';
import Map from './components/Map';
import Loading from './components/Loading';
import config from "./custom/config";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      renderPage: () => (<Loading />),
      file: null,
      location: null,
      isSignedIn: null,
      photosToModerate: []
    };
    this.geoid = null;
  }

  openAnonymousPage = () => {
    this.setState({ renderPage: () => (<config.AnonymousPage closePage={this.openLandingPage}/>) });
  };

  openLandingPage = () => {
    this.setState({ renderPage: () => (<LandingPage
        openMenu={this.openMenu}
        closeMenu={this.closeMenu}
        openAnonymousPage={this.openAnonymousPage}
        openSignedinPage={this.openSignedinPage}
        openModeratorPage={this.openModeratorPage}
        openEverybodyPage={this.openEverybodyPage}
        openPhotoPage={this.openPhotoPage}
        openMap={this.openMap}
        isSignedIn={this.state.isSignedIn}
      />) });
  };

  openSignedinPage = () => {
    this.setState({ renderPage: () => (<config.SignedinPage closePage={this.openLandingPage}/>) });
  };

  openEverybodyPage = () => {
    this.setState({ renderPage: () => (<config.EverybodyPage closePage={this.openLandingPage}/>) });
  };

  openModeratorPage = () => {
    this.setState({ renderPage: () => (<config.ModeratorPage closePage={this.openLandingPage} photos={this.state.photosToModerate}/>) });
  };

  openPhotoPage = (file) => {
    this.setState({
      renderPage: () => (<PhotoPage location={this.state.location} file={this.state.file} closePage={this.openLandingPage}/>),
      file
    });
  };

  openMap = () => {
    this.setState({ renderPage: () => (<Map closePage={this.openLandingPage}/>) });
  };

  setLocationWatcher() {
    if (navigator && navigator.geolocation) {
      this.geoid = navigator.geolocation.watchPosition(position => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        this.setState({
          location
        });

      }, error => {
        console.log('Error: ', error.message);
      });
    }
  }

  componentDidMount(){
    this.unregisterPhotosToModerate = config.dbModule.onPhotosToModerate(photosToModerate => {
      this.setState({photosToModerate })
    });

    this.unregisterAuthObserver = config.authModule.onAuthStateChanged(user => {

      // lets start fresh if the user logged out
      if (this.state.isSignedIn && !user) {
        window.location.reload()
      }

      this.setState({isSignedIn: user});
    });

    this.setLocationWatcher();

    this.openLandingPage();
  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;

    await this.unregisterAuthObserver();
    await this.unregisterPhotosToModerate();
    await config.dbModule.disconnect();

    if(this.geoid && navigator.geolocation) navigator.geolocation.clearWatch(this.geoid);
  }

  render() {
    return (
      this.state.renderPage()
    );
  }
}

export default App;
