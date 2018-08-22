import React, { Component } from 'react';

import imgHeader from '../Images/logo.svg';
import menu from '../Images/menu.svg';
import camera from '../Images/camera.svg';
import map from '../Images/map.svg';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import styles from '../Style/LandingPageStyle.js';

import CustomPhotoDialog from './CustomPhotoDialog';

class LandingPage extends Component {
  constructor(props){
      super(props);
      this.state = {
        menuOpen: false,
        open: false,
        photoDialog: false
      };
  }

  componentDidMount(){
    const fileInput = document.getElementById('file-input');
     if (fileInput) {
       fileInput.addEventListener('change', (e) => this.openFile(e));
     }
  }

  openFile = (e) => {
    if (e.target.files[0]) {
      this.props.openPhotoPage(e.target.files[0]);
    }
  }

  openMenu = () => {
    this.setState(state => ({ open: !state.open }));
  }

  closeMenu = event => {
     if (this.anchorEl.contains(event.target)) {
       return;
     }
     this.setState({ open: false });
  };

  openPage1 = () => {
    this.setState({ open: false });
    this.props.openPage1();
  }

  openPage2 = () => {
    this.setState({ open: false });
    this.props.openPage2();
  }

  openPage3 = () => {
    this.setState({ open: false });
    this.props.openPage3();
  }

  openMap = () => {
    this.props.openMap();
  }

  openCamera = () => {
    if (window.cordova) {
      this.setState({ photoDialog: true });
    }
  }

  handleClose = dialogSelectedValue => {
    this.setState({ photoDialog: false });
    if (dialogSelectedValue !== "CANCEL") {
      const Camera = navigator.camera;
      const srcType = dialogSelectedValue === "CAMERA" ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
      
      Camera.getPicture(imageUri => {
          this.props.openPhotoPage(imageUri);
        }, message => {
          console.log("Failed because: : ", message);
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: srcType,
          correctOrientation: true
        });
    }
  };

  setRedirect = () => {
    window.location = 'https://geovation.uk/';
  }

  render() {
    return (
      <div style={styles.wrapper}>
          <div style={styles.headline}>
              <div style={styles.headtext}>GEOVATION</div>
              <img style={styles.headphoto} src={imgHeader} alt="header"/>
              <div style={styles.appbar}>
                  <Button
                      onClick={this.openMenu}
                      style={this.buttonappbar}
                      color="primary"
                      buttonRef={node => {
                         this.anchorEl = node;
                      }}
                      aria-owns={this.state.open ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                  >
                      <img style={this.photoappbar} src={menu} alt="menu"/>
                  </Button>
              </div>
              <Popper open={this.state.open} anchorEl={this.anchorEl} transition disablePortal>
                 {({ TransitionProps, placement }) => (
                     <Grow
                       {...TransitionProps}
                       id="menu-list-grow"
                       style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                     >
                     <Paper>
                         <ClickAwayListener onClickAway={this.closeMenu}>
                             <MenuList>
                                 <MenuItem onClick={this.openPage1}>Page 1</MenuItem>
                                 <MenuItem onClick={this.openPage2}>Page 2</MenuItem>
                                 <MenuItem onClick={this.openPage3}>Page 3</MenuItem>
                             </MenuList>
                         </ClickAwayListener>
                     </Paper>
                     </Grow>
                 )}
              </Popper>
          </div>
          <div style={styles.body}>
              <div style={styles.camera}>
                  <Button onClick={this.openCamera} color="primary">
                      { !window.cordova ?
                          <input id="file-input" style={styles.inputcamera} type="file" accept="image/*"/>
                        : null
                      }
                      <img style={styles.imagecamera} src={camera} alt="camera"/>
                  </Button>
                  <CustomPhotoDialog
                    open={this.state.photoDialog}
                    onClose={this.handleClose}
                  />
              </div>
              <div style={styles.map}>
                    <Button onClick={this.openMap} color="primary">
                        <img style={styles.imagemap} src={map} alt="map"/>
                    </Button>
              </div>
              <div style={styles.wrapperexternallink}>
                <div style={styles.externallink}>
                   <Button
                      onClick={this.setRedirect}
                      style={styles.buttonexternallink}
                    >
                       External Link
                    </Button>
                </div>
              </div>
          </div>
      </div>
    );
  }
}

export default LandingPage;
