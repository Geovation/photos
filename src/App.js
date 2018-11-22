import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';

import PhotoPage from './components/PhotoPage';
import LandingPage from './components/LandingPage';
import Map from './components/Map';
import config from './custom/config';
import EverybodyPage from './custom/components/EverybodyPage';
import AnonymousPage from './custom/components/AnonymousPage';
import ModeratorPage from './components/ModeratorPage';
import SignedinPage from './custom/components/SignedinPage';
import Snackbar from '@material-ui/core/Snackbar';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null,
      location: {},
      isSignedIn: null,
      photosToModerate: [],
      online:false
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
          longitude: position.coords.longitude,
          online: true
        };
        this.setState({
          location
        });

      }, error => {
        console.log('Error: ', error.message);
        const location = this.state.location;
        if (location)  {
          location.online = false;
        }
        this.setState({
          location
        });
      });
    }

    return async () => {
      if(this.geoid && navigator.geolocation) {
        navigator.geolocation.clearWatch(this.geoid);
      }
    }
  }

  componentDidMount(){
    this.unregisterConnectionObserver = config.dbModule.onConnectionStateChanged(online => {
      this.setState({online});
    });

    this.unregisterPhotosToModerateObserver = config.dbModule.onPhotosToModerate(photosToModerate => {
      this.setState({photosToModerate})
    });

    this.unregisterAuthObserver = config.authModule.onAuthStateChanged(user => {

      // lets start fresh if the user logged out
      if (this.state.isSignedIn && !user) {
        window.location.reload();
      }

      this.setState({isSignedIn: user});
    });

    this.unregisterLocationObserver = this.setLocationWatcher();
  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;

    await this.unregisterAuthObserver();
    await this.unregisterPhotosToModerateObserver();
    await config.dbModule.disconnect();
    await this.unregisterLocationObserver();
    await this.unregisterConnectionObserver();
  }

  render() {
    return (
      <div>
        <Snackbar open={!this.state.online} message='Network not available'/>
        <Switch>
          <Route exact path='/' render={(props) =>
            <LandingPage {...props}
              online={this.state.online}
              isSignedIn={this.state.isSignedIn}
              openPhotoPage={this.openPhotoPage}
            />}
          />

          <Route path='/everybody' component={EverybodyPage} />
          <Route path='/anonymous' component={AnonymousPage} />
          <Route path='/moderator' render={(props) =>
            <ModeratorPage {...props}
              photos={this.state.photosToModerate}
            />}
          />
          <Route path='/photo' render={(props) =>
            <PhotoPage {...props}
               file={this.state.file}
               location={this.state.location}
               online={this.state.online}
            />}
          />
          <Route path='/map' render={(props) => <Map {...props} location={this.state.location} />}/>
          <Route path='/signedin' component={SignedinPage} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
