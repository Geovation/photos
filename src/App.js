import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import { gtagPageView, gtagEvent } from './gtag.js';

import RootRef from '@material-ui/core/RootRef';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Dehaze from '@material-ui/icons/Dehaze';
import PhotoPage from './components/PhotoPage';
import ProfilePage from './components/ProfilePage';
import Map from './components/Map';
import CustomPhotoDialog from './components/CustomPhotoDialog';
import ModeratorPage from './components/ModeratorPage';
import LoginFirebase from './components/LoginFirebase';
import authFirebase from './authFirebase';
import dbFirebase from './dbFirebase';
import Login from './components/Login';
import AboutPage from './components/AboutPage';
import TutorialPage from './components/TutorialPage';
import WelcomePage from './components/WelcomePage';
import WriteFeedbackPage from './components/WriteFeedbackPage';
import DrawerContainer from './components/DrawerContainer';

import config from './custom/config';
import './App.scss';
import { withStyles } from '@material-ui/core/styles';
import { isIphoneWithNotchAndCordova } from './utils';


const PAGES = config.PAGES;

const styles = theme => ({
  burger: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing.unit}px)` : theme.spacing.unit * 3,
    left: theme.spacing.unit * 2,
    zIndex: theme.zIndex.appBar, //app bar material-ui value
  },
  camera: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      file: null,
      location: {},
      user: null,
      photosToModerate: [],
      online: false,
      loginLogoutDialogOpen: false,
      openPhotoDialog: false,
      leftDrawerOpen: false,
      welcomeShown: !!localStorage.getItem("welcomeShown"),
      photos: Promise.resolve([])
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
    gtagPageView(this.props.location.pathname);

    const photos = dbFirebase.fetchPhotos();
    config.getStats(photos).then(stats => {
      this.setState({ photos, stats });
    }).catch(err => {
      console.error('Get Stats: ', err.message);
      this.setState({ photos, stats: 0 });
    });

    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(online => {
      this.setState({online});
    });
    this.unregisterAuthObserver = authFirebase.onAuthStateChanged(user => {
      // lets start fresh if the user logged out
      if (this.state.user && !user) {
        gtagEvent('Signed out','User')

        this.goToPage(PAGES.map);
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
    this.props.history.push(page.path);
  }

  goToMap = () => {
    this.goToPage(config.PAGES.map)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      gtagPageView(this.props.location.pathname);
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
    this.goToMap();
  };

  toggleLeftDrawer = (isItOpen) => () => {
    gtagEvent(isItOpen ? 'Opened' : 'Closed','Menu');
    this.setState({leftDrawerOpen: isItOpen})
  };

  render() {
    const { classes } = this.props;
    return (
      <div className='geovation-app'>
        <main className='content'>
          { this.state.welcomeShown &&
            <Switch>
              {config.CUSTOM_PAGES.map( (CustomPage,index) => (
                !!CustomPage.page &&
                  <Route key={index} path={CustomPage.path}
                    render={(props) => <CustomPage.page {...props} handleClose={this.goToMap} label={CustomPage.label}/>}
                  />
              ))}
              <Route path={PAGES.about.path} render={(props) =>
                <AboutPage label={PAGES.about.label} {...props} handleClose={this.goToMap} />}
              />
              <Route path={PAGES.tutorial.path} render={(props) =>
                <TutorialPage label={PAGES.tutorial.label} {...props} handleClose={this.goToMap} />}
              />

              { this.state.user && this.state.user.isModerator &&
                <Route path={PAGES.moderator.path} render={(props) =>
                  <ModeratorPage label={PAGES.moderator.label} {...props} handleClose={this.goToMap} user={this.state.user} />}
                />
              }

              <Route path={PAGES.photos.path} render={(props) =>
                <PhotoPage {...props}
                           file={this.state.file}
                           gpsLocation={this.state.location}
                           online={this.state.online}
                           handlePhotoClick={this.handlePhotoClick}
                           handleClose={this.goToMap}
                           label={PAGES.photos.label}
                />}
              />

              { this.state.user &&
                <Route path={PAGES.account.path} render={(props) =>
                  <ProfilePage {...props}
                               user={this.state.user}
                               handleClose={this.goToMap}
                               label={PAGES.about.label}
                  />}
                />
              }

              <Route path={PAGES.writeFeedback.path} render={(props) =>
                 <WriteFeedbackPage {...props}
                                    user={this.state.user}
                                    location={this.state.location}
                                    online={this.state.online}
                                    handleClose={this.goToMap}
                                    label={PAGES.writeFeedback.label}
                 />}
               />

            </Switch>
          }

          { !this.state.welcomeShown && this.props.history.location.pathname !== PAGES.embeddable.path &&
            <WelcomePage handleClose={this.handleWelcomePageClose}/>
          }

          <Map location={this.state.location}
              visible={[PAGES.map.path, PAGES.embeddable.path].includes(this.props.history.location.pathname)}
              welcomeShown={this.state.welcomeShown || this.props.history.location.pathname === PAGES.embeddable.path}
              photos={this.state.photos}
              user={this.state.user}
          />

          <Dehaze className={classes.burger} onClick={this.toggleLeftDrawer(true)}
            style={{
              display: this.state.welcomeShown && this.props.history.location.pathname === PAGES.map.path
              ? 'block'
              : 'none'
            }}
          />

          <Fab className={classes.camera} color="secondary" onClick={this.handlePhotoClick}
            style={{
              display: this.state.welcomeShown && this.props.history.location.pathname === PAGES.map.path
              ? 'flex'
              : 'none'
            }}
          >
            <AddAPhotoIcon />
          </Fab>
        </main>

        <Snackbar open={this.state.welcomeShown && !this.state.online} message='Network not available' />

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

        <DrawerContainer user={this.state.user} online={this.state.online}
          handleClickLoginLogout={this.handleClickLoginLogout}
          leftDrawerOpen={this.state.leftDrawerOpen} toggleLeftDrawer={this.toggleLeftDrawer}
          stats={this.state.stats}
        />

      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
