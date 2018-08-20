import React, { Component } from 'react';

import loadImage from 'blueimp-load-image';

import backButton from '../Images/left-arrow.svg';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import styles from '../Style/PhotoPageStyle.js';
import {request} from '../Config/config.js';

class PhotoPage extends Component {
  constructor(props){
      super(props);
      this.state={
        imgSrc:'',
        open:false,
        opendialogtext:false,
        message : '',
        value:''
      }
  }

  handleChange = (event)=>{
      this.setState({value: event.target.value});
  }

  openDialog = (message) => {
     this.setState({ open: true ,message });
  }

  closeDialog = () => {
     this.setState({ open: false });
     this.closePage();
  }

  openDialogText = () => {
     this.setState({ opendialogtext: true  });
  }

  closeDialogText = () => {
     this.setState({ opendialogtext: false });
  }

  sendFile = () =>{
      let data = {}
      const text =  this.state.value;
      const file = this.props.file;
      data['file'] = file;
      if(text!==''){
          data['text'] = text;
          if (navigator && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position)=>{
                  data['latitude'] = position.coords.latitude;
                  data['longitude'] = position.coords.longitude;
                  request(this,data);
              })
          }
          else{
            request(this,data);
          }
      }
      else{
        this.openDialogText();
      }
  }

  closePage =() => {
    this.props.closePage();
  }

  componentDidMount(){
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
         }
       },
      {orientation:true}
     )
  }

  render() {
    return (
          <div style={styles.wrapper}>
              <div style={styles.headline}>
                  <Button
                     onClick={this.closePage}
                     color="primary"
                   >
                      <img style={styles.buttonback} src={backButton} alt="backButton"/>
                  </Button>
                  <div>PhotoPage</div>
              </div>
              <div style={styles.entertext}>
                  <label>
                    Enter some text:
                    <input type="text" style={styles.inputtext} value={this.state.value} onChange={this.handleChange} />
                  </label>
              </div>
              <div style={styles.picture} id='picture'></div>
              <div style={styles.sendwrapper}>
                <Button
                   onClick={this.sendFile}
                   style={styles.sendbutton}
                 >
                    Send Photo
                </Button>
              </div>
              <Dialog
                  open={this.state.open}
                  onClose={this.closeDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialog} color="primary">
                      Ok
                    </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                  open={this.state.opendialogtext}
                  onClose={this.closeDialogText}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please enter some text
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialogText} color="primary">
                      Ok
                    </Button>
                </DialogActions>
              </Dialog>
          </div>
    );
  }
}

export default PhotoPage;
