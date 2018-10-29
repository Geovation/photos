import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Header} from '../Config/config';
import styles from '../Style/LoadingStyle';

class Loading extends React.Component {

  render() {
    return (
      <div style={styles.wrapper}>
        <Header/>
        <div style={styles.body}>
          <CircularProgress style={styles.progress} size={50} thickness={6}/>
        </div>
      </div>
    );
  }
}

export default Loading;
