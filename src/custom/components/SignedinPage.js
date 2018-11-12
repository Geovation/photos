import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import backButton from '../images/left-arrow.svg';
import './SignedinPage.scss';
import config from "../config";

class SignedinPage extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div className='geovation-signedinPage'>
        <div className='headline'>
          <Button onClick={this.closePage}>
            <img className='buttonback' src={backButton} alt=''/>
          </Button>
          <div className='headtext'>Signed in: {config.authModule.getCurrentUser().displayName}</div>
        </div>
      </div>
    );
  }
}

export default SignedinPage;
