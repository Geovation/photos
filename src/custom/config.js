import React from 'react';

import authFirebase from './authFirebase'

//change the logo file to upload your own Logo
import imgHeader from '../images/logo.svg';
import LoginFirebase from "./components/LoginFirebase";
import dbFirebase from "./dbFirebase";
import AnonymousPage from "./components/AnonymousPage";
import SignedinPage from "./components/SignedinPage";
import ModeratorPage from "../components/ModeratorPage";
import EverybodyPage from "./components/EverybodyPage";

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
  uploadPhoto: dbFirebase.uploadPhoto,
  loginComponent: LoginFirebase,
  authModule: authFirebase,
  dbModule: dbFirebase,
  AnonymousPage: AnonymousPage,
  SignedinPage: SignedinPage,
  ModeratorPage: ModeratorPage,
  EverybodyPage: EverybodyPage,
  MAX_IMAGE_SIZE: 2048,
  MAPBOX_TOKEN: "pk.eyJ1Ijoic2ViYXN0aWFub3ZpZGVnZW92YXRpb251ayIsImEiOiJjanA4ZWwwbTkxdDNxM2twZTgyMGdqOXB5In0.MrWFt3rABCo7n7MBbVRaNw"
}
