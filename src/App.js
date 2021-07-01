import React, { useState, useContext, useEffect, useRef } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

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
import MuiAlert from "@material-ui/lab/Alert";
import CachedIcon from "@material-ui/icons/Cached";

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
import { GeolocationContext } from "store/GeolocationContext";

const placeholderImage = process.env.PUBLIC_URL + "/custom/images/logo.svg";

const styles = (theme) => ({
  dialogClose: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
});

const App = (props) => {
  const { classes, dispatch, history, location, geojson, online, user } = props;
  const fields = Object.values(config.PHOTO_FIELDS);

  const [file, setFile] = useState(null);
  const [loginLogoutDialogOpen, setLoginLogoutDialogOpen] = useState(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(
    !!localStorage.getItem("welcomeShown")
  );
  const [termsAccepted, setTermsAccepted] = useState(
    !!localStorage.getItem("termsAccepted")
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [usersLeaderboard, setUsersLeaderboard] = useState([]);
  const [confirmDialogHandleOk, setConfirmDialogHandleOk] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(undefined); // undefined = not selectd, null = feature not found
  const [photoAccessedByUrl, setPhotoAccessedByUrl] = useState(false);
  const [photosToModerate, setPhotosToModerate] = useState({});
  const [mapLocation, setMapLocation] = useState(new MapLocation());
  const [dbStats, setDbStats] = useState();
  const [stats, setStats] = useState();
  const [firebaseConfig, setFirebaseConfig] = useState();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContentText, setDialogContentText] = useState("");
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const [ignoreUpdate, setIgnoreUpdate] = useState(false);

  const geolocationContext = useContext(GeolocationContext);

  let unregisterAuthObserver = useRef();
  let unregisterConfigObserver = useRef();
  let unregisterConnectionObserver = useRef();
  let unregisterPublishedPhotosRT = useRef();
  let unregisterPhotosToModerate = useRef();
  let unregisterOwnPhotos = useRef();
  let domRefInput = useRef();
  let userChecked = useRef(false);

  const VISIBILITY_REGEX = new RegExp(
    "(^/@|^/$|^" +
      config.PAGES.displayPhoto.path +
      "/|^" +
      config.PAGES.embeddable.path +
      ")",
    "g"
  );

  const openPhotoPage = (file) => {
    setFile(file);

    history.push(config.PAGES.photos.path);
  };

  const handleDialogClose = () => setDialogOpen(false);

  const fetchPhotoIfUndefined = async (photoId) => {
    // it means that we landed on the app with a photoId in the url
    if (photoId && !selectedFeature) {
      return dbFirebase
        .getPhotoByID(photoId)
        .then((selectedFeature) => setSelectedFeature(selectedFeature))
        .catch((e) => setSelectedFeature(null));
    }
  };

  const extractPathnameParams = () => {
    // extracts photoID
    const regexPhotoIDMatch = location.pathname.match(
      new RegExp(`${config.PAGES.displayPhoto.path}\\/(\\w+)`)
    );

    const photoId = regexPhotoIDMatch && regexPhotoIDMatch[1];

    // extracts mapLocation
    const regexMapLocationMatch = location.pathname.match(
      new RegExp("@(-?\\d*\\.?\\d*),(-?\\d*\\.?\\d*),(\\d*\\.?\\d*)z")
    );

    const mapLocation =
      (regexMapLocationMatch &&
        new MapLocation({
          latitude: regexMapLocationMatch[1],
          longitude: regexMapLocationMatch[2],
          zoom: regexMapLocationMatch[3],
        })) ||
      new MapLocation();
    if (!regexMapLocationMatch) {
      mapLocation.zoom = config.ZOOM;
    }

    return { photoId, mapLocation };
  };

  const unexpectedErrorFn = (error) => {
    console.error(error);
    alert(`Let our dev about this error: ${error}`);
    window.location.reload();
  }

  const prevLocationRef = useRef();
  useEffect(() => {
    // didMount
    // TODO: test it. Does it slow down starting up ?
    props.newVersionAvailable.then(() => setNewVersionAvailable(true));
    prevLocationRef.current = location;

    setStats(config.getStats(geojson, dbStats))

    let { photoId, mapLocation } = extractPathnameParams();
    setMapLocation(mapLocation);
    unregisterConnectionObserver.current = dbFirebase.onConnectionStateChanged(
      (online) => dispatch({ type: "SET_ONLINE", payload: { online } })
    );

    dbFirebase.fetchStats().then((dbStats) => {
      console.log(dbStats);
      setUsersLeaderboard(dbStats.users);
      setDbStats(dbStats);

      return dbStats;
    });

    // when photoId is defined (when acceding the app with photoid query string), need to get the photo info.
    fetchPhotoIfUndefined(photoId).then( () => {
      // If the selectedFeature is not null, it means that we were able to retrieve a photo from the URL and so we landed
      // into the photoId.
      setPhotoAccessedByUrl(!!selectedFeature);

      gtagPageView(location.pathname);
    });

    // Get the photos from the cache first.
    (async () => {
      const featuresDict = (await localforage.getItem("featuresDict")) || {};
      if (!_.isEmpty(featuresDict)) {
        dispatch({ type: "SET_FEATURES", payload: { featuresDict } });
      } else {
        fetchPhotos();
      }
    })();

    registerPublishedPhotosRT();

    if (!welcomeShown) {
      history.push(config.PAGES.welcome.path);
    }
    
    unregisterAuthObserver.current = authFirebase.onAuthStateChanged(
      (firebaseUser) => dispatch({ type: "SET_USER", payload: { user: firebaseUser } })
    );

    unregisterConfigObserver.current = dbFirebase.configObserver(
      (config) => setFirebaseConfig(config),
      console.error
    );
    // willUnmount
    return async () => {
      unregisterAuthObserver.current();
      unregisterConnectionObserver.current();
      unregisterConfigObserver.current();
      unregisterPhotosToModerate.current &&
      unregisterPhotosToModerate.current();
      unregisterOwnPhotos.current && unregisterOwnPhotos.current();
      unregisterPublishedPhotosRT.current &&
      unregisterPublishedPhotosRT.current();
      await dbFirebase.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(user);
    // lets start fresh if the user logged out
    if (userChecked.current && !user) {
      gtagEvent("Signed out", "User");

      history.push(config.PAGES.map.path);
      window.location.reload();
    } else {
      userChecked.current = true;
    }
  }, [user, history ]);

  useEffect(() => {
    setStats(config.getStats(geojson, dbStats));
  }, [dbStats, geojson]);


  useEffect(() => {
    // didUpdate
    if (prevLocationRef.current !== location) {
      prevLocationRef.current = location;
      gtagPageView(location.pathname);

      // if it updates, then it is guaranteed that we didn't landed into the photo
      setPhotoAccessedByUrl(false);
      fetchPhotoIfUndefined(_.get(selectedFeature, "properties.id"));
    }

    // listen to new photos to be moderated
    if (_.get(user, "isModerator") && !unregisterPhotosToModerate.current) {
      unregisterPhotosToModerate.current = dbFirebase.photosToModerateRT(
        config.MODERATING_PHOTOS,
        (photo) => updatePhotoToModerate(photo),
        (photo) => removePhotoToModerate(photo)
      );
    }

    // if there is a user
    if (user && !unregisterOwnPhotos.current) {
      unregisterOwnPhotos.current = dbFirebase.ownPhotosRT(
        addFeature,
        modifyFeature,
        removeFeature,
        unexpectedErrorFn
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson, location, user]);

  const modifyFeature = (photo) => {
    console.debug(`modifying ${photo.id}`);
    dispatch({ type: "UPDATE_FEATURE", payload: { photo } });
  };

  const addFeature = (photo) => {
    console.debug(`adding ${photo.id} --v`);
    modifyFeature(photo);
  };

  const removeFeature = (photo) => {
    console.debug(`removing ${photo.id}`);
    dispatch({ type: "DELETE_FEATURE", payload: { photo } });
  };

  const registerPublishedPhotosRT = async () => {
    if (unregisterPublishedPhotosRT.current) {
      await unregisterPublishedPhotosRT.current();
    }

    // The following line should speedup things. It reads all the photos until before trigger the RT listener
    await fetchPhotos(false, calculateLastUpdate());

    unregisterPublishedPhotosRT.current = dbFirebase.publishedPhotosRT(
      addFeature,
      modifyFeature,
      removeFeature,
      unexpectedErrorFn,
      calculateLastUpdate()
    );
  };

  const calculateLastUpdate = () => {
    let lastUpdated = new Date(null);
    if (geojson) {
      const latestPhoto = _.maxBy(geojson.features, (photo) => {
        return photo.properties.updated;
      });
      lastUpdated = _.get(latestPhoto, "properties.updated");
    }
    return lastUpdated;
  };

  const fetchPhotos = async (fromAPI = true, lastUpdate = new Date(null)) => {
    return dbFirebase
      .fetchPhotos(fromAPI, lastUpdate)
      .then((photos) => _.forEach(photos, (photo) => addFeature(photo)))
      .catch(console.error);
  };

  const removePhotoToModerate = (photo) => {
    console.debug(
      `removing the element ${photo.id} from the collection photosToModerate in the view`
    );
    setPhotosToModerate(_.filter(photosToModerate, (p) => p.id !== photo.id));
  };

  const updatePhotoToModerate = (photo) => {
    console.debug(
      `updating the element ${photo.id} from the collection photosToModerate in the view`
    );

    const newDict = { ...photosToModerate };
    newDict[photo.id] = photo;

    setPhotosToModerate(newDict);
  };

  const handleClickLoginLogout = () => {
    let loginLogoutDialogOpen = true;

    if (user) {
      authFirebase.signOut();
      loginLogoutDialogOpen = false;
    }

    setLoginLogoutDialogOpen(loginLogoutDialogOpen);
  };

  const handleLoginClose = () => setLoginLogoutDialogOpen(false);

  const handleCameraClick = () => {
    if (config.SECURITY.UPLOAD_REQUIRES_LOGIN && !user) {
      setDialogOpen(true);
      setDialogTitle("Please login to add a photo");
      setDialogContentText(
        "Before adding photos, you must be logged into your account."
      );
    } else {
      console.log("Clicking on photo");
      domRefInput.current.click();
    }
  };

  const openFile = (e) => {
    if (e.target.files[0]) {
      openPhotoPage(e.target.files[0]);
    }
  };

  const handleWelcomePageClose = () => {
    setWelcomeShown(true);
    localStorage.setItem("welcomeShown", true);
    history.goBack();
  };

  const handleTermsPageClose = (e) => {
    localStorage.setItem("termsAccepted", true);
    setTermsAccepted(true);
  };

  const toggleLeftDrawer = (isItOpen) => () => {
    gtagEvent(isItOpen ? "Opened" : "Closed", "Menu");
    setLeftDrawerOpen(isItOpen);
  };

  const handleLoginPhotoAdd = () => {
    setLoginLogoutDialogOpen(true);
    setDialogOpen(false);
  };

  const handleNextClick = async () => {
    const user = await authFirebase.reloadUser();
    if (user.emailVerified) {
      dispatch({
        type: "SET_USER",
        payload: {
          user: { ...user, emailVerified: user.emailVerified },
        },
      });

      let message = {
        title: "Confirmation",
        body: "Thank you for verifying your email.",
      };
      return message;
    } else {
      let message = {
        title: "Warning",
        body: "Email not verified yet. Please click the link in the email we sent you.",
      };
      return message;
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleRejectClick = (photo) => {
    setConfirmDialogOpen(true);
    setConfirmDialogTitle("Are you sure you want to unpublish the photo ?");
    setConfirmDialogHandleOk(() => rejectPhoto(photo));
  };

  const handleApproveClick = (photo) => {
    setConfirmDialogOpen(true);
    setConfirmDialogTitle("Are you sure you want to publish the photo ?");
    setConfirmDialogHandleOk(() => approvePhoto(photo));
  };

  const approveRejectPhoto = async (isApproved, photo) => {
    // close dialogs
    handleConfirmDialogClose();

    // publish/unpublish photo in firestore
    try {
      if (isApproved) {
        await dbFirebase.approvePhoto(photo.id, user ? user.id : null);
      } else {
        await dbFirebase.rejectPhoto(photo.id, user ? user.id : null);
      }

      const _selectedFeature = selectedFeature;

      photo.published = isApproved;

      if (_.get(selectedFeature, "properties.id") === photo.id) {
        _selectedFeature.properties.published = isApproved;
        setSelectedFeature(_selectedFeature);
      }
    } catch (e) {
      console.error(e);
      setConfirmDialogOpen(true);
      setConfirmDialogTitle(
        `The photo state has not changed. Please try again, id:${photo.id}`
      );
      setConfirmDialogHandleOk(handleConfirmDialogClose);
    }
  };

  const approvePhoto = (photo) => approveRejectPhoto(true, photo);

  const rejectPhoto = (photo) => approveRejectPhoto(false, photo);

  const handleMapLocationChange = (newMapLocation) => {
    if (!history.location.pathname.match(VISIBILITY_REGEX)) {
      return;
    }

    const currentMapLocation = extractPathnameParams().mapLocation;

    // change url coords if the coords are different and if we are in the map
    if (
      currentMapLocation == null ||
      !currentMapLocation.isEqual(newMapLocation)
    ) {
      const currentUrl = history.location;
      const prefix = currentUrl.pathname.split("@")[0];
      const newUrl = `${prefix}@${newMapLocation.urlFormated()}`;

      history.replace(newUrl);
      setMapLocation(newMapLocation);
    }
  };

  const handleLocationClick = () => {
    gtagEvent("Location FAB clicked", "Map");
    setMapLocation(geolocationContext.geolocation);
  };

  const handlePhotoPageClose = () => {
    const PAGES = config.PAGES;
    const photoPath = location.pathname;
    const coords = photoPath.split("@")[1];
    const mapPath = location.pathname.startsWith(PAGES.embeddable.path)
      ? PAGES.embeddable.path
      : PAGES.map.path;
    if (photoAccessedByUrl) {
      const mapUrl = mapPath + (coords ? `@${coords}` : "");
      history.replace(mapUrl);
      history.push(photoPath);
    }

    history.goBack();
  };

  const handlePhotoClick = (feature) => {
    setSelectedFeature(feature);

    let pathname = `${config.PAGES.displayPhoto.path}/${feature.properties.id}`;
    const currentPath = history.location.pathname;

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
    if (history.location.pathname.match(VISIBILITY_REGEX)) {
      history.replace(`${currentPath.split("@")[0]}@${coordsUrl}`);
    }

    history.push(`${pathname}@${coordsUrl}`);
  };

  const reloadPhotos = () => {
    // delete photos.
    dispatch({ type: "SET_FEATURES", payload: { featuresDict: {} } });

    // fetch all the photos from firestore instead than from the CDN
    fetchPhotos(false);
  };

  // from the own photos from the dict
  const getOwnPhotos = () => {
    let ownPhotos = {};
    if (user) {
      const allPhotos = _.get(props, "geojson.features");
      ownPhotos = _.filter(
        allPhotos,
        (photo) => _.get(photo, "properties.owner_id") === user.id
      ).reduce((accumulator, currentValue) => {
        accumulator[currentValue.properties.id] = currentValue;
        return accumulator;
      }, {});
    }
    return ownPhotos;
  };

  console.log(firebaseConfig);
  return (
    <div className="geovation-app">
      {!termsAccepted &&
        !history.location.pathname.startsWith(config.PAGES.embeddable.path) && (
          <TermsDialog handleClose={handleTermsPageClose} />
        )}

      <EmailVerifiedDialog
        open={!!(user && !user.emailVerified)}
        handleNextClick={handleNextClick}
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
                    <CustomPage.page {...props} handleClose={history.goBack} />
                  )}
                />
              )
          )}

          <Route
            path={config.PAGES.about.path}
            render={(props) => (
              <AboutPage
                {...props}
                handleClose={history.goBack}
                reloadPhotos={reloadPhotos}
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
                handleClose={handleWelcomePageClose}
              />
            )}
          />

          <Route
            path={config.PAGES.leaderboard.path}
            render={(props) => (
              <LeaderboardPage
                {...props}
                usersLeaderboard={usersLeaderboard}
                handleClose={history.goBack}
              />
            )}
          />

          {user && user.isModerator && (
            <Route
              path={config.PAGES.moderator.path}
              render={(props) => (
                <ModeratorPage
                  {...props}
                  photos={photosToModerate}
                  handleClose={history.goBack}
                  handleRejectClick={handleRejectClick}
                  handleApproveClick={handleApproveClick}
                />
              )}
            />
          )}

          {user && (
            <Route
              path={config.PAGES.ownPhotos.path}
              render={(props) => (
                <OwnPhotosPage
                  {...props}
                  photos={getOwnPhotos()}
                  handleClose={history.goBack}
                  handlePhotoClick={handlePhotoClick}
                  // handleRejectClick={handleRejectClick}
                  // handleApproveClick={handleApproveClick}
                />
              )}
            />
          )}

          {user && user.isModerator && (
            <Route
              path={config.PAGES.feedbackReports.path}
              render={(props) => (
                <FeedbackReportsSubrouter
                  {...props}
                  handleClose={history.goBack}
                />
              )}
            />
          )}

          <Route
            path={config.PAGES.photos.path}
            render={(props) => (
              <PhotoPage
                {...props}
                file={file}
                fields={fields}
                handleClose={history.goBack}
                handleRetakeClick={handleCameraClick}
              />
            )}
          />

          {user && (
            <Route
              path={config.PAGES.account.path}
              render={(props) => (
                <ProfilePage
                  {...props}
                  handleClose={history.goBack}
                  handlePhotoClick={handlePhotoClick}
                />
              )}
            />
          )}

          <Route
            path={config.PAGES.writeFeedback.path}
            render={(props) => (
              <WriteFeedbackPage {...props} handleClose={history.goBack} />
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
                handleRejectClick={handleRejectClick}
                handleApproveClick={handleApproveClick}
                handleClose={handlePhotoPageClose}
                feature={selectedFeature}
              />
            )}
          />
        </Switch>

        <Map
          history={history}
          visible={history.location.pathname.match(VISIBILITY_REGEX)}
          embeddable={history.location.pathname.match(
            new RegExp(config.PAGES.embeddable.path, "g")
          )}
          handleCameraClick={handleCameraClick}
          toggleLeftDrawer={toggleLeftDrawer}
          handlePhotoClick={handlePhotoClick}
          mapLocation={mapLocation}
          handleMapLocationChange={(newMapLocation) =>
            handleMapLocationChange(newMapLocation)
          }
          handleLocationClick={handleLocationClick}
        />
      </main>

      <Snackbar
        open={newVersionAvailable && !ignoreUpdate}
        key="topcenter"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          action={
            <>
              <IconButton
                color="primary"
                size="small"
                onClick={() => window.location.reload()}
              >
                <CachedIcon />
              </IconButton>
              <IconButton
                color="primary"
                size="small"
                onClick={() => setIgnoreUpdate(true)}
              >
                <CloseIcon />
              </IconButton>
            </>
          }
        >
          New verison available !
        </MuiAlert>
      </Snackbar>

      <Snackbar open={!geojson} message="Loading photos..." />
      <Snackbar
        open={welcomeShown && !online}
        message="Connecting to our servers..."
      />

      <RootRef rootRef={domRefInput}>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          id={"fileInput"}
          onChange={openFile}
          onClick={(e) => (e.target.value = null)}
        />
      </RootRef>

      <Login
        open={loginLogoutDialogOpen && !user}
        handleClose={handleLoginClose}
        loginComponent={LoginFirebase}
      />

      <DrawerContainer
        handleClickLoginLogout={handleClickLoginLogout}
        leftDrawerOpen={leftDrawerOpen}
        toggleLeftDrawer={toggleLeftDrawer}
        stats={stats}
      />

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle disableTypography>
          <Typography variant="h6">{dialogTitle}</Typography>
          <IconButton
            className={classes.dialogClose}
            aria-label="close"
            onClick={handleDialogClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContentText}</DialogContentText>
        </DialogContent>

        <DialogActions>
          {/* clicking ok should either open a login box or there should be a text field in the box to enter your email address */}
          <Button onClick={handleLoginPhotoAdd} color="secondary">
            Login
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDialogHandleOk} color="secondary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  online: state.online,
  geojson: state.geojson,
});

export default connect(mapStateToProps)(
  withRouter(withStyles(styles, { withTheme: true })(App))
);
