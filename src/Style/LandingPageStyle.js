import {colours} from '../Config/config.js'

const styles = {
    'wrapper':{
      display:'flex',
      flex:1,
      flexDirection:'column',
      height:'100vh',
      backgroundColor:colours.color1
    },
    'buttonappbar':{
      height:25
    },
    'body':{
      display:'flex',
      flex:1,
      flexDirection:'column',
      backgroundColor:colours.color2
    },
    'camera':{
      display:'flex',
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    'inputcamera':{
      height:50,
      width:'50px',
      cursor: 'pointer',

      opacity: 0,
      position:'absolute'
    },
    'imagecamera':{
      height:50,
      cursor: 'pointer'
    },
    'map':{
      display:'flex',
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    'imagemap':{
      height:50,
      cursor: 'pointer'
    },
    'externallink':{
      display:'flex',
      height:50,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:colours.color1
    },
    'buttonexternallink':{
      color:colours.color2,
      textTransform: 'none'
    },
    'appbar':{
      display:'flex',
      height:50,
      justifyContent:'flex-start',
      backgroundColor:colours.color2,
    },
}

export default styles;
