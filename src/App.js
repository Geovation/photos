import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import _ from 'lodash';

import RootRef from '@material-ui/core/RootRef';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import MapIcon from '@material-ui/icons/Map';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
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
    title: "Map"
  },
  photos: {
    path: "/photo",
    title: "Photos"
  },
  moderator: {
    path: "/moderator",
    title: "Moderator"
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
    this.props.history.replace('/photo');
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

  handleTab = (event, value) => {
    this.setState({ tab: value });
    if (value !== TABS.photos) {
      this.props.history.push(value.path);
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
    if (this.domRefInput.current) {
      console.log("Clicking on photo");
      this.domRefInput.current.click();
    } else {
      console.log("Opening cordova dialog");
      this.setState({ openPhotoDialog: true });
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
      this.props.history.push(TABS.photos.path);
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
        <Header headline={this.state.tab.title}/>

        <main className="content" tab={this.state.tab}>
          <Switch>
            {/*<Route exact path='/' render={(props) =>*/}
              {/*<LandingPage {...props}*/}
                {/*online={this.state.online}*/}
                {/*isSignedIn={this.state.isSignedIn}*/}
                {/*openPhotoPage={this.openPhotoPage}*/}
              {/*/>}*/}
            {/*/>*/}

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
            <Route path='/signedin' component={SignedinPage} />
            <Route path='/' render={(props) => <Map {...props} location={this.state.location} />}/>
          </Switch>
        </main>

        <footer>
          <Tabs className="footer"
            value={this.state.tab}
            onChange={this.handleTab}
            fullWidth
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<MapIcon />} value={TABS.map}/>
            <Tab icon={<AddAPhotoIcon />} value={TABS.photos} onClick={this.handlePhotoClick} />
            {/*<Tab icon={<PersonPinIcon />} value={{path: "/profile"}}/>*/}

            {!this.state.isSignedIn && <Tab icon={<PersonPinIcon />} disabled={!this.state.online} onClick={this.handleClickLoginLogout}/>}
            {this.state.isSignedIn && <Tab icon={<ExitToAppIcon />} value={{path: "/"}} onClick={this.handleClickLoginLogout}/>}
            {config.authModule.isModerator() && <Tab icon={<CheckIcon />} value={TABS.moderator}/>}

          </Tabs>
        </footer>

        <Snackbar open={!this.state.online} message='Network not available' className="offline"/>

        {/*{ !window.cordova && <input className='hidden' type='file' accept='image/*' ref={input => this.inputElement = input}/> }*/}
        { !window.cordova &&
        <RootRef rootRef={this.domRefInput}>
          <input className='hidden' type='file' accept='image/*'
                 onChange={this.openFile}
          />
        </RootRef>}
        { window.cordova && this.state.tab === TABS.photos &&
        <CustomPhotoDialog open={this.state.openPhotoDialog} onClose={this.handlePhotoDialogClose}/>}

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
