import React, { Component } from "react";
import PropTypes from "prop-types";
import loadImage from "blueimp-load-image";
import dms2dec from "dms2dec";
import firebase from "firebase/app";

import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { withStyles } from "@material-ui/core/styles";

import { dbFirebase } from "features/firebase";

import config from "../../../custom/config";
import { gtagEvent } from "../../../gtag.js";
import { isIphoneWithNotchAndCordova, device } from "../../../utils";

import PageWrapper from "../../PageWrapper";
import Fields from "./Fields";
import Dialogs from "./Dialogs";
import "./style.scss";

const emptyState = {
  imgSrc: null,
  imgExif: null,
  imgIptc: null,
  imgLocation: null,
  open: false,
  message: "",
  sending: false,
  sendingProgress: 0,
  anyError: true,
  enabledUploadButton: true,
  next: false,
  fieldsValues: [],
  totalCount: null
};

const styles = theme => ({
  cssUnderline: {
    "&:after": {
      borderBottomColor: theme.palette.secondary.main
    }
  },
  progress: {
    margin: theme.spacing(2)
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    color: theme.palette.secondary.main
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova() ? "env(safe-area-inset-top)" : 0
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova()
      ? "env(safe-area-inset-bottom)"
      : 0
  },
  fields: {
    margin: theme.spacing(1.5)
  },
  photo: {
    marginRight: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5)
  }
});

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = { ...emptyState };
    this.dialogCloseCallback = null;
    this.cancelClickUpload = false;
  }

  resetState = () => {
    this.setState(emptyState);
  };

  openDialog = (message, fn) => {
    this.setState({
      sending: false,
      sendingProgress: 0,
      open: true,
      message
    });

    this.dialogCloseCallback = fn;
  };

  closeDialog = () => {
    this.dialogCloseCallback
      ? this.dialogCloseCallback()
      : this.setState({ open: false });
  };

  /**
   * Given an exif object, return the coordinates {latitude, longitude} or undefined if an error occurs
   */
  getLocationFromExifMetadata = imgExif => {
    let location, latitude, longitude;
    try {
      if (!window.cordova) {
        // https://www.npmjs.com/package/dms2dec
        const lat = imgExif.GPSLatitude.split(",").map(Number);
        const latRef = imgExif.GPSLatitudeRef;
        const lon = imgExif.GPSLongitude.split(",").map(Number);
        const lonRef = imgExif.GPSLongitudeRef;
        const latLon = dms2dec(lat, latRef, lon, lonRef);
        latitude = latLon[0];
        longitude = latLon[1];
      } else {
        if (device() === "iOS") {
          const iosGPSMetadata = this.props.cordovaMetadata.GPS;
          const latRef = iosGPSMetadata.LatitudeRef;
          const lonRef = iosGPSMetadata.LongitudeRef;
          latitude = iosGPSMetadata.Latitude;
          longitude = iosGPSMetadata.Longitude;
          latitude = latRef === "N" ? latitude : -latitude;
          longitude = lonRef === "E" ? longitude : -longitude;
        } else if (device() === "Android") {
          const androidMetadata = this.props.cordovaMetadata;
          const lat = androidMetadata.gpsLatitude;
          const latRef = androidMetadata.gpsLatitudeRef;
          const lon = androidMetadata.gpsLongitude;
          const lonRef = androidMetadata.gpsLongitudeRef;
          const latLon = dms2dec(lat, latRef, lon, lonRef);
          latitude = latLon[0];
          longitude = latLon[1];
        }
      }
      location = { latitude, longitude };
    } catch (e) {
      console.debug(`Error extracting GPS from file; ${e}`);
    }

    return location;
  };

  sendFile = async () => {
    let location = this.state.imgLocation;

    gtagEvent("Upload", "Photo");

    if (!this.state.imgSrc) {
      this.openDialog("No picture is selected. Please choose a picture.");
      return;
    }

    if (!this.props.online) {
      this.openDialog(
        "Can't Connect to our servers. You won't be able to upload an image."
      );
      return;
    }

    const { fieldsValues, totalCount } = this.state;

    const fieldValuesToSend = fieldsValues.map(value => {
      const {
        values: { error, number, ...otherNonExtraneousFields }
      } = value;
      const numberAsNumber = Number(number);

      return { number: numberAsNumber, ...otherNonExtraneousFields };
    });

    const data = {
      ...location,
      pieces: totalCount,
      categories: fieldValuesToSend
    };

    this.setState({
      sending: true,
      sendingProgress: 0,
      enabledUploadButton: false
    });
    this.uploadTask = null;
    this.cancelClickUpload = false;

    let photoRef;
    try {
      photoRef = await dbFirebase.saveMetadata(data);
    } catch (error) {
      console.error(error);

      // debugger
      const extraInfo =
        error.code === "storage/canceled" ? "" : `Try again (${error.message})`;
      this.openDialog(`Photo upload was canceled. ${extraInfo}`);
    }

    this.setState({ sendingProgress: 1, enabledUploadButton: true });

    if (!this.cancelClickUpload) {
      const base64 = this.state.imgSrc.split(",")[1];
      this.uploadTask = dbFirebase.savePhoto(photoRef.id, base64);

      this.uploadTask.on(
        "state_changed",
        snapshot => {
          const sendingProgress = Math.ceil(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 98 + 1
          );
          this.setState({ sendingProgress });

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
            default:
              console.log(snapshot.state);
          }
        },
        error => {
          // debugger
          console.error(error);
          const extraInfo =
            error.code === "storage/canceled"
              ? ""
              : `Try again (${error.message})`;
          this.openDialog(`Photo upload was canceled. ${extraInfo}`);
        },
        () => {
          this.openDialog(
            "Photo was uploaded successfully. It will be reviewed by our moderation team.",
            this.handleClosePhotoPage
          );
        }
      );
    }
  };

  loadImage = () => {
    let imgExif = null;
    let imgIptc = null;
    let imgLocation = null;

    // https://github.com/blueimp/JavaScript-Load-Image#meta-data-parsing
    if (!window.cordova) {
      loadImage.parseMetaData(
        this.props.file,
        data => {
          imgExif = data.exif ? data.exif.getAll() : imgExif;
          imgIptc = data.iptc ? data.iptc.getAll() : imgIptc;
        },
        {
          maxMetaDataSize: 262144,
          disableImageHead: false
        }
      );
    }

    loadImage(
      this.props.file,
      img => {
        let imgFromCamera;
        const imgSrc = img.toDataURL("image/jpeg");
        if (window.cordova) {
          if (this.props.srcType === "camera") {
            imgFromCamera = true;
          } else {
            imgFromCamera = false;
          }
        } else {
          const fileDate = this.props.file.lastModified;
          const ageInMinutes = (new Date().getTime() - fileDate) / 1000 / 60;
          imgFromCamera = isNaN(ageInMinutes) || ageInMinutes < 0.5;
        }

        if (imgFromCamera) {
          imgLocation = this.props.gpsLocation;
          if (!this.props.gpsLocation.online) {
            this.openDialog(
              "We couldn't find your location so you won't be able to upload an image right now. Enable GPS on your phone and retake the photo to upload it."
            );
            return;
          }
        } else {
          imgLocation = this.getLocationFromExifMetadata(imgExif);
        }

        this.setState({ imgSrc, imgExif, imgIptc, imgLocation });

        if (!imgLocation) {
          this.openDialog(
            <span style={{ fontWeight: 500 }}>
              Your photo isn't geo-tagged so it can't be uploaded. To fix this
              manually, you can geo-tag it online with a tool like&nbsp;
              <Link
                href={"https://tool.geoimgr.com/"}
                className={this.props.classes.link}
              >
                Geoimgr
              </Link>
              . In future, make sure GPS is enabled and your camera has access
              to it.
            </span>
          );

          this.setState({ next: false, anyError: true });
        }
      },
      {
        orientation: true,
        maxWidth: config.MAX_IMAGE_SIZE,
        maxHeight: config.MAX_IMAGE_SIZE
      }
    );
  };

  retakePhoto = () => {
    gtagEvent("Retake Photo", "Photo");
    this.resetState();
    this.props.handleRetakeClick();
  };

  handleClosePhotoPage = () => {
    this.resetState();
    this.props.handleClose(); // go to the map
  };

  handleCancel = () => {
    this.setState({
      sending: false,
      sendingProgress: 0,
      enabledUploadButton: true
    });

    if (this.uploadTask) {
      this.uploadTask.cancel();
    } else {
      this.cancelClickUpload = true;

      // debugger
      this.openDialog("Photo upload was canceled");
    }
  };

  handleNext = () => {
    this.setState({ next: true });
  };

  handlePrev = () => {
    this.setState({ next: false });
  };

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  handleChangeFields = (anyError, fieldsValues) => {
    this.setState({ anyError, fieldsValues });
  };

  handleTotalCountChange = (anyError, totalCount) => {
    this.setState({ anyError, totalCount });
  };

  render() {
    const { classes, label, fields } = this.props;
    return (
      <div className="geovation-photos">
        <PageWrapper
          handlePrev={this.handlePrev}
          handleNext={this.handleNext}
          enableNext={!!this.state.imgLocation}
          nextClicked={this.state.next}
          error={this.state.anyError || !this.state.enabledUploadButton}
          sendFile={this.sendFile}
          photoPage={true}
          label={label}
          handleClose={this.props.handleClose}
        >
          {this.state.next ? (
            <div className={classes.fields}>
              <Fields
                handleChange={this.handleChangeFields}
                handleTotalCountChange={this.handleTotalCountChange}
                imgSrc={this.state.imgSrc}
                fields={fields}
                error={this.state.anyError}
              />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
              className={classes.photo}
            >
              <div className="picture">
                <img src={this.state.imgSrc} alt={""} />
              </div>

              <div className={classes.button}>
                <Button
                  variant="outlined"
                  fullWidth={true}
                  onClick={this.retakePhoto}
                  color={"secondary"}
                >
                  Retake
                </Button>
              </div>
            </div>
          )}

          <Dialogs
            alertOpen={this.state.open}
            alertMessage={this.state.message}
            closeAlert={this.closeDialog}
            sending={this.state.sending}
            sendingProgress={this.state.sendingProgress}
            handleCancelSend={this.handleCancel}
          />
        </PageWrapper>
      </div>
    );
  }
}

PhotoPage.propTypes = {
  gpsLocation: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  file: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleRetakeClick: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(PhotoPage);
