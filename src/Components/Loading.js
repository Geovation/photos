import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Header} from '../services/config';
import './Loading.scss';

class Loading extends React.Component {

  render() {
    return (
      <div className='geovation-loading'>
        <Header/>
        <div className='body'>
          <CircularProgress className='progress' size={50} thickness={6}/>
        </div>
      </div>
    );
  }
}

export default Loading;
