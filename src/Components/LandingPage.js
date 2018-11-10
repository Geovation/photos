import React, { Component } from 'react';
import menu from '../images/menu.svg';
import camera from '../images/camera.svg';
import map from '../images/map.svg';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CustomPhotoDialog from './CustomPhotoDialog';

import config from '../services/config';
import './LandingPage.scss';
import Login from './Login';

class LandingPage extends Component {

  constructor(props){
    super(props);
    this.state = {
      menuOpen: false,
      photoDialog: false,
      loginLogoutDialogOpen: false
    };
  }

  componentDidMount(){
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.openFile(e));
    }

    window.gtag('event', 'page_view', {
      'event_category': 'view',
      'event_label': 'LandingPage'
    });
  }

  openFile = (e) => {
    if (e.target.files[0]) {
      this.props.openPhotoPage(e.target.files[0]);
    }
  }

  handleMenuClick = () => {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  closeMenu = event => {
     if (this.anchorEl.contains(event.target)) {
       return;
     }
     this.setState({ menuOpen: false });
  };

  openPage1 = () => {
    this.setState({ menuOpen: false });
    this.props.openPage1();
  }

  openPage2 = () => {
    this.setState({ menuOpen: false });
    this.props.openPage2();
  }

  openPage3 = () => {
    this.setState({ menuOpen: false });
    this.props.openPage3();
  }

  handleClickLoginLogout = () => {
    let loginLogoutDialogOpen = true;

    if (this.props.isSignedIn) {
      config.authModule.signOut();
      loginLogoutDialogOpen = false;
    }

    this.setState({
      menuOpen: false,
      loginLogoutDialogOpen
    });
  };

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
    if (dialogSelectedValue) {
      const Camera = navigator.camera;
      const srcType = dialogSelectedValue === 'CAMERA' ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;

      Camera.getPicture(imageUri => {
          this.props.openPhotoPage(imageUri);
        }, message => {
          console.log('Failed because: ', message);
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
  };

  handleLoginClose = () => {
    this.setState({ loginLogoutDialogOpen:false});
  };


  render() {
    const Header = config.Header;
    return (
      <div className='geovation-landingPage'>
        <Header/>
        <div className='appbar'>
          <Button
            onClick={this.handleMenuClick}
            buttonRef={node => {
               this.anchorEl = node;
            }}
            aria-owns={this.state.open ? 'menu-list-grow' : null}
            aria-haspopup='true'
          >
            <img src={menu} alt=''/>
          </Button>
        </div>
        <Popper open={this.state.menuOpen} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
             {...TransitionProps}
             id='menu-list-grow'
             style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.closeMenu}>
                  <MenuList>
                    <MenuItem onClick={this.openPage1}>Page 1</MenuItem>
                    <MenuItem onClick={this.openPage2}>Page 2</MenuItem>
                    <MenuItem onClick={this.openPage3}>Page 3</MenuItem>
                    <MenuItem onClick={this.handleClickLoginLogout}>{this.props.isSignedIn ? "Sign Out " + config.authModule.getCurrentUser().displayName : "Sign In"}</MenuItem>
                    {this.props.isSignedIn && config.authModule.getCurrentUser().isModerator ?
                    <MenuItem onClick={this.openPage1}>{"Moderator"}</MenuItem> : null}

                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <div className='body'>
          <div className='camera'>
            <Button onClick={this.openCamera}>
              { !window.cordova ?
                  <input id='file-input' className='inputcamera' type='file' accept='image/*'/>
                : null
              }
              <img className='imagecamera' src={camera} alt=''/>
            </Button>
            <CustomPhotoDialog open={this.state.photoDialog} onClose={this.handleClose}/>
          </div>
          <div className='map'>
            <Button onClick={this.openMap}>
              <img className='imagemap' src={map} alt=''/>
            </Button>
          </div>
        </div>
        <div className='externallink'>
          <Button onClick={this.setRedirect} className='buttonexternallink'>
            External Link
          </Button>
        </div>

        <Login
          open={this.state.loginLogoutDialogOpen && this.props.isSignedIn !== undefined && !this.state.isSignedIn}
          handleClose={this.handleLoginClose}
          loginComponent={config.loginComponent}
        />

      </div>


    );
  }
}

export default LandingPage;
