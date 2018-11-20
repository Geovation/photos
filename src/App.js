import React, { Component } from 'react';
import { Route, Switch, withRouter} from "react-router-dom";

import PhotoPage from './components/PhotoPage';
import LandingPage from './components/LandingPage';
import Map from './components/Map';
import config from "./custom/config";
import EverybodyPage from "./custom/components/EverybodyPage";
import AnonymousPage from "./custom/components/AnonymousPage";
import ModeratorPage from "./components/ModeratorPage";
import SignedinPage from "./custom/components/SignedinPage";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null,
      location: null,
      isSignedIn: null,
      photosToModerate: []
    };
    this.geoid = null;
  }

  openPhotoPage = (file) => {
    this.setState({
      file
    });
    this.props.history.push('/photo');
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
      <Switch>
        <Route exact path="/" render={(props) =>
          <LandingPage {...props}
            openMenu={this.openMenu}
            closeMenu={this.closeMenu}
            openSignedinPage={this.openSignedinPage}
            isSignedIn={this.state.isSignedIn}
            openPhotoPage={this.openPhotoPage}
          />}
        />

        <Route path="/everybody" component={EverybodyPage} />
        <Route path="/anonymous" component={AnonymousPage} />
        <Route path="/moderator" render={(props) =>
          <ModeratorPage {...props}
            photos={this.state.photosToModerate}
          />}
        />
        <Route path="/photo" render={(props) =>
          <PhotoPage {...props}
             file={this.state.file}
             location={this.state.location}
          />}
        />
        <Route path="/map" component={Map} />
        <Route path="/signedin" component={SignedinPage} />

      </Switch>
    );
  }
}

export default withRouter(App);
