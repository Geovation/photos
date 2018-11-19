import React, { Component } from 'react';
import loadImage from 'blueimp-load-image';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Loading from './Loading';
import backButton from '../images/left-arrow.svg';
import config from '../custom/config';
import './PhotoPage.scss';

class PhotoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: '',
      open: false,
      opendialogtext: false,
      message: '',
      value: '',
      sending: false
    };;

    this.base64 = null;
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  openDialog = (message) => {
    this.setState({
      sending: false,
      open: true,
      message
    });
  }

  closeDialog = () => {
    this.setState({ open: false });
    if (this.state.message === 'Failed to upload. Please try again!') {
      this.loadImage();
    } else {
      this.closePage();
    }
  }

  openDialogText = () => {
    this.setState({ opendialogtext: true });
  }

  closeDialogText = () => {
    this.setState({ opendialogtext: false });
  }

  sendFile = async () => {
    let data = {}
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
        this.openDialog("Photo was uploaded successfully");
      } catch (e) {
        this.openDialog(e.message || e);
      }
    } else {
      this.openDialogText();
    }
  }

  closePage = () => {
    this.props.closePage();
  }

  loadImage = () => {
    loadImage(
      this.props.file, (img) =>{
        document.getElementById('picture').appendChild(img);
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
    this.loadImage();

    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'PhotoPage'
    });
  }

  render() {
    return (
      this.state.sending ?
        <Loading />
      :
        <div className='geovation-photos'>
          <div className='headline'>
            <Button onClick={this.closePage}>
              <img className='buttonback' src={backButton} alt=''/>
            </Button>
            <div>PhotoPage</div>
          </div>
          <div className='entertext'>
            Enter some text:
            <input type='text' className='inputtext' value={this.state.value} onChange={this.handleChange} />
          </div>
          <div className='picture' id='picture'></div>
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
          <Dialog
            open={this.state.opendialogtext}
            onClose={this.closeDialogText}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Please enter some text
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialogText} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}

export default PhotoPage;
