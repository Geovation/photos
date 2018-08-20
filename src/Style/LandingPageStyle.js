const styles = {
    'wrapper':{
      display:'flex',
      flex:1,
      flexDirection:'column',
      height:'100vh',
      backgroundColor:'#333'
    },
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
      display:'flex',
      height:80,
    },
    'appbar':{
      display:'flex',
      height:50,
      justifyContent:'flex-start',
      backgroundColor:'#faa728',
    },
    'buttonappbar':{
      height:25
    },
    'body':{
      display:'flex',
      flex:1,
      flexDirection:'column',
      backgroundColor:'#faa728'
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
      backgroundColor:'#333'
    },
    'buttonexternallink':{
      color:'#faa728'
    }
}

export default styles;
