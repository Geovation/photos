import {colours} from '../Config/config'

const styles = {
    'wrapper':{
      display:'flex',
      flex:1,
      flexDirection:'column',
      height:'100vh',
      backgroundColor:colours.color1
    },
    'headline':{
      display:'flex',
      height:50,
      backgroundColor:colours.color2,
      alignItems:'center',
    },
    'buttonback':{
      height:25
    },
    'entertext':{
      display:'flex',
      height:30,
      paddingLeft:5,
      color:colours.color2,
      alignItems:'center'
    },
    'inputtext':{
      marginLeft:'5px',
      border: '1px solid black'
    },
    'picture':{
      display:'flex',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column',
      backgroundColor:colours.color1
    },
    'buttonwrapper':{
      display:'flex',
      height:50,
      backgroundColor:colours.color1,
      alignItems:'center',
      justifyContent:'center',
    },
    'sendbutton':{
      color:colours.color1,
      backgroundColor:colours.color2,
    }
}

export default styles;
