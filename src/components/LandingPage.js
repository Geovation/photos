import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import menu from '../images/menu.svg';
import camera from '../images/camera.svg';
import map from '../images/map.svg';
import CustomPhotoDialog from './CustomPhotoDialog';

import config from '../custom/config';
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

    window.gtag && window.gtag('event', 'page_view', {
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
        <Popper className='popper' open={this.state.menuOpen} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
             {...TransitionProps}
             id='menu-list-grow'
             style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.closeMenu}>
                  <MenuList>

                    {!this.props.isSignedIn &&  <Link to="/anonymous" style={{ textDecoration: 'none', display: 'block' }}><MenuItem>Page for anonymous</MenuItem></Link>}
                    {this.props.isSignedIn &&  <Link to="/signedin" style={{ textDecoration: 'none', display: 'block' }}><MenuItem>Page for {config.authModule.getCurrentUser().displayName}</MenuItem></Link>}
                    {config.authModule.isModerator() && <Link to="/moderator" style={{ textDecoration: 'none', display: 'block' }}><MenuItem>Page for Moderator</MenuItem></Link>}
                    <Link to="/everybody" style={{ textDecoration: 'none', display: 'block' }}><MenuItem>Page for everybody</MenuItem></Link>
                    {!this.props.isSignedIn && <MenuItem onClick={this.handleClickLoginLogout}>{"Sign In"}</MenuItem>}
                    {this.props.isSignedIn && <MenuItem onClick={this.handleClickLoginLogout}>{"Sign Out " + config.authModule.getCurrentUser().displayName}</MenuItem>}

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
            <Link to="/map" style={{ textDecoration: 'none', display: 'block' }}>
              <Button>
                <img className='imagemap' src={map} alt=''/>
              </Button>
            </Link>
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
