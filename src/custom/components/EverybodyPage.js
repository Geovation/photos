import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import backButton from '../../images/left-arrow.svg';
import './EverybodyPage.scss';

class EverybodyPage extends Component {

  closePage =() => {
    this.props.closePage();
  }

  render() {
    return (
      <div className='geovation-everybodyPage '>
        <div className='headline'>
          <Button onClick={this.closePage}>
            <img className='buttonback' src={backButton} alt=''/>
          </Button>
          <div className='headtext'>Page for Everybody </div>
        </div>
      </div>
    );
  }
}

export default EverybodyPage;
