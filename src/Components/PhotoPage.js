import React, { Component } from 'react';

import backButton from '../Images/left-arrow.svg';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import {request} from '../Config/config.js'

class PhotoPage extends Component {
  constructor(props){
      super(props)
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
  };

  closeDialog = () => {
     this.setState({ open: false });
     this.closePage()
  };

  openDialogText = () => {
     this.setState({ opendialogtext: true  });
  };

  closeDialogText = () => {
     this.setState({ opendialogtext: false });
  };

  sendFile = () =>{
      let data = {}
      const text =  this.state.value
      const file = this.props.file
      data['file'] = file
      if(text!==''){
          data['text'] = text
          if (navigator && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position)=>{
                  data['latitude'] = position.coords.latitude
                  data['longitude'] = position.coords.longitude
                  request(this,data)
              })
          }
          else{
            request(this,data)
          }
      }
      else{
        this.openDialogText()
      }
  }

  closePage =() => {
    this.props.closePage();
  }

  componentDidMount(){
       this.setState({
       imgSrc: URL.createObjectURL(this.props.file)
     })
  }

  render() {
    return (
          <div style={{display:'flex',flex:1,flexDirection:'column',height:'100vh',backgroundColor:'#333'}}>
              <div style={{display:'flex',flex:1,maxHeight:50,backgroundColor:'#faa728',alignItems:'center'}}>
                  <Button
                     onClick={this.closePage}
                     color="primary"
                     style={{color:'white'}}
                   >
                      <img style={{height:25}} src={backButton} alt="backButton"/>
                  </Button>
                  <div style={{display:'flex',flex:1}}>PhotoPage</div>
              </div>
              <div style={{display:'flex',flex:1,maxHeight:50,paddingLeft:5,color:'#faa728',alignItems:'center'}}>
                  <label>
                    Enter some text:
                    <input type="text" style={{marginLeft:'5px'}} value={this.state.value} onChange={this.handleChange} />
                  </label>
              </div>
              <div style={{display:'flex',flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <img style={{display:'flex',flex:1,width:'100%',height:400}}src={this.state.imgSrc} alt={'uploaded_photo'}/>
                  <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'flex-end',height:50,paddingBottom:5}}>
                  </div>
                      <Button
                         onClick={this.sendFile}
                         color="primary"
                         style={{color:'#333',backgroundColor:'#faa728'}}
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
