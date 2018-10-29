import {colours} from '../Config/config'

const styles = {
    'wrapper':{
      display:'flex',
      flexDirection:'column'
    },
    'headline':{
      display:'flex',
      height:50,
      backgroundColor:colours.color2,
      alignItems:'center'
    },
    'buttonwrapper':{
      display:'flex',
      flex:1
    },
    'buttonback':{
      height:25
    },
    'headtext':{
      display:'flex',
      flex:1,
      justifyContent:'center'
    },
    'headspace':{
      display:'flex',
      flex:1
    },
    'map':{
      width:'100%',
      height:'calc(100vh - 50px)'
    }
}

export default styles;
