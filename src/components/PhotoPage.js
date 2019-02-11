import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadImage from 'blueimp-load-image';
import dms2dec from 'dms2dec';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
import { gtagEvent } from '../gtag.js';
import './PhotoPage.scss';
import dbFirebase from '../dbFirebase';
import { isIphoneWithNotchAndCordova } from '../utils'

import PageWrapper from './PageWrapper';

const emptyState = {
  imgSrc: null,
  imgExif: null,
  imgIptc: null,
  imgFromCamera: null,
  open: false,
  message: '',
  field: '',
  sending: false,
  error: !''.match(config.PHOTO_FIELD.regexValidation)
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

    let location = undefined;

    try {
      // https://www.npmjs.com/package/dms2dec
      const lat = this.state.imgExif.GPSLatitude.split(",").map(Number);
      const latRef = this.state.imgExif.GPSLatitudeRef;
      const lon = this.state.imgExif.GPSLongitude.split(",").map(Number);
      const lonRef = this.state.imgExif.GPSLongitudeRef;

      const latLon = dms2dec(lat, latRef, lon, lonRef);
      location = {
        latitude: latLon[0],
        longitude: latLon[1]
      };

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
    this.setState({ sending: true });

    try {
      const res = await dbFirebase.uploadPhoto(data);
      console.log(res);
      this.openDialog("Photo was uploaded successfully. It will be reviewed by our moderation team.", this.handleClosePhotoPage);
    } catch (e) {
      this.openDialog(e.message || e);
    }

  }

  loadImage = () => {
    let imgExif = null;
    let imgIptc = null;

    // https://github.com/blueimp/JavaScript-Load-Image#meta-data-parsing
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

    loadImage(
      this.props.file, (img) =>{
        const imgSrc = img.toDataURL("image/jpeg");
        const ageInMinutes = (new Date().getTime() - this.props.file.lastModified)/1000/60;
        const imgFromCamera = ageInMinutes < 5;
        this.setState({imgSrc, imgExif, imgIptc, imgFromCamera});
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
            <Button disabled={this.state.error}
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
            <DialogContent>
              <DialogContentText id="loading-dialog-text">
                Be patient ;)
              </DialogContentText>
              <CircularProgress
              className={classes.progress}
               color='secondary'
               size={50}
               thickness={6}/>
            </DialogContent>
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
