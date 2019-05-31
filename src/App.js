import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';

import RootRef from '@material-ui/core/RootRef';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Dehaze from '@material-ui/icons/Dehaze';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';

import PhotoPage from './components/PhotoPage';
import ProfilePage from './components/ProfilePage';
import Map from './components/Map';
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
import FeedbackReportsPage from './components/FeedbackReportsPage';
import authFirebase from './authFirebase';
import dbFirebase from './dbFirebase';
import { gtagPageView, gtagEvent } from './gtag.js';
import { isIphoneWithNotchAndCordova } from './utils';
import './App.scss';

const styles = theme => ({
  burger: {
    position: 'absolute',
    top: isIphoneWithNotchAndCordova() ? `calc(env(safe-area-inset-top) + ${theme.spacing.unit}px)` : theme.spacing.unit * 3,
    left: theme.spacing.unit * 2,
    margin: -theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
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
      usersLeaderboard: []
    };

    this.geoid = null;
    this.domRefInput = {};
  }

  openPhotoPage = (file) => {
    this.setState({
      file
    });

    this.goToPage(this.props.config.PAGES.photos);
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

  async componentDidMount(){
    dbFirebase.fetchStats()
      .then(stats => {
        console.log(stats);
        this.setState({ usersLeaderboard: stats.users})
      });

    gtagPageView(this.props.location.pathname);

    await Promise.all([dbFirebase.fetchStats(),dbFirebase.fetchPhotos()]).then(values => {
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

    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(online => {
      this.setState({online});
    });
    this.unregisterAuthObserver = authFirebase.onAuthStateChanged(user => {
      // lets start fresh if the user logged out
      if (this.state.user && !user) {
        gtagEvent('Signed out','User')

        this.goToPage(this.props.config.PAGES.map);
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
    this.goToPage(this.props.config.PAGES.map)
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

    if (this.props.config.SECURITY.UPLOAD_REQUIRES_LOGIN && !this.state.user) {
          // TODO: show popup with message saying that the user needs an account for this feature
          // alert("Please log in")

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
    this.goToMap();
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

  render() {
    const { classes, fields } = this.props;

    return (
      <div className='geovation-app'>
        { !this.state.termsAccepted && this.props.history.location.pathname !== this.props.config.PAGES.embeddable.path &&
          <TermsDialog handleClose={this.handleTermsPageClose}/>
        }

        <EmailVerifiedDialog
          user={this.state.user}
          open={!!(this.state.user && !this.state.user.emailVerified)}
          handleNextClick={this.handleNextClick}
        />

          <main className='content'>
            { this.state.welcomeShown &&
              <Switch>
                {this.props.config.CUSTOM_PAGES.map( (CustomPage,index) => (
                  !!CustomPage.page &&
                    <Route key={index} path={CustomPage.path}
                      render={(props) => <CustomPage.page {...props} handleClose={this.goToMap} label={CustomPage.label}/>}
                    />
                ))}
                <Route path={this.props.config.PAGES.about.path} render={(props) =>
                  <AboutPage {...props}
                    label={this.props.config.PAGES.about.label}
                    handleClose={this.goToMap}
                  />}
                />
                <Route path={this.props.config.PAGES.tutorial.path} render={(props) =>
                  <TutorialPage {...props}
                    label={this.props.config.PAGES.tutorial.label}
                    handleClose={this.goToMap}
                  />}
                />

                <Route path={this.props.config.PAGES.leaderboard.path} render={(props) =>
                  <LeaderboardPage {...props}
                    config={this.props.config}
                    label={this.props.config.PAGES.leaderboard.label}
                    usersLeaderboard={this.state.usersLeaderboard}
                    handleClose={this.goToMap}
                  />}
                />

                { this.state.user && this.state.user.isModerator &&
                  <Route path={this.props.config.PAGES.moderator.path} render={(props) =>
                    <ModeratorPage  {...props}
                      label={this.props.config.PAGES.moderator.label}
                      user={this.state.user}
                      handleClose={this.goToMap}
                    />}
                  />
                }

                { this.state.user && this.state.user.isModerator &&
                  <Route path={this.props.config.PAGES.feedbackReports.path} render={(props) =>
                    <FeedbackReportsPage {...props}
                      label={this.props.config.PAGES.feedbackReports.label}
                      user={this.state.user}
                      handleClose={this.goToMap}
                    />}
                  />
                }

                <Route path={this.props.config.PAGES.photos.path} render={(props) =>
                  <PhotoPage {...props}
                    label={this.props.config.PAGES.photos.label}
                    file={this.state.file}
                    gpsLocation={this.state.location}
                    online={this.state.online}
                    srcType={this.state.srcType}
                    cordovaMetadata={this.state.cordovaMetadata}
                    fields={fields}
                    handleClose={this.goToMap}
                    handlePhotoClick={this.handlePhotoClick}
                  />}
                />

                { this.state.user &&
                  <Route path={this.props.config.PAGES.account.path} render={(props) =>
                    <ProfilePage {...props}
                      label={this.props.config.PAGES.account.label}
                      user={this.state.user}
                      handleClose={this.goToMap}
                    />}
                  />
                }

                <Route path={this.props.config.PAGES.writeFeedback.path} render={(props) =>
                  <WriteFeedbackPage {...props}
                    label={this.props.config.PAGES.writeFeedback.label}
                    user={this.state.user}
                    location={this.state.location}
                    online={this.state.online}
                    handleClose={this.goToMap}
                  />}
                />

              </Switch>
            }

            { !this.state.welcomeShown && this.props.history.location.pathname !== this.props.config.PAGES.embeddable.path &&
              this.state.termsAccepted &&
              <WelcomePage handleClose={this.handleWelcomePageClose}/>
            }

            <Map location={this.state.location}
                 visible={[this.props.config.PAGES.map.path, this.props.config.PAGES.embeddable.path].includes(this.props.history.location.pathname)}
                 welcomeShown={this.state.welcomeShown || this.props.history.location.pathname === this.props.config.PAGES.embeddable.path}
                 geojson={this.state.geojson}
                 user={this.state.user}
                 config={this.props.config}
                 embeddable={this.props.history.location.pathname === this.props.config.PAGES.embeddable.path}
            />

            <Dehaze className={classes.burger} onClick={this.toggleLeftDrawer(true)}
              style={{
                display: this.state.welcomeShown && this.props.history.location.pathname === this.props.config.PAGES.map.path
                ? 'block'
                : 'none'
              }}
            />

            <Fab className={classes.camera} color="secondary" onClick={this.handlePhotoClick}
              style={{
                display: this.state.welcomeShown && this.props.history.location.pathname === this.props.config.PAGES.map.path
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

      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
