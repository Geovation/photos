import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadImage from 'blueimp-load-image';
import dms2dec from 'dms2dec';
import firebase from 'firebase/app';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
import { gtagEvent } from '../gtag.js';
import './PhotoPage.scss';
import dbFirebase from '../dbFirebase';
import { isIphoneWithNotchAndCordova, device } from '../utils';

import PageWrapper from './PageWrapper';
import LinearProgress from '@material-ui/core/LinearProgress';

const emptyState = {
  imgSrc: null,
  imgExif: null,
  imgIptc: null,
  imgFromCamera: null,
  open: false,
  message: '',
  field: '',
  sending: false,
  sendingProgress: 0,
  error: !''.match(config.PHOTO_FIELD.regexValidation),
  enabledUploadButton :true
};

const styles = theme => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  button: {
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    margin: theme.spacing.unit * 1.5,
  },
  dialogContentProgress: {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center'
  },
  linearProgress : {
    width:'100%',
    height:'100%'
  },
  notchTop: {
    paddingTop: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-top)' : 0
  },
  notchBottom: {
    paddingBottom: isIphoneWithNotchAndCordova() ? 'env(safe-area-inset-bottom)' : 0
  }
});

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {...emptyState};
    this.dialogCloseCallback = null;
    this.cancelClickUpload = false;
  }

  resetState = () => {
    this.setState(emptyState);
  }

  handleChange = (event) => {
    this.setState({
      error: !event.target.value.match(config.PHOTO_FIELD.regexValidation),
      field: event.target.value
    });
  }

  openDialog = (message, fn) => {
    this.setState({
      sending: false,
      sendingProgress: 0,
      open: true,
      message
    });

    this.dialogCloseCallback = fn;
  }

  closeDialog = () => {
    this.dialogCloseCallback ? this.dialogCloseCallback() : this.setState({ open: false });
  }

  /**
   * Given an exif object, return the coordinates {latitude, longitude} or undefined if an error occurs
   */
  getLocationFromExifMetadata = exif => {

    let location, latitude, longitude;
    try {
      if (!window.cordova) {
        // https://www.npmjs.com/package/dms2dec
        const imgExif = this.state.imgExif;
        const lat = imgExif.GPSLatitude.split(",").map(Number);
        const latRef = imgExif.GPSLatitudeRef;
        const lon = imgExif.GPSLongitude.split(",").map(Number);
        const lonRef = imgExif.GPSLongitudeRef;
        const latLon = dms2dec(lat, latRef, lon, lonRef);
        latitude = latLon[0];
        longitude = latLon[1];
      }
      else {
        if (device() === 'iOS') {
          const iosGPSMetadata = this.props.cordovaMetadata.GPS;
          const latRef = iosGPSMetadata.LatitudeRef;
          const lonRef = iosGPSMetadata.LongitudeRef;
          latitude = iosGPSMetadata.Latitude;
          longitude = iosGPSMetadata.Longitude;
          latitude = latRef === 'N' ? latitude : -latitude;
          longitude = lonRef === 'E' ? longitude : -longitude;
        }
        else if (device() === 'Android') {
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
  }

  sendFile = async () => {
    let location;

    gtagEvent('Upload', 'Photo');

    if (!this.state.imgSrc) {
      this.openDialog("No picture is selected. Please choose a picture.");
      return;
    }

    if (this.state.field === '') {
      this.openDialog("Please enter some text");
      return;
    }

    if (!this.props.online) {
      this.openDialog("Can't Connect to our servers. You won't be able to upload an image.");
      return;
    }

    if (this.state.imgFromCamera) {
      location = this.props.gpsLocation;
      if (!this.props.gpsLocation.online) {
        this.openDialog("Could not get the location yet. You won't be able to upload an image.");
        return;
      }
    } else {
      location = this.getLocationFromExifMetadata(this.state.imgExif);
      if (!location) {
        this.openDialog("Your picture is not geo tagged. Cannot be uploaded");
        return;
      }
    }

    const data = {
      ...location,
      base64: this.state.imgSrc.split(",")[1]
    };

    data.field = this.state.field;
    this.setState({ sending: true, sendingProgress: 0, enabledUploadButton :false });
    this.uploadTask = null;
    this.cancelClickUpload = false;
    const photoRef = await dbFirebase.saveMetadata(data);
    this.setState({ sendingProgress : 1 ,enabledUploadButton: true});

    if(!this.cancelClickUpload){

      this.uploadTask = dbFirebase.savePhoto(photoRef.id, data.base64);

      this.uploadTask.on('state_changed', snapshot => {
        const sendingProgress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 98 + 1);
        this.setState({ sendingProgress });

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          default:
            console.log(snapshot.state);
        }

        }, error => {
          this.openDialog('Photo upload was canceled');
        }, () => {
          this.openDialog("Photo was uploaded successfully. It will be reviewed by our moderation team.", this.handleClosePhotoPage);
        }
      );
    }
  }

  loadImage = () => {
    let imgExif = null;
    let imgIptc = null;

    // https://github.com/blueimp/JavaScript-Load-Image#meta-data-parsing
    if (!window.cordova) {
      loadImage.parseMetaData(
        this.props.file, data => {
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
      this.props.file, (img) =>{
        let imgFromCamera;
        const imgSrc = img.toDataURL("image/jpeg");
        if (window.cordova) {
          if (this.props.srcType === 'camera') {
            imgFromCamera = true;
          } else {
            imgFromCamera = false;
          }
        } else {
          const fileDate = this.props.file.lastModified;
          const ageInMinutes = (new Date().getTime() - fileDate)/1000/60;
          imgFromCamera = isNaN(ageInMinutes) || ageInMinutes < 0.5;
        }
        this.setState({ imgSrc, imgExif, imgIptc, imgFromCamera });
      },
      {
        orientation: true,
        maxWidth: config.MAX_IMAGE_SIZE,
        maxHeight: config.MAX_IMAGE_SIZE
      }
    );
  }

  retakePhoto = () => {
    gtagEvent('Retake Photo', 'Photo');
    this.resetState();
    this.props.handlePhotoClick();
  }

  handleClosePhotoPage = () => {
    this.resetState();
    this.props.handleClose(); // go to the map
  };

  handleCloseButton = () => {
    gtagEvent('Postpone upload', 'Photo');
    this.handleClosePhotoPage();
  };

  handleCancel = () => {
    this.setState({ sending:false });

    if (this.uploadTask) {
      this.uploadTask.cancel();
    }
    else {
      this.cancelClickUpload = true;
      this.openDialog('Photo upload was canceled');
    }
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  render() {
    const { classes, label } = this.props;
    return (
      <div className='geovation-photos'>
        <PageWrapper label={label} handleClose={this.props.handleClose}>
          <div className='text-field-wrapper'>
            <Typography className='typography1'>
              {config.PHOTO_FIELD.title}
            </Typography>

            <TextField
              id="standard-name"
              type={config.PHOTO_FIELD.type}
              required={true}
              placeholder={config.PHOTO_FIELD.placeholder}
              className='text-field'
              value={this.state.field}
              onChange={this.handleChange}
              error= {this.state.error}
              InputProps={Object.assign({
                className: classes.cssUnderline
              }, config.PHOTO_FIELD.inputProps)}
            />

          </div>

          <div className='picture'>
           <img src={this.state.imgSrc} alt={""}/>
          </div>

          <div className={classes.button}>
            <Button variant="outlined" fullWidth={true} onClick={this.retakePhoto}>
              Retake
            </Button>
          </div>

          <div className={classes.button}>
            <Button disabled={this.state.error || !this.state.enabledUploadButton}
              variant="contained" color="secondary" fullWidth={true} onClick={this.sendFile}>
              Upload
            </Button>
          </div>

          <Dialog
            open={this.state.open}
            onClose={this.closeDialog}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {this.state.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color='secondary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.state.sending}>
            <DialogContent className={classes.dialogContentProgress}>
              <DialogContentText id="loading-dialog-text">
                {this.state.sendingProgress} % done. Be patient ;)
              </DialogContentText>
              <div className={classes.linearProgress}>
                <br/>
                <LinearProgress variant="determinate" color='secondary' value={this.state.sendingProgress} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color='secondary'>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
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
  handlePhotoClick: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(PhotoPage);
