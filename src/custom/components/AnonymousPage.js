import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import backButton from '../images/left-arrow.svg';
import './AnonymousPage.scss';

class AnonymousPage extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div className='geovation-page1'>
        <div className='headline'>
          <Button onClick={this.closePage}>
            <img className='buttonback' src={backButton} alt=''/>
          </Button>
          <div className='headtext'>Page for Anonymous </div>
        </div>
      </div>
    );
  }
}

export default AnonymousPage;
