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
      location: {},
      isSignedIn: undefined,
    };
  }

  openAnonymousPage = () => {
    this.setState({ renderPage: () => (<config.AnonymousPage closePage={this.closePage}/>) });
  };

  closePage = () => {
    this.setState({ renderPage: () => (<LandingPage
        openMenu={this.openMenu}
        closeMenu={this.closeMenu}
        openAnonymousPage={this.openAnonymousPage}
        openSignedinPage={this.openSignedinPage}
        openModeratorPage={this.openModeratorPage}
        openPhotoPage={this.openPhotoPage}
        openMap={this.openMap}
        isSignedIn={this.state.isSignedIn}
      />) });
  };

  openSignedinPage = () => {
    this.setState({ renderPage: () => (<config.SignedinPage closePage={this.closePage}/>) });
  };

  openModeratorPage = () => {
    this.setState({ renderPage: () => (<config.ModeratorPage closePage={this.closePage}/>) });
  };

  openPhotoPage = (file) => {
    this.setState({
      renderPage: () => (<PhotoPage location={this.state.location} file={this.state.file} closePage={this.closePage}/>),
      file
    });
  };

  openMap = () => {
    this.setState({ renderPage: () => (<Map closePage={this.closePage}/>) });
  };

  getLocation() {
    if (navigator && navigator.geolocation) {
      const geoid = navigator.geolocation.watchPosition((position) => {
      const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        navigator.geolocation.clearWatch(geoid);
        this.setState({
          location
        });

        this.closePage();

      }, error => {
        console.log('Error: ', error.message);
        this.closePage();
      }, {
        enableHighAccuracy: true,
        timeout: 3000
      });
    }
  }

  componentDidMount(){
    this.getLocation();

    this.unregisterAuthObserver = config.authModule.onAuthStateChanged((user) => {

      // lets start fresh if the user logged out
      if (this.state.isSignedIn && !user) {
        window.location.reload()
      }

      this.setState({isSignedIn: user});
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
      this.state.renderPage()
    );
  }
}

export default App;
