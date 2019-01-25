import React, { Component } from 'react';

import loadImage from 'blueimp-load-image';
import { gtagEvent } from '../gtag.js';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import config from '../custom/config';
import './PhotoPage.scss';
import dbFirebase from '../dbFirebase';
import { isIphoneWithNotchAndCordova } from '../utils'

const emptyState = {
  imgSrc: null,
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

  sendFile = async () => {
    gtagEvent('Upload', 'Photo');
    if (!this.props.location.online) {
      this.openDialog("Could not get the location yet. You won't be able to upload an image.");
    } else if (!this.props.online) {
      this.openDialog("Can't Connect to our servers. You won't be able to upload an image.");
    } else if (!this.state.imgSrc) {
      this.openDialog("No picture is selected. Please choose a picture.");
    } else {

      let data = {};
      const { location } = this.props;
      data.base64 = this.state.imgSrc.split(",")[1];

      if (this.state.field !== '') {
        data.field = this.state.field;
        if (location) {
          data.latitude = location.latitude;
          data.longitude = location.longitude;
        }
        this.setState({ sending: true });
        try {
          const res = await dbFirebase.uploadPhoto(data);
          console.log(res);
          this.openDialog("Photo was uploaded successfully. It will be reviewed by our moderation team.", this.handleClosePhotoPage);
        } catch (e) {
          this.openDialog(e.message || e);
        }
      } else {
        this.openDialog("Please enter some text");
      }

    }
  }

  loadImage = () => {
    loadImage(
      this.props.file, (img) =>{
        const imgSrc = img.toDataURL("image/jpeg");
        this.setState({imgSrc});
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
    this.changeStatusBarColorToDefault();
    this.handleClosePhotoPage();
  };

  changeStatusBarColorToDefault = () => {
    const palette = this.props.theme.palette;
    if(isIphoneWithNotchAndCordova() && palette.primary.main === palette.common.black){
      window.StatusBar.styleDefault();
    }
  }

  changeStatusBarColorToLight = () => {
    const palette = this.props.theme.palette;
    if(isIphoneWithNotchAndCordova() && palette.primary.main === palette.common.black){
      window.StatusBar.styleLightContent();
    }
  }

  componentDidMount() {
    this.changeStatusBarColorToLight();
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  render() {
    const { classes } = this.props;

    return (
       <div className='geovation-photos'>
         <AppBar position="static" className={classes.notchTop}>
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Photo Submission
            </Typography>
            <div className='close-icon'>
              <CloseIcon onClick={this.handleCloseButton}/>
            </div>
            </Toolbar>
          </AppBar>

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

          <div className={classes.notchBottom}/>

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

        </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PhotoPage);
