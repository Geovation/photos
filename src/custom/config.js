import React from 'react';

import authFirebase from './authFirebase'

//change the logo file to upload your own Logo
import imgHeader from '../images/logo.svg';
import LoginFirebase from "./components/LoginFirebase";
import dbFirebase from "./dbFirebase";
import AnonymousPage from "./components/AnonymousPage";
import SignedinPage from "./components/SignedinPage";
import ModeratorPage from "./components/ModeratorPage";

// change function request to add a real server to upload a photo
// instead of a mockup with timeout
const request = (that,data) =>{
  let message;
  if (Math.random()<0.5){
      message = 'Photo was uploaded successfully';
  }
  else{
      message = 'Failed to upload. Please try again!';
  }
  setTimeout(()=>that.openDialog(message),1 * 1000);
}

const Header = () =>(
  <div style={headerstyles.headline}>
    <div style={headerstyles.headtext}>GEOVATION</div>
    <img style={headerstyles.headphoto} src={imgHeader} alt='header'/>
  </div>
);

//style for Header
const headerstyles = {
  'headline':{
    display:'flex',
    flexDirection:'column',
    height:120,
    justifyContent:'center',
    alignItems:'center'
  },
  'headtext':{
    color:'white',
    fontFamily: 'OSGillSans ,sans-serif !important'
  },
  'headphoto':{
    height:80
  }
}

export default {
  Header,
  request,
  loginComponent: LoginFirebase,
  authModule: authFirebase,
  dbModule: dbFirebase,
  AnonymousPage: AnonymousPage,
  SignedinPage: SignedinPage,
  ModeratorPage: ModeratorPage,
}