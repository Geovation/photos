import React, { Component } from 'react';

import imgHeader from '../Images/logo.svg';
import menu from '../Images/menu.svg';
import camera from '../Images/camera.svg';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

class LandingPage extends Component {
  constructor(props){
      super(props);
      this.state={
        menuOpen:false,
        open:false
      }
  }

  componentDidMount(){
    const fileInput = document.getElementById('file-input');
     if (fileInput){
       fileInput.addEventListener('change', (e) => this.openFile(e));
     }
  }

  openFile = (e) =>{
    if(e.target.files[0]){
      this.props.openPhotoPage(e.target.files[0]);
    }
  }

  openMenu = () =>{
    this.setState(state => ({ open: !state.open }));
  }

  closeMenu = event => {
     if (this.anchorEl.contains(event.target)) {
       return;
     }
     this.setState({ open: false });
  };

  openPage1 = () =>{
    this.setState({open: false});
    this.props.openPage1();
  }

  openPage2 = () =>{
    this.setState({open: false});
    this.props.openPage2();
  }

  openPage3 = () =>{
    this.setState({open: false});
    this.props.openPage3();
  }

  render() {
    return (
      <div style={{display:'flex',flex:1,flexDirection:'column',height:'100vh'}}>
          <div style={{display:'flex',flex:1,flexDirection:'column',maxHeight:170,justifyContent:'center',backgroundColor:'#333'}}>
              <div style={{color:'white',alignSelf:'center',paddingTop:10,fontFamily: 'OSGillSans ,sans-serif !important'}}>GEOVATION</div>
              <img style={{display:'flex',flex:1,maxHeight:80,alignSelf:'center',paddingBottom:10}} src={imgHeader} alt="header"/>
              <div style={{display:'flex',flex:1,height:50,textAlign:'center',alignItems:'center',justifyContent:'flex-start',backgroundColor:'#faa728',paddingLeft:5}}>
                  <Button
                      onClick={this.openMenu}
                      style={{alignSelf:'center'}}
                      color="primary"
                      buttonRef={node => {
                         this.anchorEl = node;
                      }}
                      aria-owns={this.state.open ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                  >
                      <img style={{height:25}} src={menu} alt="menu"/>
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
          <div style={{display:'flex',flex:1,flexDirection:'column',backgroundColor:'#faa728'}}>
              <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'center',alignSelf:'center',backgroundColor:'#faa728'}}>
                    <input id="file-input" style={{opacity: 0,height:50,width:'50px',position:'absolute'}} type="file" accept="image/*"/>
                    <img style={{height:50}} src={camera} alt="camera"/>
              </div>
              <div style={{display:'flex',flex:1,flexDirection:'column',justifyContent:'center',backgroundColor:'#faa728'}}>
              </div>
          </div>
      </div>
    );
  }
}

export default LandingPage;
