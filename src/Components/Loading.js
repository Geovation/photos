import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../Style/LoadingStyle.js';

import imgHeader from '../Images/logo.svg';

class Loading extends React.Component {

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.headline}>
            <div style={styles.headtext}>GEOVATION</div>
            <img style={styles.headphoto} src={imgHeader} alt="header"/>
        </div>
        <div style={styles.body}>
          <CircularProgress style={styles.progress} size={50} thickness={6}/>
        </div>
      </div>
    );
  }
}

export default Loading;
