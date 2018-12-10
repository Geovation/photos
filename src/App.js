import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import _ from 'lodash';

import RootRef from '@material-ui/core/RootRef';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Snackbar from '@material-ui/core/Snackbar';
import MapIcon from '@material-ui/icons/Map';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CheckIcon from '@material-ui/icons/Check';

import PhotoPage from './components/PhotoPage';
import Map from './components/Map';
import config from './custom/config';
import EverybodyPage from './custom/components/EverybodyPage';
import AnonymousPage from './custom/components/AnonymousPage';
import ModeratorPage from './components/ModeratorPage';
import SignedinPage from './custom/components/SignedinPage';
import CustomPhotoDialog from './components/CustomPhotoDialog';

import Header from './components/Header';

import './App.scss'
import Login from "./components/Login";

const TABS = {
  map: {
    path: "/",
    title: "Map",
    label: "Map"
  },
  photos: {
    path: "/photo",
    title: "Photos",
    label: "Photo"
  },
  moderator: {
    path: "/moderator",
    title: "Moderator",
    label: "Moderate"
  }
};

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      file: null,
      location: {},
      isSignedIn: null,
      photosToModerate: [],
      online: false,
      tab: _.find(TABS, tab => tab.path === this.props.location.pathname),
      loginLogoutDialogOpen: false,
      openPhotoDialog: false
    };
    this.geoid = null;
    this.domRefInput = {};
  }

  openPhotoPage = (file) => {
    this.setState({
      file
    });

    this.goToTab(TABS.photos);
  };

  setLocationWatcher() {
    if (navigator && navigator.geolocation) {
      this.geoid = navigator.geolocation.watchPosition(position => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          online: true,
          updated: new Date(position.timestamp) // it indicate the freshness of the location.
        };
        this.setState({
          location
        });

      }, error => {
        console.log('Error: ', error.message);
        const location = this.state.location;
        location.online = false;
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
    await config.dbModule.disconnect();
    await this.unregisterLocationObserver();
    await this.unregisterConnectionObserver();
  }

  goToTab = tab => {
    this.setState({ tab });
    this.props.history.push(tab.path);
  }

  handleTab = (event, value) => {
    if (value !== TABS.photos) {
      this.goToTab(value);
    }
  }

  handleClickLoginLogout = () => {
    let loginLogoutDialogOpen = true;

    if (this.state.isSignedIn) {
      config.authModule.signOut();
      loginLogoutDialogOpen = false;
    }

    this.setState({ loginLogoutDialogOpen });
  };

  handleLoginClose = () => {
    this.setState({ loginLogoutDialogOpen:false});
  };

  handlePhotoClick = () => {
    if (window.cordova) {
      console.log("Opening cordova dialog");
      this.setState({ openPhotoDialog: true });
    } else {
      console.log("Clicking on photo");
      this.domRefInput.current.click();
    }
  };

  openFile = (e) => {
    if (e.target.files[0]) {
      this.openPhotoPage(e.target.files[0]);
    }
  }

  handlePhotoDialogClose = dialogSelectedValue => {
    this.setState({ openPhotoDialog: false });
    if (dialogSelectedValue) {
      const Camera = navigator.camera;
      const srcType = dialogSelectedValue === 'CAMERA' ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;

      Camera.getPicture(imageUri => {
          this.openPhotoPage(imageUri);
        }, message => {
          console.log('Failed because: ', message);
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: srcType,
          correctOrientation: true
        });
    }
  };

  render() {
    return (
      <div className="geovation-app">
        <Header headline={this.state.tab.title}
                user={this.state.isSignedIn}
                online={this.state.online}
                handleClickLoginLogout={this.handleClickLoginLogout}
        />

        <main className="content" tab={this.state.tab}>
          <Switch>
            <Route path='/everybody' component={EverybodyPage} />
            <Route path='/anonymous' component={AnonymousPage} />
            <Route path={TABS.moderator.path} render={(props) =>
              <ModeratorPage {...props}
                photos={this.state.photosToModerate}
              />}
            />
            <Route path={TABS.photos.path} render={(props) =>
              <PhotoPage {...props}
                 file={this.state.file}
                 location={this.state.location}
                 online={this.state.online}
              />}
            />
            <Route path='/signedin' component={SignedinPage} />
            <Route path={TABS.map.path} render={(props) => <Map {...props} location={this.state.location} />}/>
          </Switch>
        </main>

        <footer>
          <BottomNavigation className="footer"
            value={this.state.tab}
            onChange={this.handleTab}
            showLabels
          >
            <BottomNavigationAction icon={<MapIcon />} value={TABS.map} label={TABS.map.label}/>
            <BottomNavigationAction icon={<AddAPhotoIcon />} value={TABS.photos} label={TABS.photos.label} onClick={this.handlePhotoClick} />
            {/*<Tab icon={<PersonPinIcon />} value={{path: "/profile"}}/>*/}

            {config.authModule.isModerator() && <BottomNavigationAction icon={<CheckIcon />} value={TABS.moderator} label={TABS.moderator.label}/>}

          </BottomNavigation>
        </footer>

        <Snackbar open={!this.state.online} message='Network not available' className="offline"/>

        { !window.cordova &&
          <RootRef rootRef={this.domRefInput}>
            <input className='hidden' type='file' accept='image/*'
                   onChange={this.openFile}
            />
          </RootRef>
        }
        { window.cordova &&
          <CustomPhotoDialog open={this.state.openPhotoDialog} onClose={this.handlePhotoDialogClose}/>
        }

        <Login
          open={this.state.loginLogoutDialogOpen && !this.state.isSignedIn}
          handleClose={this.handleLoginClose}
          loginComponent={config.loginComponent}
        />
      </div>
    );
  }
}

export default withRouter(App);
