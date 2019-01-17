import React, { Component } from 'react';

import loadImage from 'blueimp-load-image';
import gtag from '../gtag.js';

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
    gtag('event', 'Upload', {
      'event_category' : 'Photo',
    });
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
          this.openDialog("Photo was uploaded successfully", this.handleClosePhotoPage);
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
    gtag('event', 'Retake Photo', {
      'event_category' : 'Photo',
    });
    this.resetState();
    this.props.handlePhotoClick();
  }

  handleClosePhotoPage = () => {
    this.resetState();
    this.props.handleClose(); // go to the map
  };

  handleCloseButton = () => {
    gtag('event', 'Postpone upload', {
      'event_category' : 'Photo',
    });
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
    const { classes } = this.props;

    return (
       <div className='geovation-photos'>
         <AppBar position="static">
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

          <div className='buttonwrapper'>
            <Button variant="outlined" fullWidth={true} onClick={this.retakePhoto}>
              Retake
            </Button>
          </div>

          <div className='buttonwrapper'>
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

        </div>
    );
  }
}

export default withStyles(styles)(PhotoPage);
