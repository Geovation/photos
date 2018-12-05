import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';
// import backButton from '../images/left-arrow.svg';
import './SignedinPage.scss';
import config from "../config";

class SignedinPage extends Component {

  render() {
    return (
      <div className='geovation-signedinPage'>
        <div className='headline'>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <Button>
              {/*<img className='buttonback' src={backButton} alt=''/>*/}
            </Button>
          </Link>
          <div className='headtext'>Signed in: {config.authModule.getCurrentUser().displayName}</div>
        </div>
      </div>
    );
  }
}

export default SignedinPage;
