import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import backButton from '../images/left-arrow.svg';
import './SignedinPage.scss';

class SignedinPage extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div className='geovation-page2'>
        <div className='headline'>
          <Button onClick={this.closePage}>
            <img className='buttonback' src={backButton} alt=''/>
          </Button>
          <div className='headtext'>Page 2</div>
        </div>
      </div>
    );
  }
}

export default SignedinPage;
