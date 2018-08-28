import React from 'react';

//change the logo file to upload your own Logo
import imgHeader from '../Images/logo.svg';

// change function request to add a real server to upload a photo
// instead of a mockup with timeout
export const request = (that,data) =>{
  let message;
  if (Math.random()<0.5){
      message = 'Photo was uploaded successfully';
  }
  else{
      message = 'Failed to upload. Please try again!';
  }
  setTimeout(()=>that.openDialog(message),1 * 1000);
}

// change the colours according to your needs
export const colours = {
    'color1':'#333',
    'color2':'#faa728'
}

export const Header = () =>(
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
