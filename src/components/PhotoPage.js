import React, { Component } from 'react';

import loadImage from 'blueimp-load-image';

import RootRef from '@material-ui/core/RootRef';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';

// import Loading from './Loading';
import config from '../custom/config';
import './PhotoPage.scss';

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: '',
      open: false,
      message: '',
      value: '',
      sending: false
    };

    this.base64 = null;
    this.dialogCloseCallback = null;
    this.domRefPicture = {};
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
      data.base64 = this.base64;
      if (text !== '') {
        data['text'] = text;
        if (location) {
          data['latitude'] = location.latitude;
          data['longitude'] = location.longitude;
        }
        this.setState({ sending: true });
        try {
          const res = await config.uploadPhoto(data);
          console.log(res);
          this.openDialog("Photo was uploaded successfully", this.goToRoot);

        } catch (e) {
          this.openDialog(e.message || e);
        }
      } else {
        this.openDialog("Please enter some text");
      }

    }
  }

  goToRoot() {
    this.props.history.push('/');
  }

  loadImage = () => {
    loadImage(
      this.props.file, (img) =>{
        // const picture = document.getElementById('picture');
        const picture = this.domRefPicture.current;

        while (picture.firstChild) {
          picture.removeChild(picture.firstChild);
        }

        picture.appendChild(img);
        const canvas = document.getElementsByTagName('canvas')[0];
        const width = canvas.width;
        const height = canvas.height;
        if(width<height){
          canvas.style.width = 'auto';
          canvas.style.maxHeight = '100%';
        }
        else {
          canvas.style.height = 'auto';
          canvas.style.maxWidth = '100%';
          canvas.style.maxHeight = '100%';
        }

        this.base64 = canvas.toDataURL("image/jpeg").split(",")[1];
      },
      {
        orientation: true,
        maxWidth: config.MAX_IMAGE_SIZE,
        maxHeight: config.MAX_IMAGE_SIZE
      }
    );
  }

  componentDidMount() {
    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'PhotoPage'
    });
  }

  componentDidUpdate = (nextProps) => {
    if (nextProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  render() {
    return (
       <div className='geovation-photos'>

          <div className='entertext'>
            Enter some text:
            <input type='text' className='inputtext' value={this.state.value} onChange={this.handleChange} />
          </div>

         <RootRef rootRef={this.domRefPicture}>
           <div className='picture'></div>
         </RootRef>

          <div className='buttonwrapper'>
            <Button className='sendbutton' onClick={this.sendFile}>
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
