import {colours} from '../Config/config.js'

const styles = {
    'wrapper':{
      display:'flex',
      height:'100vh',
      flexDirection:'column',
      backgroundColor:colours.color1,
    },
    'headline':{
      display:'flex',
      flexDirection:'column',
      height:120,
      justifyContent:'center',
      alignItems:'center'
    },
    'headtext':{
      display:'flex',
      color:'white',
      fontFamily: 'OSGillSans ,sans-serif !important'
    },
    'headphoto':{
      display:'flex',
      height:80,
    },
    'body':{
      display:'flex',
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:colours.color2,
    },
    'progress':{
      color:colours.color1,
    }
}

export default styles;
