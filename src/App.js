import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import _ from 'lodash';
import ReactGA from 'react-ga';

import RootRef from '@material-ui/core/RootRef';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Snackbar from '@material-ui/core/Snackbar';
import MapIcon from '@material-ui/icons/Map';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CheckIcon from '@material-ui/icons/Check';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HelpIcon from '@material-ui/icons/Help';
import SchoolIcon from '@material-ui/icons/School';
import Dehaze from '@material-ui/icons/Dehaze';

import PhotoPage from './components/PhotoPage';
import ProfilePage from './components/ProfilePage';
import Map from './components/Map';
import CustomPhotoDialog from './components/CustomPhotoDialog';
import ModeratorPage from './components/ModeratorPage';

import LoginFirebase from './components/LoginFirebase';
import authFirebase from './authFirebase'

import AboutPage from './components/AboutPage';
import TutorialPage from './components/TutorialPage';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import './App.scss'
import Login from './components/Login';
import dbFirebase from './dbFirebase';
import { Link } from 'react-router-dom';

const PAGES = {
  map: {
    path: '/',
    title: 'Map',
    label: 'Map'
  },
  photos: {
    path: '/photo',
    title: 'Photos',
    label: 'Photo'
  },
  moderator: {
    path: '/moderator',
    title: 'Moderator',
    label: 'Moderate'
  },
  account: {
    path: '/account',
    title: 'Account',
    label: 'Account'
  },
  about: {
    path: '/about',
    title: 'About',
    label: 'About'
  },
  tutorial: {
    path: '/tutorial',
    title: 'Tutorial',
    label: 'Tutorial'
  },
};

class App extends Component {
  constructor(props){
    super(props);

    this.welcomeShown = !!localStorage.getItem("welcomeShown");

    this.state = {
      file: null,
      location: {},
      user: null,
      photosToModerate: [],
      online: false,
      page: _.find(PAGES, page => page.path === this.props.location.pathname),
      loginLogoutDialogOpen: false,
      openPhotoDialog: false,
      leftDrawerOpen: false,
      welcomeShown: this.welcomeShown
    };

    this.geoid = null;
    this.domRefInput = {};
  }

  openPhotoPage = (file) => {
    this.setState({
      file
    });

    this.goToPage(PAGES.photos);
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
    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(online => {
      this.setState({online});
    });
    this.unregisterAuthObserver = authFirebase.onAuthStateChanged(user => {
      // lets start fresh if the user logged out
      if (this.state.user && !user) {
        this.props.history.push(PAGES.map.path);
        window.location.reload();
      }
      this.setState({ user });
    });

    this.unregisterLocationObserver = this.setLocationWatcher();
  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;

    await this.unregisterAuthObserver();
    await dbFirebase.disconnect();
    await this.unregisterLocationObserver();
    await this.unregisterConnectionObserver();
  }

  goToPage = page => {
    ReactGA.pageview(page.path);

    this.setState({ page });
    this.props.history.push(page.path);
  }

  handlePage = (event, value) => {
    if (value !== PAGES.photos) {
      this.goToPage(value);
    }
  }

  handleClickLoginLogout = () => {
    let loginLogoutDialogOpen = true;

    if (this.state.user) {
      authFirebase.signOut();
      loginLogoutDialogOpen = false;
    }

    this.setState({ loginLogoutDialogOpen });
  };

  handleLoginClose = () => {
    this.setState({ loginLogoutDialogOpen:false});
  };

  handlePhotoClick = () => {
    if (window.cordova) {
      console.log('Opening cordova dialog');
      this.setState({ openPhotoDialog: true });
    } else {
      console.log('Clicking on photo');
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

  handleWelcomePageClose = () => {
    this.setState({ welcomeShown: true });
    localStorage.setItem("welcomeShown", true);
  };

  toggleLeftDrawer = (isItOpen) => () => {
    this.setState({leftDrawerOpen: isItOpen})
  };

  render() {
    return (
      <div className='geovation-app'>
        <main className='content'>
          { this.state.welcomeShown &&
            <Switch>
              <Route path={PAGES.about.path} component={AboutPage}/>
              <Route path={PAGES.tutorial.path} render={(props) => <TutorialPage {...props} pages={PAGES}/>}/>

              { this.state.user && this.state.user.isModerator &&
                <Route path={PAGES.moderator.path} render={(props) =>
                  <ModeratorPage {...props}
                                 photos={this.state.photosToModerate}
                  />}
                />
              }

              <Route path={PAGES.photos.path} render={(props) =>
                <PhotoPage {...props}
                           file={this.state.file}
                           location={this.state.location}
                           online={this.state.online}
                />}
              />

              { this.state.user &&
                <Route path={PAGES.account.path} render={(props) =>
                  <ProfilePage {...props}
                    user={this.state.user}
                  />}
                />
              }

              <Dehaze className='burger' onClick={this.toggleLeftDrawer(true)}
                style={{
                  display: this.props.history.location.pathname === PAGES.map.path
                  ? 'block'
                  : 'none'
                }}
              />
            </Switch>
          }

          { !this.state.welcomeShown &&
            <TutorialPage
              {...this.props}
              pages={PAGES}
              handleWelcomePageClose={this.handleWelcomePageClose}
            />
          }

          <Map location={this.state.location}
               visible={this.props.history.location.pathname === PAGES.map.path}
               welcomeShown={this.state.welcomeShown}
          />
        </main>

        <footer>
          <BottomNavigation className='footer'
            value={this.state.page}
            onChange={this.handlePage}
            showLabels
          >
            <BottomNavigationAction icon={<MapIcon />} value={PAGES.map} label={PAGES.map.label}/>
            <BottomNavigationAction icon={<AddAPhotoIcon />} value={PAGES.photos} label={PAGES.photos.label} onClick={this.handlePhotoClick} />

            {authFirebase.isModerator() && <BottomNavigationAction icon={<CheckIcon />} value={PAGES.moderator} label={PAGES.moderator.label}/>}

          </BottomNavigation>
        </footer>

        { this.state.welcomeShown &&
          <Snackbar open={!this.state.online} message='Network not available' className="offline"/>
        }

        { window.cordova ?
          <CustomPhotoDialog open={this.state.openPhotoDialog} onClose={this.handlePhotoDialogClose}/>
        :
          <RootRef rootRef={this.domRefInput}>
            <input className='hidden' type='file' accept='image/*'
                   onChange={this.openFile}
            />
          </RootRef>
        }

        <Login
          open={this.state.loginLogoutDialogOpen && !this.state.user}
          handleClose={this.handleLoginClose}
          loginComponent={LoginFirebase}
        />

        <Drawer open={this.state.leftDrawerOpen} onClose={this.toggleLeftDrawer(false)}>
          <div
            tabIndex={0}
            role='button'
            onClick={this.toggleLeftDrawer(false)}
            onKeyDown={this.toggleLeftDrawer(false)}
          >
            <List>
              { this.state.user &&
                <ListItem button>
                  <Link className='link' to={PAGES.account.path} onClick={this.handleProfileClick}>
                    <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                    <ListItemText primary={PAGES.account.label} />
                  </Link>
                </ListItem>
              }

              <ListItem button>
                <Link className='link' to={PAGES.tutorial.path}>
                  <ListItemIcon><SchoolIcon/></ListItemIcon>
                  <ListItemText primary={PAGES.tutorial.label} />
                </Link>
              </ListItem>
              <ListItem button>
                <Link className='link' to={PAGES.about.path}>
                  <ListItemIcon><HelpIcon/></ListItemIcon>
                  <ListItemText primary={PAGES.about.label} />
                </Link>
              </ListItem>

              {this.state.online && <ListItem button onClick={this.handleClickLoginLogout}>
                <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                <ListItemText primary={this.state.user ?'Logout':'Login'} />
              </ListItem>}

            </List>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(App);
