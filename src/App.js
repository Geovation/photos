import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import * as localforage from "localforage";
import _ from "lodash";

import RootRef from "@material-ui/core/RootRef";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloseIcon from "@material-ui/icons/Close";

import { dbFirebase, authFirebase } from "features/firebase";

import SwipeTutorialPage from "./components/common/SwipeTutorialPage";
import PhotoPage from "./components/PhotoPage";
import ProfilePage from "./components/ProfilePage";
import Map from "./components/MapPage/Map";
import ModeratorPage from "./components/ModeratorPage";
import OwnPhotosPage from "./components/OwnPhotosPage";
import LoginFirebase from "./components/LoginFirebase";
import Login from "./components/Login";
import AboutPage from "./components/AboutPage";
import LeaderboardPage from "./components/Leaderboard";
import WriteFeedbackPage from "./components/WriteFeedbackPage";
import DrawerContainer from "./components/DrawerContainer";
import TermsDialog from "./components/TermsDialog";
import EmailVerifiedDialog from "./components/EmailVerifiedDialog";
import DisplayPhoto from "./components/MapPage/DisplayPhoto";
import config from "custom/config";

import { gtagPageView, gtagEvent } from "./gtag.js";
import "./App.scss";
import FeedbackReportsSubrouter from "./components/FeedbackReports/FeedbackReportsSubrouter";
import MapLocation from "./types/MapLocation";

import tutorialSteps from "./custom/tutorialSteps";
import welcomeSteps from "./custom/welcomeSteps";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const styles = (theme) => ({
  dialogClose: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      location: new MapLocation(), // from GPS
      online: false,
      loginLogoutDialogOpen: false,
      openPhotoDialog: false,
      leftDrawerOpen: false,
      welcomeShown: !!localStorage.getItem("welcomeShown"),
      termsAccepted: !!localStorage.getItem("termsAccepted"),
      geojson: null,
      stats: null,
      srcType: null,
      dialogOpen: false,
      confirmDialogOpen: false,
      usersLeaderboard: [],
      confirmDialogHandleOk: null,
      selectedFeature: undefined, // undefined = not selectd, null = feature not found
      photoAccessedByUrl: false,
      photosToModerate: {},
      mapLocation: new MapLocation(), // from the map
      sponsorImage: undefined,
    };

    this.geoid = null;
    this.domRefInput = {};
    // It contains the photos in feature format. It is used to generate a geojson state that will be passed as parameter to the Map.
    this.featuresDict = {};
    this.VISIBILITY_REGEX = new RegExp(
      "(^/@|^/$|^" +
        config.PAGES.displayPhoto.path +
        "/|^" +
        config.PAGES.embeddable.path +
        ")",
      "g"
    );
  }

  openPhotoPage = (file) => {
    this.setState({
      file,
    });

    this.props.history.push(config.PAGES.photos.path);
  };

  setLocationWatcher() {
    if (navigator && navigator.geolocation) {
      this.geoid = navigator.geolocation.watchPosition(
        (position) => {
          const location = Object.assign(this.state.location, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            online: true,
            updated: new Date(position.timestamp), // it indicate the freshness of the location.
          });

          this.setState({
            location,
          });
        },
        (error) => {
          console.log("Error: ", error.message);
          const location = this.state.location;
          location.online = false;
          this.setState({
            location,
          });
        }
      );
    }

    return async () => {
      if (this.geoid && navigator.geolocation) {
        navigator.geolocation.clearWatch(this.geoid);
      }
    };
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  async fetchPhotoIfUndefined(photoId) {
    // it means that we landed on the app with a photoId in the url
    if (photoId && !this.state.selectedFeature) {
      return dbFirebase
        .getPhotoByID(photoId)
        .then((selectedFeature) => this.setState({ selectedFeature }))
        .catch((e) => this.setState({ selectedFeature: null }));
    }
  }

  extractPathnameParams() {
    // extracts photoID
    const regexPhotoIDMatch = this.props.location.pathname.match(
      new RegExp(`${config.PAGES.displayPhoto.path}\\/(\\w+)`)
    );

    const photoId = regexPhotoIDMatch && regexPhotoIDMatch[1];

    // extracts mapLocation
    const regexMapLocationMatch = this.props.location.pathname.match(
      new RegExp("@(-?\\d*\\.?\\d*),(-?\\d*\\.?\\d*),(\\d*\\.?\\d*)z")
    );

    const mapLocation =
      (regexMapLocationMatch &&
        new MapLocation(
          regexMapLocationMatch[1],
          regexMapLocationMatch[2],
          regexMapLocationMatch[3]
        )) ||
      new MapLocation();
    if (!regexMapLocationMatch) {
      mapLocation.zoom = config.ZOOM;
    }

    return { photoId, mapLocation };
  }

  async componentDidMount() {
    let { photoId, mapLocation } = this.extractPathnameParams();
    this.setState({ photoId, mapLocation });

    // TODO: test it. Does it slow down starting up ?
    if (!this.initDone) {
      this.initDone = true;
      this.someInits(photoId);
    }

    this.unregisterAuthObserver = authFirebase.onAuthStateChanged((user) => {
      // lets start fresh if the user logged out
      if (this.props.user && !user) {
        gtagEvent("Signed out", "User");

        this.props.history.push(config.PAGES.map.path);
        window.location.reload();
      }

      // the user had logged in.
      this.props.dispatch({ type: "user/set", payload: user });
    });

    this.unregisterLocationObserver = this.setLocationWatcher();
    this.unregisterConfigObserver = dbFirebase.configObserver(
      (config) => this.setState(config),
      console.error
    );
  }

  // Saving means also to update the state which with the current implementation also means to re display the map which is very slow.
  // As a workaround, It won't update the state more than once very 10 seconds.
  saveGeojson = () => {
    this.settingGeojson = clearTimeout(this.settingGeojson);

    localforage.setItem("featuresDict", this.featuresDict);

    const geojson = {
      type: "FeatureCollection",
      features: _.map(this.featuresDict, f => f),
    };
    const stats = config.getStats(geojson, this.state.dbStats);
    this.setState({ geojson, stats });
    console.debug("GeoJson updated");
  };
  
  // Wait 10 seconds before saving it again.
  delayedSaveGeojson = () => {
    // only if a save has not be already scheduled
    if (!this.settingGeojson) {
      // do not wait the first time
      if (!this.state.geojson) this.saveGeojson();
      else this.settingGeojson = setTimeout(this.saveGeojson, 10 * 1000);
    } else {
      console.debug("not saving geojson as it has alreaby been scheduled")
    }
  };

  modifyFeature = (photo) => {
    console.debug(`modifying ${photo.id}`)
    this.featuresDict[photo.id] = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [photo.location.longitude, photo.location.latitude],
      },
      properties: photo,
    };

    this.delayedSaveGeojson();
  };

  addFeature = (photo) => {
    console.debug(`adding ${photo.id} --v`);
    this.modifyFeature(photo);
  }

  removeFeature = (photo) => {
    console.debug(`removing ${photo.id}`)
    delete this.featuresDict[photo.id];
    this.delayedSaveGeojson();
  };

  async someInits(photoId) {
    this.unregisterConnectionObserver = dbFirebase.onConnectionStateChanged(
      (online) => {
        this.setState({ online });
      }
    );

    dbFirebase.fetchStats().then((dbStats) => {
      console.log(dbStats);
      this.setState({
        usersLeaderboard: dbStats.users,
        dbStats,
        stats: config.getStats(
          this.state.geojson,
          this.state.dbStats
        ),
      });

      return dbStats;
    });

    // when photoId is defined (when acceding the app with photoid query string), need to get the photo info.
    this.fetchPhotoIfUndefined(photoId).then(async () => {
      // If the selectedFeature is not null, it means that we were able to retrieve a photo from the URL and so we landed
      // into the photoId.
      this.setState({ photoAccessedByUrl: !!this.state.selectedFeature });

      gtagPageView(this.props.location.pathname);
    });

    // Get the photos from the cache first.
    this.featuresDict = await localforage.getItem("featuresDict") || {};
    
    if (!_.isEmpty(this.featuresDict)) {
      this.delayedSaveGeojson();
    } else {
      await this.fetchPhotos();
    }
  
    this.registerPublishedPhotosRT();     
  }

  async registerPublishedPhotosRT() {
    if (this.unregisterPublishedPhotosRT) {
      await this.unregisterPublishedPhotosRT();
    }

    // The following line should speedup things. It reads all the photos until before trigger the RT listener
    await this.fetchPhotos(false, this.calculateLastUpdate());

    this.unregisterPublishedPhotosRT = dbFirebase.publishedPhotosRT(
      this.addFeature,
      this.modifyFeature,
      this.removeFeature,
      (error) => {
        console.log(error);
        alert(error);
        window.location.reload();
      },
      this.calculateLastUpdate()
    );
  }

  calculateLastUpdate() {
    let lastUpdated = new Date(null);
    if (this.state.geojson) {
      const latestPhoto = _.maxBy(this.state.geojson.features, (photo) => {
        return photo.properties.updated;
      });
      lastUpdated = _.get(latestPhoto, "properties.updated");
    }
    return lastUpdated;
  }

  async fetchPhotos(fromAPI = true, lastUpdate = new Date(null)) {
    return dbFirebase
      .fetchPhotos(fromAPI, lastUpdate)
      .then((photos) => {
        _.forEach(photos, (photo) => {
          this.addFeature(photo);
        });
      })
      .catch(console.error);
  }

  async componentWillUnmount() {
    this.unregisterAuthObserver();
    this.unregisterLocationObserver();
    this.unregisterConnectionObserver();
    this.unregisterConfigObserver();
    this.unregisterPhotosToModerate && this.unregisterPhotosToModerate();
    this.unregisterOwnPhotos && this.unregisterOwnPhotos();
    this.unregisterPublishedPhotosRT && this.unregisterPublishedPhotosRT();
    await dbFirebase.disconnect();
  }

  componentDidUpdate(prevProps, prevState) {
    const stats = config.getStats(
      this.state.geojson,
      this.state.dbStats
    );
    if (!_.isEqual(this.state.stats, stats)) {
      this.setState({ stats });
    }

    if (prevProps.location !== this.props.location) {
      gtagPageView(this.props.location.pathname);

      // if it updates, then it is guaranteed that we didn't landed into the photo
      this.setState({
        photoAccessedByUrl: false,
      });
      this.fetchPhotoIfUndefined(
        _.get(this.state, "selectedFeature.properties.id")
      );
    }

    // listen to new photos to be moderated
    if (
      _.get(this.props.user, "isModerator") &&
      !this.unregisterPhotosToModerate
    ) {
      this.unregisterPhotosToModerate = dbFirebase.photosToModerateRT(
        config.MODERATING_PHOTOS,
        (photo) => this.updatePhotoToModerate(photo),
        (photo) => this.removePhotoToModerate(photo)
      );
    }
    // if there is a user
    if (this.props.user && !this.unregisterOwnPhotos) {
      this.unregisterOwnPhotos = dbFirebase.ownPhotosRT(
        this.addFeature,
        this.modifyFeature,
        this.removeFeature,
        (error) => {
          console.log(error);
          alert(error);
          window.location.reload();
        }
      );
    }
  }

  removeFromCollection(collectionName, element) {
    console.debug(
      `removing the element ${element.id} from the collection ${collectionName} in the view`
    );

    const collection = _.cloneDeep(this.state[collectionName]);
    delete collection[element.id];

    this.setState({ [[collectionName]]: collection });
  }

  removePhotoToModerate(photo) {
    this.removeFromCollection("photosToModerate", photo);
  }

  updateCollection(collectionName, element) {
    console.debug(
      `updating the element ${element.id} from the collection ${collectionName} in the view`
    );

    const collection = _.cloneDeep(this.state[collectionName]);
    collection[element.id] = element;

    this.setState({ [[collectionName]]: collection });
  }

  updatePhotoToModerate(photo) {
    this.updateCollection("photosToModerate", photo);
  }

  handleClickLoginLogout = () => {
    let loginLogoutDialogOpen = true;

    if (this.props.user) {
      authFirebase.signOut();
      loginLogoutDialogOpen = false;
    }

    this.setState({ loginLogoutDialogOpen });
  };

  handleLoginClose = () => {
    this.setState({ loginLogoutDialogOpen: false });
  };

  handleCameraClick = () => {
    if (config.SECURITY.UPLOAD_REQUIRES_LOGIN && !this.props.user) {
      this.setState({
        dialogOpen: true,
        dialogTitle: "Please login to add a photo",
        dialogContentText:
          "Before adding photos, you must be logged into your account.",
      });
    } else {
      console.log("Clicking on photo");
      this.domRefInput.current.click();
    }
  };

  openFile = (e) => {
    if (e.target.files[0]) {
      this.openPhotoPage(e.target.files[0]);
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
    gtagEvent(isItOpen ? "Opened" : "Closed", "Menu");
    this.setState({ leftDrawerOpen: isItOpen });
  };

  handleLoginPhotoAdd = (e) => {
    this.setState({
      loginLogoutDialogOpen: true,
      dialogOpen: false,
    });
  };

  handleNextClick = async () => {
    const user = await authFirebase.reloadUser();
    if (user.emailVerified) {
      this.props.dispatch({ type: "user/set", payload: { ...this.props.user, emailVerified: user.emailVerified } });

      let message = {
        title: "Confirmation",
        body: "Thank you for verifying your email.",
      };
      return message;
    } else {
      let message = {
        title: "Warning",
        body:
          "Email not verified yet. Please click the link in the email we sent you.",
      };
      return message;
    }
  };

  handleConfirmDialogClose = () => {
    this.setState({ confirmDialogOpen: false });
  };

  handleRejectClick = (photo) => {
    this.setState({
      confirmDialogOpen: true,
      confirmDialogTitle: `Are you sure you want to unpublish the photo ?`,
      confirmDialogHandleOk: () => this.rejectPhoto(photo),
    });
  };

  handleApproveClick = (photo) => {
    this.setState({
      confirmDialogOpen: true,
      confirmDialogTitle: `Are you sure you want to publish the photo ?`,
      confirmDialogHandleOk: () => this.approvePhoto(photo),
    });
  };

  approveRejectPhoto = async (isApproved, photo) => {
    // close dialogs
    this.handleConfirmDialogClose();

    // publish/unpublish photo in firestore
    try {
      if (isApproved) {
        await dbFirebase.approvePhoto(
          photo.id,
          this.props.user ? this.props.user.id : null
        );
      } else {
        await dbFirebase.rejectPhoto(
          photo.id,
          this.props.user ? this.props.user.id : null
        );
      }

      const selectedFeature = this.state.selectedFeature;

      photo.published = isApproved;

      if (_.get(selectedFeature, "properties.id") === photo.id) {
        selectedFeature.properties.published = isApproved;
        this.setState({ selectedFeature });
      }
    } catch (e) {
      console.error(e);

      this.setState({
        confirmDialogOpen: true,
        confirmDialogTitle: `The photo state has not changed. Please try again, id:${photo.id}`,
        confirmDialogHandleOk: this.handleConfirmDialogClose,
      });
    }
  };

  approvePhoto = (photo) => this.approveRejectPhoto(true, photo);

  rejectPhoto = (photo) => this.approveRejectPhoto(false, photo);

  handleMapLocationChange = (newMapLocation) => {
    if (!this.props.history.location.pathname.match(this.VISIBILITY_REGEX)) {
      return;
    }

    const currentMapLocation = this.extractPathnameParams().mapLocation;

    // change url coords if the coords are different and if we are in the map
    if (
      currentMapLocation == null ||
      !currentMapLocation.isEqual(newMapLocation)
    ) {
      const currentUrl = this.props.history.location;
      const prefix = currentUrl.pathname.split("@")[0];
      const newUrl = `${prefix}@${newMapLocation.urlFormated()}`;

      this.props.history.replace(newUrl);
      this.setState({ mapLocation: newMapLocation });
    }
  };

  handleLocationClick = () => {
    gtagEvent("Location FAB clicked", "Map");
    this.setState({ mapLocation: this.state.location });
  };

  handlePhotoPageClose = () => {
    const PAGES = config.PAGES;
    const photoPath = this.props.location.pathname;
    const coords = photoPath.split("@")[1];
    const mapPath = this.props.location.pathname.startsWith(
      PAGES.embeddable.path
    )
      ? PAGES.embeddable.path
      : PAGES.map.path;
    if (this.state.photoAccessedByUrl) {
      const mapUrl = mapPath + (coords ? `@${coords}` : "");
      this.props.history.replace(mapUrl);
      this.props.history.push(photoPath);
    }

    this.props.history.goBack();
  };

  handlePhotoClick = (feature) => {
    this.setState({ selectedFeature: feature });

    let pathname = `${config.PAGES.displayPhoto.path}/${feature.properties.id}`;
    const currentPath = this.props.history.location.pathname;

    const coordsUrl =
      currentPath.split("@")[1] ||
      new MapLocation(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        config.ZOOM_FLYTO
      ).urlFormated();
    pathname =
      currentPath === config.PAGES.embeddable.path
        ? currentPath + pathname
        : pathname;

    // if it is in map, change the url
    if (this.props.history.location.pathname.match(this.VISIBILITY_REGEX)) {
      this.props.history.replace(`${currentPath.split("@")[0]}@${coordsUrl}`);
    }

    this.props.history.push(`${pathname}@${coordsUrl}`);
  };

  reloadPhotos = () => {
    // delete photos.
    this.featuresDict = {};

    // it will open the "loading photos" message
    this.setState({ geojson: null });

    // fetch all the photos from firestore instead than from the CDN
    this.fetchPhotos(false);
  };

  // from the own photos from the dict
  getOwnPhotos() {
    let ownPhotos = {};
    if (this.props.user) {
      const allPhotos = this.featuresDict;
      ownPhotos = _.filter(
        allPhotos,
        (photo) => _.get(photo, "properties.owner_id") === this.props.user.id
      ).reduce((accumulator, currentValue) => {
        accumulator[currentValue.properties.id] = currentValue;
        return accumulator;
      }, {});
    }
    return ownPhotos;
  }

  render() {
    const { classes, history } = this.props;
    const fields = Object.values(config.PHOTO_FIELDS);
    return (
      <div className="geovation-app">
        {!this.state.termsAccepted &&
          !this.props.history.location.pathname.startsWith(
            config.PAGES.embeddable.path
          ) && <TermsDialog handleClose={this.handleTermsPageClose} />}

        <EmailVerifiedDialog
          open={!!(this.props.user && !this.props.user.emailVerified)}
          handleNextClick={this.handleNextClick}
        />

        <main className="content">
          <Switch>
            {config.CUSTOM_PAGES.map(
              (CustomPage, index) =>
                !!CustomPage.page && (
                  <Route
                    key={index}
                    path={CustomPage.path}
                    render={(props) => (
                      // eslint-disable-next-line react/jsx-pascal-case
                      <CustomPage.page
                        {...props}
                        handleClose={history.goBack}
                        label={CustomPage.label}
                        geojson={this.state.geojson}
                      />
                    )}
                  />
                )
            )}

            <Route
              path={config.PAGES.about.path}
              render={(props) => (
                <AboutPage
                  {...props}
                  label={config.PAGES.about.label}
                  handleClose={history.goBack}
                  reloadPhotos={this.reloadPhotos}
                />
              )}
            />

            <Route
              path={config.PAGES.tutorial.path}
              render={(props) => (
                <SwipeTutorialPage
                  {...props}
                  steps={tutorialSteps}
                  label={config.PAGES.tutorial.label}
                  handleClose={history.goBack}
                  hasLogo={true}
                />
              )}
            />

            <Route
              path={config.PAGES.welcome.path}
              render={(props) => (
                <SwipeTutorialPage
                  {...props}
                  steps={welcomeSteps}
                  label={config.PAGES.welcome.label}
                  handleClose={history.goBack}
                />
              )}
            />

            <Route
              path={config.PAGES.leaderboard.path}
              render={(props) => (
                <LeaderboardPage
                  {...props}
                  label={config.PAGES.leaderboard.label}
                  usersLeaderboard={this.state.usersLeaderboard}
                  handleClose={history.goBack}
                />
              )}
            />

            {this.props.user && this.props.user.isModerator && (
              <Route
                path={config.PAGES.moderator.path}
                render={(props) => (
                  <ModeratorPage
                    {...props}
                    photos={this.state.photosToModerate}
                    label={config.PAGES.moderator.label}
                    handleClose={history.goBack}
                    handleRejectClick={this.handleRejectClick}
                    handleApproveClick={this.handleApproveClick}
                  />
                )}
              />
            )}

            {this.props.user && (
              <Route
                path={config.PAGES.ownPhotos.path}
                render={(props) => (
                  <OwnPhotosPage
                    {...props}
                    photos={this.getOwnPhotos()}
                    label={config.PAGES.ownPhotos.label}
                    handleClose={history.goBack}
                    handlePhotoClick={this.handlePhotoClick}
                    // handleRejectClick={this.handleRejectClick}
                    // handleApproveClick={this.handleApproveClick}
                  />
                )}
              />
            )}

            {this.props.user && this.props.user.isModerator && (
              <Route
                path={config.PAGES.feedbackReports.path}
                render={(props) => (
                  <FeedbackReportsSubrouter
                    {...props}
                    label={config.PAGES.feedbackReports.label}
                    handleClose={this.props.history.goBack}
                  />
                )}
              />
            )}

            <Route
              path={config.PAGES.photos.path}
              render={(props) => (
                <PhotoPage
                  {...props}
                  label={config.PAGES.photos.label}
                  file={this.state.file}
                  gpsLocation={this.state.location}
                  online={this.state.online}
                  srcType={this.state.srcType}
                  fields={fields}
                  handleClose={history.goBack}
                  handleRetakeClick={this.handleCameraClick}
                />
              )}
            />

            {this.props.user && (
              <Route
                path={config.PAGES.account.path}
                render={(props) => (
                  <ProfilePage
                    {...props}
                    label={config.PAGES.account.label}
                    geojson={this.state.geojson}
                    handleClose={history.goBack}
                    handlePhotoClick={this.handlePhotoClick}
                  />
                )}
              />
            )}

            <Route
              path={config.PAGES.writeFeedback.path}
              render={(props) => (
                <WriteFeedbackPage
                  {...props}
                  label={config.PAGES.writeFeedback.label}
                  location={this.state.location}
                  online={this.state.online}
                  handleClose={history.goBack}
                />
              )}
            />

            <Route
              path={[
                `${config.PAGES.displayPhoto.path}/:id`,
                `${config.PAGES.embeddable.path}${config.PAGES.displayPhoto.path}/:id`,
              ]}
              render={(props) => (
                <DisplayPhoto
                  {...props}
                  placeholderImage={placeholderImage}
                  handleRejectClick={this.handleRejectClick}
                  handleApproveClick={this.handleApproveClick}
                  handleClose={this.handlePhotoPageClose}
                  feature={this.state.selectedFeature}
                />
              )}
            />
          </Switch>

          <Map
            history={this.props.history}
            visible={this.props.history.location.pathname.match(
              this.VISIBILITY_REGEX
            )}
            geojson={this.state.geojson}
            embeddable={this.props.history.location.pathname.match(
              new RegExp(config.PAGES.embeddable.path, "g")
            )}
            handleCameraClick={this.handleCameraClick}
            toggleLeftDrawer={this.toggleLeftDrawer}
            handlePhotoClick={this.handlePhotoClick}
            mapLocation={this.state.mapLocation}
            handleMapLocationChange={(newMapLocation) =>
              this.handleMapLocationChange(newMapLocation)
            }
            handleLocationClick={this.handleLocationClick}
            gpsOffline={!this.state.location.online}
            gpsDisabled={!this.state.location.updated}
          />

          {/* {!this.state.welcomeShown &&
            config.PAGES.embeddable.path &&
            !this.props.history.location.pathname.includes(
              config.PAGES.embeddable.path
            ) && <WelcomePage handleClose={this.handleWelcomePageClose} />} */}

          {!this.state.welcomeShown &&
            config.PAGES.embeddable.path &&
            !this.props.history.location.pathname.includes(
              config.PAGES.embeddable.path
            ) && (
              <SwipeTutorialPage
                steps={welcomeSteps}
                label={config.PAGES.welcome.label}
                handleClose={this.handleWelcomePageClose}
              />
            )}
        </main>

        <Snackbar open={!this.state.geojson} message="Loading photos..." />
        <Snackbar
          open={this.state.welcomeShown && !this.state.online}
          message="Connecting to our servers..."
        />

        <RootRef rootRef={this.domRefInput}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            id={"fileInput"}
            onChange={this.openFile}
            onClick={(e) => (e.target.value = null)}
          />
        </RootRef>

        <Login
          open={this.state.loginLogoutDialogOpen && !this.props.user}
          handleClose={this.handleLoginClose}
          loginComponent={LoginFirebase}
        />

        <DrawerContainer
          online={this.state.online}
          handleClickLoginLogout={this.handleClickLoginLogout}
          leftDrawerOpen={this.state.leftDrawerOpen}
          toggleLeftDrawer={this.toggleLeftDrawer}
          stats={this.state.stats}
          sponsorImage={this.state.sponsorImage}
        />

        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle disableTypography>
            <Typography variant="h6">{this.state.dialogTitle}</Typography>
            <IconButton
              className={classes.dialogClose}
              aria-label="close"
              onClick={this.handleDialogClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.dialogContentText}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            {/* clicking ok should either open a login box or there should be a text field in the box to enter your email address */}
            <Button onClick={this.handleLoginPhotoAdd} color="secondary">
              Login
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.confirmDialogOpen}
          onClose={this.handleConfirmDialogClose}
        >
          <DialogTitle>{this.state.confirmDialogTitle}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleConfirmDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={this.state.confirmDialogHandleOk}
              color="secondary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withRouter(withStyles(styles, { withTheme: true })(App)));