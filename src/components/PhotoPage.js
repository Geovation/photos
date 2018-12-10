import React, { Component } from 'react';

import loadImage from 'blueimp-load-image';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import imgHeader from '../images/logo.svg';


import config from '../custom/config';
import './PhotoPage.scss';
import dbFirebase from "../dbFirebase";

const emptyState = {
  imgSrc: imgHeader,
  open: false,
  message: '',
  value: '',
  sending: false,
};

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
    this.setState({ value: event.target.value });
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
    if (!this.props.location.online) {
      this.openDialog("Could not get the location yet. You won't be able to upload an image.");
    } else if(!this.props.online){
      this.openDialog("Can't Connect to our servers. You won't be able to upload an image.");
    } else {

      let data = {};
      const text =  this.state.value;
      const { location } = this.props;
      data.base64 = this.state.imgSrc.split(",")[1];

      if (text !== '') {
        data['text'] = text;
        if (location) {
          data['latitude'] = location.latitude;
          data['longitude'] = location.longitude;
        }
        this.setState({ sending: true });
        try {
          const res = await dbFirebase.uploadPhoto(data);
          console.log(res);
          this.openDialog("Photo was uploaded successfully", this.resetState);

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

  componentDidMount() {
    this.loadImage();
    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'PhotoPage'
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  render() {
    return (
       <div className='geovation-photos'>

          <TextField
            id="standard-name"
            label="Enter some text"
            style={{width: 200, marginLeft:5}}
            value={this.state.value}
            onChange={this.handleChange}
            margin="dense"
          />

          <div className='picture'>
           <img src={this.state.imgSrc} alt={""}/>
          </div>

          <div className='buttonwrapper'>
            <Button variant="outlined" color="primary" onClick={this.sendFile}>
              Send Photo
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
              <Button onClick={this.closeDialog} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.state.sending}>
            <DialogContent>
              <DialogContentText id="loading-dialog-text">
                Be patient ;)
              </DialogContentText>
              <CircularProgress className="progress" size={50} thickness={6}/>
            </DialogContent>
          </Dialog>

        </div>
    );
  }
}

export default PhotoPage;
