import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import * as localforage from "localforage";

import RootRef from '@material-ui/core/RootRef';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import PhotoPage from './components/PhotoPage';
import ProfilePage from './components/ProfilePage';
import Map from './components/MapPage/Map';
import CustomPhotoDialog from './components/CustomPhotoDialog';
import ModeratorPage from './components/ModeratorPage';
import LoginFirebase from './components/LoginFirebase';
import Login from './components/Login';
import AboutPage from './components/AboutPage';
import TutorialPage from './components/TutorialPage';
import LeaderboardPage from './components/Leaderboard';
import WelcomePage from './components/WelcomePage';
import WriteFeedbackPage from './components/WriteFeedbackPage';
import DrawerContainer from './components/DrawerContainer';
import TermsDialog from './components/TermsDialog';
import EmailVerifiedDialog from './components/EmailVerifiedDialog';
import DisplayPhoto from './components/MapPage/DisplayPhoto';
import authFirebase from './authFirebase';
import dbFirebase from './dbFirebase';
import { gtagPageView, gtagEvent } from './gtag.js';
import './App.scss';
import FeedbackReportsSubrouter from "./components/FeedbackReports/FeedbackReportsSubrouter";
const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      file: null,
      location: {},
      user: null,
      online: false,
      loginLogoutDialogOpen: false,
      openPhotoDialog: false,
      leftDrawerOpen: false,
      welcomeShown: !!localStorage.getItem("welcomeShown"),
      termsAccepted: !!localStorage.getItem("termsAccepted"),
      geojson: null,
      stats: null,
      srcType: null,
      cordovaMetadata : {},
      dialogOpen: false,
      confirmDialogOpen: false,
      usersLeaderboard: [],
      confirmDialogHandleOk: null,
      selectedFeature: undefined // undefined = not selectd, null = feature not found
    };

    this.geoid = null;
    this.domRefInput = {};

    this.VISIBILITY_REGEX = new RegExp('(^/$|^' + this.props.config.PAGES.displayPhoto.path + '/|^' + this.props.config.PAGES.embeddable.path + ')', 'g');
  }

  openPhotoPage = (file) => {
    this.setState({
      file
    });

    this.props.history.push(this.props.config.PAGES.photos.path);
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

  handleDialogClose = () => {
    this.setState({ dialogOpen : false})
  }

  async featchPhotoIfUndefined() {
    // debugger
    const regexMatch = this.props.history.location.pathname
      .match(new RegExp(`${this.props.config.PAGES.displayPhoto.path}\\/(\\w+)$`));

    const photoId = regexMatch && regexMatch[1];
    // it means that we landed on the app with a photoId in the url
    if (photoId && !this.state.selectedFeature ) {
      return dbFirebase.getPhotoByID(photoId)
        .then(selectedFeature => this.setState({ selectedFeature}))
        .catch( e => this.setState({selectedFeature: null}));
    }
  }

  componentDidMount(){

    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(online => {
      this.setState({online});
    });
    this.unregisterAuthObserver = authFirebase.onAuthStateChanged(user => {
      // lets start fresh if the user logged out
      if (this.state.user && !user) {
        gtagEvent('Signed out','User')

        this.props.history.push(this.props.config.PAGES.map.path);
        window.location.reload();
      }
      this.setState({ user });
    });

    this.unregisterLocationObserver = this.setLocationWatcher();

    //delay a second to speedup the app startup
    this.featchPhotoIfUndefined().then(() => {
      setTimeout( async () => {
        const statsPromise = dbFirebase.fetchStats()
          .then(stats => {
            console.log(stats);
            this.setState({ usersLeaderboard: stats.users});

            return stats;
          });

        gtagPageView(this.props.location.pathname);

        await Promise.all([statsPromise, dbFirebase.fetchPhotos()]).then(values => {
          const dbStats = values[0] || {};
          const geojson = values[1] || {};
          let stats = 0;

          try {
            stats = this.props.config.getStats(geojson, dbStats);
          } catch (err) {
            console.error('Get Stats: ', err.message);
          }

          this.setState({ dbStats, stats, geojson });
        });
      }, 2000);
    })

  }

  async componentWillUnmount() {
    // Terrible hack !!! it will be fixed with redux
    this.setState = console.log;

    await this.unregisterAuthObserver();
    await dbFirebase.disconnect();
    await this.unregisterLocationObserver();
    await this.unregisterConnectionObserver();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      gtagPageView(this.props.location.pathname);

      this.featchPhotoIfUndefined();
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

  handleCameraClick = () => {
    if (this.props.config.SECURITY.UPLOAD_REQUIRES_LOGIN && !this.state.user) {
      this.setState({
        dialogOpen: true,
        dialogTitle: "attention",
        dialogContentText: "Before adding photos, you must be logged into your account."
      });
    } else {
      if (window.cordova) {
        console.log('Opening cordova dialog');
        this.setState({ openPhotoDialog: true });
      } else {
        console.log('Clicking on photo');
        this.domRefInput.current.click();
      }
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

      this.setState({ srcType  : dialogSelectedValue === 'CAMERA' ? 'camera' : 'filesystem' });
      Camera.getPicture(imageUri => {
          const file = JSON.parse(imageUri);
          const cordovaMetadata = JSON.parse(file.json_metadata);
          this.setState({ cordovaMetadata });
          this.openPhotoPage(file.filename);
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

  handleTermsPageClose = (e) => {
    localStorage.setItem("termsAccepted", "Yes");
    this.setState({ termsAccepted: "Yes" });
  };

  toggleLeftDrawer = (isItOpen) => () => {
    gtagEvent(isItOpen ? 'Opened' : 'Closed','Menu');
    this.setState({leftDrawerOpen: isItOpen})
  };

  handleLoginPhotoAdd = (e) => {
    this.setState({
      loginLogoutDialogOpen: true,
      dialogOpen: false
    })
  };

  handleRejectLoginPhotoAdd = () => {
    this.setState({ dialogOpen: false });
  }

  handleNextClick = async () => {
    const user = await authFirebase.reloadUser();
    if (user.emailVerified) {
      this.setState({user: {...this.state.user, emailVerified: user.emailVerified}});
      let message = {
        title: 'Confirmation',
        body: 'Thank you for verifying your email.'
      };
      return message;
    } else {
      let message = {
        title: 'Warning',
        body: 'Email not verified yet. Please click the link in the email we sent you.'
      };
      return message;
    }
  }

  handleConfirmDialogClose = () => {
    this.setState({ confirmDialogOpen: false });
  }

  handleRejectClick = (id) => {
    this.setState({
      confirmDialogOpen: true ,
      confirmDialogTitle: `Are you sure you want to unpublish the photo ?`,
      confirmDialogHandleOk: () => this.rejectPhoto(id)
    });
  };

  handleApproveClick = (id) => {
    this.setState({
      confirmDialogOpen: true ,
      confirmDialogTitle: `Are you sure you want to publish the photo ?`,
      confirmDialogHandleOk: () => this.approvePhoto(id)
    });
  };

  approveRejectPhoto = async (isApproved, id) => {
    // close dialogs
    this.handleConfirmDialogClose();

    // unpublish photo in firestore
    try {
      if (isApproved) {
        await dbFirebase.approvePhoto(id, this.state.user ? this.state.user.id : null);
      } else {
        await dbFirebase.rejectPhoto(id, this.state.user ? this.state.user.id : null);
      }

      const selectedFeature = this.state.selectedFeature;
      selectedFeature.properties.published = isApproved;
      this.setState({ selectedFeature});

      const updatedFeatures = this.state.geojson.features.filter(feature => feature.properties.id !== id);
      const geojson = {
        "type": "FeatureCollection",
        "features": updatedFeatures
      };
      // update localStorage
      localforage.setItem("cachedGeoJson", geojson);

      // remove thumbnail from the map
      this.setState({ geojson }); //update state for next updatedFeatures

      alert(`Photo with ID ${id} ${isApproved ? 'published' : 'unpublished'}`)

    } catch (e) {
      this.setState({
        confirmDialogOpen: true ,
        confirmDialogTitle: `The photo state has not changed. Please try again, id:${id}`,
        confirmDialogHandleOk: this.handleConfirmDialogClose
      });
    }

  }

  approvePhoto = id => this.approveRejectPhoto(true, id);

  rejectPhoto = id => this.approveRejectPhoto(false, id);

  handlePhotoPageClose = () => {
    const action = this.props.history.location.state ? 'goBack' : 'replace';

    if ( this.props.history.location.pathname.startsWith(this.props.config.PAGES.embeddable.path)) {
      this.props.history[action](this.props.config.PAGES.embeddable.path);
    } else {
      this.props.history[action](this.props.config.PAGES.map.path);
    }
  }

  handlePhotoClick = (feature) => {
    this.setState({selectedFeature: feature});

    let pathname = `${this.props.config.PAGES.displayPhoto.path}/${feature.properties.id}`;
    const currentPath = this.props.history.location.pathname;
    pathname = (currentPath === this.props.config.PAGES.embeddable.path) ? currentPath + pathname : pathname;
    this.props.history.push(pathname);
  }

  render() {
    const { fields, config, history } = this.props;

    return (
      <div className='geovation-app'>
        { !this.state.termsAccepted && !this.props.history.location.pathname.startsWith(this.props.config.PAGES.embeddable.path) &&
        <TermsDialog handleClose={this.handleTermsPageClose}/>
        }

        <EmailVerifiedDialog
          user={this.state.user}
          open={!!(this.state.user && !this.state.user.emailVerified)}
          handleNextClick={this.handleNextClick}
        />

        <main className='content'>

          <Switch>
            {config.CUSTOM_PAGES.map( (CustomPage,index) => (
              !!CustomPage.page &&
              <Route key={index} path={CustomPage.path}
                     render={(props) => <CustomPage.page {...props} handleClose={history.goBack} label={CustomPage.label}/>}
              />
            ))}

            <Route path={config.PAGES.about.path} render={(props) =>
              <AboutPage {...props}
                         label={this.props.config.PAGES.about.label}
                         handleClose={history.goBack}
              />}
            />

            <Route path={config.PAGES.tutorial.path} render={(props) =>
              <TutorialPage {...props}
                            label={this.props.config.PAGES.tutorial.label}
                            handleClose={history.goBack}
              />}
            />

            <Route path={config.PAGES.leaderboard.path} render={(props) =>
              <LeaderboardPage {...props}
                               config={this.props.config}
                               label={this.props.config.PAGES.leaderboard.label}
                               usersLeaderboard={this.state.usersLeaderboard}
                               handleClose={history.goBack}
              />}
            />

            { this.state.user && this.state.user.isModerator &&
            <Route path={this.props.config.PAGES.moderator.path} render={(props) =>
              <ModeratorPage  {...props}
                              label={this.props.config.PAGES.moderator.label}
                              user={this.state.user}
                              handleClose={history.goBack}
              />}
            />
            }

            { this.state.user && this.state.user.isModerator &&
            <Route path={this.props.config.PAGES.feedbackReports.path} render={(props) =>
              <FeedbackReportsSubrouter {...props}
                                        config={this.props.config}
                                        label={this.props.config.PAGES.feedbackReports.label}
                                        user={this.state.user}
                                        handleClose={this.props.history.goBack}
              />}
            />
            }

            <Route path={config.PAGES.photos.path} render={(props) =>
              <PhotoPage {...props}
                         label={this.props.config.PAGES.photos.label}
                         file={this.state.file}
                         gpsLocation={this.state.location}
                         online={this.state.online}
                         srcType={this.state.srcType}
                         cordovaMetadata={this.state.cordovaMetadata}
                         fields={fields}
                         handleClose={history.goBack}
                         handleRetakeClick={this.handleCameraClick}
              />}
            />

            { this.state.user &&
            <Route path={this.props.config.PAGES.account.path} render={(props) =>
              <ProfilePage {...props}
                           label={this.props.config.PAGES.account.label}
                           user={this.state.user}
                           handleClose={history.goBack}
              />}
            />
            }

            <Route path={config.PAGES.writeFeedback.path} render={(props) =>
              <WriteFeedbackPage {...props}
                                 label={this.props.config.PAGES.writeFeedback.label}
                                 user={this.state.user}
                                 location={this.state.location}
                                 online={this.state.online}
                                 handleClose={history.goBack}
              />}
            />

            <Route path={[
              `${config.PAGES.displayPhoto.path}/:id`,
              `${config.PAGES.embeddable.path}${config.PAGES.displayPhoto.path}/:id`
            ]}
                   render={(props) =>
                     <DisplayPhoto
                       {...props}
                       user={this.state.user}
                       placeholderImage={placeholderImage}
                       config={config}
                       handleRejectClick={this.handleRejectClick}
                       handleApproveClick={this.handleApproveClick}
                       handleClose={this.handlePhotoPageClose}
                       feature={this.state.selectedFeature}
                     />}
            />

          </Switch>


          { !this.state.welcomeShown && this.props.history.location.pathname !== config.PAGES.embeddable.path &&
          this.state.termsAccepted &&
          <WelcomePage handleClose={this.handleWelcomePageClose}/>
          }

          <Map history={this.props.history}
               location={this.state.location}
               visible={this.props.history.location.pathname.match(this.VISIBILITY_REGEX)}
               geojson={this.state.geojson}
               user={this.state.user}
               config={config}
               embeddable={this.props.history.location.pathname.match(new RegExp(config.PAGES.embeddable.path , 'g'))}
               handleCameraClick={this.handleCameraClick}
               toggleLeftDrawer={this.toggleLeftDrawer}
               handlePhotoClick={this.handlePhotoClick}
          />
        </main>

        <Snackbar open={!this.state.geojson} message='Loading photos...' />
        <Snackbar open={this.state.welcomeShown && !this.state.online} message='Connecting to our servers...' />

        { window.cordova ?
          <CustomPhotoDialog open={this.state.openPhotoDialog} onClose={this.handlePhotoDialogClose}/>
          :
          <RootRef rootRef={this.domRefInput}>
            <input className='hidden' type='file' accept='image/*' id={'fileInput'}
                   onChange={this.openFile} onClick={(e)=> e.target.value = null}
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

        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.dialogContentText}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRejectLoginPhotoAdd} color='secondary'>
              No thanks!
            </Button>

            {/* clicking ok should either open a login box or there should be a text field in the box to enter your email address */}
            <Button onClick={this.handleLoginPhotoAdd} color='secondary'>
              Login
            </Button>
          </DialogActions>

        </Dialog>

        <Dialog open={this.state.confirmDialogOpen} onClose={this.handleConfirmDialogClose}>
          <DialogTitle>{this.state.confirmDialogTitle}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleConfirmDialogClose} color='secondary'>
              Cancel
            </Button>
            <Button onClick={this.state.confirmDialogHandleOk} color='secondary'>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(App);
